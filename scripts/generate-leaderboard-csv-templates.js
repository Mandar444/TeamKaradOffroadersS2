const fs = require("fs");
const path = require("path");

const categories = [
  ["OPEN", "open.csv"],
  ["DIESEL_MODIFIED", "diesel-modified.csv"],
  ["PETROL_MODIFIED", "petrol-modified.csv"],
  ["DIESEL_EXPERT", "diesel-expert.csv"],
  ["PETROL_EXPERT", "petrol-expert.csv"],
  ["THAR_SUV", "thar-suv.csv"],
  ["JIMNY_SUV", "jimny-suv.csv"],
  ["SUV_MODIFIED", "suv-modified.csv"],
  ["STOCK_NDMS", "stock-ndms.csv"],
  ["LADIES_CATEGORY", "ladies-category.csv"],
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

function main() {
  const rootDir = process.cwd();
  const sourceFile = path.join(rootDir, "public", "data", "leaderboard-export.json");
  const outputDir = path.join(rootDir, "public", "data", "leaderboard-csv");
  const snapshot = JSON.parse(fs.readFileSync(sourceFile, "utf8"));
  const snapshotCategories = snapshot?.leaderboard?.categories || [];

  fs.mkdirSync(outputDir, { recursive: true });

  categories.forEach(([categoryKey, fileName]) => {
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
  });
}

main();
