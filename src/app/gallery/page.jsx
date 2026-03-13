"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";

const galleryItems = [
  { src: "https://images.unsplash.com/photo-1541575140244-96c21308bc21?q=80&w=2070&auto=format&fit=crop", caption: "TKO Rally 2025 — Start Line", category: "Rally" },
  { src: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=2070&auto=format&fit=crop", caption: "Mud Bogging Championship 2024", category: "Mud" },
  { src: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop", caption: "Night Trail Masters", category: "Night" },
  { src: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2070&auto=format&fit=crop", caption: "Hill Climb Extreme — Final Stage", category: "Hill" },
  { src: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop", caption: "The Destroyer — Pre-Race Lineup", category: "Beasts" },
  { src: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?q=80&w=2070&auto=format&fit=crop", caption: "River Crossing Challenge", category: "Rally" },
  { src: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop", caption: "Stock Category Winner", category: "Beasts" },
  { src: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=2070&auto=format&fit=crop", caption: "Crowd Goes Wild", category: "Rally" },
  { src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop", caption: "Jimny Army", category: "Beasts" },
  { src: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2070&auto=format&fit=crop", caption: "Trophy Ceremony 2024", category: "Events" },
  { src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop", caption: "Sunset at the Track", category: "Rally" },
  { src: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2070&auto=format&fit=crop", caption: "Camping Night — Season 1 Finale", category: "Events" },
];

const categories = ["All", "Rally", "Mud", "Night", "Hill", "Beasts", "Events"];

export default function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState(null);

  const filtered = filter === "All" ? galleryItems : galleryItems.filter(i => i.category === filter);

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20">
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] mb-4">Visual Archive</p>
            <h1 className="text-6xl md:text-8xl font-heading tracking-tighter uppercase leading-none mb-8">
              THE <span className="text-primary italic">GALLERY</span>
            </h1>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    filter === cat
                      ? "bg-primary text-black border-primary"
                      : "bg-white/5 text-zinc-500 border-white/5 hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((item, idx) => (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="break-inside-avoid group cursor-pointer relative overflow-hidden rounded-2xl border border-white/5 hover:border-primary/20 transition-all"
                onClick={() => setLightbox(idx)}
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  style={{ height: idx % 3 === 0 ? 400 : idx % 3 === 1 ? 300 : 350 }}
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
              onClick={(e) => { e.stopPropagation(); setLightbox((prev) => (prev > 0 ? prev - 1 : filtered.length - 1)); }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/5 rounded-xl hover:bg-white/10 text-white"
              onClick={(e) => { e.stopPropagation(); setLightbox((prev) => (prev < filtered.length - 1 ? prev + 1 : 0)); }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={filtered[lightbox]?.src}
              alt={filtered[lightbox]?.caption}
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-8 text-center">
              <p className="text-white font-heading text-xl uppercase">{filtered[lightbox]?.caption}</p>
              <p className="text-zinc-500 text-xs mt-1">{lightbox + 1} / {filtered.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
