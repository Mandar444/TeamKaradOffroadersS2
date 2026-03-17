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
      <div className="flex justify-between items-center bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
        <div>
          <h3 className="text-white font-heading text-lg">Select Sticker Number</h3>
          <p className="text-zinc-500 text-sm italic">Allocated per category</p>
        </div>
        <div className="flex gap-4 text-[10px] uppercase font-bold tracking-widest">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-zinc-800 rounded" /> Available</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-900 rounded" /> Taken</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-primary rounded" /> Selected</div>
        </div>
      </div>

      <ScrollArea className="h-[400px] rounded-md border border-zinc-800 bg-black/40 p-4">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {numbers.map((num) => {
            const isTaken = takenNumbers.includes(num);
            const isSelected = selectedNumber === num;

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
                    ? "bg-primary text-black border-primary neon-glow z-10 scale-110" 
                    : isTaken
                      ? "bg-red-950/20 text-red-900 border-red-900/30 cursor-not-allowed grayscale"
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
