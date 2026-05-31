"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeartPulse, MapPin, X } from "lucide-react";
import Image from "next/image";

const MEDICAL_PARTNERS = [
  { src: "/images/sponsors/fischer-logo-bg.jpg", alt: "Fischer Medical Ventures Ltd logo", id: "fischer" },
  { src: "/images/sponsors/flynn-bg.jpg", alt: "FlynnCare logo", id: "flynn-care" },
  { src: "/images/sponsors/tm-wos-fischer.jpeg", alt: "Time Medical International Ventures logo", id: "time-medical" },
];

export default function PartnersPage() {
  const [isFischerOpen, setIsFischerOpen] = useState(false);
  const [isFlynnOpen, setIsFlynnOpen] = useState(false);
  const [isTimeMedicalOpen, setIsTimeMedicalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-28 text-white sm:px-6 md:pt-32">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_36%),radial-gradient(circle_at_top_right,rgba(255,138,0,0.14),transparent_34%)]" />
      <div className="pointer-events-none fixed inset-0 bg-noise opacity-5" />

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative z-10 mx-auto max-w-7xl overflow-hidden rounded-[1.5rem] border border-emerald-300/35 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.24),transparent_34%),linear-gradient(135deg,rgba(4,120,87,0.22),rgba(255,165,0,0.12),rgba(9,9,11,0.96))] p-4 shadow-[0_0_80px_rgba(16,185,129,0.14)] sm:p-6 md:p-8"
      >
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/80 to-transparent" />
        <div className="absolute inset-y-8 left-0 w-px bg-gradient-to-b from-transparent via-emerald-200/50 to-transparent" />
        <div className="absolute inset-y-8 right-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent" />

        <div className="relative z-10 mx-auto mb-7 max-w-5xl text-center sm:mb-8">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-300/35 bg-black/45 px-4 py-2 text-[9px] font-black uppercase tracking-[0.24em] text-emerald-200 shadow-[0_0_24px_rgba(16,185,129,0.14)] sm:text-[10px]">
            <HeartPulse className="h-4 w-4" />
            Exclusive Event Partner
          </div>

          <h1 className="mt-5 font-heading text-4xl uppercase leading-[0.9] text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Official Medical
            <span className="block bg-gradient-to-r from-emerald-200 via-primary to-emerald-300 bg-clip-text italic text-transparent">
              Support Partner
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            Trusted medical support partners standing with the event, teams, and every off-road run.
          </p>
        </div>

        <div className="relative z-10 rounded-[1.35rem] border border-white/15 bg-black/55 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_18px_60px_rgba(0,0,0,0.32)] sm:p-4 md:p-5">
          <div className="absolute inset-x-6 top-0 h-1 rounded-full bg-gradient-to-r from-emerald-300 via-primary to-emerald-300" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {MEDICAL_PARTNERS.map((partner, index) => (
              <motion.button
                key={partner.src}
                type="button"
                onClick={() => {
                  if (partner.id === "fischer") setIsFischerOpen(true);
                  if (partner.id === "flynn-care") setIsFlynnOpen(true);
                  if (partner.id === "time-medical") setIsTimeMedicalOpen(true);
                }}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 + index * 0.08 }}
                aria-label={
                  partner.id === "fischer"
                    ? "Open Fischer Medical Ventures information"
                    : partner.id === "flynn-care"
                    ? "Open FlynnCare information"
                    : partner.id === "time-medical"
                      ? "Open Time Medical information"
                      : partner.alt
                }
                className={`group relative flex min-h-56 items-center justify-center overflow-hidden rounded-2xl border border-emerald-200/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5 text-left outline-none transition-colors focus-visible:border-emerald-200 focus-visible:ring-2 focus-visible:ring-emerald-300/70 sm:min-h-64 md:min-h-72 ${
                  partner.id ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div className="absolute inset-0 bg-emerald-300/0 transition-colors group-hover:bg-emerald-300/6" />
                <div className="absolute -inset-12 bg-[radial-gradient(circle,rgba(16,185,129,0.18),transparent_58%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={760}
                  height={520}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="relative z-10 max-h-40 w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105 sm:max-h-48 md:max-h-52"
                  priority={index === 0}
                />
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {isFischerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
            onClick={() => setIsFischerOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="fischer-title"
              className="relative max-h-[86vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-emerald-300/30 bg-zinc-950 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:p-7"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close Fischer information"
                onClick={() => setIsFischerOpen(false)}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:border-emerald-300/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="pr-10">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-300">
                  Medical Imaging Partner
                </p>
                <h2 id="fischer-title" className="mt-2 font-heading text-3xl uppercase text-white sm:text-4xl">
                  Fischer Medical Ventures Limited
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-300 sm:text-base">
                <p>
                  Fischer Medical Ventures Limited leads a paradigm shift in the healthcare sector by pioneering
                  cutting-edge, cost-effective medical imaging technologies and state-of-the-art diagnostics innovations
                  on a global scale.
                </p>
                <p>
                  Headquartered in Chennai, India, with a manufacturing facility in the Andhra Pradesh MedTech Zone
                  (AMTZ) in Visakhapatnam, FMV is the first Indian company to indigenously manufacture advanced magnetic
                  resonance imaging (MRI) systems in India.
                </p>
                <p>
                  Aside from medical devices, FMV holds a diverse portfolio of diagnostic solutions tailored to
                  point-of-care needs, empowering healthcare providers with tools for timely and precise diagnoses.
                </p>
                <p>
                  Leveraging expertise, resources, and strategic partnerships, FMV is relentless in driving progress,
                  accessibility, and affordability in healthcare delivery to bring significant impact on global
                  healthcare.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/45 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">Email</p>
                <a
                  href="mailto:ENQUIRY@FISCHERMV.COM"
                  className="mt-2 inline-flex text-sm font-bold uppercase tracking-[0.08em] text-zinc-100 transition-colors hover:text-emerald-200 sm:text-base"
                >
                  ENQUIRY@FISCHERMV.COM
                </a>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/45 p-4">
                  <div className="flex items-center gap-3 text-emerald-300">
                    <MapPin className="h-5 w-5" />
                    <p className="font-black uppercase tracking-[0.16em]">Singapore Corporate Office</p>
                  </div>
                  <address className="mt-3 not-italic text-sm leading-7 text-zinc-300">
                    3 Tai Seng Avenue, TSX Block B #04-36, Singapore 536465.
                    <br />
                    Call us: (+65) 6776 7819
                  </address>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/45 p-4">
                  <div className="flex items-center gap-3 text-emerald-300">
                    <MapPin className="h-5 w-5" />
                    <p className="font-black uppercase tracking-[0.16em]">India Corporate Office</p>
                  </div>
                  <address className="mt-3 not-italic text-sm leading-7 text-zinc-300">
                    Prestige Palladium Bayan, Level 8, No.129-140, Greams Road, Chennai 600006.
                    <br />
                    Call us: +91 44 4654 9393
                  </address>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/45 p-4">
                <div className="flex items-center gap-3 text-emerald-300">
                  <MapPin className="h-5 w-5" />
                  <p className="font-black uppercase tracking-[0.16em]">Manufacturing Site</p>
                </div>
                <address className="mt-3 not-italic text-sm leading-7 text-zinc-300">
                  Survey no.480/2, VM Steel Project S.O, Pragathi Maidan, Siddeswaram, Nadupuru Reserve Forest,
                  Visakhapatnam, Andhra Pradesh, 530031.
                </address>
              </div>

              <a
                href="https://fischermv.com"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-full border border-emerald-300/35 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-200 transition-colors hover:border-emerald-200 hover:bg-emerald-300/20 hover:text-white"
              >
                fischermv.com
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFlynnOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
            onClick={() => setIsFlynnOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="flynn-care-title"
              className="relative max-h-[86vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-emerald-300/30 bg-zinc-950 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:p-7"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close FlynnCare information"
                onClick={() => setIsFlynnOpen(false)}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:border-emerald-300/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="pr-10">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-300">
                  Medical Support Partner
                </p>
                <h2 id="flynn-care-title" className="mt-2 font-heading text-3xl uppercase text-white sm:text-4xl">
                  FlynnCare
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-300 sm:text-base">
                <p>
                  FlynnCare Health Innovations Pvt Ltd is a 100% subsidiary of Fischer Medical Ventures Ltd. Flynn has
                  improved the lives of five million people through its cutting-edge digital health technology.
                </p>
                <p>
                  Their aim is to bring equitable, end-to-end health screening to communities through digital community
                  health products, and to connect providers and patients through an innovative digital hospital platform.
                </p>
                <p>
                  FlynnCare provides Digital Hospital, Digital Community Care and horizontal integrated screening and
                  diagnostic solutions for healthcare.
                </p>
                <p>
                  With human-centered design, tailored workflows, and insightful analytics, FlynnCare simplifies and
                  enhances connections between providers and patients, improving healthcare outcomes and experiences.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/45 p-4">
                <div className="flex items-center gap-3 text-emerald-300">
                  <MapPin className="h-5 w-5" />
                  <p className="font-black uppercase tracking-[0.2em]">India</p>
                </div>
                <address className="mt-3 not-italic text-sm leading-7 text-zinc-300 sm:text-base">
                  Floor No: 8th floor, Building No: 43/1, Door no: 129 to 140,
                  <br />
                  Road/Street: Greams Road Nungabakkam,
                  <br />
                  Egmore, Chennai,
                  <br />
                  Tamil Nadu.
                  <br />
                  Pincode-600006.
                </address>
                <a
                  href="https://flynnhealthcare.com"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex rounded-full border border-emerald-300/35 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-200 transition-colors hover:border-emerald-200 hover:bg-emerald-300/20 hover:text-white"
                >
                  flynnhealthcare.com
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTimeMedicalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
            onClick={() => setIsTimeMedicalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="time-medical-title"
              className="relative max-h-[86vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-emerald-300/30 bg-zinc-950 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:p-7"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close Time Medical information"
                onClick={() => setIsTimeMedicalOpen(false)}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:border-emerald-300/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="pr-10">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-300">
                  Medical Imaging Partner
                </p>
                <h2 id="time-medical-title" className="mt-2 font-heading text-3xl uppercase text-white sm:text-4xl">
                  Time Medical International Ventures
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-300 sm:text-base">
                <p>
                  Time Medical International Ventures India Pvt Ltd is a pioneer in medical diagnostic imaging, committed
                  to making advanced, accessible, and affordable imaging solutions available worldwide.
                </p>
                <p>
                  They are proud to be the first to establish an MRI manufacturing base in India, strategically located at
                  the prestigious AMTZ campus in Visakhapatnam, Andhra Pradesh.
                </p>
                <p>
                  Their state-of-the-art facility is dedicated to developing next-generation MRI systems that combine
                  cutting-edge technology with practical accessibility, bringing world-class diagnostic capabilities to
                  healthcare providers across the globe.
                </p>
                <p>
                  Through continuous innovation, strategic partnerships, and manufacturing excellence, Time Medical
                  International Ventures India Pvt Ltd is reshaping medical imaging and improving patient outcomes
                  worldwide.
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  "First MRI Manufacturing Base in India",
                  "Located at AMTZ Campus, Visakhapatnam",
                  "Next-Generation MRI Systems",
                  "Improving Patient Outcomes Worldwide",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3">
                    <p className="text-xs font-black uppercase leading-5 tracking-[0.14em] text-emerald-100">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/45 p-4">
                  <div className="flex items-center gap-3 text-emerald-300">
                    <MapPin className="h-5 w-5" />
                    <p className="font-black uppercase tracking-[0.18em]">Head Office (India)</p>
                  </div>
                  <address className="mt-3 not-italic text-sm leading-7 text-zinc-300">
                    Level 8, Prestige Palladium Bayan, 129-140, Greams Road, Thousand Lights, Chennai,
                    <br />
                    Tamil Nadu, India 600006
                  </address>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/45 p-4">
                  <div className="flex items-center gap-3 text-emerald-300">
                    <MapPin className="h-5 w-5" />
                    <p className="font-black uppercase tracking-[0.18em]">Manufacturing Office (India)</p>
                  </div>
                  <address className="mt-3 not-italic text-sm leading-7 text-zinc-300">
                    Andhra Pradesh Medtech Zone,
                    <br />
                    Administrative Office Building, Near Steel Plant Pragathi Maidan, Visakhapatnam,
                    <br />
                    Andhra Pradesh 530032.
                  </address>
                </div>
              </div>

              <a
                href="https://timemedical.in"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-full border border-emerald-300/35 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-200 transition-colors hover:border-emerald-200 hover:bg-emerald-300/20 hover:text-white"
              >
                timemedical.in
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
