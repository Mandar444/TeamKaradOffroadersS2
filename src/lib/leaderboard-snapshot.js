export const EXPORT_PATHS = [
  "/api/leaderboard-sync",
  "/api/leaderboard",
  "/leaderboard-export.json",
  "/data/leaderboard-export.json",
];
export const LEADERBOARD_VISIBILITY_PATH = "/api/leaderboard-visibility";

export const normalizeText = value => String(value || "").trim();

export const normalizeTrackKey = value =>
  normalizeText(value)
    .toLowerCase()
    .replace(/\s+/g, "_");

const getFirstTrackValue = (source, keys) => {
  for (const key of keys) {
    const value = source?.[key];

    if (value !== null && value !== undefined && value !== "") {
      return value;
    }
  }

  return "";
};

export const normalizeTrackDescriptor = (track, fallbackLabel = "") => {
  const source = track && typeof track === "object" && !Array.isArray(track) ? track : null;
  const fallback = normalizeText(fallbackLabel);
  const rawLabel = source
    ? getFirstTrackValue(source, [
        "trackLabel",
        "track_label",
        "trackName",
        "track_name",
        "label",
        "name",
        "title",
        "displayName",
        "display_name",
      ])
    : track;
  const rawKey = source
    ? getFirstTrackValue(source, ["key", "id", "trackId", "track_id", "value", "slug", "code"])
    : rawLabel;
  const label = normalizeText(rawLabel || fallback || rawKey || "Track");
  const key = normalizeTrackKey(rawKey || label);
  const maxPointsValue = source
    ? getFirstTrackValue(source, ["maxPoints", "max_points", "possiblePoints", "possible_points", "totalPossiblePoints"])
    : "";
  const maxPoints = maxPointsValue !== "" && Number.isFinite(Number(maxPointsValue)) ? Number(maxPointsValue) : 100;

  return {
    key: key || normalizeTrackKey(label),
    label,
    maxPoints,
  };
};

const isTrackEnabled = track => {
  if (!track || typeof track !== "object" || Array.isArray(track)) {
    return true;
  }

  return !(
    track.active === false ||
    track.enabled === false ||
    track.isActive === false ||
    track.is_active === false ||
    track.removed === true ||
    track.deleted === true ||
    track.isDeleted === true ||
    track.is_deleted === true
  );
};

const addTrackDescriptor = (tracks, seenTracks, descriptor) => {
  if (!descriptor?.label) {
    return;
  }

  const keyIdentity = descriptor.key || normalizeTrackKey(descriptor.label);
  const labelIdentity = normalizeTrackKey(descriptor.label);

  if (seenTracks.has(keyIdentity) || seenTracks.has(labelIdentity)) {
    return;
  }

  seenTracks.add(keyIdentity);
  seenTracks.add(labelIdentity);
  tracks.push(descriptor);
};

export const normalizeCategoryKey = value => {
  const normalized = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

  if (normalized === "LADIES" || normalized === "LADIES_CATEGORY") {
    return "LADIES_CATEGORY";
  }

  return normalized;
};

