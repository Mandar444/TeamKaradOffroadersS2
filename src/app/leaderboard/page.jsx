"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Crown, Medal, Trophy, UsersRound } from "lucide-react";

const WINNER_CATEGORIES = [
  {
    name: "Thar Stock",
    winners: [
      { driver: "Sunny Benjamin", coDriver: "Shalom Benjamin" },
      { driver: "Syed Wasif Husain", coDriver: "Viraj Shelatkar" },
      { driver: "Vikrant Jamdar", coDriver: "Karthik Kini" },
    ],
  },
  {
    name: "Diesel Expert",
    winners: [
      { driver: "Enoch Keneeth Varma", coDriver: "Manish Aaron" },
      { driver: "Asif Faras", coDriver: "Saeed Shaikh" },
      { driver: "Siddesh Naik", coDriver: "Cletus Pires" },
    ],
  },
  {
    name: "Petrol Expert",
    winners: [
      { driver: "Pratap Karhadkar", coDriver: "Kalidas Dongre" },
      { driver: "Ritesh Bire", coDriver: "Shaurya Bire" },
      { driver: "Kaustubh Memene", coDriver: "Nikhil Bhadale" },
    ],
  },
  {
    name: "Petrol Modified",
    winners: [
      { driver: "Tejan Fallary", coDriver: "Arjun Fallary" },
      { driver: "Saish Mahesh Sankpal", coDriver: "Athrva Ajit Date" },
      { driver: "Sam Rodriguez", coDriver: "Swapnil Phadte" },
    ],
  },
  {
    name: "Diesel Modified",
    winners: [
      { driver: "Steven Fernandes", coDriver: "Imran" },
      { driver: "Sarjerao Kawade", coDriver: "Rushi" },
      { driver: "Abhishek Pawar", coDriver: "Nijen Cardozo" },
    ],
  },
  {
    name: "Ladies",
    winners: [
      { driver: "Prerana Bhalla", coDriver: "Ravi Bhalla" },
      { driver: "Kavita Desai", coDriver: "Kumar Desai" },
      { driver: "Rufina Gupte", coDriver: "Ivin" },
    ],
  },
];

const PODIUM = [
  {
    label: "1st",
    title: "Champion",
    icon: Crown,
    iconClass: "text-[#1a0d00]",
    badgeClass: "border-[#ffd36a]/80 bg-[#ffd36a] shadow-[0_0_24px_rgba(255,211,106,0.32)]",
    rowClass: "border-[#ffd36a]/30 bg-[linear-gradient(135deg,rgba(255,211,106,0.12),rgba(255,122,0,0.04))]",
  },
  {
    label: "2nd",
    title: "Runner Up",
    icon: Medal,
    iconClass: "text-[#111827]",
    badgeClass: "border-[#e7edf7]/75 bg-[#d8e0ef] shadow-[0_0_20px_rgba(216,224,239,0.22)]",
    rowClass: "border-[#d8e0ef]/20 bg-[linear-gradient(135deg,rgba(216,224,239,0.09),rgba(122,143,171,0.03))]",
  },
  {
    label: "3rd",
    title: "Third Place",
    icon: Medal,
    iconClass: "text-[#170a02]",
    badgeClass: "border-[#f3a45f]/70 bg-[#d98745] shadow-[0_0_20px_rgba(217,135,69,0.22)]",
    rowClass: "border-[#d98745]/25 bg-[linear-gradient(135deg,rgba(217,135,69,0.1),rgba(98,49,18,0.03))]",
  },
];

function WinnerRow({ winner, rank }) {
  const podium = PODIUM[rank];
  const Icon = podium.icon;

  return (
    <div className={`grid grid-cols-[54px_minmax(0,1fr)] gap-3 rounded-[8px] border p-3 sm:grid-cols-[62px_minmax(0,1fr)_minmax(150px,0.8fr)] sm:items-center sm:gap-4 sm:p-4 ${podium.rowClass}`}>
      <div className={`flex h-[50px] w-[50px] flex-col items-center justify-center rounded-[8px] border ${podium.badgeClass}`}>
        <Icon className={`h-4 w-4 ${podium.iconClass}`} />
        <span className="mt-0.5 font-mono text-[11px] font-black uppercase text-[#1a0d00]">{podium.label}</span>
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#ff9a2c]">{podium.title}</p>
        <p className="mt-1 break-words font-heading text-xl uppercase leading-tight text-white sm:text-2xl">
          {winner.driver}
        </p>
      </div>

      <div className="col-start-2 min-w-0 border-t border-white/10 pt-3 sm:col-start-auto sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#d9a36d]">Co-Driver</p>
        <p className="mt-1 break-words text-sm font-black uppercase leading-snug text-[#fff7ef] sm:text-base">
          {winner.coDriver}
        </p>
      </div>
    </div>
  );
}

function CategoryWinners({ category, index }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.06 }}
      className="overflow-hidden rounded-[8px] border border-[#3a210f] bg-[#101010]/95 shadow-[0_18px_46px_rgba(0,0,0,0.28)]"
    >
      <div className="flex items-center gap-3 border-b border-[#3a210f] bg-black/80 px-4 py-4 sm:px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-[#ff7a00]/35 bg-[#ff7a00]/10">
          <Trophy className="h-5 w-5 text-[#ff7a00]" />
        </div>
        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#d9a36d]">Category Winners</p>
          <h2 className="mt-1 break-words font-heading text-2xl uppercase leading-none text-white sm:text-3xl">
            {category.name}
          </h2>
        </div>
      </div>

      <div className="space-y-3 p-3 sm:p-4">
        {category.winners.map((winner, rank) => (
          <WinnerRow key={`${category.name}-${winner.driver}`} winner={winner} rank={rank} />
        ))}
      </div>
    </motion.section>
  );
}

export default function LeaderboardPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black pb-20 pt-28 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[linear-gradient(180deg,rgba(255,122,0,0.12),transparent)]" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
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
          className="mb-10 mt-9 border-b border-[#3a210f] pb-8"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-[#ff7a00]/35 bg-[#ff7a00]/10">
                  <Trophy className="h-6 w-6 text-[#ff7a00]" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#ff7a00]">Season 2</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.25em] text-[#d9a36d]">Official Results</p>
                </div>
              </div>
              <h1 className="font-heading text-5xl uppercase leading-none text-white sm:text-7xl">
                Winners
              </h1>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-[8px] border border-[#3a210f] bg-[#101010] px-4 py-3">
              <UsersRound className="h-5 w-5 text-[#ff7a00]" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#d9a36d]">Podium Board</p>
                <p className="mt-1 font-mono text-xs font-black uppercase text-[#fff7ef]">Top 3 Per Category</p>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="grid gap-5 lg:grid-cols-2">
          {WINNER_CATEGORIES.map((category, index) => (
            <CategoryWinners key={category.name} category={category} index={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
