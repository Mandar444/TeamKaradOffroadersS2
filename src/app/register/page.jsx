"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES } from "@/config/pricing";
import NumberPicker from "@/components/sections/NumberPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, Trophy, Zap, ChevronRight, ChevronLeft, Gauge, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const registrationSchema = z.object({
  teamName: z.string().min(2, "Team name is required"),
  driverName: z.string().min(3, "Driver name is required"),
  driverPhone: z.string().regex(/^[0-9]{10}$/, "Valid 10-digit mobile number required"),
  driverBloodGroup: z.string().min(1, "Required"),
  coDriverName: z.string().min(3, "Co-driver name is required"),
  coDriverPhone: z.string().regex(/^[0-9]{10}$/, "Valid 10-digit mobile number required"),
  coDriverBloodGroup: z.string().min(1, "Required"),
  category: z.string().min(1, "Required"),
  carNumber: z.string().min(1, "Pick a sticker number"),
  ageAgreement: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the age requirement" }),
  }),
  categoryAgreement: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the category specifications" }),
  }),
  foodPreference: z.string().min(1, "Required"),
  medicalIssue: z.string().min(1, "Required (Type NONE if none)"),
  attendanceCount: z.string().min(1, "Required"),
  extraNames: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  socials: z.string().optional(),
});

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [takenNumbers, setTakenNumbers] = useState([]);
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, trigger, formState: { errors } } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      category: "DIESEL_MODIFIED",
      foodPreference: "Both Veg",
      medicalIssue: "NONE",
      attendanceCount: "2",
      ageAgreement: false,
      categoryAgreement: false,
    }
  });

  const selectedCategory = watch("category");
  const selectedNumber = watch("carNumber");

  useEffect(() => {
    async function fetchTakenNumbers() {
      if (!selectedCategory) return;
      try {
        const res = await fetch(`/api/booked-numbers?category=${selectedCategory}`);
        const data = await res.json();
        setTakenNumbers(data.booked || []);
      } catch (e) {
        console.error("Failed to fetch numbers", e);
      }
    }
    fetchTakenNumbers();
  }, [selectedCategory]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        router.push(`/payment/${result.id}`);
      } else {
        alert(`${result.error}: ${result.details || "Unknown error"}`);
      }
    } catch (e) {
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-black relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-primary/5 blur-[180px] opacity-20" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-primary/10 blur-[150px] opacity-10" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-10" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row gap-12">
        {/* Technical Progress Sidebar */}
        <div className="hidden lg:flex w-64 flex-col gap-10">
           <div className="p-8 rounded-[2rem] bg-zinc-950 border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              <div className="relative z-10 space-y-8">
                 {[
                   { id: 1, label: "PROTOCOL", icon: ShieldCheck, status: step >= 1 ? "ACTIVE" : "PENDING" },
                   { id: 2, label: "CO-DRIVER", icon: Trophy, status: step >= 2 ? "ACTIVE" : "PENDING" },
                   { id: 3, label: "BIO-DATA", icon: Gauge, status: step >= 3 ? "ACTIVE" : "PENDING" },
                   { id: 4, label: "GRID PASS", icon: Award, status: step >= 4 ? "ACTIVE" : "PENDING" }
                 ].map((s) => (
                   <div key={s.id} className={cn("flex flex-col gap-2 transition-all duration-500", step === s.id ? "scale-105" : "opacity-30")}>
                      <div className="flex items-center gap-4">
                         <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", step >= s.id ? "bg-primary/20 border-primary/40 text-primary" : "bg-white/5 border-white/5 text-zinc-700")}>
                            <s.icon className="w-5 h-5" />
                         </div>
                         <div className="flex flex-col">
                            <p className="text-[10px] font-black tracking-widest text-zinc-600">STEP 0{s.id}</p>
                            <p className="text-white font-heading font-black tracking-widest leading-none">{s.label}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                         <div className={cn("h-0.5 flex-1 rounded-full", step >= s.id ? "bg-primary/40" : "bg-white/5")} />
                         <span className={cn("text-[7px] font-black tracking-widest", step >= s.id ? "text-primary" : "text-zinc-800")}>{s.status}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="flex items-center gap-4 px-6 opacity-30 group">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:animate-ping" />
              <p className="text-[9px] font-black tracking-[0.4em] text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase">Data Secure • encrypted Tunnel</p>
           </div>
        </div>

        {/* Global Action Header (Mobile only) */}
        <div className="lg:hidden text-center mb-10">
           <h1 className="text-4xl font-heading text-white uppercase tracking-tighter mb-4">
             ELITE <span className="text-primary italic">ENTRY</span>
           </h1>
           <div className="flex justify-center gap-2">
             {[1,2,3,4].map(s => (
                <div key={s} className={cn("h-1 w-10 rounded-full transition-all duration-500", step >= s ? "bg-primary" : "bg-white/10")} />
             ))}
           </div>
        </div>

        {/* Dynamic Form Content */}
        <div className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 50, rotateY: 10 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  exit={{ opacity: 0, x: -50, rotateY: -10 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="perspective-2000"
                >
                  <Card className="bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(255,165,0,0.12)] relative">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
                    <CardHeader className="pt-12 px-10 md:px-16">
                      <div className="flex items-center gap-4 mb-4">
                         <Zap className="w-5 h-5 text-primary" />
                         <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] leading-none">Primary Protocol (01/04)</p>
                      </div>
                      <CardTitle className="text-5xl font-heading text-white tracking-tighter uppercase leading-none">DRIVER & CO-DRIVER <span className="text-primary italic">HQ</span></CardTitle>
                    </CardHeader>

                    <CardContent className="px-10 md:px-16 pb-16 space-y-10">
                      {/* Premium Category Selector */}
                      <div className="space-y-4 p-8 bg-zinc-900/40 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <Label className="text-primary text-[10px] font-black tracking-[0.4em] uppercase">Vessel Category Authorization *</Label>
                        <Select onValueChange={(v) => setValue("category", v)} defaultValue="DIESEL_MODIFIED">
                          <SelectTrigger className="h-16 bg-black/60 border-white/5 rounded-2xl text-xl font-heading text-white tracking-widest focus:ring-primary/40 focus:border-primary/50 transition-all">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-2xl">
                            {Object.entries(CATEGORIES).map(([key, cat]) => (
                              <SelectItem key={key} value={key} className="h-14 font-heading text-lg tracking-widest">{cat.name} (₹{cat.fee.toLocaleString()})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-black tracking-[0.3em] text-zinc-600 uppercase ml-1 pr-1">Tactical Call Sign (Team Name) *</Label>
                        <Input {...register("teamName")} placeholder="CALL SIGN" className="h-14 bg-white/5 border-white/5 rounded-xl text-lg font-medium focus:bg-white/10 transition-all placeholder:opacity-20" />
                        {errors.teamName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2">{errors.teamName.message}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-black/50 rounded-[2.5rem] border border-white/5">
                        <div className="space-y-3">
                          <Label className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em]">Driver Name</Label>
                          <Input {...register("driverName")} className="h-14 bg-zinc-900 border-white/5 rounded-xl text-lg" />
                          {errors.driverName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">{errors.driverName.message}</p>}
                        </div>
                        <div className="space-y-3">
                          <Label className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em]">Driver Comms Link</Label>
                          <Input {...register("driverPhone")} placeholder="10-DIGIT MOBILE" className="h-14 bg-zinc-900 border-white/5 rounded-xl text-lg font-mono tracking-widest" />
                          {errors.driverPhone && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">{errors.driverPhone.message}</p>}
                        </div>

                        <div className="space-y-3 pt-4">
                           <Label className="text-zinc-700 text-[9px] font-black uppercase tracking-[0.3em]">Blood Class *</Label>
                           <Select onValueChange={(v) => setValue("driverBloodGroup", v)}>
                             <SelectTrigger className="h-14 bg-zinc-900 border-white/5 rounded-xl">
                               <SelectValue placeholder="CLASS" />
                             </SelectTrigger>
                             <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                {["A +ve", "A -ve", "B +ve", "B -ve", "O +ve", "O -ve", "AB +ve", "AB -ve"].map(g => (
                                  <SelectItem key={g} value={g}>{g}</SelectItem>
                                ))}
                             </SelectContent>
                           </Select>
                        </div>

                      </div>

                      <div className="pt-6">
                        <Button 
                          type="button" 
                          onClick={async () => {
                            const isValid = await trigger(["category", "teamName", "driverName", "driverPhone", "driverBloodGroup"]);
                            if (isValid) setStep(2);
                          }} 
                          className="w-full h-16 bg-primary text-black font-black uppercase tracking-[0.4em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_rgba(255,165,0,0.2)]"
                        >
                          INITIALIZE CO-DRIVER PROTOCOL <ChevronRight className="ml-2 w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="perspective-2000"
                >
                   <Card className="bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(255,165,0,0.12)]">
                      <CardHeader className="pt-16 px-12 md:px-20 text-center">
                         <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.8em] mb-4">Secondary Manifest (02/04)</p>
                         <CardTitle className="text-6xl font-heading text-white uppercase leading-none tracking-tighter">CO-DRIVER & <span className="text-primary italic">COMMS</span></CardTitle>
                      </CardHeader>
                      <CardContent className="px-12 md:px-20 pb-20 space-y-12">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-12 bg-black/60 rounded-[3rem] border border-white/5">
                            <div className="space-y-3">
                               <Label className="text-zinc-600 text-[10px] font-black tracking-[0.4em] uppercase">Co-Driver Full Identity</Label>
                               <Input {...register("coDriverName")} className="h-14 bg-zinc-900/50 border-white/5 rounded-xl text-lg" />
                               {errors.coDriverName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2">{errors.coDriverName.message}</p>}
                            </div>
                            <div className="space-y-3">
                               <Label className="text-zinc-600 text-[10px] font-black tracking-[0.4em] uppercase">Mobile Comms Link</Label>
                               <Input {...register("coDriverPhone")} placeholder="10-DIGIT MOBILE" className="h-14 bg-zinc-900/50 border-white/5 rounded-xl text-lg font-mono tracking-widest" />
                            </div>
                            <div className="space-y-3">
                               <Label className="text-zinc-600 text-[10px] font-black tracking-[0.4em] uppercase">Blood Class</Label>
                               <Select onValueChange={(v) => setValue("coDriverBloodGroup", v)}>
                                 <SelectTrigger className="h-14 bg-zinc-900/50 border-white/5 rounded-xl text-white">
                                   <SelectValue placeholder="CLASS" />
                                 </SelectTrigger>
                                 <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                    {["A +ve", "A -ve", "B +ve", "B -ve", "O +ve", "O -ve", "AB +ve", "AB -ve"].map(g => (
                                      <SelectItem key={g} value={g}>{g}</SelectItem>
                                    ))}
                                 </SelectContent>
                               </Select>
                            </div>
                            <div className="space-y-3">
                               <Label className="text-zinc-600 text-[10px] font-black tracking-[0.4em] uppercase">Secure Email Link</Label>
                               <Input {...register("email")} type="email" placeholder="CONFIRMATION @ EMAIL" className="h-14 bg-zinc-900/50 border-white/5 rounded-xl text-lg lowercase" />
                               {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2">{errors.email.message}</p>}
                            </div>
                         </div>

                         <div className="space-y-4 pt-4 border-t border-white/5">
                            <Label className="text-primary text-[10px] font-black tracking-[0.5em] uppercase px-2 mb-2 block">Social Pulse Handle (Driver/Team)</Label>
                            <div className="relative group">
                               <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                                  <span className="text-2xl font-bold">@</span>
                               </div>
                               <Input {...register("socials")} placeholder="INSTAGRAM_ID" className="h-16 pl-14 bg-white/5 border-white/5 rounded-2xl text-xl font-heading italic tracking-widest transition-all focus:bg-white/10" />
                            </div>
                         </div>

                         <div className="flex flex-col sm:flex-row gap-4 pt-10">
                            <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-16 border-white/10 rounded-2xl text-zinc-500 font-black uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all"><ChevronLeft className="mr-2 w-5 h-5" /> RETREAT</Button>
                            <Button 
                              type="button" 
                              onClick={async () => {
                                const isValid = await trigger(["coDriverName", "coDriverPhone", "coDriverBloodGroup", "email", "foodPreference"]);
                                if (isValid) setStep(3);
                              }} 
                              className="flex-[2] h-16 bg-primary text-black font-black uppercase tracking-[0.4em] rounded-2xl hover:scale-[1.02] shadow-[0_0_40px_rgba(255,165,0,0.2)]"
                            >
                              LOCK IN DATA <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                         </div>
                      </CardContent>
                   </Card>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
                   <Card className="bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(255,165,0,0.12)]">
                      <CardHeader className="pt-16 px-12 md:px-20 flex flex-row items-center gap-6">
                         <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/5">
                            <Gauge className="w-8 h-8 text-zinc-600" />
                         </div>
                         <div>
                            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em] mb-1">Manifest Protocol (03/04)</p>
                            <CardTitle className="text-5xl font-heading text-white uppercase leading-none tracking-tighter">BIO-TECH & <span className="text-primary italic">LOGISTICS</span></CardTitle>
                         </div>
                      </CardHeader>
                      <CardContent className="px-12 md:px-20 pb-20 space-y-12">
                         <div className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                               <div className="space-y-3">
                                  <Label className="text-zinc-600 text-[10px] font-black tracking-[0.4em] uppercase">Emergency Medical Context</Label>
                                  <Textarea {...register("medicalIssue")} className="h-40 bg-white/5 border-white/5 rounded-2xl text-lg resize-none p-6 focus:bg-white/10 transition-all font-medium" placeholder="Report allergies, chronic issues, or type 'NONE' for medical clearance." />
                               </div>
                               <div className="space-y-3">
                                  <Label className="text-zinc-600 text-[10px] font-black tracking-[0.4em] uppercase">Companion Log (Extra Names)</Label>
                                  <Textarea {...register("extraNames")} placeholder="Official list of companions/support crew names for biometric logs." className="h-40 bg-white/5 border-white/5 rounded-2xl text-lg resize-none p-6 font-medium" />
                               </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center p-12 bg-black/60 rounded-[3rem] border border-white/5 relative">
                               <div className="space-y-4">
                                  <Label className="text-primary text-[10px] font-black tracking-[0.5em] uppercase leading-none">Ration preference (Fuel for drivers)</Label>
                                  <Select onValueChange={(v) => setValue("foodPreference", v)} defaultValue="Both Veg">
                                    <SelectTrigger className="h-16 bg-zinc-900 border-white/5 rounded-2xl text-xl font-heading text-white tracking-widest">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                      {["Both Veg", "Both Non-Veg", "One Veg One Non Veg"].map(f => (
                                        <SelectItem key={f} value={f} className="h-12 font-medium">{f}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                               </div>
                               <div className="space-y-4">
                                  <Label className="text-zinc-700 text-[10px] font-black tracking-[0.5em] uppercase">Total Entrants in unit</Label>
                                  <Input {...register("attendanceCount")} type="number" className="h-16 bg-zinc-900 border-white/5 rounded-2xl text-6xl font-heading font-black text-primary text-center px-0 appearance-none" />
                               </div>
                            </div>
                         </div>

                         <div className="space-y-6 pt-10 border-t border-white/5">
                            {[
                              { id: "ageAgreement", label: "DRIVER AGE CERTIFICATION: Both driver and co-driver are of legal age (18+) and hold valid class A/B driving licenses.", error: errors.ageAgreement },
                              { id: "categoryAgreement", label: "VESSEL SPECIFICATION AUTHORIZATION: Verified vehicle specifications match the selected class rules.", error: errors.categoryAgreement }
                            ].map((a) => (
                              <div key={a.id}>
                                <div className="flex items-start gap-4 p-6 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-white/10 group transition-all cursor-pointer" onClick={() => setValue(a.id, !watch(a.id), { shouldValidate: true })}>
                                   <Checkbox 
                                     id={a.id} 
                                     checked={watch(a.id)}
                                     onCheckedChange={(checked) => setValue(a.id, checked, { shouldValidate: true })}
                                     className="w-6 h-6 rounded-lg pointer-events-none mt-1 border-white/20 data-[state=checked]:bg-primary"
                                   />
                                   <Label htmlFor={a.id} className="text-xs lg:text-sm font-medium leading-tight cursor-pointer text-zinc-400 group-hover:text-zinc-200 uppercase tracking-widest italic">{a.label} *</Label>
                                </div>
                                {a.error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-14">{a.error.message}</p>}
                              </div>
                            ))}
                         </div>

                         <div className="flex flex-col sm:flex-row gap-6 pt-10">
                            <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 h-16 border-white/10 rounded-2xl text-zinc-500 font-black uppercase tracking-widest hover:text-white"><ChevronLeft className="mr-2 w-5 h-5" /> RECALIBRATE</Button>
                            <Button 
                              type="button" 
                              onClick={async () => {
                                const isValid = await trigger(["medicalIssue", "attendanceCount", "extraNames", "ageAgreement", "categoryAgreement"]);
                                if (isValid) setStep(4);
                              }} 
                              className="flex-[2] h-16 bg-primary text-black font-black uppercase tracking-[0.4em] rounded-2xl hover:scale-[1.02] shadow-[0_0_40px_rgba(255,165,0,0.2)]"
                            >
                              SCAN SHIPMENT PROFILE <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                         </div>
                      </CardContent>
                   </Card>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }}>
                   <Card className="bg-zinc-950 border border-white/10 rounded-[3rem] shadow-[0_0_120px_rgba(255,165,0,0.25)] relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                         <div className="text-[200px] font-heading font-black italic text-white/5">04</div>
                      </div>
                      <CardHeader className="pt-20 px-12 md:px-24 text-center">
                         <div className="flex justify-center mb-8">
                            <div className="w-24 h-24 rounded-3xl bg-primary/20 border border-primary/40 flex items-center justify-center rotate-3 shadow-[0_0_40px_rgba(255,165,0,0.15)]">
                               <Award className="w-12 h-12 text-primary" />
                            </div>
                         </div>
                         <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[1em] mb-4">Final Protocol (04/04)</p>
                         <CardTitle className="text-7xl font-heading text-white uppercase tracking-tighter leading-none mb-4">THE <span className="text-primary italic">GRID PASS</span></CardTitle>
                         <p className="text-zinc-500 max-w-lg mx-auto text-lg font-medium leading-relaxed">Secure your official sticker number in the global leaderboard. This number represents your unit for the entire 2026 season.</p>
                      </CardHeader>

                      <CardContent className="px-12 md:px-24 pb-24 space-y-12">
                         <div className="p-10 bg-zinc-900/50 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group">
                           <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                           <p className="text-primary/60 text-[11px] font-black tracking-[0.6em] uppercase mb-4 leading-none">Authorization Queue</p>
                           <p className="text-white text-5xl font-heading uppercase leading-none italic tracking-tighter drop-shadow-lg">{CATEGORIES[selectedCategory]?.name}</p>
                           <div className="h-1 w-24 bg-primary/40 rounded-full mt-8" />
                         </div>

                         <div className="perspective-1000">
                            <NumberPicker 
                              category={selectedCategory} 
                              selectedNumber={selectedNumber}
                              onSelect={(n) => setValue("carNumber", n)}
                              takenNumbers={takenNumbers}
                            />
                         </div>

                         <div className="flex flex-col sm:flex-row gap-6 pt-12">
                            <Button type="button" variant="outline" onClick={() => setStep(3)} className="flex-1 h-16 border-white/10 rounded-2xl text-zinc-500 font-black uppercase tracking-widest hover:text-white"><ChevronLeft className="mr-2 w-5 h-5" /> STEP BACK</Button>
                            <Button 
                              disabled={!selectedNumber || loading} 
                              type="submit" 
                              className={cn(
                                "flex-[2.5] h-16 text-black font-black uppercase tracking-[0.5em] rounded-2xl transition-all shadow-[0_0_60px_rgba(255,165,0,0.3)]",
                                selectedNumber ? "bg-primary hover:scale-[1.04] active:scale-95" : "bg-zinc-800 text-zinc-600 grayscale opacity-50 cursor-not-allowed"
                              )}
                            >
                              {loading ? (
                                <span className="flex items-center gap-4">
                                   <div className="w-5 h-5 border-4 border-black/20 border-t-black rounded-full animate-spin" /> AUTHORIZING...
                                </span>
                              ) : (
                                "SECURE ENTRY & INITIALIZE PAYMENT"
                              )}
                            </Button>
                         </div>
                         {!selectedNumber && <p className="text-center text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em] italic animate-pulse">Waiting for sticker number selection...</p>}
                      </CardContent>
                   </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}
