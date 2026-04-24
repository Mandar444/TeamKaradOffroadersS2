"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Target, Heart, Shield, Zap, Users, Trophy, MapPin, Calendar, Activity, ShieldCheck, Globe, Instagram, Newspaper, Share2 } from "lucide-react";

const milestones = [
  { year: "2015", title: "Ignition", desc: "Founded by 4x4 enthusiasts to bring professional motorsport to Maharashtra." },
  { year: "2025", title: "Season 1", desc: "Our massive debut event at Karad, attracting 35,000+ spectators and 160+ drivers." },
  { year: "2026", title: "Season 2", desc: "The definitive expansion of the championship format for elite national entries." },
];

const values = [
  { icon: Target, title: "Technical Excellence", desc: "Constant pushing of vehicle engineering and driving performance on extreme, specially designed tracks." },
  { icon: ShieldCheck, title: "Social Responsibility", desc: "Using our 4x4 expertise to assist in road accidents, floods, and natural calamities where others cannot reach." },
  { icon: Users, title: "Passionate Community", desc: "A brotherhood of skilled drivers, mechanics, and off-road specialists sharing a deep bond with the terrain." },
  { icon: Globe, title: "Adventure Culture", desc: "Growing the off-road culture in Western Maharashtra and India while promoting responsible off-roading." },
];

const highlights = [
  { icon: Users, stat: "160+", label: "Elite Entries", sub: "Season 2 Drivers" },
  { icon: Globe, stat: "PAN", label: "National Grid", sub: "All India Entry" },
  { icon: Activity, stat: "8+", label: "Vehicle Categories", sub: "Vehicle Spec" },
  { icon: Shield, stat: "100%", label: "TKO Verified", sub: "Official Safety" },
];

