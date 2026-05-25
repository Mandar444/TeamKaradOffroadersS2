function formatRemainingTime(remainingMs) {
  const secondsRemaining = Math.ceil(remainingMs / 1000);
  const hours = String(Math.floor(secondsRemaining / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((secondsRemaining % 3600) / 60)).padStart(2, "0");
  const seconds = String(secondsRemaining % 60).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

const DIGITAL_SEGMENTS = {
  0: ["a", "b", "c", "d", "e", "f"],
  1: ["b", "c"],
  2: ["a", "b", "d", "e", "g"],
  3: ["a", "b", "c", "d", "g"],
  4: ["b", "c", "f", "g"],
  5: ["a", "c", "d", "f", "g"],
  6: ["a", "c", "d", "e", "f", "g"],
  7: ["a", "b", "c"],
  8: ["a", "b", "c", "d", "e", "f", "g"],
  9: ["a", "b", "c", "d", "f", "g"],
};

function DigitalDigit({ value }) {
  const activeSegments = DIGITAL_SEGMENTS[value];

  return (
    <span className="registration-countdown-digit" aria-hidden="true">
      {["a", "b", "c", "d", "e", "f", "g"].map((segment) => (
        <span
          key={segment}
          className={`registration-countdown-segment registration-countdown-segment-${segment} ${
            activeSegments.includes(segment) ? "is-on" : ""
          }`}
        />
      ))}
    </span>
  );
}

function DigitalSeparator() {
  return (
    <span className="registration-countdown-separator" aria-hidden="true">
      <span />
      <span />
    </span>
  );
}

export default function RegistrationCountdown({ remainingMs }) {
  const formattedTime = formatRemainingTime(remainingMs);

  return (
    <div className="registration-countdown-strobe rounded-2xl p-[2px] text-right backdrop-blur-xl">
      <div className="registration-countdown-panel rounded-[0.9rem] px-2.5 py-2.5 sm:px-3 sm:py-2.5">
        <p className="text-[7px] font-black uppercase tracking-[0.2em] text-zinc-400 sm:text-[8px]">
          Registration Closes In
        </p>
        <div className="registration-countdown-display" aria-hidden="true">
          {formattedTime.split("").map((character, index) => (
            character === ":" ? (
              <DigitalSeparator key={`separator-${index}`} />
            ) : (
              <DigitalDigit key={`digit-${index}`} value={character} />
            )
          ))}
        </div>
        <span className="sr-only" aria-live="polite">
          {formattedTime} remaining until registration closes.
        </span>
        <p className="mt-1.5 text-[7px] font-bold uppercase tracking-[0.1em] text-zinc-400 sm:text-[8px]">
          26 May, 12:00 AM IST
        </p>
      </div>
    </div>
  );
}
