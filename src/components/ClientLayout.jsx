"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const isVerifyPage = pathname?.startsWith("/verify");
  const hideLayout = isAdminPage || isVerifyPage;

  return (
    <SmoothScroll>
      {!hideLayout && <Navbar />}
      {children}
      
      {/* Global Floating Register CTA */}
      {!hideLayout && (
        <motion.div
          initial={{ scale: 0, opacity: 0, x: 50 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 z-[100] group"
        >
          <Link
             href="/register"
             className="flex items-center gap-3 bg-primary text-black px-6 py-4 rounded-full font-black uppercase tracking-widest text-xs md:text-sm shadow-[0_10px_40px_rgba(255,165,0,0.4)] hover:shadow-[0_15px_50px_rgba(255,165,0,0.6)] transition-all"
          >
             <span>REGISTER NOW</span>
             <Zap className="w-5 h-5 fill-black" />
          </Link>
        </motion.div>
      )}
    </SmoothScroll>
  );
}
