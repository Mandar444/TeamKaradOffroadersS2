const normalizeText = value => String(value || "").trim();

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

const normalizeCategoryKey = value => {
  const normalized = normalizeText(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (normalized === "OPEN_CATEGORY" || normalized === "EXTREME") {
    return "OPEN";
  }

  if (normalized === "LADIES") {
    return "LADIES_CATEGORY";
  }

  return normalized;
};

const getMergedSource = item => ({
  ...safeParseJsonObject(item?.submission_json),
  ...(item || {}),
});

const getDeletionKey = (item, fallbackCategoryKey = "") => {
  const source = getMergedSource(item);
  const categoryKey = normalizeCategoryKey(
    source?.category_key ||
      source?.categoryKey ||
      source?.category ||
      source?.key ||
      fallbackCategoryKey
  );
  const stickerNumber = normalizeText(
    source?.sticker_number ||
      source?.stickerNumber ||
      source?.sticker ||
      source?.car_number ||
      source?.carNumber
  ).replace(/^#/, "").toUpperCase();
  const driverName = normalizeText(source?.driver_name || source?.driverName || source?.driver).toLowerCase();

  return categoryKey && (stickerNumber || driverName)
    ? `${categoryKey}|${stickerNumber}|${driverName}`
    : "";
};

export const createLeaderboardVehicleDeletion = payload => ({
  category_key: normalizeCategoryKey(payload?.categoryKey || payload?.category_key || payload?.category),
  sticker_number: normalizeText(payload?.stickerNumber || payload?.sticker_number || payload?.sticker)
    .replace(/^#/, "")
    .toUpperCase(),
  driver_name: normalizeText(payload?.driverName || payload?.driver_name || payload?.driver).toUpperCase(),
  deleted_at: new Date().toISOString(),
});

export const removeLeaderboardVehicleDeletion = (deletions = [], item, fallbackCategoryKey = "") => {
  const itemKey = getDeletionKey(item, fallbackCategoryKey);

  return (Array.isArray(deletions) ? deletions : []).filter(deletion => getDeletionKey(deletion) !== itemKey);
};

export const filterDeletedLeaderboardVehicleRecords = snapshot => {
  const deletions = Array.isArray(snapshot?.deletedVehicleRecords) ? snapshot.deletedVehicleRecords : [];
  const deletionKeys = new Set(deletions.map(deletion => getDeletionKey(deletion)).filter(Boolean));

  if (!deletionKeys.size) {
    return snapshot;
  }

  const isDeleted = (item, fallbackCategoryKey = "") => deletionKeys.has(getDeletionKey(item, fallbackCategoryKey));

  return {
    ...snapshot,
    teams: (Array.isArray(snapshot?.teams) ? snapshot.teams : []).filter(team => !isDeleted(team)),
    results: (Array.isArray(snapshot?.results) ? snapshot.results : []).filter(record => !isDeleted(record)),
    disputes: (Array.isArray(snapshot?.disputes) ? snapshot.disputes : []).filter(record => !isDeleted(record)),
    leaderboard: {
      ...(snapshot?.leaderboard || {}),
      categories: (Array.isArray(snapshot?.leaderboard?.categories) ? snapshot.leaderboard.categories : []).map(category => ({
        ...category,
        rows: (Array.isArray(category?.rows) ? category.rows : []).filter(row => !isDeleted(row, category?.key || category?.category || category?.label)),
      })),
    },
  };
};
