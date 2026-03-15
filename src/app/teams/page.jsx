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

        {/* ULTIMATE ELITE ON-TRACK IDENTIFICATION */}
        <AnimatePresence>
          {selectedTeam && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-[20px] overflow-y-auto p-4 md:p-8">
              {/* Ultra-smooth backdrop closer */}
              <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,165,0,0.1),transparent_70%)]" onClick={() => setSelectedTeam(null)} />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 40, rotateY: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20, rotateY: 10 }}
                className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_150px_rgba(0,0,0,1)] relative z-10 flex flex-col perspective-1000"
              >
                {/* 1. Header: The ID Lanyard Top */}
                <div className="bg-primary p-6 flex flex-col items-center justify-center relative overflow-hidden text-black border-b-[8px] border-black/20">
                   <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                   <div className="absolute top-0 left-0 w-full h-1 bg-white/30" />
                   
                   <div className="w-full flex justify-between items-center relative z-10 mb-4 px-2">
                      <Shield className="w-5 h-5 opacity-40" />
                      <div className="text-center font-black uppercase tracking-[0.4em] text-[8px]">Official Track Pass</div>
                      <Shield className="w-5 h-5 opacity-40" />
                   </div>

                   <h2 className="text-6xl font-heading font-black tracking-tighter leading-none mb-1 drop-shadow-xl relative z-10">
                     #{selectedTeam.car_number}
                   </h2>
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-60 relative z-10">Sequence 2026-TKO</p>
                </div>

                {/* 2. The Main Body: Technical Display */}
                <div className="p-8 md:p-10 space-y-8 relative bg-zinc-950">
                   <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                   
                   {/* QR Code Section: The Core Onboarding Feature */}
                   <div className="relative group mx-auto w-fit">
                      <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="p-4 bg-white rounded-3xl relative shadow-[0_0_40px_rgba(255,255,255,0.05)] border-4 border-zinc-900 group-hover:border-primary/50 transition-all">
                        <QRCodeSVG 
                          value={JSON.stringify({
                            id: selectedTeam.id || selectedTeam.car_number,
                            team: selectedTeam.team_name,
                            driver: selectedTeam.driver_name,
                            verified: true
                          })}
                          size={140}
                          level="H"
                          includeMargin={false}
                          fgColor="#000000"
                        />
                      </div>
                      <div className="mt-4 text-center">
                         <p className="text-primary text-[8px] font-black uppercase tracking-[0.5em] animate-pulse">Scan to Verify Status</p>
                      </div>
                   </div>

                   {/* Team & Driver Block */}
                   <div className="text-center space-y-2 pt-4 border-t border-white/5">
                      <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.4em]">Competitor Title</p>
                      <h3 className="text-4xl font-heading text-white uppercase italic tracking-tighter leading-none">
                        {selectedTeam.team_name || "PHANTOM UNIT"}
                      </h3>
                      <div className="inline-block px-3 py-1 bg-zinc-900 border border-white/10 rounded-lg text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-2">
                        {CATEGORIES[selectedTeam.category]?.name || selectedTeam.category}
                      </div>
                   </div>

                   {/* Technical Grid (Two Columns) */}
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-1">
                         <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest leading-none">Command Pilot</p>
                         <p className="text-lg font-heading text-white uppercase truncate">{selectedTeam.driver_name}</p>
                         <p className="text-[9px] font-bold text-red-500/60">BLOOD CLASS {selectedTeam.driver_blood_group}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-1">
                         <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest leading-none">Tactical Nav</p>
                         <p className="text-lg font-heading text-zinc-400 uppercase truncate">{selectedTeam.codriver_name || "---"}</p>
                      </div>
                   </div>

                   {/* Machine Identity */}
                   <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
                      <div className="flex items-center gap-4">
                         <Zap className="w-5 h-5 text-primary" />
                         <div>
                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest m-0 leading-none">The Machine</p>
                            <h4 className="text-lg font-heading text-white uppercase m-0">{selectedTeam.vehicle_name}</h4>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest m-0 leading-none">Hull ID</p>
                         <p className="text-[10px] text-zinc-500 font-bold m-0 uppercase italic">{selectedTeam.vehicle_model}</p>
                      </div>
                   </div>

                   {/* Validation Footer */}
                   <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                         <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Data Synced</span>
                      </div>
                      <img src="/logo.png" className="w-8 h-8 object-contain grayscale opacity-30" alt="TKO" />
                   </div>
                </div>

                {/* Close Button - Floats over the top */}
                <button 
                  onClick={() => setSelectedTeam(null)}
                  className="absolute top-6 right-6 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white/30 hover:text-white transition-all border border-white/5 backdrop-blur-md"
                >
                  <X className="w-5 h-5" />
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
