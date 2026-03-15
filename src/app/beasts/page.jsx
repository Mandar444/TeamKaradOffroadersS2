"use client";

import { motion } from "framer-motion";
import { Gauge, Fuel, Cog, Zap, Shield, Award } from "lucide-react";

const beasts = [
  {
    name: "The Destroyer",
    type: "Mahindra Thar CRDe",
    category: "Diesel Modified",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop",
    specs: { engine: "2.5L CRDe Turbo", power: "320 BHP", torque: "650 Nm", tyres: "35\" Maxxis Bighorn" },
    wins: 12,
    desc: "The undisputed king of Team Karad Off-Roaders. Modified beyond recognition with a custom roll cage, long-travel suspension, and a remapped ECU pushing 320 horses."
  },
  {
    name: "Mud Phantom",
    type: "Maruti Gypsy King",
    category: "Petrol Modified",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2070&auto=format&fit=crop",
    specs: { engine: "1.3L G13BB Turbo", power: "180 BHP", torque: "280 Nm", tyres: "33\" BF Goodrich KM3" },
    wins: 8,
    desc: "Lightweight, agile, and wickedly fast. This turbocharged Gypsy has demolished every time attack record in Team Karad Off-Roaders history."
  },
  {
    name: "Iron Fist",
    type: "Toyota Land Cruiser",
    category: "Diesel Modified",
    image: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?q=80&w=2070&auto=format&fit=crop",
    specs: { engine: "4.2L 1HZ Diesel", power: "280 BHP", torque: "720 Nm", tyres: "37\" Mickey Thompson" },
    wins: 6,
    desc: "Built like a tank. This Land Cruiser is an absolute mountain goat — no terrain is too extreme, no gradient too steep."
  },
  {
    name: "Shadow Runner",
    type: "Mahindra Thar DI",
    category: "Stock 4x4",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop",
    specs: { engine: "2.6L DI NA", power: "63 BHP", torque: "180 Nm", tyres: "31\" AT Tyres" },
    wins: 4,
    desc: "Proof that stock vehicles can conquer anything. Minimal modifications, maximum heart — a true underdog story."
  },
  {
    name: "Trail Breaker",
    type: "Force Gurkha",
    category: "Diesel Modified",
    image: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=2070&auto=format&fit=crop",
    specs: { engine: "2.6L Mercedes OM616", power: "240 BHP", torque: "520 Nm", tyres: "35\" Interco Super Swamper" },
    wins: 5,
    desc: "The dark horse. This Gurkha may look stock from the outside, but underneath lies a Mercedes heart with serious off-road capabilities."
  },
  {
    name: "Nitro Blaze",
    type: "Suzuki Jimny",
    category: "Jimny SUV",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop",
    specs: { engine: "1.5L K15B Petrol", power: "105 BHP", torque: "138 Nm", tyres: "29\" AT Tyres" },
    wins: 3,
    desc: "Small, nimble, and unstoppable. The Jimny's compact size makes it the perfect weapon for tight, technical trails."
  },
];

export default function BeastsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-0 w-full h-[60vh] bg-mesh-amber opacity-10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />

      <section className="px-6 py-20 relative z-10">
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
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col lg:flex-row bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-primary/20 transition-all"
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
                  <span className="flex items-center gap-1.5 text-zinc-500 text-xs font-bold">
                    <Award className="w-4 h-4 text-primary" /> {beast.wins} Wins
                  </span>
                </div>

                <h3 className="text-4xl lg:text-5xl font-heading text-white uppercase italic leading-none mb-2">
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
                      <p className="text-white text-sm font-heading uppercase">{spec.value}</p>
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
