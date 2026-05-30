import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import { cookies } from "next/headers";
import path from "path";
import {
  buildFullLeaderboardCsvFromSnapshot,
  buildFullLeaderboardSnapshotFromCsv,
  buildLeaderboardSnapshotFromCsv,
  LEADERBOARD_CSV_CATEGORIES,
  mergeFullLeaderboardSnapshot,
  mergeLeaderboardCategorySnapshot,
} from "@/lib/leaderboard-csv";
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
import { preserveMissingLeaderboardCategories } from "@/lib/leaderboard-category-preserver";

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
  source: "csv-upload-reset",
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
    console.warn("[LEADERBOARD CSV] Local snapshot cache failed:", error?.message || error);
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

async function getResetMarker(snapshot) {
  return hasDriveConfig() && !hasSheetsConfig()
    ? readLeaderboardResetMarkerFromDrive()
    : readLeaderboardResetMarker(snapshot);
}

const getCurrentSnapshot = (snapshot, resetMarker) =>
  isLeaderboardSnapshotCurrent(snapshot, resetMarker)
    ? snapshot
    : applyLeaderboardResetMarker(createEmptySnapshot(), resetMarker);

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
      return preserveMissingLeaderboardCategories(snapshot, localSnapshot);
    } catch (error) {
      if (!optional) {
        console.warn("[LEADERBOARD CSV] Snapshot storage read failed:", error?.message || error);
      }
    }
  }

  if (optional) {
    return null;
  }

  throw new Error("Leaderboard export file not found");
}

async function readUploadPayload(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");

    return {
      categoryKey: String(formData.get("categoryKey") || formData.get("category") || ""),
      csvText: file && typeof file.text === "function" ? await file.text() : "",
      mode: String(formData.get("mode") || ""),
    };
  }

  if (contentType.includes("application/json")) {
    const body = await request.json();
    return {
      categoryKey: String(body?.categoryKey || body?.category || ""),
      csvText: String(body?.csv || body?.csvText || ""),
      mode: String(body?.mode || ""),
    };
  }

  return {
    categoryKey: request.nextUrl.searchParams.get("categoryKey") || "",
    csvText: await request.text(),
    mode: request.nextUrl.searchParams.get("mode") || "",
  };
}

export async function GET(request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const downloadMode = request.nextUrl.searchParams.get("download") || request.nextUrl.searchParams.get("mode") || "";

  if (downloadMode === "full" || downloadMode === "full-csv") {
    const snapshot = await readSharedSnapshot({ optional: true });
    const csv = buildFullLeaderboardCsvFromSnapshot(snapshot || createEmptySnapshot());
    const fileName = `live-leaderboard-full-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.json({
    ok: true,
    categories: LEADERBOARD_CSV_CATEGORIES,
  });
}

export async function POST(request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { categoryKey, csvText, mode } = await readUploadPayload(request);

    if (!csvText.trim()) {
      return NextResponse.json(
        { ok: false, error: "CSV file is empty or missing." },
        { status: 400 }
      );
    }

    if (IS_VERCEL && !hasSheetsConfig() && !hasDriveConfig()) {
      return NextResponse.json(
        {
          ok: false,
          error: "Persistent Google Sheets or Google Drive storage is required on Vercel to preserve multiple leaderboard categories.",
          detail: "Configure GOOGLE_SHEET_ID, GOOGLE_CLIENT_EMAIL, and GOOGLE_PRIVATE_KEY.",
          storageMode: getStorageMode(),
        },
        { status: 500 }
      );
    }

    const existingSnapshot = await readSharedSnapshot({ optional: true });
    const resetMarker = await getResetMarker(existingSnapshot);
    const currentExistingSnapshot = getCurrentSnapshot(existingSnapshot, resetMarker);
    const isFullUpload = mode === "full" || mode === "full-csv" || !categoryKey;
    const uploadSnapshot = isFullUpload
      ? buildFullLeaderboardSnapshotFromCsv(csvText)
      : buildLeaderboardSnapshotFromCsv(csvText, categoryKey);
    const mergedSnapshot = isFullUpload
      ? mergeFullLeaderboardSnapshot(currentExistingSnapshot, uploadSnapshot)
      : mergeLeaderboardCategorySnapshot(currentExistingSnapshot, uploadSnapshot);
    const snapshot = applyLeaderboardResetMarker(await preserveLeaderboardVisibility(mergedSnapshot), resetMarker);
    const latestSnapshot = await readSharedSnapshot({ optional: true });
    const latestResetMarker = await getResetMarker(latestSnapshot);

    if (!isSameLeaderboardResetMarker(resetMarker, latestResetMarker)) {
      return NextResponse.json(
        {
          ok: false,
          stale: true,
          error: "Leaderboard was reset while CSV upload was in progress. Upload the CSV again.",
        },
        { status: 409 }
      );
    }

    const cachedLocally = await trySaveLocalSnapshot(snapshot);
    let file = null;

    if (hasSheetsConfig()) {
      try {
        file = await writeLeaderboardSnapshotToSheets(snapshot);
      } catch (sheetsError) {
        if (IS_VERCEL) {
          return NextResponse.json(
            {
              ok: false,
              error: "Unable to persist CSV leaderboard data to Google Sheets.",
              detail: sheetsError?.message || null,
              cachedLocally,
            },
            { status: 500 }
          );
        }

        throw sheetsError;
      }
    } else if (hasDriveConfig()) {
      try {
        const payload = JSON.stringify(snapshot, null, 2);
        file = await upsertJsonToDrive(LEADERBOARD_FILE_NAME, payload);
      } catch (driveError) {
        if (IS_VERCEL) {
          return NextResponse.json(
            {
              ok: false,
              error: "Unable to persist CSV leaderboard data to Google Drive.",
              detail: driveError?.message || null,
              cachedLocally,
            },
            { status: 500 }
          );
        }

        throw driveError;
      }
    } else if (!cachedLocally) {
      throw new Error("Unable to save CSV leaderboard snapshot locally.");
    }

    const importedCategory = uploadSnapshot.leaderboard.categories[0];
    const importedRows = (uploadSnapshot.leaderboard.categories || []).reduce(
      (total, category) => total + (category?.rows?.length || 0),
      0
    );

    return NextResponse.json({
      ok: true,
      categoryKey: importedCategory?.key || categoryKey,
      categoryLabel: isFullUpload ? "Full leaderboard" : importedCategory?.label || "",
      rows: importedRows,
      results: uploadSnapshot.results.length,
      savedTo: file?.webViewLink || "/leaderboard-export.json",
      generatedAt: snapshot.generatedAt,
      cachedLocally,
      database: getStorageMode(),
      persistedToDatabase: Boolean(file?.id),
      persistedToSheets: hasSheetsConfig() && Boolean(file?.id),
      persistedToDrive: !hasSheetsConfig() && Boolean(file?.id),
      storageMode: getStorageMode(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Unable to import leaderboard CSV.",
      },
      { status: 500 }
    );
  }
}
