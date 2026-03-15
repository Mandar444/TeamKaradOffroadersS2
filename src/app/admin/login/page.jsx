"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, Zap, Gauge } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/admin/registrations");
      if (res.ok) {
        router.push("/admin");
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      alert("Invalid Security Credentials");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] opacity-20" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-zinc-950/40 border-white/10 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
           {/* Scanline Effect */}
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-pulse" />
           
           <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 relative group">
                 <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                 <ShieldCheck className="w-10 h-10 text-primary relative z-10" />
              </div>
              <h1 className="text-4xl font-heading text-white uppercase tracking-tighter leading-none mb-2">SECURE <span className="text-primary italic">UPLINK</span></h1>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">Restricted Access Area</p>
           </div>

           <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                 <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 opacity-30 group-focus-within:opacity-100 transition-opacity">
                       <Lock className="w-4 h-4 text-primary" />
                    </div>
                    <Input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="ENTER SECURITY KEY"
                      className="h-16 pl-14 bg-white/5 border-white/5 rounded-2xl text-xl font-heading tracking-[0.2em] focus:bg-white/10 transition-all text-white placeholder:opacity-20"
                    />
                 </div>
              </div>

              <Button 
                disabled={loading} 
                type="submit" 
                className="w-full h-16 bg-primary text-black font-black uppercase tracking-[0.4em] rounded-2xl shadow-[0_0_40px_rgba(255,165,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    INITIALIZE ACCESS <Zap className="w-4 h-4" />
                  </span>
                )}
              </Button>
           </form>

           <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between opacity-30">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                 <span className="text-[8px] font-black tracking-widest uppercase">Encryption Active</span>
              </div>
              <Gauge className="w-4 h-4 text-zinc-500" />
           </div>
        </Card>
      </motion.div>
    </div>
  );
}
