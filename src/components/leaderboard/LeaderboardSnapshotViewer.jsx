"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Info, RefreshCw } from "lucide-react";
import {
  fetchLeaderboardSnapshot,
  fetchLeaderboardVisibility,
  getCategoriesFromSnapshot,
  normalizeCategoryKey,
  normalizeResultIdentityKey,
  normalizeShortIdentityKey,
  normalizeTrackKey,
} from "@/lib/leaderboard-snapshot";

function TotalCell({ total, maxPoints }) {
  const totalLabel = Number.isFinite(Number(maxPoints)) && Number(maxPoints) > 0
    ? `${total}/${maxPoints}`
    : total;

  return (
    <div className="flex flex-col items-end leading-none">
      <span className="font-mono text-[28px] font-black text-[#ff7a00] md:text-[32px]">{totalLabel}</span>
      <span className="mt-2 text-[12px] font-black uppercase tracking-[0.08em] text-[#d9a36d]">PTS</span>
    </div>
  );
}

function RealisticTrophyIcon({ id, className = "" }) {
  const gradientId = `trophy-metal-${id}`;
  const shadowId = `trophy-shadow-${id}`;
  const shineId = `trophy-shine-${id}`;

  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
      role="img"
    >
      <defs>
        <linearGradient id={gradientId} x1="12" x2="52" y1="6" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff8cc" />
          <stop offset="0.18" stopColor="#ffd86d" />
          <stop offset="0.45" stopColor="#ff9f1a" />
          <stop offset="0.68" stopColor="#b95a08" />
          <stop offset="1" stopColor="#fff0a8" />
        </linearGradient>
        <radialGradient id={shineId} cx="28%" cy="18%" r="55%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.36" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id={shadowId} x="-35%" y="-30%" width="170%" height="170%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#2a1200" floodOpacity="0.45" />
        </filter>
      </defs>
      <g filter={`url(#${shadowId})`}>
        <path
          d="M17.5 11.5h29v7.8c0 12.3-5.3 21-14.5 22.7-9.2-1.7-14.5-10.4-14.5-22.7v-7.8Z"
          fill={`url(#${gradientId})`}
          stroke="#fff1a8"
          strokeWidth="1.3"
        />
        <path
          d="M17.7 17.2H9.5c.4 10.2 5.5 16.4 13.8 17.7"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5.2"
        />
        <path
          d="M46.3 17.2h8.2c-.4 10.2-5.5 16.4-13.8 17.7"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5.2"
        />
        <path d="M28.5 41.5h7v8h-7z" fill={`url(#${gradientId})`} />
        <path d="M22 50h20l2.6 6.5H19.4L22 50Z" fill={`url(#${gradientId})`} stroke="#7a3500" strokeWidth="1" />
        <path d="M16 56h32v5H16z" fill={`url(#${gradientId})`} stroke="#7a3500" strokeWidth="1" rx="1.8" />
        <path
          d="M22.2 15.7c.6 8.8 3.7 15.2 9.8 18.7 5.7-3.4 8.7-9.4 9.6-17.2"
          fill="none"
          stroke="#6d3000"
          strokeOpacity="0.22"
          strokeWidth="2"
        />
        <path d="M18.8 12.8h12.5c-1.8 7.9-5.1 13.8-10 17.8-1.7-3.2-2.5-7-2.5-11.5v-6.3Z" fill={`url(#${shineId})`} />
      </g>
    </svg>
  );
}

