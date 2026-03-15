"use client";

import { motion } from "framer-motion";
import { use, useEffect, useState } from "react";
import { 
  ShieldCheck, 
  Zap, 
  Instagram, 
  ChevronRight, 
  CheckCircle2, 
  User, 
  Navigation, 
  CarFront, 
  Heart,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";

const CATEGORIES = {
  "PETROL_MODIFIED": { name: "Petrol Modified", color: "from-orange-500 to-red-600" },
  "DIESEL_MODIFIED": { name: "Diesel Modified", color: "from-blue-500 to-indigo-600" },
  "STOCK": { name: "Stock 4x4", color: "from-emerald-500 to-teal-600" }
};

export default function MobileVerifyPage({ params }) {
  // Safe param extraction for Next.js 15+
  const resolvedParams = use(params);
  const carNumber = resolvedParams?.carNumber;
  
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!carNumber) {
      setLoading(false);
      return;
    }

    fetch("/api/teams")
      .then(res => res.json())
      .then(data => {
        const found = data.teams?.find(t => t.car_number?.toString() === carNumber);
        if (found) {
          setTeam(found);
        } else {
          setError("No record found");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Network error");
        setLoading(false);
      });
  }, [carNumber]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
        <p className="text-primary font-black uppercase tracking-[0.4em] text-xs">Authenticating Ticket...</p>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8 text-center bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]">
        <div className="w-full max-w-sm space-y-6">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
             <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-heading text-white uppercase leading-none">Security Alert</h1>
          <p className="text-zinc-500 font-medium">This QR code does not match any confirmed entry. Please report to the marshal tower.</p>
          <Link href="/teams" className="block w-full py-4 bg-zinc-900 border border-white/5 rounded-2xl text-white font-black uppercase tracking-widest text-xs">
            Return to Lineup
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col font-sans selection:bg-primary selection:text-black">
      {/* 1. DYNAMIC STATUS HEADER */}
      {team.status === "CONFIRMED" ? (
         <div className="w-full bg-green-500 py-4 px-5 flex items-center justify-between sticky top-0 z-[100] shadow-lg border-b border-black/10">
            <div className="flex items-center gap-3">
               <CheckCircle2 className="w-6 h-6 text-black" />
               <h1 className="text-sm font-black text-black uppercase tracking-widest">Entry Approved</h1>
            </div>
            <div className="bg-black/10 px-4 py-1.5 rounded-xl border border-black/5">
               <span className="text-black font-black text-sm font-heading italic">#{team.car_number}</span>
            </div>
         </div>
      ) : (
         <div className="w-full bg-orange-500 py-4 px-5 flex items-center justify-between sticky top-0 z-[100] shadow-lg border-b border-black/10">
            <div className="flex items-center gap-3 text-black">
               <ShieldAlert className="w-6 h-6 animate-pulse" />
               <div className="flex flex-col">
                  <h1 className="text-sm font-black uppercase tracking-widest leading-none">Pending Verification</h1>
                  <p className="text-[8px] font-bold uppercase mt-1 opacity-60">Payment Not Authorized</p>
               </div>
            </div>
            <div className="bg-black/10 px-4 py-1.5 rounded-xl border border-black/5 text-black">
               <span className="font-black text-sm font-heading italic">#{team.car_number}</span>
            </div>
         </div>
      )}

      {/* 2. MOBILE CONTENT AREA */}
      <div className="flex-1 px-5 py-8 space-y-8 pb-32">
         
         {/* Team Branding */}
         <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
         >
            <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-2">Confirmed Contender</p>
            <h2 className="text-5xl font-heading text-white uppercase italic tracking-tighter leading-tight drop-shadow-2xl">
               {team.team_name}
            </h2>
            <div className="inline-block mt-4 px-4 py-1.5 bg-zinc-900 border border-white/10 rounded-full text-[10px] font-black text-zinc-400 uppercase tracking-widest">
               {CATEGORIES[team.category]?.name || "Elite Division"}
            </div>
         </motion.div>

         {/* Personnel Cards */}
         <div className="grid grid-cols-1 gap-4">
            <div className="bg-zinc-900/40 border border-white/5 p-5 rounded-[2rem] backdrop-blur-xl flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                     <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Driver</p>
                     <p className="text-xl font-heading text-white uppercase italic">{team.driver_name}</p>
                  </div>
               </div>
               <div className="text-right">
                  <Heart className="w-4 h-4 text-red-500 mx-auto mb-1 fill-red-500/20" />
                  <p className="text-lg font-heading text-red-500">{team.driver_blood_group}</p>
               </div>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 p-5 rounded-[2rem] backdrop-blur-xl flex items-center gap-4">
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-zinc-500" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Co-Driver</p>
                  <p className="text-xl font-heading text-zinc-400 uppercase italic leading-none">{team.codriver_name || "---"}</p>
               </div>
            </div>
         </div>

         {/* Machine Details */}
         <div className="bg-gradient-to-br from-zinc-900/40 to-black border border-white/5 p-6 rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <CarFront className="w-32 h-32" />
            </div>
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-5 h-5 text-primary" />
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Technical Configuration</p>
               </div>
               <h3 className="text-3xl font-heading text-white uppercase italic tracking-tight">{team.vehicle_name}</h3>
               <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm mt-1">{team.vehicle_model}</p>
            </div>
         </div>

         {/* IMPORTANT: TKO INSTAGRAM SECTION */}
         <div className="pt-4">
            <a 
               href="https://www.instagram.com/teamkaradoffroaders/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="group block bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-[2.5rem] shadow-[0_20px_40px_rgba(236,72,153,0.2)] active:scale-95 transition-transform"
            >
               <div className="bg-black/90 p-6 rounded-[2.4rem] h-full flex items-center justify-between">
                  <div className="flex items-center gap-5">
                     <div className="w-14 h-14 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-[1.5rem] flex items-center justify-center p-0.5">
                        <div className="bg-black w-full h-full rounded-[1.4rem] flex items-center justify-center">
                           <Instagram className="w-7 h-7 text-white" />
                        </div>
                     </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <p className="text-white font-black text-sm md:text-base leading-none">Team Karad Off-Roaders</p>
                           <div className="shrink-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center shadow-blue-500/50 shadow-lg">
                              <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                           </div>
                        </div>
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1.5">5,000+ member community</p>
                      </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
               </div>
            </a>
         </div>
      </div>

      {/* 4. FOOTER CONTROLS */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-[60]">
         <Link 
            href="/teams" 
            className="w-full h-16 bg-white border border-white rounded-[2rem] flex items-center justify-center gap-3 group active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
         >
            <span className="text-black font-black uppercase tracking-[0.3em] text-[11px]">Back to Lineup</span>
            <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
         </Link>
      </div>
    </div>
  );
}
