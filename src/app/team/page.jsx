"use client";

import { motion } from "framer-motion";
import { Instagram, Linkedin, Mail, Phone, Shield, Star, Award, Users } from "lucide-react";

const teamMembers = [
  {
    name: "Mandar Karad",
    role: "Founder & Chief Organizer",
    title: "THE VISIONARY",
    bio: "The man behind the mission. With a decade of off-roading experience, Mandar founded Team Karad Off-Roaders to bring world-class motorsport events to Western Maharashtra.",
    socials: { instagram: "#", email: "mandar@teamkaradoffroaders.online" },
    badge: "Founder",
  },
  {
    name: "Akshay Patil",
    role: "Technical Director",
    title: "THE ENGINEER",
    bio: "Responsible for all vehicle inspections, safety protocols, and track design. Akshay ensures every course is both challenging and safe.",
    socials: { instagram: "#", email: "akshay@tko.com" },
    badge: "Core Team",
  },
  {
    name: "Rohan Deshmukh",
    role: "Operations Head",
    title: "THE COMMANDER",
    bio: "Logistics mastermind who coordinates everything from venue setup to participant management. Nothing runs without Rohan's seal of approval.",
    socials: { instagram: "#", email: "rohan@tko.com" },
    badge: "Core Team",
  },
  {
    name: "Priya Sharma",
    role: "Marketing & PR",
    title: "THE VOICE",
    bio: "Handles all social media, sponsorships, and media relations. Priya has been instrumental in making TKO a nationally recognized brand.",
    socials: { instagram: "#", email: "priya@tko.com" },
    badge: "Core Team",
  },
  {
    name: "Vikram Jadhav",
    role: "Chief Marshal",
    title: "THE GUARDIAN",
    bio: "Head of safety and marshalling operations. Vikram's team ensures every participant competes within the rules and returns home safe.",
    socials: { instagram: "#", email: "vikram@tko.com" },
    badge: "Safety",
  },
  {
    name: "Sneha Kulkarni",
    role: "Registration & Support",
    title: "THE ANCHOR",
    bio: "First point of contact for all participants. Sneha handles registrations, queries, and ensures every competitor has a seamless experience.",
    socials: { instagram: "#", email: "sneha@tko.com" },
    badge: "Support",
  },
];

const roleIcons = {
  Founder: Star,
  "Core Team": Award,
  Safety: Shield,
  Support: Users,
};

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-28 pb-16 md:pb-20">
      <section className="px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] mb-4">The People Behind the Mission</p>
            <h1 className="text-[12vw] md:text-8xl font-heading tracking-tighter uppercase leading-none mb-8">
              OUR <span className="text-primary italic">CREW</span>
            </h1>
            <p className="text-zinc-400 text-xl max-w-2xl leading-relaxed">
              Every great event is powered by passionate people. Meet the team that makes Team Karad Off-Roaders 
              the most thrilling off-road championship in India.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, idx) => {
            const BadgeIcon = roleIcons[member.badge] || Users;
            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-zinc-950 border border-white/5 rounded-[2rem] overflow-hidden hover:border-primary/20 transition-all group"
              >
                {/* Avatar placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary/10 via-zinc-900 to-zinc-950 flex items-center justify-center relative">
                  <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-white/10 flex items-center justify-center text-4xl font-heading font-black text-primary group-hover:border-primary/40 transition-colors">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg border border-white/5">
                    <BadgeIcon className="w-3 h-3 text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{member.badge}</span>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-2">{member.title}</p>
                  <h3 className="text-2xl font-heading text-white uppercase italic mb-1">{member.name}</h3>
                  <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-6">{member.role}</p>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-8">{member.bio}</p>

                  <div className="flex gap-3 pt-4 border-t border-white/5">
                    <a href={member.socials.instagram} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 text-zinc-500 hover:text-primary transition-all">
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a href={`mailto:${member.socials.email}`} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 text-zinc-500 hover:text-primary transition-all">
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
