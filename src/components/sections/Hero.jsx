"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Trophy, Users, Calendar, MapPin } from "lucide-react";

export default function Hero() {
  const [logoError, setLogoError] = useState(false);

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20 bg-black">
      {/* Dramatic Visible Background */}
      <div className="absolute inset-0 z-0">
        {/* Primary glow orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/15 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] rounded-full bg-orange-600/8 blur-[100px]" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: `linear-gradient(rgba(255,165,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,165,0,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        {/* Radial fade */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,black_70%)]" />
      </div>

      {/* Shared bottom/top fades */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent z-10" />

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
                className="w-48 h-48 md:w-96 md:h-96 object-contain drop-shadow-[0_0_50px_rgba(255,165,0,0.5)]"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="text-center py-4">
                 <h1 className="text-6xl md:text-9xl font-heading text-white tracking-tighter drop-shadow-[0_0_20px_oklch(0.7_0.2_60)]">
                   TEAM <span className="text-primary italic">KARAD</span>
                 </h1>
                 <p className="text-xl md:text-3xl text-primary font-heading tracking-[0.6em] opacity-80 uppercase font-bold mt-2">OFF-ROADERS</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mb-6 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl animate-pulse">
             <div className="w-1.5 h-1.5 rounded-full bg-primary" />
             <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] leading-none">Elite Grid Status: Online</p>
          </div>

          <span className="inline-block px-4 py-1.5 mb-8 text-[10px] md:text-sm font-semibold tracking-widest text-primary border border-primary/30 rounded-full bg-primary/10 backdrop-blur-md uppercase text-center">
            MAY 29, 30, 31 • VENUE: KARAD, MAHARASHTRA
          </span>

          <p className="text-base md:text-2xl text-zinc-300 mb-12 max-w-2xl mx-auto font-sans leading-relaxed">
            Push your limits in the most demanding terrain. Register now to claim your legendary sticker number.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
            <Link 
              href="/register" 
              className={cn(buttonVariants({ size: "lg" }), "h-14 md:h-16 px-8 md:px-12 text-lg md:text-xl font-black rounded-none skew-x-[-12deg] neon-glow bg-primary text-black transition-all hover:scale-105 active:scale-95")}
            >
              <span className="skew-x-[12deg]">REGISTER NOW</span>
            </Link>
            <Link 
              href="/teams" 
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 md:h-16 px-8 md:px-12 text-lg md:text-xl font-bold border-zinc-700 hover:bg-white/5 transition-colors")}
            >
              VIEW TEAMS
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 md:mt-20 border-t border-white/10 pt-10"
        >
          <div className="text-center">
            <Calendar className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-2" />
            <p className="text-zinc-500 text-[10px] md:text-xs uppercase tracking-widest mb-1 font-bold">Date</p>
            <p className="text-white font-heading text-sm md:text-lg text-center leading-tight">MAY 29, 30, 31<br/><span className="text-xs opacity-50">2026</span></p>
          </div>
          <div className="text-center">
            <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-2" />
            <p className="text-zinc-500 text-[10px] md:text-xs uppercase tracking-widest mb-1 font-bold">Location</p>
            <p className="text-white font-heading text-sm md:text-lg">KARAD</p>
          </div>
          <div className="text-center">
            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-2" />
            <p className="text-zinc-500 text-[10px] md:text-xs uppercase tracking-widest mb-1 font-bold">Prize Pool</p>
            <p className="text-white font-heading text-sm md:text-lg">TBA</p>
          </div>
          <div className="text-center">
            <Users className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-2" />
            <p className="text-zinc-500 text-[10px] md:text-xs uppercase tracking-widest mb-1 font-bold">Entries</p>
            <p className="text-white font-heading text-sm md:text-lg">200 MAX</p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-primary rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
