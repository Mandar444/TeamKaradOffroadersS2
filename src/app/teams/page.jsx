"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/config/pricing";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Trophy, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

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
    const matchesCategory = filter === "ALL" || team.category === filter;
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
            <Select value={filter} onValueChange={setFilter}>
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
                    <TableHead className="text-zinc-400 font-heading text-right">STATUS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeams.map((team, idx) => (
                    <TableRow key={idx} className="border-zinc-800 hover:bg-white/5 transition-colors">
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
                        {team.car_model}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-400 uppercase bg-zinc-800/50">
                          {CATEGORIES[team.category]?.name || team.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20 px-4 py-1">
                          CONFIRMED
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
