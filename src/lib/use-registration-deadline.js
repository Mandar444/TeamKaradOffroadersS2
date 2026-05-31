"use client";

import { useEffect, useState } from "react";
import { getRegistrationRemainingMs } from "@/lib/registration-deadline";

export function useRegistrationDeadline() {
  const [remainingMs, setRemainingMs] = useState(null);

  useEffect(() => {
    let timeoutId;

    const updateRemainingTime = () => {
      const nextRemainingMs = getRegistrationRemainingMs();
      setRemainingMs(nextRemainingMs);

      if (nextRemainingMs > 0) {
        timeoutId = window.setTimeout(updateRemainingTime, 250);
      }
    };

    timeoutId = window.setTimeout(updateRemainingTime, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return {
    isDeadlineReady: remainingMs !== null,
    isRegistrationOpen: remainingMs !== null && remainingMs > 0,
    remainingMs: remainingMs ?? 0,
  };
}
