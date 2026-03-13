"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/config/pricing";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Trophy, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch("/api/teams");
        const data = await res.json();
        setTeams(data.teams || []);
      } catch (e) {
        console.error("Failed to fetch teams");
      } finally {
        setLoading(false);
      }
    }
    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(team => {
    const matchesCategory = tab === "ALL" || team.category === tab;
    const matchesSearch = team.driver_name.toLowerCase().includes(search.toLowerCase()) || 
                          team.codriver_name.toLowerCase().includes(search.toLowerCase()) ||
                          team.car_number.includes(search);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-heading text-white mb-2">
              REGISTERED <span className="text-primary italic">TEAMS</span>
            </h1>
            <p className="text-zinc-500">Official entry list for TKO Rally 2026</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input 
                placeholder="Search driver or car #..." 
                className="pl-10 bg-zinc-900 border-zinc-800 text-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={tab} onValueChange={setTab}>
              <SelectTrigger className="w-full sm:w-48 bg-zinc-900 border-zinc-800 text-white">
                <Filter className="w-4 h-4 mr-2 text-zinc-500" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                <SelectItem value="ALL">All Categories</SelectItem>
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <SelectItem key={key} value={key}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-zinc-500 font-heading tracking-widest uppercase">Syncing with race control...</p>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
            <Trophy className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-500 text-lg">No teams found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
              <Table>
                <TableHeader className="bg-zinc-800/50">
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-400 font-heading"># NO</TableHead>
                    <TableHead className="text-zinc-400 font-heading">DRIVER</TableHead>
                    <TableHead className="text-zinc-400 font-heading">CO-DRIVER</TableHead>
                    <TableHead className="text-zinc-400 font-heading">VEHICLE</TableHead>
                    <TableHead className="text-zinc-400 font-heading">CATEGORY</TableHead>
                    <TableHead className="text-zinc-400 font-heading text-right">ACTION</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeams.map((team, idx) => (
                    <TableRow key={idx} className="border-zinc-800 hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => setSelectedTeam(team)}>
                      <TableCell className="font-heading text-2xl text-primary font-bold pr-8">
                        {team.car_number}
                      </TableCell>
                      <TableCell className="text-white font-medium uppercase tracking-tight">
                        {team.driver_name}
                      </TableCell>
                      <TableCell className="text-zinc-400 uppercase text-sm">
                        {team.codriver_name}
                      </TableCell>
                      <TableCell className="text-zinc-300 italic font-sans text-sm">
                        {team.vehicle_name} <span className="text-zinc-600 text-[10px] block not-italic uppercase tracking-widest">{team.vehicle_model}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-400 uppercase bg-zinc-800/50">
                          {CATEGORIES[team.category]?.name || team.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-white hover:bg-primary/20 bg-primary/5 border border-primary/20 uppercase text-[10px] font-bold tracking-widest px-4">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        {/* Super Professional Lavish Team Details Modal */}
        {selectedTeam && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/98 backdrop-blur-xl animate-in fade-in duration-500">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              className="w-full max-w-4xl bg-black border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(255,165,0,0.12)] relative perspective-1000 flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[800px]"
            >
              {/* Vertical Sidebar - Technical Branding */}
              <div className="w-12 bg-zinc-900 border-r border-white/5 flex items-center justify-center py-8 relative">
                 <div className="rotate-[-90deg] whitespace-nowrap text-[10px] font-black tracking-[0.8em] text-zinc-700 uppercase origin-center translate-y-20">
                   OFFICIAL RACING DIV • TKO MOTORSPORTS
                 </div>
                 <div className="absolute bottom-6 left-0 w-full flex flex-col items-center gap-2 px-2 opacity-20">
                    <div className="w-full h-px bg-white/20" />
                    <div className="w-full h-px bg-white/20" />
                    <div className="w-full h-px bg-white/20" />
                 </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col md:flex-row">
                {/* Left Section: Visual Impact */}
                <div className="w-full md:w-[350px] bg-zinc-950 p-12 flex flex-col items-center justify-between border-r border-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
                  
                  <div className="w-full">
                    <div className="flex justify-between items-start mb-12">
                       <Badge className="bg-primary/10 text-primary border-primary/20 py-1.5 px-4 rounded-lg text-[9px] uppercase font-black tracking-widest leading-none">
                         {CATEGORIES[selectedTeam.category]?.name || selectedTeam.category}
                       </Badge>
                       <div className="w-8 h-8 rounded-lg border border-white/5 flex items-center justify-center bg-zinc-900/50">
                          <Trophy className="w-4 h-4 text-zinc-600" />
                       </div>
                    </div>

                    <div className="relative group mx-auto w-fit">
                      <div className="absolute -inset-8 bg-primary/20 blur-[50px] rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-1000" />
                      <div className="w-48 h-48 bg-black border-[3px] border-primary/40 text-white rounded-3xl flex items-center justify-center -rotate-2 shadow-2xl relative overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                         <span className="text-8xl font-heading font-black tracking-tighter drop-shadow-2xl">#{selectedTeam.car_number}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full space-y-8 mt-12">
                    <div className="text-center p-6 rounded-2xl bg-zinc-900/40 border border-white/5">
                      <p className="text-[10px] text-zinc-600 font-heading uppercase tracking-[0.4em] font-black mb-3 leading-none">Competition Status</p>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-6 py-2 uppercase font-heading tracking-[0.2em] text-[10px] font-bold">
                        VERIFIED 2026
                      </Badge>
                    </div>
                    {/* Faux Barcode */}
                    <div className="opacity-20 flex flex-col items-center gap-1 scale-[0.8]">
                       <div className="flex gap-[2px]">
                         {[...Array(30)].map((_, i) => (
                           <div key={i} className="h-8 bg-white" style={{ width: Math.random() > 0.5 ? '2px' : '4px' }} />
                         ))}
                       </div>
                       <p className="text-[8px] font-mono tracking-widest text-white">REF-{selectedTeam.car_number}-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                    </div>
                  </div>
                </div>

                {/* Right Section: Core Data */}
                <div className="flex-1 p-10 md:p-14 bg-black relative">
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                  
                  <button 
                    onClick={() => setSelectedTeam(null)}
                    className="absolute top-8 right-8 z-50 text-white/30 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-xl transition-all border border-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="mb-14 relative">
                    <div className="flex items-center gap-3 mb-3">
                       <div className="h-px w-8 bg-primary/40" />
                       <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] leading-none">Official Competitor Profile</p>
                    </div>
                    <h2 className="text-6xl font-heading text-white tracking-tighter uppercase leading-none break-words max-w-md">
                      {selectedTeam.team_name || "PRO XP RIDER"}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-12 relative max-w-sm">
                    {/* Pilot Info Group */}
                    <div className="space-y-10">
                       <div className="flex gap-8 items-center">
                         <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0 shadow-lg">
                           <Users className="w-6 h-6 text-zinc-500" />
                         </div>
                         <div>
                           <p className="text-zinc-600 text-[9px] uppercase font-black tracking-[0.3em] mb-1.5">Primary Driver</p>
                           <h3 className="text-3xl font-heading text-white uppercase italic leading-none">{selectedTeam.driver_name}</h3>
                           <div className="flex items-center gap-2 mt-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                             <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Group: <span className="text-white">{selectedTeam.driver_blood_group}</span></p>
                           </div>
                         </div>
                       </div>

                       <div className="flex gap-8 items-center border-l border-white/5 pl-8 ml-7">
                         <div className="space-y-1">
                           <p className="text-zinc-700 text-[9px] uppercase font-black tracking-[0.3em] mb-1">Co-Pilot / Navigator</p>
                           <h3 className="text-2xl font-heading text-zinc-400 uppercase italic leading-none">{selectedTeam.codriver_name}</h3>
                           <p className="text-zinc-700 text-[9px] font-bold uppercase tracking-wider mt-2">Blood: {selectedTeam.codriver_blood_group}</p>
                         </div>
                       </div>
                    </div>

                    {/* Machine Spec */}
                    <div className="pt-10 border-t border-white/5">
                       <div className="flex gap-8 items-center">
                         <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
                           <div className="text-primary font-black text-2xl italic leading-none">SP</div>
                         </div>
                         <div>
                           <p className="text-zinc-600 text-[9px] uppercase font-black tracking-[0.3em] mb-1.5">Machine Specification</p>
                           <h3 className="text-3xl font-heading text-white uppercase leading-none tracking-tighter">{selectedTeam.vehicle_name}</h3>
                           <p className="text-primary/60 text-xs font-heading italic tracking-widest uppercase mt-2">{selectedTeam.vehicle_model}</p>
                         </div>
                       </div>
                    </div>
                  </div>

                  {selectedTeam.socials && (
                    <div className="mt-14 inline-flex items-center gap-6 bg-zinc-900/30 p-5 rounded-3xl border border-white/5">
                       <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10">
                          <span className="text-primary font-black text-lg italic">@</span>
                       </div>
                       <div className="pr-6">
                         <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em] leading-none mb-1.5">Pilot Handle</p>
                         <p className="text-white font-medium tracking-tight text-xl font-heading">{selectedTeam.socials}</p>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
