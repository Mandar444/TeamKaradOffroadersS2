"use client";

import { motion } from "framer-motion";
import { CATEGORIES } from "@/config/pricing";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap, Gauge, Trophy, Star, Shield, Car, Settings } from "lucide-react";

const icons = {
  EXTREME: Zap,
  DIESEL_MODIFIED: Gauge,
  PETROL_MODIFIED: Gauge,
  DIESEL_EXPERT: Trophy,
  PETROL_EXPERT: Star,
  THAR_SUV: Shield,
  JIMNY_SUV: Car,
  STOCK_NDMS: Settings,
};

const FallbackIcon = Settings;

export default function CarCategories() {
  return (
    <section className="py-24 px-4 bg-black/50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading text-white mb-4 tracking-tight">
            VEHICLE <span className="text-primary italic">CATEGORIES</span>
          </h2>
          <p className="text-zinc-500 text-sm md:text-base max-w-xl mx-auto mt-4 uppercase tracking-[0.2em] font-bold">
            THE ULTIMATE LINEUP OF OFFROADING CARS IN INDIA
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(CATEGORIES).map(([key, category], index) => {
            const Icon = icons[key] || FallbackIcon;
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="bg-zinc-900/50 border-zinc-800 h-full hover:border-primary/50 transition-colors group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-heading text-xl text-white group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-400 text-sm mb-6 h-12">
                      {category.description}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-heading text-white">
                        ₹{category.fee.toLocaleString()}
                      </span>
                      <span className="text-xs text-zinc-500 mr-2">/ ENTRY</span>
                      {category.lateFee > 0 && (
                        <span className="text-[10px] text-primary/60 font-black uppercase tracking-widest italic">
                          (Late Entry: ₹{category.lateFee.toLocaleString()})
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
