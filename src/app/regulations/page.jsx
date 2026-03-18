"use client";

import { motion } from "framer-motion";
import { Shield, AlertCircle, CheckCircle2, Info, ChevronRight, Gauge, Settings, ShieldAlert, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const sections = [
  {
    id: "mandatory",
    title: "MANDATORY & RECOMMENDED",
    icon: ShieldAlert,
    content: {
      mandatory: [
        { item: "Helmets", specs: "ISI / FIA / FIM Standard Crash Helmets for both driver and co-driver" },
        { item: "Name Stickers", specs: "Name and Blood Group Stickers on both drivers and co-drivers' helmet and on vehicle - below windshield OR on fenders" },
        { item: "First Aid Kit", specs: "Comprehensive First Aid Kit" },
        { item: "Spare Wheel", specs: "Appropriately sized spare wheel" },
        { item: "Recovery Points", specs: "OEM recovery points / Bright colored front & rear recovery points" },
        { item: "Lights & Electricals", specs: "Working lights, indicators, wipers, and horn" },
        { item: "Recovery Strap", specs: "Minimum 5-Metre-Long Recovery Strap (Recommend Minimum 4000 Kg Rated)" },
        { item: "Shackles", specs: "2 x D Shackles (Recommended Rated at 3250 Kg or more)" },
        { item: "Gloves", specs: "Appropriate Driving Gloves" },
      ],
      recommended: [
        { item: "Fire Extinguishers", specs: "One valid 1.8kg or two 0.9kg operable ABC type fire extinguishers mounted within easy reach of the driver and co-driver" },
        { item: "Glasses", specs: "Eye protection glasses" },
        { item: "Toolkit", specs: "Appropriate comprehensive tool kit and vital spares" },
        { item: "Wireless Comms", specs: "Wireless intercoms only for communication between Driver and Co-Driver" },
        { item: "Aux Lights", specs: "Auxiliary lights / LED bars (Otherwise covered when not on track)" },
        { item: "Puncture repair kit", specs: "Puncture repair kit with Air Compressor" },
        { item: "Battery Isolation Switch", specs: "Mechanical Battery Isolation Switch" },
      ]
    }
  },
  {
    id: "expert-extreme",
    title: "EXPERT / MODIFIED / EXTREME",
    icon: Zap,
    categories: ["Diesel Expert", "Petrol Expert", "Diesel Modified", "Petrol Modified", "Extreme"],
    specs: [
      { label: "Engine", expertD: "Up to DI Turbo, M2DI, MDI TC Variants (SZ/CRDe Engine Not Allowed.)", expertP: "Up to 1.3L Stock Engines (Turbo Upgrade Not Allowed)", modifiedD: "Diesel Engines Up to 3L. Turbo & Other Performance Upgrades Allowed.", modifiedP: "Petrol Engines Up to 2.5L. Turbo & Other Performance Upgrades Allowed.", extreme: "Up to 4L Allowed" },
      { label: "Tyre Size", expertD: "Max 32\" properly inflated", expertP: "Max 32\" properly inflated", modifiedD: "Max 34\" properly inflated", modifiedP: "Max 34\" properly inflated", extreme: "Max 38\"" },
      { label: "Roll Cage", expertD: "Min Four Point Mandatory", expertP: "Min Four Point Mandatory", modifiedD: "Min Six Point Mandatory", modifiedP: "Min Six Point Mandatory", extreme: "Min Six Point Mandatory" },
      { label: "Differentials", expertD: "Open/Closed Knuckle for SWB 81\", LWB 91\"+", expertP: "OEM Gypsy / OEM Differentials", modifiedD: "Non-OEM Swap Allowed (No Portals)", modifiedP: "Non-OEM Swap Allowed (No Portals)", extreme: "Swap Allowed / Portals Allowed" }
    ]
  },
  {
    id: "stock-ndms",
    title: "STOCK NDMS CLASS",
    icon: Gauge,
    categories: ["Diesel Stock", "Petrol Stock"],
    specs: [
      { label: "Engine", diesel: "OEM Engines, Up to DI Turbo, M2DI TC (SZ/CRDe, M2DI Not Allowed)", petrol: "Up to 1.3L Stock Engines (No Turbo Upgrade)" },
      { label: "Performance Upgrades", diesel: "Not Allowed", petrol: "Not Allowed" },
      { label: "Tyre Size", diesel: "Only NDMS 6.00.16", petrol: "Only 78.15" },
      { label: "Suspension", diesel: "OEM Stock Only", petrol: "OEM Stock Only" }
    ]
  },
  {
    id: "suv-class",
    title: "SUV CLASS (THAR/JIMNY)",
    icon: Settings,
    categories: ["SUV Stock (Thar/Jimny)", "SUV Modified (Thar/Jimny)"],
    specs: [
      { label: "Engine", stock: "OEM ONLY", modified: "OEM ONLY (ECU/ECM Tuning Allowed)" },
      { label: "Tyre Size", stock: "OEM size - AT Tyres Allowed", modified: "35\" MT Tyres Allowed" },
      { label: "Lift", stock: "MAX 1\" over OEM specs allowed", modified: "Allowed" },
      { label: "Doors", stock: "OEM DOORS MANDATORY", modified: "OEM DOORS MANDATORY" }
    ]
  }
];

export default function RegulationsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-32 pb-16 md:pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-[50vh] bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />

      <section className="px-6 py-12 md:py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] mb-4">Official Protocol</p>
            <h1 className="text-6xl md:text-8xl font-heading tracking-tighter uppercase leading-none mb-8">
              TECHNICAL <span className="text-primary italic">REGULATIONS</span>
            </h1>
            <p className="text-zinc-400 text-xl max-w-3xl leading-relaxed font-medium">
              Comprehensive technical specifications, categorization rules, and mandatory safety requirements for Season 2 - 2026.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="mandatory" className="space-y-12">
            <div className="flex justify-start md:justify-center overflow-x-auto pb-4 no-scrollbar">
              <TabsList className="bg-zinc-900/50 border border-white/5 p-1 h-auto md:flex-wrap justify-start md:justify-center">
                {sections.map(section => (
                  <TabsTrigger 
                    key={section.id} 
                    value={section.id}
                    className="data-[state=active]:bg-primary data-[state=active]:text-black px-6 py-3 rounded-xl font-heading text-xs md:text-sm uppercase tracking-widest transition-all"
                  >
                    <section.icon className="w-4 h-4 mr-2 hidden md:block" />
                    {section.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* MANDATORY CONTENT */}
            <TabsContent value="mandatory">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <ShieldAlert className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-heading text-white uppercase italic">Mandatory</h3>
                      <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Strict compliance required</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {sections[0].content.mandatory.map((item, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i} 
                        className="p-5 bg-zinc-900/30 border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-red-500/30 transition-all shadow-lg"
                      >
                        <span className="text-white font-heading text-sm md:text-base uppercase tracking-tight md:w-48 shrink-0 group-hover:text-red-500 transition-colors">{item.item}</span>
                        <span className="text-zinc-400 text-xs md:text-sm leading-relaxed">{item.specs}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-heading text-white uppercase italic">Recommended</h3>
                      <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Highly advised for safety</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {sections[0].content.recommended.map((item, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i} 
                        className="p-5 bg-zinc-900/30 border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-primary/30 transition-all shadow-lg"
                      >
                        <span className="text-white font-heading text-sm md:text-base uppercase tracking-tight md:w-48 shrink-0 group-hover:text-primary transition-colors">{item.item}</span>
                        <span className="text-zinc-400 text-xs md:text-sm leading-relaxed">{item.specs}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* EXPERT/MODIFIED CONTENT */}
            <TabsContent value="expert-extreme">
              <div className="overflow-x-auto rounded-3xl border border-white/5 shadow-2xl">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-primary text-black">
                      <th className="p-6 font-heading text-sm uppercase tracking-[0.2em] border-r border-black/10">DESCRIPTION</th>
                      <th className="p-6 font-heading text-sm uppercase tracking-[0.2em] border-r border-black/10">DIESEL EXPERT</th>
                      <th className="p-6 font-heading text-sm uppercase tracking-[0.2em] border-r border-black/10">PETROL EXPERT</th>
                      <th className="p-6 font-heading text-sm uppercase tracking-[0.2em] border-r border-black/10">DIESEL MODIFIED</th>
                      <th className="p-6 font-heading text-sm uppercase tracking-[0.2em] border-r border-black/10">PETROL MODIFIED</th>
                      <th className="p-6 font-heading text-sm uppercase tracking-[0.2em]">EXTREME</th>
                    </tr>
                  </thead>
                  <tbody className="bg-zinc-950/40 backdrop-blur-3xl">
                    {sections[1].specs.map((spec, i) => (
                      <tr key={i} className="border-b border-white/5 group hover:bg-white/5 transition-colors">
                        <td className="p-6 font-heading text-primary uppercase text-xs tracking-widest border-r border-white/5 bg-zinc-900/40">{spec.label}</td>
                        <td className="p-6 text-zinc-400 text-xs leading-relaxed border-r border-white/5">{spec.expertD}</td>
                        <td className="p-6 text-zinc-400 text-xs leading-relaxed border-r border-white/5">{spec.expertP}</td>
                        <td className="p-6 text-zinc-400 text-xs leading-relaxed border-r border-white/5 font-medium">{spec.modifiedD}</td>
                        <td className="p-6 text-zinc-400 text-xs leading-relaxed border-r border-white/5 font-medium">{spec.modifiedP}</td>
                        <td className="p-6 text-zinc-200 text-xs leading-relaxed font-black uppercase italic tracking-tighter">{spec.extreme}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* STOCK NDMS CONTENT */}
            <TabsContent value="stock-ndms">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-zinc-900/40 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform">
                       <Gauge className="w-56 h-56 text-white" />
                    </div>
                    <h3 className="text-3xl font-heading text-white uppercase italic mb-8 flex items-center gap-4">
                       DIESEL <span className="text-zinc-500">STOCK</span>
                    </h3>
                    <div className="space-y-6 relative z-10">
                       {sections[2].specs.map((s, i) => (
                         <div key={i} className="flex flex-col gap-2">
                           <p className="text-primary text-[10px] font-black uppercase tracking-widest opacity-60">{s.label}</p>
                           <p className="text-zinc-300 font-medium leading-relaxed">{s.diesel}</p>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="bg-zinc-900/40 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform">
                       <Gauge className="w-56 h-56 text-white" />
                    </div>
                    <h3 className="text-3xl font-heading text-white uppercase italic mb-8 flex items-center gap-4">
                       PETROL <span className="text-zinc-500">STOCK</span>
                    </h3>
                    <div className="space-y-6 relative z-10">
                       {sections[2].specs.map((s, i) => (
                         <div key={i} className="flex flex-col gap-2">
                           <p className="text-primary text-[10px] font-black uppercase tracking-widest opacity-60">{s.label}</p>
                           <p className="text-zinc-300 font-medium leading-relaxed">{s.petrol}</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </TabsContent>

            {/* SUV CONTENT */}
            <TabsContent value="suv-class">
               <div className="overflow-x-auto rounded-3xl border border-white/5 shadow-2xl">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-primary text-black">
                      <th className="p-6 font-heading text-sm uppercase tracking-[0.2em] border-r border-black/10">DESCRIPTION</th>
                      <th className="p-6 font-heading text-sm uppercase tracking-[0.2em] border-r border-black/10">SUV STOCK (THAR/JIMNY)</th>
                      <th className="p-6 font-heading text-sm uppercase tracking-[0.2em]">SUV MODIFIED (THAR/JIMNY)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-zinc-950/40 backdrop-blur-3xl">
                    {sections[3].specs.map((spec, i) => (
                      <tr key={i} className="border-b border-white/5 group hover:bg-white/5 transition-colors">
                        <td className="p-6 font-heading text-primary uppercase text-xs tracking-widest border-r border-white/5 bg-zinc-900/40">{spec.label}</td>
                        <td className="p-6 text-zinc-400 text-xs leading-relaxed border-r border-white/5">{spec.stock}</td>
                        <td className="p-6 text-zinc-200 text-xs leading-relaxed font-bold tracking-tight">{spec.modified}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

          </Tabs>

          <div className="mt-20 p-8 bg-black border border-white/5 rounded-3xl text-center italic text-zinc-600 text-sm">
             The organizers may merge split a category based on the number of entries received in a particular class to ensure a fair, competitive and rational grouping. Participants will be notified in advance of such changes before the event.
          </div>
        </div>
      </section>
    </div>
  );
}
