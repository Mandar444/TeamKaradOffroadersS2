"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera, ArrowLeft } from "lucide-react";

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

export default function SeasonOneGalleryPage() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-32 pb-16 md:pb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[60%] h-[50vh] bg-mesh-amber opacity-10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />

      <section className="px-6 py-12 md:py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-10">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-white/80 transition-colors hover:border-[#ff8a00]/40 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12 md:mb-16">
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] mb-4">Visual Archive</p>
            <h1 className="text-[12vw] md:text-8xl font-heading tracking-tighter uppercase leading-none mb-8">
              KARAD OFFROAD <span className="text-primary italic">SEASON 1</span>
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-3xl leading-relaxed font-medium">
              Explore the full image archive from Team Karad Offroad Season 1.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-6 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {galleryItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="aspect-[4/5] group cursor-pointer relative overflow-hidden rounded-2xl border border-white/5 hover:border-primary/20 transition-all"
              onClick={() => setLightbox(idx)}
            >
              <Image
                src={item.src}
                alt={item.caption}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
