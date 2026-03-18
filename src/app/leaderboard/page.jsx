"use client";

import { motion } from "framer-motion";
import { Trophy, Clock, Zap } from "lucide-react";
import Link from "next/link";

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[60%] h-[50vh] bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-3xl border border-primary/20 flex items-center justify-center mb-8 relative">
             <Trophy className="w-12 h-12 text-primary" />
             <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
          </div>

          <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] mb-4">Tactical Standings</p>
          <h1 className="text-6xl md:text-8xl font-heading tracking-tighter uppercase leading-none mb-8">
            LIVE <span className="text-primary italic">LEADERBOARD</span>
          </h1>

          <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-3xl rounded-[2rem] p-12 md:p-20 max-w-2xl mx-auto">
             <Clock className="w-16 h-16 text-zinc-700 mx-auto mb-6 animate-pulse" />
             <h2 className="text-4xl font-heading text-white uppercase italic mb-4">COMING SOON</h2>
             <p className="text-zinc-500 text-lg leading-relaxed">
               The grid is being calibrated. Real-time standings for Season 2 will be available once the first flag drops on May 29th.
             </p>
          </div>

          <div className="mt-12">
            <Link 
              href="/" 
              className="text-primary text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors"
            >
              ← RETURN TO BASE
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
