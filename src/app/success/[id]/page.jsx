"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Trophy, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-zinc-900 border-primary/20 neon-glow overflow-hidden">
            <div className="h-2 bg-primary" />
            <CardContent className="pt-12 pb-10 px-8 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              
              <h1 className="text-3xl font-heading text-white mb-2">REGISTRATION SUBMITTED!</h1>
              <p className="text-zinc-400 mb-8">
                We will verify your registration soon. Please stay back and relax while our team processes your details.
              </p>

              <div className="bg-black/40 border border-zinc-800 rounded-lg p-4 mb-8">
                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Registration Reference</p>
                <p className="text-white font-mono text-xl">{id}</p>
              </div>

              <div className="space-y-4">
                <Link 
                  href="/" 
                  className={cn(buttonVariants(), "w-full h-12 bg-primary text-black font-bold inline-flex items-center justify-center")}
                >
                  DONE
                </Link>
                <Link 
                  href="/teams" 
                  className={cn(buttonVariants({ variant: "outline" }), "w-full h-12 border-zinc-700 text-zinc-300 font-bold inline-flex items-center justify-center hover:bg-white/5")}
                >
                  REGISTERED TEAMS <Trophy className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex justify-center gap-4 text-zinc-600"
        >
          <Trophy className="w-5 h-5 opacity-20" />
          <p className="text-xs uppercase tracking-[0.2em] italic">See you at the starting line</p>
          <Trophy className="w-5 h-5 opacity-20" />
        </motion.div>
      </div>
    </div>
  );
}
