const normalizeText = value => String(value || "").trim();

export const LEADERBOARD_CSV_CATEGORIES = [
  {
    key: "OPEN",
    label: "Open",
    fileName: "open.csv",
    tracks: ["CHANDOLI", "TADOBA", "SUNDARBAN", "RANTHAMBORE", "KANHA", "JIM CORBETT", "KAZIRANGA"],
  },
  {
    key: "DIESEL_MODIFIED",
    label: "Diesel Modified",
    fileName: "diesel-modified.csv",
    tracks: ["SHIVNERI", "RAIGAD", "PARATAPGAD", "HARIHAR", "VASOTA", "LOHGAD", "SARASGAD"],
  },
  {
    key: "PETROL_MODIFIED",
    label: "Petrol Modified",
    fileName: "petrol-modified.csv",
    tracks: ["SHIVNERI", "RAIGAD", "PARATAPGAD", "HARIHAR", "VASOTA", "LOHGAD", "SARASGAD"],
  },
  {
    key: "DIESEL_EXPERT",
    label: "Diesel Expert",
    fileName: "diesel-expert.csv",
    tracks: ["KRISHNA", "KOYANA", "GODAVARI", "GANGA", "YAMUNA", "SARASWATI", "CHANDRABHAGA"],
  },
  {
    key: "PETROL_EXPERT",
    label: "Petrol Expert",
    fileName: "petrol-expert.csv",
    tracks: ["KRISHNA", "KOYANA", "GODAVARI", "GANGA", "YAMUNA", "SARASWATI", "CHANDRABHAGA"],
  },
  {
    key: "THAR_SUV",
    label: "Thar SUV",
    fileName: "thar-suv.csv",
    tracks: ["K2", "EVEREST", "SAHYADRI", "HIMALAYA", "KALASUBAI", "VALMIKI", "SATPUDA"],
  },
  {
    key: "JIMNY_SUV",
    label: "Jimny SUV",
    fileName: "jimny-suv.csv",
    tracks: ["K2", "EVEREST", "SAHYADRI", "HIMALAYA", "KALASUBAI", "VALMIKI", "SATPUDA"],
  },
  {
    key: "SUV_MODIFIED",
    label: "SUV Modified",
    fileName: "suv-modified.csv",
    tracks: ["TAMHINI", "AMBOLI", "SAHYADRI", "PASARANI", "KALASUBAI", "VALMIKI", "SATPUDA"],
  },
  {
    key: "STOCK_NDMS",
    label: "Stock NDMS",
    fileName: "stock-ndms.csv",
    tracks: ["K2", "EVEREST", "SAHYADRI", "HIMALAYA", "KALASUBAI", "VALMIKI", "SATPUDA"],
  },
  {
    key: "LADIES_CATEGORY",
    label: "Ladies Category",
    fileName: "ladies-category.csv",
    tracks: ["K2", "EVEREST", "SAHYADRI", "HIMALAYA", "KALASUBAI", "VALMIKI", "SATPUDA"],
  },
];

export const CSV_BASE_HEADERS = [
  "position",
  "category_key",
  "category_label",
  "sticker_number",
  "team_name",
  "driver_name",
  "codriver_name",
  "total_points",
  "total_timing_ms",
  "total_timing_label",
];

export const normalizeCsvHeader = value =>
  normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

export const normalizeTrackKey = value => normalizeCsvHeader(value);

export const normalizeCsvCategoryKey = value => {
  const normalized = normalizeText(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (normalized === "LADIES") {
    return "LADIES_CATEGORY";
  }

  return normalized;
};

export const formatCsvCategoryLabel = value =>
  normalizeText(value)
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, letter => letter.toUpperCase()) || "Category";

export const getCsvCategoryDefinition = categoryKey => {
  const normalizedKey = normalizeCsvCategoryKey(categoryKey);
  return LEADERBOARD_CSV_CATEGORIES.find(category => category.key === normalizedKey) || null;
};

export const getCsvHeadersForCategory = category => {
  const definition = typeof category === "string" ? getCsvCategoryDefinition(category) : category;
  const trackHeaders = (definition?.tracks || []).flatMap(track => {
    const trackKey = normalizeTrackKey(track);
    return [`${trackKey}_time`, `${trackKey}_points`, `${trackKey}_rank`, `${trackKey}_day`];
  });

  return [...CSV_BASE_HEADERS, ...trackHeaders];
};

export const escapeCsvValue = value => {
  const rawValue = value === null || value === undefined ? "" : String(value);

  if (/[",\r\n]/.test(rawValue)) {
    return `"${rawValue.replace(/"/g, '""')}"`;
  }

  return rawValue;
};

export const stringifyCsv = (headers, rows) => [
  headers.map(escapeCsvValue).join(","),
  ...rows.map(row => headers.map(header => escapeCsvValue(row?.[header] ?? "")).join(",")),
].join("\r\n");

export function parseCsv(csvText) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  const text = String(csvText || "");

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        field += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }

      row.push(field);
      if (row.some(value => normalizeText(value))) {
        rows.push(row);
      }
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  row.push(field);
  if (row.some(value => normalizeText(value))) {
    rows.push(row);
  }

  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0].map(normalizeCsvHeader);

  return rows.slice(1).map(values =>
    headers.reduce((record, header, index) => {
      if (header) {
        record[header] = normalizeText(values[index]);
      }
      return record;
    }, {})
  );
}

