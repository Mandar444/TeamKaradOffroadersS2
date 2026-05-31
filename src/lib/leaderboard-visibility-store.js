import { mkdir, readFile, stat, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import {
  readJsonFromDrive,
  upsertJsonToDrive,
} from "@/lib/google-drive/client";
import {
  hasLeaderboardSheetsConfig,
  readLeaderboardSnapshotFromSheets,
  writeLeaderboardSnapshotToSheets,
} from "@/lib/leaderboard-sheets-store";

const VISIBILITY_FILE_NAME = process.env.GOOGLE_LEADERBOARD_VISIBILITY_FILE_NAME || "leaderboard-visibility.json";
const LEADERBOARD_FILE_NAME = process.env.GOOGLE_LEADERBOARD_FILE_NAME || "leaderboard-export.json";
const HAS_DEDICATED_VISIBILITY_FILE = Boolean(process.env.GOOGLE_LEADERBOARD_VISIBILITY_FILE_ID);
const EMBEDDED_VISIBILITY_KEY = "publicVisibility";
const VISIBILITY_DIR = path.join(process.cwd(), "public", "data");
const VISIBILITY_FILE = path.join(VISIBILITY_DIR, "leaderboard-visibility.json");
const FALLBACK_VISIBILITY_DIR = path.join(os.tmpdir(), "team-karad-offroaders");
const FALLBACK_VISIBILITY_FILE = path.join(FALLBACK_VISIBILITY_DIR, "leaderboard-visibility.json");
const IS_VERCEL = process.env.VERCEL === "1";

const hasDriveConfig = () =>
  Boolean(process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY);

const hasSheetsConfig = hasLeaderboardSheetsConfig;

const parseVisibilityFlag = value => {
  if (value == null || value === "") {
    return null;
  }

  const normalizedValue = String(value).trim().toLowerCase();

  if (["1", "true", "yes", "show", "shown", "visible"].includes(normalizedValue)) {
    return true;
  }

  if (["0", "false", "no", "hide", "hidden", "closed"].includes(normalizedValue)) {
    return false;
  }

  console.warn(`[LEADERBOARD] Ignoring invalid LEADERBOARD_VISIBLE flag: ${value}`);
  return null;
};

const getVisibilityFlag = () => {
  const visible = parseVisibilityFlag(process.env.LEADERBOARD_VISIBLE);

  if (visible === null) {
    return null;
  }

  return {
    visible,
    updatedAt: null,
    source: "flag",
    locked: true,
  };
};

const normalizeVisibility = (data, fallbackUpdatedAt = null, source = "storage") => ({
  visible: data?.visible !== false,
  updatedAt: data?.updatedAt || fallbackUpdatedAt,
  source: data?.source || source,
  locked: data?.locked === true,
});

const getTimestamp = visibility => {
  const timestamp = Date.parse(visibility?.updatedAt || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

async function readVisibilityFile(filePath) {
  const [raw, fileStat] = await Promise.all([
    readFile(filePath, "utf8"),
    stat(filePath).catch(() => null),
  ]);
  const data = JSON.parse(raw);

  return normalizeVisibility(data, fileStat?.mtime?.toISOString?.() || null);
}

async function readLocalVisibility() {
  const candidates = [];

  for (const filePath of [FALLBACK_VISIBILITY_FILE, VISIBILITY_FILE]) {
    try {
      candidates.push(await readVisibilityFile(filePath));
    } catch (error) {
      if (error?.code !== "ENOENT") {
        console.warn("[LEADERBOARD] Visibility cache read failed:", error?.message || error);
      }
    }
  }

  if (!candidates.length) {
    return null;
  }

  return candidates.sort((a, b) => getTimestamp(b) - getTimestamp(a))[0];
}

async function tryWriteVisibilityFile(dirPath, filePath, payload) {
  try {
    await mkdir(dirPath, { recursive: true });
    await writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
    return true;
  } catch (error) {
    console.warn("[LEADERBOARD] Visibility cache write failed:", error?.message || error);
    return false;
  }
}

async function cacheVisibilityLocally(payload) {
  const results = await Promise.all([
    tryWriteVisibilityFile(FALLBACK_VISIBILITY_DIR, FALLBACK_VISIBILITY_FILE, payload),
    tryWriteVisibilityFile(VISIBILITY_DIR, VISIBILITY_FILE, payload),
  ]);

  return results.some(Boolean);
}

async function readEmbeddedDriveVisibility() {
  const snapshot = await readJsonFromDrive(LEADERBOARD_FILE_NAME);
  const visibility = snapshot?.[EMBEDDED_VISIBILITY_KEY];

  if (typeof visibility?.visible !== "boolean") {
    return null;
  }

  return normalizeVisibility(visibility, null, "leaderboard-export");
}

async function writeEmbeddedDriveVisibility(payload) {
  const snapshot = await readJsonFromDrive(LEADERBOARD_FILE_NAME);

  await upsertJsonToDrive(
    LEADERBOARD_FILE_NAME,
    JSON.stringify(
      {
        ...snapshot,
        [EMBEDDED_VISIBILITY_KEY]: payload,
      },
      null,
      2
    )
  );
}

async function readEmbeddedSheetsVisibility() {
  const snapshot = await readLeaderboardSnapshotFromSheets();
  const visibility = snapshot?.[EMBEDDED_VISIBILITY_KEY];

  if (typeof visibility?.visible !== "boolean") {
    return null;
  }

  return normalizeVisibility(visibility, null, "leaderboard-sheet");
}

async function writeEmbeddedSheetsVisibility(payload) {
  const snapshot = await readLeaderboardSnapshotFromSheets().catch(() => ({
    generatedAt: null,
    source: "leaderboard-visibility",
    schemaVersion: 1,
    teams: [],
    results: [],
    disputes: [],
    categoryOptions: [],
    leaderboard: {
      categories: [],
    },
  }));

  await writeLeaderboardSnapshotToSheets({
    ...snapshot,
    [EMBEDDED_VISIBILITY_KEY]: payload,
  });
}

export async function readLeaderboardVisibility() {
  const flagVisibility = getVisibilityFlag();

  if (flagVisibility) {
    return flagVisibility;
  }

  if (hasSheetsConfig() || hasDriveConfig()) {
    const sharedCandidates = [];

    if (hasSheetsConfig()) {
      try {
        const embeddedSheetsVisibility = await readEmbeddedSheetsVisibility();
        if (embeddedSheetsVisibility) {
          sharedCandidates.push(embeddedSheetsVisibility);
        }
      } catch (error) {
        console.warn("[LEADERBOARD] Embedded Sheets visibility read failed:", error?.message || error);
      }
    }

    if (hasDriveConfig()) {
      try {
      const embeddedVisibility = await readEmbeddedDriveVisibility();
      if (embeddedVisibility) {
        sharedCandidates.push(embeddedVisibility);
      }
      } catch (error) {
        console.warn("[LEADERBOARD] Embedded visibility read failed:", error?.message || error);
      }

      try {
        sharedCandidates.push(
          normalizeVisibility(await readJsonFromDrive(VISIBILITY_FILE_NAME), null, "visibility-file")
        );
      } catch (error) {
        if (HAS_DEDICATED_VISIBILITY_FILE || !sharedCandidates.length) {
          console.warn("[LEADERBOARD] Dedicated visibility read failed:", error?.message || error);
        }
      }
    }

    if (sharedCandidates.length) {
      const sharedVisibility = sharedCandidates.sort((a, b) => getTimestamp(b) - getTimestamp(a))[0];
      await cacheVisibilityLocally(sharedVisibility);
      return sharedVisibility;
    }

    const localVisibility = await readLocalVisibility();
    if (localVisibility?.visible === false) {
      return localVisibility;
    }

    return {
      visible: false,
      updatedAt: null,
      source: "drive-unavailable",
    };
  }

  if (IS_VERCEL) {
    return {
      visible: false,
      updatedAt: null,
      source: "shared-storage-unavailable",
    };
  }

  const localVisibility = await readLocalVisibility();
  if (localVisibility) {
    return localVisibility;
  }

  return {
    visible: false,
    updatedAt: null,
  };
}

export async function writeLeaderboardVisibility(visible) {
  const flagVisibility = getVisibilityFlag();

  if (flagVisibility) {
    return flagVisibility;
  }

  const payload = {
    visible,
    updatedAt: new Date().toISOString(),
  };

  if (IS_VERCEL && !hasSheetsConfig() && !hasDriveConfig()) {
    throw new Error("Google Sheets or Google Drive credentials are required to change public leaderboard visibility on Vercel. Public leaderboard remains closed.");
  }

  if (hasSheetsConfig()) {
    try {
      await writeEmbeddedSheetsVisibility(payload);
      await cacheVisibilityLocally(payload);
      return payload;
    } catch (primaryError) {
      console.warn("[LEADERBOARD] Sheets visibility write failed:", primaryError?.message || primaryError);

      if (!hasDriveConfig()) {
        await cacheVisibilityLocally({ ...payload, visible: false });
        throw new Error("Unable to save leaderboard visibility to Google Sheets. Please verify spreadsheet sharing and try again.");
      }
    }
  }

  if (hasDriveConfig()) {
    try {
      if (HAS_DEDICATED_VISIBILITY_FILE) {
        await upsertJsonToDrive(VISIBILITY_FILE_NAME, JSON.stringify(payload, null, 2));
      } else {
        await writeEmbeddedDriveVisibility(payload);
      }
    } catch (primaryError) {
      console.warn("[LEADERBOARD] Primary visibility write failed:", primaryError?.message || primaryError);

      try {
        if (HAS_DEDICATED_VISIBILITY_FILE) {
          await writeEmbeddedDriveVisibility(payload);
        } else {
          await upsertJsonToDrive(VISIBILITY_FILE_NAME, JSON.stringify(payload, null, 2));
        }
      } catch (fallbackError) {
        console.warn("[LEADERBOARD] Fallback visibility write failed:", fallbackError?.message || fallbackError);
        await cacheVisibilityLocally({ ...payload, visible: false });
        throw new Error("Unable to save leaderboard visibility. Please verify Google Drive access and try again.");
      }
    }

    await cacheVisibilityLocally(payload);
    return payload;
  }

  const cachedLocally = await cacheVisibilityLocally(payload);

  if (!cachedLocally) {
    throw new Error("Unable to persist leaderboard visibility locally.");
  }

  return payload;
}

export async function preserveLeaderboardVisibility(snapshot) {
  const visibility = await readLeaderboardVisibility().catch(() => ({
    visible: false,
    updatedAt: null,
  }));

  return {
    ...snapshot,
    [EMBEDDED_VISIBILITY_KEY]: {
      visible: visibility.visible === true,
      updatedAt: visibility.updatedAt || null,
    },
  };
}
