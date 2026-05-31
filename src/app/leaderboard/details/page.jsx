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
          {["Penalty", "Count", "Penalty Value", "Status"].map((label, index) => (
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

function AdminEditForm({ record, entry, searchParams, onSaved }) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  async function saveEdit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    setSaving(true);
    setStatus(null);

    try {
      const response = await fetch("/api/admin/leaderboard-edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: searchParams.get("key") || "",
          shortKey: searchParams.get("shortKey") || "",
          categoryKey: searchParams.get("categoryKey") || "",
          category: searchParams.get("category") || "",
          track: searchParams.get("track") || "",
          sticker: searchParams.get("sticker") || "",
          driver: searchParams.get("driver") || "",
          day: searchParams.get("day") || "",
          values: {
            day: formData.get("day") || "",
            dayId: formData.get("dayId") || "",
            selectedDayDate: formData.get("selectedDayDate") || "",
            performanceTime: formData.get("performanceTime") || "",
            points: formData.get("points") || "0",
            rank: formData.get("rank") || "",
            buntingCount: formData.get("buntingCount") || "0",
            buntingPenaltyTime: formData.get("buntingPenaltyTime") || "0",
            poleDownCount: formData.get("poleDownCount") || "0",
            poleDownPenaltyTime: formData.get("poleDownPenaltyTime") || "0",
            seatbeltCount: formData.get("seatbeltCount") || "0",
            seatbeltPenaltyTime: formData.get("seatbeltPenaltyTime") || "0",
            groundTouchCount: formData.get("groundTouchCount") || "0",
            groundTouchPenaltyTime: formData.get("groundTouchPenaltyTime") || "0",
            lateStartMode: formData.get("lateStartMode") || "",
            lateStartStatus: formData.get("lateStartStatus") || "",
            lateStartCount: formData.get("lateStartCount") || "0",
            lateStartPenaltyTime: formData.get("lateStartPenaltyTime") || "0",
            lateStartPenaltyPoints: formData.get("lateStartPenaltyPoints") || "0",
            attemptCount: formData.get("attemptCount") || "0",
            attemptPenaltyTime: formData.get("attemptPenaltyTime") || "0",
            taskSkippedCount: formData.get("taskSkippedCount") || "0",
            taskSkippedPenaltyTime: formData.get("taskSkippedPenaltyTime") || "0",
            isDns: formData.get("isDns") === "on",
            isDnf: formData.get("isDnf") === "on",
            wrongCourseSelected: formData.get("wrongCourseSelected") === "on",
            fourthAttemptSelected: formData.get("fourthAttemptSelected") === "on",
            timeOverSelected: formData.get("timeOverSelected") === "on",
            vehicleOutOfTrackSelected: formData.get("vehicleOutOfTrackSelected") === "on",
            vehicleBreakdownSelected: formData.get("vehicleBreakdownSelected") === "on",
            dnfSelection: formData.get("dnfSelection") || "",
            dnfPoints: formData.get("dnfPoints") || "0",
          },
        }),
      });
      const result = await response.json();

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || "Unable to save leaderboard edit.");
      }

      setStatus({ type: "success", message: "Leaderboard updated and rankings recalculated." });
      window.dispatchEvent(new Event("leaderboard-snapshot-updated"));
      await onSaved();
    } catch (error) {
      setStatus({ type: "error", message: error?.message || "Unable to save leaderboard edit." });
    } finally {
      setSaving(false);
    }
  }

  const getValue = (keys, fallback = "") => getRecordValue(record, keys, fallback);
  const getFlag = keys => keys.some(key => {
    const value = record?.[key];
    return value === true || value === 1 || value === "1" || String(value || "").toLowerCase() === "true";
  });

  return (
    <form onSubmit={saveEdit} className="rounded-[18px] border border-[#ff7a00]/30 bg-[#140b04] p-3.5">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-[#ff7a00]">Admin Edit</p>
          <h2 className="mt-1 font-mono text-sm font-black uppercase text-[#fff7ef]">Update Track Result</h2>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 items-center justify-center rounded-full border border-[#ff7a00] bg-[#ff7a00] px-4 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving" : "Save Changes"}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { name: "day", label: "Day", value: getValue(["selected_day_label", "selectedDayLabel"], entry.dayLabel) },
          { name: "dayId", label: "Day ID", value: getValue(["selected_day_id", "selectedDayId"]) },
          { name: "selectedDayDate", label: "Date", value: getValue(["selected_day_date", "selectedDayDate"]) },
          { name: "rank", label: "Rank", value: getValue(["rank", "rank_label"], entry.rankLabel) },
          { name: "performanceTime", label: "Performance Time", value: getValue(["performance_time", "performanceTimeDisplay"], entry.timingLabel) },
          { name: "points", label: "Points", value: getValue(["points", "total_points"], String(entry.pointsLabel || "").replace(/[^\d.-]/g, "")) },
          { name: "dnfSelection", label: "DNF Reason", value: getValue(["dnf_selection", "dnfSelection"]) },
          { name: "dnfPoints", label: "DNF Points", value: getValue(["dnf_points", "dnfPoints"], 0) },
        ].map(field => (
          <label key={field.name} className="block">
            <span className="mb-1.5 block font-mono text-[8px] font-black uppercase tracking-[0.1em] text-[#e1ad7a]">{field.label}</span>
            <input
              name={field.name}
              defaultValue={field.value || ""}
              className="h-10 w-full rounded-xl border border-[#2a1a0f] bg-black px-3 font-mono text-[12px] font-black uppercase text-[#fff7ef] outline-none focus:border-[#ff7a00]"
            />
          </label>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-[#2a1a0f] bg-black/45 p-3">
        <p className="mb-3 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-[#ff7a00]">Penalty Breakdown</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { count: "buntingCount", countLabel: "Bunting Count", countValue: getValue(["bunting_count", "busting_count", "buntingCount", "bustingCount"], 0), penalty: "buntingPenaltyTime", penaltyLabel: "Bunting Penalty", penaltyValue: getValue(["bunting_penalty_time", "busting_penalty_time", "buntingPenaltyTime", "bustingPenaltyTime"], 0) },
            { count: "poleDownCount", countLabel: "Pole Down Count", countValue: getValue(["pole_down_count", "poleDownCount"], 0), penalty: "poleDownPenaltyTime", penaltyLabel: "Pole Down Penalty", penaltyValue: getValue(["pole_down_penalty_time", "poleDownPenaltyTime"], 0) },
            { count: "seatbeltCount", countLabel: "Seatbelt Count", countValue: getValue(["seatbelt_count", "seatbeltCount"], 0), penalty: "seatbeltPenaltyTime", penaltyLabel: "Seatbelt Penalty", penaltyValue: getValue(["seatbelt_penalty_time", "seatbeltPenaltyTime"], 0) },
            { count: "groundTouchCount", countLabel: "Ground Touch Count", countValue: getValue(["ground_touch_count", "groundTouchCount"], 0), penalty: "groundTouchPenaltyTime", penaltyLabel: "Ground Touch Penalty", penaltyValue: getValue(["ground_touch_penalty_time", "groundTouchPenaltyTime"], 0) },
            { count: "lateStartCount", countLabel: "Late Start Count", countValue: getValue(["late_start_count", "lateStartCount"], 0), penalty: "lateStartPenaltyTime", penaltyLabel: "Late Start Penalty", penaltyValue: getValue(["late_start_penalty_time", "lateStartPenaltyTime"], 0) },
            { count: "attemptCount", countLabel: "Attempt Count", countValue: getValue(["attempt_count", "attemptCount"], 0), penalty: "attemptPenaltyTime", penaltyLabel: "Attempt Penalty", penaltyValue: getValue(["attempt_penalty_time", "attemptPenaltyTime"], 0) },
            { count: "taskSkippedCount", countLabel: "Task Skipped Count", countValue: getValue(["task_skipped_count", "taskSkippedCount"], 0), penalty: "taskSkippedPenaltyTime", penaltyLabel: "Task Skipped Penalty", penaltyValue: getValue(["task_skipped_penalty_time", "taskSkippedPenaltyTime"], 0) },
          ].flatMap(field => [
            <label key={field.count} className="block">
              <span className="mb-1.5 block font-mono text-[8px] font-black uppercase tracking-[0.1em] text-[#e1ad7a]">{field.countLabel}</span>
              <input
                name={field.count}
                defaultValue={field.countValue || 0}
                className="h-10 w-full rounded-xl border border-[#2a1a0f] bg-black px-3 font-mono text-[12px] font-black uppercase text-[#fff7ef] outline-none focus:border-[#ff7a00]"
              />
            </label>,
            <label key={field.penalty} className="block">
              <span className="mb-1.5 block font-mono text-[8px] font-black uppercase tracking-[0.1em] text-[#e1ad7a]">{field.penaltyLabel}</span>
              <input
                name={field.penalty}
                defaultValue={field.penaltyValue || 0}
                className="h-10 w-full rounded-xl border border-[#2a1a0f] bg-black px-3 font-mono text-[12px] font-black uppercase text-[#fff7ef] outline-none focus:border-[#ff7a00]"
              />
            </label>,
          ])}

          {[
            { name: "lateStartMode", label: "Late Start Mode", value: getValue(["late_start_mode", "lateStartMode"]) },
            { name: "lateStartStatus", label: "Late Start Status", value: getValue(["late_start_status", "lateStartStatus"]) },
            { name: "lateStartPenaltyPoints", label: "Late Start Points", value: getValue(["late_start_penalty_points", "lateStartPenaltyPoints"], 0) },
          ].map(field => (
            <label key={field.name} className="block">
              <span className="mb-1.5 block font-mono text-[8px] font-black uppercase tracking-[0.1em] text-[#e1ad7a]">{field.label}</span>
              <input
                name={field.name}
                defaultValue={field.value || ""}
                className="h-10 w-full rounded-xl border border-[#2a1a0f] bg-black px-3 font-mono text-[12px] font-black uppercase text-[#fff7ef] outline-none focus:border-[#ff7a00]"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { name: "isDns", label: "DNS", checked: getFlag(["is_dns", "isDNS", "isDns"]) },
          { name: "isDnf", label: "DNF", checked: getFlag(["is_dnf", "isDNF", "isDnf"]) },
          { name: "wrongCourseSelected", label: "Wrong Course", checked: getFlag(["wrong_course_selected", "wrongCourseSelected"]) },
          { name: "fourthAttemptSelected", label: "4th Attempt", checked: getFlag(["fourth_attempt_selected", "fourthAttemptSelected"]) },
          { name: "timeOverSelected", label: "Time Over", checked: getFlag(["time_over_selected", "timeOverSelected"]) },
          { name: "vehicleOutOfTrackSelected", label: "Vehicle Out", checked: getFlag(["vehicle_out_of_track_selected", "vehicleOutOfTrackSelected"]) },
          { name: "vehicleBreakdownSelected", label: "Breakdown", checked: getFlag(["vehicle_breakdown_selected", "vehicleBreakdownSelected"]) },
        ].map(field => (
          <label key={field.name} className="flex min-h-10 items-center gap-2 rounded-xl border border-[#2a1a0f] bg-black px-3 font-mono text-[10px] font-black uppercase text-[#fff7ef]">
            <input name={field.name} type="checkbox" defaultChecked={field.checked} className="h-4 w-4 accent-[#ff7a00]" />
            {field.label}
          </label>
        ))}
      </div>

      {status ? (
        <div
          className={`mt-3 rounded-xl border px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.1em] ${
            status.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              : "border-red-500/30 bg-red-500/10 text-red-200"
          }`}
        >
          {status.message}
        </div>
      ) : null}
    </form>
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
  const isAdminMode = requestedReturnTo === "/admin/leaderboard";

  useEffect(() => {
    let active = true;

    async function loadSnapshot() {
      setLoading(true);
      setError("");

      try {
        if (isAdminMode) {
          const exportedSnapshot = await fetchLeaderboardSnapshot();
          if (active) {
            setLeaderboardVisible(true);
            setSnapshot(exportedSnapshot);
          }
          return;
        }

        let visibility = null;

        try {
          visibility = await fetchLeaderboardVisibility();
        } catch (visibilityError) {
          if (active) {
            setLeaderboardVisible(false);
            setSnapshot(null);
          }
          return;
        }

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
  }, [isAdminMode]);

  useEffect(() => {
    if (isAdminMode) {
      return undefined;
    }

    const intervalId = window.setInterval(async () => {
      try {
        const visibility = await fetchLeaderboardVisibility();

        if (!visibility.visible) {
          setLeaderboardVisible(false);
          setSnapshot(null);
        }
      } catch (visibilityError) {
        setLeaderboardVisible(false);
        setSnapshot(null);
      }
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [isAdminMode]);

  const detailIndex = useMemo(() => buildLeaderboardDetailIndex(snapshot), [snapshot]);
  const record = useMemo(() => detailIndex.get(key) || detailIndex.get(shortKey) || null, [detailIndex, key, shortKey]);
  const backCategoryKey = requestedCategoryKey || normalizeCategoryKey(record?.category || searchParams.get("category") || "");
  const safeReturnHref = requestedReturnTo === "/admin/leaderboard" ? requestedReturnTo : "";
  const publicBackHref = backCategoryKey ? `/leaderboard?category=${encodeURIComponent(backCategoryKey)}` : "/leaderboard";
  const backHref = safeReturnHref || publicBackHref;
  const categoryLabel = getRecordValue(record, ["category"], searchParams.get("category") || "Leaderboard");
  const trackLabel = getRecordValue(record, ["track_name", "trackName"], searchParams.get("track") || "Track");
  const stickerNumber = getRecordValue(record, ["sticker_number", "stickerNumber"], searchParams.get("sticker") || "--");
  const teamName = getRecordValue(record, ["team_name", "teamName", "team"], searchParams.get("team") || "--");
  const driverName = getRecordValue(record, ["driver_name", "driverName"], searchParams.get("driver") || "--");
  const recordPoints = getRecordValue(record, ["points", "total_points"], "");
  const entry = {
    dayLabel: isAdminMode
      ? getRecordValue(record, ["selected_day_label", "selectedDayLabel"], searchParams.get("day") || "--")
      : searchParams.get("day") || getRecordValue(record, ["selected_day_label", "selectedDayLabel"], "--"),
    timingLabel:
      isAdminMode
        ? getRecordValue(record, ["total_time", "totalTimeDisplay", "performance_time", "performanceTimeDisplay"], searchParams.get("timing") || "--")
        : searchParams.get("timing") ||
          getRecordValue(record, ["total_time", "totalTimeDisplay", "performance_time", "performanceTimeDisplay"], "--"),
    pointsLabel: isAdminMode
      ? recordPoints !== "" && recordPoints !== "--"
        ? `${recordPoints} pts`
        : searchParams.get("points") || "--"
      : searchParams.get("points") || "--",
    rankLabel: isAdminMode
      ? getRecordValue(record, ["rank", "rank_label"], searchParams.get("rank") || "--")
      : searchParams.get("rank") || "--",
  };
  const detailSections = record
    ? [
        ...buildDetailSections(record),
        ...appendDisputeDetailsSection(record),
        ...appendDisputeResolutionSection(record),
      ]
    : [];
  const rawRecordItems = buildRawRecordItems(record || {});
  const reloadSnapshot = async () => {
    const exportedSnapshot = await fetchLeaderboardSnapshot();
    setSnapshot(exportedSnapshot);
  };

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
                : `${categoryLabel} | #${formatDetailValue(stickerNumber)} | ${formatDetailValue(teamName)} | ${formatDetailValue(driverName)}`}
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

              {isAdminMode && record ? (
                <AdminEditForm
                  key={record?.updated_at || record?.adminEditedAt || record?.admin_edited_at || record?.__identityKey}
                  record={record}
                  entry={entry}
                  searchParams={searchParams}
                  onSaved={reloadSnapshot}
                />
              ) : null}

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
