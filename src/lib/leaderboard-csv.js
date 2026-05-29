const normalizeText = value => String(value || "").trim();

export const LEADERBOARD_CSV_CATEGORIES = [
  {
    key: "OPEN",
    label: "Open",
    fileName: "open.csv",
    detailFileName: "open-entry-details.csv",
    tracks: ["CHANDOLI", "TADOBA", "SUNDARBAN", "RANTHAMBORE", "KANHA", "JIM CORBETT", "KAZIRANGA"],
  },
  {
    key: "DIESEL_MODIFIED",
    label: "Diesel Modified",
    fileName: "diesel-modified.csv",
    detailFileName: "diesel-modified-entry-details.csv",
    tracks: ["SHIVNERI", "RAIGAD", "PARATAPGAD", "HARIHAR", "VASOTA", "LOHGAD", "SARASGAD"],
  },
  {
    key: "PETROL_MODIFIED",
    label: "Petrol Modified",
    fileName: "petrol-modified.csv",
    detailFileName: "petrol-modified-entry-details.csv",
    tracks: ["SHIVNERI", "RAIGAD", "PARATAPGAD", "HARIHAR", "VASOTA", "LOHGAD", "SARASGAD"],
  },
  {
    key: "DIESEL_EXPERT",
    label: "Diesel Expert",
    fileName: "diesel-expert.csv",
    detailFileName: "diesel-expert-entry-details.csv",
    tracks: ["KRISHNA", "KOYANA", "GODAVARI", "GANGA", "YAMUNA", "SARASWATI", "CHANDRABHAGA"],
  },
  {
    key: "PETROL_EXPERT",
    label: "Petrol Expert",
    fileName: "petrol-expert.csv",
    detailFileName: "petrol-expert-entry-details.csv",
    tracks: ["KRISHNA", "KOYANA", "GODAVARI", "GANGA", "YAMUNA", "SARASWATI", "CHANDRABHAGA"],
  },
  {
    key: "THAR_SUV",
    label: "Thar SUV",
    fileName: "thar-suv.csv",
    detailFileName: "thar-suv-entry-details.csv",
    tracks: ["K2", "EVEREST", "SAHYADRI", "HIMALAYA", "KALASUBAI", "VALMIKI", "SATPUDA"],
  },
  {
    key: "JIMNY_SUV",
    label: "Jimny SUV",
    fileName: "jimny-suv.csv",
    detailFileName: "jimny-suv-entry-details.csv",
    tracks: ["K2", "EVEREST", "SAHYADRI", "HIMALAYA", "KALASUBAI", "VALMIKI", "SATPUDA"],
  },
  {
    key: "SUV_MODIFIED",
    label: "SUV Modified",
    fileName: "suv-modified.csv",
    detailFileName: "suv-modified-entry-details.csv",
    tracks: ["TAMHINI", "AMBOLI", "SAHYADRI", "PASARANI", "KALASUBAI", "VALMIKI", "SATPUDA"],
  },
  {
    key: "STOCK_NDMS",
    label: "Stock NDMS",
    fileName: "stock-ndms.csv",
    detailFileName: "stock-ndms-entry-details.csv",
    tracks: ["K2", "EVEREST", "SAHYADRI", "HIMALAYA", "KALASUBAI", "VALMIKI", "SATPUDA"],
  },
  {
    key: "LADIES_CATEGORY",
    label: "Ladies Category",
    fileName: "ladies-category.csv",
    detailFileName: "ladies-category-entry-details.csv",
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

export const ENTRY_DETAIL_CSV_HEADERS = [
  "category_key",
  "category_label",
  "sr_no",
  "sticker_number",
  "team_name",
  "driver_name",
  "codriver_name",
  "track_name",
  "selected_day_id",
  "selected_day_label",
  "selected_day_date",
  "rank",
  "points",
  "completion_time",
  "performance_time",
  "performance_time_ms",
  "total_penalties_time",
  "total_time",
  "total_time_ms",
  "track_timer_limit_display",
  "bunting_count",
  "bunting_penalty_time",
  "pole_down_count",
  "pole_down_penalty_time",
  "seatbelt_count",
  "seatbelt_penalty_time",
  "ground_touch_count",
  "ground_touch_penalty_time",
  "late_start_mode",
  "late_start_status",
  "late_start_count",
  "late_start_penalty_time",
  "late_start_penalty_points",
  "attempt_count",
  "attempt_penalty_time",
  "task_skipped_count",
  "task_skipped_penalty_time",
  "is_dns",
  "is_dnf",
  "wrong_course_selected",
  "fourth_attempt_selected",
  "time_over_selected",
  "vehicle_out_of_track_selected",
  "vehicle_breakdown_selected",
  "dnf_selection",
  "dnf_points",
  "dispute_details",
  "dispute_resolutions",
  "dispute_signatures",
  "dispute_signed_by",
  "dispute_resolution_status",
  "dispute_resolution_label",
  "submission_json",
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

export const getEntryDetailCsvHeaders = () => ENTRY_DETAIL_CSV_HEADERS;

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

const safeParseJsonObject = value => {
  if (!value) {
    return {};
  }

  try {
    const parsedValue = JSON.parse(value);
    return parsedValue && typeof parsedValue === "object" && !Array.isArray(parsedValue) ? parsedValue : {};
  } catch (error) {
    return {};
  }
};

const safeParseJsonValue = value => {
  if (!value || typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

const parseBooleanValue = value => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  const normalizedValue = normalizeText(value).toLowerCase();
  return ["1", "true", "yes", "y", "on"].includes(normalizedValue);
};

const normalizeRankLabel = value => {
  const rank = normalizeText(value);

  if (!rank) {
    return "";
  }

  return rank.toUpperCase().startsWith("P") ? rank.toUpperCase() : `P${rank}`;
};

const getCategoryTrack = (category, trackName) => {
  const normalizedTrackKey = normalizeTrackKey(trackName);
  return category.tracks.find(track =>
    track.key === normalizedTrackKey || normalizeTrackKey(track.label) === normalizedTrackKey
  ) || {
    key: normalizedTrackKey,
    label: normalizeText(trackName) || "Track",
    maxPoints: 100,
  };
};

const hasDetailCsvShape = records =>
  records.some(record =>
    normalizeText(record.track_name || record.track || record.track_label) ||
    normalizeText(record.performance_time || record.total_time || record.completion_time)
  );

const getCsvRecordIdentity = record => {
  const parsedSubmission = safeParseJsonObject(record.submission_json);
  const source = { ...parsedSubmission, ...record };
  return {
    stickerNumber:
      getFirstValue(source, ["sticker_number", "stickerNumber", "sticker", "car_number", "carNumber"]) || "",
    teamName: getFirstValue(source, ["team_name", "teamName", "team"]) || "--",
    driverName: getFirstValue(source, ["driver_name", "driverName", "driver"]) || "--",
    coDriverName:
      getFirstValue(source, ["codriver_name", "coDriverName", "co_driver_name", "codriver", "co_driver"]) || "--",
  };
};

const getCsvDetailTimingLabel = record =>
  getFirstValue(record, [
    "total_time",
    "totalTimeDisplay",
    "total_time_display",
    "performance_time",
    "performanceTimeDisplay",
    "performance_time_display",
    "completion_time",
    "completionTime",
  ]) || "NA";

const getCsvDetailPoints = record => parseNumericValue(
  getFirstValue(record, ["points", "total_points", "score", "track_points", "dnf_points"])
) || 0;

const hasEntryDetailValue = record => {
  const timing = getFirstValue(record, [
    "total_time",
    "totalTimeDisplay",
    "total_time_display",
    "performance_time",
    "performanceTimeDisplay",
    "performance_time_display",
    "completion_time",
    "completionTime",
  ]);
  const points = getFirstValue(record, ["points", "total_points", "score", "track_points", "dnf_points"]);
  const rank = getFirstValue(record, ["rank", "rank_label", "position"]);
  const resultFlags = [
    "is_dns",
    "is_dnf",
    "wrong_course_selected",
    "fourth_attempt_selected",
    "time_over_selected",
    "vehicle_out_of_track_selected",
    "vehicle_breakdown_selected",
  ];

  return Boolean(
    timing ||
    points !== "" ||
    rank ||
    resultFlags.some(flag => parseBooleanValue(record[flag]))
  );
};

const getCsvDetailDayLabel = record =>
  normalizeDayLabel(getFirstValue(record, ["selected_day_label", "selectedDayLabel", "day", "day_label"]));

const createDetailSubmissionJson = ({ record, category, identity, track, dayLabel, timingLabel, points }) => {
  const existingSubmission = safeParseJsonObject(record.submission_json);
  const selectedDayId = getFirstValue(record, ["selected_day_id", "selectedDayId"]) || normalizeDayId(dayLabel);
  const selectedDayDate = getFirstValue(record, ["selected_day_date", "selectedDayDate"]);
  const performanceTimeMs = parseNumericValue(
    getFirstValue(record, ["performance_time_ms", "performanceTimeMilliseconds", "completion_time_ms"])
  ) ?? parseTimingMs(getFirstValue(record, ["performance_time", "completion_time", "total_time"]));
  const totalTimeMs = parseNumericValue(getFirstValue(record, ["total_time_ms", "totalTimeMilliseconds"])) ??
    parseTimingMs(timingLabel);

  return {
    ...existingSubmission,
    source: existingSubmission.source || "csv-entry-upload",
    selectedDayId,
    selectedDayLabel: dayLabel,
    selectedDayDate,
    selected_day_id: selectedDayId,
    selected_day_label: dayLabel,
    selected_day_date: selectedDayDate,
    trackName: track.label,
    category: category.label,
    srNo: record.sr_no || existingSubmission.srNo || "",
    teamName: identity.teamName,
    stickerNumber: identity.stickerNumber,
    driverName: identity.driverName,
    coDriverName: identity.coDriverName,
    completionTime: getFirstValue(record, ["completion_time", "completionTime"]) || timingLabel,
    completionTimeMilliseconds: performanceTimeMs,
    performanceTimeDisplay: getFirstValue(record, ["performance_time", "performanceTimeDisplay"]) || timingLabel,
    trackTimerLimitDisplay: getFirstValue(record, ["track_timer_limit_display", "trackTimerLimitDisplay"]),
    bustingCount: getFirstValue(record, ["busting_count", "bunting_count", "buntingCount"]) || 0,
    poleDownCount: getFirstValue(record, ["pole_down_count", "poleDownCount"]) || 0,
    seatbeltCount: getFirstValue(record, ["seatbelt_count", "seatbeltCount"]) || 0,
    groundTouchCount: getFirstValue(record, ["ground_touch_count", "groundTouchCount"]) || 0,
    lateStartMode: getFirstValue(record, ["late_start_mode", "lateStartMode"]),
    lateStartStatus: getFirstValue(record, ["late_start_status", "lateStartStatus"]),
    lateStartPenaltyTime: getFirstValue(record, ["late_start_penalty_time", "lateStartPenaltyTime"]) || 0,
    lateStartPenaltyPoints: getFirstValue(record, ["late_start_penalty_points", "lateStartPenaltyPoints"]) || 0,
    attemptCount: getFirstValue(record, ["attempt_count", "attemptCount"]) || 0,
    taskSkippedCount: getFirstValue(record, ["task_skipped_count", "taskSkippedCount"]) || 0,
    isDNF: parseBooleanValue(getFirstValue(record, ["is_dnf", "isDNF", "isDnf"])),
    isDNS: parseBooleanValue(getFirstValue(record, ["is_dns", "isDNS", "isDns"])),
    wrongCourseSelected: parseBooleanValue(getFirstValue(record, ["wrong_course_selected", "wrongCourseSelected"])),
    fourthAttemptSelected: parseBooleanValue(getFirstValue(record, ["fourth_attempt_selected", "fourthAttemptSelected"])),
    timeOverSelected: parseBooleanValue(getFirstValue(record, ["time_over_selected", "timeOverSelected"])),
    vehicleOutOfTrackSelected: parseBooleanValue(
      getFirstValue(record, ["vehicle_out_of_track_selected", "vehicleOutOfTrackSelected"])
    ),
    vehicleBreakdownSelected: parseBooleanValue(
      getFirstValue(record, ["vehicle_breakdown_selected", "vehicleBreakdownSelected"])
    ),
    dnfSelection: getFirstValue(record, ["dnf_selection", "dnfSelection"]),
    dnfPoints: parseNumericValue(getFirstValue(record, ["dnf_points", "dnfPoints"])) || 0,
    bustingPenaltyTime: getFirstValue(record, ["busting_penalty_time", "bunting_penalty_time", "bustingPenaltyTime"]) || 0,
    poleDownPenaltyTime: getFirstValue(record, ["pole_down_penalty_time", "poleDownPenaltyTime"]) || 0,
    seatbeltPenaltyTime: getFirstValue(record, ["seatbelt_penalty_time", "seatbeltPenaltyTime"]) || 0,
    groundTouchPenaltyTime: getFirstValue(record, ["ground_touch_penalty_time", "groundTouchPenaltyTime"]) || 0,
    attemptPenaltyTime: getFirstValue(record, ["attempt_penalty_time", "attemptPenaltyTime"]) || 0,
    taskSkippedPenaltyTime: getFirstValue(record, ["task_skipped_penalty_time", "taskSkippedPenaltyTime"]) || 0,
    totalPenaltiesTime: getFirstValue(record, ["total_penalties_time", "totalPenaltiesTime"]) || 0,
    totalTimeMilliseconds: totalTimeMs,
    totalTimeDisplay: timingLabel,
    points,
    disputeDetails: safeParseJsonValue(record.dispute_details || existingSubmission.disputeDetails || []),
    dispute_details: safeParseJsonValue(record.dispute_details || existingSubmission.dispute_details || []),
    disputeResolutions: safeParseJsonValue(record.dispute_resolutions || existingSubmission.disputeResolutions || {}),
    dispute_resolutions: safeParseJsonValue(record.dispute_resolutions || existingSubmission.dispute_resolutions || {}),
    disputeSignatures: safeParseJsonValue(record.dispute_signatures || existingSubmission.disputeSignatures || {}),
    dispute_signatures: safeParseJsonValue(record.dispute_signatures || existingSubmission.dispute_signatures || {}),
    disputeSignedBy: safeParseJsonValue(record.dispute_signed_by || existingSubmission.disputeSignedBy || []),
    dispute_signed_by: safeParseJsonValue(record.dispute_signed_by || existingSubmission.dispute_signed_by || []),
    disputeResolutionStatus: getFirstValue(record, ["dispute_resolution_status", "disputeResolutionStatus"]),
    disputeResolutionLabel: getFirstValue(record, ["dispute_resolution_label", "disputeResolutionLabel"]),
  };
};

const createDetailResultRecord = ({ record, category, identity, track, dayLabel, entry, points }) => {
  const selectedDayId = getFirstValue(record, ["selected_day_id", "selectedDayId"]) || normalizeDayId(dayLabel);
  const selectedDayDate = getFirstValue(record, ["selected_day_date", "selectedDayDate"]);
  const submission = createDetailSubmissionJson({
    record,
    category,
    identity,
    track,
    dayLabel,
    timingLabel: entry.timingLabel,
    points,
  });

  return {
    ...record,
    id: record.id || `${category.key}-${track.key}-${identity.stickerNumber}-${selectedDayId}`,
    track_name: track.label,
    sticker_number: identity.stickerNumber,
    driver_name: identity.driverName,
    codriver_name: identity.coDriverName,
    category: category.label,
    bunting_count: getFirstValue(record, ["bunting_count", "busting_count"]) || 0,
    seatbelt_count: record.seatbelt_count || 0,
    ground_touch_count: record.ground_touch_count || 0,
    late_start_count: record.late_start_count || 0,
    attempt_count: record.attempt_count || 0,
    task_skipped_count: record.task_skipped_count || 0,
    wrong_course_count: record.wrong_course_count || 0,
    fourth_attempt_count: record.fourth_attempt_count || 0,
    is_dns: parseBooleanValue(record.is_dns) ? 1 : 0,
    is_dnf: parseBooleanValue(record.is_dnf) ? 1 : 0,
    total_penalties_time: record.total_penalties_time || 0,
    performance_time: getFirstValue(record, ["performance_time", "completion_time"]) || entry.timingLabel,
    total_time: record.total_time || entry.timingLabel,
    points,
    rank: entry.rankLabel,
    created_at: record.created_at || new Date().toISOString(),
    selected_day_id: selectedDayId,
    selected_day_label: dayLabel,
    selected_day_date: selectedDayDate,
    submission_json: JSON.stringify(submission),
    selectedDayId: selectedDayId,
    selectedDayLabel: dayLabel,
    selectedDayDate: selectedDayDate,
  };
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

function buildLeaderboardSnapshotFromEntryDetails(records, requestedCategoryKey = "") {
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
  const rowsByVehicle = new Map();
  const resultRecords = [];

  records
    .filter(record =>
      getFirstValue(record, ["track_name", "track", "track_label"]) &&
      (
        getFirstValue(record, ["sticker_number", "sticker", "car_number"]) ||
        getFirstValue(record, ["team_name", "team"]) ||
        getFirstValue(record, ["driver_name", "driver"])
      )
    )
    .forEach((record, index) => {
      const identity = getCsvRecordIdentity(record);
      const stickerNumber = identity.stickerNumber || `${index + 1}`;
      const vehicleKey = `${category.key}|${stickerNumber}`;
      const track = getCategoryTrack(category, getFirstValue(record, ["track_name", "track", "track_label"]));
      const dayLabel = getCsvDetailDayLabel(record);
      const hasEntry = hasEntryDetailValue(record);
      const points = hasEntry ? getCsvDetailPoints(record) : 0;
      const timingLabel = getCsvDetailTimingLabel(record);
      const entry = hasEntry ? {
        key: `${category.key}|${track.key}|${stickerNumber}|${identity.driverName.toLowerCase()}|${normalizeDayId(dayLabel)}`,
        dayLabel,
        dayOrder: parseNumericValue(dayLabel) || index + 1,
        timingLabel,
        pointsLabel: `${points} pts`,
        rankLabel: normalizeRankLabel(getFirstValue(record, ["rank", "rank_label", "position"])),
      } : null;

      if (!category.tracks.some(existingTrack => existingTrack.key === track.key)) {
        category.tracks.push(track);
      }

      if (!rowsByVehicle.has(vehicleKey)) {
        const trackMap = {};
        const trackSummaries = [];

        category.tracks.forEach(configuredTrack => {
          const emptySummary = {
            trackKey: configuredTrack.key,
            trackLabel: configuredTrack.label,
            totalPoints: 0,
            entries: [],
          };
          trackMap[configuredTrack.key] = emptySummary;
          trackSummaries.push(emptySummary);
        });

        rowsByVehicle.set(vehicleKey, {
          position: parseNumericValue(record.position) || index + 1,
          vehicleKey,
          stickerNumber,
          teamName: identity.teamName,
          driverName: identity.driverName,
          coDriverName: identity.coDriverName,
          totalPoints: 0,
          totalTimingMs: null,
          totalTimingLabel: "",
          trackMap,
          trackSummaries,
        });
      }

      const row = rowsByVehicle.get(vehicleKey);

      if (!row.trackMap[track.key]) {
        const summary = {
          trackKey: track.key,
          trackLabel: track.label,
          totalPoints: 0,
          entries: [],
        };
        row.trackMap[track.key] = summary;
        row.trackSummaries.push(summary);
      }

      if (entry) {
        row.trackMap[track.key].entries.push(entry);
        row.trackMap[track.key].totalPoints += points;
        row.totalPoints += points;
        resultRecords.push(
          createDetailResultRecord({ record, category, identity: { ...identity, stickerNumber }, track, dayLabel, entry, points })
        );
      }
    });

  const rows = [...rowsByVehicle.values()]
    .map(row => {
      const timingValues = row.trackSummaries
        .flatMap(summary => summary.entries || [])
        .map(entry => parseTimingMs(entry.timingLabel))
        .filter(value => value !== null);

      return {
        ...row,
        totalTimingMs: timingValues.length ? timingValues.reduce((total, value) => total + value, 0) : null,
      };
    })
    .sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }

      if (a.totalTimingMs !== null && b.totalTimingMs !== null) {
        return a.totalTimingMs - b.totalTimingMs;
      }

      return a.position - b.position;
    })
    .map(({ position, ...row }) => row);

  return {
    generatedAt: new Date().toISOString(),
    source: "csv-entry-upload",
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
    disputes: resultRecords.filter(record =>
      record.dispute_details ||
      record.dispute_resolutions ||
      record.dispute_resolution_status ||
      record.disputeResolutionStatus
    ),
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

export function buildLeaderboardSnapshotFromCsv(csvText, requestedCategoryKey = "") {
  const records = parseCsv(csvText);
  const firstCategoryKey = getFirstValue(records[0], ["category_key", "category"]) || requestedCategoryKey;
  const categoryDefinition = getCsvCategoryDefinition(requestedCategoryKey || firstCategoryKey);

  if (!categoryDefinition) {
    throw new Error("Unknown category. Use one of the provided category CSV templates.");
  }

  if (hasDetailCsvShape(records)) {
    return buildLeaderboardSnapshotFromEntryDetails(records, requestedCategoryKey);
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
