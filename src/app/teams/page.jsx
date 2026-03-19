"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Trophy, X, ShieldCheck, Instagram, Zap, Shield, ExternalLink } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { CATEGORIES } from "@/config/pricing";

const CATEGORY_STYLES = {
  "DIESEL_MODIFIED": "from-blue-500 to-indigo-600",
  "PETROL_MODIFIED": "from-orange-500 to-red-600",
  "DIESEL_EXPERT": "from-cyan-500 to-blue-600",
  "PETROL_EXPERT": "from-yellow-500 to-orange-600",
  "THAR_SUV": "from-red-600 to-black",
  "SUV_MODIFIED": "from-zinc-600 to-zinc-900",
  "JIMNY_SUV": "from-green-500 to-green-700",
  "STOCK_NDMS": "from-emerald-500 to-teal-600",
  "EXTREME": "from-purple-600 to-red-600",
  "LADIES": "from-pink-500 to-rose-600"
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
    { car_number: 99, team_name: "Mud Raiders", driver_name: "Amit Patil", codriver_name: "Sagar Shinde", category: "STOCK_NDMS", vehicle_name: "Force Gurkha", vehicle_model: "5-Door 2024", driver_blood_group: "O-", codriver_blood_group: "O+", socials: "@mudraiders" },
    { car_number: 1, team_name: "Apex Raptors", driver_name: "Suresh Gupta", codriver_name: "Sameer Khan", category: "EXTREME", vehicle_name: "Custom Monster", vehicle_model: "2024 Build", driver_blood_group: "A+", codriver_blood_group: "B+", socials: "@apexraptors" },
  ];

  useEffect(() => {
    fetch("/api/teams")
      .then(res => res.json())
      .then(data => {
        setTeams(data.teams || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setTeams([]);
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
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[50%] h-[50vh] bg-mesh-amber opacity-5 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-6"
          >
            <Zap className="w-3 h-3" /> Team Karad Off-Roaders Official
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-heading text-white tracking-tighter uppercase mb-4 leading-none">
            THE <span className="text-primary italic">LINEUP</span>
          </h1>
          <p className="text-sm md:text-2xl text-zinc-300 mb-10 max-w-2xl mx-auto font-sans leading-relaxed">
            Join 160+ professional drivers and co-drivers in our elite Season 2 championship. Register now to claim your legendary sticker number.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-12 bg-zinc-900/40 p-3 rounded-2xl border border-white/5 backdrop-blur-md">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <Input 
              placeholder="Search driver or sticker #..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 bg-black/50 border-white/5 focus:border-primary/50 transition-all rounded-xl text-lg"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {["ALL", ...Object.keys(CATEGORIES)].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-4 md:px-6 h-12 md:h-14 rounded-xl font-bold uppercase tracking-widest text-[9px] md:text-[10px] transition-all border whitespace-nowrap",
                  category === cat 
                    ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] z-10 scale-110" 
                    : "bg-white/5 text-zinc-500 border-white/5 hover:bg-white/10"
                )}
              >
                {cat === "ALL" ? "ALL CLASSES" : (CATEGORIES[cat]?.name || cat)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTeams.map((team, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={team.car_number}
              onClick={() => setSelectedTeam(team)}
              className="group cursor-pointer"
            >
              <div className="relative bg-zinc-950 border border-white/10 rounded-[2rem] p-0 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(255,165,0,0.15)] hover:border-primary/40 flex h-64">
                <div className="hidden sm:flex w-12 bg-zinc-900 border-r border-white/5 flex-col items-center justify-between py-6 opacity-40 group-hover:opacity-100 transition-opacity">
                   <div className="rotate-[-90deg] whitespace-nowrap text-[7px] font-black tracking-[0.4em] text-zinc-600 uppercase">
                     TK-S2-GRID-ACCESS
                   </div>
                   <ShieldCheck className="w-4 h-4 text-primary" />
                </div>

                <div className="flex-1 p-6 md:p-8 relative flex flex-col justify-between">
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
                      <span className="text-3xl font-heading font-black tracking-tighter italic">S{team.car_number}</span>
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

        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mt-16 max-w-2xl mx-auto"
        >
          <a 
            href="https://www.instagram.com/teamkaradoffroaders/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group block relative p-[1px] rounded-[1.5rem] bg-zinc-900 border border-white/5 overflow-hidden hover:border-primary/20 transition-all active:scale-[0.98]"
          >
            <div className="relative z-10 p-5 md:p-6 flex items-center justify-between gap-6">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-2xl p-0.5 shadow-xl group-hover:rotate-6 transition-transform">
                     <div className="bg-black w-full h-full rounded-[0.9rem] flex items-center justify-center">
                        <Instagram className="w-7 h-7 text-white" />
                     </div>
                  </div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-heading text-white uppercase italic leading-none mb-2">
                       Join the <span className="text-primary">5,000+</span>
                    </h4>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">
                       OFFICIAL COMMUNITY
                    </p>
                  </div>
               </div>
               <div className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black rounded-xl font-black uppercase tracking-widest text-[10px] group-hover:bg-white transition-colors">
                  Open <ExternalLink className="w-3 h-3" />
               </div>
            </div>
          </a>
        </motion.div>

        <AnimatePresence>
          {selectedTeam && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl overflow-hidden p-4 md:p-10">
              <div className="absolute inset-0 z-0" onClick={() => setSelectedTeam(null)} />
              
              {/* DESKTOP PASS: Standard Grid View */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="hidden md:flex w-full max-w-4xl bg-zinc-900/40 border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10 flex-col md:flex-row backdrop-blur-[40px] max-h-[90vh] overflow-y-auto"
              >
                <div className="w-full md:w-[320px] lg:w-[380px] bg-zinc-950 p-10 flex flex-col justify-between relative border-r border-white/5 shrink-0">
                   <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
                   <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-8">
                        <img src="/logo.png" className="w-10 h-10 object-contain" alt="TKO" />
                        <div>
                           <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] leading-none">Global Event</p>
                           <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1 italic leading-none">Season 2 Edition</p>
                        </div>
                      </div>
                      <div className="relative flex flex-col py-2">
                        <span className="text-[12px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-1 italic">Competing As</span>
                        <h2 className="text-4xl lg:text-5xl font-heading text-white font-black leading-tight break-words uppercase italic tracking-tighter drop-shadow-2xl">
                           {selectedTeam.team_name || "PRO RIVAL"}
                        </h2>
                      </div>
                   </div>
                    <div className="relative z-10 mt-10">
                       <h3 className="text-8xl lg:text-[10rem] font-heading text-white font-black leading-none tracking-tighter relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                          #{selectedTeam.car_number}
                       </h3>
                       <Badge className="mt-6 bg-zinc-800/80 text-zinc-300 border-white/10 py-1.5 px-4 rounded-xl text-[10px] uppercase font-bold tracking-widest">
                         {CATEGORIES[selectedTeam.category]?.name || "Elite Division"}
                       </Badge>
                    </div>
                </div>

                <div className="flex-1 p-10 lg:p-14 relative flex flex-col min-w-0 bg-transparent">
                   <div className="grid grid-cols-1 gap-12 relative z-10">
                      <div className="space-y-8">
                          <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-white/10" />
                            <p className="text-[8px] font-black text-primary/60 uppercase tracking-[0.5em]">Crew Information</p>
                            <div className="h-px flex-1 bg-white/10" />
                          </div>
                           <div className="grid grid-cols-2 gap-10">
                              <div className="space-y-2">
                                 <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Driver</p>
                                 <p className="text-2xl font-heading text-white uppercase italic leading-none truncate">{selectedTeam.driver_name}</p>
                                 <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-3">{selectedTeam.driver_blood_group}</p>
                              </div>
                              <div className="space-y-2">
                                 <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Co-Driver</p>
                                 <p className="text-2xl font-heading text-zinc-500 uppercase italic leading-none truncate">{selectedTeam.codriver_name || "---"}</p>
                                 <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-3">{selectedTeam.codriver_blood_group}</p>
                              </div>
                           </div>
                      </div>

                      <div className="space-y-8">
                          <div className="flex items-center gap-4">
                             <div className="h-px flex-1 bg-white/10" />
                             <p className="text-[8px] font-black text-primary/60 uppercase tracking-[0.5em]">Technical Spec</p>
                             <div className="h-px flex-1 bg-white/10" />
                          </div>
                          <div className="flex items-center justify-between bg-white/5 border border-white/5 p-6 rounded-2xl group transition-all hover:bg-white/10 gap-6">
                             <div className="flex items-center gap-6 min-w-0 flex-1">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                   <Zap className="w-6 h-6 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                   <h4 className="text-2xl font-heading text-white uppercase m-0 leading-none truncate">{selectedTeam.vehicle_name}</h4>
                                   <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2 italic truncate">{selectedTeam.vehicle_model}</p>
                                </div>
                             </div>
                             <div className="text-right shrink-0">
                                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest italic">Configuration</p>
                                <p className="text-white font-heading text-lg lowercase italic leading-none mt-1">Ready_Stage_01</p>
                             </div>
                          </div>
                      </div>

                      <div className="pt-8 border-t border-white/10 flex items-center justify-between gap-10">
                         <div className="flex items-center gap-8">
                            <div className="bg-white p-2 rounded-xl shrink-0 shadow-2xl">
                               <QRCodeSVG value={`verify:${selectedTeam.car_number}`} size={80} level="H" />
                            </div>
                            <div>
                               <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2 leading-none italic">Authentication Node</p>
                               <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                  <span className="text-white font-heading text-base uppercase tracking-[0.2em] leading-none">GRID STATUS: ACTIVE</span>
                               </div>
                               <p className="text-[8px] text-zinc-700 font-mono mt-3 uppercase tracking-tighter">SECURELY GENERATED BY RACE CONTROL SYSTEM v1.0.1</p>
                            </div>
                         </div>
                         {selectedTeam.socials && (
                            <div className="flex flex-col items-end">
                               <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest mb-2 italic">Global Frequency</p>
                               <p className="text-primary font-heading text-2xl italic tracking-tight truncate leading-none">{selectedTeam.socials}</p>
                               <div className="flex gap-1 h-4 mt-3 opacity-20">
                                  {[0.3, 0.8, 0.4, 0.9, 0.5, 0.2, 0.7, 0.4].map((h, i) => (
                                     <div key={i} className="w-1 bg-white/40" style={{ height: `${h * 100}%` }} />
                                  ))}
                               </div>
                            </div>
                         )}
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => setSelectedTeam(null)}
                  className="absolute top-8 right-8 z-[100] p-3 rounded-full bg-white/5 border border-white/5 hover:bg-red-500/20 transition-all group"
                >
                  <X className="w-6 h-6 text-white/40 group-hover:text-white" />
                </button>
              </motion.div>

              {/* MOBILE PASS: Pure Digital Badge Design (Only on Mobile) */}
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.9 }}
                className="md:hidden flex flex-col w-full max-w-sm bg-black border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,1)] relative z-10"
              >
                {/* Header Strip */}
                <div className="bg-primary p-3 flex justify-center items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-black animate-ping" />
                   <span className="text-[10px] font-black text-black uppercase tracking-[0.5em]">Official Grid Access - Active</span>
                </div>

                <div className="p-8 pb-4 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12">
                      <Trophy className="w-64 h-64 text-white" />
                   </div>
                   
                   <div className="relative z-10 flex flex-col items-center text-center">
                      <img src="/logo.png" className="w-16 h-16 object-contain mb-6 drop-shadow-[0_0_20px_rgba(255,165,0,0.4)]" alt="TKO" />
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1 italic">S1 COMPETITOR</p>
                      <h2 className="text-3xl font-heading text-white uppercase italic tracking-tighter leading-none mb-6">
                         {selectedTeam.team_name || "PRO RIVAL"}
                      </h2>
                      
                      <div className="relative">
                         <h3 className="text-9xl font-heading text-white font-black leading-none tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                            #{selectedTeam.car_number}
                         </h3>
                         <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-zinc-800 text-primary border-primary/20 py-1 px-4 rounded-xl text-[8px] uppercase font-black tracking-widest shadow-xl whitespace-nowrap">
                            {CATEGORIES[selectedTeam.category]?.name || "Elite Division"}
                         </Badge>
                      </div>
                   </div>
                </div>

                {/* Perforated Divider */}
                <div className="flex items-center px-4 py-8 overflow-hidden">
                   <div className="w-10 h-10 bg-black/90 border border-white/10 rounded-full -ml-9 shadow-inner" />
                   <div className="flex-1 h-px border-t border-dashed border-white/20 mx-2" />
                   <div className="w-10 h-10 bg-black/90 border border-white/10 rounded-full -mr-9 shadow-inner" />
                </div>

                <div className="px-8 pb-10 space-y-8 relative z-10">
                   <div className="grid grid-cols-2 gap-4 bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5">
                      <div className="text-center md:text-left">
                         <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Driver</p>
                         <p className="text-sm font-heading text-white uppercase truncate">{selectedTeam.driver_name}</p>
                         <p className="text-[10px] font-black text-red-500 uppercase mt-1">{selectedTeam.driver_blood_group}</p>
                      </div>
                      <div className="text-center md:text-left">
                         <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Class</p>
                         <p className="text-sm font-heading text-zinc-400 uppercase truncate">{selectedTeam.category?.replace(/_/g, " ")}</p>
                         <p className="text-[10px] font-black text-primary uppercase mt-1">S1_GRID</p>
                      </div>
                   </div>

                   <div className="flex flex-col items-center gap-6">
                      <div className="bg-white p-3 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                         <QRCodeSVG value={`verify:${selectedTeam.car_number}`} size={120} level="H" />
                      </div>
                      <div className="text-center">
                         <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2 leading-none italic animate-pulse">Scan at Grid Checkpoint</p>
                         <p className="text-zinc-800 font-mono text-[8px] uppercase tracking-tighter">AUTHENTICATION_ACTIVE_SYSTEM_UP_01</p>
                      </div>
                   </div>

                   <button 
                     onClick={() => setSelectedTeam(null)}
                     className="w-full py-5 bg-white/5 border border-white/5 rounded-2xl text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all active:scale-95"
                   >
                     CLOSE grid pass
                   </button>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/20 rounded-tl-[3rem]" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/20 rounded-tr-[3rem]" />
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
