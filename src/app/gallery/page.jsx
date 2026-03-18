"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";

const galleryItems = [
  { src: "/gallery/gallery-1.jpg", caption: "Water Splash Challenge — Stage 1", category: "Rally" },
  { src: "/gallery/gallery-2.jpg", caption: "Deep Mud Navigation", category: "Mud" },
  { src: "/gallery/gallery-3.jpg", caption: "The Dominator — Willy's Custom", category: "Beasts" },
  { src: "/gallery/gallery-4.jpg", caption: "Bullet Yadav — Crowd Favorite", category: "Rally" },
  { src: "/gallery/gallery-5.jpg", caption: "Extreme Dirt Kick", category: "Hill" },
  { src: "/gallery/gallery-6.jpg", caption: "Simba — Precision Climb", category: "Rally" },
  { src: "/gallery/gallery-7.jpg", caption: "The Beast in Motion", category: "Rally" },
  { src: "/gallery/gallery-8.jpg", caption: "Heavy Mud Splash", category: "Mud" },
  { src: "/gallery/gallery-9.jpg", caption: "Ronin — Extreme Descent", category: "Hill" },
  { src: "/gallery/gallery-10.jpg", caption: "Custom Off-Rigger Trail", category: "Beasts" },
  { src: "/gallery/gallery-11.jpg", caption: "Ronin Mud Bath", category: "Mud" },
  { src: "/gallery/gallery-12.jpg", caption: "Extreme Torque — Willy's", category: "Beasts" },
  { src: "/gallery/gallery-13.jpg", caption: "Engine Revving Action", category: "Mud" },
  { src: "/gallery/gallery-14.jpg", caption: "Trackside Support", category: "Rally" },
  { src: "/gallery/gallery-15.jpg", caption: "Off-Road Grid Masters", category: "Hill" },
  { src: "/gallery/gallery-16.jpg", caption: "Ronin Climbing Ridge", category: "Hill" },
  { src: "/gallery/gallery-17.jpg", caption: "Mud Pit Execution", category: "Mud" },
  { src: "/gallery/gallery-18.jpg", caption: "Water Spray Action", category: "Rally" },
  // Final 2 Placeholders
  { src: "https://images.unsplash.com/photo-1541575140244-96c21308bc21?q=80&w=2070&auto=format&fit=crop", caption: "Team Karad Off-Roaders Season Finale", category: "Rally" },
  { src: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=2070&auto=format&fit=crop", caption: "Champ Ceremony — Coming Soon", category: "Events" },
];

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-32 pb-16 md:pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[60%] h-[50vh] bg-mesh-amber opacity-10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />

      <section className="px-6 py-12 md:py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] mb-4">Visual Archive</p>
            <h1 className="text-[12vw] md:text-8xl font-heading tracking-tighter uppercase leading-none mb-8">
              THE <span className="text-primary italic">GALLERY</span>
            </h1>
          </motion.div>

          {/* Stable Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item, idx) => (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="aspect-[4/5] group cursor-pointer relative overflow-hidden rounded-2xl border border-white/5 hover:border-primary/20 transition-all"
                onClick={() => setLightbox(idx)}
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <div className="p-6">
                    <p className="text-white font-heading text-lg uppercase">{item.caption}</p>
                    <p className="text-zinc-400 text-xs uppercase tracking-widest mt-1">{item.category}</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
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
              onClick={(e) => { e.stopPropagation(); setLightbox((prev) => (prev > 0 ? prev - 1 : galleryItems.length - 1)); }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/5 rounded-xl hover:bg-white/10 text-white"
              onClick={(e) => { e.stopPropagation(); setLightbox((prev) => (prev < galleryItems.length - 1 ? prev + 1 : 0)); }}
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
              <p className="text-zinc-500 text-xs mt-1">{lightbox + 1} / {galleryItems.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

