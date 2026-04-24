"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Award, Trophy, Zap, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardSnapshotViewer from "@/components/leaderboard/LeaderboardSnapshotViewer";

const seasonOneWinners = {
  "Diesel Modified": [
    { place: "1st", name: "Mehboob Karuvadi", team: "Keralam" },
    { place: "2nd", name: "Manoj Birajdar", team: "KA 28 Offroaders Vijaypura" },
    { place: "3rd", name: "Vidhunjith Mundakkal", team: "Keralam" },
  ],
  "Petrol Modified": [
    { place: "1st", name: "Sarjerao Kawade", team: "SOC Pune" },
    { place: "2nd", name: "Aditya Naik", team: "Team Goa" },
    { place: "3rd", name: "Saish Sankpal", team: "Club 4x4 Kolhapur" },
  ],
  "Diesel Expert": [
    { place: "1st", name: "Asif Faras", team: "Team Satara Offroaders" },
    { place: "2nd", name: "Ravi Bhalla", team: "SOC Pune" },
    { place: "3rd", name: "Vaibhav Shelukar", team: "SOC Pune" },
  ],
  "Petrol Expert": [
    { place: "1st", name: "Pratikraj Mohite", team: "Team Satara Offroaders" },
    { place: "2nd", name: "Sarjerao", team: "SOC Pune" },
    { place: "3rd", name: "Krishnakant Jadhav", team: "Kolhapur" },
  ],
  SUV: [
    { place: "1st", name: "Ravi Bhalla", team: "SOC Pune" },
    { place: "2nd", name: "Abhijeet Kakade", team: "Offroad Wari Nimbuth" },
    { place: "3rd", name: "Tejas Patil", team: "MMC Mumbai" },
  ],
  Ladies: [
    { place: "1st", name: "Kavita Desai", team: "KA28 Offroaders Vijayapura" },
    { place: "2nd", name: "Shruti Das", team: "Pune" },
    { place: "3rd", name: "TBA", team: "TBA" },
  ],
};

const SEASON_ONE_CATEGORIES = [
  "Diesel Modified",
  "Petrol Modified",
  "Diesel Expert",
  "Petrol Expert",
  "SUV",
  "Ladies",
];

