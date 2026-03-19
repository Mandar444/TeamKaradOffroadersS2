"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Gauge, Fuel, Cog, Zap, ArrowRight, ShieldCheck, Trophy, Info, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const beasts = [
  {
    id: "stallion",
    name: "Stallion",
    category: "EXPERT",
    type: "EXPERT DIVISION BUILD",
    image: "https://images.unsplash.com/photo-1541575140244-96c21308bc21?q=80&w=2070&auto=format&fit=crop",
    stats: { engine: "Expert Powertrain", lockers: "Pro-Locker", suspension: "Long Travel" }
  },
  {
    id: "dominator",
    name: "Dominator",
    category: "MODIFIED",
    type: "MODIFIED DIVISION BUILD",
    image: "/images/beasts/dominator/dominator-hero.jpg",
    stats: { engine: "Engineered", lockers: "Front/Rear", brakes: "Fiddle" }
  },
  {
    id: "dynamite",
    name: "Dynamite",
    category: "MODIFIED",
    type: "MODIFIED DIVISION BUILD",
    image: "/images/beasts/dynamite/dynamite-hero.jpg",
    stats: { engine: "Stock Performance", category: "Standard", body: "Modified" }
  },
  {
    id: "jeep-3210",
    name: "Jeep 3210",
    category: "MODIFIED / PRO-MODIFIED",
    type: "MODIFIED & PRO-MODIFIED",
    image: "/images/beasts/jeep3210/jeep3210-hero.jpg",
    stats: { engine: "Performance", lockers: "Front/Rear", steer: "Reverse" }
  },
  {
    id: "ashwamedh",
    name: "Ashwamedh",
    category: "EXPERT",
    type: "EXPERT DIVISION BUILD",
    image: "/images/beasts/ashwamedh/ashwamedh-hero.jpg",
    stats: { engine: "High Power", body: "Reinforced", chassis: "Expert" }
  },
  {
    id: "club-33",
    name: "Club 33",
    category: "EXPERT",
    type: "EXPERT DIVISION BUILD",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop",
    stats: { power: "Refined", grip: "All Terrain", tech: "Expert" }
  },
  {
    id: "thunderstorm",
    name: "Thunderstorm",
    category: "EXPERT",
    type: "EXPERT DIVISION BUILD",
    image: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=2070&auto=format&fit=crop",
    stats: { power: "Extreme", grip: "Pro-Traction", tech: "Expert" }
  },
  {
    id: "major",
    name: "Major",
    category: "EXPERT",
    type: "EXPERT DIVISION BUILD",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop",
    stats: { power: "Expert Level", grip: "Original", tech: "Skill-Based" }
  },
  {
    id: "conqueror",
    name: "Conqueror",
    category: "EXPERT",
    type: "EXPERT DIVISION BUILD",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop",
    stats: { power: "High Performance", grip: "Staked", tech: "Season 2" }
  }
];

function BeastCard({ beast, idx }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  
  // Parallax for the image inside the card
  const imgX = useTransform(mouseXSpring, [-0.5, 0.5], ["-2%", "2%"]);
  const imgY = useTransform(mouseYSpring, [-0.5, 0.5], ["-2%", "2%"]);

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
    <div className="relative group perspective-1000">
      {/* 1. Main Card */}
      <Link href={`/beasts/${beast.id}`} className="block">
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
          className="relative h-[500px] w-full rounded-[3rem] bg-zinc-950 border border-white/5 overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8)] transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-[0_40px_100px_rgba(255,165,0,0.15)]"
        >
          {/* Spotlight Glow Overlay */}
          <div className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,165,0,0.2),transparent_60%)]" />
          
          {/* Parallax Image Layer */}
          <motion.div 
            style={{ x: imgX, y: imgY, scale: 1.15, backgroundImage: `url(${beast.image})` }}
            className="absolute inset-0 bg-cover bg-center grayscale-[0.8] group-hover:grayscale-0 transition-all duration-700"
          />
          
          {/* Glass Overlay with Vignette */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />
          <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

          {/* Card Content (Floating with Z-index) */}
          <div className="absolute bottom-0 left-0 p-10 w-full z-40 transform translate-z-[80px]" style={{ transform: "translateZ(80px)" }}>
             <div className="flex items-center gap-3 mb-6">
                <span className="bg-primary/95 text-black text-[10px] font-black tracking-[0.2em] px-4 py-1.5 rounded-full uppercase shadow-glow">
                   {beast.category}
                </span>
             </div>
             <h3 className="text-5xl font-heading text-white uppercase italic tracking-tighter leading-none mb-4 drop-shadow-2xl">
                {beast.name}
             </h3>
             <p className="text-zinc-500 text-[11px] font-black tracking-[0.6em] uppercase mb-8 ml-1">
                {beast.type}
             </p>
             
             <div className="flex gap-8 pt-8 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-6 group-hover:translate-y-0 duration-500 ease-out">
                 {Object.entries(beast.stats).map(([k, v]) => (
                   <div key={k} className="text-left space-y-1">
                      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{k}</p>
                      <p className="text-white text-[11px] font-heading uppercase group-hover:text-primary transition-colors">{v}</p>
                   </div>
                 ))}
             </div>
          </div>

          {/* Mechanical Detail Border (Inner) */}
          <div className="absolute inset-4 border border-white/5 rounded-[2.2rem] pointer-events-none z-10 group-hover:border-primary/10 transition-colors" />
        </motion.div>
      </Link>

      {/* 2. Reflective Floor (Realistic Bottom Reflection) */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[90%] h-40 pointer-events-none z-[-1] opacity-30 group-hover:opacity-40 transition-opacity duration-700">
          <div 
            className="w-full h-full bg-cover bg-bottom scale-y-[-1] grayscale blur-md mask-linear-gradient"
            style={{ 
              backgroundImage: `url(${beast.image})`,
              maskImage: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
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
