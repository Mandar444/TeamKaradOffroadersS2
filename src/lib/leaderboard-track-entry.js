import {
  LEADERBOARD_CSV_CATEGORIES,
  normalizeCsvCategoryKey,
  normalizeTrackKey,
} from "@/lib/leaderboard-csv";
import {
  normalizeResultIdentityKey,
  normalizeShortIdentityKey,
} from "@/lib/leaderboard-snapshot";

const POINTS_BY_PLACE = [100, 90, 90, 87, 84, 81];

const normalizeText = value => String(value || "").trim();

const parseBooleanValue = value => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  return ["1", "true", "yes", "y", "on"].includes(normalizeText(value).toLowerCase());
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

  if (!rawValue || rawValue.toUpperCase() === "DNS" || rawValue.toUpperCase().startsWith("DNF")) {
    return null;
  }

  const numericValue = parseNumericValue(rawValue);
  if (numericValue !== null && !rawValue.includes(":")) {
    return Math.round(numericValue * 1000);
  }

  const parts = rawValue.split(":").map(part => Number(part));
  if (!parts.length || parts.some(part => !Number.isFinite(part))) {
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

const formatTimingMs = value => {
  if (!Number.isFinite(Number(value))) {
    return "";
  }

  const totalMs = Math.max(0, Math.round(Number(value)));
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const centiseconds = Math.floor((totalMs % 1000) / 10);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(centiseconds).padStart(2, "0")}`;
};

const getPointsForPlace = place => {
  if (place <= POINTS_BY_PLACE.length) {
    return POINTS_BY_PLACE[place - 1] || 0;
  }

  return Math.max(0, POINTS_BY_PLACE[POINTS_BY_PLACE.length - 1] - (place - POINTS_BY_PLACE.length));
};

const getCategoryDefinition = categoryKey => {
  const normalizedCategoryKey = normalizeCsvCategoryKey(categoryKey);
  return LEADERBOARD_CSV_CATEGORIES.find(category => category.key === normalizedCategoryKey) || null;
};

const getCategoryKey = item =>
  normalizeCsvCategoryKey(item?.key || item?.category || item?.category_key || item?.label || "");

const formatCategoryLabel = value =>
  normalizeText(value)
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, letter => letter.toUpperCase()) || "Category";

const getVehicleKey = (item, fallbackCategoryKey = "") => {
  const categoryKey = normalizeCsvCategoryKey(
    item?.category_key ||
      item?.categoryKey ||
      item?.category ||
      item?.key ||
      fallbackCategoryKey ||
      ""
  );
  const stickerNumber = normalizeText(
    item?.sticker_number ||
      item?.stickerNumber ||
      item?.sticker ||
      item?.car_number ||
      item?.carNumber ||
      ""
  ).replace(/^#/, "");
  const driverName = normalizeText(item?.driver_name || item?.driverName || item?.driver || "").toLowerCase();

  if (categoryKey && stickerNumber) {
    return `${categoryKey}|${stickerNumber}`;
  }

  return categoryKey && driverName ? `${categoryKey}|${driverName}` : "";
};

const getTrackMergeKey = item =>
  normalizeTrackKey(item?.trackKey || item?.track_key || item?.trackName || item?.track_name || item?.trackLabel || item?.track_label || item?.label || item || "");

const getDayLabel = item =>
  normalizeText(item?.selected_day_label || item?.selectedDayLabel || item?.dayLabel || item?.day || "D1") || "D1";

const getDayId = value => {
  const dayLabel = getDayLabel({ dayLabel: value });
  const dayMatch = dayLabel.match(/(?:day|d)\s*(\d+)/i) || dayLabel.match(/^(\d+)$/);
  return dayMatch ? `day-${dayMatch[1]}` : dayLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "day-1";
};

const getResultMergeKey = (item, fallbackCategoryKey = "") => {
  const vehicleKey = getVehicleKey(item, fallbackCategoryKey);
  const trackKey = getTrackMergeKey(item);
  const dayKey = getDayId(getDayLabel(item));

  return vehicleKey && trackKey ? `${vehicleKey}|${trackKey}|${dayKey}` : "";
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

const getResultIdentityKeys = record => {
  const source = getResultSource(record);
  const categoryKey = getCategoryKey(source);

  return [
    record?.id,
    source?.id,
    normalizeResultIdentityKey(record),
    normalizeResultIdentityKey(source),
    normalizeShortIdentityKey(record),
    normalizeShortIdentityKey(source),
    getResultMergeKey(source, categoryKey),
  ].map(normalizeText).filter(Boolean);
};

const getRequestedIdentityKeys = payload =>
  [
    payload?.id,
    payload?.key,
    payload?.identityKey,
    payload?.resultKey,
    payload?.shortKey,
  ].map(normalizeText).filter(Boolean);

const getResultSource = record => ({
  ...safeParseJsonObject(record?.submission_json),
  ...(record || {}),
});

const getRowSummaries = row => {
  if (Array.isArray(row?.trackSummaries)) {
    return row.trackSummaries;
  }

  if (row?.trackMap && typeof row.trackMap === "object") {
    return Object.values(row.trackMap);
  }

  return [];
};

const cloneRow = row => {
  const trackSummaries = getRowSummaries(row).map(summary => ({
    ...summary,
    entries: Array.isArray(summary?.entries) ? summary.entries.map(entry => ({ ...entry })) : [],
  }));
  const trackMap = trackSummaries.reduce((acc, summary) => {
    const key = getTrackMergeKey(summary);
    if (key) {
      acc[key] = summary;
    }
    return acc;
  }, {});

  return {
    ...row,
    stickerNumber: normalizeText(row?.stickerNumber || row?.sticker_number || row?.sticker || row?.car_number || row?.carNumber || ""),
    teamName: normalizeText(row?.teamName || row?.team_name || row?.team || "--") || "--",
    driverName: normalizeText(row?.driverName || row?.driver_name || row?.driver || "--") || "--",
    coDriverName: normalizeText(row?.coDriverName || row?.codriver_name || row?.co_driver_name || row?.codriver || row?.co_driver || "--") || "--",
    trackMap,
    trackSummaries,
  };
};

const setRowTrackSummary = (row, track, summary) => {
  const nextSummaries = [
    ...getRowSummaries(row).filter(item => getTrackMergeKey(item) !== track.key),
    summary,
  ];

  row.trackSummaries = nextSummaries;
  row.trackMap = nextSummaries.reduce((acc, item) => {
    const key = getTrackMergeKey(item);
    if (key) {
      acc[key] = item;
    }
    return acc;
  }, {});
};

const getRowTrackSummary = (row, trackKey) =>
  getRowSummaries(row).find(summary => getTrackMergeKey(summary) === trackKey) || null;

const getResultStatus = item => {
  const source = getResultSource(item);
  const timingLabel = normalizeText(source.total_time || source.totalTimeDisplay || source.performance_time || source.performanceTimeDisplay || item?.timingLabel);
  const isDns = parseBooleanValue(source.is_dns ?? source.isDNS) || timingLabel.toUpperCase() === "DNS";
  const isDnf = !isDns && (
    parseBooleanValue(source.is_dnf ?? source.isDNF) ||
    timingLabel.toUpperCase().startsWith("DNF") ||
    normalizeText(source.dnf_selection || source.dnfSelection)
  );

  return { isDns, isDnf };
};

const getResultLookup = snapshot => {
  const lookup = new Map();

  [
    ...(Array.isArray(snapshot?.results) ? snapshot.results : []),
    ...(Array.isArray(snapshot?.disputes) ? snapshot.disputes : []),
  ].forEach(record => {
    const source = getResultSource(record);
    const key = getResultMergeKey(source, getCategoryKey(source));

    if (key) {
      lookup.set(key, record);
    }
  });

  return lookup;
};

const getPenaltyCount = (payload, key) => Math.max(0, parseNumericValue(payload?.[key]) || 0);

const DNF_REASON_FIELDS = [
  { key: "wrong_course_selected", camelKey: "wrongCourseSelected", label: "WRONG COURSE" },
  { key: "fourth_attempt_selected", camelKey: "fourthAttemptSelected", label: "4TH ATTEMPT" },
  { key: "vehicle_out_of_track_selected", camelKey: "vehicleOutOfTrackSelected", label: "VEHICLE OUT OF THE TRACK" },
  { key: "vehicle_breakdown_selected", camelKey: "vehicleBreakdownSelected", label: "VEHICLE BREAKDOWN" },
  { key: "time_over_selected", camelKey: "timeOverSelected", label: "TIME OVER" },
];

const getDnfReasonFlags = payload =>
  DNF_REASON_FIELDS.reduce((acc, field) => {
    acc[field.key] = parseBooleanValue(payload?.[field.key] ?? payload?.[field.camelKey]);
    return acc;
  }, {});

const getDnfSelection = (payload, flags) => {
  const selectedReason = DNF_REASON_FIELDS.find(field => flags[field.key]);
  return normalizeText(payload.dnf_selection || payload.dnfSelection || selectedReason?.label || "").toUpperCase();
};

const createInputRecord = (payload, category, track) => {
  const dayLabel = getDayLabel(payload);
  const isDns = parseBooleanValue(payload.is_dns ?? payload.isDNS);
  const dnfReasonFlags = getDnfReasonFlags(payload);
  const dnfSelection = getDnfSelection(payload, dnfReasonFlags);
  const dnfPoints = Math.max(0, parseNumericValue(payload.dnf_points ?? payload.dnfPoints) || 0);
  const isDnf = !isDns && (
    parseBooleanValue(payload.is_dnf ?? payload.isDNF) ||
    dnfSelection ||
    Object.values(dnfReasonFlags).some(Boolean)
  );
  const completionTime = normalizeText(payload.completion_time || payload.completionTime);
  const completionTimeMs = parseTimingMs(completionTime);
  const penalties = {
    bunting: getPenaltyCount(payload, "bunting_count"),
    poleDown: getPenaltyCount(payload, "pole_down_count"),
    seatbelt: getPenaltyCount(payload, "seatbelt_count"),
    groundTouch: getPenaltyCount(payload, "ground_touch_count"),
    skippedAfterThird: getPenaltyCount(payload, "attempt_count"),
    taskSkip: getPenaltyCount(payload, "task_skipped_count"),
  };
  const penaltySeconds =
    penalties.bunting * 20 +
    penalties.poleDown * 20 +
    penalties.seatbelt * 30 +
    penalties.groundTouch * 30 +
    penalties.skippedAfterThird * 30 +
    penalties.taskSkip * 90;
  const providedTotalTime = normalizeText(payload.total_time || payload.totalTime || payload.totalTimeDisplay);
  const computedTotalTimeMs = Number.isFinite(Number(completionTimeMs))
    ? completionTimeMs + penaltySeconds * 1000
    : null;
  const totalTimeMs = computedTotalTimeMs ?? parseTimingMs(providedTotalTime);
  const computedTotalTimeLabel = Number.isFinite(Number(computedTotalTimeMs))
    ? penaltySeconds > 0
      ? formatTimingMs(computedTotalTimeMs)
      : completionTime
    : "";
  const totalTimeLabel = isDns
    ? "DNS"
    : isDnf
      ? `DNF${dnfSelection ? ` - ${dnfSelection}` : ""}`
      : computedTotalTimeLabel || providedTotalTime || formatTimingMs(totalTimeMs) || completionTime || "NA";
  const stickerNumber = normalizeText(payload.sticker_number || payload.stickerNumber || payload.sticker || payload.car_number || payload.carNumber).replace(/^#/, "").toUpperCase();
  const driverName = (normalizeText(payload.driver_name || payload.driverName || payload.driver || "--") || "--").toUpperCase();
  const coDriverName = (normalizeText(payload.codriver_name || payload.coDriverName || payload.co_driver_name || payload.codriver || payload.co_driver || "--") || "--").toUpperCase();
  const teamName = normalizeText(payload.team_name || payload.teamName || payload.team || driverName || "--") || "--";
  const now = new Date().toISOString();

  return {
    id: `${category.key}-${track.key}-${stickerNumber || driverName}-${getDayId(dayLabel)}`,
    category: category.label,
    category_key: category.key,
    category_label: category.label,
    sticker_number: stickerNumber,
    team_name: teamName,
    driver_name: driverName,
    codriver_name: coDriverName,
    track_name: track.label,
    selected_day_id: getDayId(dayLabel),
    selected_day_label: dayLabel,
    completion_time: completionTime,
    performance_time: completionTime || totalTimeLabel,
    performance_time_ms: completionTimeMs ?? "",
    total_penalties_time: `${penaltySeconds} sec`,
    total_time: totalTimeLabel,
    total_time_ms: totalTimeMs ?? "",
    bunting_count: penalties.bunting,
    bunting_penalty_time: `${penalties.bunting * 20} sec`,
    pole_down_count: penalties.poleDown,
    pole_down_penalty_time: `${penalties.poleDown * 20} sec`,
    seatbelt_count: penalties.seatbelt,
    seatbelt_penalty_time: `${penalties.seatbelt * 30} sec`,
    ground_touch_count: penalties.groundTouch,
    ground_touch_penalty_time: `${penalties.groundTouch * 30} sec`,
    attempt_count: penalties.skippedAfterThird,
    attempt_penalty_time: `${penalties.skippedAfterThird * 30} sec`,
    task_skipped_count: penalties.taskSkip,
    task_skipped_penalty_time: `${penalties.taskSkip * 90} sec`,
    is_dns: isDns ? 1 : 0,
    is_dnf: isDnf ? 1 : 0,
    dnf_selection: dnfSelection,
    wrong_course_selected: dnfReasonFlags.wrong_course_selected ? 1 : 0,
    fourth_attempt_selected: dnfReasonFlags.fourth_attempt_selected ? 1 : 0,
    time_over_selected: dnfReasonFlags.time_over_selected ? 1 : 0,
    vehicle_out_of_track_selected: dnfReasonFlags.vehicle_out_of_track_selected ? 1 : 0,
    vehicle_breakdown_selected: dnfReasonFlags.vehicle_breakdown_selected ? 1 : 0,
    dnf_points: isDnf ? dnfPoints : 0,
    points: isDnf ? dnfPoints : 0,
    rank: "",
    created_at: payload.created_at || now,
    updated_at: now,
  };
};

const createResultRecord = ({ record, row, category, track, entry, points, rankLabel }) => {
  const source = {
    source: "admin-track-entry",
    selectedDayId: record.selected_day_id,
    selectedDayLabel: record.selected_day_label,
    selected_day_id: record.selected_day_id,
    selected_day_label: record.selected_day_label,
    trackName: track.label,
    category: category.label,
    categoryKey: category.key,
    category_key: category.key,
    teamName: row.teamName,
    stickerNumber: row.stickerNumber,
    driverName: row.driverName,
    coDriverName: row.coDriverName,
    completionTime: record.completion_time,
    completionTimeMilliseconds: record.performance_time_ms,
    performanceTimeDisplay: record.performance_time,
    totalPenaltiesTime: record.total_penalties_time,
    totalTimeDisplay: record.total_time,
    totalTimeMilliseconds: record.total_time_ms,
    bustingCount: record.bunting_count,
    poleDownCount: record.pole_down_count,
    seatbeltCount: record.seatbelt_count,
    groundTouchCount: record.ground_touch_count,
    attemptCount: record.attempt_count,
    taskSkippedCount: record.task_skipped_count,
    isDNS: Boolean(record.is_dns),
    isDNF: Boolean(record.is_dnf),
    wrongCourseSelected: Boolean(record.wrong_course_selected),
    fourthAttemptSelected: Boolean(record.fourth_attempt_selected),
    timeOverSelected: Boolean(record.time_over_selected),
    vehicleOutOfTrackSelected: Boolean(record.vehicle_out_of_track_selected),
    vehicleBreakdownSelected: Boolean(record.vehicle_breakdown_selected),
    dnfSelection: record.dnf_selection,
    dnfPoints: record.dnf_points,
    points,
    rank: rankLabel,
  };

  return {
    ...record,
    id: record.id,
    category: category.label,
    category_key: category.key,
    track_name: track.label,
    team_name: row.teamName,
    sticker_number: row.stickerNumber,
    driver_name: row.driverName,
    codriver_name: row.coDriverName,
    points,
    rank: rankLabel,
    total_time: entry.timingLabel,
    submission_json: JSON.stringify(source),
    selectedDayId: record.selected_day_id,
    selectedDayLabel: record.selected_day_label,
  };
};

const sortRows = rows =>
  [...rows].sort((left, right) => {
    const pointDelta = (parseNumericValue(right.totalPoints) || 0) - (parseNumericValue(left.totalPoints) || 0);

    if (pointDelta !== 0) {
      return pointDelta;
    }

    const leftTime = parseNumericValue(left.totalTimingMs);
    const rightTime = parseNumericValue(right.totalTimingMs);

    if (leftTime !== null && rightTime !== null && leftTime !== rightTime) {
      return leftTime - rightTime;
    }

    if (leftTime !== null) {
      return -1;
    }

    if (rightTime !== null) {
      return 1;
    }

    return normalizeText(left.driverName).localeCompare(normalizeText(right.driverName));
  });

const isMatchingDeleteTarget = (record, payload) => {
  const requestedKeys = getRequestedIdentityKeys(payload);
  const recordKeys = getResultIdentityKeys(record);

  if (requestedKeys.some(key => recordKeys.includes(key))) {
    return true;
  }

  const source = getResultSource(record);
  const categoryKey = normalizeCsvCategoryKey(payload?.categoryKey || payload?.category_key || payload?.category || "");
  const trackKey = normalizeTrackKey(payload?.trackName || payload?.track_name || payload?.track || payload?.trackKey || "");
  const stickerNumber = normalizeText(payload?.stickerNumber || payload?.sticker_number || payload?.sticker || "").replace(/^#/, "");
  const driverName = normalizeText(payload?.driverName || payload?.driver_name || payload?.driver || "").toLowerCase();
  const dayKey = getDayId(payload?.day || payload?.dayLabel || payload?.selectedDayLabel || payload?.selected_day_label || "");
  const sourceCategoryKey = getCategoryKey(source);
  const sourceStickerNumber = normalizeText(
    source?.sticker_number || source?.stickerNumber || source?.sticker || source?.car_number || source?.carNumber || ""
  ).replace(/^#/, "");
  const sourceDriverName = normalizeText(source?.driver_name || source?.driverName || source?.driver || "").toLowerCase();
  const sourceDayKey = getDayId(getDayLabel(source));

  return (
    (!categoryKey || sourceCategoryKey === categoryKey) &&
    (!trackKey || getTrackMergeKey(source) === trackKey) &&
    (!dayKey || sourceDayKey === dayKey) &&
    (
      (stickerNumber && sourceStickerNumber === stickerNumber) ||
      (driverName && sourceDriverName === driverName)
    )
  );
};

const getRecordTimingMs = record =>
  parseNumericValue(record?.total_time_ms || record?.totalTimeMilliseconds) ??
  parseTimingMs(record?.total_time || record?.totalTimeDisplay || record?.performance_time || record?.performanceTimeDisplay);

const updateRecordScoring = (record, points, rankLabel) => {
  const source = getResultSource(record);

  return {
    ...record,
    points,
    rank: rankLabel,
    rank_label: rankLabel,
    submission_json: JSON.stringify({
      ...safeParseJsonObject(record?.submission_json),
      points,
      rank: rankLabel,
      rankLabel,
    }),
    updated_at: new Date().toISOString(),
    total_time: source.total_time || source.totalTimeDisplay || record.total_time,
    total_time_ms: source.total_time_ms ?? source.totalTimeMilliseconds ?? record.total_time_ms,
  };
};

const rescoreTrackResults = (results, categoryKey, trackKey) => {
  const affectedItems = results
    .map((record, index) => {
      const source = getResultSource(record);
      return {
        record,
        index,
        source,
        totalTimeMs: getRecordTimingMs(source),
        ...getResultStatus(source),
      };
    })
    .filter(item => getCategoryKey(item.source) === categoryKey && getTrackMergeKey(item.source) === trackKey);

  const sortedItems = [...affectedItems].sort((left, right) => {
    const leftStatus = left.isDns ? 2 : left.isDnf ? 1 : 0;
    const rightStatus = right.isDns ? 2 : right.isDnf ? 1 : 0;

    if (leftStatus !== rightStatus) {
      return leftStatus - rightStatus;
    }

    if (leftStatus !== 0) {
      return normalizeText(left.source.driver_name || left.source.driverName).localeCompare(
        normalizeText(right.source.driver_name || right.source.driverName)
      );
    }

    const leftTime = Number.isFinite(Number(left.totalTimeMs)) ? Number(left.totalTimeMs) : Number.POSITIVE_INFINITY;
    const rightTime = Number.isFinite(Number(right.totalTimeMs)) ? Number(right.totalTimeMs) : Number.POSITIVE_INFINITY;

    if (leftTime !== rightTime) {
      return leftTime - rightTime;
    }

    return left.index - right.index;
  });

  let timedPlace = 0;
  const scoringByRecord = new Map();

  sortedItems.forEach(item => {
    const rankLabel = item.isDns ? "DNS" : item.isDnf ? "DNF" : `P${timedPlace + 1}`;
    const points = item.isDns
      ? 0
      : item.isDnf
        ? Math.max(0, parseNumericValue(item.record?.dnf_points ?? item.record?.dnfPoints) || 0)
        : getPointsForPlace(timedPlace + 1);

    if (!item.isDns && !item.isDnf) {
      timedPlace += 1;
    }

    scoringByRecord.set(item.record, { points, rankLabel });
  });

  return results.map(record => {
    const scoring = scoringByRecord.get(record);
    return scoring ? updateRecordScoring(record, scoring.points, scoring.rankLabel) : record;
  });
};

const getResultTrackDefinition = (source, fallbackTrack = null) => {
  const label = normalizeText(source?.track_name || source?.trackName || source?.trackLabel || source?.track_label || fallbackTrack?.label || "Track");
  const key = normalizeTrackKey(source?.trackKey || source?.track_key || label);

  return { key, label };
};

const buildEntryFromResultRecord = record => {
  const source = getResultSource(record);
  const timingLabel = normalizeText(source.total_time || source.totalTimeDisplay || source.performance_time || source.performanceTimeDisplay) || "NA";

  return {
    key: getResultMergeKey(source, getCategoryKey(source)),
    dayLabel: getDayLabel(source),
    dayOrder: parseNumericValue(source.selected_day_id || source.selectedDayId || getDayLabel(source)) || 1,
    timingLabel,
    pointsLabel: `${parseNumericValue(source.points) || 0} pts`,
    rankLabel: normalizeText(source.rank || source.rank_label || ""),
  };
};

const buildCategoryRowsFromResults = ({ category, results, existingCategory }) => {
  const rowsByVehicle = new Map();
  const trackDefinitionsByKey = new Map(
    (category.tracks || []).map(track => [track.key, track])
  );

  results.forEach(record => {
    const source = getResultSource(record);
    const vehicleKey = getVehicleKey(source, category.key);

    if (!vehicleKey) {
      return;
    }

    const track = getResultTrackDefinition(source);
    trackDefinitionsByKey.set(track.key, track);

    if (!rowsByVehicle.has(vehicleKey)) {
      rowsByVehicle.set(vehicleKey, {
        vehicleKey,
        stickerNumber: normalizeText(source.sticker_number || source.stickerNumber || source.sticker || source.car_number || source.carNumber || ""),
        teamName: normalizeText(source.team_name || source.teamName || source.team || source.driver_name || source.driverName || "--") || "--",
        driverName: normalizeText(source.driver_name || source.driverName || source.driver || "--") || "--",
        coDriverName: normalizeText(source.codriver_name || source.coDriverName || source.co_driver_name || source.codriver || source.co_driver || "--") || "--",
        totalPoints: 0,
        totalTimingMs: null,
        totalTimingLabel: "",
        trackMap: {},
        trackSummaries: [],
      });
    }

    const row = rowsByVehicle.get(vehicleKey);
    const summary = row.trackMap[track.key] || {
      trackKey: track.key,
      trackLabel: track.label,
      totalPoints: 0,
      entries: [],
    };

    summary.entries = [...(summary.entries || []), buildEntryFromResultRecord(record)]
      .sort((left, right) => (left.dayOrder || 0) - (right.dayOrder || 0));
    summary.totalPoints = summary.entries.reduce((total, entry) => total + (parseNumericValue(entry.pointsLabel) || 0), 0);
    row.trackMap[track.key] = summary;
  });

  const trackOrder = new Map([...trackDefinitionsByKey.keys()].map((key, index) => [key, index]));
  const rows = [...rowsByVehicle.values()].map(row => {
    const trackSummaries = Object.values(row.trackMap).sort((left, right) => {
      const leftIndex = trackOrder.has(left.trackKey) ? trackOrder.get(left.trackKey) : 999;
      const rightIndex = trackOrder.has(right.trackKey) ? trackOrder.get(right.trackKey) : 999;
      return leftIndex - rightIndex;
    });
    const timedValues = trackSummaries
      .flatMap(summary => summary.entries || [])
      .map(entry => parseTimingMs(entry.timingLabel))
      .filter(value => Number.isFinite(Number(value)));
    const totalTimingMs = timedValues.reduce((total, value) => total + value, 0);

    return {
      ...row,
      totalPoints: trackSummaries.reduce((total, summary) => total + (parseNumericValue(summary.totalPoints) || 0), 0),
      totalTimingMs: timedValues.length ? totalTimingMs : null,
      totalTimingLabel: timedValues.length ? formatTimingMs(totalTimingMs) : "",
      trackSummaries,
      trackMap: trackSummaries.reduce((acc, summary) => {
        acc[summary.trackKey] = summary;
        return acc;
      }, {}),
    };
  });

  return {
    ...(existingCategory || {}),
    key: category.key,
    label: category.label,
    tracks: [...trackDefinitionsByKey.values()].map(track => track.label),
    maxPoints: Math.max(1, trackDefinitionsByKey.size) * 100,
    rows: sortRows(rows),
  };
};

export function deleteLeaderboardTrackEntry(snapshot, payload = {}) {
  const existingSnapshot = snapshot || {};
  const results = Array.isArray(existingSnapshot.results) ? existingSnapshot.results : [];
  const targetRecord = results.find(record => isMatchingDeleteTarget(record, payload));

  if (!targetRecord) {
    throw new Error("Leaderboard track result was not found.");
  }

  const targetSource = getResultSource(targetRecord);
  const categoryKey = getCategoryKey(targetSource);
  const trackKey = getTrackMergeKey(targetSource);
  const existingCategories = Array.isArray(existingSnapshot.leaderboard?.categories)
    ? existingSnapshot.leaderboard.categories
    : [];
  const existingCategory = existingCategories.find(category => getCategoryKey(category) === categoryKey) || null;
  const categoryDefinition = getCategoryDefinition(categoryKey);
  const category = {
    key: categoryKey,
    label: existingCategory?.label || categoryDefinition?.label || formatCategoryLabel(categoryKey),
    tracks: (existingCategory?.tracks?.length ? existingCategory.tracks : categoryDefinition?.tracks || [])
      .map(track => getResultTrackDefinition({ track_name: track })),
  };
  const nextResults = rescoreTrackResults(
    results.filter(record => record !== targetRecord),
    categoryKey,
    trackKey
  );
  const nextDisputes = Array.isArray(existingSnapshot.disputes)
    ? existingSnapshot.disputes.filter(record => !isMatchingDeleteTarget(record, payload))
    : [];
  const categoryResults = nextResults.filter(record => getCategoryKey(getResultSource(record)) === categoryKey);
  const rebuiltCategory = categoryResults.length
    ? buildCategoryRowsFromResults({ category, results: categoryResults, existingCategory })
    : null;
  const nextCategories = [
    ...existingCategories.filter(categoryItem => getCategoryKey(categoryItem) !== categoryKey),
    ...(rebuiltCategory ? [rebuiltCategory] : []),
  ];
  const teamsByVehicle = new Map();

  (Array.isArray(existingSnapshot.teams) ? existingSnapshot.teams : []).forEach(team => {
    const teamCategoryKey = getCategoryKey(team);
    const key = getVehicleKey(team, teamCategoryKey || categoryKey);

    if (key && teamCategoryKey !== categoryKey) {
      teamsByVehicle.set(key, team);
    }
  });

  (rebuiltCategory?.rows || []).forEach((row, index) => {
    const key = getVehicleKey(row, categoryKey);

    if (key) {
      teamsByVehicle.set(key, {
        id: `${categoryKey}-${row.stickerNumber || index + 1}`,
        team_name: row.teamName,
        driver_name: row.driverName,
        codriver_name: row.coDriverName,
        car_number: row.stickerNumber,
        category: categoryKey,
        status: "ACTIVE",
      });
    }
  });

  const nextCategoryOptions = (Array.isArray(existingSnapshot.categoryOptions) ? existingSnapshot.categoryOptions : [])
    .filter(option => getCategoryKey(option) !== categoryKey);

  if (rebuiltCategory) {
    nextCategoryOptions.push({ key: categoryKey, label: rebuiltCategory.label || formatCategoryLabel(categoryKey) });
  }

  return {
    ...existingSnapshot,
    generatedAt: new Date().toISOString(),
    source: "admin-track-entry-delete",
    focusCategory: rebuiltCategory ? categoryKey : nextCategories[0]?.key || "",
    teams: [...teamsByVehicle.values()],
    results: nextResults,
    disputes: nextDisputes,
    categoryOptions: nextCategoryOptions,
    leaderboard: {
      ...(existingSnapshot.leaderboard || {}),
      categories: nextCategories,
    },
  };
}

export function buildLeaderboardSnapshotFromTrackEntry(existingSnapshot, payload = {}) {
  const categoryDefinition = getCategoryDefinition(payload.categoryKey || payload.category_key || payload.category);

  if (!categoryDefinition) {
    throw new Error("Choose a valid category.");
  }

  const category = {
    key: categoryDefinition.key,
    label: categoryDefinition.label,
    tracks: categoryDefinition.tracks.map(track => ({
      key: normalizeTrackKey(track),
      label: track,
      maxPoints: 100,
    })),
  };
  const requestedTrackKey = normalizeTrackKey(payload.trackName || payload.track_name || payload.trackKey || payload.track_key);
  const track = category.tracks.find(item => item.key === requestedTrackKey || normalizeTrackKey(item.label) === requestedTrackKey);

  if (!track) {
    throw new Error("Choose a valid track for the selected category.");
  }

  const inputRecord = createInputRecord(payload, category, track);
  const vehicleKey = getVehicleKey(inputRecord, category.key);

  if (!inputRecord.sticker_number || !inputRecord.driver_name || !vehicleKey) {
    throw new Error("Sticker number and driver name are required.");
  }

  const existing = existingSnapshot || {};
  const existingCategories = Array.isArray(existing.leaderboard?.categories) ? existing.leaderboard.categories : [];
  const existingCategory = existingCategories.find(item => getCategoryKey(item) === category.key) || null;
  const resultLookup = getResultLookup(existing);
  const rowsByVehicle = new Map();

  (Array.isArray(existingCategory?.rows) ? existingCategory.rows : []).forEach(row => {
    const clonedRow = cloneRow(row);
    const key = getVehicleKey(clonedRow, category.key);

    if (key) {
      rowsByVehicle.set(key, clonedRow);
    }
  });

  const row = rowsByVehicle.get(vehicleKey) || {
    vehicleKey,
    stickerNumber: inputRecord.sticker_number,
    teamName: inputRecord.team_name,
    driverName: inputRecord.driver_name,
    coDriverName: inputRecord.codriver_name,
    totalPoints: 0,
    totalTimingMs: null,
    totalTimingLabel: "",
    trackMap: {},
    trackSummaries: [],
  };

  row.vehicleKey = vehicleKey;
  row.stickerNumber = inputRecord.sticker_number;
  row.teamName = inputRecord.team_name;
  row.driverName = inputRecord.driver_name;
  row.coDriverName = inputRecord.codriver_name;

  setRowTrackSummary(row, track, {
    trackKey: track.key,
    trackLabel: track.label,
    totalPoints: 0,
    entries: [{
      key: getResultMergeKey(inputRecord, category.key),
      dayLabel: inputRecord.selected_day_label,
      dayOrder: 1,
      timingLabel: inputRecord.total_time,
      pointsLabel: "0 pts",
      rankLabel: "",
    }],
  });
  rowsByVehicle.set(vehicleKey, row);

  const rows = [...rowsByVehicle.values()];
  const trackItems = rows
    .map(currentRow => {
      const summary = getRowTrackSummary(currentRow, track.key);
      const entry = summary?.entries?.[0];

      if (!summary || !entry) {
        return null;
      }

      const lookupKey = getResultMergeKey({
        category_key: category.key,
        sticker_number: currentRow.stickerNumber,
        driver_name: currentRow.driverName,
        track_name: track.label,
        selected_day_label: entry.dayLabel,
      }, category.key);
      const storedRecord = resultLookup.get(lookupKey);
      const record = getVehicleKey(currentRow, category.key) === vehicleKey
        ? inputRecord
        : storedRecord
          ? getResultSource(storedRecord)
          : {
              category_key: category.key,
              category_label: category.label,
              sticker_number: currentRow.stickerNumber,
              team_name: currentRow.teamName,
              driver_name: currentRow.driverName,
              codriver_name: currentRow.coDriverName,
              track_name: track.label,
              selected_day_label: entry.dayLabel,
              selected_day_id: getDayId(entry.dayLabel),
              total_time: entry.timingLabel,
              total_time_ms: parseTimingMs(entry.timingLabel) ?? "",
            };
      const status = getResultStatus({ ...record, timingLabel: entry.timingLabel });
      const totalTimeMs = parseNumericValue(record.total_time_ms || record.totalTimeMilliseconds) ?? parseTimingMs(entry.timingLabel);

      return {
        row: currentRow,
        summary,
        entry,
        record,
        totalTimeMs,
        ...status,
      };
    })
    .filter(Boolean);

  const sortedTrackItems = [...trackItems].sort((left, right) => {
    const leftStatus = left.isDns ? 2 : left.isDnf ? 1 : 0;
    const rightStatus = right.isDns ? 2 : right.isDnf ? 1 : 0;

    if (leftStatus !== rightStatus) {
      return leftStatus - rightStatus;
    }

    if (leftStatus !== 0) {
      return normalizeText(left.row.driverName).localeCompare(normalizeText(right.row.driverName));
    }

    const leftTime = Number.isFinite(Number(left.totalTimeMs)) ? Number(left.totalTimeMs) : Number.POSITIVE_INFINITY;
    const rightTime = Number.isFinite(Number(right.totalTimeMs)) ? Number(right.totalTimeMs) : Number.POSITIVE_INFINITY;

    return leftTime - rightTime;
  });

  let timedPlace = 0;
  const affectedResults = sortedTrackItems.map(item => {
    const rankLabel = item.isDns ? "DNS" : item.isDnf ? "DNF" : `P${timedPlace + 1}`;
    const points = item.isDns
      ? 0
      : item.isDnf
        ? Math.max(0, parseNumericValue(item.record?.dnf_points ?? item.record?.dnfPoints) || 0)
        : getPointsForPlace(timedPlace + 1);

    if (!item.isDns && !item.isDnf) {
      timedPlace += 1;
    }

    item.entry.rankLabel = rankLabel;
    item.entry.pointsLabel = `${points} pts`;
    item.summary.totalPoints = points;

    return createResultRecord({
      record: {
        ...item.record,
        selected_day_id: item.record.selected_day_id || getDayId(item.entry.dayLabel),
        selected_day_label: item.record.selected_day_label || item.entry.dayLabel,
      },
      row: item.row,
      category,
      track,
      entry: item.entry,
      points,
      rankLabel,
    });
  });

  rows.forEach(currentRow => {
    const summaries = getRowSummaries(currentRow);
    const timedValues = summaries
      .flatMap(summary => summary.entries || [])
      .map(entry => parseTimingMs(entry.timingLabel))
      .filter(value => Number.isFinite(Number(value)));
    const totalTimingMs = timedValues.reduce((total, value) => total + value, 0);

    currentRow.totalPoints = summaries.reduce((total, summary) => total + (parseNumericValue(summary.totalPoints) || 0), 0);
    currentRow.totalTimingMs = timedValues.length ? totalTimingMs : null;
    currentRow.totalTimingLabel = timedValues.length ? formatTimingMs(totalTimingMs) : "";
    currentRow.trackSummaries = summaries.sort((left, right) => {
      const leftIndex = category.tracks.findIndex(item => item.key === getTrackMergeKey(left));
      const rightIndex = category.tracks.findIndex(item => item.key === getTrackMergeKey(right));

      return (leftIndex < 0 ? 999 : leftIndex) - (rightIndex < 0 ? 999 : rightIndex);
    });
    currentRow.trackMap = currentRow.trackSummaries.reduce((acc, summary) => {
      const key = getTrackMergeKey(summary);

      if (key) {
        acc[key] = summary;
      }

      return acc;
    }, {});
  });

  const updatedCategory = {
    ...(existingCategory || {}),
    key: category.key,
    label: category.label,
    tracks: category.tracks.map(item => item.label),
    maxPoints: category.tracks.length * 100,
    rows: sortRows(rows),
  };
  const teamsByVehicle = new Map();

  (Array.isArray(existing.teams) ? existing.teams : []).forEach(team => {
    const key = getVehicleKey(team, getCategoryKey(team) || category.key);

    if (key) {
      teamsByVehicle.set(key, team);
    }
  });

  updatedCategory.rows.forEach((currentRow, index) => {
    const key = getVehicleKey(currentRow, category.key);

    if (key) {
      teamsByVehicle.set(key, {
        ...(teamsByVehicle.get(key) || {}),
        id: `${category.key}-${currentRow.stickerNumber || index + 1}`,
        team_name: currentRow.teamName,
        driver_name: currentRow.driverName,
        codriver_name: currentRow.coDriverName,
        car_number: currentRow.stickerNumber,
        category: category.key,
        status: "ACTIVE",
      });
    }
  });

  const nextCategoryOptions = new Map();

  (Array.isArray(existing.categoryOptions) ? existing.categoryOptions : []).forEach(item => {
    const key = getCategoryKey(item);

    if (key) {
      nextCategoryOptions.set(key, item);
    }
  });
  nextCategoryOptions.set(category.key, { key: category.key, label: category.label || formatCategoryLabel(category.key) });

  return {
    ...existing,
    generatedAt: new Date().toISOString(),
    source: "admin-track-entry",
    schemaVersion: 1,
    focusCategory: category.key,
    teams: [...teamsByVehicle.values()],
    results: [
      ...(Array.isArray(existing.results) ? existing.results : []).filter(record => {
        const source = getResultSource(record);
        return !(getCategoryKey(source) === category.key && getTrackMergeKey(source) === track.key);
      }),
      ...affectedResults,
    ],
    disputes: Array.isArray(existing.disputes) ? existing.disputes : [],
    categoryOptions: [...nextCategoryOptions.values()],
    leaderboard: {
      ...(existing.leaderboard || {}),
      categories: [
        ...existingCategories.filter(item => getCategoryKey(item) !== category.key),
        updatedCategory,
      ],
    },
  };
}
