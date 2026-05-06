"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BadgePercent, ExternalLink, MapPin, Phone, ArrowLeft } from "lucide-react";

const HOTEL_OFFERS = [
  {
    name: "Vits Satyajeet karad",
    location: "https://share.google/OJbRAGUPFEdnTUi1C",
    contact: "8237385654",
    offer: "30% discount on stay",
  },
  {
    name: "Hotel saffire Karad",
    location: "https://share.google/q3vxBr1sXwaIlcE7r",
    contact: "9175428640",
    offer: "Discount available while booking",
  },
  {
    name: "Hotel alankar",
    location: "https://share.google/J7HHCcBDxdOgZK2gD",
    contacts: ["02164-230011", "02164-230012", "02164-230013", "02164-230014", "9172048398", "9172048399"],
    contactDisplayLines: ["02164-230011/12/13/14", "9172048398/99"],
    offer: "10% discount on stay",
  },
  {
    name: "Hotel Mahendra karad",
    location: "https://maps.app.goo.gl/UEXXK2F3fmz5MGRw9",
    contacts: ["9156182999", "9075348899"],
    offer: "Exclusive offer for Karad Offroad Season 2 participants",
  },
  {
    name: "The fern residency karad",
    location: "https://maps.app.goo.gl/VVE2KQx7SeNy5vtM8",
    contacts: ["+91 7796615255", "+91 7796615254"],
    offer: "10% discount on stay and food",
  },
  {
    name: "Hotel Krishna palace karad",
    location: "https://maps.app.goo.gl/VVE2KQx7SeNy5vtM8",
    contact: "",
    offer: "Participant accommodation available",
  },
  {
    name: "Hotel jarul inn",
    location: "https://maps.app.goo.gl/9WzKvq39ZCL9y5zV6?g_st=aw",
    contacts: ["02164-299199", "9921000299"],
    contactDisplayLines: ["02164-299199", "9921000299"],
    offer: "10% discount",
  },
];

export default function HotelSupportPage() {
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
              Hotel Support
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-7xl font-heading uppercase leading-[0.95] tracking-normal">
              Partner hotels for <span className="text-[#ff8a00]">Season 2</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm md:text-lg leading-relaxed text-white/65">
              Find the partner hotels offering special participant benefits for Karad Offroad Season 2.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {HOTEL_OFFERS.map((hotel, index) => (
            <motion.article
              key={hotel.name}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="flex w-full flex-col rounded-[1.75rem] border border-white/10 bg-white/5 p-5 md:p-8 shadow-[0_18px_80px_rgba(0,0,0,0.35)] backdrop-blur-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl md:text-4xl font-heading uppercase leading-tight text-white break-words">
                    {hotel.name}
                  </h2>
                  <p className="mt-2 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-[#ff8a00]">
                    <BadgePercent className="w-4 h-4" />
                    Offer
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm md:text-base leading-relaxed text-white/75">
                {hotel.offer}
              </p>

              <div className="mt-8 grid gap-4 text-sm">
                {hotel.contactDisplayLines ? (
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white">
                    <Phone className="w-4 h-4 shrink-0 text-[#ff8a00]" />
                    <span className="font-medium leading-relaxed break-words">
                      {hotel.contactDisplayLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </span>
                  </div>
                ) : hotel.contacts?.length ? (
                  hotel.name === "Hotel Mahendra karad" || hotel.name === "The fern residency karad" ? (
                    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white">
                      <Phone className="w-4 h-4 shrink-0 text-[#ff8a00]" />
                      <span className="font-medium leading-relaxed break-words">
                        {hotel.contacts.map((contact) => (
                          <span key={contact} className="block">
                            {contact}
                          </span>
                        ))}
                      </span>
                    </div>
                  ) : (
                    hotel.contacts.map((contact) => (
                      <a
                        key={contact}
                        href={`tel:${contact.replace(/[^\d+]/g, "")}`}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white transition-colors hover:border-[#ff8a00]/40 hover:bg-black/50"
                      >
                        <Phone className="w-4 h-4 shrink-0 text-[#ff8a00]" />
                        <span className="font-medium break-words">{contact}</span>
                      </a>
                    ))
                  )
                ) : hotel.contact ? (
                  <a
                    href={`tel:${hotel.contact}`}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white transition-colors hover:border-[#ff8a00]/40 hover:bg-black/50"
                  >
                    <Phone className="w-4 h-4 text-[#ff8a00]" />
                    <span className="font-medium">{hotel.contact}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white/45">
                    <Phone className="w-4 h-4 text-white/30" />
                    <span className="font-medium">Contact not listed</span>
                  </div>
                )}

                <a
                  href={hotel.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white transition-colors hover:border-[#ff8a00]/40 hover:bg-black/50"
                >
                  <MapPin className="w-4 h-4 text-[#ff8a00]" />
                  <span className="font-medium">Open location</span>
                  <ExternalLink className="ml-auto w-4 h-4 text-white/50" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
