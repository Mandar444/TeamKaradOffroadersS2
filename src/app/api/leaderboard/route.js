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
import {
  preserveMissingLeaderboardCategories,
  stripSeedLeaderboardSnapshot,
} from "@/lib/leaderboard-category-preserver";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS, HEAD",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Expose-Headers": "X-Leaderboard-Sync-Available, X-Leaderboard-Accepts-Post",
  "X-Leaderboard-Sync-Available": "true",
  "X-Leaderboard-Accepts-Post": "true",
  "Allow": "GET, POST, DELETE, OPTIONS, HEAD",
  "Accept-Post": "application/json, multipart/form-data, application/x-www-form-urlencoded, text/plain",
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

async function persistLeaderboardSnapshot(snapshot) {
  const warnings = [];
  const cachedLocally = await trySaveLocalSnapshot(snapshot);
  let sheetsFile = null;
  let driveFile = null;

  if (hasSheetsConfig()) {
    try {
      sheetsFile = await writeLeaderboardSnapshotToSheets(snapshot);
    } catch (sheetsError) {
      warnings.push(`Google Sheets save failed: ${sheetsError?.message || sheetsError}`);
      console.warn("[LEADERBOARD] Sheets sync failed:", sheetsError?.message || sheetsError);
    }
  }

  if (hasDriveConfig()) {
    try {
      driveFile = await upsertJsonToDrive(LEADERBOARD_FILE_NAME, JSON.stringify(snapshot, null, 2));
    } catch (driveError) {
      warnings.push(`Google Drive save failed: ${driveError?.message || driveError}`);
      console.warn("[LEADERBOARD] Drive sync failed:", driveError?.message || driveError);
    }
  }

  if (!cachedLocally && !sheetsFile?.id && !driveFile?.id) {
    throw new Error(warnings.join(" | ") || "Unable to save leaderboard snapshot.");
  }

  return {
    cachedLocally,
    file: sheetsFile || driveFile,
    warnings,
    persistedToSheets: Boolean(sheetsFile?.id),
    persistedToDrive: Boolean(driveFile?.id),
  };
}

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

const getCategoryKeyFromItem = item =>
  normalizeCategoryKey(item?.category || item?.key || item?.category_key || item?.label || "");

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
      .map(getCategoryKeyFromItem)
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

