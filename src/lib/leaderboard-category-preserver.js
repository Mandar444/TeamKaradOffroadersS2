const normalizeText = value => String(value || "").trim();

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

const getCategoryKey = item =>
  normalizeCategoryKey(item?.key || item?.category || item?.category_key || item?.categoryKey || item?.label || "");

const getCategoryRows = category => Array.isArray(category?.rows) ? category.rows : [];

const getSnapshotCategories = snapshot =>
  Array.isArray(snapshot?.leaderboard?.categories)
    ? snapshot.leaderboard.categories
    : Array.isArray(snapshot?.categories)
      ? snapshot.categories
      : [];

const getSnapshotCategoryKeys = snapshot =>
  new Set(getSnapshotCategories(snapshot).map(getCategoryKey).filter(Boolean));

const mergeCategoryOptions = (primaryOptions = [], fallbackOptions = [], addedCategoryKeys = new Set()) => {
  const optionsByKey = new Map();

  primaryOptions.forEach(option => {
    const key = getCategoryKey(option);
    if (key) {
      optionsByKey.set(key, option);
    }
  });

  fallbackOptions.forEach(option => {
    const key = getCategoryKey(option);
    if (key && addedCategoryKeys.has(key) && !optionsByKey.has(key)) {
      optionsByKey.set(key, option);
    }
  });

  return [...optionsByKey.values()];
};

const appendMissingCategoryItems = (primaryItems = [], fallbackItems = [], addedCategoryKeys = new Set()) => {
  if (!addedCategoryKeys.size) {
    return primaryItems;
  }

  const primaryKeys = new Set(primaryItems.map(getCategoryKey).filter(Boolean));
  const missingItems = fallbackItems.filter(item => {
    const key = getCategoryKey(item);
    return key && addedCategoryKeys.has(key) && !primaryKeys.has(key);
  });

  return [...primaryItems, ...missingItems];
};

export function preserveMissingLeaderboardCategories(primarySnapshot, fallbackSnapshot) {
  if (!primarySnapshot || !fallbackSnapshot) {
    return primarySnapshot;
  }

  const primaryCategories = getSnapshotCategories(primarySnapshot);
  const fallbackCategories = getSnapshotCategories(fallbackSnapshot);

  if (!primaryCategories.length || !fallbackCategories.length) {
    return primarySnapshot;
  }

  const primaryCategoriesByKey = new Map();
  primaryCategories.forEach(category => {
    const key = getCategoryKey(category);
    if (key) {
      primaryCategoriesByKey.set(key, category);
    }
  });

  const addedCategoryKeys = new Set();
  const categories = [...primaryCategories];

  fallbackCategories.forEach(fallbackCategory => {
    const key = getCategoryKey(fallbackCategory);
    const primaryCategory = primaryCategoriesByKey.get(key);
    const primaryHasRows = getCategoryRows(primaryCategory).length > 0;
    const fallbackHasRows = getCategoryRows(fallbackCategory).length > 0;

    if (key && fallbackHasRows && !primaryHasRows) {
      addedCategoryKeys.add(key);
      if (primaryCategory) {
        const index = categories.findIndex(category => getCategoryKey(category) === key);
        categories[index] = fallbackCategory;
      } else {
        categories.push(fallbackCategory);
      }
    }
  });

  if (!addedCategoryKeys.size) {
    return primarySnapshot;
  }

  return {
    ...primarySnapshot,
    teams: appendMissingCategoryItems(primarySnapshot.teams || [], fallbackSnapshot.teams || [], addedCategoryKeys),
    results: appendMissingCategoryItems(primarySnapshot.results || [], fallbackSnapshot.results || [], addedCategoryKeys),
    disputes: appendMissingCategoryItems(primarySnapshot.disputes || [], fallbackSnapshot.disputes || [], addedCategoryKeys),
    categoryOptions: mergeCategoryOptions(primarySnapshot.categoryOptions || [], fallbackSnapshot.categoryOptions || [], addedCategoryKeys),
    leaderboard: {
      ...(primarySnapshot.leaderboard || {}),
      categories,
    },
    __restoredCategoryKeys: [
      ...new Set([
        ...(Array.isArray(primarySnapshot.__restoredCategoryKeys) ? primarySnapshot.__restoredCategoryKeys : []),
        ...addedCategoryKeys,
      ]),
    ],
  };
}

export function hasMoreLeaderboardCategories(leftSnapshot, rightSnapshot) {
  return getSnapshotCategoryKeys(rightSnapshot).size > getSnapshotCategoryKeys(leftSnapshot).size;
}

const DUMMY_NAME_PATTERNS = [
  /\bTrail Blazers\b/i,
  /\bRidge Runners\b/i,
  /\bMud Masters\b/i,
  /\bRock Crawlers\b/i,
  /\bValley Torque\b/i,
  /\bSummit Seekers\b/i,
  /\bRiver Raiders\b/i,
  /\bJungle Kings\b/i,
  /\bDesert Stormers\b/i,
  /\bHill Hunters\b/i,
];

const getTeamName = item =>
  normalizeText(item?.teamName || item?.team_name || item?.team || "");

const hasDummyName = item => DUMMY_NAME_PATTERNS.some(pattern => pattern.test(getTeamName(item)));

export function isSeedLeaderboardSnapshot(snapshot) {
  const teams = Array.isArray(snapshot?.teams) ? snapshot.teams : [];
  const rows = getSnapshotCategories(snapshot).flatMap(category => getCategoryRows(category));
  const namedItems = [...teams, ...rows].filter(item => getTeamName(item));

  if (!namedItems.length) {
    return false;
  }

  const dummyNameCount = namedItems.filter(hasDummyName).length;

  return dummyNameCount >= 5 && dummyNameCount / namedItems.length > 0.35;
}

export function stripSeedLeaderboardSnapshot(snapshot) {
  if (!isSeedLeaderboardSnapshot(snapshot)) {
    return snapshot;
  }

  return {
    ...(snapshot || {}),
    generatedAt: null,
    source: "cleaned-seed-leaderboard",
    teams: [],
    results: [],
    disputes: [],
    categoryOptions: [],
    leaderboard: {
      ...(snapshot?.leaderboard || {}),
      categories: [],
    },
  };
}
