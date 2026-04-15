"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Crown, ShieldCheck, Zap, Handshake, Globe, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SPONSOR_TIERS = [
  {
    id: "diamond",
    name: "Diamond Sovereigns",
    icon: <Crown className="w-8 h-8 text-amber-400" />,
    description: "The primary architects of our Season 2 legacy.",
    sponsors: [
      {
        name: "Elite Motors",
        logo: "/images/sponsors/diamond-1.png",
        industry: "Luxury Automotive",
        website: "#",
        tagline: "Precision. Power. Prestige."
      }
    ]
  },
  {
    id: "gold",
    name: "Gold Vanguard",
    icon: <Trophy className="w-6 h-6 text-yellow-500" />,
    description: "Exceptional partners driving our technical core.",
    sponsors: [
      {
        name: "Bronze Trail Gear",
        logo: "/images/sponsors/gold-1.png",
        industry: "Off-Road Equipment",
        website: "#",
        tagline: "Tame the Wild."
      },
      {
        name: "Summit Lubricants",
        logo: "https://www.transparenttextures.com/patterns/carbon-fibre.png", // Fallback pattern logo
        industry: "Performance Fluids",
        website: "#",
        tagline: "Beyond Friction."
      }
    ]
  },
  {
    id: "silver",
    name: "Official Partners",
    icon: <ShieldCheck className="w-5 h-5 text-zinc-400" />,
    description: "Supporting the backbone of TKO Season 2.",
    sponsors: [
      { name: "Velocity Comms", logo: "", industry: "Connectivity" },
      { name: "Hydra Energy", logo: "", industry: "Beverages" },
      { name: "Grid Safety", logo: "", industry: "Medical Care" },
      { name: "Trail Vision", logo: "", industry: "Media" }
    ]
  }
];

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-[100vh] bg-mesh-amber opacity-10 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-zinc-900 border border-white/10 text-[10px] font-black uppercase tracking-[0.5em] mb-8"
          >
            <Handshake className="w-4 h-4 text-primary" /> Patrons of the Kingdom
          </motion.div>
          
          <h1 className="text-6xl md:text-[9rem] font-heading text-white tracking-tighter uppercase leading-none mb-8">
            ROYAL <span className="text-primary italic text-glow-amber">PARTNERS</span>
          </h1>
          <p className="text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto font-sans leading-relaxed">
            The power behind the throne. Meet the exceptional organizations fueling the most prestigious off-road event in the region.
          </p>
        </div>

        {/* Tier Sections */}
        <div className="space-y-32">
          {SPONSOR_TIERS.map((tier, tierIdx) => (
            <section key={tier.id} className="relative">
              <div className="flex items-center gap-6 mb-12">
                 <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center shadow-2xl">
                    {tier.icon}
                 </div>
                 <div>
                    <h2 className="text-3xl md:text-4xl font-heading text-white uppercase italic">{tier.name}</h2>
                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">{tier.description}</p>
                 </div>
                 <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-6 hidden md:block" />
              </div>

              <div className={`grid gap-8 ${
                 tier.id === 'diamond' ? 'grid-cols-1' : 
                 tier.id === 'gold' ? 'grid-cols-1 md:grid-cols-2' : 
                 'grid-cols-2 md:grid-cols-4'
              }`}>
                {tier.sponsors.map((sponsor, sIdx) => (
                  <motion.div
                    key={sponsor.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: sIdx * 0.1 }}
                    className={`group relative rounded-[2.5rem] bg-zinc-900/40 border border-white/5 backdrop-blur-3xl overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-[0_20px_80px_rgba(255,165,0,0.1)] p-8 ${
                      tier.id === 'diamond' ? 'md:p-16' : ''
                    }`}
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    
                    <div className={`flex items-center gap-10 ${tier.id === 'diamond' ? 'flex-col md:flex-row' : 'flex-col'}`}>
                       <div className={`relative bg-black rounded-[2rem] border border-white/5 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-700 ${
                         tier.id === 'diamond' ? 'w-48 h-48 md:w-64 md:h-64' : 'w-40 h-40'
                       }`}>
                          {sponsor.logo ? (
                            <Image 
                              src={sponsor.logo} 
                              alt={sponsor.name} 
                              fill 
                              className="object-contain p-8 md:p-12 transition-all group-hover:filter group-hover:brightness-125" 
                            />
                          ) : (
                            <div className="text-center p-6">
                               <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Brand Mark</p>
                               <Star className="w-8 h-8 text-zinc-900 mt-2 mx-auto" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                       </div>

                       <div className={`flex-1 text-center ${tier.id === 'diamond' ? 'md:text-left' : 'md:text-center'}`}>
                          <div className="flex flex-col gap-2 mb-6">
                             <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] leading-none mb-1">{sponsor.industry}</p>
                             <h3 className={`font-heading text-white uppercase italic leading-none ${
                               tier.id === 'diamond' ? 'text-4xl md:text-7xl' : 'text-3xl'
                             }`}>
                                {sponsor.name}
                             </h3>
                          </div>
                          {sponsor.tagline && (
                            <p className="text-zinc-500 italic text-sm md:text-lg mb-8 max-w-md font-sans">
                               "{sponsor.tagline}"
                            </p>
                          )}
                          {sponsor.website && (
                            <Link 
                              href={sponsor.website} 
                              className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors py-3 px-6 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary transition-all"
                            >
                               Explore Brand <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-48 relative rounded-[3rem] overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent border border-white/5 rounded-[3rem]" />
          <div className="relative z-10 p-12 md:p-24 text-center">
             <div className="w-20 h-20 bg-primary rounded-3xl mx-auto mb-10 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-500 shadow-[0_0_30px_rgba(255,165,0,0.4)]">
                <Zap className="w-10 h-10 text-black" />
             </div>
             <h2 className="text-4xl md:text-7xl font-heading text-white uppercase italic mb-6">
                WANT TO JOIN THE <span className="text-primary">CIRCUIT?</span>
             </h2>
             <p className="text-zinc-500 text-sm md:text-xl max-w-xl mx-auto mb-12 font-sans">
                Elevate your brand alongside the legends. Exclusive partnership opportunities for TKO Season 2 are now open.
             </p>
             <Link 
                href="/contact" 
                className="inline-flex h-16 md:h-20 px-12 md:px-20 items-center justify-center bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] md:text-sm rounded-2xl hover:bg-primary hover:scale-105 transition-all shadow-2xl"
             >
                Request Prospectus
             </Link>
          </div>
        </motion.div>

        {/* Footer Motif */}
        <div className="mt-32 pt-16 border-t border-white/5 flex flex-wrap items-center justify-between gap-10 opacity-30">
           <div className="flex items-center gap-8">
              <div>
                 <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1 leading-none">Authentication</p>
                 <p className="text-[10px] font-mono text-zinc-500">TKO_PARTNERSHIP_GRID_v2</p>
              </div>
              <div>
                 <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1 leading-none">Status</p>
                 <p className="text-[10px] font-mono text-emerald-500">OPTIMIZED_UPLINK</p>
              </div>
           </div>
           <Handshake className="w-6 h-6 text-zinc-800" />
        </div>
      </div>
    </div>
  );
}
