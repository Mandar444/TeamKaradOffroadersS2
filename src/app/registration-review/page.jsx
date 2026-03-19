"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CreditCard, ShieldCheck, Zap, User, Car, Users, ClipboardList, Loader2 } from "lucide-react";
import { CATEGORIES } from "@/config/pricing";

export default function ReviewPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("tko_reg_draft");
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      router.push("/register");
    }
  }, [router]);

  const handleFinalSubmit = async () => {
    if (!data) return;
    setLoading(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success && result.id) {
        sessionStorage.removeItem("tko_reg_draft"); // Cleanup
        router.push(`/payment/${result.id}`);
      } else {
        alert(result.error || "System error during finalization.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!data) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden px-4 py-20">
      <div className="absolute inset-0 z-0 text-white">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-full h-[50vh] bg-mesh-amber opacity-10 blur-[120px]" />
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
      </div>

      <div className="max-w-4xl w-full relative z-10 flex flex-col md:flex-row bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_120px_rgba(255,165,0,0.2)]">
        {/* Elite Sidebar */}
        <div className="w-16 md:w-24 bg-zinc-900 border-r border-white/5 flex flex-col items-center justify-between py-12 px-2">
           <div className="rotate-[-90deg] whitespace-nowrap text-[9px] font-black tracking-[1.5em] text-zinc-700 uppercase origin-center translate-y-32">
             MANIFEST REVIEW • GRID-STAGED
           </div>
           <ClipboardList className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(255,165,0,0.4)]" />
        </div>

        {/* Action Center */}
        <div className="flex-1 p-8 md:p-16 relative overflow-hidden">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-4 mb-8">
               <ShieldCheck className="w-6 h-6 text-primary animate-pulse" />
               <p className="text-primary text-[10px] font-black uppercase tracking-[0.8em] leading-none">Review Your Entry Manifest</p>
            </div>

            <h1 className="text-4xl md:text-5xl font-heading text-white tracking-tighter uppercase leading-[0.9] mb-4">
              CONFIRM YOUR <br />
              <span className="text-primary italic"> GRID SPOT.</span>
            </h1>
            <p className="text-zinc-500 text-sm md:text-base mb-10">Review your manifest one last time before committing to the grid database.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
               {/* Team Info */}
               <div className="bg-zinc-900/40 p-6 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex items-center gap-3 text-primary">
                    <Users className="w-4 h-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">Crew Details</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[9px] uppercase font-bold mb-1">Team Name</p>
                    <p className="text-white font-heading uppercase text-xl leading-none">{data.teamName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-zinc-500 text-[9px] uppercase font-bold mb-1">Driver</p>
                        <p className="text-zinc-300 text-sm uppercase italic">{data.driverName}</p>
                     </div>
                     <div>
                        <p className="text-zinc-500 text-[9px] uppercase font-bold mb-1">Co-Driver</p>
                        <p className="text-zinc-300 text-sm uppercase italic">{data.coDriverName}</p>
                     </div>
                  </div>
               </div>

               {/* Machine Info */}
               <div className="bg-zinc-900/40 p-6 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex items-center gap-3 text-primary">
                    <Car className="w-4 h-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">Vessel & Category</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-zinc-500 text-[9px] uppercase font-bold mb-1">Class</p>
                        <p className="text-white font-heading text-sm uppercase leading-none">{CATEGORIES[data.category]?.name}</p>
                     </div>
                     <div>
                        <p className="text-zinc-500 text-[9px] uppercase font-bold mb-1">Sticker No.</p>
                        <p className="text-primary font-heading text-3xl leading-none">#{data.carNumber}</p>
                     </div>
                  </div>
               </div>

               {/* Dietary & Logistics */}
               <div className="bg-zinc-900/40 p-6 rounded-3xl border border-white/5 space-y-4 md:col-span-2">
                  <div className="flex items-center gap-3 text-primary">
                    <Activity className="w-4 h-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">Logistics & Dietary Manifest</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                     <div>
                        <p className="text-zinc-500 text-[9px] uppercase font-bold mb-1">Driver Food</p>
                        <p className="text-white text-xs font-black uppercase tracking-widest">{data.driverFood}</p>
                     </div>
                     <div>
                        <p className="text-zinc-500 text-[9px] uppercase font-bold mb-1">Co-Driver Food</p>
                        <p className="text-white text-xs font-black uppercase tracking-widest">{data.coDriverFood}</p>
                     </div>
                     {data.teamFood && (
                       <div>
                          <p className="text-zinc-500 text-[9px] uppercase font-bold mb-1">Team Food (Extras)</p>
                          <p className="text-white text-xs font-black uppercase tracking-widest">{data.teamFood}</p>
                       </div>
                     )}
                  </div>
                  <div className="pt-4 border-t border-white/5">
                     <p className="text-zinc-500 text-[9px] uppercase font-bold mb-1">Medical Context</p>
                     <p className="text-zinc-300 text-xs italic">{data.medicalIssue || "None reported"}</p>
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <Button 
                onClick={handleFinalSubmit}
                disabled={loading}
                className="h-16 px-12 bg-primary text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.05] transition-transform flex items-center justify-center gap-4 flex-[2] relative overflow-hidden"
              >
                {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <>CONFIRM & PROCEED TO PAYMENT <CreditCard className="w-5 h-5" /></>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push("/register")}
                disabled={loading}
                className="h-16 px-10 border-zinc-800 text-zinc-500 font-bold uppercase tracking-widest rounded-2xl hover:bg-white/5 flex-1"
              >
                EDIT DATA
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
