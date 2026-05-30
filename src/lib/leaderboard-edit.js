import {
  normalizeResultIdentityKey,
  normalizeShortIdentityKey,
  normalizeTrackKey,
  safeParseJsonObject,
} from "@/lib/leaderboard-snapshot";

const normalizeText = value => String(value || "").trim();

const normalizeCategoryKey = value =>
  {
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

const parseNumber = value => {
  const numericValue = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const parseTimingMs = value => {
  const rawValue = normalizeText(value);

  if (!rawValue || rawValue.toUpperCase().startsWith("DNF") || rawValue.toUpperCase() === "DNS") {
    return null;
  }

  const numericValue = Number(rawValue);
  if (Number.isFinite(numericValue) && !rawValue.includes(":")) {
    return Math.round(numericValue);
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
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return "";
  }

  let remainingMs = Math.max(0, Math.round(Number(value)));
  const minutes = Math.floor(remainingMs / 60000);
  remainingMs -= minutes * 60000;
  const seconds = Math.floor(remainingMs / 1000);
  remainingMs -= seconds * 1000;
  const centiseconds = Math.round(remainingMs / 10);

  return [minutes, seconds, centiseconds]
    .map(part => String(part).padStart(2, "0"))
    .join(":");
};

const parsePenaltySeconds = value => {
  const rawValue = normalizeText(value);

  if (!rawValue) {
    return 0;
  }

  if (rawValue.includes(":")) {
    const timingMs = parseTimingMs(rawValue);
    return timingMs === null ? 0 : timingMs / 1000;
  }

  return parseNumber(rawValue);
};

const formatPointsLabel = value => `${parseNumber(value)} pts`;

const normalizeRankLabel = value => {
  const rank = normalizeText(value);

  if (!rank) {
    return "";
  }

  return rank.toUpperCase().startsWith("P") ? rank.toUpperCase() : `P${rank}`;
};

const PENALTY_FIELDS = [
  {
    count: "buntingCount",
    countKeys: ["bunting_count", "busting_count", "buntingCount", "bustingCount"],
    penalty: "buntingPenaltyTime",
    penaltyKeys: ["bunting_penalty_time", "busting_penalty_time", "buntingPenaltyTime", "bustingPenaltyTime"],
  },
  {
    count: "poleDownCount",
    countKeys: ["pole_down_count", "poleDownCount"],
    penalty: "poleDownPenaltyTime",
    penaltyKeys: ["pole_down_penalty_time", "poleDownPenaltyTime"],
  },
  {
    count: "seatbeltCount",
    countKeys: ["seatbelt_count", "seatbeltCount"],
    penalty: "seatbeltPenaltyTime",
    penaltyKeys: ["seatbelt_penalty_time", "seatbeltPenaltyTime"],
  },
  {
    count: "groundTouchCount",
    countKeys: ["ground_touch_count", "groundTouchCount"],
    penalty: "groundTouchPenaltyTime",
    penaltyKeys: ["ground_touch_penalty_time", "groundTouchPenaltyTime"],
  },
  {
    count: "lateStartCount",
    countKeys: ["late_start_count", "lateStartCount"],
    penalty: "lateStartPenaltyTime",
    penaltyKeys: ["late_start_penalty_time", "lateStartPenaltyTime"],
  },
  {
    count: "attemptCount",
    countKeys: ["attempt_count", "attemptCount"],
    penalty: "attemptPenaltyTime",
    penaltyKeys: ["attempt_penalty_time", "attemptPenaltyTime"],
  },
  {
    count: "taskSkippedCount",
    countKeys: ["task_skipped_count", "taskSkippedCount"],
    penalty: "taskSkippedPenaltyTime",
    penaltyKeys: ["task_skipped_penalty_time", "taskSkippedPenaltyTime"],
  },
];

const getFirstRecordValue = (record, keys, fallback = "") => {
  for (const key of keys) {
    const value = record?.[key];

    if (value !== null && value !== undefined && value !== "") {
      return value;
    }
  }

  return fallback;
};

const getPenaltyValue = (record, values, field, keys) =>
  values[field] ?? getFirstRecordValue(record, keys, 0);

const getPenaltyBreakdown = (record, values) =>
  PENALTY_FIELDS.map(field => ({
    ...field,
    countValue: getPenaltyValue(record, values, field.count, field.countKeys),
    penaltyValue: getPenaltyValue(record, values, field.penalty, field.penaltyKeys),
  }));

const getTotalPenaltySeconds = breakdown =>
  breakdown.reduce((total, field) => total + parsePenaltySeconds(field.penaltyValue), 0);

const getRecordCategoryKey = record =>
  normalizeCategoryKey(record?.categoryKey || record?.category_key || record?.category || "");

const getRecordSticker = record =>
  normalizeText(record?.sticker_number || record?.stickerNumber || record?.sticker || record?.car_number || record?.carNumber || "")
    .replace(/^#/, "");

const getRecordDriver = record =>
  normalizeText(record?.driver_name || record?.driverName || record?.driver || "").toLowerCase();

const getVehicleKey = (record, fallbackCategoryKey = "") => {
  const categoryKey = getRecordCategoryKey(record) || fallbackCategoryKey;
  const sticker = getRecordSticker(record);
  const driver = getRecordDriver(record);

  if (categoryKey && sticker) {
    return `${categoryKey}|${sticker}`;
  }

  return categoryKey && driver ? `${categoryKey}|${driver}` : "";
};

const getDayKey = record =>
  normalizeText(
    record?.selected_day_id ||
      record?.selectedDayId ||
      record?.selected_day_label ||
      record?.selectedDayLabel ||
      record?.dayLabel ||
      record?.day ||
      ""
  ).toLowerCase();

const getTrackKeyFromRecord = record =>
  normalizeTrackKey(record?.track_name || record?.trackName || record?.track_label || record?.trackLabel || record?.track || "");

const getSummaryKey = summary =>
  normalizeTrackKey(summary?.trackKey || summary?.track_key || summary?.trackLabel || summary?.track_label || summary?.label || "");

const getEntryKey = entry =>
  normalizeText(entry?.key || entry?.identityKey || `${getDayKey(entry)}|${entry?.timingLabel || entry?.timing_label || ""}`).toLowerCase();

const getRecordIdentityKeys = record => [
  normalizeResultIdentityKey(record),
  normalizeShortIdentityKey(record),
].filter(Boolean);

const getRequestedIdentityKeys = payload =>
  [payload?.key, payload?.shortKey]
    .map(key => normalizeText(key))
    .filter(Boolean);

const isMatchingRecord = (record, payload) => {
  const requestedKeys = getRequestedIdentityKeys(payload);
  const recordKeys = getRecordIdentityKeys(record);

  if (requestedKeys.some(key => recordKeys.includes(key))) {
    return true;
  }

  if (requestedKeys.length) {
    return false;
  }

  const categoryKey = normalizeCategoryKey(payload.categoryKey || payload.category || "");
  const trackKey = normalizeTrackKey(payload.track || payload.trackName || "");
  const dayKey = normalizeText(payload.day || payload.selectedDayLabel || "").toLowerCase();

  return (
    getVehicleKey(record, categoryKey) === `${categoryKey}|${normalizeText(payload.sticker || payload.stickerNumber).replace(/^#/, "")}` &&
    getTrackKeyFromRecord(record) === trackKey &&
    (!dayKey || getDayKey(record) === dayKey)
  );
};

const updateRecord = (record, values) => {
  const submission = safeParseJsonObject(record?.submission_json);
  const isDns = Boolean(values.isDns);
  const isDnf = Boolean(values.isDnf);
  const wrongCourseSelected = isDnf && Boolean(values.wrongCourseSelected);
  const fourthAttemptSelected = isDnf && Boolean(values.fourthAttemptSelected);
  const timeOverSelected = isDnf && Boolean(values.timeOverSelected);
  const vehicleOutOfTrackSelected = isDnf && Boolean(values.vehicleOutOfTrackSelected);
  const vehicleBreakdownSelected = isDnf && Boolean(values.vehicleBreakdownSelected);
  const dnfSelection = isDnf ? normalizeText(values.dnfSelection || submission.dnfSelection || record?.dnf_selection || "") : "";
  const dnfPoints = isDnf ? parseNumber(values.dnfPoints ?? submission.dnfPoints ?? record?.dnf_points) : 0;
  const hasSubmittedPoints = values.points !== null && values.points !== undefined && values.points !== "";
  const points = isDnf && !hasSubmittedPoints ? dnfPoints : parseNumber(values.points);
  const performanceTime = normalizeText(values.performanceTime || values.timing || record?.performance_time || record?.performanceTimeDisplay || record?.total_time || record?.totalTimeDisplay);
  const performanceMs = parseTimingMs(performanceTime);
  const penaltyBreakdown = getPenaltyBreakdown(record, values);
  const totalPenaltySeconds = getTotalPenaltySeconds(penaltyBreakdown);
  const totalPenaltyLabel = String(totalPenaltySeconds);
  const computedTotalTime = performanceMs === null ? normalizeText(values.totalTime || record?.total_time || record?.totalTimeDisplay) : formatTimingMs(performanceMs + totalPenaltySeconds * 1000);
  const rank = normalizeRankLabel(values.rank ?? record?.rank ?? record?.rank_label ?? "");
  const dayLabel = normalizeText(values.day || record?.selected_day_label || record?.selectedDayLabel || "");
  const dayId = normalizeText(values.dayId || record?.selected_day_id || record?.selectedDayId || dayLabel);
  const selectedDayDate = normalizeText(values.selectedDayDate || record?.selected_day_date || record?.selectedDayDate || "");
  const boolValue = value => (value === true || value === "true" || value === "1" ? 1 : 0);
  const updatedSubmission = {
    ...submission,
    selectedDayId: dayId,
    selectedDayLabel: dayLabel,
    selectedDayDate,
    performanceTimeDisplay: performanceTime,
    completionTime: performanceTime,
    completionTimeMilliseconds: performanceMs,
    totalPenaltiesTime: totalPenaltySeconds,
    totalTimeDisplay: computedTotalTime,
    totalTimeMilliseconds: parseTimingMs(computedTotalTime),
    bustingCount: parseNumber(penaltyBreakdown[0].countValue),
    buntingCount: parseNumber(penaltyBreakdown[0].countValue),
    poleDownCount: parseNumber(penaltyBreakdown[1].countValue),
    seatbeltCount: parseNumber(penaltyBreakdown[2].countValue),
    groundTouchCount: parseNumber(penaltyBreakdown[3].countValue),
    lateStartMode: values.lateStartMode ?? submission.lateStartMode ?? "",
    lateStartStatus: values.lateStartStatus ?? submission.lateStartStatus ?? "",
    lateStartPenaltyTime: parsePenaltySeconds(penaltyBreakdown[4].penaltyValue),
    lateStartPenaltyPoints: parseNumber(values.lateStartPenaltyPoints ?? submission.lateStartPenaltyPoints),
    attemptCount: parseNumber(penaltyBreakdown[5].countValue),
    taskSkippedCount: parseNumber(penaltyBreakdown[6].countValue),
    bustingPenaltyTime: parsePenaltySeconds(penaltyBreakdown[0].penaltyValue),
    buntingPenaltyTime: parsePenaltySeconds(penaltyBreakdown[0].penaltyValue),
    poleDownPenaltyTime: parsePenaltySeconds(penaltyBreakdown[1].penaltyValue),
    seatbeltPenaltyTime: parsePenaltySeconds(penaltyBreakdown[2].penaltyValue),
    groundTouchPenaltyTime: parsePenaltySeconds(penaltyBreakdown[3].penaltyValue),
    attemptPenaltyTime: parsePenaltySeconds(penaltyBreakdown[5].penaltyValue),
    taskSkippedPenaltyTime: parsePenaltySeconds(penaltyBreakdown[6].penaltyValue),
    points,
    isDNS: isDns,
    isDNF: isDnf,
    wrongCourseSelected,
    fourthAttemptSelected,
    timeOverSelected,
    vehicleOutOfTrackSelected,
    vehicleBreakdownSelected,
    dnfSelection,
    dnfPoints,
  };

  return {
    ...record,
    selected_day_id: dayId,
    selectedDayId: dayId,
    selected_day_label: dayLabel,
    selectedDayLabel: dayLabel,
    selected_day_date: selectedDayDate,
    selectedDayDate: selectedDayDate,
    performance_time: performanceTime,
    performanceTimeDisplay: performanceTime,
    performance_time_ms: performanceMs,
    performanceTimeMilliseconds: performanceMs,
    completion_time: performanceTime,
    completionTime: performanceTime,
    completion_time_ms: performanceMs,
    completionTimeMilliseconds: performanceMs,
    total_penalties_time: totalPenaltyLabel,
    totalPenaltiesTime: totalPenaltySeconds,
    total_time: computedTotalTime,
    totalTimeDisplay: computedTotalTime,
    total_time_ms: parseTimingMs(computedTotalTime),
    totalTimeMilliseconds: parseTimingMs(computedTotalTime),
    bunting_count: parseNumber(penaltyBreakdown[0].countValue),
    busting_count: parseNumber(penaltyBreakdown[0].countValue),
    buntingCount: parseNumber(penaltyBreakdown[0].countValue),
    bustingCount: parseNumber(penaltyBreakdown[0].countValue),
    bunting_penalty_time: parsePenaltySeconds(penaltyBreakdown[0].penaltyValue),
    busting_penalty_time: parsePenaltySeconds(penaltyBreakdown[0].penaltyValue),
    buntingPenaltyTime: parsePenaltySeconds(penaltyBreakdown[0].penaltyValue),
    bustingPenaltyTime: parsePenaltySeconds(penaltyBreakdown[0].penaltyValue),
    pole_down_count: parseNumber(penaltyBreakdown[1].countValue),
    poleDownCount: parseNumber(penaltyBreakdown[1].countValue),
    pole_down_penalty_time: parsePenaltySeconds(penaltyBreakdown[1].penaltyValue),
    poleDownPenaltyTime: parsePenaltySeconds(penaltyBreakdown[1].penaltyValue),
    seatbelt_count: parseNumber(penaltyBreakdown[2].countValue),
    seatbeltCount: parseNumber(penaltyBreakdown[2].countValue),
    seatbelt_penalty_time: parsePenaltySeconds(penaltyBreakdown[2].penaltyValue),
    seatbeltPenaltyTime: parsePenaltySeconds(penaltyBreakdown[2].penaltyValue),
    ground_touch_count: parseNumber(penaltyBreakdown[3].countValue),
    groundTouchCount: parseNumber(penaltyBreakdown[3].countValue),
    ground_touch_penalty_time: parsePenaltySeconds(penaltyBreakdown[3].penaltyValue),
    groundTouchPenaltyTime: parsePenaltySeconds(penaltyBreakdown[3].penaltyValue),
    late_start_mode: values.lateStartMode ?? record?.late_start_mode ?? "",
    lateStartMode: values.lateStartMode ?? record?.lateStartMode ?? "",
    late_start_status: values.lateStartStatus ?? record?.late_start_status ?? "",
    lateStartStatus: values.lateStartStatus ?? record?.lateStartStatus ?? "",
    late_start_count: parseNumber(penaltyBreakdown[4].countValue),
    lateStartCount: parseNumber(penaltyBreakdown[4].countValue),
    late_start_penalty_time: parsePenaltySeconds(penaltyBreakdown[4].penaltyValue),
    lateStartPenaltyTime: parsePenaltySeconds(penaltyBreakdown[4].penaltyValue),
    late_start_penalty_points: parseNumber(values.lateStartPenaltyPoints ?? record?.late_start_penalty_points),
    lateStartPenaltyPoints: parseNumber(values.lateStartPenaltyPoints ?? record?.lateStartPenaltyPoints),
    attempt_count: parseNumber(penaltyBreakdown[5].countValue),
    attemptCount: parseNumber(penaltyBreakdown[5].countValue),
    attempt_penalty_time: parsePenaltySeconds(penaltyBreakdown[5].penaltyValue),
    attemptPenaltyTime: parsePenaltySeconds(penaltyBreakdown[5].penaltyValue),
    task_skipped_count: parseNumber(penaltyBreakdown[6].countValue),
    taskSkippedCount: parseNumber(penaltyBreakdown[6].countValue),
    task_skipped_penalty_time: parsePenaltySeconds(penaltyBreakdown[6].penaltyValue),
    taskSkippedPenaltyTime: parsePenaltySeconds(penaltyBreakdown[6].penaltyValue),
    points,
    rank,
    rank_label: rank,
    is_dns: boolValue(isDns),
    is_dnf: boolValue(isDnf),
    wrong_course_selected: boolValue(wrongCourseSelected),
    fourth_attempt_selected: boolValue(fourthAttemptSelected),
    time_over_selected: boolValue(timeOverSelected),
    vehicle_out_of_track_selected: boolValue(vehicleOutOfTrackSelected),
    vehicle_breakdown_selected: boolValue(vehicleBreakdownSelected),
    dnf_selection: dnfSelection,
    dnf_points: dnfPoints,
    submission_json: JSON.stringify(updatedSubmission),
    updated_at: new Date().toISOString(),
  };
};

const updateCategoryRows = (category, updatedRecord, payload) => {
  const categoryKey = normalizeCategoryKey(category?.key || category?.category || category?.label || "");
  const trackKey = getTrackKeyFromRecord(updatedRecord);
  const vehicleKey = getVehicleKey(updatedRecord, categoryKey);
  const points = parseNumber(updatedRecord.points);
  const timingLabel = normalizeText(updatedRecord.total_time || updatedRecord.totalTimeDisplay || updatedRecord.performance_time);
  const dayLabel = normalizeText(updatedRecord.selected_day_label || updatedRecord.selectedDayLabel || payload.day || "");
  const rankLabel = normalizeRankLabel(updatedRecord.rank || updatedRecord.rank_label || "");

  const rows = (Array.isArray(category?.rows) ? category.rows : []).map(row => {
    if (getVehicleKey(row, categoryKey) !== vehicleKey) {
      return row;
    }

    const summaries = Array.isArray(row.trackSummaries) ? row.trackSummaries : [];
    const nextSummaries = summaries.map(summary => {
      if (getSummaryKey(summary) !== trackKey) {
        return summary;
      }

      const entries = Array.isArray(summary.entries) ? summary.entries : [];
      const nextEntries = entries.length
        ? entries.map(entry => {
            const entryDay = normalizeText(entry.dayLabel || entry.day_label || "").toLowerCase();
            if (payload.key && entry.key !== payload.key && getEntryKey(entry) !== normalizeText(payload.key).toLowerCase()) {
              return entry;
            }

            if (!payload.key && dayLabel && entryDay && entryDay !== dayLabel.toLowerCase()) {
              return entry;
            }

            return {
              ...entry,
              dayLabel,
              timingLabel,
              pointsLabel: formatPointsLabel(points),
              rankLabel,
            };
          })
        : [{
            key: payload.key || normalizeResultIdentityKey(updatedRecord),
            dayLabel,
            dayOrder: 1,
            timingLabel,
            pointsLabel: formatPointsLabel(points),
            rankLabel,
          }];
      const hasMatchedEntry = nextEntries.some(entry =>
        (payload.key && (entry.key === payload.key || getEntryKey(entry) === normalizeText(payload.key).toLowerCase())) ||
        (!payload.key && normalizeText(entry.dayLabel).toLowerCase() === dayLabel.toLowerCase())
      );
      const finalEntries = hasMatchedEntry
        ? nextEntries
        : [...nextEntries, {
            key: payload.key || normalizeResultIdentityKey(updatedRecord),
            dayLabel,
            dayOrder: nextEntries.length + 1,
            timingLabel,
            pointsLabel: formatPointsLabel(points),
            rankLabel,
          }];
      const totalPoints = finalEntries.reduce((total, entry) => total + parseNumber(entry.pointsLabel), 0);

      return {
        ...summary,
        totalPoints,
        entries: finalEntries,
      };
    });
    const totalPoints = nextSummaries.reduce((total, summary) => total + parseNumber(summary.totalPoints), 0);
    const timingValues = nextSummaries
      .flatMap(summary => summary.entries || [])
      .map(entry => parseTimingMs(entry.timingLabel))
      .filter(value => value !== null);

    return {
      ...row,
      totalPoints,
      totalTimingMs: timingValues.length ? timingValues.reduce((total, value) => total + value, 0) : row.totalTimingMs ?? null,
      totalTimingLabel: timingLabel || row.totalTimingLabel || "",
      trackMap: nextSummaries.reduce((acc, summary) => {
        const key = getSummaryKey(summary);
        if (key) {
          acc[key] = summary;
        }
        return acc;
      }, {}),
      trackSummaries: nextSummaries,
    };
  });

  return {
    ...category,
    rows: rows.sort((left, right) => {
      if (right.totalPoints !== left.totalPoints) {
        return right.totalPoints - left.totalPoints;
      }

      if (left.totalTimingMs !== null && right.totalTimingMs !== null && left.totalTimingMs !== right.totalTimingMs) {
        return left.totalTimingMs - right.totalTimingMs;
      }

      return Number(left.stickerNumber || 0) - Number(right.stickerNumber || 0);
    }),
  };
};

export function updateLeaderboardTrackResult(snapshot, payload) {
  const existingSnapshot = snapshot || {};
  const results = Array.isArray(existingSnapshot.results) ? existingSnapshot.results : [];
  const resultIndex = results.findIndex(record => isMatchingRecord(record, payload));

  if (resultIndex < 0) {
    throw new Error("Leaderboard track result was not found.");
  }

  const updatedRecord = updateRecord(results[resultIndex], payload.values || {});
  const nextResults = results.map((record, index) => (index === resultIndex ? updatedRecord : record));
  const nextDisputes = Array.isArray(existingSnapshot.disputes)
    ? existingSnapshot.disputes.map(record => (isMatchingRecord(record, payload) ? updateRecord(record, payload.values || {}) : record))
    : [];
  const updatedCategoryKey = getRecordCategoryKey(updatedRecord);
  const categories = (Array.isArray(existingSnapshot.leaderboard?.categories) ? existingSnapshot.leaderboard.categories : [])
    .map(category => {
      const categoryKey = normalizeCategoryKey(category?.key || category?.category || category?.label || "");
      return categoryKey === updatedCategoryKey ? updateCategoryRows(category, updatedRecord, payload) : category;
    });

  return {
    ...existingSnapshot,
    source: "admin-leaderboard-edit",
    generatedAt: new Date().toISOString(),
    results: nextResults,
    disputes: nextDisputes,
    leaderboard: {
      ...(existingSnapshot.leaderboard || {}),
      categories,
    },
  };
}
