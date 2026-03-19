"use client";

import { motion } from "framer-motion";

const events = [
  {
    year: "2026",
    name: "Team Karad Off-Road Event Season 2",
    image: "/images/season2-hero.jpg",
    stats: "35,000+ Spectators • 160+ Elite Entries"
  }
];

export default function PastEvents() {
  return (
    <section className="py-24 px-4 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl font-heading text-white mb-2 uppercase italic tracking-tighter leading-none">
            RACE <span className="text-primary italic">CHRONICLES</span>
          </h2>
          <p className="text-zinc-500 font-medium tracking-wide">The adrenaline-fueled saga of Team Karad Off-Roaders.</p>
        </div>

        <div className="grid grid-cols-1 gap-12 max-w-4xl mx-auto">
          {events.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="group relative h-[450px] overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: `url(${event.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-10 w-full">
                <div className="bg-primary/95 text-black font-black text-[10px] tracking-[0.4em] px-4 py-1.5 rounded-full w-fit mb-6 uppercase">
                   {event.year} MISSION
                </div>
                <h3 className="text-4xl font-heading text-white mb-3 italic uppercase tracking-tighter leading-none">{event.name}</h3>
                <p className="text-zinc-400 text-sm font-medium tracking-widest uppercase opacity-80">{event.stats}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