const getFirstValue = (record, keys) => {
  for (const key of keys) {
    const value = record?.[key];

    if (value !== null && value !== undefined && value !== "") {
      return value;
    }
  }

  return "";
};

const parseNumericValue = value => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numericValue = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(numericValue) ? numericValue : null;
};

const parseTimingMs = value => {
  const rawValue = normalizeText(value);
  if (!rawValue) {
    return null;
  }

  const numericValue = parseNumericValue(rawValue);
  if (numericValue !== null && !rawValue.includes(":")) {
    return Math.round(numericValue);
  }

  const parts = rawValue.split(":").map(part => Number(part));
  if (parts.some(part => !Number.isFinite(part))) {
    return null;
  }

  if (parts.length === 3) {
    const [minutes, seconds, centiseconds] = parts;
    return Math.round(((minutes * 60) + seconds) * 1000 + centiseconds * 10);
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return Math.round(((minutes * 60) + seconds) * 1000);
  }

  return null;
};

const normalizeDayLabel = value => {
  const rawValue = normalizeText(value);
  if (!rawValue) {
    return "D1";
  }

  const dayMatch = rawValue.match(/(?:day|d)\s*(\d+)/i) || rawValue.match(/^(\d+)$/);
  return dayMatch ? `D${dayMatch[1]}` : rawValue;
};

const normalizeDayId = value => {
  const dayLabel = normalizeDayLabel(value);
  const dayMatch = dayLabel.match(/D(\d+)/i);
  return dayMatch ? `day-${dayMatch[1]}` : normalizeCsvHeader(dayLabel) || "day-1";
};

const createResultRecord = ({ category, row, trackLabel, trackKey, entry, points }) => {
  const now = new Date().toISOString();
  const submission = {
    source: "csv-upload",
    selectedDayId: normalizeDayId(entry.dayLabel),
    selectedDayLabel: entry.dayLabel,
    trackName: trackLabel,
    category: category.label,
    teamName: row.teamName,
    stickerNumber: row.stickerNumber,
    driverName: row.driverName,
    coDriverName: row.coDriverName,
    completionTime: entry.timingLabel,
    performanceTimeDisplay: entry.timingLabel,
    totalTimeDisplay: entry.timingLabel,
    totalTimeMilliseconds: parseTimingMs(entry.timingLabel),
    totalPenaltiesTime: 0,
    isDNF: false,
    isDNS: false,
    dnfPoints: 0,
  };

  return {
    id: `${category.key}-${trackKey}-${row.stickerNumber}-${entry.dayLabel}`,
    track_name: trackLabel,
    sticker_number: row.stickerNumber,
    driver_name: row.driverName,
    codriver_name: row.coDriverName,
    category: category.label,
    bunting_count: 0,
    seatbelt_count: 0,
    ground_touch_count: 0,
    late_start_count: 0,
    attempt_count: 0,
    task_skipped_count: 0,
    wrong_course_count: 0,
    fourth_attempt_count: 0,
    is_dns: 0,
    total_penalties_time: 0,
    performance_time: entry.timingLabel,
    total_time: entry.timingLabel,
    points,
    created_at: now,
    selected_day_id: normalizeDayId(entry.dayLabel),
    selected_day_label: entry.dayLabel,
    submission_json: JSON.stringify(submission),
    selectedDayId: normalizeDayId(entry.dayLabel),
    selectedDayLabel: entry.dayLabel,
  };
};

