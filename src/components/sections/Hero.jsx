"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Trophy, Users, Calendar, MapPin } from "lucide-react";

function RealisticTrophyIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="hero-prize-trophy-metal" x1="12" x2="52" y1="6" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff7c8" />
          <stop offset="0.2" stopColor="#ffd76b" />
          <stop offset="0.48" stopColor="#ff9c18" />
          <stop offset="0.72" stopColor="#9f4606" />
          <stop offset="1" stopColor="#ffefaa" />
        </linearGradient>
        <radialGradient id="hero-prize-trophy-shine" cx="28%" cy="18%" r="58%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id="hero-prize-trophy-shadow" x="-35%" y="-30%" width="170%" height="170%">
          <feDropShadow dx="0" dy="4" stdDeviation="2.5" floodColor="#2a1200" floodOpacity="0.52" />
        </filter>
      </defs>
      <g filter="url(#hero-prize-trophy-shadow)">
        <path
          d="M17.5 11.5h29v7.8c0 12.3-5.3 21-14.5 22.7-9.2-1.7-14.5-10.4-14.5-22.7v-7.8Z"
          fill="url(#hero-prize-trophy-metal)"
          stroke="#fff0a4"
          strokeWidth="1.3"
        />
        <path
          d="M17.7 17.2H9.5c.4 10.2 5.5 16.4 13.8 17.7"
          fill="none"
          stroke="url(#hero-prize-trophy-metal)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5.2"
        />
        <path
          d="M46.3 17.2h8.2c-.4 10.2-5.5 16.4-13.8 17.7"
          fill="none"
          stroke="url(#hero-prize-trophy-metal)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5.2"
        />
        <path d="M28.5 41.5h7v8h-7z" fill="url(#hero-prize-trophy-metal)" />
        <path d="M22 50h20l2.6 6.5H19.4L22 50Z" fill="url(#hero-prize-trophy-metal)" stroke="#743000" strokeWidth="1" />
        <path d="M16 56h32v5H16z" fill="url(#hero-prize-trophy-metal)" stroke="#743000" strokeWidth="1" rx="1.8" />
        <path
          d="M22.2 15.7c.6 8.8 3.7 15.2 9.8 18.7 5.7-3.4 8.7-9.4 9.6-17.2"
          fill="none"
          stroke="#6d3000"
          strokeOpacity="0.24"
          strokeWidth="2"
        />
        <path d="M18.8 12.8h12.5c-1.8 7.9-5.1 13.8-10 17.8-1.7-3.2-2.5-7-2.5-11.5v-6.3Z" fill="url(#hero-prize-trophy-shine)" />
      </g>
    </svg>
  );
}

function RealisticTyreIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className={className}>
      <defs>
        <radialGradient id="hero-tyre-rubber" cx="38%" cy="32%" r="68%">
          <stop offset="0" stopColor="#4b4b4b" />
          <stop offset="0.42" stopColor="#171717" />
          <stop offset="0.74" stopColor="#050505" />
          <stop offset="1" stopColor="#000000" />
        </radialGradient>
        <radialGradient id="hero-tyre-rim" cx="42%" cy="35%" r="62%">
          <stop offset="0" stopColor="#fff2c0" />
          <stop offset="0.22" stopColor="#ffb43d" />
          <stop offset="0.55" stopColor="#704018" />
          <stop offset="1" stopColor="#16100a" />
        </radialGradient>
        <filter id="hero-tyre-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="3" floodColor="#000000" floodOpacity="0.55" />
        </filter>
      </defs>
      <g filter="url(#hero-tyre-shadow)">
        <circle cx="40" cy="40" r="34" fill="url(#hero-tyre-rubber)" stroke="#5b5b5b" strokeWidth="1.5" />
        {Array.from({ length: 18 }).map((_, index) => (
          <rect
            key={index}
            x="37"
            y="3.5"
            width="6"
            height="13"
            rx="2"
            fill="#0b0b0b"
            stroke="#3a3a3a"
            strokeWidth="0.8"
            transform={`rotate(${index * 20} 40 40)`}
          />
        ))}
        <circle cx="40" cy="40" r="24" fill="#070707" stroke="#2d2d2d" strokeWidth="2" />
        <circle cx="40" cy="40" r="15" fill="url(#hero-tyre-rim)" stroke="#ffb43d" strokeOpacity="0.55" strokeWidth="1.2" />
        {Array.from({ length: 6 }).map((_, index) => (
          <path
            key={index}
            d="M40 39 L53 35 L55 41 L41 43 Z"
            fill="#2b1a0d"
            stroke="#c87532"
            strokeOpacity="0.65"
            strokeWidth="0.8"
            transform={`rotate(${index * 60} 40 40)`}
          />
        ))}
        <circle cx="40" cy="40" r="5.5" fill="#0d0d0d" stroke="#ffd36a" strokeOpacity="0.7" strokeWidth="1" />
        <path d="M18 24c7-10 22-15 35-8" fill="none" stroke="#ffffff" strokeLinecap="round" strokeOpacity="0.14" strokeWidth="4" />
      </g>
    </svg>
  );
}

function RealisticRimIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className={className}>
      <defs>
        <radialGradient id="hero-rim-metal" cx="35%" cy="28%" r="70%">
          <stop offset="0" stopColor="#fff5d0" />
          <stop offset="0.2" stopColor="#d8d8d8" />
          <stop offset="0.45" stopColor="#8b8f95" />
          <stop offset="0.72" stopColor="#24272c" />
          <stop offset="1" stopColor="#07080a" />
        </radialGradient>
        <linearGradient id="hero-rim-gold" x1="18" x2="62" y1="14" y2="66" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffe49a" />
          <stop offset="0.45" stopColor="#ff9f1a" />
          <stop offset="1" stopColor="#5b2605" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="34" fill="#070707" stroke="#3d3d3d" strokeWidth="2" />
      <circle cx="40" cy="40" r="28" fill="url(#hero-rim-metal)" stroke="#f1c06c" strokeOpacity="0.45" strokeWidth="1.5" />
      {Array.from({ length: 8 }).map((_, index) => (
        <path
          key={index}
          d="M40 39 L59 35 L62 42 L42 45 Z"
          fill="url(#hero-rim-gold)"
          stroke="#1b1208"
          strokeWidth="1"
          transform={`rotate(${index * 45} 40 40)`}
        />
      ))}
      <circle cx="40" cy="40" r="13" fill="#111111" stroke="#ffb43d" strokeOpacity="0.65" strokeWidth="1.4" />
      {Array.from({ length: 5 }).map((_, index) => (
        <circle key={index} cx="40" cy="30" r="2" fill="#d8d8d8" transform={`rotate(${index * 72} 40 40)`} />
      ))}
      <circle cx="40" cy="40" r="4.5" fill="#050505" stroke="#fff1a8" strokeOpacity="0.7" />
      <path d="M20 24c8-10 24-13 37-4" fill="none" stroke="#fff" strokeLinecap="round" strokeOpacity="0.16" strokeWidth="4" />
    </svg>
  );
}

function RealisticDifferentialIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 96 80" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="hero-diff-metal" x1="12" x2="84" y1="12" y2="68" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f3f3f3" />
          <stop offset="0.2" stopColor="#8f969f" />
          <stop offset="0.5" stopColor="#24272c" />
          <stop offset="0.78" stopColor="#0a0b0d" />
          <stop offset="1" stopColor="#ff9f1a" />
        </linearGradient>
        <filter id="hero-diff-shadow" x="-25%" y="-35%" width="150%" height="170%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.55" />
        </filter>
      </defs>
      <g filter="url(#hero-diff-shadow)">
        <rect x="5" y="35" width="29" height="10" rx="4" fill="url(#hero-diff-metal)" stroke="#60646b" />
        <rect x="62" y="35" width="29" height="10" rx="4" fill="url(#hero-diff-metal)" stroke="#60646b" />
        <path d="M34 25h28l12 15-12 15H34L22 40 34 25Z" fill="url(#hero-diff-metal)" stroke="#ffb43d" strokeOpacity="0.65" strokeWidth="1.4" />
        <circle cx="48" cy="40" r="18" fill="#111318" stroke="#8b8f95" strokeWidth="2" />
        <circle cx="48" cy="40" r="10" fill="#050505" stroke="#ffb43d" strokeWidth="1.4" />
        {Array.from({ length: 8 }).map((_, index) => (
          <circle key={index} cx="48" cy="24" r="2" fill="#d8d8d8" transform={`rotate(${index * 45} 48 40)`} />
        ))}
        <path d="M35 29c7-8 20-9 28-1" fill="none" stroke="#fff" strokeLinecap="round" strokeOpacity="0.18" strokeWidth="3" />
      </g>
    </svg>
  );
}

function RealisticGiftIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="hero-gift-box" x1="16" x2="64" y1="18" y2="68" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff1a8" />
          <stop offset="0.28" stopColor="#ffb43d" />
          <stop offset="0.7" stopColor="#b74d05" />
          <stop offset="1" stopColor="#5b2605" />
        </linearGradient>
        <linearGradient id="hero-gift-ribbon" x1="24" x2="56" y1="12" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.32" stopColor="#ffd36a" />
          <stop offset="1" stopColor="#7a3500" />
        </linearGradient>
      </defs>
      <path d="M17 34h46v34H17z" fill="url(#hero-gift-box)" stroke="#7a3500" strokeWidth="1.5" rx="4" />
      <path d="M13 25h54v14H13z" fill="url(#hero-gift-box)" stroke="#7a3500" strokeWidth="1.5" rx="4" />
      <path d="M35 25h10v43H35z" fill="url(#hero-gift-ribbon)" />
      <path d="M13 30h54v7H13z" fill="url(#hero-gift-ribbon)" opacity="0.92" />
      <path d="M39 24c-7-11-18-11-18-3 0 7 11 7 18 3Z" fill="url(#hero-gift-ribbon)" stroke="#7a3500" strokeWidth="1.2" />
      <path d="M41 24c7-11 18-11 18-3 0 7-11 7-18 3Z" fill="url(#hero-gift-ribbon)" stroke="#7a3500" strokeWidth="1.2" />
      <path d="M20 37c9 6 27 7 39 0" fill="none" stroke="#fff" strokeLinecap="round" strokeOpacity="0.18" strokeWidth="3" />
    </svg>
  );
}

function PrizeGiftIcon({ gift }) {
  if (gift === "Tyre Set") {
    return <RealisticTyreIcon className="h-10 w-10" />;
  }

  if (gift === "Rim Sets") {
    return <RealisticRimIcon className="h-10 w-10" />;
  }

  if (gift === "Locker") {
    return <RealisticDifferentialIcon className="h-12 w-12" />;
  }

  return <RealisticGiftIcon className="h-10 w-10" />;
}

