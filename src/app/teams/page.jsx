"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Trophy, Users, X, Info, ShieldCheck, Instagram, Zap, Shield } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

const CATEGORIES = {
  "PETROL_MODIFIED": { name: "Pro-Petrol Modified", color: "from-orange-500 to-red-600" },
  "DIESEL_MODIFIED": { name: "Pro-Diesel Modified", color: "from-blue-500 to-indigo-600" },
  "STOCK": { name: "Stock 4x4", color: "from-emerald-500 to-teal-600" }
};

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [selectedTeam, setSelectedTeam] = useState(null);

  const DEMO_TEAMS = [
    { car_number: 7, team_name: "Sahyadri Warriors", driver_name: "Mandar Karad", codriver_name: "Akshay Patil", category: "DIESEL_MODIFIED", vehicle_name: "Mahindra Thar", vehicle_model: "CRDe 2024", driver_blood_group: "O+", codriver_blood_group: "A+", socials: "@mandarkarad" },
    { car_number: 24, team_name: "Thunder Bolts", driver_name: "Rohan Deshmukh", codriver_name: "Vikram Jadhav", category: "PETROL_MODIFIED", vehicle_name: "Maruti Gypsy", vehicle_model: "King 1.3", driver_blood_group: "B+", codriver_blood_group: "AB+", socials: "@thunderracing" },
    { car_number: 99, team_name: "Mud Raiders", driver_name: "Amit Patil", codriver_name: "Sagar Shinde", category: "STOCK", vehicle_name: "Force Gurkha", vehicle_model: "5-Door 2024", driver_blood_group: "O-", codriver_blood_group: "O+", socials: "@mudraiders" },
    { car_number: 101, team_name: "Desert Rats", driver_name: "Suresh Gupta", codriver_name: "Sameer Khan", category: "PETROL_MODIFIED", vehicle_name: "Suzuki Jimny", vehicle_model: "Alpha 2024", driver_blood_group: "A+", codriver_blood_group: "B+", socials: "@desertrats4x4" },
  ];

  useEffect(() => {
    fetch("/api/teams")
      .then(res => res.json())
      .then(data => {
        if (data.teams && data.teams.length > 0) {
          setTeams(data.teams);
        } else {
          setTeams(DEMO_TEAMS);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setTeams(DEMO_TEAMS);
        setLoading(false);
      });
  }, []);

  const filteredTeams = teams.filter(team => {
    const matchesSearch = 
      team.team_name?.toLowerCase().includes(search.toLowerCase()) ||
      team.driver_name?.toLowerCase().includes(search.toLowerCase()) ||
      team.car_number?.toString().includes(search);
    
    const matchesCategory = category === "ALL" || team.category === category;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-1/2 h-full bg-primary/5 blur-[150px] opacity-20" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-6"
          >
            <Zap className="w-3 h-3" /> TKO Motorsports Official
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-heading text-white tracking-tighter uppercase mb-4 leading-none">
            THE <span className="text-primary italic">LINEUP</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg font-medium">
            The elite roster of off-road warriors ready to dominate the terrain of Karad.
          </p>
        </div>

        {/* Professional Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 bg-zinc-900/40 p-3 rounded-2xl border border-white/5 backdrop-blur-md">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <Input 
              placeholder="Search driver or car #..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 bg-black/50 border-white/5 focus:border-primary/50 transition-all rounded-xl text-lg"
            />
          </div>
          <div className="flex gap-2">
            {["ALL", "PETROL_MODIFIED", "DIESEL_MODIFIED", "STOCK"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-6 h-14 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all border",
                  category === cat 
                    ? "bg-primary text-black border-primary" 
                    : "bg-white/5 text-zinc-500 border-white/5 hover:bg-white/10"
                )}
              >
                {cat === "ALL" ? "ALL CLASSES" : (CATEGORIES[cat]?.name || cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTeams.map((team, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={team.car_number}
              onClick={() => setSelectedTeam(team)}
              className="group cursor-pointer perspective-1000"
            >
              <div 
                style={{ transformStyle: 'preserve-3d' }}
                className="relative bg-zinc-950 border border-white/10 rounded-[2rem] p-0 overflow-hidden transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-[0_20px_60px_rgba(255,165,0,0.15)] group-hover:border-primary/40 flex h-64"
              >
                {/* Elite Technical Sidebar Motif on Card */}
                <div className="w-12 bg-zinc-900 border-r border-white/5 flex flex-col items-center justify-between py-6 opacity-40 group-hover:opacity-100 transition-opacity">
                   <div className="rotate-[-90deg] whitespace-nowrap text-[7px] font-black tracking-[0.4em] text-zinc-600 uppercase">
                     TK-2026-GRID-ACCESS
                   </div>
                   <ShieldCheck className="w-4 h-4 text-primary" />
                </div>

                <div className="flex-1 p-8 relative flex flex-col justify-between">
                  {/* Mesh Background on Card */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none bg-mesh-amber" />
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-5 transition-all">
                    <Trophy className="w-32 h-32 text-white" />
                  </div>
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] font-black tracking-[0.4em] text-primary uppercase leading-none">Vessel Class</p>
                      <p className="text-white text-xs font-bold uppercase tracking-widest opacity-80">{CATEGORIES[team.category]?.name || "COMPETITOR"}</p>
                    </div>
                    <div className="w-16 h-16 bg-black border border-white/10 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:border-primary/60 transition-all duration-500">
                      <span className="text-3xl font-heading font-black tracking-tighter italic">#{team.car_number}</span>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-2">
                    <h3 className="text-3xl font-heading text-white uppercase italic tracking-wide group-hover:text-primary transition-colors leading-none">
                      {team.team_name || "STORM RIDER"}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{team.driver_name}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-zinc-600 relative z-10">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] group-hover:text-zinc-400">View Grid Pass</p>
                    <div className="flex gap-1 h-3 opacity-20 group-hover:opacity-50 transition-opacity">
                       {[0.3, 0.5, 0.2, 0.8, 0.4, 0.6, 0.3, 0.7].map((h, i) => (
                          <div key={i} className="w-px bg-white" style={{ height: `${h * 100}%` }} />
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* THE ULTIMATE "ULTIME" ELITE PASS - WORLD CLASS DESIGN */}
        <AnimatePresence>
          {selectedTeam && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md overflow-y-auto p-4 md:p-8">
              {/* Cinematic Backdrop Closer */}
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-transparent to-red-500/10" onClick={() => setSelectedTeam(null)} />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotateX: 20, y: 50 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateX: -20, y: 30 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="w-full max-w-4xl bg-zinc-900/40 border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10 flex flex-col md:flex-row backdrop-blur-[40px] perspective-1000"
              >
                {/* Visual Glow Orbs (Inside Card) */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[100px] pointer-events-none" />
                
                {/* 1. The Visual ID Section (Large Left Side) */}
                <div className="w-full md:w-[400px] bg-black/40 p-12 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-white/5">
                   <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
                   
                   <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-8">
                        <img src="/logo.png" className="w-12 h-12 object-contain" alt="TKO" />
                        <div>
                           <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] leading-none">Global Event</p>
                           <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-1 italic">Season 2026</p>
                        </div>
                      </div>
                      
                      <div className="relative flex flex-col">
                        <span className="text-[12px] font-black text-zinc-600 uppercase tracking-[0.6em] mb-2">Competing As</span>
                        <h2 className="text-5xl md:text-6xl font-heading text-white font-black leading-none break-words uppercase italic tracking-tighter shadow-primary/20 drop-shadow-2xl">
                           {selectedTeam.team_name || "PRO RIVAL"}
                        </h2>
                      </div>
                   </div>

                   <div className="relative z-10 mt-12 md:mt-0">
                      <div className="flex items-center gap-6">
                         <div className="relative group">
                            <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                            <h3 className="text-9xl font-heading text-white font-black leading-none tracking-tighter relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                               #{selectedTeam.car_number}
                            </h3>
                         </div>
                      </div>
                      <Badge className="mt-8 bg-zinc-800/80 text-zinc-300 border-white/10 py-1.5 px-6 rounded-xl text-[10px] uppercase font-bold tracking-widest">
                        {CATEGORIES[selectedTeam.category]?.name || "Elite Division"}
                      </Badge>
                   </div>
                </div>

                {/* 2. The Data Sheet (Right Side) */}
                <div className="flex-1 p-12 md:p-16 relative flex flex-col">
                   {/* Technical Scanlines */}
                   <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                   
                   <div className="grid grid-cols-1 gap-12 relative z-10">
                      {/* Driver Info */}
                      <div className="space-y-6">
                         <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-white/10" />
                            <p className="text-[9px] font-black text-primary/60 uppercase tracking-[0.5em]">Command Center</p>
                            <div className="h-px flex-1 bg-white/10" />
                         </div>
                         
                         <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-1">
                               <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Lead Driver</p>
                               <p className="text-3xl font-heading text-white uppercase italic leading-none">{selectedTeam.driver_name}</p>
                               <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-2">{selectedTeam.driver_blood_group} POSITIVE</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Navigator</p>
                               <p className="text-3xl font-heading text-zinc-500 uppercase italic leading-none">{selectedTeam.codriver_name || "---"}</p>
                            </div>
                         </div>
                      </div>

                      {/* Machine Stats */}
                      <div className="space-y-6">
                         <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-white/10" />
                            <p className="text-[9px] font-black text-primary/60 uppercase tracking-[0.5em]">Technical Spec</p>
                            <div className="h-px flex-1 bg-white/10" />
                         </div>
                         
                         <div className="flex items-center justify-between bg-white/5 border border-white/5 p-6 rounded-[2.5rem] group hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-6">
                               <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                  <Zap className="w-7 h-7 text-primary" />
                               </div>
                               <div>
                                  <h4 className="text-3xl font-heading text-white uppercase m-0 leading-none">{selectedTeam.vehicle_name}</h4>
                                  <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-2 italic">{selectedTeam.vehicle_model}</p>
                               </div>
                            </div>
                            <Shield className="w-8 h-8 text-zinc-800 group-hover:text-primary/40 transition-colors" />
                         </div>
                      </div>

                   {/* Verification QR - Links to Official Page */}
                   <div className="pt-8 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-8">
                         <div className="bg-white p-3 rounded-2xl shadow-xl shadow-black/50 border border-black group cursor-none">
                            <QRCodeSVG 
                               value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${selectedTeam.car_number}`}
                               size={90} 
                               level="H" 
                            />
                         </div>
                         <div>
                            <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Marshal Check-in</p>
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" />
                               <span className="text-white font-heading text-xl uppercase tracking-widest">Scan to Verify</span>
                            </div>
                         </div>
                      </div>
                         {selectedTeam.socials && (
                            <div className="flex flex-col items-end">
                               <p className="text-zinc-700 text-[9px] font-black uppercase tracking-widest mb-1">Connect</p>
                               <p className="text-primary font-heading text-xl italic tracking-tight">{selectedTeam.socials}</p>
                            </div>
                         )}
                      </div>
                   </div>
                </div>

                {/* The "Elite" Close Overlay */}
                <button 
                  onClick={() => setSelectedTeam(null)}
                  className="absolute top-8 right-8 z-[100] group"
                >
                  <div className="p-4 rounded-full bg-white/5 border border-white/5 hover:bg-red-500/20 hover:border-red-500/40 transition-all">
                    <X className="w-6 h-6 text-white/40 group-hover:text-white" />
                  </div>
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
