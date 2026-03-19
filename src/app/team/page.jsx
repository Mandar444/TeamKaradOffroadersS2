"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Users, Trophy, Instagram, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const TEAM_MEMBERS = [
  {
    name: "Sangram Kadam",
    role: "CORE ORGANIZER",
    image: "/images/team/sangram_kadam_1.png",
  },
  {
    name: "Kiran Mali",
    role: "CORE ORGANIZER / CHAMPION",
    image: "/images/team/kiran_mali_1.png",
  },
  {
    name: "Ganesh Velhal",
    role: "OFF-ROAD ARCHITECT",
    image: "/images/team/ganesh_velhal_1.png",
  },
  {
    name: "Hanmant Mali",
    role: "EVENT MARSHAL",
    image: "/images/team/hanmant_mali_1.png",
  },
  {
    name: "Advya Nikam",
    role: "TECH ARCHITECT",
    image: "/images/team/advya_nikam_1.png",
  },
  {
    name: "Ajay Bisure",
    role: "EVENT MARSHAL",
    image: "/images/team/ajay_bisure_1.png",
  },
  {
    name: "Pranav Kadam",
    role: "OFF-ROAD ARCHITECT",
    image: "/images/team/pranav_kadam_1.png",
  },
  {
    name: "Parag Patil",
    role: "OFF-ROAD ARCHITECT",
    image: "/images/team/parag_patil_1.png",
  },
  {
    name: "Mandar Shinde",
    role: "EVENT MARSHAL",
    image: "/images/team/mandar_shinde_1.png",
  },
  {
    name: "Aniruddha Bhosle",
    role: "OFF-ROAD ARCHITECT",
    image: "/images/team/aniruddha_bhosle_1.png",
  },
  {
    name: "Aditya Dubal",
    role: "OFF-ROAD ARCHITECT",
    image: "/images/team/aditya_dubal_1.png",
  },
  {
    name: "Shrish Dubal",
    role: "EVENT MARSHAL",
    image: "/images/team/shrish_dubal_1.png",
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Cinematic Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-[50%] h-[50vh] bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-zinc-900/50 border border-white/10 backdrop-blur-md mb-8">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Official Crew Manifest</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-heading text-white tracking-tighter uppercase mb-6">
            OUR <span className="text-primary italic">TEAM</span>
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium italic">
            Meet the architects and marshals behind the Season 2 championship.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEAM_MEMBERS.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-white/5 bg-zinc-900/50 mb-4 flex items-center justify-center">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                
                {/* Tactical Overlay */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black">
                      <Zap className="w-5 h-5 fill-current" />
                   </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-heading text-white uppercase group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
          
          {/* More coming soon hint */}
          <div className="aspect-[3/4] rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center bg-zinc-900/10">
             <Users className="w-10 h-10 text-zinc-800 mb-4" />
             <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">More Operational Crew Photo Updates Coming Soon</p>
          </div>
        </div>

        {/* Tactical Accents */}
        <div className="mt-32 pt-16 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-12 opacity-40">
           <div className="flex gap-4">
              <Shield className="w-8 h-8 text-primary shrink-0" />
              <div className="space-y-1">
                 <p className="font-heading text-sm text-white uppercase tracking-widest">Marshals</p>
                 <p className="text-[10px] font-medium text-zinc-500 uppercase">Season 2 Track Safety Oversight</p>
              </div>
           </div>
           <div className="flex gap-4 border-l border-white/5 pl-8 md:pl-16">
              <Users className="w-8 h-8 text-primary shrink-0" />
              <div className="space-y-1">
                 <p className="font-heading text-sm text-white uppercase tracking-widest">Organizers</p>
                 <p className="text-[10px] font-medium text-zinc-500 uppercase">Mission Logistics & Operations</p>
              </div>
           </div>
           <div className="flex gap-4 border-l border-white/5 pl-8 md:pl-16">
              <Zap className="w-8 h-8 text-primary shrink-0" />
              <div className="space-y-1">
                 <p className="font-heading text-sm text-white uppercase tracking-widest">Technical</p>
                 <p className="text-[10px] font-medium text-zinc-500 uppercase">Scrutiny & Performance Analytics</p>
              </div>
           </div>
        </div>
      </div>

      {/* Aesthetic Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
         <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
         <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>
    </div>
  );
}
