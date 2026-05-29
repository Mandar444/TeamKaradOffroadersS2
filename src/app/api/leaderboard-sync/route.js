import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import { cookies } from "next/headers";
import os from "os";
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
  hasLeaderboardSheetsConfig,
  readLeaderboardSnapshotFromSheets,
  writeLeaderboardSnapshotToSheets,
} from "@/lib/leaderboard-sheets-store";
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

const LEADERBOARD_FILE_NAME = process.env.GOOGLE_LEADERBOARD_FILE_NAME || "leaderboard-export.json";
const LOCAL_EXPORT_DIR = path.join(process.cwd(), "public", "data");
const LOCAL_EXPORT_FILE = path.join(LOCAL_EXPORT_DIR, "leaderboard-export.json");
const LOCAL_ROOT_EXPORT_FILE = path.join(process.cwd(), "public", "leaderboard-export.json");
const FALLBACK_EXPORT_DIR = path.join(os.tmpdir(), "team-karad-offroaders");
const FALLBACK_EXPORT_FILE = path.join(FALLBACK_EXPORT_DIR, "leaderboard-export.json");
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
      snapshot?.categoryOptions?.[0]?.label ||
      snapshot?.leaderboard?.categories?.[0]?.key ||
      snapshot?.leaderboard?.categories?.[0]?.label ||
      ""
  );

const getUniqueCategoryKeys = items =>
  [...new Set(
    (Array.isArray(items) ? items : [])
      .map(item => normalizeCategoryKey(item?.category || item?.key || item?.category_key || item?.label || ""))
      .filter(Boolean)
  )];

const getCategoryKeyFromItem = item =>
  normalizeCategoryKey(item?.category || item?.key || item?.category_key || item?.label || "");

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

  const filterByCategory = item => {
    const itemCategory = getCategoryKeyFromItem(item);
    return !itemCategory || itemCategory === normalizedFocusCategory;
  };
  const tagCategory = item =>
    getCategoryKeyFromItem(item) ? item : { ...item, category: normalizedFocusCategory };

  return {
    ...snapshot,
    focusCategory: normalizedFocusCategory,
    teams: Array.isArray(snapshot?.teams)
      ? snapshot.teams.filter(filterByCategory).map(tagCategory)
      : [],
    results: Array.isArray(snapshot?.results)
      ? snapshot.results.filter(filterByCategory).map(tagCategory)
      : [],
    disputes: Array.isArray(snapshot?.disputes)
      ? snapshot.disputes.filter(filterByCategory).map(tagCategory)
      : [],
    categoryOptions: Array.isArray(snapshot?.categoryOptions)
      ? snapshot.categoryOptions.filter(filterByCategory).map(tagCategory)
      : [],
    leaderboard: {
      ...(snapshot?.leaderboard || {}),
      categories: Array.isArray(snapshot?.leaderboard?.categories)
        ? snapshot.leaderboard.categories.filter(filterByCategory).map(tagCategory)
        : [],
    },
  };
};