export function buildLeaderboardSnapshotFromCsv(csvText, requestedCategoryKey = "") {
  const records = parseCsv(csvText);
  const firstCategoryKey = getFirstValue(records[0], ["category_key", "category"]) || requestedCategoryKey;
  const categoryDefinition = getCsvCategoryDefinition(requestedCategoryKey || firstCategoryKey);

  if (!categoryDefinition) {
    throw new Error("Unknown category. Use one of the provided category CSV templates.");
  }

  const category = {
    ...categoryDefinition,
    tracks: categoryDefinition.tracks.map(track => ({
      key: normalizeTrackKey(track),
      label: track,
      maxPoints: 100,
    })),
  };
  const usableRecords = records.filter(record =>
    getFirstValue(record, ["sticker_number", "sticker", "car_number"]) ||
    getFirstValue(record, ["team_name", "team"]) ||
    getFirstValue(record, ["driver_name", "driver"])
  );
  const rows = usableRecords
    .map((record, index) => {
      const stickerNumber = getFirstValue(record, ["sticker_number", "sticker", "car_number"]) || `${index + 1}`;
      const driverName = getFirstValue(record, ["driver_name", "driver"]) || "--";
      const row = {
        position: parseNumericValue(record.position) || index + 1,
        vehicleKey: `${category.key}|${stickerNumber}`,
        stickerNumber,
        teamName: getFirstValue(record, ["team_name", "team"]) || "--",
        driverName,
        coDriverName: getFirstValue(record, ["codriver_name", "co_driver_name", "codriver", "co_driver"]) || "--",
        totalPoints: 0,
        totalTimingMs: parseNumericValue(record.total_timing_ms),
        totalTimingLabel: normalizeText(record.total_timing_label),
        trackMap: {},
        trackSummaries: [],
      };

      category.tracks.forEach(track => {
        const time = normalizeText(record[`${track.key}_time`]);
        const points = parseNumericValue(record[`${track.key}_points`]) || 0;
        const rank = normalizeText(record[`${track.key}_rank`]);
        const dayLabel = normalizeDayLabel(record[`${track.key}_day`]);
        const hasEntry = Boolean(time || points || rank);
        const entry = hasEntry
          ? {
              key: `${category.key}|${track.key}|${stickerNumber}|${driverName.toLowerCase()}|${normalizeDayId(dayLabel)}`,
              dayLabel,
              dayOrder: parseNumericValue(dayLabel) || 1,
              timingLabel: time || "NA",
              pointsLabel: `${points} pts`,
              rankLabel: rank ? (rank.toUpperCase().startsWith("P") ? rank.toUpperCase() : `P${rank}`) : "",
            }
          : null;
        const summary = {
          trackKey: track.key,
          trackLabel: track.label,
          totalPoints: points,
          entries: entry ? [entry] : [],
        };

        row.trackMap[track.key] = summary;
        row.trackSummaries.push(summary);
      });

      const summedPoints = row.trackSummaries.reduce((total, summary) => total + summary.totalPoints, 0);
      row.totalPoints = parseNumericValue(record.total_points) ?? summedPoints;
      row.totalTimingMs = row.totalTimingMs ?? parseTimingMs(row.totalTimingLabel);

      return row;
    })
    .sort((a, b) => a.position - b.position)
    .map(({ position, ...row }) => row);
  const resultRecords = rows.flatMap(row =>
    category.tracks.flatMap(track => {
      const summary = row.trackMap[track.key];
      return (summary?.entries || []).map(entry =>
        createResultRecord({
          category,
          row,
          trackLabel: track.label,
          trackKey: track.key,
          entry,
          points: summary.totalPoints,
        })
      );
    })
  );

  return {
    generatedAt: new Date().toISOString(),
    source: "csv-upload",
    schemaVersion: 1,
    focusCategory: category.key,
    teams: rows.map((row, index) => ({
      id: `${category.key}-${row.stickerNumber || index + 1}`,
      team_name: row.teamName,
      driver_name: row.driverName,
      codriver_name: row.coDriverName,
      car_number: row.stickerNumber,
      category: category.key,
      status: "ACTIVE",
    })),
    results: resultRecords,
    disputes: [],
    categoryOptions: [{ key: category.key, label: category.label }],
    leaderboard: {
      categories: [
        {
          key: category.key,
          label: category.label,
          tracks: category.tracks.map(track => track.label),
          rows,
        },
      ],
    },
  };
}

const getItemCategoryKey = item =>
  normalizeCsvCategoryKey(item?.category || item?.key || item?.category_key || item?.label || "");

export function mergeLeaderboardCategorySnapshot(existingSnapshot, categorySnapshot) {
  const focusCategory = normalizeCsvCategoryKey(categorySnapshot?.focusCategory);
  const keepOtherCategory = item => getItemCategoryKey(item) !== focusCategory;
  const existing = existingSnapshot || {};

  if (!focusCategory) {
    return categorySnapshot;
  }

  return {
    ...existing,
    ...categorySnapshot,
    source: "csv-upload",
    generatedAt: categorySnapshot.generatedAt,
    schemaVersion: 1,
    focusCategory,
    teams: [
      ...(Array.isArray(existing.teams) ? existing.teams.filter(keepOtherCategory) : []),
      ...(Array.isArray(categorySnapshot.teams) ? categorySnapshot.teams : []),
    ],
    results: [
      ...(Array.isArray(existing.results) ? existing.results.filter(keepOtherCategory) : []),
      ...(Array.isArray(categorySnapshot.results) ? categorySnapshot.results : []),
    ],
    disputes: Array.isArray(existing.disputes) ? existing.disputes.filter(keepOtherCategory) : [],
    categoryOptions: [
      ...(Array.isArray(existing.categoryOptions) ? existing.categoryOptions.filter(keepOtherCategory) : []),
      ...(Array.isArray(categorySnapshot.categoryOptions) ? categorySnapshot.categoryOptions : []),
    ],
    leaderboard: {
      ...(existing.leaderboard || {}),
      ...(categorySnapshot.leaderboard || {}),
      categories: [
        ...(Array.isArray(existing.leaderboard?.categories)
          ? existing.leaderboard.categories.filter(keepOtherCategory)
          : []),
        ...(Array.isArray(categorySnapshot.leaderboard?.categories)
          ? categorySnapshot.leaderboard.categories
          : []),
      ],
    },
  };
}
