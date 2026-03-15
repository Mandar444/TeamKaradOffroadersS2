"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Target, Heart, Shield, Zap, Users, Trophy, MapPin, Calendar, Activity, ShieldCheck, Globe, Instagram, Newspaper, Share2 } from "lucide-react";

const milestones = [
  { year: "2018", title: "Ignition", desc: "A group of off-road enthusiasts from Karad came together with a shared vision — to bring world-class motorsport to Western Maharashtra." },
  { year: "2020", title: "First Ascent", desc: "Team Karad Off-Roaders organized its inaugural off-road rally with 40 participants, setting the standard for competitive off-roading in the region." },
  { year: "2022", title: "National Radius", desc: "With over 100 participants and coverage from major motorsport outlets, Team Karad Off-Roaders became a nationally recognized off-road force." },
  { year: "2024", title: "Season 1 Apex", desc: "The first full-season championship format was introduced, attracting elite teams from across India." },
  { year: "2025", title: "The Festival Success", desc: "Flagship 'Team Karad Off-Road Festival' establishes itself as a fast-growing platform for automotive brands and drivers." },
];

const values = [
  { icon: Target, title: "Technical Excellence", desc: "Constant pushing of vehicle engineering and driving performance on extreme, specially designed tracks." },
  { icon: ShieldCheck, title: "Social Responsibility", desc: "Using our 4x4 expertise to assist in road accidents, floods, and natural calamities where others cannot reach." },
  { icon: Users, title: "Passionate Community", desc: "A brotherhood of skilled drivers, mechanics, and off-road specialists sharing a deep bond with the terrain." },
  { icon: Globe, title: "Adventure Culture", desc: "Growing the off-road culture in Western Maharashtra and India while promoting responsible off-roading." },
];

