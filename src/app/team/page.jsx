"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Users, Trophy, Home } from "lucide-react";
import Link from "next/link";

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 relative overflow-hidden flex items-center justify-center">
      {/* Cinematic Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-[50%] h-[50vh] bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-12"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-zinc-900/50 border border-white/10 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Crew Manifest Pending</span>
          </div>

          {/* Main Hero Header */}
          <div className="space-y-6">
            <h1 className="text-7xl md:text-9xl font-heading text-white tracking-tighter uppercase leading-none">
              OUR <span className="text-primary italic">CREW</span>
              <br />
              <span className="text-zinc-800">COMING SOON</span>
            </h1>
            <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed italic">
              The architects of the Season 2 championship are currently in the field. Our official crew lineup will be announced shortly.
            </p>
          </div>

          {/* Feature Grid - Explaining the Crew's Role */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
            {[
              { icon: Shield, title: "MARSHALS", desc: "Safety Oversight" },
              { icon: Users, title: "ORGANIZERS", desc: "Event Logistics" },
              { icon: Zap, title: "TECHNICAL", desc: "Scrutiny Team" }
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-sm group hover:border-primary/20 transition-all">
                <feature.icon className="w-8 h-8 text-zinc-700 group-hover:text-primary transition-colors mx-auto mb-4" />
                <h3 className="text-white font-heading text-sm uppercase italic tracking-widest">{feature.title}</h3>
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mt-2">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="pt-12 flex flex-col items-center justify-center gap-6">
            <Link href="/" className="px-10 py-5 bg-white/5 border border-white/10 text-zinc-400 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 hover:text-white transition-all flex items-center gap-3">
               <Home className="w-4 h-4" /> Return To HQ
            </Link>
          </div>

          {/* Footer Note */}
          <div className="pt-20 opacity-20 select-none">
             <div className="flex items-center justify-center gap-8 md:gap-16">
                <span className="text-[10px] font-black uppercase tracking-[1em]">OFFICIAL</span>
                <Trophy className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[1em]">ACCESS</span>
                <Zap className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[1em]">GRANTED</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Aesthetic Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
         <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
         <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>
    </div>
  );
}
