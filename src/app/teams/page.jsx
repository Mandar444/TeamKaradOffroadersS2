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

        {/* Team Details Modal */}
        {selectedTeam && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedTeam(null)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                id="close-modal"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-8">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 mb-4 uppercase tracking-widest">
                      {CATEGORIES[selectedTeam.category]?.name || selectedTeam.category}
                    </Badge>
                    <h2 className="text-4xl font-heading text-white">
                      {selectedTeam.team_name || `TEAM #${selectedTeam.car_number}`}
                    </h2>
                  </div>
                  <div className="bg-primary text-black w-20 h-20 rounded-xl flex items-center justify-center -rotate-3 shadow-lg">
                    <span className="text-4xl font-heading font-black">#{selectedTeam.car_number}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Personnel Section */}
                  <div className="space-y-6">
                    <div>
                      <Label className="text-primary uppercase tracking-widest text-xs font-bold mb-2 block">Driver Info</Label>
                      <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-800">
                        <p className="text-white text-lg font-heading uppercase">{selectedTeam.driver_name}</p>
                        <p className="text-zinc-400 text-sm mt-1">Blood Group: <span className="text-primary font-bold">{selectedTeam.driver_blood_group}</span></p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-primary uppercase tracking-widest text-xs font-bold mb-2 block">Co-Driver Info</Label>
                      <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-800">
                        <p className="text-white text-lg font-heading uppercase">{selectedTeam.codriver_name}</p>
                        <p className="text-zinc-400 text-sm mt-1">Blood Group: <span className="text-primary font-bold">{selectedTeam.codriver_blood_group}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Section */}
                  <div className="space-y-6">
                    <div>
                      <Label className="text-primary uppercase tracking-widest text-xs font-bold mb-2 block">Machine Details</Label>
                      <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                        <p className="text-white text-lg font-heading uppercase">{selectedTeam.vehicle_name}</p>
                        <p className="text-zinc-400 text-sm mt-1 italic">{selectedTeam.vehicle_model}</p>
                      </div>
                    </div>

                    {selectedTeam.socials && (
                      <div>
                        <Label className="text-primary uppercase tracking-widest text-xs font-bold mb-2 block">Social Pulse</Label>
                        <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-800 flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                              <span className="text-zinc-400 text-xs">@</span>
                           </div>
                           <p className="text-white font-medium">{selectedTeam.socials}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-6 py-2 uppercase font-heading tracking-widest">
                    Verified Competitor ✅
                  </Badge>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
