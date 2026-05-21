"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, EyeOff, RefreshCw, Trash2 } from "lucide-react";
import { LEADERBOARD_VISIBILITY_PATH } from "@/lib/leaderboard-snapshot";

export default function LeaderboardVisibilityControl() {
  const [visible, setVisible] = useState(true);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);

  const loadVisibility = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(LEADERBOARD_VISIBILITY_PATH, { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to load visibility");
      }

      setVisible(data?.visible !== false);
      setUpdatedAt(data?.updatedAt || null);
      setLocked(data?.locked === true);
    } catch (loadError) {
      setError(loadError?.message || "Unable to load visibility");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVisibility();
  }, [loadVisibility]);

  const updateVisibility = async (nextVisible) => {
    setSaving(true);
    setError("");

    try {
      const response = await fetch(LEADERBOARD_VISIBILITY_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: nextVisible }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to update visibility");
      }

      setVisible(data?.visible !== false);
      setUpdatedAt(data?.updatedAt || null);
      setLocked(data?.locked === true);
    } catch (saveError) {
      setError(saveError?.message || "Unable to update visibility");
    } finally {
      setSaving(false);
    }
  };

  const resetLeaderboard = async () => {
    if (!confirm("Clear and reset all live leaderboard data? This cannot be undone.")) {
      return;
    }

    setResetting(true);
    setError("");

    try {
      const response = await fetch("/api/leaderboard-sync", {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to reset leaderboard");
      }

      window.location.reload();
    } catch (resetError) {
      setError(resetError?.message || "Unable to reset leaderboard");
      setResetting(false);
    }
  };

  const nextVisible = !visible;

  return (
    <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/75 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.38em] text-primary">
            Public Visibility
          </p>
          <h2 className="font-heading text-2xl uppercase italic leading-none text-white sm:text-3xl">
            Live Leaderboard is {visible ? "Shown" : "Hidden"}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
            This switch controls whether visitors can see the live leaderboard on teamkaradoffroaders.online.
            Admins can still view this console.
          </p>
          {locked ? (
            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.24em] text-primary">
              Controlled by LEADERBOARD_VISIBLE flag
            </p>
          ) : null}
          {updatedAt ? (
            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.24em] text-zinc-600">
              Last updated: {new Date(updatedAt).toLocaleString()}
            </p>
          ) : null}
          {error ? (
            <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-red-400">
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <button
            type="button"
            onClick={() => updateVisibility(nextVisible)}
            disabled={loading || saving || resetting || locked}
            className={`inline-flex h-14 items-center justify-center gap-3 rounded-2xl px-6 text-[10px] font-black uppercase tracking-[0.28em] transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
              visible
                ? "border border-red-500/25 bg-red-500/10 text-red-300 hover:bg-red-500 hover:text-white"
                : "border border-primary/30 bg-primary text-black hover:scale-[1.02]"
            }`}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {locked ? "Flag Controlled" : saving ? "Updating" : visible ? "Hide Live Leaderboard" : "Show Live Leaderboard"}
          </button>
          <button
            type="button"
            onClick={loadVisibility}
            disabled={loading || saving || resetting}
            className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-zinc-900 px-5 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-300 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={resetLeaderboard}
            disabled={loading || saving || resetting}
            className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 px-5 text-[10px] font-black uppercase tracking-[0.28em] text-red-300 transition-colors hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className={`h-4 w-4 ${resetting ? "animate-pulse" : ""}`} />
            {resetting ? "Resetting" : "Reset Live Data"}
          </button>
        </div>
      </div>
    </section>
  );
}