export const normalizeDateValue = value =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/(\d+)(st|nd|rd|th)\b/g, "$1")
    .replace(/,/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const normalizeDayKey = value => {
  const raw = String(value || "").trim().toLowerCase();

  if (!raw) {
    return "";
  }

  const dayMatch = raw.match(/(?:day\s*|d\s*)(\d+)/i);
  if (dayMatch) {
    return `d${dayMatch[1]}`;
  }

  const digitsOnly = raw.match(/\d+/g);
  if (digitsOnly && digitsOnly.length > 0) {
    return `d${digitsOnly.join("")}`;
  }

  return raw.replace(/[^a-z0-9]/g, "");
};

export const safeParseJsonObject = value => {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (error) {
    return {};
  }
};

export const safeParseJsonValue = value => {
  if (!value || typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

export const normalizeResultIdentityKey = item => {
  const parsedSubmission = safeParseJsonObject(item?.submission_json);
  const source = { ...item, ...parsedSubmission };
  const dayIdentityKey =
    normalizeText(
      source?.selected_day_id ||
        source?.selectedDayId ||
        source?.selected_day_label ||
        source?.selectedDayLabel ||
        ""
    ).toLowerCase() || normalizeDateValue(source?.selected_day_date || source?.selectedDayDate || "");

  return [
    normalizeCategoryKey(source?.category || ""),
    normalizeText(source?.track_name || source?.trackName || "").toLowerCase(),
    normalizeText(source?.sticker_number || source?.stickerNumber || "").toLowerCase(),
    normalizeText(source?.driver_name || source?.driverName || "").toLowerCase(),
    dayIdentityKey,
  ].join("|");
};

export const normalizeShortIdentityKey = item => {
  const parsedSubmission = safeParseJsonObject(item?.submission_json);
  const source = { ...item, ...parsedSubmission };

  return [
    normalizeCategoryKey(source?.category || ""),
    normalizeText(source?.track_name || source?.trackName || "").toLowerCase(),
    normalizeText(source?.sticker_number || source?.stickerNumber || "").toLowerCase(),
    normalizeText(source?.driver_name || source?.driverName || "").toLowerCase(),
    normalizeDayKey(
      source?.selected_day_id ||
        source?.selectedDayId ||
        source?.selected_day_label ||
        source?.selectedDayLabel ||
        source?.selected_day_date ||
        source?.selectedDayDate ||
        ""
    ),
  ].join("|");
};

export const formatCategoryLabel = value =>
  String(value || "")
    .trim()
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, letter => letter.toUpperCase()) || "Category";

export const normalizeTrackEntry = entry => ({
  key: normalizeText(entry?.key || entry?.identityKey || ""),
  dayLabel: normalizeText(entry?.dayLabel || entry?.day_label || ""),
  dayOrder: Number.isFinite(Number(entry?.dayOrder ?? entry?.day_order)) ? Number(entry?.dayOrder ?? entry?.day_order) : null,
  timingLabel: normalizeText(entry?.timingLabel || entry?.timing_label || entry?.value || "NA") || "NA",
  pointsLabel: normalizeText(entry?.pointsLabel || entry?.points_label || ""),
  rankLabel: normalizeText(entry?.rankLabel || entry?.rank_label || ""),
});

export const normalizeTrackSummary = (summary, fallbackLabel = "") => {
  const descriptor = normalizeTrackDescriptor(summary, fallbackLabel);

  return {
    trackKey: descriptor.key,
    trackLabel: descriptor.label,
    totalPoints: Number.isFinite(Number(summary?.totalPoints)) ? Number(summary.totalPoints) : Number(summary?.total || 0),
    entries: Array.isArray(summary?.entries) ? summary.entries.map(normalizeTrackEntry) : [],
  };
};

export const hasDisputePayload = record =>
  Array.isArray(record?.dispute_details) ||
  Array.isArray(record?.disputeDetails) ||
  (record?.dispute_resolutions && typeof record.dispute_resolutions === "object") ||
  (record?.disputeResolutions && typeof record.disputeResolutions === "object") ||
  Boolean(record?.dispute_resolution_status || record?.disputeResolutionStatus);

export const mergeDetailRecords = (existing, incoming) => {
  if (!existing) {
    return incoming;
  }

  const incomingIsDispute = incoming?.__sourceType === "dispute" || hasDisputePayload(incoming);
  const existingIsDispute = existing?.__sourceType === "dispute" || hasDisputePayload(existing);

  if (incomingIsDispute && !existingIsDispute) {
    return {
      ...incoming,
      ...existing,
      dispute_details: incoming.dispute_details ?? existing.dispute_details,
      disputeDetails: incoming.disputeDetails ?? existing.disputeDetails,
      dispute_resolutions: incoming.dispute_resolutions ?? existing.dispute_resolutions,
      disputeResolutions: incoming.disputeResolutions ?? existing.disputeResolutions,
      dispute_resolution_status: incoming.dispute_resolution_status ?? existing.dispute_resolution_status,
      disputeResolutionStatus: incoming.disputeResolutionStatus ?? existing.disputeResolutionStatus,
      dispute_resolution_label: incoming.dispute_resolution_label ?? existing.dispute_resolution_label,
      disputeResolutionLabel: incoming.disputeResolutionLabel ?? existing.disputeResolutionLabel,
      __sourceType: existing.__sourceType || incoming.__sourceType,
    };
  }

  if (!incomingIsDispute && existingIsDispute) {
    return {
      ...existing,
      ...incoming,
      dispute_details: existing.dispute_details ?? incoming.dispute_details,
      disputeDetails: existing.disputeDetails ?? incoming.disputeDetails,
      dispute_resolutions: existing.dispute_resolutions ?? incoming.dispute_resolutions,
      disputeResolutions: existing.disputeResolutions ?? incoming.disputeResolutions,
      dispute_resolution_status: existing.dispute_resolution_status ?? incoming.dispute_resolution_status,
      disputeResolutionStatus: existing.disputeResolutionStatus ?? incoming.disputeResolutionStatus,
      dispute_resolution_label: existing.dispute_resolution_label ?? incoming.dispute_resolution_label,
      disputeResolutionLabel: existing.disputeResolutionLabel ?? incoming.disputeResolutionLabel,
      __sourceType: incoming.__sourceType || existing.__sourceType,
    };
  }

  return { ...existing, ...incoming };
};

export const getTrackSummariesFromRow = row => {
  if (Array.isArray(row?.trackSummaries) && row.trackSummaries.length > 0) {
    return row.trackSummaries.map(summary => normalizeTrackSummary(summary));
  }

  if (row?.trackSummaries && typeof row.trackSummaries === "object") {
    return Object.entries(row.trackSummaries).map(([trackKey, summary]) => normalizeTrackSummary(summary, trackKey));
  }

  if (row?.trackMap && typeof row.trackMap === "object") {
    return Object.entries(row.trackMap).map(([trackKey, summary]) => normalizeTrackSummary(summary, trackKey));
  }

  return [];
};

export const normalizeRow = row => {
  const trackSummaries = getTrackSummariesFromRow(row);

  return {
    vehicleKey:
      row?.vehicleKey ||
      `${normalizeText(row?.stickerNumber || row?.sticker || "")}-${normalizeText(row?.driverName || row?.driver || "")}`,
    stickerNumber: normalizeText(row?.stickerNumber || row?.sticker || "--").replace(/^#/, ""),
    driverName: normalizeText(row?.driverName || row?.driver || "--"),
    coDriverName: normalizeText(row?.coDriverName || row?.coDriver || "--"),
    totalPoints: Number.isFinite(Number(row?.totalPoints)) ? Number(row.totalPoints) : Number(row?.total || 0),
    totalTimingMs: Number.isFinite(Number(row?.totalTimingMs)) ? Number(row.totalTimingMs) : null,
    totalTimingLabel: normalizeText(row?.totalTimingLabel || row?.totalTimingDisplay || row?.totalTimeDisplay || row?.totalTime || ""),
    trackSummaries,
  };
};

export const normalizeCategory = category => {
  const rawRows = Array.isArray(category?.rows) ? category.rows : [];
  const rows = rawRows.map(normalizeRow);
  const tracks = [];
  const seenTracks = new Set();
  const configuredTracks = Array.isArray(category?.tracks)
    ? category.tracks
    : Array.isArray(category?.trackOptions)
      ? category.trackOptions
      : Array.isArray(category?.activeTracks)
        ? category.activeTracks
        : [];

  configuredTracks.filter(Boolean).filter(isTrackEnabled).forEach(track => {
    addTrackDescriptor(tracks, seenTracks, normalizeTrackDescriptor(track));
  });

  rows.forEach(row => {
    row.trackSummaries.forEach(summary => {
      addTrackDescriptor(tracks, seenTracks, normalizeTrackDescriptor(summary));
    });
  });

  const explicitMaxPoints =
    category?.maxPoints ??
    category?.max_points ??
    category?.totalPossiblePoints ??
    category?.total_possible_points ??
    category?.totalMaxPoints ??
    category?.total_max_points;
  const maxPoints = explicitMaxPoints !== "" && Number.isFinite(Number(explicitMaxPoints))
    ? Number(explicitMaxPoints)
    : tracks.reduce((total, track) => total + (Number.isFinite(Number(track.maxPoints)) ? Number(track.maxPoints) : 100), 0);

  return {
    key: normalizeCategoryKey(category?.key || category?.category || category?.label || ""),
    label: normalizeText(category?.label || category?.name || "") || formatCategoryLabel(category?.key || category?.category || category?.label || ""),
    tracks,
    maxPoints,
    rows,
  };
};

export const getCategoriesFromSnapshot = snapshot => {
  const sourceCategories = Array.isArray(snapshot?.leaderboard?.categories)
    ? snapshot.leaderboard.categories
    : Array.isArray(snapshot?.categories)
      ? snapshot.categories
      : [];

  return sourceCategories.map(normalizeCategory).filter(category => category.key);
};

export const buildLeaderboardDetailIndex = snapshot => {
  const detailIndex = new Map();
  const sourceRows = [
    ...(Array.isArray(snapshot?.results) ? snapshot.results : []).map(item => ({ ...item, __sourceType: "result" })),
    ...(Array.isArray(snapshot?.disputes) ? snapshot.disputes : []).map(item => ({ ...item, __sourceType: "dispute" })),
  ];

  sourceRows.forEach(item => {
    const parsedSubmission = safeParseJsonObject(item?.submission_json);
    const record = {
      ...item,
      ...parsedSubmission,
      submission_json: item?.submission_json || null,
      __identityKey: normalizeResultIdentityKey(item),
      __shortIdentityKey: normalizeShortIdentityKey(item),
    };
    const existing = detailIndex.get(record.__identityKey) || detailIndex.get(record.__shortIdentityKey);
    const mergedRecord = mergeDetailRecords(existing, record);

    detailIndex.set(record.__identityKey, mergedRecord);
    detailIndex.set(record.__shortIdentityKey, mergedRecord);
  });

  return detailIndex;
};

export const formatDetailValue = value => {
  if (value === null || value === undefined || value === "") {
    return "--";
  }

  return String(value);
};

export const getBooleanFlagValue = value => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  const normalized = String(value || "").trim().toLowerCase();
  return ["1", "true", "yes", "y", "on"].includes(normalized);
};

export const getYesNoLabel = value => (getBooleanFlagValue(value) ? "Yes" : "No");

export const getFirstDefinedValue = (...values) => {
  for (const value of values) {
    if (value !== null && value !== undefined && value !== "") {
      return value;
    }
  }

  return 0;
};

export const getLateStartStatusLabel = record => {
  const status = record?.late_start_status || record?.lateStartStatus;

  if (status) {
    return status;
  }

  const count = Number(getFirstDefinedValue(record?.late_start_count, record?.lateStartCount));
  return count > 0 ? "Yes" : "No";
};

export const isDnsResult = record =>
  getBooleanFlagValue(record?.is_dns ?? record?.isDNS ?? record?.isDns);

export const isDnfResult = record => {
  if (getBooleanFlagValue(record?.is_dnf ?? record?.isDNF ?? record?.isDnf)) {
    return true;
  }

  const totalTime = String(record?.total_time || record?.totalTimeDisplay || record?.performance_time || record?.performanceTimeDisplay || "")
    .trim()
    .toUpperCase();
  return totalTime.startsWith("DNF");
};

export const getDisputeResolutionLabel = record => {
  const rawLabel = normalizeText(record?.dispute_resolution_label || record?.disputeResolutionLabel || "");
  const rawStatus = String(
    record?.dispute_resolution_status ||
      record?.disputeResolutionStatus ||
      record?.dispute_resolution ||
      record?.disputeResolution ||
      ""
  )
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (rawStatus === "accepted" || rawStatus === "dispute_accepted") {
    return "Dispute Accepted & Resolved";
  }

  if (rawStatus === "rejected" || rawStatus === "dispute_rejected") {
    return "Dispute Rejected & Resolved";
  }

  if (
    rawStatus === "auto_submitted" ||
    rawStatus === "auto_submitted_from_dispute" ||
    rawStatus === "auto_submit" ||
    record?.autoSubmittedFromDispute ||
    record?.source === "dispute-auto-submit"
  ) {
    return "Auto Submitted & Resolved";
  }

  return rawLabel;
};

export const normalizeDisputeDetails = record => {
  const detailSources = [safeParseJsonValue(record?.dispute_details), safeParseJsonValue(record?.disputeDetails)];
  const seen = new Set();

  return detailSources
    .flatMap(source => (Array.isArray(source) ? source : []))
    .map(detail => ({
      key: normalizeText(detail?.key || detail?.label || "dispute"),
      label: normalizeText(detail?.label || detail?.key || "Dispute"),
      sectionTitle: normalizeText(detail?.sectionTitle || detail?.section_title || "Dispute"),
      partyKey: normalizeText(detail?.partyKey || detail?.party_key || ""),
      partyLabel: normalizeText(detail?.partyLabel || detail?.party_label || "Dispute"),
      detail: normalizeText(detail?.detail || detail?.details || detail?.comment || ""),
    }))
    .filter(detail => {
      const identity = `${detail.partyKey}|${detail.key}|${detail.detail}`;
      if (seen.has(identity)) {
        return false;
      }
      seen.add(identity);
      return detail.label || detail.detail;
    });
};

export const normalizeDisputeResolutions = record => {
  const rawResolutions = safeParseJsonValue(record?.dispute_resolutions || record?.disputeResolutions || {});

  if (!rawResolutions || typeof rawResolutions !== "object" || Array.isArray(rawResolutions)) {
    return [];
  }

  return Object.entries(rawResolutions)
    .map(([partyKey, resolution]) => ({
      partyKey,
      partyLabel: partyKey === "byTeam" ? "By Team" : partyKey === "byOpponent" ? "By Opponent" : formatCategoryLabel(partyKey),
      status: normalizeText(resolution?.status || ""),
      label: normalizeText(resolution?.label || resolution?.status || "Resolution"),
      comment: normalizeText(resolution?.comment || ""),
      resolvedAt: normalizeText(resolution?.resolvedAt || resolution?.resolved_at || ""),
    }))
    .filter(resolution => resolution.status || resolution.label || resolution.comment || resolution.resolvedAt);
};

export const formatResolvedAt = value => {
  if (!value) {
    return "--";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const getRecordValue = (record, keys, fallback = "--") => {
  for (const key of keys) {
    const value = record?.[key];

    if (value !== null && value !== undefined && value !== "") {
      return value;
    }
  }

  return fallback;
};

export const getDetailFlagLabel = record => {
  if (record?.isDisputed || record?.__sourceType === "dispute") {
    return "Hold";
  }

  if (isDnsResult(record)) {
    return "DNS";
  }

  if (isDnfResult(record)) {
    return "DNF";
  }

  return record?.late_start_status || record?.lateStartStatus || "Completed";
};

export const buildRunSummaryItems = (record, selectedDetail = {}) => [
  {
    label: "Performance Time",
    value: getRecordValue(record, ["performance_time", "performanceTimeDisplay", "completionTime"], selectedDetail?.entry?.timingLabel || "--"),
  },
  { label: "Penalty Time", value: getRecordValue(record, ["total_penalties_time", "totalPenaltiesTime"], "--") },
  {
    label: "Total Time",
    value: getRecordValue(record, ["total_time", "totalTimeDisplay"], selectedDetail?.entry?.timingLabel || "--"),
  },
  { label: "Result", value: getDetailFlagLabel(record) },
];

export const buildRunInfoItems = (record, selectedDetail = {}) => [
  { label: "SR No", value: getRecordValue(record, ["sr_no", "srNo"]) },
  { label: "Sticker Number", value: getRecordValue(record, ["sticker_number", "stickerNumber"], selectedDetail?.row?.stickerNumber) },
  { label: "Driver Name", value: getRecordValue(record, ["driver_name", "driverName"], selectedDetail?.row?.driverName) },
  { label: "Co-Driver Name", value: getRecordValue(record, ["codriver_name", "coDriverName"], selectedDetail?.row?.coDriverName) },
  { label: "Category", value: getRecordValue(record, ["category"], selectedDetail?.categoryLabel) },
  { label: "Track Name", value: getRecordValue(record, ["track_name", "trackName"], selectedDetail?.trackLabel) },
  { label: "Day", value: getRecordValue(record, ["selected_day_label", "selectedDayLabel"], selectedDetail?.entry?.dayLabel) },
  { label: "Date", value: getRecordValue(record, ["selected_day_date", "selectedDayDate"]) },
  { label: "Track Timer Limit", value: getRecordValue(record, ["track_timer_limit_display", "trackTimerLimitDisplay"]) },
];

export const buildPenaltyRows = record => [
  {
    label: "Bunting Cut",
    count: getFirstDefinedValue(record?.bunting_count, record?.bustingCount),
    penalty: getFirstDefinedValue(record?.bunting_penalty_time, record?.bustingPenaltyTime),
    note: "--",
  },
  {
    label: "Pole Down",
    count: getFirstDefinedValue(record?.pole_down_count, record?.poleDownCount),
    penalty: getFirstDefinedValue(record?.pole_down_penalty_time, record?.poleDownPenaltyTime),
    note: "--",
  },
  {
    label: "Seatbelt",
    count: getFirstDefinedValue(record?.seatbelt_count, record?.seatbeltCount),
    penalty: getFirstDefinedValue(record?.seatbelt_penalty_time, record?.seatbeltPenaltyTime),
    note: "--",
  },
  {
    label: "Ground Touch",
    count: getFirstDefinedValue(record?.ground_touch_count, record?.groundTouchCount),
    penalty: getFirstDefinedValue(record?.ground_touch_penalty_time, record?.groundTouchPenaltyTime),
    note: "--",
  },
  {
    label: "Late Start",
    count: getFirstDefinedValue(record?.late_start_count, record?.lateStartCount),
    penalty: getFirstDefinedValue(record?.late_start_penalty_time, record?.lateStartPenaltyTime),
    note: getLateStartStatusLabel(record),
  },
  {
    label: "Skipped after 3rd Attempt",
    count: getFirstDefinedValue(record?.attempt_count, record?.attemptCount),
    penalty: getFirstDefinedValue(record?.attempt_penalty_time, record?.attemptPenaltyTime),
    note: "--",
  },
  {
    label: "Task Skipped",
    count: getFirstDefinedValue(record?.task_skipped_count, record?.taskSkippedCount),
    penalty: getFirstDefinedValue(record?.task_skipped_penalty_time, record?.taskSkippedPenaltyTime),
    note: "--",
  },
];

export const buildPenaltyBreakdownRows = record =>
  buildPenaltyRows(record).map(row => ({
    penalty: row.label,
    count: row.count,
    penaltyTime: row.penalty,
    status: row.note,
  }));

export const buildResultFlagItems = record => [
  { label: "Result Type", value: getDetailFlagLabel(record) },
  { label: "Wrong Course", value: getYesNoLabel(record?.wrong_course_selected ?? record?.wrongCourseSelected) },
  { label: "4th Attempt", value: getYesNoLabel(record?.fourth_attempt_selected ?? record?.fourthAttemptSelected) },
  { label: "Time Over", value: getYesNoLabel(record?.time_over_selected ?? record?.timeOverSelected) },
  { label: "Vehicle Out of the Track", value: getYesNoLabel(record?.vehicle_out_of_track_selected ?? record?.vehicleOutOfTrackSelected) },
  { label: "DNF Selection", value: getRecordValue(record, ["dnf_selection", "dnfSelection"]) },
  { label: "DNF Points", value: getRecordValue(record, ["dnf_points", "dnfPoints"], 0) },
];

export const buildDetailSections = record => [
  {
    title: "Timing Summary",
    items: [
      { label: "Performance Time", value: record?.performance_time || record?.performanceTimeDisplay },
      { label: "Total Penalties", value: record?.total_penalties_time || record?.totalPenaltiesTime },
      { label: "Total Time", value: record?.total_time || record?.totalTimeDisplay },
    ],
  },
  {
    title: "Late Start",
    items: [
      { label: "Status", value: record?.late_start_status || record?.lateStartStatus },
      { label: "Mode", value: record?.late_start_mode || record?.lateStartMode },
      { label: "Count", value: record?.late_start_count || record?.lateStartCount },
      { label: "Penalty Time", value: record?.late_start_penalty_time || record?.lateStartPenaltyTime },
    ],
  },
  {
    title: "Penalty Breakdown",
    type: "penaltyTable",
    kicker: "Scoring",
    rows: buildPenaltyBreakdownRows(record),
  },
  {
    title: "DNF / DNS",
    items: buildResultFlagItems(record),
  },
];

const DISPUTE_PARTY_OPTIONS = [
  { key: "byTeam", label: "By Team" },
  { key: "byOpponent", label: "By Opponent" },
];

const DISPUTE_PARTY_LABEL_BY_KEY = DISPUTE_PARTY_OPTIONS.reduce((acc, item) => {
  acc[item.key] = item.label;
  return acc;
}, {});

const DISPUTE_DETAIL_INPUTLESS_KEYS = new Set(["byTeam", "byOpponent"]);

export const getDisputeDetailEntries = source => {
  const rawDetailsValue = safeParseJsonValue(source?.disputeDetails ?? source?.dispute_details ?? []);
  const rawDetails = Array.isArray(rawDetailsValue) ? rawDetailsValue : [];

  const normalizedEntries = rawDetails
    .map(entry => {
      const key = normalizeText(entry?.key);
      const label = normalizeText(entry?.label);
      const detail = normalizeText(entry?.detail);
      const partyKey = normalizeText(
        entry?.partyKey ||
          entry?.party_key ||
          entry?.disputeCategory ||
          entry?.dispute_category ||
          ""
      );

      if (!key || !label || (!detail && !DISPUTE_DETAIL_INPUTLESS_KEYS.has(key))) {
        return null;
      }

      return {
        key,
        label,
        partyKey,
        partyLabel: entry?.partyLabel || entry?.party_label || DISPUTE_PARTY_LABEL_BY_KEY[partyKey] || "",
        detail: detail || "Yes",
      };
    })
    .filter(Boolean);

  const hasPartySpecificEntries = normalizedEntries.some(entry => entry.partyKey);
  const legacyPartyKeys = rawDetails
    .map(entry => normalizeText(entry?.key))
    .filter(key => DISPUTE_PARTY_LABEL_BY_KEY[key]);

  if (hasPartySpecificEntries || !legacyPartyKeys.length) {
    return normalizedEntries.filter(entry => !DISPUTE_DETAIL_INPUTLESS_KEYS.has(entry.key));
  }

  return legacyPartyKeys.flatMap(partyKey =>
    normalizedEntries
      .filter(entry => !DISPUTE_DETAIL_INPUTLESS_KEYS.has(entry.key))
      .map(entry => ({
        ...entry,
        partyKey,
        partyLabel: DISPUTE_PARTY_LABEL_BY_KEY[partyKey],
      }))
  );
};

export const getDisputePartyKeysWithDetails = record => {
  const partyKeys = [...new Set(getDisputeDetailEntries(record).map(entry => entry.partyKey).filter(Boolean))];
  return partyKeys.length ? partyKeys : DISPUTE_PARTY_OPTIONS.map(party => party.key);
};

export const getDisputeResolutionLabelForStatus = status => {
  const normalizedStatus = String(status || "").trim().toLowerCase();

  if (normalizedStatus === "accepted") {
    return "Dispute Accepted & Resolved";
  }

  if (normalizedStatus === "rejected") {
    return "Dispute Rejected & Resolved";
  }

  if (normalizedStatus === "auto_submitted" || normalizedStatus === "auto_submitted_from_dispute") {
    return "Auto Submitted & Resolved";
  }

  return "";
};

export const getDisputeResolutionMap = record => {
  const rawResolutions = safeParseJsonValue(record?.disputeResolutions ?? record?.dispute_resolutions ?? {});
  const normalized = {};

  if (rawResolutions && typeof rawResolutions === "object" && !Array.isArray(rawResolutions)) {
    DISPUTE_PARTY_OPTIONS.forEach(party => {
      const resolution = rawResolutions[party.key] || {};
      const status = normalizeText(resolution.status || resolution.disputeResolutionStatus || "");

      if (!status && !resolution.label) {
        return;
      }

      normalized[party.key] = {
        status,
        label:
          resolution.label ||
          resolution.disputeResolutionLabel ||
          resolution.dispute_resolution_label ||
          getDisputeResolutionLabelForStatus(status),
        comment: normalizeText(resolution.comment || resolution.resolutionComment || ""),
        penaltyDecisionLabel: normalizeText(
          resolution.penaltyDecisionLabel ||
            resolution.penalty_decision_label ||
            resolution.tkoResolutionDecisionLabel ||
            resolution.tko_resolution_decision_label ||
            ""
        ),
      };
    });
  }

  const fallbackLabel = getDisputeResolutionLabel(record);

  if (fallbackLabel && !Object.keys(normalized).length) {
    getDisputePartyKeysWithDetails(record).forEach(partyKey => {
      normalized[partyKey] = {
        status: record?.disputeResolutionStatus || record?.dispute_resolution_status || "",
        label: fallbackLabel,
        comment: "",
        penaltyDecisionLabel: "",
      };
    });
  }

  return normalized;
};

export const buildDisputeDetailItems = (record, partyKey = "") =>
  getDisputeDetailEntries(record)
    .filter(entry => !partyKey || entry.partyKey === partyKey)
    .map(entry => ({
      label: entry.label,
      value: entry.detail,
    }));

export const appendDisputeResolutionSection = record => {
  const disputeResolutions = getDisputeResolutionMap(record);
  const partyKeys = DISPUTE_PARTY_OPTIONS.map(party => party.key);

  if (!Object.keys(disputeResolutions).length) {
    return [];
  }

  return partyKeys.map(partyKey => {
    const party = DISPUTE_PARTY_OPTIONS.find(item => item.key === partyKey) || {
      key: partyKey,
      label: DISPUTE_PARTY_LABEL_BY_KEY[partyKey] || partyKey,
    };
    const resolution = disputeResolutions[partyKey] || {};
    const detailItems = buildDisputeDetailItems(record, partyKey);
    const statusLabel = resolution.label || (detailItems.length ? "Pending" : "No Dispute Raised");

    return {
      title: `Dispute Resolution - ${party.label}`,
      items: [
        { label: "Status", value: statusLabel },
        ...(resolution.penaltyDecisionLabel && resolution.penaltyDecisionLabel !== statusLabel
          ? [{ label: "TKO Decision", value: resolution.penaltyDecisionLabel }]
          : []),
        ...(resolution.comment ? [{ label: "Comment", value: resolution.comment }] : []),
        ...detailItems,
      ],
    };
  });
};

export const appendDisputeDetailsSection = record => {
  const partyKeys = getDisputePartyKeysWithDetails(record);

  if (Object.keys(getDisputeResolutionMap(record)).length) {
    return [];
  }

  return partyKeys
    .map(partyKey => {
      const party = DISPUTE_PARTY_OPTIONS.find(item => item.key === partyKey) || {
        key: partyKey,
        label: DISPUTE_PARTY_LABEL_BY_KEY[partyKey] || partyKey,
      };
      const disputeDetailItems = buildDisputeDetailItems(record, partyKey);

      if (!disputeDetailItems.length) {
        return null;
      }

      return {
        title: `Dispute Details - ${party.label}`,
        items: disputeDetailItems,
      };
    })
    .filter(Boolean);
};

export const buildRawRecordItems = record => [
  { label: "Performance Time", value: record?.performance_time || record?.performanceTimeDisplay },
  { label: "Total Penalties", value: record?.total_penalties_time || record?.totalPenaltiesTime },
  { label: "Total Time", value: record?.total_time || record?.totalTimeDisplay },
  { label: "Late Start Status", value: record?.late_start_status || record?.lateStartStatus },
  { label: "Late Start Penalty", value: record?.late_start_penalty_time || record?.lateStartPenaltyTime },
  { label: "DNF Points", value: record?.dnf_points ?? record?.dnfPoints },
];

export async function fetchLeaderboardSnapshot() {
  let lastError = null;

  for (const path of EXPORT_PATHS) {
    try {
      const response = await fetch(path, { cache: "no-store" });

      if (!response.ok) {
        lastError = new Error(`HTTP ${response.status}`);
        continue;
      }

      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Leaderboard export file not found");
}

export async function fetchLeaderboardVisibility() {
  const response = await fetch(LEADERBOARD_VISIBILITY_PATH, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();

  return {
    visible: data?.visible !== false,
    updatedAt: data?.updatedAt || null,
  };
}
