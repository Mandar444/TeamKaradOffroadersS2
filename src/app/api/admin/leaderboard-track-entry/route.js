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
import {
  cleanStoredLeaderboardSnapshot,
  preserveMissingLeaderboardCategories,
} from "@/lib/leaderboard-category-preserver";
import {
  buildLeaderboardSnapshotFromTrackEntry,
  deleteLeaderboardTrackEntry,
} from "@/lib/leaderboard-track-entry";

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

const getStorageMode = () => {
  if (hasSheetsConfig()) {
    return "google-sheets";
  }

  if (hasDriveConfig()) {
    return "google-drive";
  }

  if (IS_VERCEL) {
    return "temporary-vercel-fallback";
  }

  return "local-files";
};

const createEmptySnapshot = () => ({
  generatedAt: null,
  source: "admin-track-entry-reset",
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
    console.warn("[LEADERBOARD TRACK ENTRY] Local snapshot cache failed:", error?.message || error);
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
        console.warn("[LEADERBOARD TRACK ENTRY] Snapshot storage read failed:", error?.message || error);
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

async function persistSnapshot(snapshot) {
  const cachedLocally = await trySaveLocalSnapshot(snapshot);
  let file = null;

  if (hasSheetsConfig()) {
    try {
      file = await writeLeaderboardSnapshotToSheets(snapshot);
    } catch (sheetsError) {
      if (IS_VERCEL) {
        return {
          ok: false,
          response: NextResponse.json(
            {
              ok: false,
              error: "Unable to persist track data to Google Sheets.",
              detail: sheetsError?.message || null,
              cachedLocally,
            },
            { status: 500 }
          ),
        };
      }

      throw sheetsError;
    }
  } else if (hasDriveConfig()) {
    try {
      file = await upsertJsonToDrive(LEADERBOARD_FILE_NAME, JSON.stringify(snapshot, null, 2));
    } catch (driveError) {
      if (IS_VERCEL) {
        return {
          ok: false,
          response: NextResponse.json(
            {
              ok: false,
              error: "Unable to persist track data to Google Drive.",
              detail: driveError?.message || null,
              cachedLocally,
            },
            { status: 500 }
          ),
        };
      }

      throw driveError;
    }
  } else if (!cachedLocally) {
    throw new Error("Unable to save leaderboard snapshot locally.");
  }

  return { ok: true, cachedLocally, file };
}

export async function POST(request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const entry = body?.entry || body || {};

    if (IS_VERCEL && !hasSheetsConfig() && !hasDriveConfig()) {
      return NextResponse.json(
        {
          ok: false,
          error: "Persistent Google Sheets or Google Drive storage is required on Vercel to preserve leaderboard track data.",
          detail: "Configure GOOGLE_SHEET_ID, GOOGLE_CLIENT_EMAIL, and GOOGLE_PRIVATE_KEY.",
          storageMode: getStorageMode(),
        },
        { status: 500 }
      );
    }

    const existingSnapshot = await readSharedSnapshot({ optional: true });
    const resetMarker = await getResetMarker(existingSnapshot);
    const currentExistingSnapshot = getCurrentSnapshot(existingSnapshot, resetMarker);
    const mergedSnapshot = buildLeaderboardSnapshotFromTrackEntry(currentExistingSnapshot, entry);
    const snapshot = applyLeaderboardResetMarker(await preserveLeaderboardVisibility(mergedSnapshot), resetMarker);
    const latestSnapshot = await readSharedSnapshot({ optional: true });
    const latestResetMarker = await getResetMarker(latestSnapshot);

    if (!isSameLeaderboardResetMarker(resetMarker, latestResetMarker)) {
      return NextResponse.json(
        {
          ok: false,
          stale: true,
          error: "Leaderboard was reset while track data was being saved. Submit the entry again.",
        },
        { status: 409 }
      );
    }

    const persistence = await persistSnapshot(snapshot);

    if (!persistence.ok) {
      return persistence.response;
    }

    const category = snapshot.leaderboard?.categories?.find(item => item.key === snapshot.focusCategory);

    return NextResponse.json({
      ok: true,
      categoryKey: snapshot.focusCategory,
      categoryLabel: category?.label || "",
      rows: category?.rows?.length || 0,
      results: snapshot.results?.length || 0,
      savedTo: persistence.file?.webViewLink || "/leaderboard-export.json",
      generatedAt: snapshot.generatedAt,
      cachedLocally: persistence.cachedLocally,
      database: getStorageMode(),
      persistedToDatabase: Boolean(persistence.file?.id),
      persistedToSheets: hasSheetsConfig() && Boolean(persistence.file?.id),
      persistedToDrive: !hasSheetsConfig() && Boolean(persistence.file?.id),
      storageMode: getStorageMode(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Unable to save track data.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const target = body?.target || body || {};

    if (IS_VERCEL && !hasSheetsConfig() && !hasDriveConfig()) {
      return NextResponse.json(
        {
          ok: false,
          error: "Persistent Google Sheets or Google Drive storage is required on Vercel to preserve leaderboard track data.",
          detail: "Configure GOOGLE_SHEET_ID, GOOGLE_CLIENT_EMAIL, and GOOGLE_PRIVATE_KEY.",
          storageMode: getStorageMode(),
        },
        { status: 500 }
      );
    }

    const existingSnapshot = await readSharedSnapshot({ optional: true });
    const resetMarker = await getResetMarker(existingSnapshot);
    const currentExistingSnapshot = getCurrentSnapshot(existingSnapshot, resetMarker);
    const deletedSnapshot = deleteLeaderboardTrackEntry(currentExistingSnapshot, target);
    const snapshot = applyLeaderboardResetMarker(await preserveLeaderboardVisibility(deletedSnapshot), resetMarker);
    const latestSnapshot = await readSharedSnapshot({ optional: true });
    const latestResetMarker = await getResetMarker(latestSnapshot);

    if (!isSameLeaderboardResetMarker(resetMarker, latestResetMarker)) {
      return NextResponse.json(
        {
          ok: false,
          stale: true,
          error: "Leaderboard was reset while track data was being deleted. Refresh and try again.",
        },
        { status: 409 }
      );
    }

    const persistence = await persistSnapshot(snapshot);

    if (!persistence.ok) {
      return persistence.response;
    }

    const category = snapshot.leaderboard?.categories?.find(item => item.key === snapshot.focusCategory);

    return NextResponse.json({
      ok: true,
      categoryKey: snapshot.focusCategory,
      categoryLabel: category?.label || "",
      rows: category?.rows?.length || 0,
      results: snapshot.results?.length || 0,
      savedTo: persistence.file?.webViewLink || "/leaderboard-export.json",
      generatedAt: snapshot.generatedAt,
      cachedLocally: persistence.cachedLocally,
      database: getStorageMode(),
      persistedToDatabase: Boolean(persistence.file?.id),
      persistedToSheets: hasSheetsConfig() && Boolean(persistence.file?.id),
      persistedToDrive: !hasSheetsConfig() && Boolean(persistence.file?.id),
      storageMode: getStorageMode(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Unable to delete track data.",
      },
      { status: 500 }
    );
  }
}
