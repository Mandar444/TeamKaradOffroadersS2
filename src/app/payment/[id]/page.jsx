"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { CATEGORIES, PRICING_CONFIG } from "@/config/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, Copy, AlertCircle, ShieldCheck, Phone, Zap } from "lucide-react";


export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [utr, setUtr] = useState("");
  const [loading, setLoading] = useState(false);
  const [regData, setRegData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    async function fetchDetails() {
      if (!id) return;
      try {
        const res = await fetch(`/api/registration-details?id=${id}`);
        const result = await res.json();
        if (res.ok) {
          setRegData(result);
        } else {
          setError(result.error || "Registration Record Not Found");
        }
      } catch (e) {
        setError("Network Interrupt: Failed to fetch grid data");
      }

    }
    fetchDetails();
  }, [id]);

  const upiUrl = (isMounted && regData) ? 
    `upi://pay?pa=${PRICING_CONFIG.upiId}&pn=${encodeURIComponent(PRICING_CONFIG.upiName)}&am=${regData.amount}&tn=${encodeURIComponent(`Team: ${regData.team_name} | ID: ${id}`)}&cu=INR` 
    : "";

  // UTR submission logic has been decoupled from screenshot upload to ensure zero-fail reliability
  const handleSubmitUTR = async (e) => {
    if (e) e.preventDefault();
    if (utr.length < 12) return alert("UTR must be 12 digits");
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("regId", id);
      formData.append("utr", utr);
      // Screenshot is now verified manually via WhatsApp to prevent technical drop-offs

      const res = await fetch("/api/submit-utr", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        router.push(`/success/${id}`);
      } else {
        alert(`${result.error}: ${result.details || "Unknown error"}`);
      }
    } catch (e) {
      alert("Error submitting payment info");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(PRICING_CONFIG.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
        <Card className="max-w-md w-full bg-zinc-900 border-red-500/20 text-center p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-heading text-white mb-2">Ops! Payment Link Expired</h2>
          <p className="text-zinc-500 mb-6">{error}</p>
          <Button onClick={() => router.push("/register")} className="w-full bg-primary text-black font-bold">
            BACK TO REGISTRATION
          </Button>
        </Card>
      </div>
    );
  }

  if (!regData && id) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-black">
         <div className="text-center">
           <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
           <p className="text-zinc-500 font-heading tracking-widest uppercase animate-pulse">Generating Secure QR...</p>
         </div>
       </div>
     );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-zinc-950">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-start mb-10">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-2">
               <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
               <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest leading-none">Waitlist Status: Action Required</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading text-white tracking-tighter uppercase leading-none">
              COMPLETE <span className="text-primary italic font-heading">PAYMENT</span>
            </h1>
            <p className="text-zinc-500 mt-2 text-xs md:text-sm font-medium">Registration Reference: <span className="text-primary font-mono">{id || "..."}</span></p>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => router.push("/")}
            className="text-zinc-500 hover:text-white flex items-center gap-2 font-black uppercase tracking-widest text-[10px] border border-white/5 px-4"
          >
            QUIT & HOME
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          <Card className="bg-zinc-900 border-zinc-800 border-t-4 border-t-primary overflow-hidden">
            <CardContent className="pt-8">
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-xl mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)] w-full max-w-[280px] aspect-square flex items-center justify-center">
                  {upiUrl ? (
                    <QRCodeSVG 
                      value={upiUrl} 
                      className="w-full h-full" 
                      level="M" 
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400 text-[10px] uppercase font-bold tracking-widest text-center px-4">Generating QR Payload...</div>
                  )}
                </div>
                
                <div className="text-center space-y-2 mb-8">
                  <p className="text-zinc-500 text-sm uppercase tracking-widest">Payable Amount</p>
                  <p className="text-4xl font-bold font-heading text-white">₹{regData?.amount?.toLocaleString() || "..."}</p>
                </div>

                <div className="w-full space-y-4">
                  <div className="p-4 bg-black/40 border border-zinc-800 rounded-lg">
                    <p className="text-zinc-500 text-xs mb-1">Pay to UPI ID</p>
                    <div className="flex justify-between items-center">
                      <p className="text-white font-mono">{PRICING_CONFIG.upiId}</p>
                      <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-primary hover:text-white hover:bg-white/5">
                        {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                    <div className="space-y-2">
                       <p className="text-amber-500/80 text-xs leading-relaxed">
                         IMPORTANT: Ensure the payment note shows: <br/>
                         <b className="text-white">Team: {regData?.team_name || "---"} | Driver: {regData?.driver_name || "---"}</b>
                       </p>
                    </div>
                  </div>

                  {/* UPI Troubleshooting */}
                  <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                      <ShieldCheck className="w-12 h-12 text-blue-500" />
                    </div>
                    <h4 className="text-blue-400 font-heading text-xs uppercase tracking-widest mb-3">UPI Limit Issues?</h4>
                    <p className="text-zinc-500 text-[10px] leading-relaxed mb-4">
                      If you experience limits (INR 2000+), try the following:
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Switch Apps: Try Google Pay, PhonePe or Paytm",
                        "Manual Entry: Copy UPI ID & enter in your bank app",
                        "Scan Again: Ensure stable internet connection"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase font-bold tracking-tight">
                           <div className="w-1 h-1 bg-blue-500/40 rounded-full" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-zinc-800 space-y-8">
                  {/* Step 1 & 2 Container */}
                  <div className="p-8 bg-zinc-900/50 border border-primary/20 rounded-[2rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                       <ShieldCheck className="w-24 h-24 text-primary" />
                    </div>

                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                         <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                         <span className="text-primary text-[10px] font-black uppercase tracking-widest">Mandatory Verification</span>
                      </div>
                      <h3 className="text-white font-heading text-2xl uppercase italic leading-none mb-2">FINAL AUTHORIZATION</h3>
                      <p className="text-zinc-500 text-xs font-medium uppercase tracking-tight">You must complete BOTH steps below to secure your grid spot.</p>
                    </div>

                    <div className="space-y-6">
                      {/* STEP 1: WhatsApp */}
                      <div className="p-6 bg-black/40 border border-white/5 rounded-2xl text-center group hover:border-emerald-500/30 transition-all">
                        <p className="text-emerald-500 text-[10px] uppercase font-black tracking-widest mb-3 flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-3 h-3" /> Step 01: Share Evidence (WA)
                        </p>
                        <a 
                          href={`https://wa.me/918087977674?text=${encodeURIComponent(`Hi TKO, I am sharing the payment screenshot for Reference: ${id}. Team: ${regData?.team_name}. Note: I've ensured the UTR No is clearly visible.`)}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex h-14 w-full items-center justify-center gap-3 text-sm font-black uppercase tracking-widest bg-[#25D366] text-black rounded-xl hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(37,211,102,0.1)]"
                        >
                           <Phone className="w-5 h-5 flex-shrink-0" /> Share Screenshot (UTR Visible)
                        </a>
                        <p className="text-zinc-600 text-[9px] mt-4 font-bold uppercase tracking-tighter">Share on WhatsApp & then come back to Step 02</p>
                      </div>

                      {/* STEP 2: UTR */}
                      <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl">
                         <p className="text-primary text-[10px] uppercase font-black tracking-widest mb-3 flex items-center justify-center gap-2">
                           <Zap className="w-3 h-3 fill-current" /> Step 02: Mandatory Log Transaction ID
                         </p>
                         <div className="bg-black/60 rounded-xl border border-white/5 p-2 mb-4">
                            <Input 
                              required 
                              value={utr}
                              onChange={(e) => setUtr(e.target.value.replace(/[^0-9]/g, ""))}
                              placeholder="12-DIGIT UTR NUMBER" 
                              className="h-16 bg-transparent border-none text-white font-mono text-2xl tracking-[0.2em] text-center focus-visible:ring-0 placeholder:text-zinc-800"
                              maxLength={12}
                            />
                         </div>
                         
                         <Button 
                          onClick={handleSubmitUTR}
                          disabled={utr.length !== 12 || loading} 
                          className="w-full h-16 bg-primary text-black font-black uppercase tracking-widest text-sm rounded-xl shadow-glow hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
                        >
                          {loading ? "AUTHORIZING RECORD..." : "FINISH REGISTRATION"}
                        </Button>

                        <div className="mt-6 flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                           <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                           <p className="text-red-500/80 text-[10px] font-bold uppercase leading-relaxed tracking-tight">
                              CRITICAL: Your grid invitation will not trigger until you finish Step 02. Do not close this manifest.
                           </p>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
