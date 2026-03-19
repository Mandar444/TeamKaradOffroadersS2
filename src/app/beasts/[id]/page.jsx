"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { Gauge, Fuel, Cog, Zap, ShieldCheck, Trophy, Info, ChevronLeft, LayoutGrid, Camera, Settings, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const beastData = {
    "stallion": {
    name: "Stallion",
    type: "EXPERT DIVISION BUILD",
    category: "EXPERT",
    heroImage: "https://images.unsplash.com/photo-1541575140244-96c21308bc21?q=80&w=2070&auto=format&fit=crop",
    desc: "Stallion is the ultimate power build in our Season 2 expert division. Engineered for raw strength and technical agility, it combines a high-torque powertrain with a custom suspension setup designed to maintain traction where others fail. A true force of nature on the grid.",
    specs: [
      { label: "Stability", value: "Expert Articulation", icon: Gauge },
      { label: "Control", value: "Pro Diff Lockers", icon: Zap },
      { label: "Build", value: "Season 2 Vanguard", icon: Cog },
      { label: "Engine", value: "Technical Mastery", icon: Fuel },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop",
    ]
  },
    dominator: {
    name: "Dominator",
    type: "MODIFIED DIVISION BUILD",
    category: "MODIFIED",
    heroImage: "/images/beasts/dominator/dominator-hero.jpg",
    desc: "Dominator is one of the flagship off-road machines of Team Karad Offroaders, purpose-built to compete in professional off-road competitions. Equipped with front and rear differential lockers, fiddle brakes for precise wheel control, and a powerful engineered engine that provides the torque needed to conquer steep climbs, deep mud, and rocky trails.",
    specs: [
      { label: "Engine", value: "Engineered High-Torque", icon: Fuel },
      { label: "Performance", value: "Lockers / Fiddle Brakes", icon: Zap },
      { label: "Stability", value: "Extreme Climbing", icon: Gauge },
      { label: "Tactical", value: "High performance offroad", icon: Cog },
    ],
    gallery: [
      "/images/beasts/dominator/dominator-1.jpg",
      "/images/beasts/dominator/dominator-2.jpg",
      "/images/beasts/dominator/dominator-3.jpg",
      "/images/beasts/dominator/dominator-4.jpg",
    ]
  },
    dynamite: {
    name: "Dynamite",
    type: "MODIFIED DIVISION BUILD",
    category: "MODIFIED",
    heroImage: "/images/beasts/dynamite/dynamite-hero.jpg",
    desc: "Dynamite is a testament to the skill of the driver combined with precision technical modifications. Competing in the Modified division, it represents the perfect balance of raw power and trail control, engineered to tackle obstacles that stop standard vehicles in their tracks.",
    specs: [
      { label: "Category", value: "Modified Performance", icon: Gauge },
      { label: "Control", value: "Precision Steering", icon: Zap },
      { label: "Reliability", value: "Field-Proven", icon: Fuel },
      { label: "Handling", value: "Technical Terrain", icon: Cog },
    ],
    gallery: [
      "/images/beasts/dynamite/dynamite-1.jpg",
      "/images/beasts/dynamite/dynamite-2.jpg",
      "/images/beasts/dynamite/dynamite-3.jpg",
    ]
  },
  "jeep-3210": {
     name: "Jeep 3210",
     type: "MODIFIED & PRO-MODIFIED",
     category: "MODIFIED / PRO-MODIFIED",
     heroImage: "/images/beasts/jeep3210/jeep3210-hero.jpg",
     desc: "3210 is another formidable off-road machine from Team Karad Offroaders, engineered to perform in the most demanding off-road racing environments. Built with extensive professional modifications, this jeep is designed to deliver exceptional power, control, and reliability while tackling extreme terrains and technical obstacles. What truly sets 3210 apart is its reverse steering capability, a specialized feature that provides superior maneuverability in tight and technical obstacles.",
     specs: [
       { label: "Maneuver", value: "REVERSE STEERING", icon: Activity },
       { label: "Control", value: "FIDDLE BRAKES / LOCKERS", icon: Zap },
       { label: "Stability", value: "High Articulation Shocks", icon: Gauge },
       { label: "Safety", value: "6-Point Roll Cage", icon: ShieldCheck },
     ],
     gallery: [
       "/images/beasts/jeep3210/jeep3210-1.jpg",
       "/images/beasts/jeep3210/jeep3210-2.jpg",
       "/images/beasts/jeep3210/jeep3210-3.jpg",
     ]
  },
    ashwamedh: {
     name: "Ashwamedh",
     type: "EXPERT DIVISION BUILD",
     category: "EXPERT",
     heroImage: "/images/beasts/ashwamedh/ashwamedh-hero.jpg",
     desc: "Ashwamedh represents speed, endurance, and commanding performance. At first glance, it may appear like a regular jeep, but once it enters the track, it transforms into a true off-road beast, charging through obstacles with the strength and agility of a powerful horse.",
     specs: [
       { label: "Endurance", value: "High Performance", icon: Gauge },
       { label: "Stability", value: "Reinforced Chassis", icon: Zap },
       { label: "Build", value: "Competition Ready", icon: Cog },
       { label: "Drive", value: "Precision Control", icon: Fuel },
     ],
     gallery: [
       "/images/beasts/ashwamedh/ashwamedh-1.jpg",
       "/images/beasts/ashwamedh/ashwamedh-2.png",
     ]
  },
    "club-33": {
     name: "Club 33 Thunderstorm",
     type: "EXPERT DIVISION BUILD",
     category: "EXPERT",
     heroImage: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=2070&auto=format&fit=crop",
     desc: "Built to take on the toughest terrains and competitive off-road challenges. With impressive power and refined tuning, Club 33 Thunderstorm moves through mud, rocks, and steep obstacles with confidence and precision, reflecting the spirit of determination that defines the team.",
     specs: [
       { label: "Build", value: "Refined Tuning", icon: Fuel },
       { label: "Spirit", value: "Confidence built", icon: Zap },
       { label: "Trail", value: "Spirit of Adventure", icon: Gauge },
       { label: "Grip", value: "Offroad Action", icon: Cog },
     ],
     gallery: [
       "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop",
     ]
  },
    major: {
     name: "Major",
     type: "EXPERT DIVISION BUILD",
     category: "EXPERT",
     heroImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop",
     desc: "Major is the expert level warrior, proving that true capability lies in simplicity and skill. Pushing it through extreme off-road challenges is a test of both the vehicle and the driver's confidence.",
     specs: [
       { label: "OEM", value: "Expert Tuning", icon: Fuel },
       { label: "Core", value: "Reinforced Structure", icon: Zap },
       { label: "Tactic", value: "Mastery Over Terrain", icon: Gauge },
       { label: "Rim", value: "Expert Performance", icon: Cog },
     ],
     gallery: [
       "https://images.unsplash.com/photo-1541575140244-96c21308bc21?q=80&w=2070&auto=format&fit=crop",
     ]
  },
    conqueror: {
     name: "Conqueror",
     type: "EXPERT DIVISION BUILD",
     category: "EXPERT",
     heroImage: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop",
     desc: "The newest addition to the expert category fleet. Conqueror lives up to its name by dominating technically demanding obstacles where power and precision must work in perfect harmony. Designed for the Season 2 championship, it features advanced technical enhancements for the most rugged conditions.",
     specs: [
       { label: "Drive", value: "Advanced 4WD", icon: Zap },
       { label: "Stability", value: "Competition Spec", icon: Gauge },
       { label: "Build", value: "New Generation", icon: Cog },
       { label: "Spirit", value: "Built to Rule", icon: Fuel },
     ],
     gallery: [
        "https://images.unsplash.com/photo-1605281317010-fe5ffe798156?q=80&w=2000&auto=format&fit=crop"
     ]
  }
};

