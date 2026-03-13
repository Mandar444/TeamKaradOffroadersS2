"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trophy, Users, Calendar, MapPin } from "lucide-react";

export default function Hero() {
  const [logoError, setLogoError] = useState(false);

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20">
      {/* 4-Video Vertical Grid Background */}
      <div className="absolute inset-0 z-0 flex overflow-hidden bg-zinc-950">
        {[
          "/bgv1.MP4",
          "/pgv4.MP4",
          "/bgv3.MP4",
          "/background%204.MP4"
        ].map((src, i) => (
          <div key={i} className="relative flex-1 h-full border-r border-white/5 last:border-r-0 overflow-hidden group">
             {/* Deep Lavish Fallback */}
             <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black group-hover:bg-primary/5 transition-colors duration-700" />
             
             <video 
               autoPlay 
               loop 
               muted 
               playsInline 
               className="absolute inset-0 w-full h-full object-cover scale-110 grayscale-[0.3] brightness-[0.4] transition-opacity duration-1000"
               onCanPlay={(e) => e.target.style.opacity = 1}
               style={{ opacity: 0 }}
             >
               <source src={src} type="video/mp4" />
             </video>
             
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 opacity-60" />
             <div className="absolute inset-y-0 right-0 w-px bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
          </div>
        ))}
      </div>

      {/* Grit/Noise Overlay */}
      <div className="absolute inset-0 z-12 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-15" />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-transparent to-zinc-950 z-15" />

      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Logo - Main Branding */}
          <div className="mb-4 md:mb-8 relative flex justify-center w-full">
            {!logoError ? (
              <motion.img 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                src="/logo.png" 
                alt="Team Karad Logo" 
                className="w-56 h-56 md:w-96 md:h-96 object-contain drop-shadow-[0_0_50px_rgba(255,165,0,0.5)]"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="text-center py-4">
                 <h1 className="text-6xl md:text-9xl font-heading text-white tracking-tighter drop-shadow-[0_0_20px_oklch(0.7_0.2_60)]">
                   TEAM <span className="text-primary italic">KARAD</span>
                 </h1>
                 <p className="text-xl md:text-3xl text-primary font-heading tracking-[0.6em] opacity-80 uppercase font-bold mt-2">OFFROADERS</p>
              </div>
            )}
          </div>

          <span className="inline-block px-4 py-1.5 mb-8 text-sm font-semibold tracking-widest text-primary border border-primary/30 rounded-full bg-primary/10 backdrop-blur-md uppercase">
            MAY 29, 30, 31 • THE ULTIMATE OFF-ROAD CHALLENGE
          </span>

          <p className="text-lg md:text-2xl text-zinc-300 mb-12 max-w-2xl mx-auto font-sans leading-relaxed">
            Venue: <span className="text-white font-bold">KARAD</span> <br className="hidden md:block" />
            Push your limits in the most demanding terrain. Register now to claim your legendary car number.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/register" 
              className={cn(buttonVariants({ size: "lg" }), "h-16 px-12 text-xl font-black rounded-none skew-x-[-12deg] neon-glow bg-primary text-black transition-all hover:scale-105 active:scale-95")}
            >
              <span className="skew-x-[12deg]">REGISTER NOW</span>
            </Link>
            <Link 
              href="/teams" 
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-16 px-12 text-xl font-bold border-zinc-700 hover:bg-white/5 transition-colors")}
            >
              VIEW TEAMS
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 border-t border-white/10 pt-10"
        >
          <div className="text-center">
            <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1 font-bold">Date</p>
            <p className="text-white font-heading text-lg text-center leading-tight">MAY 29, 30, 31<br/><span className="text-xs opacity-50">2026</span></p>
          </div>
          <div className="text-center">
            <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1 font-bold">Location</p>
            <p className="text-white font-heading text-lg">KARAD</p>
          </div>
          <div className="text-center">
            <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1 font-bold">Prize Pool</p>
            <p className="text-white font-heading text-lg">TBA</p>
          </div>
          <div className="text-center">
            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1 font-bold">Entries</p>
            <p className="text-white font-heading text-lg">200 MAX</p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
