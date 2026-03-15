"use client";

import { motion } from "framer-motion";
import { use, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Zap, Trophy, Shield, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const CATEGORIES = {
  "PETROL_MODIFIED": { name: "Pro-Petrol Modified", color: "from-orange-500 to-red-600" },
  "DIESEL_MODIFIED": { name: "Pro-Diesel Modified", color: "from-blue-500 to-indigo-600" },
  "STOCK": { name: "Stock 4x4", color: "from-emerald-500 to-teal-600" }
};

export default function VerifyPage({ params }) {
  const { carNumber } = use(params);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/teams")
      .then(res => res.json())
      .then(data => {
        const found = data.teams.find(t => t.car_number.toString() === carNumber);
        if (found) {
          setTeam(found);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [carNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Verifying Grid Status...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <Shield className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
          <h1 className="text-4xl font-heading text-white uppercase mb-4">Verification Failed</h1>
          <p className="text-zinc-500 mb-8 font-medium">No confirmed registration found for Car #{carNumber}. Please contact official TKO marshals.</p>
          <Link href="/" className="inline-flex h-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 px-8 text-sm font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
            Return to Base
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative flex items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-1/2 h-full bg-primary/5 blur-[150px] opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-1/2 h-full bg-red-500/5 blur-[150px] opacity-10" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-zinc-900/40 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] relative z-10 backdrop-blur-3xl"
      >
        {/* 1. TOP SUCCESS BANNER */}
        <div className="bg-green-500 p-8 flex flex-col items-center justify-center text-black relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/30" />
          <CheckCircle2 className="w-16 h-16 mb-4 drop-shadow-xl" />
          <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter uppercase leading-none text-center">
            Payment Approved
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-3 opacity-60">Identity & Funds Verified ✅</p>
        </div>

        {/* 2. COMPETITOR DATA */}
        <div className="p-8 md:p-12 space-y-10">
          
          {/* Main ID Block */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-white/5">
            <div className="text-center md:text-left">
               <p className="text-[10px] text-primary font-black uppercase tracking-[0.4em] mb-2">Team Contender</p>
               <h2 className="text-5xl font-heading text-white uppercase italic leading-none">{team.team_name}</h2>
            </div>
            <div className="w-32 h-32 bg-zinc-950 border-2 border-primary/20 rounded-full flex flex-col items-center justify-center shadow-2xl relative group">
               <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full" />
               <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Car No.</p>
               <p className="text-4xl font-heading text-primary font-black italic relative z-10">#{team.car_number}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             {/* Drivers */}
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <Users className="w-4 h-4 text-primary" />
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Personnel</p>
                </div>
                <div className="space-y-4">
                   <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Lead Pilot</p>
                      <p className="text-xl font-heading text-white uppercase italic">{team.driver_name}</p>
                      <Badge className="mt-2 bg-red-500/10 text-red-500 border-red-500/20 text-[9px] font-black uppercase">GRID CLASS {team.driver_blood_group}</Badge>
                   </div>
                   <div className="p-5 rounded-2xl bg-black/40 border border-white/5">
                      <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Co-Driver / Nav</p>
                      <p className="text-xl font-heading text-zinc-400 uppercase italic">{team.codriver_name || "N/A"}</p>
                   </div>
                </div>
             </div>

             {/* Vehicle */}
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <Zap className="w-4 h-4 text-primary" />
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Machine Profile</p>
                </div>
                <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 h-full flex flex-col justify-center">
                   <h3 className="text-3xl font-heading text-white uppercase italic">{team.vehicle_name}</h3>
                   <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-2 block opacity-80">{team.vehicle_model}</p>
                   <div className="mt-8 pt-6 border-t border-primary/10">
                      <p className="text-[9px] font-black text-primary/60 uppercase tracking-[0.3em] mb-1">Category</p>
                      <p className="text-white text-sm font-black uppercase">{CATEGORIES[team.category]?.name || team.category}</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Validation Footer */}
          <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10">
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Digital Onboarding Authenticated</span>
             </div>
             <p className="text-[8px] font-mono text-zinc-700 uppercase tracking-[0.4em]">REF: TKOR-SEC-{team.car_number}-APPROVED</p>
          </div>
        </div>

        {/* Global Footer Navigation */}
        <Link href="/" className="w-full flex items-center justify-center p-6 bg-white/5 border-t border-white/10 text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 hover:text-white hover:bg-white/10 transition-all gap-3 overflow-hidden">
           Return to Official Site <ChevronRight className="w-3 h-3" />
        </Link>
      </motion.div>
    </div>
  );
}
