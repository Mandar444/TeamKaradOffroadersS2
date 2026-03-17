"use client";

import { motion } from "framer-motion";

const events = [
  {
    year: "2025",
    name: "Team Karad Off-Road Event Season 1",
    image: "https://images.unsplash.com/photo-1541575140244-96c21308bc21?q=80&w=2070&auto=format&fit=crop",
    stats: "35,000+ Spectators • 160+ Experts"
  },
  {
    year: "2024",
    name: "Night Trail Masters",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop",
    stats: "National 4x4 Circuit"
  },
  {
    year: "2023",
    name: "Mud Bogging Championship",
    image: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=2070&auto=format&fit=crop",
    stats: "Western Maharashtra"
  }
];

export default function PastEvents() {
  return (
    <section className="py-24 px-4 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl font-heading text-white mb-2">
            PAST <span className="text-primary italic">MOMENTS</span>
          </h2>
          <p className="text-zinc-500">Relive the adrenaline from previous Team Karad Off-Roaders chapters.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="group relative h-[400px] overflow-hidden rounded-2xl border border-zinc-800"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${event.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="text-primary font-heading tracking-widest text-sm mb-2 block">{event.year}</span>
                <h3 className="text-2xl font-heading text-white mb-1">{event.name}</h3>
                <p className="text-zinc-400 text-sm italic">{event.stats}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
