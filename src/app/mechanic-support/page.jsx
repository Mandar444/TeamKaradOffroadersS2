"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Wrench, Phone, MapPin, BadgeCheck, Cog } from "lucide-react";

const MECHANIC_SUPPORT = {
  name: "Jyotirling Hardware",
  contactPerson: "Mahesh Suryawanshi",
  phone: "9049604560",
  label: "Highway Shop",
  shopDetails: {
    title: "Highway Shop",
    contactPerson: "Mahesh Suryawanshi",
    phone: "9049604560",
    location: "https://maps.app.goo.gl/Bee6Jz4Vr4XTownz6",
  },
  extraShopDetails: {
    title: "Karad City Shop",
    contactPerson: "Nilesh Suryawanshi",
    phone: "09049604393",
    location: "https://maps.app.goo.gl/gbHfKJMfVTUCtdPV7",
  },
};

const SUPPORT_CARDS = [
  MECHANIC_SUPPORT,
  {
    name: "Shivraj Automobiles",
    contactPerson: "Hemant Jagtap",
    phone: "8698311171",
    label: "Mahindra Spare Parts",
    location: "https://maps.app.goo.gl/8byPLFSYwP6Pspbm7",
  },
  {
    name: "Siddhanath Electrician",
    contactPerson: "Rohit Mistry",
    phone: "9075445418",
    label: "Electrical Repair Support",
    location: "https://maps.app.goo.gl/Etv24jgKAEv7LN426",
  },
  {
    name: "Shri Bhairavnath Electricals",
    contactPerson: "Yashwant Nangare",
    phone: "9970769427",
    location: "https://maps.app.goo.gl/1QSobHh6bARgrkBV7",
    label: "Electrical Repair Support",
  },
  {
    name: "Metro Garage",
    contactPerson: "Irfan Mistry",
    phone: "9822195349",
    label: "Gypsy/Jimny Specialist Petrol Mechanic",
    location: "https://maps.app.goo.gl/4Y8ofisavXNaEjG58",
  },
  {
    name: "NJ Motors",
    contactPerson: "Anup",
    phone: "+91 91462 80187",
    secondaryPhone: "+91 95793 33305",
    location: "https://maps.app.goo.gl/urS3wnJ4FaFyT9GVA",
    label: "Hydraulic Power Steering systems",
  },
  {
    name: "Koyna Trading Corporation",
    contactPerson: "Store Contact",
    phone: "7666984405",
    location: "https://maps.app.goo.gl/sYdqFxcCBpp3f69u6",
    label: "Pneumatic material & Supplies",
    icon: "cog",
  },
  {
    name: "Sai Siddhi Spring House",
    contactPerson: "Sandip Katkar",
    phone: "9421573925",
    location: "https://maps.app.goo.gl/rKFjJq5XJEFiw2gx8",
    label: "Suspension Systems and Shock Absorbers",
    icon: "cog",
  },
];

