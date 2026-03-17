"use client";

import { motion } from "framer-motion";
import { Trophy, Award, Star, Medal, Target, Flame, Crown, Zap } from "lucide-react";

const achievements = [
  { icon: Trophy, title: "10+ Rallies Organized", desc: "Successfully organized over 10 professional off-road events since 2015.", stat: "10+", label: "Events" },
  { icon: Award, title: "500+ Total Participants", desc: "Over 500 drivers and co-drivers have competed in TKO events across all seasons.", stat: "500+", label: "Participants" },
  { icon: Star, title: "National Media Coverage", desc: "Featured in major motorsport publications and national news channels.", stat: "50+", label: "Media Features" },
  { icon: Medal, title: "₹15L+ Prize Money Distributed", desc: "Over ₹15 lakhs in prize money awarded to champions across all categories.", stat: "₹15L+", label: "Prize Pool" },
  { icon: Target, title: "Zero Safety Incidents", desc: "Impeccable safety record with professional medical teams and strict protocols.", stat: "0", label: "Incidents" },
  { icon: Flame, title: "5 Cities Covered", desc: "Events hosted across Karad, Panchgani, Mahabaleshwar, Satara, and Kolhapur.", stat: "5", label: "Cities" },
];

const records = [
  { title: "Fastest Hill Climb", value: "2:34.7s", holder: "Team Thunder — Season 1, 2024", icon: Zap },
  { title: "Most Wins (Single Season)", value: "5 Wins", holder: "Team Sahyadri Warriors — 2024", icon: Crown },
  { title: "Largest Participant Count", value: "180", holder: "TKO Season 1 Grand Finale — 2025", icon: Trophy },
  { title: "Youngest Driver", value: "19 Years", holder: "Rohan Patil — Diesel Modified, 2023", icon: Star },
];

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-28 pb-16 md:pb-20">
      <section className="px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] mb-4">Hall of Glory</p>
            <h1 className="text-[12vw] md:text-8xl font-heading tracking-tighter uppercase leading-none mb-8">
              OUR <span className="text-primary italic">LEGACY</span>
            </h1>
            <p className="text-zinc-400 text-xl max-w-2xl leading-relaxed">
              Every trophy, every record, every milestone tells the story of TKO&apos;s relentless pursuit of off-road excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Achievement Grid */}
      <section className="px-4 py-12 md:py-16 bg-zinc-950">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((a, idx) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="p-8 bg-black border border-white/5 rounded-[2rem] hover:border-primary/20 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 text-6xl font-heading font-black text-white/[0.03] group-hover:text-primary/10 transition-colors">
                {a.stat}
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <a.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-heading text-white uppercase mb-3">{a.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{a.desc}</p>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
                <span className="text-3xl font-heading font-black text-primary">{a.stat}</span>
                <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">{a.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Records */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-heading text-white uppercase tracking-tighter mb-16 text-center">
            ALL-TIME <span className="text-primary italic">RECORDS</span>
          </h2>
          <div className="space-y-4">
            {records.map((r, idx) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 p-6 md:p-8 bg-zinc-950 border border-white/5 rounded-[2rem] hover:border-primary/20 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 group-hover:bg-primary/20">
                  <r.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mb-1">{r.title}</p>
                  <p className="text-white text-xl md:text-2xl font-heading uppercase">{r.value}</p>
                </div>
                <p className="text-zinc-600 text-[10px] font-medium text-left md:text-right max-w-[200px] leading-tight">{r.holder}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
