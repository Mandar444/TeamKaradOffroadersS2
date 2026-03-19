"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, Instagram } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/about", label: "About Us" },
  { href: "/regulations", label: "Regulations" },
  { href: "/beasts", label: "Our Beasts" },
  { href: "/gallery", label: "Gallery" },
  { href: "/team", label: "Our Team" },
  { href: "/teams", label: "Participants" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMobileOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-500 ${
          scrolled
            ? "bg-black/90 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-10 flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group shrink-0 min-w-max">
            <img
              src="/logo.png"
              alt="TKO"
              className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-lg group-hover:scale-110 transition-transform"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="flex flex-col min-w-max">
              <span className="text-white font-heading text-base md:text-xl leading-none tracking-widest uppercase whitespace-nowrap block">
                Team Karad
              </span>
              <span className="text-primary text-[8px] md:text-[10px] font-black tracking-[0.3em] uppercase leading-none mt-1 whitespace-nowrap block">
                Off-Roaders Motorsports
              </span>
            </div>
          </Link>

          {/* Desktop Links (Visible only on XL+ screens) */}
          <div className="hidden xl:flex items-center gap-0.5 shrink-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap min-w-max ${
                  isActive(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://www.instagram.com/teamkaradoffroaders/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 ml-1 text-zinc-500 hover:text-white transition-colors shrink-0"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <Link
              href="/register"
              className="ml-2 px-5 py-2.5 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,165,0,0.2)] whitespace-nowrap shrink-0 flex items-center justify-center border-none"
            >
              REGISTER NOW
            </Link>
          </div>

          {/* Mobile Toggle (Visible on all screens below LG) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[89] bg-black/98 backdrop-blur-2xl pt-24 px-6 pb-10 overflow-y-auto xl:hidden"
          >
            <div className="space-y-2">
              {NAV_LINKS.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                      isActive(link.href)
                        ? "bg-primary/10 border border-primary/20 text-primary"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="text-sm font-black uppercase tracking-widest">
                      {link.label}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-30" />
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.05 }}
                className="pt-6 space-y-4"
              >
                <Link
                  href="/register"
                  className="flex h-16 w-full items-center justify-center bg-primary text-black font-black uppercase tracking-widest rounded-2xl shadow-[0_0_50px_rgba(255,165,0,0.4)] transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm border-none"
                >
                  <span className="whitespace-nowrap uppercase">REGISTER NOW</span>
                </Link>
                <a
                  href="https://www.instagram.com/teamkaradoffroaders/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 h-14 bg-zinc-900 border border-white/5 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-2xl"
                >
                  <Instagram className="w-4 h-4 text-pink-500" />
                  Follow our 5k Community
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
