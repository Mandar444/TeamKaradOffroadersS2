"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Trophy, Clock, ChevronRight, Star } from "lucide-react";
import Link from "next/link";

const pastEvents = [
  {
    year: "2025",
    name: "Team Karad Off-Road Festival",
    location: "Karad, Maharashtra",
    date: "Annual Flagship Event",
    participants: "80+ Elite Participants",
    highlights: ["35,000+ Spectators", "2M+ Social Reach", "7+ States Represented"],
    image: "https://images.unsplash.com/photo-1541575140244-96c21308bc21?q=80&w=2070&auto=format&fit=crop",
  },
  {
    year: "2024",
    name: "Mud Bogging Championship",
    location: "Panchgani, Maharashtra",
    date: "Oct 20-21, 2024",
    participants: "120+ Participants",
    highlights: ["Extreme Mud Track", "Live DJ Night", "₹3L Prize Pool"],
    image: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=2070&auto=format&fit=crop",
  },
  {
    year: "2023",
    name: "Night Trail Masters",
    location: "Mahabaleshwar, Maharashtra",
    date: "Aug 12-13, 2023",
    participants: "80+ Participants",
    highlights: ["12-Hour Night Trail", "Rock Crawling", "Hill Climb"],
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop",
  },
  {
    year: "2022",
    name: "Hill Climb Extreme",
    location: "Karad, Maharashtra",
    date: "May 8-9, 2022",
    participants: "60+ Participants",
    highlights: ["Steep Gradient Challenge", "River Crossing", "Time Attack"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2070&auto=format&fit=crop",
  },
];

const upcomingEvent = {
  name: "TKO RALLY 2026 — SEASON 2",
  date: "May 29, 30, 31 — 2026",
  location: "Karad, Satara District, Maharashtra",
  categories: 6,
  maxParticipants: "200+",
  prizePool: "TBA",
  features: [
    "3 Full Days of Competition",
    "6 Vehicle Categories",
    "Professional Timing System",
    "Live Streaming & Commentary",
    "Medical Team on Standby",
    "Camping & Night Events",
    "Awards Ceremony & Trophies",
    "Food & Entertainment Zone",
  ],
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20">
      {/* Upcoming Event Hero */}
      <section className="px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-10" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Registration Open
            </div>
            <h1 className="text-6xl md:text-8xl font-heading tracking-tighter uppercase leading-none mb-4">
              {upcomingEvent.name.split("—")[0]} <span className="text-primary italic">{upcomingEvent.name.split("—")[1]}</span>
            </h1>
            <div className="flex flex-wrap gap-6 mt-8 text-zinc-400">
              <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> {upcomingEvent.date}</div>
              <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> {upcomingEvent.location}</div>
              <div className="flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> {upcomingEvent.maxParticipants} Entries</div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {upcomingEvent.features.map((f, idx) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="p-5 bg-zinc-950 border border-white/5 rounded-2xl flex items-start gap-3"
              >
                <Star className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-zinc-400 font-medium">{f}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12">
            <Link
              href="/register"
              className="inline-flex items-center h-16 px-12 bg-primary text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all shadow-[0_0_40px_rgba(255,165,0,0.2)]"
            >
              Register Now <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Past Events */}
      <section className="px-4 py-24 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-heading text-white uppercase tracking-tighter mb-4">
            PAST <span className="text-primary italic">HIGHLIGHTS</span>
          </h2>
          <p className="text-zinc-500 text-lg mb-16">Relive the adrenaline from previous TKO chapters.</p>

          <div className="space-y-8">
            {pastEvents.map((event, idx) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col md:flex-row gap-0 bg-black border border-white/5 rounded-[2rem] overflow-hidden group hover:border-primary/20 transition-all"
              >
                <div
                  className="w-full md:w-80 h-56 md:h-auto bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url(${event.image})` }}
                />
                <div className="flex-1 p-10">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-4 py-1 bg-primary/10 border border-primary/20 rounded-lg text-primary font-heading font-black text-sm">{event.year}</span>
                    <span className="text-zinc-700 text-[10px] font-black uppercase tracking-widest">{event.date}</span>
                  </div>
                  <h3 className="text-3xl font-heading text-white uppercase mb-3">{event.name}</h3>
                  <div className="flex flex-wrap gap-4 mb-6 text-zinc-500 text-sm">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.location}</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {event.participants}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {event.highlights.map((h) => (
                      <span key={h} className="px-3 py-1 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-400 font-bold uppercase tracking-wider">{h}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
