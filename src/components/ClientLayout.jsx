"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const isVerifyPage = pathname?.startsWith("/verify");
  const hideLayout = isAdminPage || isVerifyPage;

  return (
    <SmoothScroll>
      {!hideLayout && <Navbar />}
      {children}
      
      {/* Global Floating Socials */}
      {!hideLayout && (
        <motion.a
          href="https://www.instagram.com/teamkaradoffroaders/"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(220,39,67,0.4)] md:w-16 md:h-16"
        >
          <Instagram className="w-7 h-7 md:w-8 md:h-8" />
        </motion.a>
      )}
    </SmoothScroll>
  );
}
