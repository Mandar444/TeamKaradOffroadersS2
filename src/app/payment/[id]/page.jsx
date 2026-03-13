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
import { CheckCircle2, ChevronRight, Copy, AlertCircle } from "lucide-react";

export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [utr, setUtr] = useState("");
  const [loading, setLoading] = useState(false);
  const [regData, setRegData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(`/api/registration-details?id=${id}`);
        const data = await res.json();
        if (res.ok) {
          setRegData(data);
        } else {
          setError(data.error || "Registration not found");
        }
      } catch (e) {
        console.error("Failed to fetch data");
        setError("Technical error connecting to server");
      }
    }
    fetchDetails();
  }, [id]);

  const upiUrl = regData ? 
    `upi://pay?pa=${PRICING_CONFIG.upiId}&pn=${encodeURIComponent(PRICING_CONFIG.upiName)}&am=${regData.amount}&tn=${encodeURIComponent(`Team: ${regData.team_name} | Driver: ${regData.driver_name} | Co: ${regData.codriver_name} | Cat: ${regData.category}`)}&cu=INR` 
    : "";

  const [screenshot, setScreenshot] = useState(null);

  const handleSubmitUTR = async (e) => {
    e.preventDefault();
    if (utr.length < 12) return alert("UTR must be 12 digits");
    if (!screenshot) return alert("Please upload the payment screenshot as requested");
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("regId", id);
      formData.append("utr", utr);
      formData.append("screenshot", screenshot);

      const res = await fetch("/api/submit-utr", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.push(`/success/${id}`);
      } else {
        alert("Failed to submit. Please try again.");
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
        <div className="text-center mb-10">
          <h1 className="text-4xl font-heading text-white">COMPLETE <span className="text-primary italic">PAYMENT</span></h1>
          <p className="text-zinc-500 mt-2">Registration ID: <span className="text-primary font-mono">{id}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          <Card className="bg-zinc-900 border-zinc-800 border-t-4 border-t-primary overflow-hidden">
            <CardContent className="pt-8">
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-xl mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  <QRCodeSVG value={upiUrl} size={250} level="M" />
                </div>
                
                <div className="text-center space-y-2 mb-8">
                  <p className="text-zinc-500 text-sm uppercase tracking-widest">Payable Amount</p>
                  <p className="text-4xl font-bold font-heading text-white">₹{regData?.amount?.toLocaleString()}</p>
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
                    <p className="text-amber-500/80 text-xs leading-relaxed">
                      IMPORTATNT: The QR already includes your team info. Ensure the payment note shows: <br/>
                      <b className="text-white">Team: {regData?.team_name} | Driver: {regData?.driver_name}</b>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-zinc-800">
                <form onSubmit={handleSubmitUTR} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Step 1: Upload Payment Screenshot (Max 1MB)</Label>
                    <div className="relative group">
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setScreenshot(e.target.files[0])}
                        className="bg-zinc-800 border-zinc-700 text-white h-12 pt-2 file:mr-4 file:bg-primary file:border-0 file:px-4 file:py-1 file:rounded-full file:text-xs file:font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-400">Step 2: Enter 12-digit UTR / Ref Number</Label>
                    <Input 
                      required 
                      value={utr}
                      onChange={(e) => setUtr(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="e.g. 123456789012" 
                      className="h-14 bg-zinc-800 border-zinc-700 text-white font-mono text-xl tracking-[0.2em] text-center"
                      maxLength={12}
                    />
                  </div>
                  <Button 
                    disabled={utr.length !== 12 || !screenshot || loading} 
                    className="w-full h-14 bg-primary text-black font-bold text-lg neon-glow"
                  >
                    {loading ? "VERIFYING..." : "FINISH REGISTRATION →"}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
