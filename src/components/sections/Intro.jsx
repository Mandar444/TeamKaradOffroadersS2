"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Power } from "lucide-react";

export default function Intro({ onComplete }) {
  const [started, setStarted] = useState(false);
  const [showAnimatedLogo, setShowAnimatedLogo] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVibrating, setIsVibrating] = useState(false);
  const revSound = useRef(null);
  const popSound = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleStart = () => {
    setStarted(true);
    setIsVibrating(true);

    // Haptic Vibration for Mobile
    if ("vibrate" in navigator) {
      // Complex pattern: short pulses then a long blast as engine fires up
      navigator.vibrate([100, 30, 100, 30, 200, 50, 1000]);
    }

    if (revSound.current) {
      revSound.current.volume = 0.7;
      revSound.current.play().catch(e => console.log("Audio play blocked"));
    }

    // Stop intense vibration after 1 second but keep a subtle hum
    setTimeout(() => setIsVibrating(false), 1500);

    setTimeout(() => {
      setShowAnimatedLogo(true);
      if (popSound.current) {
        popSound.current.volume = 0.8;
        popSound.current.play().catch(e => console.log("Audio play blocked"));
      }
    }, 800);

    setTimeout(() => {
      onComplete();
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden cursor-none">
      {/* Custom Cursor */}
      <motion.div
        animate={{ x: mousePos.x - 20, y: mousePos.y - 20 }}
        transition={{ type: "spring", damping: 30, stiffness: 250, mass: 0.5 }}
        className="fixed top-0 left-0 w-10 h-10 border border-primary/50 rounded-full z-[110] pointer-events-none flex items-center justify-center"
      >
        <div className="w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_oklch(0.7_0.2_60)]" />
      </motion.div>

      {/* Audio elements */}
      <audio ref={revSound} src="/engine-rev.mp3" preload="auto" />
      <audio ref={popSound} src="/logo-pop.mp3" preload="auto" />

      <AnimatePresence mode="wait">
        {!started ? (
          <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center">
            {/* Logo visible right away */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12"
            >
              {/* SEO Optimized Hidden H1 */}
              <h1 className="sr-only">Team Karad Off-Roaders | India's Most Thrilling Offroading Event and Competition</h1>
              
              <img 
                src="/logo.png" 
                alt="Team Karad Off-Roaders - Best Offroading Competition in India"
                className="w-64 md:w-96 h-auto drop-shadow-[0_0_40px_rgba(255,165,0,0.4)]"
                onError={(e) => {
                  e.target.style.display = 'none';
                  document.getElementById('intro-fallback-text').style.display = 'block';
                }}
              />
              <div id="intro-fallback-text" className="hidden">
                <p className="text-5xl md:text-8xl font-heading text-white tracking-tighter">
                  TEAM KARAD <span className="text-primary italic">OFF-ROADERS</span>
                </p>
                <p className="text-xl md:text-3xl text-primary font-heading tracking-[0.5em] mt-2 font-bold uppercase">India's Ultimate Off-Road Event</p>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 3, filter: "blur(20px)" }}
              onClick={handleStart}
              className="group relative flex flex-col items-center gap-6"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-primary/30 flex items-center justify-center group-hover:border-primary transition-colors duration-500 shadow-[0_0_50px_rgba(255,165,0,0.1)] group-hover:shadow-[0_0_80px_rgba(255,165,0,0.3)] bg-black/40 backdrop-blur-sm">
                <Power className="w-14 h-14 md:w-20 md:h-20 text-primary group-hover:drop-shadow-[0_0_20px_oklch(0.7_0.2_60)] transition-all" />
              </div>
              <span className="font-heading tracking-[0.5em] text-primary font-bold text-xl md:text-2xl animate-pulse">START ENGINE</span>
            </motion.button>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Flash Effect */}
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: [0, 1, 0] }}
               transition={{ duration: 0.5 }}
               className="absolute inset-0 bg-white z-[60]"
            />

            {/* The "Crazy" Strip Animation */}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: 45 }}
              animate={{ 
                scale: [0, 2, 8], 
                opacity: [0, 1, 0],
                x: [0, -400, -2000],
                y: [0, 400, 2000]
              }}
              transition={{ duration: 3, ease: "circIn" }}
              className="absolute pointer-events-none"
            >
              <div 
                className="w-[300vw] h-[600px] bg-primary/30 blur-[120px] skew-x-[45deg]"
                style={{ background: "linear-gradient(90deg, transparent, oklch(0.7 0.2 60), transparent)" }}
              />
            </motion.div>

            {/* Logo Slam Animation */}
            <AnimatePresence>
              {showAnimatedLogo && (
                <motion.div
                  initial={{ scale: 5, opacity: 0, filter: "brightness(3) blur(30px)" }}
                  animate={{ scale: 1, opacity: 1, filter: "brightness(1) blur(0px)" }}
                  transition={{ type: "spring", damping: 12, stiffness: 80 }}
                  className="z-50"
                >
                  <img 
                    src="/logo.png" 
                    alt="Team Karad Logo"
                    className="w-[85vw] max-w-[600px] md:max-w-[900px] h-auto drop-shadow-[0_0_100px_rgba(255,165,0,0.8)]" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      document.getElementById('intro-slam-fallback').style.display = 'block';
                    }}
                  />
                  <div id="intro-slam-fallback" className="hidden text-center">
                    <h2 className="text-7xl md:text-[12rem] font-heading text-white tracking-tighter shadow-primary/50">
                      TEAM <span className="text-primary italic">KARAD</span>
                    </h2>
                    <p className="text-2xl md:text-5xl text-primary font-heading tracking-[0.8em] mt-4 font-bold uppercase italic">OFFROADERS</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Background speed lines */}
            <div className="absolute inset-0 z-0">
                {[12, 45, 78, 23, 56, 89, 34, 67, 91, 15, 38, 62, 85, 27, 50, 73, 10, 42, 65, 88].map((top, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: [0, 2000], opacity: [0, 0.2, 0] }}
                    transition={{ 
                      duration: 0.5, 
                      repeat: Infinity, 
                      delay: i * 0.1,
                      ease: "linear"
                    }}
                    className="absolute h-px bg-primary/30"
                    style={{ top: `${top}%`, width: `${(i % 5 + 1) * 100}px` }}
                  />
                ))}
            </div>

            {/* Screen Shake Wrapper */}
            <motion.div 
               animate={isVibrating ? {
                 x: [0, -5, 5, -5, 5, 0],
                 y: [0, 5, -5, 5, -5, 0]
               } : {}}
               transition={{ duration: 0.1, repeat: isVibrating ? Infinity : 0 }}
               className="absolute inset-0 pointer-events-none"
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
