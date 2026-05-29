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

export const FULL_LEADERBOARD_CSV_HEADERS = [
  ...new Set([
    ...CSV_BASE_HEADERS,
    ...ENTRY_DETAIL_CSV_HEADERS,
  ]),
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

  if (normalized === "OPEN_CATEGORY" || normalized === "EXTREME") {
    return "OPEN";
  }

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

export const getFullLeaderboardCsvHeaders = () => FULL_LEADERBOARD_CSV_HEADERS;

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

const toCsvJsonValue = value => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value);
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

const getResultCategoryKey = record => {
  const parsedSubmission = safeParseJsonObject(record?.submission_json);
  return normalizeCsvCategoryKey(
    record?.category_key ||
      record?.categoryKey ||
      record?.category ||
      parsedSubmission?.category_key ||
      parsedSubmission?.categoryKey ||
      parsedSubmission?.category ||
      ""
  );
};

const getResultVehicleKey = (record, fallbackCategoryKey = "") => {
  const parsedSubmission = safeParseJsonObject(record?.submission_json);
  const source = { ...parsedSubmission, ...record };
  const categoryKey = normalizeCsvCategoryKey(
    source?.category_key ||
      source?.categoryKey ||
      source?.category ||
      fallbackCategoryKey ||
      ""
  );
  const stickerNumber = normalizeText(
    source?.sticker_number ||
      source?.stickerNumber ||
      source?.sticker ||
      source?.car_number ||
      source?.carNumber ||
      ""
  ).replace(/^#/, "");
  const driverName = normalizeText(source?.driver_name || source?.driverName || source?.driver || "").toLowerCase();

  if (categoryKey && stickerNumber) {
    return `${categoryKey}|${stickerNumber}`;
  }

  return categoryKey && driverName ? `${categoryKey}|${driverName}` : "";
};

const getResultMergeKey = (record, fallbackCategoryKey = "") => {
  const parsedSubmission = safeParseJsonObject(record?.submission_json);
  const source = { ...parsedSubmission, ...record };
  const vehicleKey = getResultVehicleKey(record, fallbackCategoryKey);
  const trackKey = normalizeTrackKey(
    source?.track_name ||
      source?.trackName ||
      source?.track_label ||
      source?.trackLabel ||
      source?.track ||
      ""
  );
  const dayKey = normalizeDayId(
    source?.selected_day_id ||
      source?.selectedDayId ||
      source?.selected_day_label ||
      source?.selectedDayLabel ||
      source?.selected_day_date ||
      source?.selectedDayDate ||
      ""
  );

  return vehicleKey && trackKey ? `${vehicleKey}|${trackKey}|${dayKey}` : "";
};

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

const getSnapshotCategoryRows = snapshot =>
  (Array.isArray(snapshot?.leaderboard?.categories) ? snapshot.leaderboard.categories : [])
    .flatMap(category => {
      const categoryKey = normalizeCsvCategoryKey(category?.key || category?.category || category?.label || "");
      const categoryLabel = category?.label || formatCsvCategoryLabel(categoryKey);
      const tracks = Array.isArray(category?.tracks) ? category.tracks : [];

      return (Array.isArray(category?.rows) ? category.rows : []).flatMap((row, rowIndex) => {
        const baseRow = {
          categoryKey,
          categoryLabel,
          position: rowIndex + 1,
          stickerNumber: row?.stickerNumber || row?.sticker || row?.car_number || row?.carNumber || "",
          teamName: row?.teamName || row?.team_name || row?.team || "",
          driverName: row?.driverName || row?.driver_name || row?.driver || "",
          coDriverName: row?.coDriverName || row?.codriver_name || row?.co_driver_name || row?.codriver || row?.co_driver || "",
          totalPoints: row?.totalPoints ?? row?.total_points ?? row?.total ?? "",
          totalTimingMs: row?.totalTimingMs ?? row?.total_timing_ms ?? "",
          totalTimingLabel: row?.totalTimingLabel || row?.total_timing_label || "",
        };
        const summaries = Array.isArray(row?.trackSummaries)
          ? row.trackSummaries
          : row?.trackMap && typeof row.trackMap === "object"
            ? Object.values(row.trackMap)
            : [];

        return summaries.flatMap(summary => {
          const trackLabel = summary?.trackLabel || summary?.track_label || summary?.label || "";
          const entries = Array.isArray(summary?.entries) ? summary.entries : [];

          if (!entries.length) {
            return [{
              ...baseRow,
              trackName: trackLabel,
              trackPoints: summary?.totalPoints ?? summary?.total_points ?? "",
              dayLabel: "",
              timingLabel: "",
              rankLabel: "",
            }];
          }

          return entries.map(entry => ({
            ...baseRow,
            trackName: trackLabel,
            trackPoints: parseNumericValue(entry?.pointsLabel || entry?.points_label) ?? summary?.totalPoints ?? "",
            dayLabel: entry?.dayLabel || entry?.day_label || "",
            timingLabel: entry?.timingLabel || entry?.timing_label || "",
            rankLabel: entry?.rankLabel || entry?.rank_label || "",
          }));
        });
      });
    });

const buildResultLookup = snapshot => {
  const lookup = new Map();

  [
    ...(Array.isArray(snapshot?.results) ? snapshot.results : []),
    ...(Array.isArray(snapshot?.disputes) ? snapshot.disputes : []),
  ].forEach(record => {
    const key = getResultMergeKey(record);
    if (key && !lookup.has(key)) {
      lookup.set(key, record);
    }
  });

  return lookup;
};

const getRecordValueForExport = (record, keys) => getFirstValue({ ...safeParseJsonObject(record?.submission_json), ...record }, keys);

const createFullCsvRow = ({ tableRow, record = {} }) => {
  const parsedSubmission = safeParseJsonObject(record?.submission_json);
  const source = { ...parsedSubmission, ...record };

  return {
    position: tableRow.position,
    category_key: tableRow.categoryKey,
    category_label: tableRow.categoryLabel,
    sticker_number: getRecordValueForExport(record, ["sticker_number", "stickerNumber", "sticker", "car_number", "carNumber"]) || tableRow.stickerNumber,
    team_name: getRecordValueForExport(record, ["team_name", "teamName", "team"]) || tableRow.teamName,
    driver_name: getRecordValueForExport(record, ["driver_name", "driverName", "driver"]) || tableRow.driverName,
    codriver_name: getRecordValueForExport(record, ["codriver_name", "coDriverName", "co_driver_name", "codriver", "co_driver"]) || tableRow.coDriverName,
    total_points: tableRow.totalPoints,
    total_timing_ms: tableRow.totalTimingMs,
    total_timing_label: tableRow.totalTimingLabel,
    sr_no: source?.sr_no || source?.srNo || "",
    track_name: getRecordValueForExport(record, ["track_name", "trackName", "track_label", "trackLabel", "track"]) || tableRow.trackName,
    selected_day_id: source?.selected_day_id || source?.selectedDayId || normalizeDayId(tableRow.dayLabel),
    selected_day_label: source?.selected_day_label || source?.selectedDayLabel || tableRow.dayLabel,
    selected_day_date: source?.selected_day_date || source?.selectedDayDate || "",
    rank: source?.rank || source?.rank_label || tableRow.rankLabel,
    points: source?.points ?? parseNumericValue(tableRow.trackPoints) ?? "",
    completion_time: source?.completion_time || source?.completionTime || tableRow.timingLabel,
    performance_time: source?.performance_time || source?.performanceTimeDisplay || tableRow.timingLabel,
    performance_time_ms: source?.performance_time_ms || source?.performanceTimeMilliseconds || "",
    total_penalties_time: source?.total_penalties_time || source?.totalPenaltiesTime || "",
    total_time: source?.total_time || source?.totalTimeDisplay || tableRow.timingLabel,
    total_time_ms: source?.total_time_ms || source?.totalTimeMilliseconds || "",
    track_timer_limit_display: source?.track_timer_limit_display || source?.trackTimerLimitDisplay || "",
    bunting_count: source?.bunting_count ?? source?.busting_count ?? source?.bustingCount ?? "",
    bunting_penalty_time: source?.bunting_penalty_time ?? source?.busting_penalty_time ?? source?.bustingPenaltyTime ?? "",
    pole_down_count: source?.pole_down_count ?? source?.poleDownCount ?? "",
    pole_down_penalty_time: source?.pole_down_penalty_time ?? source?.poleDownPenaltyTime ?? "",
    seatbelt_count: source?.seatbelt_count ?? source?.seatbeltCount ?? "",
    seatbelt_penalty_time: source?.seatbelt_penalty_time ?? source?.seatbeltPenaltyTime ?? "",
    ground_touch_count: source?.ground_touch_count ?? source?.groundTouchCount ?? "",
    ground_touch_penalty_time: source?.ground_touch_penalty_time ?? source?.groundTouchPenaltyTime ?? "",
    late_start_mode: source?.late_start_mode || source?.lateStartMode || "",
    late_start_status: source?.late_start_status || source?.lateStartStatus || "",
    late_start_count: source?.late_start_count ?? source?.lateStartCount ?? "",
    late_start_penalty_time: source?.late_start_penalty_time ?? source?.lateStartPenaltyTime ?? "",
    late_start_penalty_points: source?.late_start_penalty_points ?? source?.lateStartPenaltyPoints ?? "",
    attempt_count: source?.attempt_count ?? source?.attemptCount ?? "",
    attempt_penalty_time: source?.attempt_penalty_time ?? source?.attemptPenaltyTime ?? "",
    task_skipped_count: source?.task_skipped_count ?? source?.taskSkippedCount ?? "",
    task_skipped_penalty_time: source?.task_skipped_penalty_time ?? source?.taskSkippedPenaltyTime ?? "",
    is_dns: source?.is_dns ?? source?.isDNS ?? "",
    is_dnf: source?.is_dnf ?? source?.isDNF ?? "",
    wrong_course_selected: source?.wrong_course_selected ?? source?.wrongCourseSelected ?? "",
    fourth_attempt_selected: source?.fourth_attempt_selected ?? source?.fourthAttemptSelected ?? "",
    time_over_selected: source?.time_over_selected ?? source?.timeOverSelected ?? "",
    vehicle_out_of_track_selected: source?.vehicle_out_of_track_selected ?? source?.vehicleOutOfTrackSelected ?? "",
    vehicle_breakdown_selected: source?.vehicle_breakdown_selected ?? source?.vehicleBreakdownSelected ?? "",
    dnf_selection: source?.dnf_selection || source?.dnfSelection || "",
    dnf_points: source?.dnf_points ?? source?.dnfPoints ?? "",
    dispute_details: toCsvJsonValue(source?.dispute_details ?? source?.disputeDetails),
    dispute_resolutions: toCsvJsonValue(source?.dispute_resolutions ?? source?.disputeResolutions),
    dispute_signatures: toCsvJsonValue(source?.dispute_signatures ?? source?.disputeSignatures),
    dispute_signed_by: toCsvJsonValue(source?.dispute_signed_by ?? source?.disputeSignedBy),
    dispute_resolution_status: source?.dispute_resolution_status || source?.disputeResolutionStatus || "",
    dispute_resolution_label: source?.dispute_resolution_label || source?.disputeResolutionLabel || "",
    submission_json: record?.submission_json || (Object.keys(parsedSubmission).length ? JSON.stringify(parsedSubmission) : ""),
  };
};

export function buildFullLeaderboardCsvFromSnapshot(snapshot) {
  const resultLookup = buildResultLookup(snapshot);
  const tableRows = getSnapshotCategoryRows(snapshot);
  const csvRows = tableRows.map(tableRow => {
    const lookupRecord = {
      category: tableRow.categoryKey,
      sticker_number: tableRow.stickerNumber,
      driver_name: tableRow.driverName,
      track_name: tableRow.trackName,
      selected_day_label: tableRow.dayLabel,
    };
    const record = resultLookup.get(getResultMergeKey(lookupRecord)) || {};

    return createFullCsvRow({ tableRow, record });
  });

  [
    ...(Array.isArray(snapshot?.results) ? snapshot.results : []),
    ...(Array.isArray(snapshot?.disputes) ? snapshot.disputes : []),
  ].forEach(record => {
    const key = getResultMergeKey(record);
    const alreadyExported = tableRows.some(tableRow => getResultMergeKey({
      category: tableRow.categoryKey,
      sticker_number: tableRow.stickerNumber,
      driver_name: tableRow.driverName,
      track_name: tableRow.trackName,
      selected_day_label: tableRow.dayLabel,
    }) === key);

    if (!alreadyExported) {
      const categoryKey = getResultCategoryKey(record);
      csvRows.push(createFullCsvRow({
        tableRow: {
          categoryKey,
          categoryLabel: formatCsvCategoryLabel(categoryKey),
          position: "",
          stickerNumber: getRecordValueForExport(record, ["sticker_number", "stickerNumber", "car_number", "carNumber"]),
          teamName: getRecordValueForExport(record, ["team_name", "teamName", "team"]),
          driverName: getRecordValueForExport(record, ["driver_name", "driverName", "driver"]),
          coDriverName: getRecordValueForExport(record, ["codriver_name", "coDriverName", "co_driver_name"]),
          totalPoints: "",
          totalTimingMs: "",
          totalTimingLabel: "",
          trackName: getRecordValueForExport(record, ["track_name", "trackName"]),
          trackPoints: getRecordValueForExport(record, ["points", "total_points", "score"]),
          dayLabel: getRecordValueForExport(record, ["selected_day_label", "selectedDayLabel"]),
          timingLabel: getRecordValueForExport(record, ["total_time", "totalTimeDisplay", "performance_time", "performanceTimeDisplay"]),
          rankLabel: getRecordValueForExport(record, ["rank", "rank_label"]),
        },
        record,
      }));
    }
  });

  return stringifyCsv(FULL_LEADERBOARD_CSV_HEADERS, csvRows);
}

export function buildFullLeaderboardSnapshotFromCsv(csvText) {
  const records = parseCsv(csvText);
  const recordsByCategory = new Map();

  records.forEach(record => {
    const categoryKey = normalizeCsvCategoryKey(getFirstValue(record, ["category_key", "category", "category_label"]));

    if (!categoryKey) {
      return;
    }

    if (!recordsByCategory.has(categoryKey)) {
      recordsByCategory.set(categoryKey, []);
    }

    recordsByCategory.get(categoryKey).push(record);
  });

  let snapshot = null;

  recordsByCategory.forEach((categoryRecords, categoryKey) => {
    const categorySnapshot = buildLeaderboardSnapshotFromCsv(
      stringifyCsv(FULL_LEADERBOARD_CSV_HEADERS, categoryRecords),
      categoryKey
    );
    snapshot = mergeLeaderboardCategorySnapshot(snapshot, categorySnapshot);
  });

  if (!snapshot) {
    throw new Error("Full leaderboard CSV does not contain any valid category rows.");
  }

  return {
    ...snapshot,
    source: "full-csv-upload",
    generatedAt: new Date().toISOString(),
  };
}

const getItemCategoryKey = item =>
  normalizeCsvCategoryKey(item?.category || item?.key || item?.category_key || item?.label || "");

const mergeArrayByKey = (existingItems = [], incomingItems = [], getKey) => {
  const itemMap = new Map();

  existingItems.forEach(item => {
    const key = getKey(item);
    if (key) {
      itemMap.set(key, item);
    }
  });

  incomingItems.forEach(item => {
    const key = getKey(item);
    if (key) {
      itemMap.set(key, item);
    }
  });

  return [...itemMap.values()];
};

const mergeTracks = (existingTracks = [], incomingTracks = []) =>
  mergeArrayByKey(existingTracks, incomingTracks, track =>
    normalizeTrackKey(track?.key || track?.trackKey || track?.label || track?.name || track || "")
  );

const sortLeaderboardRows = rows =>
  [...rows].sort((a, b) => {
    const pointDelta = (parseNumericValue(b?.totalPoints ?? b?.total_points) || 0) - (parseNumericValue(a?.totalPoints ?? a?.total_points) || 0);
    if (pointDelta !== 0) {
      return pointDelta;
    }

    const timingA = parseNumericValue(a?.totalTimingMs ?? a?.total_timing_ms);
    const timingB = parseNumericValue(b?.totalTimingMs ?? b?.total_timing_ms);
    if (timingA !== null && timingB !== null && timingA !== timingB) {
      return timingA - timingB;
    }

    return 0;
  });

export function mergeFullLeaderboardSnapshot(existingSnapshot, incomingSnapshot) {
  const existing = existingSnapshot || {};
  const categoriesByKey = new Map();

  (Array.isArray(existing.leaderboard?.categories) ? existing.leaderboard.categories : []).forEach(category => {
    const key = getItemCategoryKey(category);
    if (key) {
      categoriesByKey.set(key, category);
    }
  });

  (Array.isArray(incomingSnapshot?.leaderboard?.categories) ? incomingSnapshot.leaderboard.categories : []).forEach(incomingCategory => {
    const key = getItemCategoryKey(incomingCategory);
    const existingCategory = categoriesByKey.get(key);

    if (!key) {
      return;
    }

    categoriesByKey.set(key, {
      ...(existingCategory || {}),
      ...incomingCategory,
      tracks: mergeTracks(existingCategory?.tracks || [], incomingCategory?.tracks || incomingCategory?.trackOptions || []),
      rows: sortLeaderboardRows(mergeArrayByKey(
        Array.isArray(existingCategory?.rows) ? existingCategory.rows : [],
        Array.isArray(incomingCategory?.rows) ? incomingCategory.rows : [],
        row => getResultVehicleKey(row, key)
      )),
    });
  });

  return {
    ...existing,
    ...incomingSnapshot,
    source: "full-csv-upload",
    generatedAt: incomingSnapshot?.generatedAt || new Date().toISOString(),
    teams: mergeArrayByKey(existing.teams || [], incomingSnapshot?.teams || [], item => getResultVehicleKey(item)),
    results: mergeArrayByKey(existing.results || [], incomingSnapshot?.results || [], item => getResultMergeKey(item)),
    disputes: mergeArrayByKey(existing.disputes || [], incomingSnapshot?.disputes || [], item => getResultMergeKey(item)),
    categoryOptions: mergeArrayByKey(existing.categoryOptions || [], incomingSnapshot?.categoryOptions || [], getItemCategoryKey),
    leaderboard: {
      ...(existing.leaderboard || {}),
      ...(incomingSnapshot?.leaderboard || {}),
      categories: [...categoriesByKey.values()],
    },
  };
}

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
