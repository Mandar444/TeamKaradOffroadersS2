"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, Send, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const contactInfo = [
  { icon: Mail, label: "Official Communications", value: "teamkaradoffroaders@gmail.com", href: "mailto:teamkaradoffroaders@gmail.com" },
  { icon: MapPin, label: "Base Operations", value: "Karad, Maharashtra, India", href: "https://maps.app.goo.gl/UcCbnHEk2i14xePK7" },
  { icon: Clock, label: "Operational Status", value: "Online 24/7 for Inquiries", href: "#" },
];

const socials = [
  { icon: Instagram, label: "Instagram", handle: "@teamkaradoffroaders", href: "https://instagram.com/teamkaradoffroaders", color: "from-purple-500 to-pink-500" },
  { icon: Facebook, label: "Facebook", handle: "Team Karad Off-Roaders", href: "https://facebook.com/teamkaradoffroaders", color: "from-blue-600 to-blue-400" },
  { icon: Youtube, label: "YouTube", handle: "Team Karad Off-Roaders TV", href: "https://youtube.com/@teamkaradoffroaders", color: "from-red-600 to-red-400" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-32 pb-16 md:pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-mesh-amber opacity-10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />

      <section className="px-6 py-12 md:py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] mb-4">Uplink Station</p>
            <h1 className="text-[12vw] md:text-9xl font-heading tracking-tighter uppercase leading-none mb-8 italic">
              CONTACT <span className="text-primary not-italic">BASE</span>
            </h1>
            <p className="text-zinc-400 text-xl md:text-2xl max-w-3xl leading-relaxed font-medium">
              We would be happy to connect with you for event participation, sponsorship opportunities, collaborations, or any inquiries related to Team Karad Off-Roaders.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-20">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 md:p-10 bg-zinc-950 border border-white/5 rounded-[2rem]"
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

            {/* Contact Info & Map */}
            <div className="space-y-8">
              {contactInfo.map((c, idx) => (
                <motion.a
                  key={c.label}
                  href={c.href}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4 md:gap-6 p-6 md:p-8 bg-zinc-950/50 border border-white/5 rounded-[2rem] hover:border-primary/20 transition-all group backdrop-blur-xl"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <c.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mb-1">{c.label}</p>
                    <p className="text-white text-[15px] md:text-lg font-heading break-all md:break-normal">{c.value}</p>
                  </div>
                </motion.a>
              ))}

              {/* Map Integration */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative h-[300px] md:h-[400px] rounded-[3rem] overflow-hidden border border-white/10 group bg-zinc-950"
              >
                <div className="absolute inset-0 bg-primary/5 group-hover:opacity-0 transition-opacity z-10 pointer-events-none" />
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60951.27503719003!2d74.14441585721833!3d17.29415750059954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc1823769931721%3A0x374e2c9ca9a03975!2sKarad%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1655883253549!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.8)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                ></iframe>
                <div className="absolute top-6 left-6 z-20">
                   <div className="px-4 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">Base Operations Signal</span>
                   </div>
                </div>
              </motion.div>

              {/* Social Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4">
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
