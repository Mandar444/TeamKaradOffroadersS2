"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Trophy, UsersRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SEASONS = [
  {
    id: "season-1",
    label: "Season 1",
    eyebrow: "2025 Archive",
    categories: [
      {
        name: "Diesel Modified",
        winners: [
          { driver: "Mehboob Karuvadi", coDriver: "To be updated", team: "Keralam" },
          { driver: "Manoj Birajdar", coDriver: "To be updated", team: "KA 28 Offroaders Vijaypura" },
          { driver: "Vidhunjith Mundakkal", coDriver: "To be updated", team: "Keralam" },
        ],
      },
      {
        name: "Petrol Modified",
        winners: [
          { driver: "Sarjerao Kawade", coDriver: "To be updated", team: "SOC Pune" },
          { driver: "Aditya Naik", coDriver: "To be updated", team: "Team Goa" },
          { driver: "Saish Sankpal", coDriver: "To be updated", team: "Club 4x4 Kolhapur" },
        ],
      },
      {
        name: "Diesel Expert",
        winners: [
          { driver: "Asif Faras", coDriver: "To be updated", team: "Team Satara Offroaders" },
          { driver: "Ravi Bhalla", coDriver: "To be updated", team: "SOC Pune" },
          { driver: "Vaibhav Shelukar", coDriver: "To be updated", team: "SOC Pune" },
        ],
      },
      {
        name: "Petrol Expert",
        winners: [
          { driver: "Pratikraj Mohite", coDriver: "To be updated", team: "Team Satara Offroaders" },
          { driver: "Sarjerao", coDriver: "To be updated", team: "SOC Pune" },
          { driver: "Krishnakant Jadhav", coDriver: "To be updated", team: "Kolhapur" },
        ],
      },
      {
        name: "SUV",
        winners: [
          { driver: "Ravi Bhalla", coDriver: "To be updated", team: "SOC Pune" },
          { driver: "Abhijeet Kakade", coDriver: "To be updated", team: "Offroad Wari Nimbuth" },
          { driver: "Tejas Patil", coDriver: "To be updated", team: "MMC Mumbai" },
        ],
      },
      {
        name: "Ladies",
        winners: [
          { driver: "Kavita Desai", coDriver: "To be updated", team: "KA28 Offroaders Vijayapura" },
          { driver: "Shruti Das", coDriver: "To be updated", team: "Pune" },
          { driver: "TBA", coDriver: "To be updated", team: "TBA" },
        ],
      },
    ],
  },
  {
    id: "season-2",
    label: "Season 2",
    eyebrow: "2026 Official Results",
    categories: [
      {
        name: "Thar Stock",
        winners: [
          { driver: "Sunny Benjamin", coDriver: "Shalom Benjamin", team: "Crossover" },
          { driver: "Syed Wasif Husain", coDriver: "Viraj Shelatkar", team: "Crossover" },
          { driver: "Vikrant Jamdar", coDriver: "Karthik Kini", team: "Crossover" },
        ],
      },
      {
        name: "Stock NDMS",
        winners: [
          { driver: "Sarjerao Kawade", coDriver: "Rushikesh", team: "Sahyadri Offroaders" },
          { driver: "Ravi Bhalla", coDriver: "Nilesh Zende", team: "Sahyadri Offroaders" },
          { driver: "Giresh Naidu", coDriver: "Mahesh Biramane", team: "PMW" },
        ],
      },
      {
        name: "Jimny SUV",
        winners: [
          { driver: "Rudra Patil", coDriver: "Rohit Powar", team: "Dakkhan Offroaders" },
        ],
      },
      {
        name: "Diesel Expert",
        winners: [
          { driver: "Enoch Keneeth Varma", coDriver: "Manish Aaron", team: "Ka34 Ballari Offroaders" },
          { driver: "Asif Faras", coDriver: "Saeed Shaikh", team: "Uzma" },
          { driver: "Siddesh Naik", coDriver: "Cletus Pires", team: "Dirt Dominator Goa" },
        ],
      },
      {
        name: "Petrol Expert",
        winners: [
          { driver: "Pratap Karhadkar", coDriver: "Kalidas Dongre", team: "PMW" },
          { driver: "Ritesh Bire", coDriver: "Shaurya Bire", team: "Team Offroaders Pune" },
          { driver: "Kaustubh Memene", coDriver: "Nikhil Bhadale", team: "Sahyadri Offroaders" },
        ],
      },
      {
        name: "Petrol Modified",
        winners: [
          { driver: "Tejan Fallary", coDriver: "Arjun Fallary", team: "MUD FEST" },
          { driver: "Saish Mahesh Sankpal", coDriver: "Athrva Ajit Date", team: "Team Kolhapur" },
          { driver: "Sam Rodriguez", coDriver: "Swapnil Phadte", team: "Team Goa" },
        ],
      },
      {
        name: "Diesel Modified",
        winners: [
          { driver: "Steven Fernandes", coDriver: "Balwant Jagram", team: "Accelerator Boyz Goa" },
          { driver: "Sarjerao Kawade", coDriver: "Rushi", team: "Sahyadri Offroaders" },
          { driver: "Abhishek Pawar", coDriver: "Nijen Cardozo", team: "Team Goa" },
        ],
      },
      {
        name: "Ladies",
        winners: [
          { driver: "Prerana Bhalla", coDriver: "Ravi Bhalla", team: "Sahyadri Offroaders" },
          { driver: "Kavita Desai", coDriver: "Kumar Desai", team: "KA28 Offroaders" },
          { driver: "Rufina Gupte", coDriver: "Ivin", team: "Team Nandi" },
        ],
      },
      {
        name: "SUV Modified",
        winners: [
          { driver: "Harsh Bagale", coDriver: "Manthan", team: "HK/KA28 Offroaders" },
          { driver: "Amit Shete", coDriver: "Rakesh Kulye", team: "Nexon Custom" },
          { driver: "Ulhas Patil", coDriver: "Prakash", team: "KA 28 Offroaders" },
        ],
      },
    ],
  },
];

