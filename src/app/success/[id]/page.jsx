"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Trophy, ShieldCheck, Zap } from "lucide-react";

export default function SuccessPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden px-4">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[150px] opacity-20" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-10 pointer-events-none" />
      </div>

      <div className="max-w-4xl w-full relative z-10 flex flex-col md:flex-row bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_120px_rgba(255,165,0,0.2)]">
        {/* Elite Success Sidebar */}
        <div className="w-16 md:w-24 bg-zinc-900 border-r border-white/5 flex flex-col items-center justify-between py-12 px-2">
           <div className="rotate-[-90deg] whitespace-nowrap text-[9px] font-black tracking-[1.5em] text-zinc-700 uppercase origin-center translate-y-32">
             ACCESS AUTHORIZED • LEVEL: ELITE
           </div>
           <ShieldCheck className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(255,165,0,0.4)]" />
        </div>

        {/* Action Center */}
        <div className="flex-1 p-12 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
            <Trophy className="w-80 h-80 text-white scale-150 rotate-12" />
          </div>

          <motion.div
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-8">
               <Zap className="w-6 h-6 text-primary animate-pulse" />
               <p className="text-primary text-[10px] font-black uppercase tracking-[0.8em] leading-none">Registration Finalized</p>
            </div>

            <h1 className="text-5xl md:text-7xl font-heading text-white tracking-tighter uppercase leading-[0.85] mb-8">
              PAYMENT <span className="text-primary italic"> UNDER REVIEW.</span>
            </h1>

            <p className="text-zinc-500 text-xl max-w-lg font-medium leading-relaxed mb-12">
              Please wait until we verify your payment. Your entry status will be updated to Confirmed once the transaction is validated by our team.
            </p>

            {/* Technical Reference ID */}
            <div className="relative mb-16 group w-fit">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-transparent blur-xl opacity-20 group-hover:opacity-40 transition" />
              <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 md:p-10 relative overflow-hidden min-w-[300px]">
                <p className="text-zinc-600 text-[9px] uppercase font-black tracking-[0.4em] mb-3">Official Credential No.</p>
                <p className="text-white font-heading text-4xl tracking-widest leading-none">{id}</p>
                <div className="absolute bottom-[-10px] right-[-10px] opacity-[0.03]">
                  <CheckCircle2 className="w-24 h-24 text-white" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link 
                href="/" 
                className={cn(buttonVariants({ size: "lg" }), "h-16 px-12 bg-primary text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.05] transition-transform flex items-center justify-center")}
              >
                BACK TO HOME
              </Link>
              <Link 
                href="/teams" 
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-16 px-12 border-zinc-800 text-zinc-300 font-bold uppercase tracking-widest rounded-2xl hover:bg-white/5 flex items-center justify-center gap-3")}
              >
                GLOBAL LINEUP <Trophy className="w-5 h-5 text-primary/60" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
