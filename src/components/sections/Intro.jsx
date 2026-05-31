"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const IGNITION_DURATION_MS = 3000;
const IGNITION_VIBRATION_PATTERN = [100, 40, 140, 40, 220, 80, 620];

export default function Intro({ onComplete }) {
  const [started, setStarted] = useState(false);
  const revSound = useRef(null);
  const completeTimer = useRef(null);

  const stopIgnitionEffects = useCallback(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate(0);
    }

    if (revSound.current) {
      revSound.current.pause();
      revSound.current.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (completeTimer.current) {
        clearTimeout(completeTimer.current);
      }

      stopIgnitionEffects();
    };
  }, [stopIgnitionEffects]);

  const handleIgnitionPress = () => {
    if (started) {
      return;
    }

    setStarted(true);

    if ("vibrate" in navigator) {
      navigator.vibrate(IGNITION_VIBRATION_PATTERN);
    }

    if (revSound.current) {
      revSound.current.volume = 0.9;
      revSound.current.currentTime = 0;
      revSound.current.play().catch(() => {});
    }

    completeTimer.current = setTimeout(() => {
      stopIgnitionEffects();
      onComplete();
    }, IGNITION_DURATION_MS);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#040405] px-6"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <style>{`
        .tko-floating-ctas{display:none!important}
        .tko-splash-shell{
          width:100%;
          min-height:100svh;
          display:flex;
          align-items:center;
          justify-content:center;
          font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }
        .tko-splash-stack{
          width:100%;
          max-width:960px;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          text-align:center;
          transform:scale(var(--tko-splash-scale, 1));
          transform-origin:center;
        }
        .tko-logo-ground{
          position:relative;
          width:288px;
          height:288px;
          margin-bottom:22px;
          border-radius:144px;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
          background:#050505;
          border:2px solid #d4a441;
          box-shadow:0 12px 46px rgba(241,185,77,.5);
        }
        .tko-logo-side-glow{
          position:absolute;
          top:42px;
          width:118px;
          height:204px;
          border-radius:59px;
          background:rgba(255,196,64,.32);
          border:1.4px solid rgba(255,234,170,.42);
          box-shadow:0 0 36px rgba(255,211,107,.82);
        }
        .tko-logo-side-glow.left{
          left:-34px;
          transform:rotate(-18deg);
        }
        .tko-logo-side-glow.right{
          right:-34px;
          transform:rotate(18deg);
          background:rgba(255,204,82,.32);
          border-color:rgba(255,236,176,.42);
          box-shadow:0 0 36px rgba(255,215,120,.82);
        }
        .tko-logo-amber-glow{
          position:absolute;
          width:244px;
          height:244px;
          border-radius:122px;
          background:rgba(255,193,62,.38);
          border:1.8px solid rgba(255,232,158,.52);
          box-shadow:0 0 52px #ffd05c;
        }
        .tko-welcome-logo{
          position:relative;
          z-index:2;
          width:272px;
          height:272px;
          object-fit:contain;
        }
        .tko-splash-title{
          margin:0;
          color:#fff6ea;
          max-width:min(920px, 92vw);
          text-shadow:0 0 34px rgba(255,138,0,.35);
        }
        .tko-switch-row{
          margin-top:22px;
          display:flex;
          align-items:center;
          justify-content:center;
        }
        .tko-ignition-hitbox{
          position:relative;
          width:260px;
          height:228px;
          display:flex;
          align-items:center;
          justify-content:center;
          border:0;
          padding:0;
          color:inherit;
          background:transparent;
          cursor:pointer;
          touch-action:manipulation;
        }
        .tko-ignition-hitbox:disabled{
          cursor:default;
        }
        .tko-ignition-panel{
          position:absolute;
          top:4px;
          left:0;
          right:0;
          display:flex;
          justify-content:center;
        }
        .tko-ignition-panel-label{
          color:#ffd59a;
          font-size:15px;
          font-weight:800;
          line-height:1.2;
          letter-spacing:2.4px;
        }
        .tko-ignition-button{
          position:relative;
          width:178px;
          height:178px;
          margin-top:34px;
          border-radius:89px;
          display:flex;
          align-items:center;
          justify-content:center;
          background:#2e251d;
          border:2px solid #8e6a36;
          box-shadow:10px 12px 16px rgba(0,0,0,.24);
        }
        .tko-ring-outer{
          position:absolute;
          width:168px;
          height:168px;
          border-radius:84px;
          background:#3a3026;
          border:2px solid #4f3e2a;
        }
        .tko-ring-inner{
          position:absolute;
          width:132px;
          height:132px;
          border-radius:66px;
          background:#4a3d2d;
          border:2px solid #6f5735;
          box-shadow:0 0 10px rgba(255,215,160,.08);
        }
        .tko-ring-core{
          position:absolute;
          width:94px;
          height:94px;
          border-radius:47px;
          background:#1f1a15;
          border:1.5px solid #7c6037;
        }
        .tko-accent-outer,
        .tko-accent-inner{
          position:absolute;
          border:2px solid #ffbf63;
          opacity:.62;
          border-radius:999px;
        }
        .tko-accent-outer{
          width:152px;
          height:152px;
        }
        .tko-accent-inner{
          width:116px;
          height:116px;
        }
        .tko-dial-markers{
          position:absolute;
          inset:0;
        }
        .tko-dial-mark{
          position:absolute;
          width:8px;
          height:8px;
          border-radius:4px;
          background:#ffba58;
          box-shadow:0 0 6px rgba(255,173,51,.75);
        }
        .tko-dial-mark.off{left:26px;top:51px}
        .tko-dial-mark.acc{left:65px;top:20px}
        .tko-dial-mark.on{left:119px;top:26px}
        .tko-dial-mark.start{left:153px;top:85px}
        .tko-dial-text{
          position:absolute;
          width:44px;
          color:#ffbf63;
          font-size:10px;
          font-weight:800;
          line-height:1.2;
          letter-spacing:.35px;
          text-align:center;
          text-shadow:0 0 5px rgba(255,168,44,.55);
        }
        .tko-dial-text.off{left:4px;top:40px}
        .tko-dial-text.acc{left:48px;top:4px}
        .tko-dial-text.on{left:103px;top:14px}
        .tko-dial-text.start{left:128px;top:74px}
        .tko-key-center{
          position:absolute;
          top:72px;
          width:150px;
          height:34px;
          display:flex;
          align-items:center;
          justify-content:center;
        }
        .tko-key-shadow{
          position:absolute;
          width:154px;
          height:36px;
          border-radius:18px;
          background:rgba(0,0,0,.32);
          box-shadow:18px 12px 8px rgba(0,0,0,.32);
        }
        .tko-key-handle{
          position:absolute;
          width:150px;
          height:28px;
          border-radius:14px;
          background:#111;
          border:1px solid #3b2a16;
          box-shadow:0 4px 8px rgba(0,0,0,.45);
        }
        .tko-key-handle-gloss{
          position:absolute;
          left:10px;
          right:10px;
          top:2px;
          height:8px;
          border-radius:4px;
          background:rgba(255,198,112,.2);
        }
        .tko-key-hub{
          position:absolute;
          width:38px;
          height:38px;
          border-radius:19px;
          background:#171412;
          border:1px solid #8f6937;
        }
        .tko-ignition-message{
          margin:0;
          color:#ffd59a;
          font-size:15px;
          font-weight:800;
          line-height:1.25;
          letter-spacing:2px;
          text-transform:uppercase;
        }
        @media (max-width:360px), (max-height:720px){
          .tko-splash-stack{--tko-splash-scale:.86}
        }
        @media (min-width:900px) and (min-height:860px){
          .tko-splash-stack{--tko-splash-scale:1.05}
        }
      `}</style>

      <audio ref={revSound} src="/engine-rev.mp3" preload="auto" />

      <div className="tko-splash-shell">
        <div className="tko-splash-stack">
          <h1 className="sr-only">
            Team Karad Off-Roaders | India&apos;s Most Thrilling Offroading Event and Competition
          </h1>

          <motion.div
            className="tko-logo-ground"
            initial={{ opacity: 0, scale: 0.72, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 65, damping: 10, delay: 0.22 }}
          >
            <div className="tko-logo-side-glow left" />
            <div className="tko-logo-side-glow right" />
            <motion.div
              className="tko-logo-amber-glow"
              animate={{
                opacity: started ? 0.8 : 0.2,
                scale: started ? 1.06 : 0.72,
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              animate={{ opacity: [0.84, 1, 0.84], scale: [1.03, 1.09, 1.03] }}
              transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/welcome-logo-transparent.png"
                alt="Team Karad Off-Roaders welcome logo"
                width={272}
                height={272}
                priority
                className="tko-welcome-logo"
              />
            </motion.div>
          </motion.div>

          <p className="tko-splash-title font-heading text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-5xl md:text-7xl lg:text-8xl">
            <span className="text-primary">TEAM KARAD</span>{" "}
            <span className="text-white">OFFROADERS</span>
          </p>

          <motion.div
            className="tko-switch-row"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 65, damping: 10, delay: 0.22 }}
          >
            <button
              type="button"
              className="tko-ignition-hitbox"
              onClick={handleIgnitionPress}
              disabled={started}
              aria-label="Start ignition"
            >
              <div className="tko-ignition-panel">
                <span className="tko-ignition-panel-label">IGNITION SWITCH</span>
              </div>
              <div className="tko-ignition-button">
                <div className="tko-ring-outer" />
                <div className="tko-ring-inner" />
                <div className="tko-ring-core" />
                <div className="tko-accent-outer" />
                <div className="tko-accent-inner" />
                <div className="tko-dial-markers" aria-hidden="true">
                  <div className="tko-dial-mark off" />
                  <div className="tko-dial-mark acc" />
                  <div className="tko-dial-mark on" />
                  <div className="tko-dial-mark start" />
                  <span className="tko-dial-text off">OFF</span>
                  <span className="tko-dial-text acc">ACC</span>
                  <span className="tko-dial-text on">ON</span>
                  <span className="tko-dial-text start">START</span>
                </div>
                <motion.div
                  className="tko-key-center"
                  initial={false}
                  animate={{
                    rotate: started ? [214, 270, 324, 360] : 214,
                    scale: started ? [1, 1.02, 1.02] : 1,
                  }}
                  transition={{
                    rotate: { duration: 0.58, times: [0, 0.38, 0.72, 1] },
                    scale: { duration: 0.58 },
                  }}
                >
                  <div className="tko-key-shadow" />
                  <div className="tko-key-handle">
                    <div className="tko-key-handle-gloss" />
                  </div>
                  <div className="tko-key-hub" />
                </motion.div>
              </div>
            </button>
          </motion.div>

          <p className="tko-ignition-message">Fire the Ignition to get enlightened</p>
        </div>
      </div>
    </motion.div>
  );
}
