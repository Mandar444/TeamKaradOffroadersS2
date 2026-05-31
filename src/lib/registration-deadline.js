export const REGISTRATION_DEADLINE_ISO = "2026-05-26T00:00:00+05:30";
export const REGISTRATION_DEADLINE_TIMESTAMP = Date.parse(REGISTRATION_DEADLINE_ISO);

export function getRegistrationRemainingMs(now = Date.now()) {
  const currentTimestamp = now instanceof Date ? now.getTime() : now;
  return Math.max(0, REGISTRATION_DEADLINE_TIMESTAMP - currentTimestamp);
}

export function isRegistrationOpen(now = Date.now()) {
  return getRegistrationRemainingMs(now) > 0;
}
