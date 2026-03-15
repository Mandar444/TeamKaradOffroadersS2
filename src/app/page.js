"use client";

import { useState, useEffect } from "react";
import Hero from "@/components/sections/Hero";
import CarCategories from "@/components/sections/Categories";
import PastEvents from "@/components/sections/PastEvents";
import Intro from "@/components/sections/Intro";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Instagram } from "lucide-react";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <main className="min-h-screen">
      <AnimatePresence>
        {showIntro && <Intro onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 1 }}
      >
        <Hero />
        
        <div className="bg-zinc-950">
          <CarCategories />
          <PastEvents />

          {/* Call to Action Section */}
          <section className="py-24 px-4 bg-primary/5">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-heading text-white mb-6">
                READY TO <span className="text-primary italic">CONQUER?</span>
              </h2>
              <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
                Seats are limited to 200 participants across all categories. Register now before your lucky number is taken.
              </p>
              <Link 
                href="/register" 
                className={cn(buttonVariants({ size: "lg" }), "h-16 px-12 text-xl font-bold rounded-none skew-x-[-12deg] neon-glow bg-primary text-black inline-flex items-center justify-center")}
              >
                <span className="skew-x-[12deg]">CLAIM YOUR NUMBER</span>
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-16 px-4 border-t border-white/5 bg-black">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
                <div>
                  <h4 className="font-heading text-white text-base md:text-lg mb-4">TEAM KARAD <span className="text-primary truncate">OFF-ROADERS</span></h4>
                  <p className="text-zinc-600 text-xs md:text-sm leading-relaxed">India's most thrilling off-road championship. Born from dust, built for glory.</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Navigate</p>
                  <div className="flex flex-col gap-2 text-sm text-zinc-600">
                    <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
                    <Link href="/events" className="hover:text-white transition-colors">Events</Link>
                    <Link href="/achievements" className="hover:text-white transition-colors">Achievements</Link>
                    <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
                  </div>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Explore</p>
                  <div className="flex flex-col gap-2 text-sm text-zinc-600">
                    <Link href="/beasts" className="hover:text-white transition-colors">Our Beasts</Link>
                    <Link href="/team" className="hover:text-white transition-colors">Our Team</Link>
                    <Link href="/teams" className="hover:text-white transition-colors">Participants</Link>
                    <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                  </div>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Community</p>
                  <div className="flex flex-col gap-3">
                    <a 
                      href="https://www.instagram.com/teamkaradoffroaders/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-zinc-600 hover:text-pink-500 transition-all group"
                    >
                      <Instagram className="w-5 h-5" />
                      <span className="text-sm">5,000+ Followers</span>
                    </a>
                    <Link href="/register" className="text-primary hover:text-white transition-colors font-bold text-sm tracking-widest uppercase">Register Now</Link>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <span className="text-zinc-700 text-sm">© 2026 Team Karad Off-Roaders. All rights reserved.</span>
                <span className="text-zinc-800 text-xs">Made with 🏁 in Karad, Maharashtra</span>
              </div>
            </div>
          </footer>
        </div>
      </motion.div>
    </main>
  );
}