function VictoryShieldCard({ entry, rank, heightClass, spotlight = false }) {
  const shieldStyle = {
    clipPath: "polygon(50% 0%, 92% 12%, 100% 42%, 50% 100%, 0% 42%, 8% 12%)",
  };

  return (
    <div
      className={`relative ${heightClass} ${spotlight ? "shadow-[0_0_60px_rgba(255,165,0,0.25)]" : ""}`}
      style={shieldStyle}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/25 via-zinc-900 to-black border border-primary/20" />
      <div className="absolute inset-[10px] bg-black/80" style={shieldStyle} />
      <div className="absolute inset-[10px] border border-white/10" style={shieldStyle} />

      <div className="relative z-10 h-full flex flex-col items-center text-center px-5 py-8">
        <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-3">{rank}</p>
        <div className="w-40 h-40 md:w-48 md:h-48 overflow-hidden">
          <Image
            src="/images/season1-victory-shield.png"
            alt="Season 1 victory shield"
            width={192}
            height={192}
            className="w-full h-full object-contain"
            priority={rank === "1st"}
          />
        </div>

        <div className="mt-6 rounded-2xl bg-black/85 backdrop-blur-md border border-primary/20 px-5 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.45)] w-full max-w-[240px]">
          <h4 className="text-lg md:text-2xl font-heading uppercase italic leading-none text-white">
            {entry?.name || "Winner Name"}
          </h4>
          <p className="text-zinc-300 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mt-2">
            {entry?.team || "Team Name"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const winners = selectedCategory ? seasonOneWinners[selectedCategory] || [] : [];

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[60%] h-[50vh] bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />

      <div className="max-w-[1920px] mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-3xl border border-primary/20 flex items-center justify-center mb-8 relative">
            <Trophy className="w-12 h-12 text-primary" />
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
          </div>

          <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] mb-4">Tactical Standings</p>
          <h1 className="text-6xl md:text-8xl font-heading tracking-tighter uppercase leading-none mb-6">LEADERBOARD</h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-3xl leading-relaxed">
            Switch between the latest saved leaderboard snapshot and the season victory archive.
          </p>
        </motion.div>

        <div className="mt-12">
          <Tabs defaultValue="live" className="w-full">
            <div className="flex justify-center">
              <TabsList className="h-auto rounded-3xl bg-zinc-950/80 border border-white/5 p-3 gap-3">
                <TabsTrigger
                  value="live"
                  className="px-7 py-4 md:px-10 md:py-5 rounded-2xl font-heading text-lg md:text-2xl uppercase tracking-tighter text-white/55 transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none hover:text-white"
                >
                  LIVE LEADERBOARD
                </TabsTrigger>
                <TabsTrigger
                  value="victory"
                  className="px-7 py-4 md:px-10 md:py-5 rounded-2xl font-heading text-lg md:text-2xl uppercase tracking-tighter text-white/55 transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none hover:text-white"
                >
                  VICTORY SHIELD
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="live" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <LeaderboardSnapshotViewer />
              </motion.div>
            </TabsContent>

            <TabsContent value="victory" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto"
              >
                <div className="rounded-[2.5rem] border border-white/5 bg-zinc-950/75 backdrop-blur-3xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
                  <div className="relative z-10 p-6 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                      <div>
                        <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-2">VICTORY SHIELD</p>
                        <h2 className="text-4xl md:text-6xl font-heading uppercase tracking-tighter leading-none italic">
                          Season <span className="text-primary not-italic">Champions</span>
                        </h2>
                      </div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.35em] w-fit">
                        <Award className="w-4 h-4" />
                        Ready for Champions
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-black/60 p-6 md:p-8 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-60" />
                        <div className="relative z-10">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center overflow-hidden">
                              <Image
                                src="/images/season1-victory-shield.png"
                                alt="Season 1 victory shield"
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                                priority
                              />
                            </div>
                            <div>
                              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.35em] mb-1">Victory Card</p>
                              <h3 className="text-2xl md:text-4xl font-heading uppercase italic leading-none">
                                Season <span className="text-primary not-italic">1</span>
                              </h3>
                            </div>
                          </div>

                          <p className="text-zinc-400 leading-relaxed mb-6">
                            The original run that kicked off Team Karad Off-Roaders Season 1 and defined the archive.
                          </p>

                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { label: "Year", value: "2025" },
                              { label: "Status", value: "Closed" },
                              { label: "Badge", value: "Legend" },
                            ].map((item) => (
                              <div key={item.label} className="rounded-2xl border border-white/5 bg-zinc-950/80 p-4">
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.35em] mb-2">{item.label}</p>
                                <p className="text-xl md:text-2xl font-heading uppercase italic leading-none text-white">{item.value}</p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-6">
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.35em] mb-3">Vehicle Categories</p>
                            <div className="flex flex-wrap gap-2">
                              {SEASON_ONE_CATEGORIES.map((category) => (
                                <button
                                  key={category}
                                  type="button"
                                  onClick={() => setSelectedCategory(category)}
                                  className="px-3 py-2 rounded-full border border-white/10 bg-zinc-950/80 text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] text-zinc-300 hover:border-primary/30 hover:text-primary transition-colors"
                                >
                                  {category}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/15 to-black p-6 md:p-8 group">
                        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
                        <div className="relative z-10">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                              <Zap className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.35em] mb-1">Victory Card</p>
                              <h3 className="text-2xl md:text-4xl font-heading uppercase italic leading-none">
                                Season <span className="text-primary not-italic">2</span>
                              </h3>
                            </div>
                          </div>

                          <p className="text-zinc-300 leading-relaxed mb-6">
                            The active championship season, reserved for live results, final rankings, and the winning moment.
                          </p>

                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { label: "Year", value: "2026" },
                              { label: "Status", value: "Live" },
                              { label: "Badge", value: "Elite" },
                            ].map((item) => (
                              <div key={item.label} className="rounded-2xl border border-white/5 bg-black/60 p-4">
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.35em] mb-2">{item.label}</p>
                                <p className="text-xl md:text-2xl font-heading uppercase italic leading-none text-white">{item.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedCategory && winners.length > 0 && (
                      <div className="rounded-[2rem] border border-white/5 bg-black/60 p-6 md:p-8 mt-8">
                        <div className="flex items-center justify-between gap-4 mb-8">
                          <div>
                            <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-2">Season Winner Card</p>
                            <h3 className="text-3xl md:text-5xl font-heading uppercase tracking-tighter leading-none">
                              {selectedCategory}
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedCategory(null)}
                            className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:translate-y-0">
                            <VictoryShieldCard entry={winners[1]} rank="2nd" heightClass="h-[420px] md:h-[500px]" />
                          </div>
                          <div className="md:-translate-y-12">
                            <VictoryShieldCard entry={winners[0]} rank="1st" heightClass="h-[420px] md:h-[500px]" spotlight />
                          </div>
                          <div className="md:translate-y-16">
                            <VictoryShieldCard entry={winners[2]} rank="3rd" heightClass="h-[420px] md:h-[500px]" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="rounded-[2rem] border border-white/5 bg-black/60 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-8">
                      <div>
                        <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-2">Victory Panel</p>
                        <h3 className="text-3xl font-heading uppercase italic leading-none mb-3">
                          The card that crowns the winner.
                        </h3>
                        <p className="text-zinc-400 leading-relaxed max-w-2xl">
                          This tab is reserved for season victory summaries, champion highlights, and celebration graphics.
                        </p>
                      </div>
                      <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-black font-black uppercase tracking-[0.35em] text-[10px] hover:scale-105 transition-transform w-fit"
                      >
                        Join the Grid
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-primary text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors"
          >
            ← Return to Base
          </Link>
        </div>
      </div>

    </div>
  );
}
