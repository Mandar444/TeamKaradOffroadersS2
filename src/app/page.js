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
          <footer className="py-12 px-4 border-t border-white/5 bg-black">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-2xl font-heading text-white">
                TKO <span className="text-primary">RALLY</span>
              </div>
              <div className="flex gap-8 text-zinc-500 text-sm">
                <Link href="/teams" className="hover:text-white">Participants</Link>
                <Link href="/admin" className="hover:text-white">Admin Login</Link>
                <span className="text-zinc-700">© 2026 TKO Motorsports</span>
              </div>
            </div>
          </footer>
        </div>
      </motion.div>
    </main>
  );
}
