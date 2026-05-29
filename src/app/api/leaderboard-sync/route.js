import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import { cookies } from "next/headers";
import path from "path";
import {
  clearObsoleteLeaderboardDriveData,
  upsertJsonToDrive,
  readJsonFromDrive,
  readLeaderboardResetMarkerFromDrive,
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
  "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, X-API-Key, Accept, Origin",
  "Access-Control-Max-Age": "86400",
  "Cache-Control": "no-store",
};

const LEADERBOARD_FILE_NAME = process.env.GOOGLE_LEADERBOARD_FILE_NAME || "leaderboard-export.json";
const LOCAL_EXPORT_DIR = path.join(process.cwd(), "public", "data");
const LOCAL_EXPORT_FILE = path.join(LOCAL_EXPORT_DIR, "leaderboard-export.json");
const LOCAL_ROOT_EXPORT_FILE = path.join(process.cwd(), "public", "leaderboard-export.json");
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

const normalizeCategoryKey = value => {
  const normalized = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (normalized === "OPEN" || normalized === "OPEN_CATEGORY" || normalized === "EXTREME") {
    return "OPEN";
  }

  if (normalized === "LADIES" || normalized === "LADIES_CATEGORY") {
    return "LADIES_CATEGORY";
  }

  return normalized;
};

const getSnapshotCategoryKey = snapshot =>
  normalizeCategoryKey(
    snapshot?.focusCategory ||
      snapshot?.categoryKey ||
      snapshot?.category_key ||
      snapshot?.category ||
      snapshot?.categoryOptions?.[0]?.key ||
      snapshot?.leaderboard?.categories?.[0]?.key ||
      ""
  );

const getUniqueCategoryKeys = items =>
  [...new Set(
    (Array.isArray(items) ? items : [])
      .map(item => normalizeCategoryKey(item?.category || item?.key || item?.category_key || item?.label || ""))
      .filter(Boolean)
  )];

const isFocusedCategorySnapshot = snapshot => {
  if (
    normalizeCategoryKey(
      snapshot?.focusCategory ||
        snapshot?.categoryKey ||
        snapshot?.category_key ||
        snapshot?.category ||
        ""
    )
  ) {
    return true;
  }

  const leaderboardCategoryKeys = getUniqueCategoryKeys(snapshot?.leaderboard?.categories || []);
  const dataCategoryKeys = [
    ...getUniqueCategoryKeys(snapshot?.teams || []),
    ...getUniqueCategoryKeys(snapshot?.results || []),
    ...getUniqueCategoryKeys(snapshot?.disputes || []),
  ];
  const uniqueDataCategoryKeys = [...new Set(dataCategoryKeys)];

  if (leaderboardCategoryKeys.length > 1 || uniqueDataCategoryKeys.length > 1) {
    return false;
  }

  return leaderboardCategoryKeys.length === 1 || uniqueDataCategoryKeys.length === 1;
};

const filterSnapshotToCategory = (snapshot, focusCategory) => {
  const normalizedFocusCategory = normalizeCategoryKey(focusCategory);

  if (!normalizedFocusCategory) {
    return snapshot;
  }

  const filterByCategory = item => normalizeCategoryKey(item?.category || item?.key || item?.category_key || "");

  return {
    ...snapshot,
    focusCategory: normalizedFocusCategory,
    teams: Array.isArray(snapshot?.teams)
      ? snapshot.teams.filter(item => filterByCategory(item) === normalizedFocusCategory)
      : [],
    results: Array.isArray(snapshot?.results)
      ? snapshot.results.filter(item => filterByCategory(item) === normalizedFocusCategory)
      : [],
    disputes: Array.isArray(snapshot?.disputes)
      ? snapshot.disputes.filter(item => filterByCategory(item) === normalizedFocusCategory)
      : [],
    categoryOptions: Array.isArray(snapshot?.categoryOptions)
      ? snapshot.categoryOptions.filter(item => normalizeCategoryKey(item?.key || item?.category || "") === normalizedFocusCategory)
      : [],
    leaderboard: {
      ...(snapshot?.leaderboard || {}),
      categories: Array.isArray(snapshot?.leaderboard?.categories)
        ? snapshot.leaderboard.categories.filter(
            item => normalizeCategoryKey(item?.key || item?.category || "") === normalizedFocusCategory
          )
        : [],
    },
  };
};

