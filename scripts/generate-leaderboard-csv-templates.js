const fs = require("fs");
const path = require("path");

const categories = [
  ["OPEN", "open.csv", "open-entry-details.csv"],
  ["DIESEL_MODIFIED", "diesel-modified.csv", "diesel-modified-entry-details.csv"],
  ["PETROL_MODIFIED", "petrol-modified.csv", "petrol-modified-entry-details.csv"],
  ["DIESEL_EXPERT", "diesel-expert.csv", "diesel-expert-entry-details.csv"],
  ["PETROL_EXPERT", "petrol-expert.csv", "petrol-expert-entry-details.csv"],
  ["THAR_SUV", "thar-suv.csv", "thar-suv-entry-details.csv"],
  ["JIMNY_SUV", "jimny-suv.csv", "jimny-suv-entry-details.csv"],
  ["SUV_MODIFIED", "suv-modified.csv", "suv-modified-entry-details.csv"],
  ["STOCK_NDMS", "stock-ndms.csv", "stock-ndms-entry-details.csv"],
  ["LADIES_CATEGORY", "ladies-category.csv", "ladies-category-entry-details.csv"],
];

const baseHeaders = [
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

const detailHeaders = [
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

function normalizeHeader(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function escapeCsvValue(value) {
  const rawValue = value === null || value === undefined ? "" : String(value);

  if (/[",\r\n]/.test(rawValue)) {
    return `"${rawValue.replace(/"/g, '""')}"`;
  }

  return rawValue;
}

function getTrackSummary(row, trackLabel) {
  const trackKey = normalizeHeader(trackLabel);

  return (row.trackSummaries || []).find(summary =>
    normalizeHeader(summary.trackKey || summary.trackLabel) === trackKey ||
    normalizeHeader(summary.trackLabel) === trackKey
  ) || null;
}

function getFirstEntry(summary) {
  return Array.isArray(summary?.entries) && summary.entries.length > 0 ? summary.entries[0] : null;
}

function safeParseJson(value) {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (error) {
    return {};
  }
}

function stringifyJsonCell(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value);
}

function normalizeCategoryKey(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getFirstValue(source, keys, fallback = "") {
  for (const key of keys) {
    const value = source?.[key];

    if (value !== null && value !== undefined && value !== "") {
      return value;
    }
  }

  return fallback;
}

function findResult(results, category, row, track) {
  const categoryIdentities = new Set([
    normalizeCategoryKey(category.key),
    normalizeCategoryKey(category.label),
  ]);
  const stickerNumber = String(row.stickerNumber || "").trim();
  const trackKey = normalizeHeader(track);

  return results.find(result =>
    categoryIdentities.has(normalizeCategoryKey(result.category)) &&
    String(result.sticker_number || result.stickerNumber || "").trim() === stickerNumber &&
    normalizeHeader(result.track_name || result.trackName) === trackKey
  ) || null;
}

function getDetailRecord({ category, row, track, result, summary, entry, rowIndex }) {
  const submission = safeParseJson(result?.submission_json);
  const dayLabel = getFirstValue(result, ["selected_day_label", "selectedDayLabel"], entry?.dayLabel || "D1");
  const dayId = getFirstValue(result, ["selected_day_id", "selectedDayId"], submission.selectedDayId || "day-1");
  const detail = {
    category_key: category.key,
    category_label: category.label,
    sr_no: submission.srNo || rowIndex + 1,
    sticker_number: row.stickerNumber,
    team_name: getFirstValue(submission, ["teamName"], row.teamName),
    driver_name: row.driverName,
    codriver_name: row.coDriverName,
    track_name: track,
    selected_day_id: dayId,
    selected_day_label: dayLabel,
    selected_day_date: getFirstValue(result, ["selected_day_date", "selectedDayDate"], submission.selectedDayDate || ""),
    rank: entry?.rankLabel || result?.rank || "",
    points: entry || result ? (result?.points ?? summary?.totalPoints ?? "") : "",
    completion_time: submission.completionTime || result?.performance_time || entry?.timingLabel || "",
    performance_time: result?.performance_time || submission.performanceTimeDisplay || entry?.timingLabel || "",
    performance_time_ms: submission.completionTimeMilliseconds || "",
    total_penalties_time: result?.total_penalties_time ?? submission.totalPenaltiesTime ?? "",
    total_time: result?.total_time || submission.totalTimeDisplay || entry?.timingLabel || "",
    total_time_ms: submission.totalTimeMilliseconds || "",
    track_timer_limit_display: submission.trackTimerLimitDisplay || "",
    bunting_count: result?.bunting_count ?? submission.bustingCount ?? "",
    bunting_penalty_time: submission.bustingPenaltyTime ?? "",
    pole_down_count: submission.poleDownCount ?? "",
    pole_down_penalty_time: submission.poleDownPenaltyTime ?? "",
    seatbelt_count: result?.seatbelt_count ?? submission.seatbeltCount ?? "",
    seatbelt_penalty_time: submission.seatbeltPenaltyTime ?? "",
    ground_touch_count: result?.ground_touch_count ?? submission.groundTouchCount ?? "",
    ground_touch_penalty_time: submission.groundTouchPenaltyTime ?? "",
    late_start_mode: submission.lateStartMode || "",
    late_start_status: submission.lateStartStatus || "",
    late_start_count: result?.late_start_count ?? submission.lateStartCount ?? "",
    late_start_penalty_time: submission.lateStartPenaltyTime ?? "",
    late_start_penalty_points: submission.lateStartPenaltyPoints ?? "",
    attempt_count: result?.attempt_count ?? submission.attemptCount ?? "",
    attempt_penalty_time: submission.attemptPenaltyTime ?? "",
    task_skipped_count: result?.task_skipped_count ?? submission.taskSkippedCount ?? "",
    task_skipped_penalty_time: submission.taskSkippedPenaltyTime ?? "",
    is_dns: result?.is_dns ?? submission.isDNS ?? "",
    is_dnf: result?.is_dnf ?? submission.isDNF ?? "",
    wrong_course_selected: submission.wrongCourseSelected ?? "",
    fourth_attempt_selected: submission.fourthAttemptSelected ?? "",
    time_over_selected: submission.timeOverSelected ?? "",
    vehicle_out_of_track_selected: submission.vehicleOutOfTrackSelected ?? "",
    vehicle_breakdown_selected: submission.vehicleBreakdownSelected ?? "",
    dnf_selection: submission.dnfSelection || "",
    dnf_points: submission.dnfPoints ?? "",
    dispute_details: stringifyJsonCell(submission.dispute_details || submission.disputeDetails),
    dispute_resolutions: stringifyJsonCell(submission.dispute_resolutions || submission.disputeResolutions),
    dispute_signatures: stringifyJsonCell(submission.dispute_signatures || submission.disputeSignatures),
    dispute_signed_by: stringifyJsonCell(submission.dispute_signed_by || submission.disputeSignedBy),
    dispute_resolution_status: submission.disputeResolutionStatus || "",
    dispute_resolution_label: submission.disputeResolutionLabel || "",
    submission_json: result?.submission_json || "",
  };

  return detail;
}

function main() {
  const rootDir = process.cwd();
  const sourceFile = path.join(rootDir, "public", "data", "leaderboard-export.json");
  const outputDir = path.join(rootDir, "public", "data", "leaderboard-csv");
  const detailOutputDir = path.join(rootDir, "public", "data", "leaderboard-entry-csv");
  const snapshot = JSON.parse(fs.readFileSync(sourceFile, "utf8"));
  const snapshotCategories = snapshot?.leaderboard?.categories || [];
  const snapshotResults = snapshot?.results || [];

  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(detailOutputDir, { recursive: true });

  categories.forEach(([categoryKey, fileName, detailFileName]) => {
    const category = snapshotCategories.find(item => item.key === categoryKey);

    if (!category) {
      return;
    }

    const tracks = (category.tracks || []).map(track => String(track));
    const trackHeaders = tracks.flatMap(track => {
      const trackKey = normalizeHeader(track);
      return [`${trackKey}_time`, `${trackKey}_points`, `${trackKey}_rank`, `${trackKey}_day`];
    });
    const headers = [...baseHeaders, ...trackHeaders];
    const lines = [headers.map(escapeCsvValue).join(",")];

    (category.rows || []).forEach((row, index) => {
      const record = {
        position: index + 1,
        category_key: category.key,
        category_label: category.label,
        sticker_number: row.stickerNumber,
        team_name: row.teamName,
        driver_name: row.driverName,
        codriver_name: row.coDriverName,
        total_points: row.totalPoints,
        total_timing_ms: row.totalTimingMs,
        total_timing_label: row.totalTimingLabel,
      };

      tracks.forEach(track => {
        const trackKey = normalizeHeader(track);
        const summary = getTrackSummary(row, track);
        const entry = getFirstEntry(summary);

        record[`${trackKey}_time`] = entry?.timingLabel || "";
        record[`${trackKey}_points`] = entry ? summary?.totalPoints || 0 : "";
        record[`${trackKey}_rank`] = entry?.rankLabel || "";
        record[`${trackKey}_day`] = entry?.dayLabel || "";
      });

      lines.push(headers.map(header => escapeCsvValue(record[header])).join(","));
    });

    fs.writeFileSync(path.join(outputDir, fileName), `${lines.join("\r\n")}\r\n`, "utf8");

    const detailLines = [detailHeaders.map(escapeCsvValue).join(",")];

    (category.rows || []).forEach((row, rowIndex) => {
      tracks.forEach(track => {
        const summary = getTrackSummary(row, track);
        const entry = getFirstEntry(summary);
        const result = findResult(snapshotResults, category, row, track);
        const record = getDetailRecord({ category, row, track, result, summary, entry, rowIndex });

        detailLines.push(detailHeaders.map(header => escapeCsvValue(record[header])).join(","));
      });
    });

    fs.writeFileSync(path.join(detailOutputDir, detailFileName), `${detailLines.join("\r\n")}\r\n`, "utf8");
  });
}

main();
