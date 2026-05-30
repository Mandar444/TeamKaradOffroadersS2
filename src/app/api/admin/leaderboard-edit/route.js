import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import { cookies } from "next/headers";
import path from "path";
import {
  readJsonFromDrive,
  readLeaderboardResetMarkerFromDrive,
  upsertJsonToDrive,
} from "@/lib/google-drive/client";
import {
  hasLeaderboardSheetsConfig,
  readLeaderboardSnapshotFromSheets,
  writeLeaderboardSnapshotToSheets,
} from "@/lib/leaderboard-sheets-store";
import { preserveLeaderboardVisibility } from "@/lib/leaderboard-visibility-store";
import {
  applyLeaderboardResetMarker,
  isLeaderboardSnapshotCurrent,
  isSameLeaderboardResetMarker,
  readLeaderboardResetMarker,
} from "@/lib/leaderboard-reset-store";
import { updateLeaderboardTrackResult } from "@/lib/leaderboard-edit";
import {
  cleanStoredLeaderboardSnapshot,
  preserveMissingLeaderboardCategories,
} from "@/lib/leaderboard-category-preserver";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOCAL_EXPORT_DIR = path.join(process.cwd(), "public", "data");
const LOCAL_EXPORT_FILE = path.join(LOCAL_EXPORT_DIR, "leaderboard-export.json");
const LOCAL_ROOT_EXPORT_FILE = path.join(process.cwd(), "public", "leaderboard-export.json");
const LEADERBOARD_FILE_NAME = process.env.GOOGLE_LEADERBOARD_FILE_NAME || "leaderboard-export.json";
const IS_VERCEL = process.env.VERCEL === "1";

const hasDriveConfig = () =>
  Boolean(process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY);

const hasSheetsConfig = hasLeaderboardSheetsConfig;

const createEmptySnapshot = () => ({
  generatedAt: null,
  source: "admin-leaderboard-edit",
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
    console.warn("[LEADERBOARD EDIT] Local snapshot cache failed:", error?.message || error);
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

  return null;
}

async function readSharedSnapshot({ optional = false } = {}) {
  const attempts = [];

  if (hasSheetsConfig()) {
    attempts.push(() => readLeaderboardSnapshotFromSheets());
  }

  if (hasDriveConfig()) {
    attempts.push(() => readJsonFromDrive(LEADERBOARD_FILE_NAME));
  }

  attempts.push(() => readLocalSnapshot());

  for (const attempt of attempts) {
    try {
      const snapshot = await attempt();
      const localSnapshot = await readLocalSnapshot().catch(() => null);
      return cleanStoredLeaderboardSnapshot(preserveMissingLeaderboardCategories(snapshot, localSnapshot));
    } catch (error) {
      if (!optional) {
        console.warn("[LEADERBOARD EDIT] Snapshot storage read failed:", error?.message || error);
      }
    }
  }

  if (optional) {
    return null;
  }

  throw new Error("Leaderboard export file not found");
}

async function getResetMarker(snapshot) {
  return hasDriveConfig() && !hasSheetsConfig()
    ? readLeaderboardResetMarkerFromDrive()
    : readLeaderboardResetMarker(snapshot);
}

const getCurrentSnapshot = (snapshot, resetMarker) =>
  isLeaderboardSnapshotCurrent(snapshot, resetMarker)
    ? snapshot
    : applyLeaderboardResetMarker(createEmptySnapshot(), resetMarker);

const getStorageMode = () => {
  if (hasSheetsConfig()) {
    return "google-sheets";
  }

  if (hasDriveConfig()) {
    return "google-drive";
  }

  return IS_VERCEL ? "temporary-vercel-fallback" : "local-files";
};

export async function POST(request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const existingSnapshot = await readSharedSnapshot({ optional: true });
    const resetMarker = await getResetMarker(existingSnapshot);
    const currentSnapshot = getCurrentSnapshot(existingSnapshot, resetMarker);
    const editedSnapshot = updateLeaderboardTrackResult(currentSnapshot, body || {});
    const snapshot = applyLeaderboardResetMarker(await preserveLeaderboardVisibility(editedSnapshot), resetMarker);
    const latestSnapshot = await readSharedSnapshot({ optional: true });
    const latestResetMarker = await getResetMarker(latestSnapshot);

    if (!isSameLeaderboardResetMarker(resetMarker, latestResetMarker)) {
      return NextResponse.json(
        {
          ok: false,
          stale: true,
          error: "Leaderboard was reset while edit was in progress. Refresh and save again.",
        },
        { status: 409 }
      );
    }

    const cachedLocally = await trySaveLocalSnapshot(snapshot);
    let file = null;

    if (hasSheetsConfig()) {
      file = await writeLeaderboardSnapshotToSheets(snapshot);
    } else if (hasDriveConfig()) {
      file = await upsertJsonToDrive(LEADERBOARD_FILE_NAME, JSON.stringify(snapshot, null, 2));
    } else if (!cachedLocally) {
      throw new Error("Unable to save leaderboard edit locally.");
    }

    return NextResponse.json({
      ok: true,
      generatedAt: snapshot.generatedAt,
      savedTo: file?.webViewLink || "/leaderboard-export.json",
      cachedLocally,
      database: getStorageMode(),
      persistedToDatabase: Boolean(file?.id),
      persistedToSheets: hasSheetsConfig() && Boolean(file?.id),
      persistedToDrive: !hasSheetsConfig() && Boolean(file?.id),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Unable to update leaderboard result.",
      },
      { status: 500 }
    );
  }
}
