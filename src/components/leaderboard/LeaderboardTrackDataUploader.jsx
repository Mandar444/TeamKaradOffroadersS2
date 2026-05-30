"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Clock, Minus, Plus, RefreshCw, Send, Upload } from "lucide-react";
import { CATEGORY_PREFIXES } from "@/config/pricing";
import { LEADERBOARD_CSV_CATEGORIES } from "@/lib/leaderboard-csv";

const COUNTERS = [
  { key: "bunting_count", label: "Bunting Cut", seconds: 20, group: "Penalties" },
  { key: "pole_down_count", label: "Pole Down", seconds: 20, group: "Penalties" },
  { key: "seatbelt_count", label: "Seat Belt", seconds: 30, group: "Penalties" },
  { key: "ground_touch_count", label: "Ground Touch", seconds: 30, group: "Penalties" },
  { key: "attempt_count", label: "Skipped after 3rd attempt", seconds: 30, group: "Skipped" },
  { key: "task_skipped_count", label: "Task Skip", seconds: 90, group: "Skipped" },
];

const DNF_REASONS = [
  { key: "wrong_course_selected", value: "Wrong Course", label: "Wrong Course" },
  { key: "fourth_attempt_selected", value: "4th Attempt", label: "4th Attempt" },
  { key: "vehicle_out_of_track_selected", value: "Vehicle Out of the Track", label: "Vehicle Out of the Track" },
  { key: "vehicle_breakdown_selected", value: "Vehicle Breakdown", label: "Vehicle Breakdown" },
  { key: "time_over_selected", value: "Time Over", label: "Time Over" },
];

const DNF_POINTS = [20, 50];

const normalizeCategoryKey = value => {
  const normalized = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (normalized === "EXTREME" || normalized === "OPEN_CATEGORY") {
    return "OPEN";
  }

  if (normalized === "LADIES") {
    return "LADIES_CATEGORY";
  }

  return normalized;
};

const getParticipantId = participant =>
  participant?.recordId ||
  [
    normalizeCategoryKey(participant?.category),
    String(participant?.car_number || "").trim(),
    String(participant?.driver_name || "").trim().toLowerCase(),
  ].join("|");

