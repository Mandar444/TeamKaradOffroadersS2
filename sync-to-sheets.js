const fs = require('fs');
const path = require('path');

// Self-contained .env parser to avoid external dependency issues
const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, 'utf8').split('\n');
  lines.forEach(line => {
    const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      // Handle escaped newlines
      value = value.replace(/\\n/g, '\n');
      // Remove surrounding quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      process.env[key] = value.trim();
    }
  });
}

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
let GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

if (!SPREADSHEET_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
  console.error("Missing Google Sheets credentials in .env");
  process.exit(1);
}

const LEADERBOARD_SHEET_NAME = process.env.GOOGLE_LEADERBOARD_SHEET_NAME || "Live Leaderboard";
const SNAPSHOT_RECORD_KEY = "leaderboard_snapshot";
const CHUNK_SIZE = 45000;
const LEADERBOARD_HEADERS = ["record_key", "chunk_index", "chunk", "updated_at"];

const chunkText = value => {
  const chunks = [];
  const text = String(value || "");
  for (let index = 0; index < text.length; index += CHUNK_SIZE) {
    chunks.push(text.slice(index, index + CHUNK_SIZE));
  }
  return chunks.length ? chunks : [""];
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const isQuotaError = error => {
  const status = error?.response?.status || error?.status || error?.code;
  const message = String(error?.message || error || "").toLowerCase();
  return (
    Number(status) === 429 ||
    message.includes("429") ||
    message.includes("quota exceeded") ||
    message.includes("rate limit")
  );
};

const withQuotaRetry = async (operation) => {
  const delays = [3000, 8000, 16000, 30000];
  let lastError = null;

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isQuotaError(error) || attempt >= delays.length) {
        throw error;
      }
      console.warn(`[QUOTA] 429 received. Retrying in ${delays[attempt]}ms (attempt ${attempt + 1}/${delays.length})...`);
      await sleep(delays[attempt]);
    }
  }
  throw lastError;
};

async function main() {
  try {
    const serviceAccountAuth = new JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    console.log("Loading doc info...");
    await withQuotaRetry(() => doc.loadInfo());

    let sheet = doc.sheetsByTitle[LEADERBOARD_SHEET_NAME];
    if (!sheet) {
      console.log(`Creating sheet ${LEADERBOARD_SHEET_NAME}...`);
      sheet = await withQuotaRetry(() => doc.addSheet({
        title: LEADERBOARD_SHEET_NAME,
        headerValues: LEADERBOARD_HEADERS,
        gridProperties: { columnCount: LEADERBOARD_HEADERS.length, rowCount: 200 },
      }));
    } else {
      await withQuotaRetry(() => sheet.loadHeaderRow());
    }

    const sourceFile = path.join(__dirname, "public", "data", "leaderboard-export.json");
    console.log("Reading leaderboard-export.json from", sourceFile);
    const rawData = fs.readFileSync(sourceFile, "utf8");
    const snapshot = JSON.parse(rawData);

    console.log("Chunking data...");
    const updatedAt = new Date().toISOString();
    const chunks = chunkText(JSON.stringify(snapshot));
    const chunkRows = chunks.map((chunk, index) => ({
      record_key: SNAPSHOT_RECORD_KEY,
      chunk_index: String(index),
      chunk,
      updated_at: updatedAt,
    }));

    console.log("Clearing existing rows...");
    await withQuotaRetry(() => sheet.clearRows({ start: 2 }));

    console.log("Writing chunk rows...");
    await withQuotaRetry(() => sheet.addRows(chunkRows, { raw: true }));

    console.log("Successfully synchronized leaderboard snapshot to Google Sheets!");
  } catch (error) {
    console.error("Error synchronizing to Sheets:", error);
    process.exit(1);
  }
}

main();