export default function Hero() {
  const [logoError, setLogoError] = useState(false);
  const prizePoolRows = [
    ["Modified Diesel", "15,000", "12,000", "10,000"],
    ["Modified Petrol", "15,000", "12,000", "10,000"],
    ["Expert Diesel", "12,000", "10,000", "7,000"],
    ["Expert Petrol", "12,000", "10,000", "7,000"],
    ["SUV Thar", "12,000", "10,000", "7,000"],
    ["SUV Jimny", "12,000", "10,000", "7,000"],
    ["SUV Modified", "15,000", "12,000", "10,000"],
    ["NDMS Category", "10,000", "7,000", "5,000"],
    ["Extreme Category", "25,000", "20,000", "15,000"],
    ["Ladies Category", "Trophy", "Trophy", "Trophy"],
  ];
  const prizeGifts = ["Tyre Set", "Rim Sets", "Locker", "Many More Gifts"];
  const prizePlaces = [
    { label: "1st", tone: "from-[#fff4b0] via-[#ffbd35] to-[#9f4b05]" },
    { label: "2nd", tone: "from-[#f5f7ff] via-[#b9c4d6] to-[#5f6b7a]" },
    { label: "3rd", tone: "from-[#ffd1a1] via-[#c87532] to-[#6d2d0b]" },
  ];

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20 bg-black">
      {/* Dramatic Visible Background */}
      <div className="absolute inset-0 z-0">
        {/* Primary glow orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/15 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] rounded-full bg-orange-600/8 blur-[100px]" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: `linear-gradient(rgba(255,165,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,165,0,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        {/* Radial fade */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,black_70%)]" />
      </div>

      {/* Shared bottom/top fades */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent z-10" />

      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Logo - Main Branding */}
          <div className="mb-4 md:mb-8 relative flex justify-center w-full">
            {!logoError ? (
              <motion.img 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 0.5, 
                  duration: 0.8,
                  ease: "easeOut" 
                }}
                style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                src="/logo.png" 
                alt="Team Karad Logo" 
                className="w-40 h-40 md:w-96 md:h-96 object-contain drop-shadow-[0_0_50px_rgba(255,165,0,0.5)]"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="text-center py-4 px-2">
                  <h1 className="text-[12vw] md:text-9xl font-heading text-white tracking-tighter drop-shadow-[0_0_20px_oklch(0.7_0.2_60)] leading-none">
                    TEAM <span className="text-primary italic">KARAD</span>
                  </h1>
                  <p className="text-xs md:text-3xl text-primary font-heading tracking-[0.2em] md:tracking-[0.6em] opacity-80 uppercase font-bold mt-4">OFF-ROAD EVENT • EST. 2015</p>
              </div>
            )}
          </div>

          <div className="mb-6 text-center">
            <div>
              <p className="font-heading text-4xl font-black uppercase leading-none tracking-tight text-white drop-shadow-[0_0_34px_rgba(255,138,0,0.35)] sm:text-5xl md:text-7xl lg:text-8xl">
                Karad Offroad <span className="text-primary italic">Season 2</span>
              </p>
              <p className="mt-3 text-sm font-black uppercase tracking-[0.55em] text-primary md:text-xl">
                2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl animate-pulse">
             <div className="w-1.5 h-1.5 rounded-full bg-primary" />
             <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] leading-none">Elite Grid Status: Online</p>
          </div>

          <span className="inline-block px-4 py-1.5 mb-6 text-[10px] md:text-sm font-semibold tracking-widest text-primary border border-primary/30 rounded-full bg-primary/10 backdrop-blur-md uppercase text-center max-w-[90vw]">
            29/30/31st MAY • VENUE: KARAD, MAHARASHTRA
          </span>

          <p className="text-sm md:text-2xl text-zinc-300 mb-10 max-w-2xl mx-auto font-sans leading-relaxed">
            Join 160+ professional drivers and co-drivers in our elite Season 2 championship. Register now to claim your legendary sticker number.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
              <Link 
                href="/register" 
                className={cn(buttonVariants({ size: "lg" }), "h-14 md:h-16 px-6 md:px-10 text-sm md:text-lg font-bold rounded-none skew-x-[-12deg] neon-glow bg-primary text-black inline-flex items-center justify-center w-full max-w-sm sm:w-auto")}
              >
                <span className="skew-x-[12deg] whitespace-nowrap uppercase">REGISTER NOW</span>
              </Link>
            <Link 
              href="/teams" 
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 md:h-16 px-6 md:px-10 text-sm md:text-lg font-bold border-zinc-700 hover:bg-white/5 transition-colors w-full sm:w-auto flex items-center justify-center")}
            >
              VIEW TEAMS
            </Link>
          </div>

          <div className="relative mt-8 w-full max-w-5xl overflow-hidden rounded-[2.35rem] border border-primary/35 bg-[#070503]/95 p-3 shadow-[0_24px_100px_rgba(255,138,0,0.24)] backdrop-blur-xl md:p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,190,78,0.26),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,122,0,0.18),transparent_30%),linear-gradient(135deg,rgba(255,138,0,0.11),transparent_48%),url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-primary to-transparent" />
            <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-primary to-transparent" />
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />
            <div className="relative">
              <div className="mx-auto mb-4 flex w-fit max-w-full flex-wrap items-center justify-center gap-3 rounded-2xl border border-primary/40 bg-black/85 px-4 py-3 shadow-[inset_0_0_32px_rgba(255,138,0,0.14),0_0_36px_rgba(255,138,0,0.14)] md:px-6">
                <RealisticTrophyIcon className="h-12 w-12 shrink-0 md:h-16 md:w-16" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.34em] text-zinc-500">Season 2 Rewards Board</p>
                  <h3 className="font-heading text-4xl font-black uppercase leading-none tracking-tight text-primary md:text-6xl">
                    Prize Pool
                  </h3>
                </div>
                <RealisticTrophyIcon className="h-12 w-12 shrink-0 scale-x-[-1] md:h-16 md:w-16" />
              </div>

              <div className="overflow-x-auto rounded-[1.6rem] border border-primary/30 bg-black/80 shadow-[inset_0_0_40px_rgba(255,138,0,0.08)]">
                <table className="w-full min-w-[680px] border-collapse text-left">
                  <thead>
                    <tr className="bg-[linear-gradient(90deg,rgba(255,138,0,0.18),rgba(255,194,86,0.1),rgba(255,138,0,0.18))] font-heading text-sm uppercase tracking-[0.08em] text-primary md:text-lg">
                      <th className="border-b border-r border-primary/25 px-4 py-4 text-center">Category</th>
                      {prizePlaces.map((place, index) => (
                        <th
                          key={place.label}
                          className={`border-b border-primary/25 px-4 py-4 text-center ${index < prizePlaces.length - 1 ? "border-r" : ""}`}
                        >
                          <span className="inline-flex flex-col items-center justify-center gap-1">
                            <span className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${place.tone} shadow-[0_0_18px_rgba(255,176,48,0.22)]`}>
                              <Trophy className="h-4 w-4 fill-black/70 text-black/80" />
                            </span>
                            <span>{place.label} Winner</span>
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {prizePoolRows.map((row, index) => {
                      const isLadies = row[0] === "Ladies Category";

                      return (
                      <tr
                        key={row[0]}
                        className={`border-b border-primary/15 last:border-b-0 ${
                          isLadies
                              ? "bg-[#ff7a00]/[0.045]"
                              : "hover:bg-primary/[0.035]"
                        }`}
                      >
                        <td className="border-r border-primary/20 px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-heading text-sm font-black text-primary">
                              {index + 1}
                            </span>
                            <span className="font-heading text-base font-black text-zinc-100 md:text-xl">{row[0]}</span>
                          </div>
                        </td>
                        {row.slice(1).map((amount, amountIndex) => {
                          const isTrophyOnly = amount === "Trophy";

                          return (
                          <td
                            key={`${row[0]}-${amount}-${amountIndex}`}
                            className="border-r border-primary/20 px-4 py-3 text-center last:border-r-0"
                          >
                            <span className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-1.5 font-heading text-base font-black md:text-xl ${
                              isTrophyOnly
                                ? "border-primary/30 bg-primary/10 text-primary"
                                : amountIndex === 0
                                  ? "border-primary/50 bg-primary/15 text-[#ffd36a] shadow-[0_0_22px_rgba(255,138,0,0.12)]"
                                  : "border-primary/20 bg-black/40 text-primary"
                            }`}>
                              {isTrophyOnly ? <Trophy className="h-4 w-4 text-primary" /> : <span className="text-[12px]">INR</span>}
                              {amount}
                            </span>
                          </td>
                          );
                        })}
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 rounded-[1.6rem] border border-primary/30 bg-[linear-gradient(135deg,rgba(255,138,0,0.16),rgba(0,0,0,0.78))] px-4 py-5 shadow-[0_0_34px_rgba(255,138,0,0.1)]">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">Every winner will get</p>
                <p className="mt-1 font-heading text-2xl font-black uppercase leading-tight text-primary md:text-4xl">
                  Trophy for Driver & Co-Driver
                </p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
                  Podium pride, cash rewards, and off-road performance gifts for champions.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {prizeGifts.map((gift) => (
                  <div key={gift} className="group rounded-2xl border border-primary/25 bg-black/75 px-3 py-4 transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_14px_35px_rgba(255,138,0,0.14)]">
                    <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                      <PrizeGiftIcon gift={gift} />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.24em] text-zinc-500">Bonus Gift</p>
                    <p className="mt-1 font-heading text-base font-black uppercase text-primary md:text-lg">{gift}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-2 pointer-events-none">
             <p className="text-white font-black text-xs md:text-lg tracking-[0.2em] uppercase drop-shadow-glow">
                EARLY ENTRY: 19 MARCH — 15 MAY
             </p>
             <p className="text-primary font-black text-xs md:text-lg tracking-[0.2em] uppercase drop-shadow-glow">
                LATE ENTRY: 16 MAY — 22 MAY
             </p>
             <p className="text-zinc-500 font-bold text-[10px] md:text-sm tracking-[0.4em] uppercase mt-4">
                FINAL DEADLINE: 22 MAY 2026
             </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 md:mt-20 border-t border-white/10 pt-10"
        >
          <div className="text-center">
            <Calendar className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-2" />
            <p className="text-zinc-500 text-[10px] md:text-xs uppercase tracking-widest mb-1 font-bold">Date</p>
            <p className="text-white font-heading text-sm md:text-lg text-center leading-tight">29/30/31st MAY<br/><span className="text-xs opacity-50">2026</span></p>
          </div>
          <div className="text-center">
            <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-2" />
            <p className="text-zinc-500 text-[10px] md:text-xs uppercase tracking-widest mb-1 font-bold">Location</p>
            <p className="text-white font-heading text-sm md:text-lg">KARAD</p>
          </div>
          <div className="text-center">
            <Users className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-2" />
            <p className="text-zinc-500 text-[10px] md:text-xs uppercase tracking-widest mb-1 font-bold">Lineup</p>
            <p className="text-white font-heading text-sm md:text-lg uppercase">160+ PROFESSIONALS</p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-primary rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
