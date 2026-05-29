import { doc, initSheets } from "@/lib/google-sheets/client";

const LEADERBOARD_SHEET_NAME = process.env.GOOGLE_LEADERBOARD_SHEET_NAME || "Live Leaderboard";
const SNAPSHOT_RECORD_KEY = "leaderboard_snapshot";
const CHUNK_SIZE = 45000;
const LEADERBOARD_HEADERS = ["record_key", "chunk_index", "chunk", "updated_at"];

export const hasLeaderboardSheetsConfig = () =>
  Boolean(process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY);

async function getLeaderboardSheet() {
  if (!hasLeaderboardSheetsConfig()) {
    throw new Error("Missing Google Sheets environment variables for leaderboard storage.");
  }

  await initSheets();

  let sheet = doc.sheetsByTitle[LEADERBOARD_SHEET_NAME];

  if (!sheet) {
    sheet = await doc.addSheet({
      title: LEADERBOARD_SHEET_NAME,
      headerValues: LEADERBOARD_HEADERS,
      gridProperties: { columnCount: LEADERBOARD_HEADERS.length, rowCount: 200 },
    });
    return sheet;
  }

  await sheet.loadHeaderRow();
  const currentHeaders = sheet.headerValues || [];
  const missingHeaders = LEADERBOARD_HEADERS.filter(header => !currentHeaders.includes(header));

  if (missingHeaders.length > 0) {
    await sheet.setHeaderRow([...currentHeaders, ...missingHeaders]);
  }

  if ((sheet.gridProperties?.columnCount || 0) < LEADERBOARD_HEADERS.length) {
    await sheet.updateProperties({ gridProperties: { columnCount: LEADERBOARD_HEADERS.length } });
  }

  return sheet;
}

const chunkText = value => {
  const chunks = [];
  const text = String(value || "");

  for (let index = 0; index < text.length; index += CHUNK_SIZE) {
    chunks.push(text.slice(index, index + CHUNK_SIZE));
  }

  return chunks.length ? chunks : [""];
};

export async function readLeaderboardSnapshotFromSheets() {
  const sheet = await getLeaderboardSheet();
  const rows = await sheet.getRows();
  const snapshotRows = rows
    .filter(row => row.get("record_key") === SNAPSHOT_RECORD_KEY)
    .sort((left, right) => Number(left.get("chunk_index") || 0) - Number(right.get("chunk_index") || 0));

  if (!snapshotRows.length) {
    throw new Error("Leaderboard snapshot not found in Google Sheets.");
  }

  const jsonText = snapshotRows.map(row => row.get("chunk") || "").join("");

  if (!jsonText.trim()) {
    throw new Error("Leaderboard snapshot in Google Sheets is empty.");
  }

  return JSON.parse(jsonText);
}

export async function writeLeaderboardSnapshotToSheets(snapshot) {
  const sheet = await getLeaderboardSheet();
  const rows = await sheet.getRows();
  const existingRows = rows.filter(row => row.get("record_key") === SNAPSHOT_RECORD_KEY);

  for (const row of existingRows) {
    await row.delete();
  }

  const updatedAt = new Date().toISOString();
  const chunks = chunkText(JSON.stringify(snapshot));

  for (const [index, chunk] of chunks.entries()) {
    await sheet.addRow({
      record_key: SNAPSHOT_RECORD_KEY,
      chunk_index: String(index),
      chunk,
      updated_at: updatedAt,
    });
  }

  return {
    id: `${LEADERBOARD_SHEET_NAME}:${SNAPSHOT_RECORD_KEY}`,
    webViewLink: `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}`,
    updatedAt,
    chunks: chunks.length,
  };
}
