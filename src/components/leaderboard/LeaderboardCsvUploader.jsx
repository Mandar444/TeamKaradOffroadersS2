"use client";

import { useMemo, useState } from "react";
import { Download, FileSpreadsheet, RefreshCw, Upload } from "lucide-react";
import { LEADERBOARD_CSV_CATEGORIES } from "@/lib/leaderboard-csv";

export default function LeaderboardCsvUploader() {
  const [selectedCategory, setSelectedCategory] = useState(LEADERBOARD_CSV_CATEGORIES[0]?.key || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);

  const activeCategory = useMemo(
    () => LEADERBOARD_CSV_CATEGORIES.find(category => category.key === selectedCategory) || LEADERBOARD_CSV_CATEGORIES[0],
    [selectedCategory]
  );

  async function uploadCsv(event) {
    event.preventDefault();

    if (!selectedFile) {
      setStatus({ type: "error", message: "Choose a category CSV file first." });
      return;
    }

    setUploading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("categoryKey", selectedCategory);
      formData.append("file", selectedFile);

      const response = await fetch("/api/admin/leaderboard-csv", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || "CSV upload failed.");
      }

      setStatus({
        type: "success",
        message: `${result.categoryLabel || selectedCategory} imported: ${result.rows} rows, ${result.results} track results.`,
      });
      window.dispatchEvent(new Event("leaderboard-snapshot-updated"));
    } catch (error) {
      setStatus({ type: "error", message: error?.message || "CSV upload failed." });
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="mb-6 rounded-[18px] border border-[#2b1709] bg-[#101010] p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#ff7a00]/25 bg-[#ff7a00]/10 text-[#ff7a00]">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#ff7a00]">Direct CSV Upload</p>
            <p className="mt-1 text-sm leading-relaxed text-[#c58f55]">
              Replace one live leaderboard category without waiting for the TKO app sync.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {activeCategory?.detailFileName ? (
            <a
              href={`/data/leaderboard-entry-csv/${activeCategory.detailFileName}`}
              download
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#ff7a00] bg-[#ff7a00] px-4 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-black transition-transform hover:scale-[1.02]"
            >
              <Download className="h-4 w-4" />
              Entry Details
            </a>
          ) : null}
          {activeCategory?.fileName ? (
            <a
              href={`/data/leaderboard-csv/${activeCategory.fileName}`}
              download
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#ff7a00]/35 bg-[#ff7a00]/10 px-4 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#ffb35c] transition-colors hover:border-[#ffb35c] hover:bg-[#ff7a00] hover:text-black"
            >
              <Download className="h-4 w-4" />
              Summary
            </a>
          ) : null}
        </div>
      </div>

      <form onSubmit={uploadCsv} className="grid gap-3 lg:grid-cols-[minmax(220px,320px)_1fr_auto] lg:items-end">
        <label className="block">
          <span className="mb-2 block text-[9px] font-black uppercase tracking-[0.24em] text-[#d9a36d]">Category</span>
          <select
            value={selectedCategory}
            onChange={event => setSelectedCategory(event.target.value)}
            className="h-12 w-full rounded-2xl border border-[#2b1709] bg-black px-3 font-mono text-[12px] font-black uppercase text-[#fff7ef] outline-none transition-colors focus:border-[#ff7a00]"
          >
            {LEADERBOARD_CSV_CATEGORIES.map(category => (
              <option key={category.key} value={category.key}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-[9px] font-black uppercase tracking-[0.24em] text-[#d9a36d]">CSV File</span>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={event => setSelectedFile(event.target.files?.[0] || null)}
            className="block h-12 w-full rounded-2xl border border-[#2b1709] bg-black px-3 py-3 font-mono text-[12px] font-black uppercase text-[#fff7ef] file:mr-3 file:rounded-full file:border-0 file:bg-[#ff7a00] file:px-3 file:py-1.5 file:text-[10px] file:font-black file:uppercase file:tracking-[0.12em] file:text-black focus:border-[#ff7a00] focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={uploading}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#ff7a00] bg-[#ff7a00] px-5 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-black transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading" : "Upload"}
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
