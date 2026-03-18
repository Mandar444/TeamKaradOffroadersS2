"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CreditCard, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function AcknowledgementPage() {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden px-4">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-full h-[50vh] bg-mesh-amber opacity-10 blur-[120px]" />
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
      </div>

      <div className="max-w-4xl w-full relative z-10 flex flex-col md:flex-row bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_120px_rgba(255,165,0,0.2)]">
        {/* Elite Success Sidebar */}
        <div className="w-16 md:w-24 bg-zinc-900 border-r border-white/5 flex flex-col items-center justify-between py-12 px-2">
           <div className="rotate-[-90deg] whitespace-nowrap text-[9px] font-black tracking-[1.5em] text-zinc-700 uppercase origin-center translate-y-32">
             DATA RECEIVED • VERIFIED
           </div>
           <CheckCircle2 className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(255,165,0,0.4)]" />
        </div>

        {/* Action Center */}
        <div className="flex-1 p-8 md:p-20 relative overflow-hidden">
          <motion.div
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-8">
               <ShieldCheck className="w-6 h-6 text-primary animate-pulse" />
               <p className="text-primary text-[10px] font-black uppercase tracking-[0.8em] leading-none">Form Submitted Successfully</p>
            </div>

            <h1 className="text-4xl md:text-6xl font-heading text-white tracking-tighter uppercase leading-[0.9] mb-8">
              PRE-REGISTRATION <br />
              <span className="text-primary italic"> COMPLETE.</span>
            </h1>

            <p className="text-zinc-400 text-lg font-medium leading-relaxed mb-12">
              Your details have been securely logged in our race database. To finalize your spot on the grid, please proceed to the secure payment portal.
            </p>

            {/* Reference ID Card */}
            <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 mb-12 relative overflow-hidden group hover:border-primary/20 transition-all">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                  <Zap className="w-24 h-24 text-white" />
                </div>
                <p className="text-zinc-600 text-[9px] uppercase font-black tracking-[0.4em] mb-3">Your TKO Reference No.</p>
                <p className="text-white font-heading text-4xl tracking-widest leading-none">{id}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <Button 
                onClick={() => router.push(`/payment/${id}`)}
                className="h-16 px-12 bg-primary text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.05] transition-transform flex items-center justify-center gap-4 flex-1"
              >
                PROCEED TO PAYMENT <CreditCard className="w-5 h-5" />
              </Button>
            </div>
            
            <p className="mt-8 text-center md:text-left text-zinc-600 text-[10px] font-black uppercase tracking-widest italic">
              * DO NOT RE-SIGNUP. USE THIS REFERENCE ID FOR ALL QUERIES.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
