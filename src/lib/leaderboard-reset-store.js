import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  readJsonFromDrive,
  upsertJsonToDrive,
} from "@/lib/google-drive/client";

const RESET_FILE_NAME = process.env.GOOGLE_LEADERBOARD_RESET_FILE_NAME || "leaderboard-reset.json";
const LOCAL_RESET_DIR = path.join(process.cwd(), "public", "data");
const LOCAL_RESET_FILE = path.join(LOCAL_RESET_DIR, "leaderboard-reset.json");
const RESET_SNAPSHOT_KEY = "liveDataReset";

const hasDriveConfig = () =>
  Boolean(process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY);

const normalizeResetMarker = marker => {
  if (!marker?.version || !marker?.resetAt) {
    return null;
  }

  return {
    version: String(marker.version),
    resetAt: String(marker.resetAt),
  };
};

async function readLocalResetMarker() {
  try {
    return normalizeResetMarker(JSON.parse(await readFile(LOCAL_RESET_FILE, "utf8")));
  } catch (error) {
    if (error?.code !== "ENOENT") {
      console.warn("[LEADERBOARD] Reset marker cache read failed:", error?.message || error);
    }

    return null;
  }
}

async function cacheResetMarkerLocally(marker) {
  try {
    await mkdir(LOCAL_RESET_DIR, { recursive: true });
    await writeFile(LOCAL_RESET_FILE, JSON.stringify(marker, null, 2), "utf8");
    return true;
  } catch (error) {
    console.warn("[LEADERBOARD] Reset marker cache write failed:", error?.message || error);
    return false;
  }
}

export async function readLeaderboardResetMarker() {
  if (hasDriveConfig()) {
    try {
      const marker = normalizeResetMarker(await readJsonFromDrive(RESET_FILE_NAME));

      if (marker) {
        await cacheResetMarkerLocally(marker);
        return marker;
      }
    } catch (error) {
      const cachedMarker = await readLocalResetMarker();

      if (cachedMarker) {
        return cachedMarker;
      }

      if (String(error?.message || "").includes("not found in Drive")) {
        return null;
      }

      throw new Error("Unable to verify the live leaderboard reset state.");
    }
  }

  return readLocalResetMarker();
}

export async function writeLeaderboardResetMarker() {
  const marker = {
    version: randomUUID(),
    resetAt: new Date().toISOString(),
  };

  if (hasDriveConfig()) {
    await upsertJsonToDrive(RESET_FILE_NAME, JSON.stringify(marker, null, 2));
  }

  const cachedLocally = await cacheResetMarkerLocally(marker);

  if (!hasDriveConfig() && !cachedLocally) {
    throw new Error("Unable to persist leaderboard reset marker locally.");
  }

  return marker;
}

export const applyLeaderboardResetMarker = (snapshot, marker) => {
  if (!marker) {
    return snapshot;
  }

  return {
    ...snapshot,
    [RESET_SNAPSHOT_KEY]: marker,
  };
};

export const isLeaderboardSnapshotCurrent = (snapshot, marker) =>
  !marker || snapshot?.[RESET_SNAPSHOT_KEY]?.version === marker.version;

export const isSameLeaderboardResetMarker = (left, right) =>
  (left?.version || null) === (right?.version || null);
