"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Gauge, Fuel, Cog, Zap, ArrowRight, ShieldCheck, Trophy, Info, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const beasts = [
  {
    id: "dominator",
    name: "Dominator",
    type: "PROFESSIONAL_BUILD",
    category: "EXPERT_CATEGORY",
    image: "https://images.unsplash.com/photo-1541575140244-96c21308bc21?q=80&w=2070&auto=format&fit=crop",
    stats: { power: "High-Torque", grip: "Offroad Spec", tech: "Fiddle Brakes" }
  },
  {
    id: "dynamite",
    name: "Dynamite",
    type: "TECHNICAL_RIVAL",
    category: "EXPERT_CATEGORY",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2070&auto=format&fit=crop",
    stats: { power: "Finely Tuned", grip: "Extreme Traction", tech: "Lockers" }
  },
  {
    id: "jeep-3210",
    name: "Jeep 3210",
    type: "MANOEUVER_EXPERT",
    category: "EXPERT_CATEGORY",
    image: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?q=80&w=2070&auto=format&fit=crop",
    stats: { power: "Performance", grip: "Technical Spec", tech: "Reverse Steer" }
  },
  {
    id: "ashwamedh",
    name: "Ashwamedh",
    type: "POWER_SYMBOL",
    category: "EXPERT_CATEGORY",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop",
    stats: { power: "Immense HP", grip: "Track Beast", tech: "Reinforced" }
  },
  {
    id: "club-33",
    name: "Club 33",
    type: "STRENGTH_REFINED",
    category: "DIESEL_MODIFIED",
    image: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=2070&auto=format&fit=crop",
    stats: { power: "Refined", grip: "All Terrain", tech: "Precision" }
  },
  {
    id: "major",
    name: "Major",
    type: "STOCK_WARRIOR",
    category: "STOCK_CATEGORY",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop",
    stats: { power: "OEM Stock", grip: "Original", tech: "Skill-Based" }
  }
];

function BeastCard({ beast, idx }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    setMousePos({ x: mouseX, y: mouseY });

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Link href={`/beasts/${beast.id}`} className="group relative">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          rotateX, 
          rotateY, 
          transformStyle: "preserve-3d",
          "--mouse-x": `${mousePos.x}px`,
          "--mouse-y": `${mousePos.y}px`
        }}
        className="relative h-[450px] w-full rounded-[2.5rem] bg-zinc-900 border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-primary/20"
      >
        {/* Reflection / Glow Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,165,0,0.15),transparent_80%)]" />
        
        {/* Base Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
          style={{ backgroundImage: `url(${beast.image})` }}
        />
        
        {/* Overlay Darken */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Info */}
        <div className="absolute bottom-0 left-0 p-8 w-full z-20" style={{ transform: "translateZ(50px)" }}>
           <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary/95 text-black text-[9px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
                 {beast.category}
              </span>
           </div>
           <h3 className="text-4xl font-heading text-white uppercase italic tracking-tighter leading-none mb-2">{beast.name}</h3>
           <p className="text-zinc-400 text-[10px] font-black tracking-[0.4em] uppercase mb-6 opacity-80">{beast.type}</p>
           
           <div className="flex gap-4 pt-6 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
               {Object.entries(beast.stats).map(([k, v]) => (
                 <div key={k} className="text-left">
                    <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">{k}</p>
                    <p className="text-white text-[10px] font-heading uppercase">{v}</p>
                 </div>
               ))}
           </div>
        </div>

        {/* Reflection Effect at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>
      
      {/* Decorative Shadow/Glow underneath the card */}
      <div className="absolute -inset-2 bg-primary/10 blur-2xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
    </Link>
  );
}

export default function BeastsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-32 pb-16 md:pb-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-mesh-amber opacity-10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />

      <section className="px-6 py-12 md:py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] mb-4">Tactical Arsenal</p>
            <h1 className="text-6xl md:text-8xl font-heading tracking-tighter uppercase leading-none mb-8">
              THE <span className="text-primary italic">BEASTS</span>
            </h1>
            <p className="text-zinc-400 text-xl max-w-2xl leading-relaxed font-medium">
              Cinematic profiles of the off-road machines engineered to dominate Season 2. 
              Built for war, refined for victory.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-6 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {beasts.map((beast, idx) => (
            <BeastCard key={beast.id} beast={beast} idx={idx} />
          ))}
        </div>
      </section>

      <section className="px-6 py-20 text-center relative z-10">
         <Link href="/regulations" className="group inline-flex items-center gap-4 p-8 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
               <Info className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
               <p className="text-white font-heading text-xl uppercase italic">Check Technical Regulations</p>
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Verify class specs for Season 2</p>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-primary group-hover:translate-x-1 transition-all" />
         </Link>
      </section>
    </div>
  );
}
