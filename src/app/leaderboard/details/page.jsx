"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  appendDisputeDetailsSection,
  appendDisputeResolutionSection,
  buildDetailSections,
  buildLeaderboardDetailIndex,
  buildRawRecordItems,
  fetchLeaderboardSnapshot,
  fetchLeaderboardVisibility,
  formatDetailValue,
  getRecordValue,
  normalizeCategoryKey,
} from "@/lib/leaderboard-snapshot";

function DetailFieldCard({ label, value, large = false }) {
  return (
    <div className="min-w-[150px] flex-1 rounded-[14px] bg-[#0b0b0b] px-3 py-2.5">
      <p className="font-mono text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#e1ad7a]">{label}</p>
      <p className={`mt-1.5 break-words font-extrabold uppercase text-[#fff7ef] ${large ? "text-lg" : "text-[13px]"}`}>
        {formatDetailValue(value)}
      </p>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="min-w-[150px] flex-1 rounded-2xl bg-[#111111] px-3.5 py-3">
      <p className="font-mono text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#e1ad7a]">{label}</p>
      <p className="mt-1.5 break-words font-mono text-lg font-black uppercase text-[#fff7ef]">
        {formatDetailValue(value)}
      </p>
    </div>
  );
}

function PenaltyBreakdownTable({ rows }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <div className="min-w-[700px] space-y-2">
        <div className="grid min-h-7 grid-cols-[minmax(260px,2.8fr)_minmax(100px,0.9fr)_minmax(170px,1.4fr)_minmax(110px,1fr)] items-center">
          {["Penalty", "Count", "Penalty Time", "Status"].map((label, index) => (
            <div
              key={label}
              className={`border-l border-[#2a1a0f] px-3.5 py-1.5 text-center font-mono text-[8px] font-black uppercase text-[#ff7a00] ${
                index === 0 ? "border-l-0 text-left" : ""
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        {rows.map(row => (
          <div
            key={row.penalty}
            className="grid min-h-[52px] grid-cols-[minmax(260px,2.8fr)_minmax(100px,0.9fr)_minmax(170px,1.4fr)_minmax(110px,1fr)] overflow-hidden rounded-xl border border-[#2a1a0f] bg-[#0b0b0b]"
          >
            <div className="px-3.5 py-3.5 text-left text-[13px] font-black uppercase text-[#fff7ef]">
              {formatDetailValue(row.penalty)}
            </div>
            <div className="border-l border-[#2a1a0f] px-3.5 py-3.5 text-center text-[13px] font-black uppercase text-[#fff7ef]">
              {formatDetailValue(row.count)}
            </div>
            <div className="border-l border-[#2a1a0f] px-3.5 py-3.5 text-center text-[13px] font-black uppercase text-[#fff7ef]">
              {formatDetailValue(row.penaltyTime)}
            </div>
            <div className="border-l border-[#2a1a0f] px-3.5 py-3.5 text-center text-[13px] font-black uppercase text-[#ff7a00]">
              {formatDetailValue(row.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailSectionCard({ section }) {
  return (
    <section className="rounded-[18px] border border-[#2a1a0f] bg-[#111111] p-3.5">
      {section.kicker ? (
        <p className="mb-1 font-mono text-[8px] font-black uppercase text-[#ff7a00]">{section.kicker}</p>
      ) : null}
      <h2
        className={`font-mono font-black uppercase ${
          section.type === "penaltyTable"
            ? "text-2xl leading-none tracking-normal text-[#fff7ef]"
            : "text-xs tracking-[0.1em] text-[#ff7a00]"
        }`}
      >
        {section.title}
      </h2>

      {section.type === "penaltyTable" ? (
        <PenaltyBreakdownTable rows={section.rows || []} />
      ) : (
        <div className="mt-3 flex flex-wrap gap-2.5">
          {(section.items || []).map(item => (
            <DetailFieldCard key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      )}
    </section>
  );
}

function LeaderboardDetailsContent() {
  const searchParams = useSearchParams();
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaderboardVisible, setLeaderboardVisible] = useState(true);
  const [error, setError] = useState("");

  const key = searchParams.get("key") || "";
  const shortKey = searchParams.get("shortKey") || "";
  const requestedCategoryKey = searchParams.get("categoryKey") || "";
  const requestedReturnTo = searchParams.get("returnTo") || "";

  useEffect(() => {
    let active = true;

    async function loadSnapshot() {
      setLoading(true);
      setError("");

      try {
        const visibility = await fetchLeaderboardVisibility();
        if (!visibility.visible) {
          if (active) {
            setLeaderboardVisible(false);
            setSnapshot(null);
          }
          return;
        }

        const exportedSnapshot = await fetchLeaderboardSnapshot();
        if (active) {
          setLeaderboardVisible(true);
          setSnapshot(exportedSnapshot);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError?.message || "Unable to load leaderboard details.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSnapshot();

    return () => {
      active = false;
    };
  }, []);

  const detailIndex = useMemo(() => buildLeaderboardDetailIndex(snapshot), [snapshot]);
  const record = useMemo(() => detailIndex.get(key) || detailIndex.get(shortKey) || null, [detailIndex, key, shortKey]);
  const backCategoryKey = requestedCategoryKey || normalizeCategoryKey(record?.category || searchParams.get("category") || "");
  const safeReturnHref = requestedReturnTo === "/admin/leaderboard" ? requestedReturnTo : "";
  const publicBackHref = backCategoryKey ? `/leaderboard?category=${encodeURIComponent(backCategoryKey)}` : "/leaderboard";
  const backHref = safeReturnHref || publicBackHref;
  const categoryLabel = getRecordValue(record, ["category"], searchParams.get("category") || "Leaderboard");
  const trackLabel = getRecordValue(record, ["track_name", "trackName"], searchParams.get("track") || "Track");
  const stickerNumber = getRecordValue(record, ["sticker_number", "stickerNumber"], searchParams.get("sticker") || "--");
  const driverName = getRecordValue(record, ["driver_name", "driverName"], searchParams.get("driver") || "--");
  const entry = {
    dayLabel: searchParams.get("day") || getRecordValue(record, ["selected_day_label", "selectedDayLabel"], "--"),
    timingLabel:
      searchParams.get("timing") ||
      getRecordValue(record, ["total_time", "totalTimeDisplay", "performance_time", "performanceTimeDisplay"], "--"),
    pointsLabel: searchParams.get("points") || "--",
    rankLabel: searchParams.get("rank") || "--",
  };
  const detailSections = record
    ? [
        ...buildDetailSections(record),
        ...appendDisputeDetailsSection(record),
        ...appendDisputeResolutionSection(record),
      ]
    : [];
  const rawRecordItems = buildRawRecordItems(record || {});

  return (
    <div className="flex min-h-screen items-center justify-center bg-[rgba(0,0,0,0.72)] px-4 py-4 text-white">
      <div className="flex max-h-[calc(100vh-32px)] w-full max-w-[980px] flex-col overflow-hidden rounded-[20px] border border-[#2a1a0f] bg-[#0b0b0b]">
        <header className="flex items-start justify-between gap-3 border-b border-[#2a1a0f] p-4">
          <div className="min-w-0 flex-1 pr-3">
            <p className="font-mono text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#ff7a00]">
              {!loading && !leaderboardVisible ? "Leaderboard" : "Track Details"}
            </p>
            <h1 className="mt-1.5 break-words font-mono text-[22px] font-black uppercase leading-none text-[#fff7ef]">
              {!loading && !leaderboardVisible ? "LIVE LEADERBOARD CLOSED" : trackLabel}
            </h1>
            <p className="mt-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#e1ad7a]">
              {!loading && !leaderboardVisible
                ? "Race Control has closed the live leaderboard for now."
                : `${categoryLabel} | #${formatDetailValue(stickerNumber)} | ${formatDetailValue(driverName)}`}
            </p>
          </div>
          <Link
            href={backHref}
            className="rounded-full border border-[#2a1a0f] px-3 py-2 font-mono text-[11px] font-extrabold uppercase text-[#fff7ef] transition-colors hover:border-[#ff7a00]/50 hover:text-[#ff7a00]"
          >
            Close
          </Link>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          {!loading && !leaderboardVisible ? (
            <div className="p-4 pb-7 text-[#e1ad7a]">
              <div className="rounded-[18px] border border-[#2a1a0f] bg-[#111111] p-3.5 text-sm font-extrabold uppercase tracking-[0.08em]">
                Please check back later.
              </div>
            </div>
          ) : (
            <div className="space-y-3.5 p-4 pb-7">
              {error ? (
                <div className="rounded-[14px] border border-red-500/20 bg-red-500/10 p-4 text-sm font-black uppercase tracking-[0.12em] text-red-200">
                  {error}
                </div>
              ) : null}

              {!loading && !record ? (
                <div className="rounded-[14px] border border-[#ff7a00]/20 bg-[#231308] p-4 text-sm font-black uppercase tracking-[0.12em] text-[#ffb15a]">
                  Details record was not found in the latest synced leaderboard export.
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2.5">
                {[
                  { label: "Day", value: entry.dayLabel },
                  { label: "Timing", value: entry.timingLabel },
                  { label: "Points", value: entry.pointsLabel },
                  { label: "Rank", value: entry.rankLabel },
                ].map(item => (
                  <SummaryCard key={item.label} label={item.label} value={item.value} />
                ))}
              </div>

              <div className="space-y-3">
                {detailSections.map(section => (
                  <DetailSectionCard key={section.title} section={section} />
                ))}
              </div>

              <section className="rounded-[18px] border border-[#2a1a0f] bg-[#111111] p-3.5">
                <h2 className="font-mono text-xs font-black uppercase tracking-[0.1em] text-[#ff7a00]">Final results</h2>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {rawRecordItems.map(item => (
                    <DetailFieldCard key={item.label} label={item.label} value={item.value} />
                  ))}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function LeaderboardDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[rgba(0,0,0,0.72)] px-4 py-4 text-center font-mono text-[#ff7a00]">
          Loading details...
        </div>
      }
    >
      <LeaderboardDetailsContent />
    </Suspense>
  );
}