const mergeSnapshotCategory = (existingSnapshot, incomingSnapshot) => {
  const focusedCategory = isFocusedCategorySnapshot(incomingSnapshot)
    ? getSnapshotCategoryKey(incomingSnapshot)
    : "";
  const incomingCategoryKeys = focusedCategory
    ? [focusedCategory]
    : [
        ...getUniqueCategoryKeys(incomingSnapshot?.leaderboard?.categories || []),
        ...getUniqueCategoryKeys(incomingSnapshot?.categoryOptions || []),
        ...getUniqueCategoryKeys(incomingSnapshot?.teams || []),
        ...getUniqueCategoryKeys(incomingSnapshot?.results || []),
        ...getUniqueCategoryKeys(incomingSnapshot?.disputes || []),
      ];
  const replaceCategoryKeys = new Set(incomingCategoryKeys.filter(Boolean));

  if (!replaceCategoryKeys.size) {
    return incomingSnapshot;
  }

  const incomingCategorySnapshot = focusedCategory
    ? filterSnapshotToCategory(incomingSnapshot, focusedCategory)
    : incomingSnapshot;
  const keepOtherCategory = item => {
    const itemCategory = getCategoryKeyFromItem(item);
    return !itemCategory || !replaceCategoryKeys.has(itemCategory);
  };
  const mergeCategoryList = (existingItems = [], incomingItems = []) => [
    ...existingItems.filter(keepOtherCategory),
    ...incomingItems,
  ];

  return {
    ...(existingSnapshot || {}),
    ...incomingSnapshot,
    ...(focusedCategory ? { focusCategory: focusedCategory } : {}),
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
  const candidateFiles = IS_VERCEL
    ? [FALLBACK_EXPORT_FILE, LOCAL_ROOT_EXPORT_FILE, LOCAL_EXPORT_FILE]
    : [LOCAL_ROOT_EXPORT_FILE, LOCAL_EXPORT_FILE, FALLBACK_EXPORT_FILE];

  for (const filePath of candidateFiles) {
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

const safeParseJsonValue = value => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  try {
    return JSON.parse(trimmedValue);
  } catch (error) {
    return value;
  }
};

const parsePayloadCandidate = value => {
  const parsedValue = safeParseJsonValue(value);

  if (typeof parsedValue === "string") {
    const maybeQuery = parsedValue.includes("=") ? Object.fromEntries(new URLSearchParams(parsedValue)) : null;
    return maybeQuery || parsedValue;
  }

  return parsedValue;
};

const unwrapIncomingSnapshot = payload => {
  const parsedPayload = parsePayloadCandidate(payload);

  if (parsedPayload !== payload) {
    return unwrapIncomingSnapshot(parsedPayload);
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return payload;
  }

  for (const key of ["snapshot", "leaderboardSnapshot", "leaderboardExport", "leaderboard", "export", "data", "payload", "json", "body"]) {
    const value = payload[key];

    if (value !== null && value !== undefined && value !== "") {
      const unwrappedValue = unwrapIncomingSnapshot(value);

      if (unwrappedValue && typeof unwrappedValue === "object" && !Array.isArray(unwrappedValue)) {
        return unwrappedValue;
      }
    }
  }

  return payload;
};

async function readOptionalJsonBody(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const preferredKeys = ["file", "snapshot", "leaderboardSnapshot", "leaderboardExport", "leaderboard", "export", "data", "payload", "json", "body"];

    for (const key of preferredKeys) {
      const value = formData.get(key);

      if (!value) {
        continue;
      }

      if (typeof value === "string") {
        return parsePayloadCandidate(value);
      }

      if (typeof value.text === "function") {
        return parsePayloadCandidate(await value.text());
      }
    }

    const fields = {};

    for (const [key, value] of formData.entries()) {
      fields[key] = typeof value === "string" ? value : await value.text();
    }

    return Object.keys(fields).length ? fields : null;
  }

  const rawBody = await request.text();

  if (!rawBody.trim()) {
    return null;
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(rawBody));
  }

  return parsePayloadCandidate(rawBody);
}

const isEmptyObject = value =>
  value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0;

function createUsableResponse(extra = {}) {
  return NextResponse.json(
    {
      ok: true,
      success: true,
      usable: true,
      available: true,
      syncAvailable: true,
      acceptsPost: true,
      canSync: true,
      ...extra,
    },
    { headers: corsHeaders }
  );
}

const withEndpointStatus = snapshot => ({
  ok: true,
  success: true,
  usable: true,
  available: true,
  syncAvailable: true,
  acceptsPost: true,
  canSync: true,
  ...(snapshot || createEmptySnapshot()),
});

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
      return await attempt();
    } catch (error) {
      if (!optional) {
        console.warn("[LEADERBOARD] Snapshot storage read failed:", error?.message || error);
      }
    }
  }

  if (optional) {
    return null;
  }

  throw new Error("Leaderboard export file not found");
}

