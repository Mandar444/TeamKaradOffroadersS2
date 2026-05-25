"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import { motion } from "framer-motion";
import { Tent, Wrench, Zap } from "lucide-react";
import Link from "next/link";
import RegistrationCountdown from "@/components/RegistrationCountdown";
import { useRegistrationDeadline } from "@/lib/use-registration-deadline";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const { isRegistrationOpen, remainingMs } = useRegistrationDeadline();
  const isAdminPage = pathname?.startsWith("/admin");
  const isVerifyPage = pathname?.startsWith("/verify");
  const isLeaderboardDetailsPage = pathname?.startsWith("/leaderboard/details");
  const isRegistrationFlow =
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/payment") ||
    pathname?.startsWith("/registration-review") ||
    pathname?.startsWith("/success") ||
    pathname?.startsWith("/form-submitted");
  const isHotelSupportPage = pathname?.startsWith("/hotel-support");
  const isMechanicSupportPage = pathname?.startsWith("/mechanic-support");
  const hideLayout = isAdminPage || isVerifyPage || isLeaderboardDetailsPage;

  if (isLeaderboardDetailsPage) {
    return children;
  }

  return (
    <SmoothScroll>
      {!hideLayout && <Navbar />}
      {children}
      
      {/* Global Floating Register CTA */}
      {!hideLayout && !isRegistrationFlow && (
        <div className="tko-floating-ctas">
          {isRegistrationOpen && (
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8">
              <RegistrationCountdown remainingMs={remainingMs} />
              <motion.div
                initial={{ scale: 0, opacity: 0, x: 50 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2 bg-[#ff8a00] text-black px-4 py-3 sm:px-5 sm:py-4 rounded-full font-black uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[10px] sm:text-xs md:text-sm shadow-[0_10px_40px_rgba(255,138,0,0.35)] hover:bg-[#ff9a1a] hover:shadow-[0_15px_50px_rgba(255,138,0,0.55)] transition-all max-w-[calc(100vw-2rem)] sm:max-w-none"
                >
                  <span>REGISTER NOW</span>
                  <Zap className="w-5 h-5 fill-black text-black" />
                </Link>
              </motion.div>
            </div>
          )}

          <div className="fixed bottom-20 left-4 z-[100] flex w-fit max-w-[calc(100vw-7rem)] flex-col gap-2 sm:bottom-24 sm:left-6 sm:max-w-[min(22rem,calc(100vw-9rem))] sm:gap-3 lg:bottom-28">
            {!isHotelSupportPage && (
              <motion.div
                initial={{ scale: 0, opacity: 0, x: -50 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group w-fit"
              >
                <Link
                  href="/hotel-support"
                  aria-label="Hotel Support"
                  title="Hotel Support"
                  className="group/link flex h-12 w-12 min-w-12 items-center justify-start overflow-hidden rounded-full bg-[#ff8a00] text-black px-3 font-black uppercase tracking-[0.2em] text-[9px] shadow-[0_10px_40px_rgba(255,138,0,0.35)] transition-all duration-300 hover:w-[12.5rem] hover:bg-[#ff9a1a] hover:shadow-[0_15px_50px_rgba(255,138,0,0.55)] focus-visible:w-[12.5rem] focus-visible:bg-[#ff9a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8a00]/60 sm:h-14 sm:w-14 sm:min-w-14 sm:px-4 sm:text-[10px] sm:tracking-[0.28em] sm:hover:w-[14rem] sm:focus-visible:w-[14rem] md:text-xs"
                >
                  <Tent className="w-5 h-5 text-black shrink-0" />
                  <span className="ml-0 max-w-0 translate-x-2 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover/link:ml-2 group-hover/link:max-w-[10rem] group-hover/link:translate-x-0 group-hover/link:opacity-100 group-focus-visible/link:ml-2 group-focus-visible/link:max-w-[10rem] group-focus-visible/link:translate-x-0 group-focus-visible/link:opacity-100">
                    Hotel Support
                  </span>
                </Link>
              </motion.div>
            )}

            {!isMechanicSupportPage && (
              <motion.div
                initial={{ scale: 0, opacity: 0, x: -50 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group w-fit"
              >
                <Link
                  href="/mechanic-support"
                  aria-label="Mechanical Support"
                  title="Mechanical Support"
                  className="group/link flex h-12 w-12 min-w-12 items-center justify-start overflow-hidden rounded-full bg-[#ff8a00] text-black px-3 font-black uppercase tracking-[0.2em] text-[9px] shadow-[0_10px_40px_rgba(255,138,0,0.35)] transition-all duration-300 hover:w-[15rem] hover:bg-[#ff9a1a] hover:shadow-[0_15px_50px_rgba(255,138,0,0.55)] focus-visible:w-[15rem] focus-visible:bg-[#ff9a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8a00]/60 sm:h-14 sm:w-14 sm:min-w-14 sm:px-4 sm:text-[10px] sm:tracking-[0.28em] sm:hover:w-[17rem] sm:focus-visible:w-[17rem] md:text-xs"
                >
                  <Wrench className="w-5 h-5 text-black shrink-0" />
                  <span className="ml-0 max-w-0 translate-x-2 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover/link:ml-2 group-hover/link:max-w-[13rem] group-hover/link:translate-x-0 group-hover/link:opacity-100 group-focus-visible/link:ml-2 group-focus-visible/link:max-w-[13rem] group-focus-visible/link:translate-x-0 group-focus-visible/link:opacity-100">
                    Mechanical Support
                  </span>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </SmoothScroll>
  );
}