const PODIUM = [
  {
    label: "1st",
    title: "Champion",
    orderClass: "order-1 md:order-2",
    liftClass: "md:-translate-y-8",
    stepClass: "h-24 border-[#ffd36a]/70 bg-[linear-gradient(180deg,#ffd36a,#b86b13)]",
    trophyClass: "border-[#ffe9a8]/70 bg-[#ffd36a] text-[#2a1600] shadow-[0_0_34px_rgba(255,211,106,0.38)]",
    panelClass: "border-[#ffd36a]/40 bg-[linear-gradient(180deg,rgba(255,211,106,0.18),rgba(255,122,0,0.06))]",
  },
  {
    label: "2nd",
    title: "Runner Up",
    orderClass: "order-2 md:order-1",
    liftClass: "md:translate-y-7",
    stepClass: "h-20 border-[#e7edf7]/60 bg-[linear-gradient(180deg,#e7edf7,#8f9bad)]",
    trophyClass: "border-[#f5f7fb]/70 bg-[#d8e0ef] text-[#111827] shadow-[0_0_28px_rgba(216,224,239,0.28)]",
    panelClass: "border-[#d8e0ef]/30 bg-[linear-gradient(180deg,rgba(216,224,239,0.14),rgba(122,143,171,0.05))]",
  },
  {
    label: "3rd",
    title: "Third Place",
    orderClass: "order-3",
    liftClass: "md:translate-y-12",
    stepClass: "h-16 border-[#f3a45f]/60 bg-[linear-gradient(180deg,#d98745,#7a3918)]",
    trophyClass: "border-[#ffc08a]/70 bg-[#d98745] text-[#170a02] shadow-[0_0_28px_rgba(217,135,69,0.28)]",
    panelClass: "border-[#d98745]/35 bg-[linear-gradient(180deg,rgba(217,135,69,0.16),rgba(98,49,18,0.05))]",
  },
];

