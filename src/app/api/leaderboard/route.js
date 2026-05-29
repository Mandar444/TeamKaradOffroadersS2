import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import { cookies } from "next/headers";
import os from "os";
import path from "path";
import {
  clearObsoleteLeaderboardDriveData,
  readJsonFromDrive,
  readLeaderboardResetMarkerFromDrive,
  upsertJsonToDrive,
} from "@/lib/google-drive/client";
import {
  preserveLeaderboardVisibility,
  readLeaderboardVisibility,
} from "@/lib/leaderboard-visibility-store";
import {
  applyLeaderboardResetMarker,
  createLeaderboardResetMarker,
  isLeaderboardSnapshotCurrent,
  isSameLeaderboardResetMarker,
  readLeaderboardResetMarker,
} from "@/lib/leaderboard-reset-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS, HEAD",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Expose-Headers": "X-Leaderboard-Sync-Available, X-Leaderboard-Accepts-Post",
  "X-Leaderboard-Sync-Available": "true",
  "X-Leaderboard-Accepts-Post": "true",
  "Access-Control-Max-Age": "86400",
  "Cache-Control": "no-store",
};

const LOCAL_EXPORT_DIR = path.join(process.cwd(), "public", "data");
const LOCAL_EXPORT_FILE = path.join(LOCAL_EXPORT_DIR, "leaderboard-export.json");
const LOCAL_ROOT_EXPORT_FILE = path.join(process.cwd(), "public", "leaderboard-export.json");
const FALLBACK_EXPORT_DIR = path.join(os.tmpdir(), "team-karad-offroaders");
const FALLBACK_EXPORT_FILE = path.join(FALLBACK_EXPORT_DIR, "leaderboard-export.json");
const LEADERBOARD_FILE_NAME = process.env.GOOGLE_LEADERBOARD_FILE_NAME || "leaderboard-export.json";
const IS_VERCEL = process.env.VERCEL === "1";

const hasDriveConfig = () =>
  Boolean(process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY);

const createEmptySnapshot = () => ({
  generatedAt: null,
  source: "tko-app-reset",
  schemaVersion: 1,
  teams: [],
  results: [],
  disputes: [],
  categoryOptions: [],
  leaderboard: {
    categories: [],
  },
});

async function isAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "true";
}

async function saveLocalSnapshot(snapshot) {
  const payload = JSON.stringify(snapshot, null, 2);
  const failures = [];

  for (const [dirPath, filePath] of [
    [LOCAL_EXPORT_DIR, LOCAL_EXPORT_FILE],
    [path.dirname(LOCAL_ROOT_EXPORT_FILE), LOCAL_ROOT_EXPORT_FILE],
    [FALLBACK_EXPORT_DIR, FALLBACK_EXPORT_FILE],
  ]) {
    try {
      await mkdir(dirPath, { recursive: true });
      await writeFile(filePath, payload, "utf8");
      failures.push(null);
    } catch (error) {
      failures.push(error?.message || String(error));
    }
  }

  if (failures.some(error => error === null)) {
    return true;
  }

  throw new Error(`Unable to save leaderboard snapshot locally: ${failures.join("; ")}`);
}

async function trySaveLocalSnapshot(snapshot) {
  try {
    await saveLocalSnapshot(snapshot);
    return true;
  } catch (error) {
    console.warn("[LEADERBOARD] Local snapshot cache failed:", error?.message || error);
    return false;
  }
}

async function readLocalSnapshot() {
  for (const filePath of [LOCAL_ROOT_EXPORT_FILE, LOCAL_EXPORT_FILE, FALLBACK_EXPORT_FILE]) {
    try {
      const raw = await readFile(filePath, "utf8");
      return JSON.parse(raw);
    } catch (error) {
      if (error?.code !== "ENOENT") {
        throw error;
      }
    }
  }

  throw new Error("Leaderboard export file not found locally");
}

async function readOptionalJsonBody(request) {
  const rawBody = await request.text();

  if (!rawBody.trim()) {
    return null;
  }

  return JSON.parse(rawBody);
}

const unwrapIncomingSnapshot = payload => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return payload;
  }

  for (const key of ["snapshot", "leaderboardSnapshot", "leaderboardExport", "export", "data", "payload"]) {
    const value = payload[key];

    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value;
    }
  }

  return payload;
};

const isEmptyObject = value =>
  value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0;

function createUsableResponse(extra = {}) {
  return NextResponse.json(
    {
      ok: true,
      usable: true,
      acceptsPost: true,
      ...extra,
    },
    { headers: corsHeaders }
  );
}

const withEndpointStatus = snapshot => ({
  ok: true,
  usable: true,
  acceptsPost: true,
  ...(snapshot || createEmptySnapshot()),
});

async function getResetMarker(snapshot) {
  return hasDriveConfig()
    ? readLeaderboardResetMarkerFromDrive()
    : readLeaderboardResetMarker(snapshot);
}

const getCurrentSnapshot = (snapshot, resetMarker) =>
  isLeaderboardSnapshotCurrent(snapshot, resetMarker)
    ? snapshot
    : applyLeaderboardResetMarker(createEmptySnapshot(), resetMarker);