export default function MechanicSupportPage() {
  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,138,0,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(255,138,0,0.12),_transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-14">
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 md:mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] sm:tracking-[0.3em] text-white/80 transition-colors hover:border-[#ff8a00]/40 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10 max-w-3xl"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.22em] sm:tracking-[0.6em] text-[#ff8a00]">
              Mechanical Support
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-7xl font-heading uppercase leading-[0.95] tracking-normal">
              Mechanical, Spare Parts and Tools <span className="text-[#ff8a00]">Partners</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm md:text-lg leading-relaxed text-white/65">
              Reach the mechanic support contact below for hardware and roadside assistance.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {SUPPORT_CARDS.map((support, index) => (
            <motion.article
              key={support.name}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex w-full flex-col rounded-[1.75rem] border border-white/10 bg-white/5 p-5 md:p-8 shadow-[0_18px_80px_rgba(0,0,0,0.35)] backdrop-blur-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] sm:tracking-[0.4em] text-[#ff8a00]">
                    <BadgeCheck className="w-4 h-4" />
                    Verified support
                  </p>
                  <h2 className="mt-4 text-2xl md:text-4xl font-heading uppercase leading-tight text-white break-words">
                    {support.name}
                  </h2>
                  <p className="mt-2 text-sm md:text-base font-semibold uppercase tracking-[0.12em] sm:tracking-[0.2em] text-white/60 break-words">
                    {support.label}
                  </p>
                </div>
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border border-[#ff8a00]/30 bg-[#ff8a00]/10 text-[#ff8a00]">
                  {support.icon === "cog" || support.name === "NJ Motors" ? (
                    <Cog className="h-7 w-7" />
                  ) : index < 2 ? (
                    <Cog className="h-7 w-7" />
                  ) : (
                    <Wrench className="h-7 w-7" />
                  )}
                </div>
              </div>

              <div className="mt-8 grid gap-4">
                {!support.shopDetails && (
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-4">
                    <Wrench className="w-4 h-4 text-[#ff8a00] shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/45">Contact Person</p>
                      <p className="mt-1 text-base md:text-lg font-semibold text-white">{support.contactPerson}</p>
                    </div>
                  </div>
                )}

                {support.shopDetails ? (
                  <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/45">
                      {support.shopDetails.title}
                    </p>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-start gap-3">
                        <Wrench className="mt-0.5 w-4 h-4 text-[#ff8a00] shrink-0" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/45">Contact Person</p>
                          <p className="mt-1 text-base md:text-lg font-semibold text-white">{support.shopDetails.contactPerson}</p>
                        </div>
                      </div>
                      <a
                        href={`tel:${support.shopDetails.phone}`}
                        className="flex items-start gap-3 transition-colors hover:text-white"
                      >
                        <Phone className="mt-0.5 w-4 h-4 text-[#ff8a00] shrink-0" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/45">Phone</p>
                          <p className="mt-1 text-base md:text-lg font-semibold text-white">{support.shopDetails.phone}</p>
                        </div>
                      </a>
                      <a
                        href={support.shopDetails.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 transition-colors hover:text-white"
                      >
                        <MapPin className="mt-0.5 w-4 h-4 text-[#ff8a00] shrink-0" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/45">Location</p>
                      </a>
                    </div>
                  </div>
                ) : null}

                {support.extraShopDetails ? (
                  <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/45">
                      {support.extraShopDetails.title}
                    </p>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-start gap-3">
                        <Wrench className="mt-0.5 w-4 h-4 text-[#ff8a00] shrink-0" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/45">Contact Person</p>
                          <p className="mt-1 text-base md:text-lg font-semibold text-white">{support.extraShopDetails.contactPerson}</p>
                        </div>
                      </div>
                      <a
                        href={`tel:${support.extraShopDetails.phone}`}
                        className="flex items-start gap-3 transition-colors hover:text-white"
                      >
                        <Phone className="mt-0.5 w-4 h-4 text-[#ff8a00] shrink-0" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/45">Phone</p>
                          <p className="mt-1 text-base md:text-lg font-semibold text-white">{support.extraShopDetails.phone}</p>
                        </div>
                      </a>
                      <a
                        href={support.extraShopDetails.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 transition-colors hover:text-white"
                      >
                        <MapPin className="mt-0.5 w-4 h-4 text-[#ff8a00] shrink-0" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/45">Location</p>
                      </a>
                    </div>
                  </div>
                ) : null}

                {!support.shopDetails && !support.extraShopDetails && (
                  <a
                    href={`tel:${support.phone}`}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-4 transition-colors hover:border-[#ff8a00]/40 hover:bg-black/50"
                  >
                    <Phone className="w-4 h-4 text-[#ff8a00] shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/45">Phone</p>
                      <p className="mt-1 text-base md:text-lg font-semibold text-white">{support.phone}</p>
                    </div>
                  </a>
                )}

                {support.location && !support.shopDetails && !support.extraShopDetails ? (
                  <a
                    href={support.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white/70 transition-colors hover:border-[#ff8a00]/40 hover:bg-black/40"
                  >
                    <MapPin className="w-4 h-4 text-[#ff8a00] shrink-0" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/45">Location</p>
                  </a>
                ) : null}
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
