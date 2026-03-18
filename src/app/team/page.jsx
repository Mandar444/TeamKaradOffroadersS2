"use client";

import { motion } from "framer-motion";
import { Zap, Trophy, Shield, Users, ChevronRight, LayoutGrid, Award, Star } from "lucide-react";
import Link from "next/link";

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 relative overflow-hidden flex items-center justify-center">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-[50%] h-[50vh] bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-12"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-zinc-900/50 border border-white/10 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Crew Briefing In Progress</span>
          </div>

          {/* Main Hero Header */}
          <div className="space-y-6">
            <h1 className="text-7xl md:text-9xl font-heading text-white tracking-tighter uppercase leading-none">
              OUR <span className="text-primary italic">CREW</span>
              <br />
              <span className="text-zinc-800">COMING SOON</span>
            </h1>
            <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed italic">
              We are currently finalizing the official Season 2 tactical team lineup. The visionaries, engineers, and guardians behind the mission will be revealed shortly.
            </p>
          </div>

          {/* Feature Grid - Explaining why it's empty */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
            {[
              { icon: Star, title: "FOUNDERS", desc: "Strategic Vision" },
              { icon: Award, title: "CORE TEAM", desc: "Operational Excellence" },
              { icon: Shield, title: "GUARDIANS", desc: "Safety & Marshalling" }
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-sm group hover:border-primary/20 transition-all">
                <feature.icon className="w-8 h-8 text-zinc-700 group-hover:text-primary transition-colors mx-auto mb-4" />
                <h3 className="text-white font-heading text-sm uppercase italic tracking-widest">{feature.title}</h3>
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mt-2">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="pt-12 flex flex-col md:flex-row items-center justify-center gap-6">
            <Link href="/" className="group relative">
               <div className="absolute inset-0 bg-primary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
               <div className="relative px-10 py-5 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all">
                  Return To Base <ChevronRight className="w-4 h-4" />
               </div>
            </Link>
            <Link href="/about" className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-all">
               The Mission
            </Link>
          </div>

          {/* Footer Note */}
          <div className="pt-20 opacity-20 select-none">
             <div className="flex items-center justify-center gap-8 md:gap-16">
                <span className="text-[10px] font-black uppercase tracking-[1em]">TEAM</span>
                <Zap className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[1em]">KARAD</span>
                <Trophy className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[1em]">OFFROADERS</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Aesthetic Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
         <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
         <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>
    </div>
  );
}
