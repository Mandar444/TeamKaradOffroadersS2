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

        {/* Lavish Team Details Modal */}
        {selectedTeam && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-500">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              className="w-full max-w-3xl bg-black border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(255,165,0,0.15)] relative perspective-1000"
            >
              {/* Animated Accent Border */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
              
              <button 
                onClick={() => setSelectedTeam(null)}
                className="absolute top-6 right-6 z-50 text-white/30 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all"
                id="close-modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row h-full">
                {/* Left Side: Impact Visual & Category */}
                <div className="w-full md:w-1/3 bg-zinc-900 border-r border-white/5 p-8 flex flex-col justify-between items-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                  
                  <div className="text-center z-10 w-full">
                    <Badge className="bg-primary/20 text-primary border-primary/30 py-1.5 px-4 rounded-full mb-8 text-[10px] uppercase font-bold tracking-widest leading-none">
                      {CATEGORIES[selectedTeam.category]?.name || selectedTeam.category}
                    </Badge>
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                      <div className="w-40 h-40 bg-zinc-950 border-4 border-primary/50 text-white rounded-2xl flex items-center justify-center rotate-3 shadow-2xl relative">
                        <span className="text-7xl font-heading font-black tracking-tighter">#{selectedTeam.car_number}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 text-center z-10 w-full">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                    <p className="text-[10px] text-zinc-600 font-heading uppercase tracking-[0.3em] font-bold">RACE STATUS</p>
                    <Badge className="mt-2 bg-green-500/10 text-green-500 border-green-500/20 px-6 py-2 uppercase font-heading tracking-widest text-[10px]">
                      VERIFIED COMPETITOR
                    </Badge>
                  </div>
                </div>

                {/* Right Side: Detailed Info */}
                <div className="flex-1 p-10 bg-black relative">
                  {/* Topography Background */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
                  
                  <div className="mb-10 relative">
                    <p className="text-primary text-[10px] font-bold uppercase tracking-[0.4em] mb-2 leading-none">Official Entry</p>
                    <h2 className="text-5xl font-heading text-white tracking-tighter uppercase leading-tight">
                      {selectedTeam.team_name || "PRO XP CHALLENGER"}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-10 relative">
                    <div className="space-y-8">
                       {/* Driver Section */}
                       <div className="flex gap-6 items-start">
                         <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                           <Trophy className="w-6 h-6 text-primary/60" />
                         </div>
                         <div className="space-y-1">
                           <p className="text-zinc-500 text-[9px] uppercase font-black tracking-widest">Lead Pilot</p>
                           <h3 className="text-2xl font-heading text-white uppercase italic">{selectedTeam.driver_name}</h3>
                           <p className="text-zinc-400 text-xs">Blood Group: <span className="text-primary font-bold">{selectedTeam.driver_blood_group}</span></p>
                         </div>
                       </div>

                       {/* Co-Driver Section */}
                       <div className="flex gap-6 items-start">
                         <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                           <Users className="w-6 h-6 text-zinc-700" />
                         </div>
                         <div className="space-y-1">
                           <p className="text-zinc-500 text-[9px] uppercase font-black tracking-widest">Navigator</p>
                           <h3 className="text-2xl font-heading text-zinc-300 uppercase italic">{selectedTeam.codriver_name}</h3>
                           <p className="text-zinc-500 text-xs font-medium uppercase">Blood: <span className="text-zinc-400">{selectedTeam.codriver_blood_group}</span></p>
                         </div>
                       </div>

                       {/* Vehicle Section */}
                       <div className="flex gap-6 items-start pt-6 border-t border-white/5">
                         <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
                           <div className="text-primary font-black text-xl italic leading-none">M</div>
                         </div>
                         <div className="space-y-1">
                           <p className="text-zinc-500 text-[9px] uppercase font-black tracking-widest">The Machine</p>
                           <h3 className="text-2xl font-heading text-white uppercase leading-none">{selectedTeam.vehicle_name}</h3>
                           <p className="text-primary/70 text-xs font-heading italic tracking-wider uppercase">{selectedTeam.vehicle_model}</p>
                         </div>
                       </div>
                    </div>
                  </div>

                  {selectedTeam.socials && (
                    <div className="mt-12 flex items-center gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                       <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-primary font-bold">@</span>
                       </div>
                       <div>
                         <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest leading-none mb-1">Social Pulse</p>
                         <p className="text-white font-medium tracking-tight text-lg">{selectedTeam.socials}</p>
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
