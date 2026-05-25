import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import { cookies } from "next/headers";
import path from "path";
import {
  readJsonFromDrive,
  upsertJsonToDrive,
} from "@/lib/google-drive/client";
import {
  preserveLeaderboardVisibility,
  readLeaderboardVisibility,
} from "@/lib/leaderboard-visibility-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, X-API-Key, Accept, Origin",
  "Access-Control-Max-Age": "86400",
  "Cache-Control": "no-store",
};

const LOCAL_EXPORT_DIR = path.join(process.cwd(), "public", "data");
const LOCAL_EXPORT_FILE = path.join(LOCAL_EXPORT_DIR, "leaderboard-export.json");
const LOCAL_ROOT_EXPORT_FILE = path.join(process.cwd(), "public", "leaderboard-export.json");
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
  await mkdir(LOCAL_EXPORT_DIR, { recursive: true });
  const payload = JSON.stringify(snapshot, null, 2);
  await writeFile(LOCAL_EXPORT_FILE, payload, "utf8");
  await writeFile(LOCAL_ROOT_EXPORT_FILE, payload, "utf8");
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
  for (const filePath of [LOCAL_ROOT_EXPORT_FILE, LOCAL_EXPORT_FILE]) {
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

export async function POST(request) {
  try {
    const incomingSnapshot = await readOptionalJsonBody(request);

    if (incomingSnapshot === null || isEmptyObject(incomingSnapshot)) {
      return createUsableResponse({ skipped: true });
    }

    if (!incomingSnapshot || typeof incomingSnapshot !== "object" || Array.isArray(incomingSnapshot)) {
      return NextResponse.json(
        { ok: false, error: "Invalid leaderboard payload" },
        { status: 400, headers: corsHeaders }
      );
    }

    const snapshot = await preserveLeaderboardVisibility(incomingSnapshot);
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
    } else if (IS_VERCEL) {
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
      return NextResponse.json(
        {
          ok: false,
          closed: true,
          error: "Live leaderboard is closed",
        },
        { status: 403, headers: corsHeaders }
      );
    }
  }

  try {
    const snapshot = hasDriveConfig()
      ? await readJsonFromDrive(LEADERBOARD_FILE_NAME)
      : await readLocalSnapshot();

    return NextResponse.json(withEndpointStatus(snapshot), {
      headers: corsHeaders,
    });
  } catch (error) {
    try {
      const snapshot = await readLocalSnapshot();
      return NextResponse.json(withEndpointStatus(snapshot), {
        headers: corsHeaders,
      });
    } catch (localError) {
      return NextResponse.json(
        {
          ok: false,
          error: localError?.message || error?.message || "Leaderboard export file not found",
        },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }
  }
}

export async function DELETE() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  try {
    const snapshot = await preserveLeaderboardVisibility(createEmptySnapshot());
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
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export function HEAD() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
