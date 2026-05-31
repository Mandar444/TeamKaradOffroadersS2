"use client";

import { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, DatabaseZap, Trophy } from "lucide-react";
import LeaderboardJsonUploader from "@/components/leaderboard/LeaderboardJsonUploader";
import LeaderboardSnapshotViewer from "@/components/leaderboard/LeaderboardSnapshotViewer";
import LeaderboardTrackDataUploader from "@/components/leaderboard/LeaderboardTrackDataUploader";
import LeaderboardVisibilityControl from "@/components/leaderboard/LeaderboardVisibilityControl";

export default function AdminLeaderboardPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 text-white/5">
        <div className="absolute top-0 right-0 h-[560px] w-[70%] bg-primary/10 blur-[150px] opacity-30" />
        <div className="absolute bottom-0 left-0 h-[420px] w-[55%] bg-orange-500/10 blur-[140px] opacity-20" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1920px] px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/admin"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 transition-colors hover:border-primary/40 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Race Control
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-4xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase leading-none tracking-[0.5em] text-primary">
                  Admin Console
                </p>
                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.32em] text-zinc-600">
                  Synced from TKO app export
                </p>
              </div>
            </div>
            <h1 className="font-heading text-5xl uppercase leading-none tracking-tighter text-white sm:text-7xl md:text-8xl">
              Leaderboard <span className="text-primary italic">Control</span>
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Displays the latest leaderboard snapshot pushed by the scoring app. Use refresh inside the panel after a
              new export is synced.
            </p>
          </div>

          <div className="rounded-[1.6rem] border border-white/10 bg-zinc-950/70 px-5 py-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <DatabaseZap className="h-5 w-5 text-primary" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.35em] text-zinc-600">Source</p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.22em] text-primary">
                  /api/leaderboard-sync
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <LeaderboardVisibilityControl />
        <LeaderboardJsonUploader />
        <LeaderboardTrackDataUploader />

        <Suspense
          fallback={
            <div className="rounded-[2rem] border border-[#2b1a0f] bg-black p-8 text-center text-[#ff9a2c]">
              Loading synced leaderboard...
            </div>
          }
        >
          <LeaderboardSnapshotViewer
            respectVisibility={false}
            detailReturnHref="/admin/leaderboard"
            allowAdminEdit
            allowAdminDelete
          />
        </Suspense>
      </div>
    </div>
  );
}