const mergeSnapshotCategory = (existingSnapshot, incomingSnapshot) => {
  if (!isFocusedCategorySnapshot(incomingSnapshot)) {
    return incomingSnapshot;
  }

  const focusCategory = getSnapshotCategoryKey(incomingSnapshot);

  if (!focusCategory) {
    return incomingSnapshot;
  }

  const incomingCategorySnapshot = filterSnapshotToCategory(incomingSnapshot, focusCategory);
  const keepOtherCategory = item => normalizeCategoryKey(item?.category || item?.key || item?.category_key || "") !== focusCategory;
  const mergeCategoryList = (existingItems = [], incomingItems = []) => [
    ...existingItems.filter(keepOtherCategory),
    ...incomingItems,
  ];

  return {
    ...(existingSnapshot || {}),
    ...incomingSnapshot,
    focusCategory,
    teams: mergeCategoryList(existingSnapshot?.teams || [], incomingCategorySnapshot.teams || []),
    results: mergeCategoryList(existingSnapshot?.results || [], incomingCategorySnapshot.results || []),
    disputes: mergeCategoryList(existingSnapshot?.disputes || [], incomingCategorySnapshot.disputes || []),
    categoryOptions: mergeCategoryList(existingSnapshot?.categoryOptions || [], incomingCategorySnapshot.categoryOptions || []),
    leaderboard: {
      ...(existingSnapshot?.leaderboard || {}),
      ...(incomingSnapshot?.leaderboard || {}),
      categories: mergeCategoryList(
        existingSnapshot?.leaderboard?.categories || [],
        incomingCategorySnapshot.leaderboard?.categories || []
      ),
    },
  };
};

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
    const incomingSnapshot = await readOptionalJsonBody(request);

    if (incomingSnapshot === null || isEmptyObject(incomingSnapshot)) {
      return createUsableResponse({ skipped: true });
    }

    const existingSnapshot = hasDriveConfig()
      ? await readJsonFromDrive(LEADERBOARD_FILE_NAME)
      : await readLocalSnapshot().catch(() => null);
    const resetMarker = await getResetMarker(existingSnapshot);
    const currentExistingSnapshot = getCurrentSnapshot(existingSnapshot, resetMarker);
    const mergedSnapshot = currentExistingSnapshot
      ? mergeSnapshotCategory(currentExistingSnapshot, incomingSnapshot)
      : incomingSnapshot;
    const snapshot = applyLeaderboardResetMarker(await preserveLeaderboardVisibility(mergedSnapshot), resetMarker);
    const latestSnapshot = hasDriveConfig()
      ? await readJsonFromDrive(LEADERBOARD_FILE_NAME)
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

    const cachedLocally = hasDriveConfig() ? await trySaveLocalSnapshot(snapshot) : (await trySaveLocalSnapshot(snapshot));

    let file = null;
    if (hasDriveConfig()) {
      try {
        const payload = JSON.stringify(snapshot, null, 2);
        file = await upsertJsonToDrive(LEADERBOARD_FILE_NAME, payload);
      } catch (driveError) {
        console.warn("[LEADERBOARD] Drive sync failed:", driveError.message);

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
    const currentSnapshot = getCurrentSnapshot(snapshot, await getResetMarker(snapshot));

    return NextResponse.json(withEndpointStatus(currentSnapshot), {
      headers: corsHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Leaderboard export file not found",
      },
      {
        status: hasDriveConfig() ? 503 : 404,
        headers: corsHeaders,
      }
    );
  }
}

export async function DELETE() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  try {
    const resetMarker = createLeaderboardResetMarker();
    const snapshot = applyLeaderboardResetMarker(await preserveLeaderboardVisibility(createEmptySnapshot()), resetMarker);
    const cachedLocally = hasDriveConfig() ? await trySaveLocalSnapshot(snapshot) : (await trySaveLocalSnapshot(snapshot));

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
        console.warn("[LEADERBOARD] Drive reset failed:", driveError.message);

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
