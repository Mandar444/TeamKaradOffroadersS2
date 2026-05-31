import { randomUUID } from "crypto";

const RESET_SNAPSHOT_KEY = "liveDataReset";

const normalizeResetMarker = marker => {
  if (!marker?.version || !marker?.resetAt) {
    return null;
  }

  return {
    version: String(marker.version),
    resetAt: String(marker.resetAt),
  };
};

export const createLeaderboardResetMarker = () => ({
  version: randomUUID(),
  resetAt: new Date().toISOString(),
});

export const readLeaderboardResetMarker = snapshot =>
  normalizeResetMarker(snapshot?.[RESET_SNAPSHOT_KEY]);

export const applyLeaderboardResetMarker = (snapshot, marker) => {
  if (!marker) {
    return snapshot;
  }

  return {
    ...snapshot,
    [RESET_SNAPSHOT_KEY]: marker,
  };
};

export const isSameLeaderboardResetMarker = (left, right) =>
  (left?.version || null) === (right?.version || null);

export const isLeaderboardSnapshotCurrent = (snapshot, marker) =>
  !marker || readLeaderboardResetMarker(snapshot)?.version === marker.version;
