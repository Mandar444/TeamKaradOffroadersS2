"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Trophy } from "lucide-react";

export default function SuccessPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden px-4">
      {/* Immersive Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20 pointer-events-none" />
      </div>

      <div className="max-w-xl w-full relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
           transition={{ duration: 0.8, type: "spring" }}
           className="perspective-1000"
        >
          <Card className="bg-black border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(255,165,0,0.15)] relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
            
            <CardContent className="pt-16 pb-12 px-10 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/20 rotate-3 shadow-[0_0_30px_rgba(255,165,0,0.2)]"
              >
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </motion.div>
              
              <div className="mb-10">
                <p className="text-primary text-[10px] font-bold uppercase tracking-[0.5em] mb-3 leading-none">Registration Secured</p>
                <h1 className="text-5xl font-heading text-white tracking-tighter uppercase leading-tight mb-4">
                  WELCOME TO THE <span className="text-primary italic">GRID.</span>
                </h1>
                <p className="text-zinc-500 text-lg max-w-sm mx-auto font-medium">
                  Your entry has been received. Our team is now verifying your credentials for the ultimate battle.
                </p>
              </div>

              <div className="relative mb-12 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-transparent blur opacity-20 group-hover:opacity-40 transition" />
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Trophy className="w-20 h-20 text-white" />
                  </div>
                  <p className="text-zinc-600 text-[9px] uppercase font-black tracking-[0.3em] mb-2">Access Reference ID</p>
                  <p className="text-white font-heading text-3xl tracking-wider leading-none">{id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link 
                  href="/" 
                  className={cn(buttonVariants({ size: "lg" }), "h-14 bg-primary text-black font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2")}
                >
                  RETURN HOME
                </Link>
                <Link 
                  href="/teams" 
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 border-zinc-800 text-zinc-300 font-bold uppercase tracking-widest rounded-xl hover:bg-white/5 flex items-center justify-center gap-2")}
                >
                  ENTRY LIST <Trophy className="w-4 h-4 text-primary/60" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1.2 }}
           className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-6 text-zinc-700">
             <div className="h-px w-12 bg-zinc-900" />
             <p className="text-[10px] uppercase font-bold tracking-[0.5em] italic">See you in Karad 2026</p>
             <div className="h-px w-12 bg-zinc-900" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