export async function POST(request) {
  try {
    const incomingSnapshot = unwrapIncomingSnapshot(await readOptionalJsonBody(request));

    if (incomingSnapshot === null || isEmptyObject(incomingSnapshot)) {
      return createUsableResponse({ skipped: true });
    }

    if (!incomingSnapshot || typeof incomingSnapshot !== "object" || Array.isArray(incomingSnapshot)) {
      return NextResponse.json(
        { ok: false, error: "Invalid leaderboard payload" },
        { status: 400, headers: corsHeaders }
      );
    }

    const existingSnapshot = hasDriveConfig()
      ? await readJsonFromDrive(LEADERBOARD_FILE_NAME).catch(() => null)
      : await readLocalSnapshot().catch(() => null);
    const resetMarker = await getResetMarker(existingSnapshot);
    const snapshot = applyLeaderboardResetMarker(await preserveLeaderboardVisibility(incomingSnapshot), resetMarker);
    const latestSnapshot = hasDriveConfig()
      ? await readJsonFromDrive(LEADERBOARD_FILE_NAME).catch(() => null)
      : await readLocalSnapshot().catch(() => null);
    const latestResetMarker = await getResetMarker(latestSnapshot);

    if (!isSameLeaderboardResetMarker(resetMarker, latestResetMarker)) {
      return NextResponse.json(
        {
          ok: false,
          stale: true,
          error: "Leaderboard was reset while sync was in progress. Sync the latest data again.",
        },
        { status: 409, headers: corsHeaders }
      );
    }

    const cachedLocally = await trySaveLocalSnapshot(snapshot);
    let file = null;

    if (hasDriveConfig()) {
      try {
        const payload = JSON.stringify(snapshot, null, 2);
        file = await upsertJsonToDrive(LEADERBOARD_FILE_NAME, payload);
      } catch (driveError) {
        if (IS_VERCEL) {
          return NextResponse.json(
            {
              ok: false,
              error: "Unable to persist leaderboard data to Google Drive. Check Drive credentials and folder permissions.",
              detail: driveError?.message || null,
              cachedLocally,
            },
            { status: 500, headers: corsHeaders }
          );
        }

        throw driveError;
      }
    } else if (IS_VERCEL && !cachedLocally) {
      return NextResponse.json(
        {
          ok: false,
          error: "Google Drive credentials are required to persist leaderboard data on Vercel.",
          cachedLocally,
        },
        { status: 500, headers: corsHeaders }
      );
    } else if (!cachedLocally) {
      throw new Error("Unable to save leaderboard snapshot locally.");
    }

    return NextResponse.json(
      {
        ok: true,
        savedTo: file?.webViewLink || "/leaderboard-export.json",
        generatedAt: snapshot?.generatedAt || null,
        cachedLocally,
        persistedToDrive: Boolean(file?.id),
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Unable to sync leaderboard export",
        detail: error?.stack || null,
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function GET() {
  if (!(await isAdminSession())) {
    const visibility = await readLeaderboardVisibility().catch(() => ({ visible: false }));

    if (!visibility.visible) {
      return createUsableResponse({
        closed: true,
        publicVisible: false,
        message: "Sync endpoint is available. Public leaderboard display is closed.",
      });
    }
  }

  try {
    const snapshot = hasDriveConfig()
      ? await readJsonFromDrive(LEADERBOARD_FILE_NAME)
      : await readLocalSnapshot();
    const currentSnapshot = getCurrentSnapshot(snapshot, await getResetMarker(snapshot));

    return NextResponse.json(withEndpointStatus(currentSnapshot), {
      headers: corsHeaders,
    });
  } catch (error) {
    return createUsableResponse({
      skipped: true,
      missingSnapshot: true,
      error: error?.message || "Leaderboard export file not found",
    });
  }
}

export async function DELETE() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  try {
    const resetMarker = createLeaderboardResetMarker();
    const snapshot = applyLeaderboardResetMarker(await preserveLeaderboardVisibility(createEmptySnapshot()), resetMarker);
    const cachedLocally = await trySaveLocalSnapshot(snapshot);
    let file = null;
    let cleanup = null;

    if (hasDriveConfig()) {
      try {
        const payload = JSON.stringify(snapshot, null, 2);
        file = await upsertJsonToDrive(LEADERBOARD_FILE_NAME, payload, { resetMarker });
        try {
          cleanup = await clearObsoleteLeaderboardDriveData(file?.id);
        } catch (cleanupError) {
          console.warn("[LEADERBOARD] Drive cleanup failed:", cleanupError.message);
          cleanup = { error: cleanupError.message };
        }
      } catch (driveError) {
        if (IS_VERCEL) {
          return NextResponse.json(
            {
              ok: false,
              error: "Unable to persist leaderboard reset to Google Drive. Check Drive credentials and folder permissions.",
              detail: driveError?.message || null,
              cachedLocally,
            },
            { status: 500, headers: corsHeaders }
          );
        }

        throw driveError;
      }
    } else if (IS_VERCEL) {
      return NextResponse.json(
        {
          ok: false,
          error: "Google Drive credentials are required to reset leaderboard data on Vercel.",
          cachedLocally,
        },
        { status: 500, headers: corsHeaders }
      );
    } else if (!cachedLocally) {
      throw new Error("Unable to reset leaderboard snapshot locally.");
    }

    return NextResponse.json(
      {
        ok: true,
        reset: true,
        savedTo: file?.webViewLink || "/leaderboard-export.json",
        generatedAt: null,
        cachedLocally,
        persistedToDrive: Boolean(file?.id),
        cleanup,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Unable to reset leaderboard export",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json(
    {
      ok: true,
      usable: true,
      acceptsPost: true,
      method: "OPTIONS",
    },
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}

export function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