const highlights = [
  { icon: Users, stat: "80+", label: "Elite Participants", sub: "Professional Drivers" },
  { icon: Globe, stat: "7+", label: "Indian States", sub: "National Reach" },
  { icon: Activity, stat: "35K+", label: "Live Spectators", sub: "3-Day Festival" },
  { icon: Share2, stat: "2M+", label: "Social Reach", sub: "Organic Engagement" },
];

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white pt-10 pb-20 relative selection:bg-primary selection:text-black">
      {/* 1. CINEMATIC HERO */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ opacity, scale }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-mesh-amber opacity-30 blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        </motion.div>

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
               OFF-ROADERS <span className="text-white">EST. 2018</span>
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
          <p className="text-[10px] font-black tracking-widest uppercase">Scroll To Deploy</p>
        </div>
      </section>

      {/* 2. CORE IDENTITY SECTION */}
      <section className="px-6 py-32 relative">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective-1000">
             {values.map((v, idx) => (
               <motion.div
                 key={v.title}
                 initial={{ opacity: 0, rotateX: 20, y: 50 }}
                 whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1, duration: 0.8 }}
                 className="p-8 bg-zinc-950 border border-white/5 rounded-3xl group hover:border-primary/40 transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,165,0,0.1)] relative overflow-hidden"
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

      {/* 3. FLAGSHIP SUCCESS HIGHLIGHTS (The Jaw-Dropping Part) */}
      <section className="py-40 bg-zinc-950 relative overflow-hidden">
        {/* Animated Background Lines */}
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
             <h3 className="text-primary text-[11px] font-black uppercase tracking-[0.8em] mb-6">Archive: Season 2025</h3>
             <h2 className="text-6xl md:text-9xl font-heading text-white uppercase tracking-tighter leading-none mb-8">
               MEGA <span className="text-primary italic">SUCCESS</span>
             </h2>
             <p className="text-zinc-500 text-xl max-w-3xl mx-auto font-medium">
               A tremendous success that established the Team Karad Off-Road Festival as 
               a world-class platform for motorsport and adventure.
             </p>
          </div>

          {/* Large Impact Stats */}
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

          {/* Success Story Blocks */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-10">
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="p-10 border border-white/5 rounded-3xl bg-black/40 backdrop-blur-md"
             >
                <div className="flex items-center gap-4 mb-6 text-primary">
                   <Newspaper className="w-6 h-6" />
                   <h5 className="font-black uppercase tracking-widest text-sm">Media Presence</h5>
                </div>
                 <p className="text-zinc-400 leading-relaxed font-medium">
                   Regional newspaper coverage and 200+ off-road vehicles present on-site, 
                   establishing Team Karad Off-Roaders as a fast-growing stage for automotive brands.
                </p>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="p-10 border border-white/5 rounded-3xl bg-black/40 backdrop-blur-md hover:scale-105 transition-transform"
             >
                <div className="flex items-center gap-4 mb-6 text-primary">
                   <Users className="w-6 h-6" />
                   <h5 className="font-black uppercase tracking-widest text-sm">Diversity & Spirit</h5>
                </div>
                <p className="text-zinc-400 leading-relaxed font-medium">
                   Drivers from Maharashtra, Goa, Karnataka, Kerala, Gujarat, Delhi, and Rajasthan 
                   brought strong diversity and competitive fire to the festival.
                </p>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="p-10 border border-white/5 rounded-3xl bg-black/40 backdrop-blur-md"
             >
                <div className="flex items-center gap-4 mb-6 text-primary">
                   <ShieldCheck className="w-6 h-6" />
                   <h5 className="font-black uppercase tracking-widest text-sm">Emergency Support</h5>
                </div>
                <p className="text-zinc-400 leading-relaxed font-medium">
                   Our team actively assists during road accidents and floods, using our specialized 
                   expertise to reach areas where regular vehicles simply cannot.
                </p>
             </motion.div>
          </div>
        </div>
      </section>

      {/* 4. THE JOURNEY TIMELINE */}
      <section className="px-6 py-32 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-24">
             <h3 className="text-primary text-[11px] font-black uppercase tracking-[0.6em] mb-4 italic">Evolution Log</h3>
             <h2 className="text-5xl md:text-7xl font-heading text-white uppercase tracking-tighter">
               THE <span className="text-primary italic">PROGRESSION</span>
             </h2>
          </div>
          
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-px bg-zinc-800" />
            
            <div className="space-y-24">
              {milestones.map((m, idx) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className={`flex items-center w-full ${idx % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                >
                  <div className="hidden md:block w-1/2" />
                  
                  {/* Badge */}
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-black border-2 border-primary/40 rounded-3xl text-primary font-heading font-black text-xl shadow-[0_0_20px_rgba(255,165,0,0.3)] shrink-0">
                     {m.year}
                  </div>

                  <div className={`flex-1 pl-8 md:px-12 text-left ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                     <h4 className="text-2xl md:text-3xl font-heading text-white uppercase mb-2 tracking-widest">{m.title}</h4>
                     <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-md mx-auto md:mx-0">
                        {m.desc}
                     </p>
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
           className="max-w-6xl mx-auto p-16 md:p-32 rounded-[4rem] bg-mesh-amber border border-primary/20 relative overflow-hidden text-center"
         >
            <div className="absolute inset-0 bg-black/60 pointer-events-none" />
            <div className="relative z-10">
               <h2 className="text-5xl md:text-8xl font-heading text-white uppercase mb-8 leading-none italic">
                 JOIN THE <br /> <span className="text-primary not-italic">ELITE</span>
               </h2>
               <p className="text-zinc-300 text-xl max-w-xl mx-auto mb-12 font-medium">
                 Ready to test your limits? Join the 2026 expansion and become part of India&apos;s most thrilling off-road community.
               </p>
               <Link
                  href="/register"
                  className="inline-flex h-16 px-12 items-center bg-primary text-black font-black uppercase tracking-[0.4em] rounded-2xl shadow-[0_0_50px_rgba(255,165,0,0.4)] transition-all hover:scale-105 active:scale-95"
               >
                  Deploy Entry 
               </Link>
            </div>
         </motion.div>
      </section>
    </div>
  );
}
