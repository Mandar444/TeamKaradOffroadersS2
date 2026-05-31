"use client";

import { useState } from "react";
import { FileJson, RefreshCw, Upload } from "lucide-react";

export default function LeaderboardJsonUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);

  async function uploadJson(event) {
    event.preventDefault();

    if (!selectedFile) {
      setStatus({ type: "error", message: "Choose a leaderboard JSON file first." });
      return;
    }

    setUploading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/admin/leaderboard-json", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || "Leaderboard JSON restore failed.");
      }

      setStatus({
        type: "success",
        message: `Leaderboard restored: ${result.teams} teams, ${result.results} track results, ${result.categories} categories.`,
      });
      window.dispatchEvent(new Event("leaderboard-snapshot-updated"));
    } catch (error) {
      setStatus({ type: "error", message: error?.message || "Leaderboard JSON restore failed." });
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="mb-6 rounded-[18px] border border-[#ff7a00]/55 bg-[#101010] p-4 sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#ff7a00]/35 bg-[#ff7a00]/10 text-[#ff7a00]">
          <FileJson className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#ff7a00]">Restore Leaderboard JSON</p>
          <p className="mt-1 text-sm leading-relaxed text-[#c58f55]">
            Upload a saved full leaderboard snapshot to replace the live leaderboard data.
          </p>
        </div>
      </div>

      <form onSubmit={uploadJson} className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
        <label className="block">
          <span className="mb-2 block text-[9px] font-black uppercase tracking-[0.24em] text-[#d9a36d]">JSON File</span>
          <input
            type="file"
            accept=".json,application/json,text/plain"
            onChange={event => setSelectedFile(event.target.files?.[0] || null)}
            className="block h-12 w-full rounded-2xl border border-[#ff7a00] bg-black px-3 py-3 font-mono text-[12px] font-black uppercase text-[#fff7ef] file:mr-3 file:rounded-full file:border-0 file:bg-[#ff7a00] file:px-3 file:py-1.5 file:text-[10px] file:font-black file:uppercase file:tracking-[0.12em] file:text-black focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={uploading}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#ff7a00] bg-[#ff7a00] px-5 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-black transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Restoring" : "Restore JSON"}
        </button>
      </form>

      {status ? (
        <div
          className={`mt-4 rounded-2xl border px-4 py-3 text-[11px] font-black uppercase tracking-[0.14em] ${
            status.type === "success"
              ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
              : "border-red-500/25 bg-red-500/10 text-red-200"
          }`}
        >
          {status.message}
        </div>
      ) : null}
    </section>
  );
}