const getParticipantSticker = participant =>
  String(participant?.car_number || participant?.sticker_number || participant?.stickerNumber || "")
    .trim()
    .replace(/^#/, "");

const getStickerPrefixForCategory = categoryKey => {
  const normalized = normalizeCategoryKey(categoryKey);

  if (normalized === "LADIES_CATEGORY") {
    return CATEGORY_PREFIXES.LADIES || "LC";
  }

  return CATEGORY_PREFIXES[normalized] || "";
};

const formatStickerNumber = (categoryKey, stickerNumber) => {
  const rawSticker = String(stickerNumber || "")
    .trim()
    .replace(/^#/, "")
    .replace(/\s+/g, "")
    .toUpperCase();

  if (!rawSticker) {
    return "";
  }

  if (/^[A-Z]+/.test(rawSticker)) {
    return rawSticker;
  }

  return `${getStickerPrefixForCategory(categoryKey)}${rawSticker}`;
};

const INITIAL_FORM = {
  team_name: "",
  sticker_number: "",
  driver_name: "",
  codriver_name: "",
  completion_time: "",
  total_time: "",
  bunting_count: 0,
  pole_down_count: 0,
  seatbelt_count: 0,
  ground_touch_count: 0,
  attempt_count: 0,
  task_skipped_count: 0,
  dnf_selection: "",
  is_dnf: false,
  dnf_points: "",
  wrong_course_selected: false,
  fourth_attempt_selected: false,
  time_over_selected: false,
  vehicle_out_of_track_selected: false,
  vehicle_breakdown_selected: false,
  is_dns: false,
};

const parseTimingMs = value => {
  const rawValue = String(value || "").trim();

  if (!rawValue || rawValue.toUpperCase() === "DNS" || rawValue.toUpperCase().startsWith("DNF")) {
    return null;
  }

  const parts = rawValue.split(":").map(part => Number(part));
  if (parts.length === 3 && parts.every(part => Number.isFinite(part))) {
    const [minutes, seconds, centiseconds] = parts;
    return Math.round(((minutes * 60) + seconds) * 1000 + centiseconds * 10);
  }

  if (parts.length === 2 && parts.every(part => Number.isFinite(part))) {
    const [minutes, seconds] = parts;
    return Math.round(((minutes * 60) + seconds) * 1000);
  }

  const numericValue = Number(rawValue);
  return Number.isFinite(numericValue) ? Math.round(numericValue * 1000) : null;
};

const formatTimingMs = value => {
  if (!Number.isFinite(Number(value))) {
    return "";
  }

  const totalMs = Math.max(0, Math.round(Number(value)));
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const centiseconds = Math.floor((totalMs % 1000) / 10);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(centiseconds).padStart(2, "0")}`;
};

function CounterCard({ item, value, onChange }) {
  const count = Number(value) || 0;

  return (
    <div className="rounded-[16px] border border-[#2b1709] bg-[#f8fafc] p-4 text-slate-900 shadow-[0_18px_34px_rgba(0,0,0,0.24)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-600">{item.label} ({item.seconds}s)</p>
          <p className="mt-1 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
            {count * item.seconds}s
          </p>
        </div>
        <span className="rounded-full bg-orange-100 px-3 py-1 font-mono text-[12px] font-black text-[#c45100]">
          {count}
        </span>
      </div>

      <div className="grid grid-cols-[64px_1fr_64px] items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, count - 1))}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff7a00] text-black transition-transform hover:scale-[1.03] hover:bg-[#ff8f1f] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={count <= 0}
          aria-label={`Decrease ${item.label}`}
        >
          <Minus className="h-5 w-5 stroke-[3px]" />
        </button>
        <div className="text-center font-mono text-2xl font-black text-slate-950">{count}</div>
        <button
          type="button"
          onClick={() => onChange(count + 1)}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff7a00] text-black transition-transform hover:scale-[1.03] hover:bg-[#ff8f1f]"
          aria-label={`Increase ${item.label}`}
        >
          <Plus className="h-5 w-5 stroke-[3px]" />
        </button>
      </div>
    </div>
  );
}

export default function LeaderboardTrackDataUploader() {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(LEADERBOARD_CSV_CATEGORIES[0]?.key || "");
  const [selectedTrack, setSelectedTrack] = useState(LEADERBOARD_CSV_CATEGORIES[0]?.tracks?.[0] || "");
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [selectedParticipantId, setSelectedParticipantId] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const activeCategory = useMemo(
    () => LEADERBOARD_CSV_CATEGORIES.find(category => category.key === selectedCategory) || LEADERBOARD_CSV_CATEGORIES[0],
    [selectedCategory]
  );
  const categoryParticipants = useMemo(
    () => participants.filter(participant => normalizeCategoryKey(participant?.category) === selectedCategory),
    [participants, selectedCategory]
  );
  const selectedParticipant = useMemo(
    () => categoryParticipants.find(participant => getParticipantId(participant) === selectedParticipantId) || null,
    [categoryParticipants, selectedParticipantId]
  );
  const penaltySeconds = useMemo(
    () => COUNTERS.reduce((total, item) => total + (Number(form[item.key]) || 0) * item.seconds, 0),
    [form]
  );
  const computedTotalTime = useMemo(() => {
    if (form.is_dns) {
      return "DNS";
    }

    if (form.dnf_selection || form.is_dnf) {
      return form.dnf_selection ? `DNF - ${form.dnf_selection}` : "DNF";
    }

    const completionMs = parseTimingMs(form.completion_time);
    if (!Number.isFinite(Number(completionMs))) {
      return "";
    }

    return penaltySeconds > 0
      ? formatTimingMs(completionMs + penaltySeconds * 1000)
      : form.completion_time.trim();
  }, [form.completion_time, form.dnf_selection, form.is_dnf, form.is_dns, penaltySeconds]);

  const updateForm = (key, value) => {
    setForm(current => ({ ...current, [key]: value }));
  };

  useEffect(() => {
    let cancelled = false;

    async function loadParticipants() {
      setParticipantsLoading(true);

      try {
        const response = await fetch("/api/teams", { cache: "no-store" });
        const data = response.ok ? await response.json() : {};

        if (!cancelled) {
          setParticipants(Array.isArray(data?.teams) ? data.teams : []);
        }
      } catch (error) {
        if (!cancelled) {
          setParticipants([]);
        }
      } finally {
        if (!cancelled) {
          setParticipantsLoading(false);
        }
      }
    }

    if (open) {
      loadParticipants();
    }

    return () => {
      cancelled = true;
    };
  }, [open]);

  const resetEntryFields = identityFields => {
    setForm({
      ...INITIAL_FORM,
      ...identityFields,
    });
  };

  const selectParticipant = participantId => {
    const participant = categoryParticipants.find(item => getParticipantId(item) === participantId) || null;
    setSelectedParticipantId(participantId);

    if (!participant) {
      resetEntryFields({});
      return;
    }

    resetEntryFields({
      team_name: String(participant.team_name || "").toUpperCase(),
      sticker_number: formatStickerNumber(participant.category || selectedCategory, getParticipantSticker(participant)),
      driver_name: String(participant.driver_name || "").toUpperCase(),
      codriver_name: String(participant.codriver_name || "").toUpperCase(),
    });
    setStatus(null);
  };

  const selectDnfReason = reason => {
    setForm(current => {
      const isSelected = current.dnf_selection === reason.value;
      const resetReasons = DNF_REASONS.reduce((acc, item) => ({ ...acc, [item.key]: false }), {});

      return {
        ...current,
        ...resetReasons,
        is_dnf: !isSelected,
        dnf_selection: isSelected ? "" : reason.value,
        dnf_points: isSelected ? "" : current.dnf_points || "20",
        [reason.key]: !isSelected,
        is_dns: false,
      };
    });
  };

  const selectDnfPoints = points => {
    setForm(current => ({
      ...current,
      is_dnf: true,
      dnf_points: String(points),
      is_dns: false,
    }));
  };

  const toggleDns = checked => {
    setForm(current => ({
      ...current,
      is_dns: checked,
      ...(checked
        ? {
            dnf_selection: "",
            is_dnf: false,
            dnf_points: "",
            wrong_course_selected: false,
            fourth_attempt_selected: false,
            time_over_selected: false,
            vehicle_out_of_track_selected: false,
            vehicle_breakdown_selected: false,
          }
        : {}),
    }));
  };

  const selectCategory = category => {
    setSelectedCategory(category.key);
    setSelectedTrack(category.tracks?.[0] || "");
    setSelectedParticipantId("");
    resetEntryFields({});
    setStatus(null);
  };

  async function submitTrackData(event) {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const response = await fetch("/api/admin/leaderboard-track-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entry: {
            ...form,
            categoryKey: selectedCategory,
            trackName: selectedTrack,
            total_time: computedTotalTime,
          },
        }),
      });
      const result = await response.json();

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || "Unable to save track data.");
      }

      setStatus({
        type: "success",
        message: `${activeCategory?.label || "Category"} ${selectedTrack} saved. Leaderboard refreshed.`,
      });
      setSelectedParticipantId("");
      setForm(INITIAL_FORM);
      window.dispatchEvent(new Event("leaderboard-snapshot-updated"));
    } catch (error) {
      setStatus({ type: "error", message: error?.message || "Unable to save track data." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mb-6 rounded-[18px] border border-[#2b1709] bg-[#101010] p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#ff7a00]">Track Data Upload</p>
          <p className="mt-1 text-sm leading-relaxed text-[#c58f55]">
            Add missing tablet data for one category and track. Points and track ranking are recalculated after submit.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(current => !current)}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#ff7a00] bg-[#ff7a00] px-5 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-black transition-transform hover:scale-[1.02]"
        >
          <Upload className="h-4 w-4" />
          Add Missing Data
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open ? (
        <form onSubmit={submitTrackData} className="mt-5 space-y-5">
          <div>
            <p className="mb-3 text-[9px] font-black uppercase tracking-[0.28em] text-[#d9a36d]">Category</p>
            <div className="grid auto-cols-[minmax(170px,1fr)] grid-flow-col gap-2 overflow-x-auto pb-1 xl:grid-flow-row xl:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] xl:overflow-visible">
              {LEADERBOARD_CSV_CATEGORIES.map(category => {
                const active = category.key === selectedCategory;

                return (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => selectCategory(category)}
                    className={`min-h-14 rounded-[14px] border px-4 py-3 text-left font-mono text-[10px] font-black uppercase tracking-[0.14em] transition-colors ${
                      active
                        ? "border-[#ff7a00] bg-[#ff7a00] text-black"
                        : "border-[#3a210f] bg-black text-[#d9a36d] hover:border-[#ff7a00]/60 hover:text-[#fff7ef]"
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[9px] font-black uppercase tracking-[0.28em] text-[#d9a36d]">Track</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(activeCategory?.tracks || []).map(track => {
                const active = track === selectedTrack;

                return (
                  <button
                    key={track}
                    type="button"
                    onClick={() => setSelectedTrack(track)}
                    className={`shrink-0 rounded-full border px-4 py-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] transition-colors ${
                      active
                        ? "border-[#ff7a00] bg-[#ff7a00] text-black"
                        : "border-[#3a210f] bg-black text-[#d9a36d] hover:border-[#ff7a00]/60 hover:text-[#fff7ef]"
                    }`}
                  >
                    {track}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#7f8ca3]">Participant Record</p>
              <div className="h-px flex-1 bg-[#7f8ca3]/45" />
            </div>
            <label className="block">
              <span className="mb-2 block text-[9px] font-black uppercase tracking-[0.24em] text-[#d9a36d]">Driver Name</span>
              <select
                value={selectedParticipantId}
                onChange={event => selectParticipant(event.target.value)}
                className="h-12 w-full rounded-2xl border border-[#ff7a00]/70 bg-black px-3 font-mono text-[12px] font-black uppercase text-[#fff7ef] outline outline-1 outline-[#ff7a00]/60 transition-colors focus:border-[#ff7a00] focus:outline-2 focus:outline-[#ff7a00]"
              >
                <option value="">
                  {participantsLoading
                    ? "Loading participants..."
                    : categoryParticipants.length
                      ? "Select driver"
                      : "No participants in this category"}
                </option>
                {categoryParticipants.map(participant => {
                  const sticker = formatStickerNumber(participant.category || selectedCategory, getParticipantSticker(participant));
                  const label = [
                    sticker ? `#${sticker}` : "",
                    participant.driver_name || "Driver",
                    participant.team_name || "Team",
                  ].filter(Boolean).join(" - ");

                  return (
                    <option key={getParticipantId(participant)} value={getParticipantId(participant)}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </label>

            {selectedParticipant ? (
              <div className="mt-4 grid gap-3 md:grid-cols-4">
                {[
                  ["Team Name", "team_name"],
                  ["Sticker No", "sticker_number"],
                  ["Driver Name", "driver_name"],
                  ["Co-Driver Name", "codriver_name"],
                ].map(([label, key]) => (
                  <label key={key} className="block">
                    <span className="mb-2 block text-[9px] font-black uppercase tracking-[0.24em] text-[#d9a36d]">{label}</span>
                    <input
                      value={form[key]}
                      readOnly
                      className="h-12 w-full rounded-2xl border border-[#ff7a00]/70 bg-black px-3 font-mono text-[12px] font-black uppercase text-[#fff7ef] outline outline-1 outline-[#ff7a00]/60 placeholder:text-[#5f4326]"
                    />
                  </label>
                ))}
              </div>
            ) : null}
          </div>

          {selectedParticipant ? (
            <>
          {["Penalties", "Skipped"].map(group => (
            <div key={group}>
              <div className="mb-3 flex items-center gap-3">
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#7f8ca3]">{group}</p>
                <div className="h-px flex-1 bg-[#7f8ca3]/45" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {COUNTERS.filter(item => item.group === group).map(item => (
                  <CounterCard
                    key={item.key}
                    item={item}
                    value={form[item.key]}
                    onChange={value => updateForm(item.key, value)}
                  />
                ))}
              </div>
            </div>
          ))}

          <div>
            <div className="mb-3 flex items-center gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#7f8ca3]">DNF / DNS</p>
              <div className="h-px flex-1 bg-[#7f8ca3]/45" />
            </div>
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
              <div className="overflow-hidden rounded-[18px] border border-[#ffb08a] bg-[#fff5ef] p-3">
                <button
                  type="button"
                  className="flex min-h-16 w-full items-center justify-between rounded-[14px] border border-[#ffb08a] bg-[#111827] px-4 text-left font-mono text-[15px] font-black uppercase tracking-[0.08em] text-[#c9471f]"
                  aria-expanded="true"
                >
                  <span>DNF</span>
                  <ChevronDown className="h-4 w-4 text-[#ff6530]" />
                </button>

                <div className="mt-3 overflow-hidden rounded-[14px] border border-[#ffb08a]">
                  {DNF_REASONS.map(reason => {
                    const active = form.dnf_selection === reason.value;

                    return (
                      <button
                        key={reason.key}
                        type="button"
                        onClick={() => selectDnfReason(reason)}
                        disabled={form.is_dns}
                        className={`flex min-h-15 w-full items-center gap-4 border-b border-white/80 bg-[#111827] px-4 text-left font-mono text-[13px] font-black text-[#ff3030] transition-colors last:border-b-0 hover:bg-[#172033] disabled:cursor-not-allowed disabled:opacity-60 ${
                          active ? "text-[#ff7a00]" : ""
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                            active ? "border-[#ff7a00] bg-[#ff7a00]" : "border-[#ffb08a]"
                          }`}
                        >
                          <span className={`h-2.5 w-2.5 rounded-full bg-[#111827] ${active ? "block" : "hidden"}`} />
                        </span>
                        <span>{reason.label}</span>
                      </button>
                    );
                  })}

                  <div className="border-t border-white/80 bg-[#111827] px-4 py-4 font-mono text-[12px] font-black uppercase tracking-[0.12em] text-[#c9471f]">
                    Points
                  </div>
                  {DNF_POINTS.map(points => {
                    const active = String(form.dnf_points) === String(points);

                    return (
                      <button
                        key={points}
                        type="button"
                        onClick={() => selectDnfPoints(points)}
                        disabled={form.is_dns}
                        className={`flex min-h-15 w-full items-center justify-between border-t border-[#ffd4c2] bg-[#f8fafc] px-4 text-left font-mono text-[13px] font-black text-[#b75a5a] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 ${
                          active ? "bg-white text-[#c9471f]" : ""
                        }`}
                      >
                        <span>{points} points</span>
                        <span
                          className={`h-3 w-3 rounded-full ${
                            active ? "bg-[#ff7a00]" : "bg-transparent"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
              <label className="flex min-h-[92px] items-center gap-3 rounded-[16px] border border-[#2b1709] bg-black px-4">
                <input
                  type="checkbox"
                  checked={form.is_dns}
                  onChange={event => toggleDns(event.target.checked)}
                  className="h-5 w-5 accent-[#ff7a00]"
                />
                <span className="font-mono text-[11px] font-black uppercase tracking-[0.2em] text-[#fff7ef]">DNS</span>
              </label>
            </div>
          </div>

          <div className="rounded-[18px] border border-[#ffcc33] bg-[#fffdf0] p-4 text-slate-950">
            <div className="mb-4 flex items-center justify-center gap-2 text-[#a64d17]">
              <Clock className="h-4 w-4" />
              <p className="text-[13px] font-black uppercase tracking-[0.16em]">Time Summary</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Completion Time</span>
                <input
                  value={form.completion_time}
                  onChange={event => updateForm("completion_time", event.target.value)}
                  placeholder="00:18:24"
                  disabled={form.is_dns || form.is_dnf || Boolean(form.dnf_selection)}
                  className="h-12 w-full rounded-2xl border border-[#ff7a00]/70 bg-white px-3 font-mono text-[14px] font-black text-slate-950 outline outline-1 outline-[#ff7a00]/60 focus:border-[#ff7a00] focus:outline-2 focus:outline-[#ff7a00]"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Total Time</span>
                <input
                  value={computedTotalTime}
                  readOnly
                  placeholder="Auto from completion"
                  disabled={form.is_dns || form.is_dnf || Boolean(form.dnf_selection)}
                  className="h-12 w-full rounded-2xl border border-[#ff7a00]/70 bg-white px-3 font-mono text-[14px] font-black text-slate-950 outline outline-1 outline-[#ff7a00]/60 focus:border-[#ff7a00] focus:outline-2 focus:outline-[#ff7a00] disabled:opacity-70"
                />
              </label>
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 font-mono text-sm font-black">
              <div className="flex items-center justify-between gap-4">
                <span>Total Penalties Time</span>
                <span>{penaltySeconds} sec</span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#ff5722] px-4 py-4 text-white">
                <span className="uppercase">Total Time</span>
                <span className="text-xl">{computedTotalTime || "--"}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full border border-[#ff7a00] bg-[#ff7a00] px-5 py-4 font-mono text-[11px] font-black uppercase tracking-[0.18em] text-black transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
          >
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {saving ? "Saving" : "Submit"}
          </button>

            </>
          ) : (
            <div className="rounded-[18px] border border-[#ff7a00]/25 bg-[#ff7a00]/10 px-4 py-5 text-center font-mono text-[11px] font-black uppercase tracking-[0.16em] text-[#ffb35c]">
              Select category, track, and driver record to add missing leaderboard data.
            </div>
          )}

          {status ? (
            <div
              className={`rounded-2xl border px-4 py-3 text-[11px] font-black uppercase tracking-[0.14em] ${
                status.type === "success"
                  ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
                  : "border-red-500/25 bg-red-500/10 text-red-200"
              }`}
            >
              {status.message}
            </div>
          ) : null}
        </form>
      ) : null}
    </section>
  );
}
