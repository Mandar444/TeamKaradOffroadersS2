import { z } from "zod";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { doc, getSheetByName, initSheets } from "@/lib/google-sheets/client";

export const LEADERBOARD_SHEET_NAME =
  process.env.GOOGLE_LEADERBOARD_SHEET_NAME || "Leaderboard Snapshots";

export const leaderboardSnapshotSchema = z
  .object({
    generatedAt: z.string().min(1),
    source: z.string().min(1),
    teams: z.array(z.any()).default([]),
    categoryOptions: z.array(z.any()).default([]),
    results: z.array(z.any()).default([]),
    disputes: z.array(z.any()).default([]),
  })
  .passthrough();

const LEADERBOARD_HEADERS = [
  "snapshot_id",
  "generated_at",
  "source",
  "teams_json",
  "category_options_json",
  "results_json",
  "disputes_json",
  "raw_json",
  "created_at",
];

const FALLBACK_FILE = path.join(process.cwd(), "data", "leaderboard-snapshots.json");

function hasGoogleSheetsConfig() {
  return Boolean(
    process.env.GOOGLE_SHEET_ID &&
      process.env.GOOGLE_CLIENT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
  );
}

async function readFallbackSnapshots() {
  try {
    const raw = await readFile(FALLBACK_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
}

async function writeFallbackSnapshots(snapshots) {
  await mkdir(path.dirname(FALLBACK_FILE), { recursive: true });
  await writeFile(FALLBACK_FILE, JSON.stringify(snapshots, null, 2), "utf8");
}

async function ensureLeaderboardSheet() {
  await initSheets();

  let sheet = await getSheetByName(LEADERBOARD_SHEET_NAME);
  if (!sheet) {
    sheet = await doc.addSheet({
      title: LEADERBOARD_SHEET_NAME,
      headerValues: LEADERBOARD_HEADERS,
      gridProperties: {
        columnCount: LEADERBOARD_HEADERS.length,
        rowCount: 2000,
      },
    });
    return sheet;
  }

  if ((sheet.gridProperties?.columnCount || 0) < LEADERBOARD_HEADERS.length) {
    await sheet.updateProperties({
      gridProperties: { columnCount: LEADERBOARD_HEADERS.length },
    });
  }

  await sheet.loadHeaderRow();
  const currentHeaders = sheet.headerValues || [];
  const missingHeaders = LEADERBOARD_HEADERS.filter((header) => !currentHeaders.includes(header));
  if (missingHeaders.length > 0) {
    await sheet.setHeaderRow([...currentHeaders, ...missingHeaders]);
  }

  return sheet;
}

function readJsonCell(row, key, fallback) {
  const raw = row.get(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function rowToSnapshot(row) {
  const rawJson = row.get("raw_json");
  if (rawJson) {
    try {
      return leaderboardSnapshotSchema.parse(JSON.parse(rawJson));
    } catch {
      // Fall through to rebuilding from columns.
    }
  }

  return leaderboardSnapshotSchema.parse({
    generatedAt: row.get("generated_at") || row.get("created_at") || new Date().toISOString(),
    source: row.get("source") || "unknown",
    teams: readJsonCell(row, "teams_json", []),
    categoryOptions: readJsonCell(row, "category_options_json", []),
    results: readJsonCell(row, "results_json", []),
    disputes: readJsonCell(row, "disputes_json", []),
  });
}

export async function saveLeaderboardSnapshot(payload) {
  const snapshot = leaderboardSnapshotSchema.parse(payload);

  if (!hasGoogleSheetsConfig()) {
    const snapshots = await readFallbackSnapshots();
    snapshots.push({
      ...snapshot,
      createdAt: new Date().toISOString(),
    });
    await writeFallbackSnapshots(snapshots);
    return snapshot;
  }

  const sheet = await ensureLeaderboardSheet();

  await sheet.addRow({
    snapshot_id: `LB-${Date.now().toString(36).toUpperCase()}`,
    generated_at: snapshot.generatedAt,
    source: snapshot.source,
    teams_json: JSON.stringify(snapshot.teams ?? []),
    category_options_json: JSON.stringify(snapshot.categoryOptions ?? []),
    results_json: JSON.stringify(snapshot.results ?? []),
    disputes_json: JSON.stringify(snapshot.disputes ?? []),
    raw_json: JSON.stringify(snapshot),
    created_at: new Date().toISOString(),
  });

  return snapshot;
}

export async function getLatestLeaderboardSnapshot() {
  if (!hasGoogleSheetsConfig()) {
    const snapshots = await readFallbackSnapshots();
    return snapshots.at(-1) || null;
  }

  const sheet = await ensureLeaderboardSheet();
  const rows = await sheet.getRows();
  const row = rows.at(-1);
  if (!row) return null;

  return rowToSnapshot(row);
}
