"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, LogOut, Phone, Car, CreditCard, RefreshCw, Zap, ShieldCheck, Trophy, LayoutDashboard, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("PENDING");
  const router = useRouter();

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/registrations");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setRegistrations(data.registrations || []);
    } catch (e) {
      console.error("Failed to fetch registrations");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const handleAction = async (regId, action) => {
    if (!confirm(`Are you sure you want to ${action.toLowerCase()} this registration?`)) return;
    
    try {
      const res = await fetch(`/api/admin/${action.toLowerCase()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regId }),
      });

      if (res.ok) {
        fetchRegistrations();
      } else {
        alert("Action failed");
      }
    } catch (e) {
      alert("Error processing action");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const filtered = registrations.filter(r => 
    tab === "PENDING" ? r.status === "PENDING_VERIFICATION" || r.status === "PENDING" : r.status === tab
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 text-white/5">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-primary/5 blur-[150px] opacity-20" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
             <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                   <LayoutDashboard className="w-4 h-4 text-primary" />
                </div>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] leading-none">Command Center • Official Access</p>
             </div>
             <h1 className="text-5xl md:text-6xl font-heading tracking-tighter uppercase leading-none text-white">
               RACE <span className="text-primary italic">CONTROL</span>
             </h1>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-6 px-8 py-4 bg-zinc-900/60 border border-white/5 rounded-2xl backdrop-blur-xl">
                <div className="text-center border-r border-white/10 pr-6">
                   <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Live Grid</p>
                   <p className="text-2xl font-heading text-white">{registrations.filter(r => r.status === "CONFIRMED").length}</p>
                </div>
                <div className="text-center">
                   <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Queue</p>
                   <p className="text-2xl font-heading text-amber-500">{registrations.filter(r => r.status.includes("PENDING")).length}</p>
                </div>
             </div>
             
             <div className="flex flex-col gap-2">
                <Button variant="outline" onClick={fetchRegistrations} className="h-10 px-4 bg-zinc-900 border-white/10 hover:bg-zinc-800 transition-all rounded-xl">
                  <RefreshCw className={loading ? "w-4 h-4 mr-2 animate-spin" : "w-4 h-4 mr-2"} /> REFRESH
                </Button>
                <Button variant="ghost" onClick={logout} className="h-10 px-4 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                  <LogOut className="w-4 h-4 mr-2" /> EXIT
                </Button>
             </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 p-1 bg-zinc-900/40 border border-white/5 rounded-2xl backdrop-blur-md mb-8 w-fit">
          {["PENDING", "CONFIRMED", "REJECTED"].map((s) => (
            <button
              key={s}
              onClick={() => setTab(s)}
              className={`px-8 py-3 rounded-xl font-heading text-sm uppercase tracking-widest transition-all ${
                tab === s 
                ? "bg-primary text-black shadow-[0_0_30px_rgba(255,165,0,0.3)]" 
                : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Data Grid */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {loading && registrations.length === 0 ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-32 flex flex-col items-center justify-center"
              >
                <div className="relative">
                   <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                   <Zap className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="mt-6 text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Scanning Grid...</p>
              </motion.div>
            ) : (
              <motion.div
                key="table"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Card className="bg-zinc-950/40 border-white/5 backdrop-blur-3xl overflow-hidden rounded-[2rem] shadow-2xl">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-zinc-900/50 border-white/5">
                        <TableRow className="hover:bg-transparent border-white/5">
                          <TableHead className="py-6 px-8 text-zinc-600 text-[10px] font-black uppercase tracking-widest">Team Identity</TableHead>
                          <TableHead className="py-6 px-8 text-zinc-600 text-[10px] font-black uppercase tracking-widest">Crew / Comms</TableHead>
                          <TableHead className="py-6 px-8 text-zinc-600 text-[10px] font-black uppercase tracking-widest">Payment Flow</TableHead>
                          <TableHead className="py-6 px-8 text-zinc-600 text-[10px} font-black uppercase tracking-widest text-right">Race Control</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.map((reg) => (
                          <TableRow key={reg.reg_id} className="group hover:bg-white/5 border-white/5 transition-colors">
                            <TableCell className="py-8 px-8">
                               <div className="flex items-start gap-4">
                                  <div className="w-16 h-16 bg-black border border-white/10 rounded-2xl flex items-center justify-center shadow-xl group-hover:border-primary/40 transition-all">
                                     <span className="text-3xl font-heading font-black italic tracking-tighter text-white">#{reg.car_number}</span>
                                  </div>
                                  <div className="flex flex-col gap-1.5 justify-center h-16">
                                     <h4 className="text-xl font-heading text-white uppercase italic leading-none">{reg.team_name || "STORM RIDER"}</h4>
                                     <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-[8px] bg-primary/10 border-primary/20 text-primary py-0 font-black tracking-widest uppercase">{reg.category.replace(/_/g, " ")}</Badge>
                                        <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">{reg.vehicle_name}</span>
                                     </div>
                                  </div>
                               </div>
                            </TableCell>

                            <TableCell className="py-8 px-8">
                               <div className="space-y-4">
                                  <div>
                                     <div className="flex items-center gap-2 text-white font-heading text-lg lowercase leading-none mb-1">
                                        <ShieldCheck className="w-4 h-4 text-primary" /> {reg.driver_name}
                                        <span className="text-zinc-600 text-xs ml-1 uppercase">{reg.driver_blood_group}</span>
                                     </div>
                                     <div className="flex items-center gap-2 text-zinc-500 font-heading text-md lowercase leading-none">
                                        <Trophy className="w-3.5 h-3.5 opacity-40" /> {reg.codriver_name || "---"}
                                        <span className="text-zinc-700 text-xs ml-1 uppercase">{reg.codriver_blood_group}</span>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                     <a href={`tel:${reg.driver_phone}`} className="flex items-center gap-2 text-zinc-600 hover:text-primary transition-colors text-[10px] font-black tracking-widest uppercase">
                                        <Phone className="w-3 h-3" /> {reg.driver_phone}
                                     </a>
                                     {reg.socials && (
                                       <span className="text-zinc-800 text-[8px]"> • </span>
                                     )}
                                     {reg.socials && (
                                       <span className="text-primary/60 text-[10px] font-bold italic tracking-wide">{reg.socials}</span>
                                     )}
                                  </div>
                               </div>
                            </TableCell>

                            <TableCell className="py-8 px-8">
                               <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                     <span className="text-2xl font-heading text-white italic">₹{reg.amount_paid}</span>
                                     {reg.status === "PENDING_VERIFICATION" && (
                                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                     )}
                                  </div>
                                  <div className="flex items-center gap-3 bg-black/40 border border-white/5 py-1.5 px-3 rounded-lg w-fit">
                                     <CreditCard className="w-3.5 h-3.5 text-zinc-600" />
                                     <span className="font-mono text-zinc-400 text-xs font-black tracking-widest">{reg.utr_number || "NO UTR"}</span>
                                  </div>
                                  {reg.screenshot_link && (
                                     <a 
                                       href={reg.screenshot_link} 
                                       target="_blank" 
                                       rel="noreferrer"
                                       className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#f09433] hover:text-white transition-colors"
                                     >
                                       View Receipt <LayoutDashboard className="w-3 h-3" />
                                     </a>
                                  )}
                               </div>
                            </TableCell>

                            <TableCell className="py-8 px-8 text-right">
                               {reg.status !== "CONFIRMED" && reg.status !== "REJECTED" ? (
                                 <div className="flex justify-end gap-3">
                                    <Button 
                                      onClick={() => handleAction(reg.reg_id, "REJECT")}
                                      className="w-12 h-12 bg-zinc-900 border border-white/5 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                                    >
                                       <X className="w-5 h-5" />
                                    </Button>
                                    <Button 
                                      onClick={() => handleAction(reg.reg_id, "CONFIRM")}
                                      className="w-12 h-12 bg-primary border border-primary/20 rounded-2xl text-black hover:scale-110 shadow-[0_0_30px_rgba(255,165,0,0.3)] transition-all"
                                    >
                                       <Check className="w-6 h-6 stroke-[3px]" />
                                    </Button>
                                 </div>
                               ) : (
                                  <div className="flex flex-col items-end gap-2">
                                     <div className={cn(
                                       "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border",
                                       reg.status === "CONFIRMED" ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                                     )}>
                                        {reg.status === "CONFIRMED" ? "AUTHORIZED GRID" : "UNITS REJECTED"}
                                     </div>
                                     <p className="text-[8px] text-zinc-700 font-mono italic">SESSION_{new Date().getFullYear()}_TX</p>
                                  </div>
                               )}
                            </TableCell>
                          </TableRow>
                        ))}
                        {filtered.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="py-32 text-center">
                               <div className="flex flex-col items-center opacity-20">
                                  <ShieldCheck className="w-12 h-12 mb-4" />
                                  <p className="text-[10px] font-black uppercase tracking-[0.6em]">No units detected in this frequency</p>
                               </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Console Motif */}
        <div className="mt-20 flex flex-wrap items-center justify-between gap-10 opacity-20 hover:opacity-100 transition-opacity">
           <div className="flex items-center gap-8">
              <div className="flex flex-col gap-1">
                 <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-500 leading-none">Secure Uplink</p>
                 <p className="text-[10px] font-mono text-zinc-400">ENCRYPTED_256_ACTIVE</p>
              </div>
              <div className="flex flex-col gap-1">
                 <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-500 leading-none">System Status</p>
                 <p className="text-[10px] font-mono text-green-500 animate-pulse">OPTIMIZED</p>
              </div>
           </div>
           <Settings className="w-5 h-5 text-zinc-800" />
        </div>
      </div>
    </div>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
