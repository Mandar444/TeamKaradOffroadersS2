"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, Send, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const contactInfo = [
  { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
  { icon: Mail, label: "Email", value: "info@teamkaradoffroaders.online", href: "mailto:info@teamkaradoffroaders.online" },
  { icon: MapPin, label: "Location", value: "Karad, Satara District, Maharashtra 415110", href: "#" },
  { icon: Clock, label: "Office Hours", value: "Mon - Sat: 10AM - 7PM", href: "#" },
];

const socials = [
  { icon: Instagram, label: "Instagram", handle: "@teamkaradoffroaders", href: "https://instagram.com/teamkaradoffroaders", color: "from-purple-500 to-pink-500" },
  { icon: Facebook, label: "Facebook", handle: "Team Karad Offroaders", href: "https://facebook.com/teamkaradoffroaders", color: "from-blue-600 to-blue-400" },
  { icon: Youtube, label: "YouTube", handle: "TKO Motorsports", href: "https://youtube.com/@tko", color: "from-red-600 to-red-400" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20">
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] mb-4">Get In Touch</p>
            <h1 className="text-6xl md:text-8xl font-heading tracking-tighter uppercase leading-none mb-8">
              CONTACT <span className="text-primary italic">HQ</span>
            </h1>
            <p className="text-zinc-400 text-xl max-w-2xl leading-relaxed">
              Have questions about the rally, registration, or sponsorship opportunities? 
              We're here to help. Reach out through any channel below.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-20">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 bg-zinc-950 border border-white/5 rounded-[2rem]"
            >
              <h3 className="text-2xl font-heading text-white uppercase mb-8">Send a Message</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black tracking-[0.3em] text-zinc-600 uppercase">Your Name</Label>
                    <Input className="h-14 bg-white/5 border-white/5 rounded-xl" placeholder="Full Name" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black tracking-[0.3em] text-zinc-600 uppercase">Email</Label>
                    <Input className="h-14 bg-white/5 border-white/5 rounded-xl" type="email" placeholder="you@email.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black tracking-[0.3em] text-zinc-600 uppercase">Subject</Label>
                  <Input className="h-14 bg-white/5 border-white/5 rounded-xl" placeholder="What's this about?" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black tracking-[0.3em] text-zinc-600 uppercase">Message</Label>
                  <Textarea className="h-40 bg-white/5 border-white/5 rounded-xl resize-none p-4" placeholder="Tell us more..." />
                </div>
                <Button className="w-full h-14 bg-primary text-black font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all">
                  <Send className="w-4 h-4 mr-2" /> Send Message
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <div className="space-y-8">
              {contactInfo.map((c, idx) => (
                <motion.a
                  key={c.label}
                  href={c.href}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-6 p-8 bg-zinc-950 border border-white/5 rounded-[2rem] hover:border-primary/20 transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <c.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mb-1">{c.label}</p>
                    <p className="text-white text-lg font-heading">{c.value}</p>
                  </div>
                </motion.a>
              ))}

              {/* Social Grid */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                {socials.map((s, idx) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 bg-zinc-950 border border-white/5 rounded-2xl text-center hover:border-primary/20 transition-all group"
                  >
                    <s.icon className="w-8 h-8 text-zinc-600 mx-auto mb-3 group-hover:text-primary transition-colors" />
                    <p className="text-xs font-black uppercase tracking-widest text-zinc-600 group-hover:text-white transition-colors">{s.label}</p>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
