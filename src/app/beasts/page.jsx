"use client";

import { motion } from "framer-motion";
import { Gauge, Fuel, Cog, Zap, Shield, ShieldCheck } from "lucide-react";

const beasts = [
  {
    name: "Dominator",
    type: "PROFESSIONAL_BUILD",
    category: "EXPERT_CATEGORY",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop",
    specs: { engine: "Engineered High-Torque", power: "Lockers / Fiddle Brakes", torque: "Extreme Climbing", tyres: "High performance offroad" },
    wins: "S1_GRID",
    desc: "Dominator is one of the flagship off-road machines of Team Karad Offroaders, purpose-built to compete in professional off-road competitions. Equipped with front and rear differential lockers, fiddle brakes for precise wheel control, and a powerful engineered engine that provides the torque needed to conquer steep climbs, deep mud, and rocky trails."
  },
  {
    name: "Dynamite",
    type: "TECHNICAL_RIVAL",
    category: "EXPERT_CATEGORY",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2070&auto=format&fit=crop",
    specs: { engine: "Finely Tuned Offroad", power: "Lockers / Fiddle Brakes", torque: "6-Point Roll Cage", tyres: "Performance Tyres" },
    wins: "S1_GRID",
    desc: "Engineered with a focus on agility, traction, and strength, Dynamite has been heavily modified to perform under the toughest off-road conditions. With front and rear differential lockers and a precise fiddle brake setup, the vehicle offers exceptional control, allowing the driver to navigate tight technical sections with accuracy."
  },
  {
    name: "Jeep 3210",
    type: "MANOEUVER_EXPERT",
    category: "EXPERT_CATEGORY",
    image: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?q=80&w=2070&auto=format&fit=crop",
    specs: { engine: "Reverse Steering +", power: "Lockers / Fiddle Brakes", torque: "6-Point Roll Cage", tyres: "Technical Spec" },
    wins: "S1_GRID",
    desc: "What truly sets 3210 apart is its reverse steering capability, a specialized feature that provides superior maneuverability in tight and technical obstacles. It is a highly capable machine built for serious off-road competition, producing greater power output through a high-end performance engine."
  },
  {
    name: "Ashwamedh",
    type: "POWER_SYMBOL",
    category: "EXPERT_CATEGORY",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop",
    specs: { engine: "Expert Category", power: "Immense Horsepower", torque: "Track Dominance", tyres: "Offroad Beast" },
    wins: "S1_GRID",
    desc: "Ashwamedh represents speed, endurance, and commanding performance. At first glance, it may appear like a regular jeep, but once it enters the track, it transforms into a true off-road beast, charging through obstacles with the strength and agility of a powerful horse."
  },
  {
    name: "Club 33",
    type: "STRENGTH_REFINED",
    category: "DIESEL_MODIFIED",
    image: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=2070&auto=format&fit=crop",
    specs: { engine: "Refined Tuning", power: "Confidence built", torque: "Spirit of Adventure", tyres: "Offroad Action" },
    wins: "S1_GRID",
    desc: "Built to take on the toughest terrains and competitive off-road challenges. With impressive power and refined tuning, Club 33 moves through mud, rocks, and steep obstacles with confidence and precision, reflecting the spirit of determination that defines the team."
  },
  {
    name: "Major",
    type: "STOCK_WARRIOR",
    category: "STOCK_CATEGORY",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop",
    specs: { engine: "Original Setup", power: "Complete Stock", torque: "Skill Over Tech", tyres: "Factory Spec" },
    wins: "S1_GRID",
    desc: "Major is the stock warrior, proving that true capability lies in simplicity and skill. Maintaining a jeep in complete stock condition and still pushing it through extreme off-road challenges is a test of both the vehicle and the driver's confidence."
  },
  {
    name: "Conqueror",
    type: "ARMY_SPEC_RIG",
    category: "EXPERT_CATEGORY",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop",
    specs: { engine: "Army Rig Upgrade", power: "4-Point Outer Cage", torque: "Military Origins", tyres: "Technical Traction" },
    wins: "S1_GRID",
    desc: "Originally an army-spec rig known for its rugged reliability. Extensively transformed into a purpose-built off-road racer, Conqueror features performance upgrades for mud tracks, rocky sections, and steep climbs, with a reinforced 4-point outer roll cage for safety."
  },
  {
    name: "Stallion",
    type: "TEAM_BACKBONE",
    category: "SUPPORT_STATION",
    image: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?q=80&w=2070&auto=format&fit=crop",
    specs: { engine: "1998 Army Truck", power: "Support Essential", torque: "Logistics Hub", tyres: "Military Grade" },
    wins: "BACKBONE",
    desc: "Originally a 1998 Indian Army Stallion ambulance, this rugged military truck has been converted into a full-scale off-road support vehicle. known as the backbone of the team, carrying spare parts, recovery gear, and technical tools needed during competitions."
  },
];

export default function BeastsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-32 pb-16 md:pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-mesh-amber opacity-10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />

      <section className="px-6 py-12 md:py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] mb-4">The Arsenal</p>
            <h1 className="text-6xl md:text-8xl font-heading tracking-tighter uppercase leading-none mb-8">
              OUR <span className="text-primary italic">BEASTS</span>
            </h1>
            <p className="text-zinc-400 text-xl max-w-2xl leading-relaxed">
              Meet the machines that have conquered every terrain Team Karad Off-Roaders has thrown at them. 
              Built for war, tuned for glory.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto space-y-10">
          {beasts.map((beast, idx) => (
            <motion.div
              key={beast.name}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 md:p-10 flex flex-col lg:flex-row bg-zinc-950 border border-white/5 rounded-[2rem] overflow-hidden group hover:border-primary/20 transition-all"
            >
              {/* Image */}
              <div
                className="w-full lg:w-[400px] h-72 lg:h-auto bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url(${beast.image})` }}
              />

              {/* Content */}
              <div className="flex-1 p-10 lg:p-14">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-xl text-primary text-[10px] font-black uppercase tracking-widest">
                    {beast.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-500 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                    <ShieldCheck className="w-4 h-4 text-primary" /> {beast.wins}
                  </span>
                </div>

                <h3 className="text-3xl lg:text-5xl font-heading text-white uppercase italic leading-none mb-2">
                  {beast.name}
                </h3>
                <p className="text-zinc-600 font-heading text-lg uppercase tracking-widest mb-6">{beast.type}</p>
                <p className="text-zinc-400 leading-relaxed mb-10">{beast.desc}</p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Fuel, label: "Engine", value: beast.specs.engine },
                    { icon: Zap, label: "Power", value: beast.specs.power },
                    { icon: Gauge, label: "Torque", value: beast.specs.torque },
                    { icon: Cog, label: "Tyres", value: beast.specs.tyres },
                  ].map((spec) => (
                    <div key={spec.label} className="p-4 bg-black border border-white/5 rounded-xl">
                      <spec.icon className="w-4 h-4 text-primary mb-2" />
                      <p className="text-zinc-700 text-[9px] font-black uppercase tracking-widest mb-1">{spec.label}</p>
                      <p className="text-white text-[11px] md:text-sm font-heading uppercase leading-tight">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