export default function AboutPage() {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white pt-20 pb-20 relative selection:bg-primary selection:text-black overflow-hidden">
      {/* 1. CINEMATIC HERO */}
      <section className="relative h-[90vh] md:h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-mesh-amber opacity-30 blur-[100px]" />
          <div className="absolute inset-0 bg-noise opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "circOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.6em] mb-8 shadow-[0_0_30px_rgba(255,165,0,0.2)]">
               <Activity className="w-3 h-3 animate-pulse" /> Official Team Directive
            </div>
            <h1 className="text-[12vw] md:text-[8vw] font-heading tracking-tighter uppercase leading-none mb-4 italic text-glow-amber">
               TEAM <span className="text-primary not-italic">KARAD</span>
            </h1>
            <h2 className="text-4xl md:text-6xl font-heading text-zinc-500 uppercase tracking-[0.2em] mb-12">
               OFF-ROADERS <span className="text-white">EST. 2015</span>
            </h2>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-zinc-400 text-lg md:text-2xl max-w-4xl mx-auto leading-relaxed font-medium"
          >
             A passionate community of 4x4 enthusiasts based in Karad, Maharashtra, 
             actively participating in and organizing off-road motorsport events across India.
          </motion.p>
        </div>

        {/* Technical HUD element */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
          <div className="w-px h-24 bg-gradient-to-b from-primary to-transparent" />
          <p className="text-[10px] font-black tracking-widest uppercase">Scroll To Explore</p>
        </div>
      </section>

      {/* 2. CORE IDENTITY SECTION */}
      <section className="px-6 py-16 md:py-32 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
             <div className="absolute -left-10 top-0 text-[10rem] font-black text-white/5 pointer-events-none select-none italic leading-none">TEAM KARAD</div>
             <h3 className="text-primary text-[11px] font-black uppercase tracking-[0.6em] mb-6">Autonomous Profile</h3>
             <h2 className="text-5xl md:text-7xl font-heading text-white tracking-widest uppercase mb-8 leading-tight">
               CONQUERING <br /> THE <span className="text-primary italic">UNREACHABLE</span>
             </h2>
             <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
                <p>
                  Our team consists of skilled drivers, co-drivers, mechanics, and off-road specialists 
                  who share a deep interest in adventure, vehicle engineering, and extreme terrain driving.
                </p>
                 <p>
                   From mud tracks and rocky climbs to riverbeds and lethal obstacle courses, we constantly 
                   push the limits of both man and machine. Team Karad Off-Roaders stands for technical excellence, teamwork, 
                   and the relentless pursuit of off-road culture.
                </p>
             </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {values.map((v, idx) => (
               <motion.div
                 key={v.title}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1, duration: 0.5 }}
                 className="p-8 bg-zinc-950/40 border border-white/5 rounded-3xl group hover:border-primary/40 transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,165,0,0.1)] relative overflow-hidden backdrop-blur-md"
               >
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                    <v.icon className="w-20 h-20 text-white" />
                 </div>
                 <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <v.icon className="w-6 h-6 text-primary" />
                 </div>
                 <h4 className="text-xl font-heading text-white uppercase mb-4 group-hover:text-primary transition-colors">{v.title}</h4>
                 <p className="text-zinc-500 text-sm leading-relaxed">{v.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* 3. SEASON 1 READINESS */}
      <section className="py-20 md:py-40 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           {[...Array(5)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-full h-px bg-primary"
               style={{ top: `${20 * i}%` }}
               animate={{ x: i % 2 === 0 ? ["-100%", "100%"] : ["100%", "-100%"] }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
             />
           ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
             <h3 className="text-primary text-[11px] font-black uppercase tracking-[0.8em] mb-6">Current Mission: Season 2</h3>
             <h2 className="text-6xl md:text-9xl font-heading text-white uppercase tracking-tighter leading-none mb-8">
               READY FOR <span className="text-primary italic">THRILL</span>
             </h2>
             <p className="text-zinc-500 text-xl max-w-3xl mx-auto font-medium">
               A high-fidelity championship platform establishing a world-class venue 
               for motorsport and adventure in Western Maharashtra.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {highlights.map((h, idx) => (
               <motion.div
                 key={idx}
                 initial={{ opacity: 0, scale: 0.8 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="flex flex-col items-center p-12 bg-black border border-white/5 rounded-[3rem] relative overflow-hidden group hover:border-primary/50 transition-all duration-500 h-[380px] justify-center text-center shadow-2xl"
               >
                 <div className="absolute inset-0 bg-mesh-amber opacity-0 group-hover:opacity-10 transition-opacity" />
                 <h4 className="text-7xl md:text-8xl font-heading text-white mb-2 group-hover:text-primary transition-colors tracking-tighter">{h.stat}</h4>
                 <p className="text-primary text-xs font-black uppercase tracking-[0.4em] mb-4">{h.label}</p>
                 <div className="h-px w-10 bg-zinc-800 mb-6 group-hover:w-20 group-hover:bg-primary transition-all duration-500" />
                 <p className="text-zinc-500 font-medium text-sm">{h.sub}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. THE JOURNEY TIMELINE - CINEMATIC VERSION */}
      <section className="px-6 py-20 md:py-40 overflow-hidden relative">
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-32">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4"
             >
                <Activity className="w-3 h-3" /> Historical Archive
             </motion.div>
             <h2 className="text-6xl md:text-8xl font-heading text-white uppercase tracking-tighter leading-none">
               THE <span className="text-primary italic">PROGRESSION</span>
             </h2>
             <div className="w-24 h-1 bg-primary/30 mx-auto mt-8 blur-sm animate-pulse" />
          </div>
          
          <div className="relative">
            {/* 1. DYNAMIC NEON PATH */}
            <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-[2px] neon-path opacity-50" />
            
            <div className="space-y-32">
              {milestones.map((m, idx) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className={`flex items-start w-full relative ${idx % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                >
                  {/* Content area */}
                  <div className="hidden md:block w-1/2" />
                  
                  {/* Central Node */}
                  <div className="absolute left-[32px] md:left-1/2 -translate-x-1/2 z-20">
                     <div className="relative">
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="absolute inset-0 bg-primary/40 rounded-full blur-xl"
                        />
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-black border-[3px] border-primary/60 rounded-[2rem] flex flex-col items-center justify-center relative z-10 timeline-glow overflow-hidden group">
                           <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                           <span className="text-primary font-heading font-black text-xs uppercase tracking-tighter opacity-50">Year</span>
                           <span className="text-white font-heading font-black text-xl md:text-2xl leading-none">{m.year}</span>
                        </div>
                     </div>
                  </div>

                  {/* Card area */}
                  <div className={`flex-1 pl-16 md:px-20 text-left ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                     <motion.div 
                       className="p-8 md:p-10 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 backdrop-blur-xl relative group hover:border-primary/30 transition-all duration-500"
                     >
                        <div className="absolute -top-4 left-10 md:left-auto md:right-10 px-4 py-1 bg-primary text-black text-[10px] font-black uppercase tracking-widest skew-x-[-20deg] shadow-[0_10px_20px_rgba(255,165,0,0.2)]">
                           <span className="block skew-x-[20deg]">{m.title}</span>
                        </div>
                        <p className="text-zinc-400 text-sm md:text-lg leading-relaxed font-medium">
                           {m.desc}
                        </p>
                        
                        {/* Decorative corner */}
                        <div className={`absolute bottom-6 ${idx % 2 === 0 ? 'left-6 items-start' : 'right-6 items-end'} flex flex-col gap-1 opacity-20`}>
                           <div className="w-12 h-px bg-white" />
                           <div className="w-6 h-px bg-white" />
                        </div>
                     </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="px-6 py-20">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="max-w-6xl mx-auto p-10 md:p-32 rounded-[2.5rem] md:rounded-[4rem] bg-mesh-amber border border-primary/20 relative overflow-hidden text-center"
         >
            <div className="absolute inset-0 bg-black/60 pointer-events-none" />
            <div className="relative z-10">
               <h2 className="text-5xl md:text-8xl font-heading text-white uppercase mb-8 leading-none italic">
                 JOIN THE <br /> <span className="text-primary not-italic">ELITE</span>
               </h2>
               <p className="text-zinc-300 text-xl max-w-xl mx-auto mb-12 font-medium">
                 Ready to test your limits? Join the Season 2 expansion and become part of India&apos;s most thrilling off-road community.
               </p>
               <Link
                  href="/register"
                  className="inline-flex h-16 px-10 items-center justify-center bg-primary text-black font-black uppercase tracking-widest rounded-2xl shadow-[0_0_50px_rgba(255,165,0,0.4)] transition-all hover:scale-105 active:scale-95 text-sm md:text-base border-none"
               >
                  <span className="whitespace-nowrap">REGISTER NOW</span>
               </Link>
            </div>
         </motion.div>
      </section>
    </div>
  );
}
