"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Trophy, Users, X, Info, ShieldCheck, Instagram, Zap } from "lucide-react";
import Link from "next/link";

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

        {/* ULTRA-PREMIUM LAVISH MODAL */}
        <AnimatePresence>
          {selectedTeam && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/98 backdrop-blur-2xl px-4 py-8 overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 100, rotateX: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                className="w-full max-w-5xl bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_120px_rgba(255,165,0,0.2)] relative perspective-2000 flex flex-col lg:flex-row min-h-[600px]"
              >
                {/* 1. Technical Sidebar */}
                <div className="lg:w-20 bg-zinc-900 border-r border-white/5 flex lg:flex-col items-center justify-between py-8 px-4 relative order-2 lg:order-1">
                   <div className="hidden lg:block rotate-[-90deg] whitespace-nowrap text-[10px] font-black tracking-[1em] text-zinc-700 uppercase origin-center translate-y-24">
                     OFFICIAL COMPETITOR DATA • REF-2026-X
                   </div>
                   <ShieldCheck className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(255,165,0,0.3)] mb-4 lg:mb-0" />
                   <div className="flex lg:flex-col gap-6 items-center">
                      <div className="text-[10px] font-bold text-zinc-600 [writing-mode:vertical-lr] items-center gap-2 hidden lg:flex">
                         <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> SYSTEM ACTIVE
                      </div>
                   </div>
                </div>

                {/* 2. Visual Pass Identification */}
                <div className="lg:w-[420px] bg-black p-12 flex flex-col justify-between border-r border-white/5 relative overflow-hidden order-1 lg:order-2">
                   <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                   
                   <div>
                     <Badge className="bg-primary/20 text-primary border-primary/40 py-2 px-6 rounded-xl text-[10px] uppercase font-black tracking-[0.4em] mb-12 shadow-[0_0_20px_rgba(255,165,0,0.1)]">
                       {CATEGORIES[selectedTeam.category]?.name || selectedTeam.category}
                     </Badge>
                     
                     <div className="relative group perspective-1000">
                       <div className="absolute -inset-10 bg-primary/20 blur-[80px] rounded-full opacity-40 group-hover:opacity-100 transition-opacity duration-1000" />
                       <div className="w-56 h-56 bg-zinc-950 border-[4px] border-white/10 text-white rounded-[3rem] flex items-center justify-center -rotate-2 shadow-2xl relative group-hover:rotate-0 group-hover:border-primary/60 transition-all duration-700 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                          <span className="text-9xl font-heading font-black tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">#{selectedTeam.car_number}</span>
                       </div>
                     </div>
                   </div>

                   <div className="mt-16 space-y-10">
                     <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                           <p className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.5em] mb-2">Security ID</p>
                           <p className="text-zinc-500 font-mono text-xs">TKO-SEC-2026-{selectedTeam.car_number}-V4</p>
                        </div>
                     </div>
                     <div className="flex gap-2 h-10 opacity-30">
                        {[0.4, 0.7, 0.2, 0.9, 0.5, 0.8, 0.3, 0.6, 0.4, 0.9, 0.7, 0.2, 0.5, 0.8, 0.3, 0.6, 0.5, 0.8, 0.3, 0.6, 0.4, 0.9, 0.7, 0.2].map((h, i) => (
                           <div key={i} className="flex-1 bg-white" style={{ height: `${h * 100}%` }} />
                        ))}
                     </div>
                   </div>
                </div>

                {/* 3. High-Definition Profile Data */}
                <div className="flex-1 p-12 lg:p-20 bg-zinc-950 relative overflow-hidden order-3">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                    <Trophy className="w-80 h-80 text-white scale-150" />
                  </div>
                  
                  <button 
                    onClick={() => setSelectedTeam(null)}
                    className="absolute top-10 right-10 z-50 text-white/20 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-2xl transition-all border border-white/5"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <div className="mb-20">
                    <div className="flex items-center gap-4 mb-4">
                       <p className="text-primary text-[11px] font-black uppercase tracking-[0.6em] leading-none">Global Ranking Entrant</p>
                       <div className="h-px flex-1 bg-white/5" />
                    </div>
                    <h2 className="text-7xl lg:text-8xl font-heading text-white tracking-widest uppercase leading-none break-words">
                      {selectedTeam.team_name || "STORM RIDER"}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                    {/* Primary Pilot */}
                    <div className="space-y-3 p-8 rounded-[2rem] bg-black/50 border border-white/5 hover:border-primary/20 transition-all group">
                       <p className="text-zinc-700 text-[10px] uppercase font-black tracking-[0.4em]">Lead Pilot</p>
                       <h3 className="text-4xl font-heading text-white uppercase italic group-hover:text-primary transition-colors">{selectedTeam.driver_name}</h3>
                       <div className="flex items-center gap-4 pt-4 border-t border-white/5 mt-4">
                          <div className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-1.5 rounded-lg text-xs font-black">
                            CLASS: {selectedTeam.driver_blood_group}
                          </div>
                          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Medical Clearance: OK</p>
                       </div>
                    </div>

                    {/* Co-Pilot */}
                    <div className="space-y-3 p-8 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all">
                       <p className="text-zinc-700 text-[10px] uppercase font-black tracking-[0.4em]">Navigator</p>
                       <h3 className="text-4xl font-heading text-zinc-400 uppercase italic leading-none">{selectedTeam.codriver_name}</h3>
                       <div className="flex items-center gap-4 pt-4 border-t border-white/5 mt-4">
                          <div className="bg-zinc-800 text-zinc-500 border border-white/5 px-4 py-1.5 rounded-lg text-xs font-black">
                            CLASS: {selectedTeam.codriver_blood_group}
                          </div>
                       </div>
                    </div>

                    {/* The Machine */}
                    <div className="md:col-span-2 p-8 rounded-[2rem] bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 relative group overflow-hidden">
                       <div className="absolute right-0 bottom-0 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                         < Zap className="w-48 h-48 text-primary" />
                       </div>
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                          <div>
                            <p className="text-primary/60 text-[10px] uppercase font-black tracking-[0.4em] mb-3">Mechanical Spec</p>
                            <h3 className="text-5xl font-heading text-white uppercase leading-none">{selectedTeam.vehicle_name}</h3>
                            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-3 italic">{selectedTeam.vehicle_model}</p>
                          </div>
                          <div className="flex flex-col items-end">
                             <div className="bg-primary/10 border border-primary/30 px-8 py-4 rounded-2xl text-primary font-black text-xs tracking-[0.3em] uppercase">
                               READY FOR ACTION
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  {selectedTeam.socials && (
                    <div className="mt-16 flex items-center gap-8 p-1 rounded-full bg-zinc-900/50 border border-white/5 w-fit pr-10">
                       <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(255,165,0,0.4)]">
                          <Instagram className="w-7 h-7 text-black" />
                       </div>
                       <div>
                         <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em] mb-1">Pulse Connection</p>
                         <p className="text-white font-heading text-3xl italic tracking-tight">{selectedTeam.socials}</p>
                       </div>
                    </div>
                  )}
                </div>
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