function PodiumPlace({ winner, rank }) {
  const podium = PODIUM[rank];

  return (
    <article className={`${podium.orderClass} ${podium.liftClass} flex min-w-0 flex-col`}>
      <div className={`relative flex min-h-[272px] flex-col justify-between overflow-hidden rounded-[8px] border p-4 ${podium.panelClass}`}>
        <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-white/35" />
        <div className="flex items-start justify-between gap-3">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[8px] border ${podium.trophyClass}`}>
            <Trophy className="h-7 w-7 fill-current" />
          </div>
          <div className="text-right">
            <p className="font-mono text-xl font-black uppercase leading-none text-white">{podium.label}</p>
            <p className="mt-1 text-[9px] font-black uppercase tracking-[0.24em] text-[#d9a36d]">{podium.title}</p>
          </div>
        </div>

        <div className="mt-6 min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#ff9a2c]">Driver</p>
          <h3 className="mt-2 break-words font-heading text-2xl uppercase leading-none text-white sm:text-3xl">
            {winner.driver}
          </h3>
          <div className="mt-5 grid gap-4 border-t border-white/10 pt-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#d9a36d]">Co-Driver</p>
              <p className="mt-1 break-words text-sm font-black uppercase leading-snug text-[#fff7ef]">
                {winner.coDriver}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#d9a36d]">Team</p>
              <p className="mt-1 break-words text-sm font-black uppercase leading-snug text-[#fff7ef]">
                {winner.team}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={`mx-3 rounded-b-[8px] border-x border-b ${podium.stepClass}`}>
        <div className="flex h-full items-end justify-center pb-3">
          <span className="font-heading text-4xl font-black uppercase leading-none text-black/35">{podium.label}</span>
        </div>
      </div>
    </article>
  );
}

function CategoryPodium({ category, index }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.05 }}
      className="overflow-hidden rounded-[8px] border border-[#3a210f] bg-[#101010]/95 shadow-[0_18px_46px_rgba(0,0,0,0.28)]"
    >
      <div className="flex items-center gap-3 border-b border-[#3a210f] bg-black/80 px-4 py-4 sm:px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-[#ff7a00]/35 bg-[#ff7a00]/10">
          <Star className="h-5 w-5 fill-[#ff7a00] text-[#ff7a00]" />
        </div>
        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#d9a36d]">Category Podium</p>
          <h2 className="mt-1 break-words font-heading text-2xl uppercase leading-none text-white sm:text-3xl">
            {category.name}
          </h2>
        </div>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-3 md:items-end md:gap-5 md:p-5 md:pb-10">
        {category.winners.map((winner, rank) => (
          <PodiumPlace key={`${category.name}-${winner.driver}-${rank}`} winner={winner} rank={rank} />
        ))}
      </div>
    </motion.section>
  );
}

function SeasonPodiums({ season }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 border-b border-[#3a210f] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.42em] text-[#ff7a00]">{season.eyebrow}</p>
          <h2 className="mt-3 font-heading text-4xl uppercase leading-none text-white sm:text-6xl">
            {season.label} Champions
          </h2>
        </div>
        <div className="flex w-fit items-center gap-3 rounded-[8px] border border-[#3a210f] bg-[#101010] px-4 py-3">
          <UsersRound className="h-5 w-5 text-[#ff7a00]" />
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#d9a36d]">Podium Board</p>
            <p className="mt-1 font-mono text-xs font-black uppercase text-[#fff7ef]">Category Winners</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {season.categories.map((category, index) => (
          <CategoryPodium key={`${season.id}-${category.name}`} category={category} index={index} />
        ))}
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black pb-20 pt-28 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[linear-gradient(180deg,rgba(255,122,0,0.12),transparent)]" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#d9a36d] transition-colors hover:text-[#ff7a00]"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Base
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 mt-9"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-[#ff7a00]/35 bg-[#ff7a00]/10">
                  <Trophy className="h-6 w-6 text-[#ff7a00]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#ff7a00]">Leaderboard</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.25em] text-[#d9a36d]">Season Champions</p>
                </div>
              </div>
              <h1 className="font-heading text-5xl uppercase leading-none text-white sm:text-7xl">
                Hall Of Fame
              </h1>
            </div>
          </div>
        </motion.header>

        <Tabs defaultValue="season-2" className="w-full">
          <div className="mb-8 overflow-x-auto pb-2">
            <TabsList className="h-auto w-max min-w-full justify-start gap-2 rounded-[8px] border border-[#3a210f] bg-[#101010]/95 p-2 sm:min-w-0">
              {SEASONS.map((season) => (
                <TabsTrigger
                  key={season.id}
                  value={season.id}
                  className="shrink-0 rounded-[8px] px-5 py-3 font-heading text-sm uppercase leading-none text-[#d9a36d] transition-all data-[state=active]:bg-[#ff7a00] data-[state=active]:text-black data-[state=active]:shadow-none sm:text-lg"
                >
                  {season.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {SEASONS.map((season) => (
            <TabsContent key={season.id} value={season.id} className="mt-0">
              <SeasonPodiums season={season} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  );
}