export async function POST(request) {
  try {
    if (IS_VERCEL && !hasSheetsConfig() && !hasDriveConfig()) {
      return NextResponse.json(
        {
          ok: false,
          error: "Persistent Google Sheets or Google Drive storage is required on Vercel to preserve multiple leaderboard categories.",
          detail: "Temporary Vercel storage cannot reliably merge category-by-category uploads. Configure GOOGLE_SHEET_ID, GOOGLE_CLIENT_EMAIL, and GOOGLE_PRIVATE_KEY.",
          storageMode: getStorageMode(),
        },
        { status: 500, headers: corsHeaders }
      );
    }

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

    const existingSnapshot = await readSharedSnapshot({ optional: true });
    const resetMarker = await getResetMarker(existingSnapshot);
    const currentExistingSnapshot = getCurrentSnapshot(existingSnapshot, resetMarker);
    const mergedSnapshot = currentExistingSnapshot
      ? mergeSnapshotCategory(currentExistingSnapshot, incomingSnapshot)
      : incomingSnapshot;
    const snapshot = applyLeaderboardResetMarker(await preserveLeaderboardVisibility(mergedSnapshot), resetMarker);
    const latestSnapshot = await readSharedSnapshot({ optional: true });
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
    if (hasSheetsConfig()) {
      try {
        file = await writeLeaderboardSnapshotToSheets(snapshot);
      } catch (sheetsError) {
        if (IS_VERCEL) {
          return NextResponse.json(
            {
              ok: false,
              error: "Unable to persist leaderboard data to Google Sheets. Check spreadsheet sharing and service account permissions.",
              detail: sheetsError?.message || null,
              cachedLocally,
            },
            { status: 500, headers: corsHeaders }
          );
        }

        throw sheetsError;
      }
    } else if (hasDriveConfig()) {
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
    } else if (!cachedLocally) {
      throw new Error("Unable to save leaderboard snapshot locally.");
    }

    return NextResponse.json(
      {
        ok: true,
        success: true,
        usable: true,
        available: true,
        syncAvailable: true,
        acceptsPost: true,
        canSync: true,
        savedTo: file?.webViewLink || "/leaderboard-export.json",
        generatedAt: snapshot?.generatedAt || null,
        cachedLocally,
        database: getStorageMode(),
        persistedToDatabase: Boolean(file?.id),
        persistedToSheets: hasSheetsConfig() && Boolean(file?.id),
        persistedToDrive: !hasSheetsConfig() && Boolean(file?.id),
        storageMode: getStorageMode(),
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
    const snapshot = await readSharedSnapshot();
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
    const cachedLocally = hasDriveConfig() ? await trySaveLocalSnapshot(snapshot) : (await trySaveLocalSnapshot(snapshot));

    let file = null;
    let cleanup = null;
    if (hasSheetsConfig()) {
      try {
        file = await writeLeaderboardSnapshotToSheets(snapshot);
      } catch (sheetsError) {
        if (IS_VERCEL) {
          return NextResponse.json(
            {
              ok: false,
              error: "Unable to persist leaderboard reset to Google Sheets. Check spreadsheet sharing and service account permissions.",
              detail: sheetsError?.message || null,
              cachedLocally,
            },
            { status: 500, headers: corsHeaders }
          );
        }

        throw sheetsError;
      }
    } else if (hasDriveConfig()) {
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
        database: getStorageMode(),
        persistedToDatabase: Boolean(file?.id),
        persistedToSheets: hasSheetsConfig() && Boolean(file?.id),
        persistedToDrive: !hasSheetsConfig() && Boolean(file?.id),
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
      success: true,
      usable: true,
      available: true,
      syncAvailable: true,
      acceptsPost: true,
      canSync: true,
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
