"use client";

import { motion } from "framer-motion";
import { Handshake, HeartPulse, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MEDICAL_PARTNERS = [
  { src: "/images/sponsors/fischer-logo-bg.jpg", alt: "Fischer logo" },
  { src: "/images/sponsors/flynn-bg.jpg", alt: "Flym Care logo" },
  { src: "/images/sponsors/tm-wos-fischer.jpeg", alt: "Time Medical International Ventures logo" },
];

const SPONSORS = [
  { src: "/images/sponsors/fischer-logo-bg.jpg", alt: "Fischer logo" },
  { src: "/images/sponsors/flynn-bg.jpg", alt: "Flym Care logo" },
  { src: "/images/sponsors/tm-wos-fischer.jpeg", alt: "Time Medical International Ventures logo" },
  { src: "/images/sponsors/sponsor-new-07.jpeg", alt: "YST Tyres logo" },
  { src: "/images/sponsors/sponsor-new-09.jpeg", alt: "Sri Maruthi Tyres logo" },
  { src: "/images/sponsors/sponsor-new-10.jpeg", alt: "LAMDA logo" },
  { src: "/images/sponsors/mapro-logo.jpg", alt: "Mapro logo" },
  { src: "/images/sponsors/sponsor-logo-02.png", alt: "Sponsor logo 02" },
  { src: "/images/sponsors/sponsor-logo-03.png", alt: "Sponsor logo 03" },
  { src: "/images/sponsors/sponsor-logo-04.png", alt: "Sponsor logo 04" },
  { src: "/images/sponsors/sponsor-logo-06.png", alt: "Sponsor logo 06" },
  { src: "/images/sponsors/maya-fine-dine.jpg", alt: "Maya Fine Dine logo" },
  { src: "/images/sponsors/sponsor-whatsapp-09.jpeg", alt: "Sponsor logo 15" },
  { src: "/images/sponsors/sponsor-whatsapp-10.jpeg", alt: "Sponsor logo 16" },
  { src: "/images/sponsors/sponsor-whatsapp-11.jpeg", alt: "Sponsor logo 17" },
  { src: "/images/sponsors/sponsor-new-01.jpeg", alt: "Sponsor logo 18" },
  { src: "/images/sponsors/sponsor-new-02.jpeg", alt: "Sponsor logo 19" },
  { src: "/images/sponsors/sponsor-new-03.jpeg", alt: "Sponsor logo 20" },
  { src: "/images/sponsors/sponsor-new-04.jpeg", alt: "Sponsor logo 21" },
  { src: "/images/sponsors/sponsor-new-05.jpeg", alt: "Sponsor logo 22" },
  { src: "/images/sponsors/sponsor-new-06.jpeg", alt: "Sponsor logo 23" },
  { src: "/images/sponsors/sponsor-new-08.jpeg", alt: "Sponsor logo 25" },
  { src: "/images/sponsors/sponsor-new-11.jpeg", alt: "Sponsor logo 28" },
];

export default function SponsorsPage() {
  return (
    <div className="min-h-[90vh] bg-black text-white pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-[100vh] bg-mesh-amber opacity-10 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex max-w-full items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-zinc-900 border border-white/10 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.14em] sm:tracking-[0.36em] mb-6"
          >
            <Handshake className="w-4 h-4 text-primary" /> Patrons of the Kingdom
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-heading text-white tracking-normal uppercase leading-none mb-4"
          >
            OUR <span className="text-primary italic text-glow-amber">SPONSORS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base md:text-xl text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed"
          >
            Partners powering Team Karad Off-Roaders Season 2.
          </motion.p>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="relative mb-10 sm:mb-12 overflow-hidden rounded-[1.5rem] border border-emerald-300/35 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.24),transparent_34%),linear-gradient(135deg,rgba(4,120,87,0.22),rgba(255,165,0,0.12),rgba(9,9,11,0.96))] p-3 sm:p-5 md:p-6 lg:p-7 shadow-[0_0_60px_rgba(16,185,129,0.16)]"
        >
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/80 to-transparent" />
          <div className="absolute inset-y-6 left-0 w-px bg-gradient-to-b from-transparent via-emerald-200/50 to-transparent" />
          <div className="absolute inset-y-6 right-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent" />

          <div className="relative z-10 mx-auto mb-5 sm:mb-6 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-300/35 bg-black/45 px-4 py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200 shadow-[0_0_24px_rgba(16,185,129,0.14)]">
                <HeartPulse className="w-4 h-4" />
                Exclusive Event Partner
            </div>

            <h2 className="mt-4 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading uppercase leading-[0.9] text-white drop-shadow-[0_0_24px_rgba(16,185,129,0.24)]">
              Official Medical
              <span className="block bg-gradient-to-r from-emerald-200 via-primary to-emerald-300 bg-clip-text text-transparent italic">
                Support Partner
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
              Trusted medical support partners standing with the event, teams, and every off-road run.
            </p>
          </div>

          <div className="relative z-10 rounded-[1.25rem] border border-white/15 bg-black/55 p-2.5 sm:p-3 md:p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_18px_60px_rgba(0,0,0,0.32)]">
            <div className="absolute inset-x-5 top-0 h-1 rounded-full bg-gradient-to-r from-emerald-300 via-primary to-emerald-300" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {MEDICAL_PARTNERS.map((partner, index) => (
              <motion.div
                key={partner.src}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 + index * 0.06 }}
                className="group relative min-h-40 sm:min-h-48 md:min-h-56 rounded-2xl border border-emerald-200/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-4 sm:p-5 flex items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-emerald-300/0 group-hover:bg-emerald-300/6 transition-colors" />
                <div className="absolute -inset-12 bg-[radial-gradient(circle,rgba(16,185,129,0.18),transparent_58%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={720}
                  height={520}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="relative z-10 max-h-32 sm:max-h-40 md:max-h-48 w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </motion.div>
            ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.24em] text-primary">
                <Sparkles className="w-3.5 h-3.5" />
                Event Supporters
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-heading uppercase leading-none text-white">
                Co-<span className="text-primary italic">Sponsors</span>
              </h2>
            </div>
            <p className="max-w-lg text-xs sm:text-sm text-zinc-500 font-sans leading-relaxed">
              Our supporting partners helping make Team Karad Off-Roaders Season 2 possible.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {SPONSORS.map((sponsor, index) => (
              <motion.div
                key={sponsor.src}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * index }}
                className="group relative min-h-44 sm:min-h-56 md:min-h-72 rounded-2xl border border-white/10 bg-zinc-950/80 p-3 sm:p-5 flex items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                <Image
                  src={sponsor.src}
                  alt={sponsor.alt}
                  width={600}
                  height={420}
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="relative z-10 max-h-40 sm:max-h-52 md:max-h-64 w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <Link
            href="/about#contact"
            className="inline-flex h-14 md:h-16 px-6 sm:px-10 md:px-16 items-center justify-center bg-white text-black font-black uppercase tracking-[0.18em] sm:tracking-[0.4em] text-[10px] md:text-sm rounded-2xl hover:bg-primary hover:scale-105 transition-all shadow-2xl"
          >
            <Sparkles className="w-4 h-4 mr-3" />
            Become a Sponsor
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
