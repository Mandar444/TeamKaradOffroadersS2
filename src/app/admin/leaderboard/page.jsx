"use client";

import { motion } from "framer-motion";
import { Trophy, Save, Zap, AlertCircle } from "lucide-react";

export default function AdminLeaderboardPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="flex items-center gap-4 mb-12">
           <div className="w-12 h-12 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-primary" />
           </div>
           <div>
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] leading-none mb-1">Command Center</p>
              <h1 className="text-4xl font-heading text-white uppercase italic tracking-tighter">LEADERBOARD <span className="text-primary not-italic">UPDATE</span></h1>
           </div>
        </div>

        <div className="bg-zinc-900/40 border border-white/10 backdrop-blur-3xl rounded-[2.5rem] p-12 text-center">
           <div className="flex justify-center mb-8">
              <div className="p-6 rounded-full bg-primary/5 border border-primary/10">
                 <Zap className="w-12 h-12 text-primary" />
              </div>
           </div>
           <h2 className="text-3xl font-heading text-white uppercase italic mb-4">SYSTEMS OFFLINE</h2>
           <p className="text-zinc-500 text-lg mb-8 max-w-lg mx-auto">
             The leaderboard management module is locked until Season 1 begins. Dynamic scoring tools will be deployed here on May 31st.
           </p>
           
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-xl border border-white/5 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
              <AlertCircle className="w-3 h-3" /> Standby for Deployment
           </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 opacity-30 grayscale pointer-events-none">
           <div className="p-8 bg-zinc-950 border border-white/5 rounded-2xl">
              <div className="h-4 w-24 bg-zinc-800 rounded-full mb-6" />
              <div className="space-y-4">
                 <div className="h-12 w-full bg-zinc-900 rounded-xl" />
                 <div className="h-12 w-full bg-zinc-900 rounded-xl" />
              </div>
           </div>
           <div className="p-8 bg-zinc-950 border border-white/5 rounded-2xl">
              <div className="h-4 w-24 bg-zinc-800 rounded-full mb-6" />
              <div className="space-y-4">
                 <div className="h-40 w-full bg-zinc-900 rounded-xl" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
