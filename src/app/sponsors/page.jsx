"use client";

import { motion } from "framer-motion";
import { Handshake, Zap } from "lucide-react";
import Link from "next/link";

export default function SponsorsPage() {
  return (
    <div className="min-h-[90vh] bg-black text-white pt-32 pb-20 px-6 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-[100vh] bg-mesh-amber opacity-10 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 w-full text-center">
        {/* Header Section */}
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-zinc-900 border border-white/10 text-[10px] font-black uppercase tracking-[0.5em] mb-8"
        >
            <Handshake className="w-4 h-4 text-primary" /> Patrons of the Kingdom
        </motion.div>
        
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-[8rem] font-heading text-white tracking-tighter uppercase leading-none mb-8"
        >
            COMING <span className="text-primary italic text-glow-amber">SOON</span>
        </motion.h1>
        
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed mb-16"
        >
            We are curating an exceptional group of partners to fuel the most prestigious off-road event in the region. Stay tuned as we unveil our sponsors.
        </motion.p>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative rounded-[3rem] overflow-hidden group max-w-3xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent border border-white/5 rounded-[3rem]" />
          <div className="relative z-10 p-12 md:p-16 text-center">
             <div className="w-16 h-16 bg-primary rounded-3xl mx-auto mb-8 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-500 shadow-[0_0_30px_rgba(255,165,0,0.4)]">
                <Zap className="w-8 h-8 text-black" />
             </div>
             <h2 className="text-3xl md:text-5xl font-heading text-white uppercase italic mb-4">
                WANT TO JOIN THE <span className="text-primary">CIRCUIT?</span>
             </h2>
             <p className="text-zinc-500 text-sm md:text-lg max-w-xl mx-auto mb-8 font-sans">
                Elevate your brand alongside the legends. Exclusive partnership opportunities for TKO Season 2 are now open.
             </p>
             <Link 
                href="/about#contact" 
                className="inline-flex h-14 md:h-16 px-10 md:px-16 items-center justify-center bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] md:text-sm rounded-2xl hover:bg-primary hover:scale-105 transition-all shadow-2xl"
             >
                Request Prospectus
             </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
