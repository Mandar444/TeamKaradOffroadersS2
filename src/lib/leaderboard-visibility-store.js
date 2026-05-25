import { mkdir, readFile, stat, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import {
  readJsonFromDrive,
  upsertJsonToDrive,
} from "@/lib/google-drive/client";

const VISIBILITY_FILE_NAME = process.env.GOOGLE_LEADERBOARD_VISIBILITY_FILE_NAME || "leaderboard-visibility.json";
const VISIBILITY_DIR = path.join(process.cwd(), "public", "data");
const VISIBILITY_FILE = path.join(VISIBILITY_DIR, "leaderboard-visibility.json");
const FALLBACK_VISIBILITY_DIR = path.join(os.tmpdir(), "team-karad-offroaders");
const FALLBACK_VISIBILITY_FILE = path.join(FALLBACK_VISIBILITY_DIR, "leaderboard-visibility.json");
const IS_VERCEL = process.env.VERCEL === "1";

const hasDriveConfig = () =>
  Boolean(process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY);

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

export async function readLeaderboardVisibility() {
  const flagVisibility = getVisibilityFlag();

  if (flagVisibility) {
    return flagVisibility;
  }

  if (hasDriveConfig()) {
    try {
      const driveVisibility = normalizeVisibility(
        await readJsonFromDrive(VISIBILITY_FILE_NAME),
        null,
        "drive"
      );
      await cacheVisibilityLocally(driveVisibility);
      return driveVisibility;
    } catch (error) {
      console.warn("[LEADERBOARD] Drive visibility read failed:", error?.message || error);

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

  if (IS_VERCEL && !hasDriveConfig()) {
    throw new Error("Google Drive credentials are required to change public leaderboard visibility on Vercel. Public leaderboard remains closed.");
  }

  if (hasDriveConfig()) {
    try {
      await upsertJsonToDrive(VISIBILITY_FILE_NAME, JSON.stringify(payload, null, 2));
    } catch (error) {
      console.warn("[LEADERBOARD] Drive visibility write failed:", error?.message || error);
      await cacheVisibilityLocally({ ...payload, visible: false });
      throw new Error("Unable to persist leaderboard visibility to shared storage. Public leaderboard remains closed until visibility can be verified.");
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