export default function BeastDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const beast = beastData[id];

  if (!beast) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
         <p className="text-zinc-500 font-heading">Beast Not Found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-primary selection:text-black">
      {/* 1. HERO SECTION */}
      <section className="relative h-[70vh] md:h-[90vh] flex items-end">
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale-[0.3]"
          style={{ backgroundImage: `url(${beast.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 pb-16 relative z-10 w-full">
           <Link href="/beasts" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase font-black tracking-widest text-[10px] mb-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
              <ChevronLeft className="w-4 h-4" /> BACK TO ARSENAL
           </Link>
           
           <motion.div
             initial={{ opacity: 0, x: -30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
           >
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-px w-10 bg-primary" />
                 <span className="text-primary text-[10px] font-black tracking-[0.6em] uppercase leading-none">{beast.category}</span>
              </div>
              <h1 className="text-6xl md:text-[10vw] font-heading text-white uppercase italic tracking-tighter leading-none mb-4">{beast.name}</h1>
              <p className="text-zinc-500 text-sm md:text-2xl font-heading uppercase tracking-[0.2em]">{beast.type}</p>
           </motion.div>
        </div>
      </section>

      {/* 2. SPECS & MISSION PROFILE */}
      <section className="py-24 px-6 relative">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
            {/* Mission Intel */}
            <div className="lg:col-span-7 space-y-12">
               <div>
                  <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.6em] mb-4 flex items-center gap-2">
                     <Info className="w-4 h-4 text-primary" /> Tactical Briefing
                  </h3>
                  <p className="text-zinc-300 text-xl md:text-2xl leading-relaxed font-medium">
                     {beast.desc}
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {beast.specs.map((spec, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-8 bg-zinc-900/40 border border-white/5 rounded-3xl group hover:border-primary/30 transition-all duration-500"
                    >
                       <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <spec.icon className="w-6 h-6 text-primary shadow-glow" />
                       </div>
                       <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-2">{spec.label}</p>
                       <p className="text-white font-heading text-lg md:text-xl uppercase">{spec.value}</p>
                    </motion.div>
                  ))}
               </div>
            </div>

            {/* Quick Stats sidebar */}
            <div className="lg:col-span-5">
               <div className="sticky top-32 p-10 bg-zinc-900 border border-white/5 rounded-[3rem] shadow-2xl space-y-10">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(255,165,0,0.3)]">
                        <Trophy className="w-6 h-6 text-black" />
                     </div>
                     <div>
                        <h4 className="text-white font-heading text-xl uppercase italic">Grid Record</h4>
                        <p className="text-primary text-[10px] font-black tracking-widest uppercase opacity-80">Season 1 Veteran</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center py-4 border-b border-white/5">
                       <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Build Status</span>
                       <span className="text-emerald-400 font-black text-[10px] tracking-widest uppercase flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4" /> READY TO COMPETITION
                       </span>
                    </div>
                  </div>

                  <a 
                    href={`https://wa.me/917020440073?text=${encodeURIComponent(`Hi TKO, I am interested in the Technical Specs for the Beast: ${beast.name}. Please share more details.`)} focus`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full h-16 bg-white text-black font-black uppercase tracking-widest text-[10px] items-center justify-center hover:bg-primary transition-all rounded-2xl"
                  >
                    <Activity className="w-4 h-4 mr-2" /> Request Technical Specs
                  </a>
               </div>
            </div>
         </div>
      </section>

      {/* 3. GALLERY SECTION */}
      <section className="py-24 px-6 bg-zinc-950">
         <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-16 px-4">
               <div>
                  <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.8em] mb-4 leading-none">Intelligence</h3>
                  <h2 className="text-4xl md:text-6xl font-heading text-white uppercase italic tracking-tighter leading-none">
                     IMAGE <span className="text-primary italic"> ARCHIVE</span>
                  </h2>
               </div>
               <Camera className="w-12 h-12 text-zinc-900 hidden md:block" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {beast.gallery.map((img, idx) => (
                 <motion.div
                   key={idx}
                   whileHover={{ scale: 1.02, rotate: idx % 2 === 0 ? 1 : -1 }}
                   className="relative h-[400px] rounded-[2.5rem] overflow-hidden border border-white/10 group shadow-2xl"
                 >
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${img})` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 </motion.div>
               ))}
               
               {/* Placeholder cards for empty gallery slots */}
               {[...Array(Math.max(0, 3 - beast.gallery.length))].map((_, i) => (
                 <div key={i} className="h-[400px] rounded-[2.5rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-zinc-800">
                    <Camera className="w-12 h-12 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Upcoming Media...</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 4. CTA FOOTER */}
      <section className="py-20 px-6">
         <div className="max-w-4xl mx-auto p-12 bg-primary/5 border border-primary/10 rounded-[3rem] text-center">
             <h2 className="text-4xl font-heading text-white uppercase italic mb-8">BUILD YOUR OWN <span className="text-primary"> LEGEND?</span></h2>
             <Link href="/register" className="inline-flex h-16 px-12 items-center justify-center bg-primary text-black font-black uppercase tracking-widest rounded-2xl shadow-[0_0_50px_rgba(255,165,0,0.3)] hover:scale-105 transition-all text-sm">
                JOIN SEASON 2 GRID
             </Link>
         </div>
      </section>
    </div>
  );
}
