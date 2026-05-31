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
  isSameLeaderboardResetMarker,
  readLeaderboardResetMarker,
} from "@/lib/leaderboard-reset-store";
import { cleanStoredLeaderboardSnapshot } from "@/lib/leaderboard-category-preserver";

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
    console.warn("[LEADERBOARD JSON] Local snapshot cache failed:", error?.message || error);
    return false;
  }
}

async function readLocalSnapshot() {
  for (const filePath of [LOCAL_ROOT_EXPORT_FILE, LOCAL_EXPORT_FILE]) {
    try {
      return JSON.parse(await readFile(filePath, "utf8"));
    } catch (error) {
      if (error?.code !== "ENOENT") {
        throw error;
      }
    }
  }

  return null;
}

async function readSharedSnapshot() {
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
      return cleanStoredLeaderboardSnapshot(await attempt());
    } catch (error) {
      console.warn("[LEADERBOARD JSON] Snapshot storage read failed:", error?.message || error);
    }
  }

  return null;
}

async function getResetMarker(snapshot) {
  return hasDriveConfig() && !hasSheetsConfig()
    ? readLeaderboardResetMarkerFromDrive()
    : readLeaderboardResetMarker(snapshot);
}

async function readUploadPayload(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");

    return file && typeof file.text === "function" ? JSON.parse(await file.text()) : null;
  }

  return request.json();
}

const unwrapSnapshot = payload => {
  if (payload?.snapshot && typeof payload.snapshot === "object" && !Array.isArray(payload.snapshot)) {
    return payload.snapshot;
  }

  return payload;
};

const normalizeSnapshot = payload => {
  const source = unwrapSnapshot(payload);

  if (!source || typeof source !== "object" || Array.isArray(source)) {
    throw new Error("JSON file must contain a leaderboard snapshot object.");
  }

  const categories = Array.isArray(source?.leaderboard?.categories)
    ? source.leaderboard.categories
    : Array.isArray(source?.categories)
      ? source.categories
      : [];

  if (!Array.isArray(source.teams) || !Array.isArray(source.results) || !categories.length) {
    throw new Error("JSON file does not contain full leaderboard teams, results, and categories.");
  }

  const snapshot = { ...source };

  for (const statusKey of ["ok", "success", "usable", "available", "syncAvailable", "acceptsPost", "canSync"]) {
    delete snapshot[statusKey];
  }

  return {
    ...snapshot,
    schemaVersion: snapshot.schemaVersion || 1,
    teams: source.teams,
    results: source.results,
    disputes: Array.isArray(source.disputes) ? source.disputes : [],
    categoryOptions: Array.isArray(source.categoryOptions) ? source.categoryOptions : [],
    leaderboard: {
      ...(source.leaderboard || {}),
      categories,
    },
  };
};

async function persistSnapshot(snapshot) {
  const warnings = [];
  const cachedLocally = await trySaveLocalSnapshot(snapshot);
  let sheetsFile = null;
  let driveFile = null;

  if (hasSheetsConfig()) {
    try {
      sheetsFile = await writeLeaderboardSnapshotToSheets(snapshot);
    } catch (error) {
      warnings.push(`Google Sheets save failed: ${error?.message || error}`);
    }
  }

  if (hasDriveConfig()) {
    try {
      driveFile = await upsertJsonToDrive(LEADERBOARD_FILE_NAME, JSON.stringify(snapshot, null, 2));
    } catch (error) {
      warnings.push(`Google Drive save failed: ${error?.message || error}`);
    }
  }

  if (!cachedLocally && !sheetsFile?.id && !driveFile?.id) {
    throw new Error(warnings.join(" | ") || "Unable to save leaderboard snapshot.");
  }

  return {
    cachedLocally,
    file: sheetsFile || driveFile,
    persistedToSheets: Boolean(sheetsFile?.id),
    persistedToDrive: Boolean(driveFile?.id),
    warnings,
  };
}

export async function POST(request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (IS_VERCEL && !hasSheetsConfig() && !hasDriveConfig()) {
      return NextResponse.json(
        {
          ok: false,
          error: "Persistent Google Sheets or Google Drive storage is required on Vercel to restore leaderboard JSON.",
          detail: "Configure GOOGLE_SHEET_ID, GOOGLE_CLIENT_EMAIL, and GOOGLE_PRIVATE_KEY.",
          storageMode: getStorageMode(),
        },
        { status: 500 }
      );
    }

    const uploadSnapshot = normalizeSnapshot(await readUploadPayload(request));
    const existingSnapshot = await readSharedSnapshot();
    const resetMarker = await getResetMarker(existingSnapshot);
    const restoredSnapshot = {
      ...uploadSnapshot,
      generatedAt: new Date().toISOString(),
      restoredFromGeneratedAt: uploadSnapshot.generatedAt || null,
      source: "admin-json-restore",
    };
    const snapshot = applyLeaderboardResetMarker(
      await preserveLeaderboardVisibility(restoredSnapshot),
      resetMarker
    );
    const latestSnapshot = await readSharedSnapshot();
    const latestResetMarker = await getResetMarker(latestSnapshot);

    if (!isSameLeaderboardResetMarker(resetMarker, latestResetMarker)) {
      return NextResponse.json(
        {
          ok: false,
          stale: true,
          error: "Leaderboard was reset while JSON restore was in progress. Upload the JSON file again.",
        },
        { status: 409 }
      );
    }

    const persistence = await persistSnapshot(snapshot);
    const categories = snapshot.leaderboard.categories;
    const rows = categories.reduce((total, category) => total + (category?.rows?.length || 0), 0);

    return NextResponse.json({
      ok: true,
      categories: categories.length,
      rows,
      teams: snapshot.teams.length,
      results: snapshot.results.length,
      savedTo: persistence.file?.webViewLink || "/leaderboard-export.json",
      generatedAt: snapshot.generatedAt,
      database: getStorageMode(),
      ...persistence,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Unable to restore leaderboard JSON.",
      },
      { status: 500 }
    );
  }
}
