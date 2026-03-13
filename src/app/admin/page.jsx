"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, LogOut, Phone, User, Car, Hash, CreditCard, RefreshCw } from "lucide-react";
import { CATEGORIES } from "@/config/pricing";

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
    <div className="min-h-screen bg-black pt-12 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-heading text-white">ADMIN <span className="text-primary italic">DASHBOARD</span></h1>
            <p className="text-zinc-500">Race Control & Verification</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={fetchRegistrations} className="border-zinc-800 text-zinc-400">
              <RefreshCw className="w-4 h-4 mr-2" /> REFRESH
            </Button>
            <Button variant="ghost" onClick={logout} className="text-red-500 hover:bg-red-500/10">
              <LogOut className="w-4 h-4 mr-2" /> LOGOUT
            </Button>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          {["PENDING", "CONFIRMED", "REJECTED"].map((s) => (
            <button
              key={s}
              onClick={() => setTab(s)}
              className={`px-8 py-3 font-heading text-lg tracking-widest border transition-all ${
                tab === s 
                ? "bg-primary text-black border-primary neon-glow" 
                : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              {s}
              <span className="ml-3 text-xs opacity-60">
                ({registrations.filter(r => s === "PENDING" ? r.status.includes("PENDING") : r.status === s).length})
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center"><RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto" /></div>
        ) : (
          <Card className="bg-zinc-900 border-zinc-800">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-zinc-800/50">
                  <TableRow className="border-zinc-800">
                    <TableHead className="text-zinc-400 font-heading">REG DATA</TableHead>
                    <TableHead className="text-zinc-400 font-heading">PERSONNEL</TableHead>
                    <TableHead className="text-zinc-400 font-heading">PAYMENT / UTR</TableHead>
                    <TableHead className="text-zinc-400 font-heading text-right">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((reg) => (
                    <TableRow key={reg.reg_id} className="border-zinc-800">
                      <TableCell className="py-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                             <span className="font-heading text-xl text-white">#{reg.car_number}</span>
                             <Badge variant="outline" className="text-[10px] text-zinc-500 border-zinc-700">{reg.category}</Badge>
                          </div>
                          <p className="text-zinc-400 text-sm flex items-center gap-1.5 uppercase tracking-tighter">
                            <Car className="w-3 h-3" /> {reg.car_model}
                          </p>
                          <p className="text-[10px] text-zinc-600 font-mono mt-1">{reg.reg_id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-white text-sm font-medium uppercase font-heading">{reg.driver_name} <span className="text-primary ml-1">({reg.driver_blood_group})</span></p>
                          <p className="text-zinc-400 text-xs italic">{reg.codriver_name} ({reg.codriver_blood_group})</p>
                          <p className="text-zinc-500 text-xs flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" /> {reg.driver_phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-white font-heading">₹{reg.amount_paid}</span>
                              {reg.status === "PENDING_VERIFICATION" && <Badge className="bg-amber-500 text-black text-[10px]">VERIFY NEEDED</Badge>}
                            </div>
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-3 h-3 text-zinc-500" />
                              <span className="font-mono text-primary text-sm font-bold tracking-widest">{reg.utr_number || "NOT SUBMITTED"}</span>
                            </div>
                            {reg.screenshot_link && (
                              <a 
                                href={reg.screenshot_link} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[10px] text-primary hover:underline flex items-center gap-1"
                              >
                                View Screenshot 🔗
                              </a>
                            )}
                         </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {reg.status !== "CONFIRMED" && (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" onClick={() => handleAction(reg.reg_id, "CONFIRM")} className="bg-green-600 hover:bg-green-700 text-white h-10 w-10 p-0">
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" onClick={() => handleAction(reg.reg_id, "REJECT")} className="bg-red-600 hover:bg-red-700 text-white h-10 w-10 p-0">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        {reg.status === "CONFIRMED" && (
                          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-4 py-2 uppercase font-heading">Verified ✅</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-40 text-center text-zinc-600 italic">
                        No registrations found for this status.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
