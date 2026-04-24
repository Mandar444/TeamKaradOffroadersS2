"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, RefreshCw, ShieldAlert, Users, Trophy } from "lucide-react";

const apiUrl = "/api/leaderboard";
const EMPTY_ARRAY = [];

function normalizeCategory(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, " ");
}

function getCategoryKey(item) {
  if (typeof item === "string") return item;
  return item?.key || item?.categoryKey || item?.category || item?.label || item?.name || "";
}

function getCategoryLabel(item) {
  if (typeof item === "string") return item;
  return item?.label || item?.name || item?.title || item?.category || item?.key || "Category";
}

function getNumericValue(value) {
  if (typeof value === "number") return value;
  const parsed = Number(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatTimeParts(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = String(Math.floor(safe / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((safe % 3600) / 60)).padStart(2, "0");
  const seconds = String(safe % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function getDisputeRemainingSeconds(dispute, now) {
  if (typeof dispute?.remainingSeconds === "number") {
    return Math.max(0, dispute.remainingSeconds);
  }

  const expiresAt = dispute?.expiresAt || dispute?.expires_at || dispute?.holdExpiresAt;
  if (!expiresAt) return null;

  const remaining = Math.floor((new Date(expiresAt).getTime() - now) / 1000);
  return Number.isFinite(remaining) ? Math.max(0, remaining) : null;
}

function pickEntries(result) {
  return result?.dayEntries || result?.entries || result?.days || [];
}

function pickTrackSummaries(result) {
  return result?.trackSummaries || result?.tracks || [];
}

function pickVehiclePoints(result) {
  return (
    result?.totalVehiclePoints ??
    result?.vehiclePoints ??
    result?.totalPoints ??
    result?.total ??
    result?.points ??
    0
  );
}

export default function LeaderboardSnapshotViewer() {
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [now, setNow] = useState(0);

  const loadSnapshot = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(apiUrl, { cache: "no-store" });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Unable to load leaderboard snapshot");
      }

      setSnapshot(data.snapshot);
    } catch (err) {
      setError(err?.message || "Unable to load leaderboard snapshot");
      setSnapshot(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const startTimer = setTimeout(() => {
      void loadSnapshot();
    }, 0);
    const refreshTimer = setInterval(() => {
      void loadSnapshot();
    }, 15000);
    const clockTimer = setInterval(() => setNow(Date.now()), 1000);

    return () => {
      clearTimeout(startTimer);
      clearInterval(refreshTimer);
      clearInterval(clockTimer);
    };
  }, []);

  const categoryOptions = snapshot?.categoryOptions ?? EMPTY_ARRAY;
  const results = snapshot?.results ?? EMPTY_ARRAY;
  const disputes = snapshot?.disputes ?? EMPTY_ARRAY;
  const firstAvailableCategory = getCategoryKey(categoryOptions[0]) || getCategoryKey(results[0]) || "";
  const activeCategory = selectedCategory || firstAvailableCategory;

  const selectedResult = useMemo(() => {
    if (!snapshot) return null;

    const target = normalizeCategory(activeCategory);
    return (
      results.find((item) => {
        const candidateValues = [
          item?.category,
          item?.categoryKey,
          item?.key,
          item?.name,
          item?.label,
        ]
          .filter(Boolean)
          .map(normalizeCategory);
        return candidateValues.includes(target);
      }) || results[0] || null
    );
  }, [activeCategory, results, snapshot]);

  const selectedCategoryLabel = selectedResult
    ? selectedResult.category || selectedResult.name || selectedResult.label || activeCategory || "Category"
    : activeCategory || "Category";

  const categoryTeams = snapshot?.teams || [];
  const trackSummaries = selectedResult ? pickTrackSummaries(selectedResult) : [];
  const dayEntries = selectedResult ? pickEntries(selectedResult) : [];
  const categoryDisputes = (selectedResult?.disputes || disputes || []).filter(Boolean);

  return (
    <div className="rounded-[2rem] border border-white/5 bg-black/60 p-5 md:p-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
        <div>
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-2">Live Snapshot</p>
          <h3 className="text-3xl md:text-5xl font-heading uppercase leading-none">
            {snapshot ? "Latest Saved Leaderboard" : "No Snapshot Yet"}
          </h3>
          <p className="mt-3 text-zinc-400 text-sm md:text-base max-w-3xl leading-relaxed">
            {snapshot
              ? `Source: ${snapshot.source} · Generated: ${snapshot.generatedAt}`
              : "Waiting for the React Native app to post a snapshot to the website backend."}
          </p>
        </div>

        <button
          type="button"
          onClick={loadSnapshot}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-white/10 bg-black/45 text-[#ffb35c] text-[10px] font-black uppercase tracking-[0.35em] hover:border-white/20 hover:bg-black/60 transition-colors w-fit"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Snapshot
        </button>
      </div>

      {loading && !snapshot ? (
        <div className="rounded-[1.5rem] border border-white/5 bg-[#111826] p-6 text-zinc-400">
          Loading leaderboard snapshot...
        </div>
      ) : error ? (
        <div className="rounded-[1.5rem] border border-red-500/20 bg-red-500/10 p-6 text-red-200">
          {error}
        </div>
      ) : snapshot ? (
        <>
          <div className="mb-6">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.35em] mb-3">Categories</p>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.length > 0
                ? categoryOptions.map((item) => {
                    const key = getCategoryKey(item);
                    const label = getCategoryLabel(item);
                    const active = normalizeCategory(activeCategory) === normalizeCategory(key || label);
                    return (
                      <button
                        key={key || label}
                        type="button"
                        onClick={() => setSelectedCategory(key || label)}
                        className={`px-4 py-2 rounded-full border text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] transition-all ${
                          active
                            ? "bg-[#ffb35c] text-black border-[#ffb35c]"
                            : "bg-[#111826] text-zinc-400 border-white/10 hover:border-[#ffb35c]/40 hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })
                : results.map((item) => {
                    const label = getCategoryLabel(item);
                    const active = normalizeCategory(activeCategory) === normalizeCategory(label);
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setSelectedCategory(label)}
                        className={`px-4 py-2 rounded-full border text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] transition-all ${
                          active
                            ? "bg-[#ffb35c] text-black border-[#ffb35c]"
                            : "bg-[#111826] text-zinc-400 border-white/10 hover:border-[#ffb35c]/40 hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
            <div className="rounded-[1.5rem] border border-white/5 bg-[#111826] p-5 md:p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.35em] mb-2">Selected Category</p>
                  <h4 className="text-2xl md:text-4xl font-heading uppercase leading-none">{selectedCategoryLabel}</h4>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.35em]">
                  <Clock3 className="w-4 h-4" />
                  Live Saved
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <div className="rounded-2xl border border-white/5 bg-black/50 p-4">
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.35em] mb-2">Total Vehicle Points</p>
                  <p className="text-3xl md:text-4xl font-heading text-primary leading-none">
                    {pickVehiclePoints(selectedResult)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-black/50 p-4">
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.35em] mb-2">Teams</p>
                  <p className="text-3xl md:text-4xl font-heading leading-none">{categoryTeams.length}</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-black/50 p-4">
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.35em] mb-2">Disputes</p>
                  <p className="text-3xl md:text-4xl font-heading leading-none">{categoryDisputes.length}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-primary" />
                  <h5 className="text-xl md:text-2xl font-heading uppercase leading-none">Track-Wise Summary</h5>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trackSummaries.length > 0 ? (
                    trackSummaries.map((track, index) => {
                      const trackLabel = track.track || track.name || track.label || `Track ${index + 1}`;
                      const dayItems = pickEntries(track);
                      return (
                        <div key={`${trackLabel}-${index}`} className="rounded-2xl border border-white/5 bg-black/50 p-4">
                          <div className="flex items-center justify-between gap-4 mb-4">
                            <div>
                              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.35em] mb-1">Track</p>
                              <h6 className="text-lg font-heading uppercase leading-none">{trackLabel}</h6>
                            </div>
                            <div className="text-right">
                              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.35em] mb-1">Points</p>
                              <p className="text-2xl font-heading text-primary leading-none">{getNumericValue(track.totalPoints || track.points)}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {dayItems.length > 0 ? (
                              dayItems.map((day, dayIndex) => (
                                <div
                                  key={`${trackLabel}-${dayIndex}`}
                                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-white/5 bg-[#111826] px-3 py-3"
                                >
                                  <p className="text-sm font-black uppercase tracking-[0.2em] text-white">
                                    {day.day || day.label || day.round || `D${dayIndex + 1}`}
                                  </p>
                                  <p className="text-xs md:text-sm text-zinc-300">
                                    {day.time || day.duration || day.result || day.hold || "NA"}
                                  </p>
                                  <p className="text-xs md:text-sm font-black uppercase tracking-[0.18em] text-primary">
                                    {day.points ?? day.score ?? day.total ?? ""}
                                    {day.position ? ` · ${day.position}` : ""}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <div className="rounded-xl border border-white/5 bg-[#111826] px-3 py-3 text-zinc-500 text-sm">
                                No day-wise entries available.
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl border border-white/5 bg-black/50 p-4 text-zinc-400">
                      No track summaries were included in the snapshot.
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-primary" />
                  <h5 className="text-xl md:text-2xl font-heading uppercase leading-none">Day-Wise Entries</h5>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/50">
                  <table className="min-w-full text-left">
                    <thead className="bg-[#111826]">
                      <tr className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">
                        <th className="px-4 py-3">Entry</th>
                        <th className="px-4 py-3">Day</th>
                        <th className="px-4 py-3">Time / Status</th>
                        <th className="px-4 py-3">Points</th>
                        <th className="px-4 py-3">Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayEntries.length > 0 ? (
                        dayEntries.map((entry, index) => (
                          <tr key={`day-entry-${index}`} className="border-t border-white/5 text-sm">
                            <td className="px-4 py-3 text-white font-heading uppercase">{entry.name || entry.entry || entry.label || `Entry ${index + 1}`}</td>
                            <td className="px-4 py-3 text-zinc-300">{entry.day || entry.round || entry.track || "NA"}</td>
                            <td className="px-4 py-3 text-zinc-300">{entry.time || entry.status || entry.result || "NA"}</td>
                            <td className="px-4 py-3 text-primary font-black uppercase">{entry.points ?? entry.score ?? entry.total ?? "NA"}</td>
                            <td className="px-4 py-3 text-zinc-300">{entry.position || "NA"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="px-4 py-4 text-zinc-500" colSpan={5}>
                            No day-wise entries available for this category.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[1.5rem] border border-white/5 bg-black/50 p-5 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldAlert className="w-5 h-5 text-primary" />
                  <h5 className="text-xl md:text-2xl font-heading uppercase leading-none">Disputed Holds</h5>
                </div>

                <div className="space-y-3">
                  {categoryDisputes.length > 0 ? (
                    categoryDisputes.map((dispute, index) => {
                      const remaining = getDisputeRemainingSeconds(dispute, now);
                      return (
                        <div key={`dispute-${index}`} className="rounded-2xl border border-white/5 bg-[#111826] p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-primary text-[10px] font-black uppercase tracking-[0.35em] mb-1">
                                {dispute.category || selectedCategoryLabel}
                              </p>
                              <h6 className="text-lg font-heading uppercase leading-none">{dispute.team || dispute.teamName || dispute.title || "Dispute Hold"}</h6>
                              <p className="mt-2 text-sm text-zinc-400">{dispute.reason || dispute.message || "Hold in progress"}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.35em] mb-1">Remaining</p>
                              <p className="text-2xl font-heading text-white leading-none">
                                {remaining === null ? "NA" : formatTimeParts(remaining)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl border border-white/5 bg-[#111826] p-4 text-zinc-500">
                      No disputed holds are available in this snapshot.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/5 bg-black/50 p-5 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-primary" />
                  <h5 className="text-xl md:text-2xl font-heading uppercase leading-none">Teams</h5>
                </div>

                <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                  {categoryTeams.length > 0 ? (
                    categoryTeams.map((team, index) => (
                      <div key={`team-${index}`} className="rounded-xl border border-white/5 bg-[#111826] px-4 py-3">
                        <p className="text-white font-heading uppercase leading-none">{team.name || team.teamName || team.driver || `Team ${index + 1}`}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                          {team.location || team.teamLocation || team.category || team.status || "Registered team"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-white/5 bg-[#111826] px-4 py-3 text-zinc-500">
                      No teams were included in this snapshot.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