const safeParseJsonObject = value => {
  if (!value || typeof value !== "string") {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (error) {
    return {};
  }
};

const getMergedSource = source => ({
  ...safeParseJsonObject(source?.submission_json),
  ...(source || {}),
});

const normalizeIdentityValue = value =>
  String(value || "")
    .trim()
    .toLowerCase();

const getVehicleMergeKey = (source, fallbackCategory = "") => {
  const mergedSource = getMergedSource(source);
  const category = normalizeCategoryKey(
    mergedSource?.category ||
      mergedSource?.categoryKey ||
      mergedSource?.category_key ||
      fallbackCategory ||
      ""
  );
  const sticker = normalizeIdentityValue(
    mergedSource?.stickerNumber ||
      mergedSource?.sticker_number ||
      mergedSource?.sticker ||
      mergedSource?.carNumber ||
      mergedSource?.car_number ||
      ""
  ).replace(/^#/, "");
  const driver = normalizeIdentityValue(
    mergedSource?.driverName ||
      mergedSource?.driver_name ||
      mergedSource?.driver ||
      ""
  );
  const rowVehicleKey = normalizeIdentityValue(mergedSource?.vehicleKey || "");

  if (category && sticker) {
    return `${category}|sticker:${sticker}`;
  }

  if (category && driver) {
    return `${category}|driver:${driver}`;
  }

  return rowVehicleKey ? `${category || "UNKNOWN"}|row:${rowVehicleKey}` : "";
};

const normalizeMergeText = value =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

const getTrackMergeKey = source => {
  const mergedSource = getMergedSource(source);
  return normalizeMergeText(
    mergedSource?.trackKey ||
      mergedSource?.track_key ||
      mergedSource?.trackName ||
      mergedSource?.track_name ||
      mergedSource?.trackLabel ||
      mergedSource?.track_label ||
      mergedSource?.track ||
      mergedSource?.key ||
      mergedSource?.label ||
      ""
  );
};

const getDayMergeKey = source => {
  const mergedSource = getMergedSource(source);
  return normalizeMergeText(
    mergedSource?.selectedDayId ||
      mergedSource?.selected_day_id ||
      mergedSource?.selectedDayLabel ||
      mergedSource?.selected_day_label ||
      mergedSource?.selectedDayDate ||
      mergedSource?.selected_day_date ||
      mergedSource?.dayLabel ||
      mergedSource?.day_label ||
      mergedSource?.day ||
      ""
  );
};

const getResultMergeKey = (source, fallbackCategory = "") => {
  const vehicleKey = getVehicleMergeKey(source, fallbackCategory);
  const trackKey = getTrackMergeKey(source);
  const dayKey = getDayMergeKey(source);

  return vehicleKey && trackKey ? `${vehicleKey}|track:${trackKey}|day:${dayKey || "default"}` : "";
};

const getNumericValue = value => {
  const numericValue = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const hasMeaningfulText = value => {
  const normalizedValue = String(value || "").trim().toLowerCase();
  return Boolean(normalizedValue && normalizedValue !== "na" && normalizedValue !== "n/a" && normalizedValue !== "--");
};

const hasAnyText = value => String(value || "").trim() !== "";

const hasTrackEntryData = entry =>
  Boolean(entry && typeof entry === "object" && Object.keys(entry).length) &&
  (
    hasAnyText(entry?.key || entry?.identityKey) ||
    hasAnyText(entry?.dayLabel || entry?.day_label || entry?.day) ||
    hasAnyText(entry?.timingLabel || entry?.timing_label || entry?.value) ||
    hasAnyText(entry?.pointsLabel || entry?.points_label) ||
    hasAnyText(entry?.rankLabel || entry?.rank_label || entry?.rank) ||
    getNumericValue(entry?.points) !== 0 ||
    getNumericValue(entry?.totalPoints || entry?.total_points) !== 0
  );

const hasTrackSummaryData = summary =>
  getNumericValue(summary?.totalPoints || summary?.total_points || summary?.total) !== 0 ||
  (Array.isArray(summary?.entries) && summary.entries.some(hasTrackEntryData));

const hasRowTrackData = row => {
  if (!row || typeof row !== "object") {
    return false;
  }

  const trackSummaries = Array.isArray(row?.trackSummaries)
    ? row.trackSummaries
    : row?.trackSummaries && typeof row.trackSummaries === "object"
      ? Object.values(row.trackSummaries)
      : [];
  const trackMapSummaries = row?.trackMap && typeof row.trackMap === "object"
    ? Object.values(row.trackMap)
    : [];

  return (
    getNumericValue(row?.totalPoints || row?.total_points || row?.total || row?.points) !== 0 ||
    hasMeaningfulText(row?.totalTimingLabel || row?.total_timing_label || row?.totalTime || row?.total_time) ||
    [...trackSummaries, ...trackMapSummaries].some(hasTrackSummaryData)
  );
};

const hasResultTrackData = item => {
  const source = getMergedSource(item);
  return (
    hasMeaningfulText(source?.trackName || source?.track_name || source?.trackLabel || source?.track_label || source?.track) ||
    hasMeaningfulText(source?.totalTimeDisplay || source?.total_time_display || source?.total_time) ||
    hasMeaningfulText(source?.performanceTimeDisplay || source?.performance_time_display || source?.performance_time) ||
    getNumericValue(source?.points || source?.totalPoints || source?.total_points || source?.score) !== 0
  );
};

const mergeCategoryOptions = (existingItems = [], incomingItems = []) => {
  const merged = new Map();

  [...existingItems, ...incomingItems].forEach(item => {
    const key = getCategoryKeyFromItem(item);
    if (key) {
      merged.set(key, { ...(merged.get(key) || {}), ...item });
    }
  });

  return [...merged.values()];
};

const mergeItemsByKey = (existingItems = [], incomingItems = [], getKey, shouldIncludeIncoming = () => true) => {
  const merged = new Map();

  existingItems.forEach(item => {
    const key = getKey(item);
    if (key) {
      merged.set(key, item);
    }
  });

  incomingItems.filter(shouldIncludeIncoming).forEach(item => {
    const key = getKey(item);
    if (key) {
      merged.set(key, { ...(merged.get(key) || {}), ...item });
    }
  });

  return [...merged.values()];
};

const mergeTrackList = (existingTracks = [], incomingTracks = []) => {
  const trackMap = new Map();

  [...existingTracks, ...incomingTracks].filter(Boolean).forEach(track => {
    const key = String(track?.key || track?.trackKey || track?.label || track?.name || track || "")
      .trim()
      .toLowerCase();

    if (key) {
      trackMap.set(key, track);
    }
  });

  return [...trackMap.values()];
};

const getAllowedIncomingRows = (existingCategory, incomingCategory, categoryKey) => {
  const existingRowsByKey = new Map();

  (Array.isArray(existingCategory?.rows) ? existingCategory.rows : []).forEach(row => {
    const key = getVehicleMergeKey(row, categoryKey);
    if (key) {
      existingRowsByKey.set(key, row);
    }
  });

  return (Array.isArray(incomingCategory?.rows) ? incomingCategory.rows : []).filter(row => {
    const vehicleKey = getVehicleMergeKey(row, categoryKey);
    const existingRow = existingRowsByKey.get(vehicleKey);

    return hasRowTrackData(row) || !existingRow || !hasRowTrackData(existingRow);
  });
};

const getRowSummaries = row => {
  const summaries = Array.isArray(row?.trackSummaries)
    ? row.trackSummaries
    : row?.trackSummaries && typeof row.trackSummaries === "object"
      ? Object.values(row.trackSummaries)
      : [];
  const mapSummaries = row?.trackMap && typeof row.trackMap === "object"
    ? Object.values(row.trackMap)
    : [];

  return [...summaries, ...mapSummaries].filter(Boolean);
};

const mergeEntries = (existingEntries = [], incomingEntries = []) => {
  const merged = new Map();

  existingEntries.forEach(entry => {
    const key = normalizeMergeText(entry?.key || entry?.identityKey || `${getDayMergeKey(entry)}|${entry?.timingLabel || entry?.timing_label || ""}`);
    if (key) {
      merged.set(key, entry);
    }
  });

  incomingEntries.forEach(entry => {
    if (!hasTrackEntryData(entry)) {
      return;
    }

    const key = normalizeMergeText(entry?.key || entry?.identityKey || `${getDayMergeKey(entry)}|${entry?.timingLabel || entry?.timing_label || ""}`);
    if (key) {
      merged.set(key, { ...(merged.get(key) || {}), ...entry });
    }
  });

  return [...merged.values()];
};

const mergeSummary = (existingSummary, incomingSummary) => {
  if (!existingSummary) {
    return incomingSummary;
  }

  if (!hasTrackSummaryData(incomingSummary) && hasTrackSummaryData(existingSummary)) {
    return existingSummary;
  }

  const entries = mergeEntries(existingSummary?.entries || [], incomingSummary?.entries || []);

  return {
    ...existingSummary,
    ...incomingSummary,
    totalPoints: getNumericValue(incomingSummary?.totalPoints ?? incomingSummary?.total_points ?? incomingSummary?.total) ||
      getNumericValue(existingSummary?.totalPoints ?? existingSummary?.total_points ?? existingSummary?.total) ||
      entries.reduce((total, entry) => total + getNumericValue(entry?.pointsLabel || entry?.points_label || entry?.points), 0),
    entries,
  };
};

const mergeRows = (existingRow, incomingRow) => {
  if (!existingRow) {
    return incomingRow;
  }

  if (!hasRowTrackData(incomingRow) && hasRowTrackData(existingRow)) {
    return existingRow;
  }

  const summaries = new Map();

  getRowSummaries(existingRow).forEach(summary => {
    const key = getTrackMergeKey(summary);
    if (key) {
      summaries.set(key, summary);
    }
  });

  getRowSummaries(incomingRow).forEach(summary => {
    const key = getTrackMergeKey(summary);
    if (key) {
      summaries.set(key, mergeSummary(summaries.get(key), summary));
    }
  });

  const trackSummaries = [...summaries.values()];
  const trackMap = trackSummaries.reduce((acc, summary) => {
    const key = getTrackMergeKey(summary);
    if (key) {
      acc[key] = summary;
    }
    return acc;
  }, {});
  const totalPoints = trackSummaries.reduce(
    (total, summary) => total + getNumericValue(summary?.totalPoints ?? summary?.total_points ?? summary?.total),
    0
  );

  return {
    ...existingRow,
    ...incomingRow,
    totalPoints,
    trackMap,
    trackSummaries,
  };
};

const mergeLeaderboardCategories = (existingCategories = [], incomingCategories = [], replaceCategoryKeys, incomingVehicleKeys) => {
  const categoriesByKey = new Map();

  existingCategories.forEach(category => {
    const key = getCategoryKeyFromItem(category);
    if (key) {
      categoriesByKey.set(key, category);
    }
  });

  incomingCategories.forEach(incomingCategory => {
    const categoryKey = getCategoryKeyFromItem(incomingCategory);

    if (!categoryKey || !replaceCategoryKeys.has(categoryKey)) {
      if (categoryKey && !categoriesByKey.has(categoryKey)) {
        categoriesByKey.set(categoryKey, incomingCategory);
      }
      return;
    }

    const existingCategory = categoriesByKey.get(categoryKey);
    const incomingRowsToKeep = getAllowedIncomingRows(existingCategory, incomingCategory, categoryKey);
    if (!existingCategory && !incomingRowsToKeep.length) {
      return;
    }

    const rowsByKey = new Map();
    const existingRows = Array.isArray(existingCategory?.rows) ? existingCategory.rows : [];

    existingRows.forEach(row => {
      const key = getVehicleMergeKey(row, categoryKey);
      if (key) {
        rowsByKey.set(key, row);
      }
    });

    incomingRowsToKeep.forEach(row => {
      const key = getVehicleMergeKey(row, categoryKey);
      if (key) {
        incomingVehicleKeys.add(key);
        rowsByKey.set(key, mergeRows(rowsByKey.get(key), row));
      }
    });

    categoriesByKey.set(categoryKey, {
      ...(existingCategory || {}),
      ...incomingCategory,
      tracks: mergeTrackList(existingCategory?.tracks || [], incomingCategory?.tracks || incomingCategory?.trackOptions || []),
      rows: [...rowsByKey.values()],
    });
  });

  return [...categoriesByKey.values()];
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
  const incomingVehicleKeys = new Set();
  const incomingResultsWithData = [
    ...(Array.isArray(incomingCategorySnapshot?.results) ? incomingCategorySnapshot.results : []),
    ...(Array.isArray(incomingCategorySnapshot?.disputes) ? incomingCategorySnapshot.disputes : []),
  ].filter(hasResultTrackData);

  incomingResultsWithData.forEach(item => {
    const categoryKey = getCategoryKeyFromItem(item);
    const vehicleKey = getVehicleMergeKey(item, categoryKey);

    if (replaceCategoryKeys.has(categoryKey) && vehicleKey) {
      incomingVehicleKeys.add(vehicleKey);
    }
  });
  const incomingLeaderboardCategories = Array.isArray(incomingCategorySnapshot.leaderboard?.categories)
    ? incomingCategorySnapshot.leaderboard.categories
    : [];

  incomingLeaderboardCategories.forEach(category => {
    const categoryKey = getCategoryKeyFromItem(category);

    if (!replaceCategoryKeys.has(categoryKey)) {
      return;
    }

    const existingCategory = (Array.isArray(existingSnapshot?.leaderboard?.categories) ? existingSnapshot.leaderboard.categories : [])
      .find(existingCategoryItem => getCategoryKeyFromItem(existingCategoryItem) === categoryKey);

    getAllowedIncomingRows(existingCategory, category, categoryKey).forEach(row => {
      const vehicleKey = getVehicleMergeKey(row, categoryKey);

      if (vehicleKey) {
        incomingVehicleKeys.add(vehicleKey);
      }
    });
  });

  return {
    ...(existingSnapshot || {}),
    ...incomingSnapshot,
    ...(focusedCategory ? { focusCategory: focusedCategory } : {}),
    teams: mergeItemsByKey(
      existingSnapshot?.teams || [],
      incomingCategorySnapshot.teams || [],
      item => getVehicleMergeKey(item, getCategoryKeyFromItem(item)),
      item => incomingVehicleKeys.has(getVehicleMergeKey(item, getCategoryKeyFromItem(item)))
    ),
    results: mergeItemsByKey(
      existingSnapshot?.results || [],
      incomingCategorySnapshot.results || [],
      item => getResultMergeKey(item, getCategoryKeyFromItem(item)),
      hasResultTrackData
    ),
    disputes: mergeItemsByKey(
      existingSnapshot?.disputes || [],
      incomingCategorySnapshot.disputes || [],
      item => getResultMergeKey(item, getCategoryKeyFromItem(item)),
      hasResultTrackData
    ),
    categoryOptions: mergeCategoryOptions(existingSnapshot?.categoryOptions || [], incomingCategorySnapshot.categoryOptions || []),
    leaderboard: {
      ...(existingSnapshot?.leaderboard || {}),
      ...(incomingSnapshot?.leaderboard || {}),
      categories: mergeLeaderboardCategories(
        existingSnapshot?.leaderboard?.categories || [],
        incomingLeaderboardCategories,
        replaceCategoryKeys,
        incomingVehicleKeys
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

const isLeaderboardSnapshotPayload = payload =>
  payload &&
  typeof payload === "object" &&
  !Array.isArray(payload) &&
  (
    Array.isArray(payload?.teams) ||
    Array.isArray(payload?.results) ||
    Array.isArray(payload?.disputes) ||
    Array.isArray(payload?.categoryOptions) ||
    Array.isArray(payload?.categories) ||
    Array.isArray(payload?.leaderboard?.categories) ||
    payload?.schemaVersion !== undefined ||
    payload?.generatedAt !== undefined ||
    payload?.focusCategory !== undefined ||
    payload?.categoryKey !== undefined ||
    payload?.category_key !== undefined
  );

const unwrapIncomingSnapshot = payload => {
  const parsedPayload = parsePayloadCandidate(payload);

  if (parsedPayload !== payload) {
    return unwrapIncomingSnapshot(parsedPayload);
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return payload;
  }

  if (isLeaderboardSnapshotPayload(payload)) {
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

const getFirstPayloadValue = (payload, keys) => {
  const parsedSubmission = safeParseJsonObject(payload?.submission_json);
  const source = { ...parsedSubmission, ...(payload || {}) };

  for (const key of keys) {
    const value = source?.[key];

    if (value !== null && value !== undefined && value !== "") {
      return value;
    }
  }

  return "";
};

const normalizeTrackKey = value =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

const formatCategoryLabel = value =>
  String(value || "")
    .trim()
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, letter => letter.toUpperCase()) || "Category";

const getSingleResultPoints = payload => {
  const value = getFirstPayloadValue(payload, ["points", "totalPoints", "total_points", "score", "track_points", "dnf_points"]);
  const numericValue = Number(String(value || "").replace(/[^\d.-]/g, ""));

  return Number.isFinite(numericValue) ? numericValue : 0;
};

const isSingleLeaderboardResultPayload = payload => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload) || isLeaderboardSnapshotPayload(payload)) {
    return false;
  }

  const category = normalizeCategoryKey(getFirstPayloadValue(payload, ["category", "categoryKey", "category_key", "categoryLabel", "category_label"]));
  const track = getFirstPayloadValue(payload, ["track_name", "trackName", "track_label", "trackLabel", "track"]);
  const sticker = getFirstPayloadValue(payload, ["sticker_number", "stickerNumber", "sticker", "car_number", "carNumber"]);
  const driver = getFirstPayloadValue(payload, ["driver_name", "driverName", "driver"]);
  const timing = getFirstPayloadValue(payload, ["total_time", "totalTimeDisplay", "performance_time", "performanceTimeDisplay", "completion_time", "completionTime"]);

  return Boolean(category && track && (sticker || driver || timing || getSingleResultPoints(payload) !== 0));
};

const createSnapshotFromSingleResult = payload => {
  const categoryKey = normalizeCategoryKey(getFirstPayloadValue(payload, ["categoryKey", "category_key", "category", "categoryLabel", "category_label"]));
  const categoryLabel = getFirstPayloadValue(payload, ["categoryLabel", "category_label", "category"]) || formatCategoryLabel(categoryKey);
  const trackLabel = getFirstPayloadValue(payload, ["track_name", "trackName", "track_label", "trackLabel", "track"]);
  const trackKey = normalizeTrackKey(trackLabel);
  const stickerNumber = String(getFirstPayloadValue(payload, ["sticker_number", "stickerNumber", "sticker", "car_number", "carNumber"]) || "").replace(/^#/, "");
  const driverName = getFirstPayloadValue(payload, ["driver_name", "driverName", "driver"]) || "--";
  const teamName = getFirstPayloadValue(payload, ["team_name", "teamName", "team"]) || "--";
  const coDriverName = getFirstPayloadValue(payload, ["codriver_name", "coDriverName", "co_driver_name", "codriver", "co_driver"]) || "--";
  const dayLabel = getFirstPayloadValue(payload, ["selected_day_label", "selectedDayLabel", "selected_day_id", "selectedDayId", "day", "day_label"]) || "D1";
  const timingLabel = getFirstPayloadValue(payload, ["total_time", "totalTimeDisplay", "performance_time", "performanceTimeDisplay", "completion_time", "completionTime"]) || "NA";
  const points = getSingleResultPoints(payload);
  const rankLabel = getFirstPayloadValue(payload, ["rank", "rank_label", "rankLabel", "position"]);
  const result = {
    ...payload,
    category: categoryKey,
    category_key: categoryKey,
    track_name: trackLabel,
    sticker_number: stickerNumber,
    driver_name: driverName,
    team_name: teamName,
    codriver_name: coDriverName,
    selected_day_label: dayLabel,
    total_time: timingLabel,
    performance_time: getFirstPayloadValue(payload, ["performance_time", "performanceTimeDisplay"]) || timingLabel,
    points,
    rank: rankLabel,
  };
  const entry = {
    key: `${categoryKey}|${trackKey}|${stickerNumber || driverName}|${dayLabel}`,
    dayLabel,
    dayOrder: 1,
    timingLabel,
    pointsLabel: `${points} pts`,
    rankLabel: rankLabel ? (String(rankLabel).toUpperCase().startsWith("P") ? String(rankLabel).toUpperCase() : `P${rankLabel}`) : "",
  };
  const summary = {
    trackKey,
    trackLabel,
    totalPoints: points,
    entries: [entry],
  };

  return {
    generatedAt: new Date().toISOString(),
    source: "tko-app-track-upload",
    schemaVersion: 1,
    focusCategory: categoryKey,
    teams: [{
      id: `${categoryKey}-${stickerNumber || driverName}`,
      team_name: teamName,
      driver_name: driverName,
      codriver_name: coDriverName,
      car_number: stickerNumber,
      category: categoryKey,
      status: "ACTIVE",
    }],
    results: [result],
    disputes: [],
    categoryOptions: [{ key: categoryKey, label: categoryLabel }],
    leaderboard: {
      categories: [{
        key: categoryKey,
        label: categoryLabel,
        tracks: [trackLabel],
        rows: [{
          vehicleKey: `${categoryKey}|${stickerNumber || driverName}`,
          stickerNumber,
          teamName,
          driverName,
          coDriverName,
          totalPoints: points,
          totalTimingMs: null,
          totalTimingLabel: timingLabel,
          trackMap: { [trackKey]: summary },
          trackSummaries: [summary],
        }],
      }],
    },
  };
};

const normalizeIncomingSnapshot = payload => {
  const unwrappedPayload = unwrapIncomingSnapshot(payload);

  return isSingleLeaderboardResultPayload(unwrappedPayload)
    ? createSnapshotFromSingleResult(unwrappedPayload)
    : unwrappedPayload;
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

const getSnapshotTime = snapshot => {
  const timestamp = Date.parse(snapshot?.generatedAt || snapshot?.updatedAt || "");
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const getSnapshotCategoryCount = snapshot =>
  Array.isArray(snapshot?.leaderboard?.categories)
    ? snapshot.leaderboard.categories.length
    : Array.isArray(snapshot?.categories)
      ? snapshot.categories.length
      : 0;

async function readSharedSnapshot({ optional = false } = {}) {
  const attempts = [];

  if (hasSheetsConfig()) {
    attempts.push(() => readLeaderboardSnapshotFromSheets());
  }

  if (hasDriveConfig()) {
    attempts.push(() => readJsonFromDrive(LEADERBOARD_FILE_NAME));
  }

  attempts.push(() => readLocalSnapshot());

  const snapshots = [];

  for (const attempt of attempts) {
    try {
      const snapshot = await attempt();
      const localSnapshot = await readLocalSnapshot().catch(() => null);
      snapshots.push(stripSeedLeaderboardSnapshot(preserveMissingLeaderboardCategories(snapshot, localSnapshot)));
    } catch (error) {
      if (!optional) {
        console.warn("[LEADERBOARD] Snapshot storage read failed:", error?.message || error);
      }
    }
  }

  if (snapshots.length) {
    return snapshots.sort((left, right) => {
      const timeDelta = getSnapshotTime(right) - getSnapshotTime(left);
      if (timeDelta !== 0) {
        return timeDelta;
      }

      return getSnapshotCategoryCount(right) - getSnapshotCategoryCount(left);
    })[0];
  }

  if (optional) {
    return null;
  }

  throw new Error("Leaderboard export file not found");
}

export async function POST(request) {
  try {
    const incomingSnapshot = normalizeIncomingSnapshot(await readOptionalJsonBody(request));

    if (incomingSnapshot === null || isEmptyObject(incomingSnapshot)) {
      return createUsableResponse({ skipped: true });
    }

    if (!incomingSnapshot || typeof incomingSnapshot !== "object" || Array.isArray(incomingSnapshot)) {
      return NextResponse.json(
        { ok: false, error: "Invalid leaderboard payload" },
        { status: 400, headers: corsHeaders }
      );
    }

    const existingSnapshot = stripSeedLeaderboardSnapshot(await readSharedSnapshot({ optional: true }));
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

    const persistence = await persistLeaderboardSnapshot(snapshot);

    return NextResponse.json(
      {
        ok: true,
        success: true,
        usable: true,
        available: true,
        syncAvailable: true,
        acceptsPost: true,
        canSync: true,
        savedTo: persistence.file?.webViewLink || "/leaderboard-export.json",
        generatedAt: snapshot?.generatedAt || null,
        cachedLocally: persistence.cachedLocally,
        database: getStorageMode(),
        persistedToDatabase: persistence.persistedToSheets || persistence.persistedToDrive,
        persistedToSheets: persistence.persistedToSheets,
        persistedToDrive: persistence.persistedToDrive,
        warnings: persistence.warnings,
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
    const cachedLocally = await trySaveLocalSnapshot(snapshot);
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
