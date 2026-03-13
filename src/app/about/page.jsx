"use client";

import { motion } from "framer-motion";
import { Target, Heart, Shield, Zap, Users, Trophy, MapPin, Calendar } from "lucide-react";

const milestones = [
  { year: "2018", title: "The Beginning", desc: "A group of off-road enthusiasts from Karad came together with a shared vision — to bring world-class motorsport to Western Maharashtra." },
  { year: "2020", title: "First Official Rally", desc: "TKO organized its inaugural off-road rally with 40 participants, setting the standard for competitive off-roading in the region." },
  { year: "2022", title: "National Recognition", desc: "With over 100 participants and coverage from major motorsport outlets, TKO became a nationally recognized off-road event." },
  { year: "2024", title: "Season 1 Championship", desc: "The first full-season championship format was introduced, attracting teams from across India with a prize pool of ₹5,00,000." },
  { year: "2026", title: "Season 2 — The Evolution", desc: "The biggest chapter yet. 200+ participants, 6 categories, 3 days of non-stop off-road action in Karad." },
];

const values = [
  { icon: Target, title: "Our Mission", desc: "To create India's most thrilling and professionally organized off-road championship that pushes both man and machine to their absolute limits." },
  { icon: Heart, title: "Our Passion", desc: "Every rev of the engine, every splash of mud, every victory lap — we live and breathe off-road motorsport. It's not just an event, it's our identity." },
  { icon: Shield, title: "Safety First", desc: "World-class safety protocols, medical teams on standby, and rigorous vehicle inspections ensure every participant returns home safe." },
  { icon: Users, title: "Community", desc: "TKO is more than a rally — it's a brotherhood of off-road warriors. From seasoned pros to first-time adventurers, everyone is family." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20">
      {/* Hero */}
      <section className="px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] mb-4">Our Story</p>
            <h1 className="text-6xl md:text-8xl font-heading tracking-tighter uppercase leading-none mb-8">
              BORN FROM <span className="text-primary italic">DUST</span>
            </h1>
            <p className="text-zinc-400 text-xl max-w-3xl leading-relaxed">
              Team Karad Offroaders started as a dream in the rugged terrains of Western Maharashtra. 
              Today, we are one of India's most exciting off-road championship organizers, bringing 
              the raw power of motorsport to the heartland of the Sahyadris.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="px-4 py-20 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v, idx) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-10 bg-black border border-white/5 rounded-[2rem] hover:border-primary/20 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-heading text-white uppercase mb-4">{v.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-heading text-white uppercase tracking-tighter mb-16 text-center">
            THE <span className="text-primary italic">JOURNEY</span>
          </h2>
          <div className="space-y-0">
            {milestones.map((m, idx) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-8 items-start pb-16 relative"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-heading font-black text-lg shrink-0">
                    {m.year}
                  </div>
                  {idx < milestones.length - 1 && (
                    <div className="w-px h-full bg-white/5 mt-4" />
                  )}
                </div>
                <div className="pt-2">
                  <h3 className="text-2xl font-heading text-white uppercase mb-3">{m.title}</h3>
                  <p className="text-zinc-500 leading-relaxed">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 py-20 bg-primary/5 border-y border-primary/10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "500+", label: "Total Participants", icon: Users },
            { num: "10+", label: "Events Organized", icon: Trophy },
            { num: "5", label: "Cities Covered", icon: MapPin },
            { num: "8", label: "Years of Legacy", icon: Calendar },
          ].map((s, idx) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <s.icon className="w-6 h-6 text-primary mx-auto mb-3" />
              <p className="text-5xl font-heading font-black text-white mb-2">{s.num}</p>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
