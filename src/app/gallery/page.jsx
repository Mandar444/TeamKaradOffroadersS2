"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera, ArrowRight, Users, CarFront, ChevronDown } from "lucide-react";

const beastPreview = {
  title: "Our Beasts",
  description: "Open the machine vault and explore the off-road builds engineered for Season 2.",
  href: "/beasts",
  image: "/images/beasts/dominator/dominator-hero.jpg",
  badge: "Tactical Arsenal",
};

const teamPreview = {
  title: "Our Team",
  description: "Meet the people, marshals, and mechanics driving Team Karad forward.",
  href: "/team",
  image: "/images/team/mandar_shinde_1.jpg",
  badge: "Official Crew",
};

const galleryItems = [
  { src: "/gallery/gallery-1.jpg", caption: "Water Splash Challenge - Stage 1", category: "Rally" },
  { src: "/gallery/gallery-2.jpg", caption: "Deep Mud Navigation", category: "Mud" },
  { src: "/gallery/gallery-3.jpg", caption: "The Dominator - Willy's Custom", category: "Beasts" },
  { src: "/gallery/gallery-4.jpg", caption: "Bullet Yadav - Crowd Favorite", category: "Rally" },
  { src: "/gallery/gallery-5.jpg", caption: "Extreme Dirt Kick", category: "Hill" },
  { src: "/gallery/gallery-6.jpg", caption: "Simba - Precision Climb", category: "Rally" },
  { src: "/gallery/gallery-7.jpg", caption: "The Beast in Motion", category: "Rally" },
  { src: "/gallery/gallery-8.jpg", caption: "Heavy Mud Splash", category: "Mud" },
  { src: "/gallery/gallery-9.jpg", caption: "Ronin - Extreme Descent", category: "Hill" },
  { src: "/gallery/gallery-10.jpg", caption: "Custom Off-Rigger Trail", category: "Beasts" },
  { src: "/gallery/gallery-11.jpg", caption: "Ronin Mud Bath", category: "Mud" },
  { src: "/gallery/gallery-12.jpg", caption: "Extreme Torque - Willy's", category: "Beasts" },
  { src: "/gallery/gallery-13.jpg", caption: "Engine Revving Action", category: "Mud" },
  { src: "/gallery/gallery-14.jpg", caption: "Trackside Support", category: "Rally" },
  { src: "/gallery/gallery-15.jpg", caption: "Off-Road Grid Masters", category: "Hill" },
  { src: "/gallery/gallery-16.jpg", caption: "Ronin Climbing Ridge", category: "Hill" },
  { src: "/gallery/gallery-17.jpg", caption: "Mud Pit Execution", category: "Mud" },
  { src: "/gallery/gallery-18.jpg", caption: "Water Spray Action", category: "Rally" },
];

function FeatureCard({ title, description, href, image, badge, icon: Icon }) {
  return (
    <Link href={href} className="group block">
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25 }}
        className="relative overflow-hidden rounded-[2.25rem] border border-white/5 bg-zinc-950/80 min-h-[360px] shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
      >
        <div className="absolute inset-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 w-fit mb-5">
            {Icon ? <Icon className="w-3.5 h-3.5 text-primary" /> : null}
            {badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-heading uppercase tracking-tighter leading-none text-white mb-4 italic">
            {title}
          </h2>
          <p className="text-zinc-300 text-sm md:text-base max-w-md leading-relaxed mb-8">
            {description}
          </p>
          <div className="inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.35em]">
            Explore
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState(null);
  const [seasonOneOpen, setSeasonOneOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-32 pb-16 md:pb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[60%] h-[50vh] bg-mesh-amber opacity-10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />

      <section className="px-6 py-12 md:py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12 md:mb-16">
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] mb-4">Visual Archive</p>
            <h1 className="text-[12vw] md:text-8xl font-heading tracking-tighter uppercase leading-none mb-8">
              THE <span className="text-primary italic">GALLERY</span>
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-3xl leading-relaxed font-medium">
              One hub for the machines, the crew, and the Season 1 image archive.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <FeatureCard
              title={beastPreview.title}
              description={beastPreview.description}
              href={beastPreview.href}
              image={beastPreview.image}
              badge={beastPreview.badge}
              icon={CarFront}
            />
            <FeatureCard
              title={teamPreview.title}
              description={teamPreview.description}
              href={teamPreview.href}
              image={teamPreview.image}
              badge={teamPreview.badge}
              icon={Users}
            />
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-[2.25rem] border border-white/5 bg-zinc-950/80 min-h-[360px] shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
            >
              <button
                type="button"
                onClick={() => setSeasonOneOpen((open) => !open)}
                className="group block w-full text-left"
              >
                <div className="absolute inset-0">
                  <img
                    src="/gallery/gallery-1.jpg"
                    alt="Team Karad Offroaders Season 1"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
                </div>

                <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 w-fit mb-5">
                    <Camera className="w-3.5 h-3.5 text-primary" />
                    Season 1 Archive
                  </div>
                  <h2 className="text-4xl md:text-5xl font-heading uppercase tracking-tighter leading-none text-white mb-4 italic">
                    Team Karad Offroaders <span className="text-primary not-italic">Season 1</span>
                  </h2>
                  <p className="text-zinc-300 text-sm md:text-base max-w-md leading-relaxed mb-6">
                    Open the archive to reveal the current Season 1 gallery images.
                  </p>
                  <div className="inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.35em]">
                    {seasonOneOpen ? "Hide Archive" : "View Archive"}
                    <ChevronDown className={`w-4 h-4 transition-transform ${seasonOneOpen ? "rotate-180" : ""}`} />
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {seasonOneOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="relative z-10 overflow-hidden border-t border-white/5 bg-black/65 backdrop-blur-md"
                  >
                    <div className="p-5 md:p-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {galleryItems.map((item, idx) => (
                        <motion.div
                          key={idx}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          className="aspect-[4/5] group cursor-pointer relative overflow-hidden rounded-2xl border border-white/5 hover:border-primary/20 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightbox(idx);
                          }}
                        >
                          <img
                            src={item.src}
                            alt={item.caption}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                            <div className="p-4">
                              <p className="text-white font-heading text-sm md:text-lg uppercase">{item.caption}</p>
                              <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] mt-1">{item.category}</p>
                            </div>
                          </div>
                          <div className="absolute top-3 right-3 w-9 h-9 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-4 h-4 text-white" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 p-3 bg-white/5 rounded-xl hover:bg-white/10 text-white" onClick={() => setLightbox(null)}>
              <X className="w-6 h-6" />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/5 rounded-xl hover:bg-white/10 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((prev) => (prev > 0 ? prev - 1 : galleryItems.length - 1));
              }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/5 rounded-xl hover:bg-white/10 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((prev) => (prev < galleryItems.length - 1 ? prev + 1 : 0));
              }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={galleryItems[lightbox]?.src}
              alt={galleryItems[lightbox]?.caption}
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-8 text-center">
              <p className="text-white font-heading text-xl uppercase">{galleryItems[lightbox]?.caption}</p>
              <p className="text-zinc-500 text-xs mt-1">
                {lightbox + 1} / {galleryItems.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
