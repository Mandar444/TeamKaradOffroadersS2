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
import { Instagram, MapPin, Mail } from "lucide-react";

export default function Home() {
  const [showIntro, setShowIntro] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const skipIntro = sessionStorage.getItem("tko_skip_intro");
    if (!skipIntro) {
      setShowIntro(true);
    }
  }, []);

  const handleComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem("tko_skip_intro", "true");
  };

  const upcomingEvent = {
  name: "TEAM KARAD OFF-ROAD EVENT 2026 — SEASON 1",
  date: "31 MAY — 2026",
  location: "KARAD, MAHARASHTRA",
  categories: 8,
  maxParticipants: "160",
  prizePool: "TBA",
  features: [
    "3 Full Days of Competition",
    "Professional Drivers & Co-Drivers",
    "8 Vehicle Categories",
    "Professional Technical Trail",
    "Live Streaming & Commentary",
    "Medical Team on Standby",
    "Awards Ceremony & Trophies",
    "Technical Marshalling Support",
  ],
};

  if (!isClient) return null;

  return (
    <main className="min-h-screen">
      <AnimatePresence>
        {showIntro && <Intro onComplete={handleComplete} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 1 }}
      >
        <Hero />
        
        <div className="bg-zinc-950">
          <CarCategories />

          {/* Call to Action Section */}
          <section className="py-20 md:py-32 px-6 bg-primary/5">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-6xl font-heading text-white mb-6 uppercase leading-tight">
                READY TO <span className="text-primary italic">CONQUER?</span>
              </h2>
              <p className="text-zinc-400 text-sm md:text-lg mb-10 max-w-xl mx-auto">
                Limited seats available for the elite 160. Register now before your lucky sticker number is taken.
              </p>
              <Link 
                href="/register" 
                className={cn(buttonVariants({ size: "lg" }), "h-14 md:h-16 px-6 md:px-12 text-sm md:text-xl font-bold rounded-none skew-x-[-12deg] neon-glow bg-primary text-black inline-flex items-center justify-center w-full max-w-sm sm:w-auto")}
              >
                <span className="skew-x-[12deg] whitespace-nowrap">REGISTER FOR SEASON 1</span>
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-16 px-4 border-t border-white/5 bg-black">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
                <div>
                  <h4 className="font-heading text-white text-base md:text-lg mb-4">TEAM KARAD <span className="text-primary truncate">OFF-ROADERS</span></h4>
                  <p className="text-zinc-600 text-xs md:text-sm leading-relaxed mb-4">India's most thrilling off-road championship. Born from dust, built for glory.</p>
                  <div className="space-y-2 text-xs text-zinc-500">
                    <p className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer" onClick={() => window.open('https://maps.app.goo.gl/UcCbnHEk2i14xePK7', '_blank')}>
                      <MapPin className="w-3 h-3 text-primary" /> Karad, Maharashtra
                    </p>
                    <p className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer" onClick={() => window.location.href = 'mailto:teamkaradoffroaders@gmail.com'}>
                      <Mail className="w-3 h-3 text-primary" /> teamkaradoffroaders@gmail.com
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Navigate</p>
                  <div className="flex flex-col gap-2 text-sm text-zinc-600">
                    <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
                    <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
                    <Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
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
