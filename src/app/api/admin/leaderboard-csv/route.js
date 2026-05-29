import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import { cookies } from "next/headers";
import path from "path";
import {
  buildLeaderboardSnapshotFromCsv,
  LEADERBOARD_CSV_CATEGORIES,
  mergeLeaderboardCategorySnapshot,
} from "@/lib/leaderboard-csv";
import {
  readJsonFromDrive,
  readLeaderboardResetMarkerFromDrive,
  upsertJsonToDrive,
} from "@/lib/google-drive/client";
import { preserveLeaderboardVisibility } from "@/lib/leaderboard-visibility-store";
import {
  applyLeaderboardResetMarker,
  isLeaderboardSnapshotCurrent,
  isSameLeaderboardResetMarker,
  readLeaderboardResetMarker,
} from "@/lib/leaderboard-reset-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOCAL_EXPORT_DIR = path.join(process.cwd(), "public", "data");
const LOCAL_EXPORT_FILE = path.join(LOCAL_EXPORT_DIR, "leaderboard-export.json");
const LOCAL_ROOT_EXPORT_FILE = path.join(process.cwd(), "public", "leaderboard-export.json");
const LEADERBOARD_FILE_NAME = process.env.GOOGLE_LEADERBOARD_FILE_NAME || "leaderboard-export.json";
const IS_VERCEL = process.env.VERCEL === "1";

const hasDriveConfig = () =>
  Boolean(process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY);

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
  return hasDriveConfig()
    ? readLeaderboardResetMarkerFromDrive()
    : readLeaderboardResetMarker(snapshot);
}

const getCurrentSnapshot = (snapshot, resetMarker) =>
  isLeaderboardSnapshotCurrent(snapshot, resetMarker)
    ? snapshot
    : applyLeaderboardResetMarker(createEmptySnapshot(), resetMarker);

async function readUploadPayload(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");

    return {
      categoryKey: String(formData.get("categoryKey") || formData.get("category") || ""),
      csvText: file && typeof file.text === "function" ? await file.text() : "",
    };
  }

  if (contentType.includes("application/json")) {
    const body = await request.json();
    return {
      categoryKey: String(body?.categoryKey || body?.category || ""),
      csvText: String(body?.csv || body?.csvText || ""),
    };
  }

  return {
    categoryKey: request.nextUrl.searchParams.get("categoryKey") || "",
    csvText: await request.text(),
  };
}

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
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
    const { categoryKey, csvText } = await readUploadPayload(request);

    if (!csvText.trim()) {
      return NextResponse.json(
        { ok: false, error: "CSV file is empty or missing." },
        { status: 400 }
      );
    }

    const existingSnapshot = hasDriveConfig()
      ? await readJsonFromDrive(LEADERBOARD_FILE_NAME)
      : await readLocalSnapshot();
    const resetMarker = await getResetMarker(existingSnapshot);
    const currentExistingSnapshot = getCurrentSnapshot(existingSnapshot, resetMarker);
    const categorySnapshot = buildLeaderboardSnapshotFromCsv(csvText, categoryKey);
    const mergedSnapshot = mergeLeaderboardCategorySnapshot(currentExistingSnapshot, categorySnapshot);
    const snapshot = applyLeaderboardResetMarker(await preserveLeaderboardVisibility(mergedSnapshot), resetMarker);
    const latestSnapshot = hasDriveConfig()
      ? await readJsonFromDrive(LEADERBOARD_FILE_NAME)
      : await readLocalSnapshot();
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

    if (hasDriveConfig()) {
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
    } else if (IS_VERCEL) {
      return NextResponse.json(
        {
          ok: false,
          error: "Google Drive credentials are required to persist CSV leaderboard data on Vercel.",
          cachedLocally,
        },
        { status: 500 }
      );
    } else if (!cachedLocally) {
      throw new Error("Unable to save CSV leaderboard snapshot locally.");
    }

    const importedCategory = categorySnapshot.leaderboard.categories[0];

    return NextResponse.json({
      ok: true,
      categoryKey: importedCategory?.key || categoryKey,
      categoryLabel: importedCategory?.label || "",
      rows: importedCategory?.rows?.length || 0,
      results: categorySnapshot.results.length,
      savedTo: file?.webViewLink || "/leaderboard-export.json",
      generatedAt: snapshot.generatedAt,
      cachedLocally,
      persistedToDrive: Boolean(file?.id),
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