function PositionCell({ position }) {
  const podiumLabel = position === 1 ? "1st" : position === 2 ? "2nd" : position === 3 ? "3rd" : `${position}`;
  const isPodium = position <= 3;
  const podiumStyles = {
    1: {
      shell: "border-[#ffd36a]/70 bg-[linear-gradient(135deg,rgba(255,211,106,0.22),rgba(255,122,0,0.08))] text-[#ffd36a] shadow-[0_0_26px_rgba(255,185,64,0.28)]",
      iconWrap: "border-[#ffd36a]/50 bg-[#ffd36a] text-[#1a0d00] shadow-[0_0_18px_rgba(255,211,106,0.45)]",
      icon: "fill-[#1a0d00] text-[#1a0d00]",
      label: "text-[#ffd36a]",
    },
    2: {
      shell: "border-[#d8e0ef]/60 bg-[linear-gradient(135deg,rgba(216,224,239,0.18),rgba(122,143,171,0.08))] text-[#e7edf7] shadow-[0_0_22px_rgba(216,224,239,0.18)]",
      iconWrap: "border-[#e7edf7]/45 bg-[#d8e0ef] text-[#111827] shadow-[0_0_16px_rgba(216,224,239,0.32)]",
      icon: "fill-[#111827] text-[#111827]",
      label: "text-[#e7edf7]",
    },
    3: {
      shell: "border-[#d98745]/65 bg-[linear-gradient(135deg,rgba(217,135,69,0.2),rgba(98,49,18,0.08))] text-[#f3a45f] shadow-[0_0_22px_rgba(217,135,69,0.2)]",
      iconWrap: "border-[#f3a45f]/45 bg-[#d98745] text-[#170a02] shadow-[0_0_16px_rgba(217,135,69,0.34)]",
      icon: "fill-[#170a02] text-[#170a02]",
      label: "text-[#f3a45f]",
    },
  };
  const activeStyle = podiumStyles[position];

  if (!isPodium) {
    return (
      <div className="inline-flex min-w-[58px] items-center justify-center rounded-full border border-[#2b1709] bg-[#101010] px-3 py-2 font-mono text-[13px] font-black uppercase text-[#d9a36d]">
        {podiumLabel}
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center gap-2 overflow-hidden rounded-full border py-1.5 pl-1.5 pr-3 font-mono text-[13px] font-black uppercase ${activeStyle.shell}`}>
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.22),transparent_32%)]" />
      <span className={`relative flex h-9 w-9 items-center justify-center rounded-full border ${activeStyle.iconWrap}`}>
        <RealisticTrophyIcon id={position} className="h-7 w-7" />
      </span>
      <span className={`relative tracking-[0.08em] ${activeStyle.label}`}>{podiumLabel}</span>
    </div>
  );
}

function getTrackSummaryForTrack(row, track) {
  const summaries = row?.trackSummaries || [];
  const normalizedTrackKey = normalizeTrackKey(track?.key || "");
  const normalizedTrackLabel = normalizeTrackKey(track?.label || track || "");

  return summaries.find(summary => {
    const summaryKey = normalizeTrackKey(summary?.trackKey || "");
    const summaryLabel = normalizeTrackKey(summary?.trackLabel || "");

    return (
      (normalizedTrackKey && (summaryKey === normalizedTrackKey || summaryLabel === normalizedTrackKey)) ||
      (normalizedTrackLabel && (summaryLabel === normalizedTrackLabel || summaryKey === normalizedTrackLabel))
    );
  }) || null;
}

function buildDetailHref({ activeCategory, row, trackLabel, entry, returnHref = "" }) {
  const fallbackRecord = {
    category: activeCategory?.key || "",
    track_name: trackLabel,
    sticker_number: row?.stickerNumber || "",
    driver_name: row?.driverName || "",
    selected_day_label: entry?.dayLabel || "",
  };
  const key = entry?.key || normalizeResultIdentityKey(fallbackRecord);
  const shortKey = normalizeShortIdentityKey(fallbackRecord);
  const params = new URLSearchParams();

  if (key) {
    params.set("key", key);
  }

  if (shortKey) {
    params.set("shortKey", shortKey);
  }

  params.set("category", activeCategory?.label || activeCategory?.key || "Category");
  params.set("categoryKey", activeCategory?.key || "");
  params.set("track", trackLabel || "Track");
  params.set("sticker", row?.stickerNumber || "");
  params.set("driver", row?.driverName || "");
  params.set("day", entry?.dayLabel || "");
  params.set("timing", entry?.timingLabel || "");
  params.set("points", entry?.pointsLabel || "");
  params.set("rank", entry?.rankLabel || "");

  if (returnHref) {
    params.set("returnTo", returnHref);
  }

  return `/leaderboard/details?${params.toString()}`;
}

function TrackCell({ summary, row, trackLabel, activeCategory, detailReturnHref }) {
  if (!summary) {
    return <span className="block text-[13px] font-black uppercase text-[#d9a36d]">NA</span>;
  }

  if (!summary.entries || summary.entries.length === 0) {
    return <span className="block text-[13px] font-black uppercase text-[#d9a36d]">NA</span>;
  }

  return (
    <div className="flex flex-col gap-2">
      {summary.entries.map(entry => {
        const detailHref = buildDetailHref({
          activeCategory,
          row,
          trackLabel,
          entry,
          returnHref: detailReturnHref,
        });

        return (
          <div
            key={`${entry.key}-${entry.dayLabel}-${entry.timingLabel}-${entry.rankLabel}`}
            className="rounded-xl border border-transparent py-1"
          >
            <p className="font-mono text-[15px] font-black uppercase text-[#fff7ef]">
              {entry.timingLabel || "NA"}
            </p>
            <p className="mt-1 text-[10px] font-black uppercase text-[#d9a36d]">
              {entry.pointsLabel && entry.pointsLabel !== "--" ? entry.pointsLabel : `${summary.totalPoints || 0} pts`}
            </p>
            <Link
              href={detailHref}
              className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#ff7a00]/35 bg-[#ff7a00]/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-[#ffb35c] transition-colors hover:border-[#ffb35c] hover:bg-[#ff7a00] hover:text-black"
              title="Open track details"
            >
              <Info className="h-3.5 w-3.5" />
              Details
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default function LeaderboardSnapshotViewer({ respectVisibility = true, detailReturnHref = "" }) {
  const searchParams = useSearchParams();
  const tableScrollRef = useRef(null);
  const dragScrollRef = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
  });
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibilityLoading, setVisibilityLoading] = useState(respectVisibility);
  const [leaderboardVisible, setLeaderboardVisible] = useState(!respectVisibility);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadVisibility = useCallback(async () => {
    if (!respectVisibility) {
      setLeaderboardVisible(true);
      setVisibilityLoading(false);
      return;
    }

    setVisibilityLoading(true);

    try {
      const visibility = await fetchLeaderboardVisibility();
      setLeaderboardVisible(visibility.visible);
    } catch (visibilityError) {
      setLeaderboardVisible(false);
    } finally {
      setVisibilityLoading(false);
    }
  }, [respectVisibility]);

  const loadSnapshot = useCallback(async () => {
    if (respectVisibility && !leaderboardVisible) {
      setSnapshot(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const exportedSnapshot = await fetchLeaderboardSnapshot();
      setSnapshot(exportedSnapshot);
    } catch (loadError) {
      setSnapshot(null);
      setError(loadError?.message || "Waiting for synced leaderboard data from the app.");
    } finally {
      setLoading(false);
    }
  }, [leaderboardVisible, respectVisibility]);

  const refreshLeaderboard = useCallback(async () => {
    setRefreshing(true);
    setError("");

    try {
      let visible = true;

      if (respectVisibility) {
        try {
          const visibility = await fetchLeaderboardVisibility();
          visible = visibility.visible;
          setLeaderboardVisible(visible);
        } catch (visibilityError) {
          visible = false;
          setLeaderboardVisible(false);
        }
      } else {
        setLeaderboardVisible(true);
      }

      if (!visible) {
        setSnapshot(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const exportedSnapshot = await fetchLeaderboardSnapshot();
      setSnapshot(exportedSnapshot);
    } catch (loadError) {
      setSnapshot(null);
      setError(loadError?.message || "Waiting for synced leaderboard data from the app.");
    } finally {
      setVisibilityLoading(false);
      setLoading(false);
      setRefreshing(false);
    }
  }, [respectVisibility]);

  useEffect(() => {
    loadVisibility();
  }, [loadVisibility]);

  useEffect(() => {
    if (visibilityLoading) {
      return;
    }

    if (!leaderboardVisible) {
      setSnapshot(null);
      setLoading(false);
      setError("");
      return;
    }

    loadSnapshot();
  }, [leaderboardVisible, loadSnapshot, visibilityLoading]);

  const categories = useMemo(() => getCategoriesFromSnapshot(snapshot), [snapshot]);
  const activeCategory = useMemo(() => {
    if (!categories.length) {
      return null;
    }

    return categories.find(category => category.key === selectedCategory) || categories[0];
  }, [categories, selectedCategory]);
  const rows = activeCategory?.rows || [];

  useEffect(() => {
    if (!categories.length) {
      setSelectedCategory("");
      return;
    }

    if (!selectedCategory || !categories.some(category => category.key === selectedCategory)) {
      setSelectedCategory(categories[0].key);
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    if (!categories.length) {
      return;
    }

    const categoryFromUrl = normalizeCategoryKey(searchParams.get("category") || searchParams.get("categoryKey") || "");
    if (categoryFromUrl && categories.some(category => category.key === categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categories, searchParams]);

  const tracks = activeCategory?.tracks || [];
  const tableMinWidth = Math.max(1410, 1225 + Math.max(tracks.length, 1) * 280);
  const startTableDrag = useCallback((event) => {
    if (event.button !== 0) {
      return;
    }

    const container = tableScrollRef.current;
    if (!container) {
      return;
    }

    dragScrollRef.current = {
      isDragging: true,
      startX: event.pageX - container.offsetLeft,
      scrollLeft: container.scrollLeft,
    };
    container.classList.add("cursor-grabbing", "select-none");
  }, []);

  const moveTableDrag = useCallback((event) => {
    const container = tableScrollRef.current;
    const dragState = dragScrollRef.current;

    if (!container || !dragState.isDragging) {
      return;
    }

    event.preventDefault();
    const x = event.pageX - container.offsetLeft;
    container.scrollLeft = dragState.scrollLeft - (x - dragState.startX);
  }, []);

  const stopTableDrag = useCallback(() => {
    const container = tableScrollRef.current;
    dragScrollRef.current.isDragging = false;
    container?.classList.remove("cursor-grabbing", "select-none");
  }, []);

  if (respectVisibility && visibilityLoading) {
    return (
      <div className="rounded-[2rem] border border-[#2b1a0f] bg-black p-8 text-center text-[#ff9a2c]">
        Checking leaderboard visibility...
      </div>
    );
  }

  if (respectVisibility && !leaderboardVisible) {
    return (
      <div className="rounded-[2rem] border border-[#2b1a0f] bg-black p-6 text-center md:p-10">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.45em] text-[#ff9a2c]">Leaderboard</p>
        <h3 className="font-heading text-3xl uppercase leading-none text-white md:text-5xl">
          LIVE LEADERBOARD CLOSED
        </h3>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#c58f55] md:text-base">
          Race Control has closed the live leaderboard for now. Please check back later.
        </p>
        <button
          type="button"
          onClick={refreshLeaderboard}
          disabled={refreshing}
          className="mx-auto mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#ff7a00]/35 bg-[#ff7a00]/10 px-5 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#ffb35c] transition-colors hover:border-[#ffb35c] hover:bg-[#ff7a00] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing" : "Refresh"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black">
      <div className="mb-4 flex flex-col gap-3 rounded-[18px] border border-[#2b1709] bg-[#101010] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#ff7a00]">Live Leaderboard</p>
          <p className="mt-1 text-sm text-[#c58f55]">
            {loading ? "Loading latest standings..." : "Latest synced standings"}
          </p>
        </div>
        <button
          type="button"
          onClick={refreshLeaderboard}
          disabled={refreshing || visibilityLoading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#ff7a00]/35 bg-[#ff7a00]/10 px-4 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#ffb35c] transition-colors hover:border-[#ffb35c] hover:bg-[#ff7a00] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing" : "Refresh"}
        </button>
      </div>

      {error ? (
        <div className="mb-4 rounded-[18px] border border-[#2b1709] bg-[#101010] px-4 py-4 text-[12px] font-black uppercase text-[#d9a36d]">
          No synced leaderboard data found yet.
        </div>
      ) : null}

      {!activeCategory ? (
        <div className="rounded-[18px] border border-[#2b1709] bg-[#101010] p-6 text-sm text-[#c58f55]">
          {loading ? "Loading leaderboard..." : "No leaderboard data has been synced from the app yet."}
        </div>
      ) : (
        <div className="bg-black">
          <div className="mb-4 rounded-[18px] border border-[#2b1709] bg-[#101010] px-4 py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#ff7a00]">Vehicle Category</p>
                <p className="mt-1 font-mono text-[14px] font-black uppercase text-[#fff7ef]">
                  {activeCategory?.label || "Leaderboard"}
                </p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:justify-end lg:overflow-visible lg:pb-0">
                {categories.map(category => {
                  const active = selectedCategory === category.key;

                  return (
                    <button
                      key={category.key}
                      type="button"
                      onClick={() => setSelectedCategory(category.key)}
                      className={`shrink-0 rounded-full border px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.16em] transition-colors ${
                        active
                          ? "border-[#ff7a00] bg-[#ff7a00] text-black"
                          : "border-[#2b1709] bg-black text-[#d9a36d] hover:border-[#ff7a00]/60 hover:text-[#fff7ef]"
                      }`}
                    >
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            ref={tableScrollRef}
            onMouseDown={startTableDrag}
            onMouseMove={moveTableDrag}
            onMouseUp={stopTableDrag}
            onMouseLeave={stopTableDrag}
            className="overflow-x-auto bg-black cursor-grab"
          >
            <table className="w-full border-separate border-spacing-y-3 text-left" style={{ minWidth: `${tableMinWidth}px` }}>
            <thead>
              <tr className="text-[12px] font-black uppercase text-[#d9a36d]">
                <th className="w-[145px] rounded-l-[18px] border-y border-l border-[#2b1709] bg-[#101010] px-4 py-5">Position</th>
                <th className="w-[145px] border-y border-[#2b1709] bg-[#101010] px-4 py-5">Sticker</th>
                <th className="w-[230px] border-y border-[#2b1709] bg-[#101010] px-4 py-5">Team</th>
                <th className="w-[230px] border-y border-[#2b1709] bg-[#101010] px-4 py-5">Driver</th>
                <th className="w-[285px] border-y border-[#2b1709] bg-[#101010] px-4 py-5">Co-Driver</th>
                <th className="w-[190px] border-y border-[#2b1709] bg-[#101010] px-4 py-5 text-center">Total</th>
                {tracks.map((track, index) => {
                  const isLastTrack = index === tracks.length - 1;
                  const trackLabel = track?.label || String(track || "Track");

                  return (
                    <th
                      key={track?.key || trackLabel}
                      className={`w-[280px] border-y border-[#2b1709] bg-[#101010] px-4 py-5 ${
                        isLastTrack ? "rounded-r-[18px] border-r" : ""
                      }`}
                    >
                      {trackLabel}
                    </th>
                  );
                })}
                {tracks.length === 0 ? (
                  <th className="w-[280px] rounded-r-[18px] border-y border-r border-[#2b1709] bg-[#101010] px-4 py-5">Track Status</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={row.vehicleKey}>
                  <td className="rounded-l-[18px] border-y border-l border-[#2b1709] bg-[#151515] px-4 py-11 align-middle">
                    <PositionCell position={rowIndex + 1} />
                  </td>
                  <td className="border-y border-[#2b1709] bg-[#151515] px-4 py-11 align-middle">
                    <span className="font-mono text-[17px] font-black text-[#fff7ef]">#{row.stickerNumber || "--"}</span>
                  </td>
                  <td className="border-y border-[#2b1709] bg-[#151515] px-4 py-11 align-middle">
                    <p className="font-mono text-[15px] font-black text-[#fff7ef]">{row.teamName}</p>
                  </td>
                  <td className="border-y border-[#2b1709] bg-[#151515] px-4 py-11 align-middle">
                    <p className="font-mono text-[15px] font-black text-[#fff7ef]">{row.driverName}</p>
                  </td>
                  <td className="border-y border-[#2b1709] bg-[#151515] px-4 py-11 align-middle">
                    <p className="font-mono text-[15px] font-black text-[#fff7ef]">{row.coDriverName}</p>
                  </td>
                  <td className="border-y border-[#2b1709] bg-[#151515] px-4 py-11 align-middle">
                    <TotalCell total={row.totalPoints} maxPoints={activeCategory?.maxPoints} />
                  </td>
                  {tracks.map((track, index) => {
                    const summary = getTrackSummaryForTrack(row, track);
                    const isLastTrack = index === tracks.length - 1;
                    const trackLabel = track?.label || String(track || "Track");

                    return (
                      <td
                        key={`${row.vehicleKey}-${track?.key || trackLabel}`}
                        className={`border-l border-y border-[#2b1709] bg-[#151515] px-4 py-11 align-middle text-left ${
                          isLastTrack ? "rounded-r-[18px] border-r" : ""
                        }`}
                      >
                        <TrackCell
                          summary={summary}
                          row={row}
                          trackLabel={trackLabel}
                          activeCategory={activeCategory}
                          detailReturnHref={detailReturnHref}
                        />
                      </td>
                    );
                  })}
                  {tracks.length === 0 ? (
                    <td className="rounded-r-[18px] border-l border-y border-r border-[#2b1709] bg-[#151515] px-4 py-11 align-middle text-[13px] font-black uppercase text-[#d9a36d]">
                      No track result synced
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
