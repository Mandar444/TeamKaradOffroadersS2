"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MAX_CAR_NUMBER } from "@/config/pricing";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function NumberPicker({ category, selectedNumber, onSelect, takenNumbers = [] }) {
  const numbers = Array.from({ length: MAX_CAR_NUMBER }, (_, i) => (i + 1).toString());

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg text-center md:text-left flex-col md:flex-row gap-4">
        <div>
          <h3 className="text-white font-heading text-lg">Select Sticker Number</h3>
          <p className="text-zinc-500 text-sm italic">Allocated per category</p>
        </div>
        <div className="flex gap-4 text-[10px] uppercase font-bold tracking-widest flex-wrap justify-center">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-zinc-800 rounded" /> Available</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-950 border border-red-900 rounded" /> Taken</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-600 rounded" /> Selected</div>
        </div>
      </div>

      <ScrollArea className="h-[600px] md:h-[700px] rounded-2xl border border-zinc-800 bg-black/40 p-6 shadow-inner relative overflow-y-auto custom-scrollbar">

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {numbers.map((num) => {
            const isTaken = takenNumbers.some(tn => Number(tn) === Number(num));
            const isSelected = Number(selectedNumber) === Number(num);

            return (
              <button
                key={num}
                type="button"
                disabled={isTaken}
                onClick={() => onSelect(num)}
                className={cn(
                  "h-12 flex items-center justify-center font-heading text-lg border transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  isSelected 
                    ? "bg-red-600 text-white border-red-400 scale-110 z-10 shadow-[0_0_20px_rgba(220,38,38,0.5)] font-black" 
                    : isTaken
                      ? "bg-red-950/40 text-red-900 border-red-900/50 cursor-not-allowed opacity-100 font-bold"
                      : "bg-zinc-900/30 text-zinc-500 border-zinc-800 hover:border-zinc-500 hover:text-white"
                )}
              >
                {num}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
