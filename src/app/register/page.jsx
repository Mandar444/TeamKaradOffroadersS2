"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  Award, 
  User, 
  Users, 
  Phone, 
  Mail, 
  Zap, 
  Activity, 
  Gauge,
  CreditCard,
  ShieldCheck,
  Sticker
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/config/pricing";
import NumberPicker from "@/components/sections/NumberPicker";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  // Step 1: Basic Info
  category: z.string().min(1, "Please select a category"),
  teamName: z.string().min(2, "Team name is required"),
  driverName: z.string().min(2, "Driver name is required"),
  driverPhone: z.string().regex(/^\d{10}$/, "Invalid phone number (10 digits)"),
  driverBloodGroup: z.string().min(1, "Blood group is required"),

  // Step 2: Co-Driver
  coDriverName: z.string().min(2, "Co-driver name is required"),
  coDriverPhone: z.string().regex(/^\d{10}$/, "Invalid phone number (10 digits)"),
  coDriverBloodGroup: z.string().min(1, "Blood group is required"),
  email: z.string().email("Invalid email address"),
  socials: z.string().optional(),

  // Step 3: Logistics
  medicalIssue: z.string().min(2, "Please state 'None' or describe issues"),
  attendanceCount: z.coerce.number().min(2, "Minimum 2 people (Driver + Co-driver)"),
  extraNames: z.string().optional(),
  
  // Step 4: Final
  carNumber: z.string().min(1, "Sticker number is required"),
  ageAgreement: z.boolean().refine(v => v === true, "Must be 18+ to participate"),
  categoryAgreement: z.boolean().refine(v => v === true, "Must agree to category technical rules"),
});

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [takenNumbers, setTakenNumbers] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "DIESEL_MODIFIED",
      attendanceCount: 2,
      ageAgreement: false,
      categoryAgreement: false,
    },
  });

  const selectedCategory = watch("category");
  const selectedNumber = watch("carNumber");

  useEffect(() => {
    // Fetch taken numbers for the selected category
    const fetchTakenNumbers = async () => {
      try {
        const res = await fetch(`/api/numbers?category=${selectedCategory}`);
        const data = await res.json();
        setTakenNumbers(data.numbers || []);
      } catch (err) {
        console.error("Failed to fetch numbers", err);
      }
    };
    fetchTakenNumbers();
  }, [selectedCategory]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (data.success && data.id) {
        window.location.href = `/payment/${data.id}`;
      } else {
        alert(data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-32 pb-16 md:pb-20 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-full h-[50vh] bg-mesh-amber opacity-10 blur-[120px]" />
        <div className="absolute inset-0 bg-noise opacity-5" />
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        {/* Step Indicator - High End HUD Style */}
        <div className="mb-8 md:mb-12">
          <div className="flex justify-between items-end mb-4">
             <div>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-1">Deployment Module</p>
                <h1 className="text-3xl md:text-5xl font-heading text-white uppercase italic tracking-tighter">GRID <span className="text-primary not-italic">ENTRY</span></h1>
             </div>
             <div className="text-right">
                <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest block mb-1">Progress</span>
                <span className="text-white font-heading text-2xl md:text-3xl italic">{step}/4</span>
             </div>
          </div>
          
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden flex gap-1 p-[2px] border border-white/5">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s}
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  s <= step ? "bg-primary shadow-[0_0_15px_rgba(255,165,0,0.5)] flex-[2]" : "bg-zinc-800 flex-1"
                )}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-zinc-950/50 border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
              >
                <div className="flex items-center gap-4 mb-8">
                   <Zap className="w-5 h-5 text-primary" />
                   <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] leading-none">Primary Protocol (01/04)</p>
                </div>
                <h2 className="text-3xl md:text-5xl font-heading text-white tracking-tighter uppercase leading-none mb-10">DRIVER & CO-DRIVER <span className="text-primary italic">HQ</span></h2>

                <div className="space-y-8">
                  <div className="space-y-4 p-6 md:p-8 bg-zinc-900/40 rounded-2xl md:rounded-[2rem] border border-white/5">
                    <Label className="text-primary text-[10px] font-black tracking-[0.4em] uppercase">Vessel Category Authorization *</Label>
                    <Select onValueChange={(v) => setValue("category", v)} defaultValue="DIESEL_MODIFIED">
                      <SelectTrigger className="h-14 md:h-16 bg-black/60 border-white/5 rounded-xl md:rounded-2xl text-xs sm:text-base md:text-xl font-heading text-white tracking-widest overflow-hidden">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {Object.entries(CATEGORIES).map(([key, cat]) => (
                          <SelectItem key={key} value={key} className="h-12 md:h-14 font-heading text-xs sm:text-lg tracking-widest">{cat.name} (₹{cat.fee.toLocaleString()})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black tracking-[0.3em] text-zinc-600 uppercase">Tactical Call Sign (Team Name) *</Label>
                    <Input {...register("teamName")} placeholder="CALL SIGN" className="h-14 bg-white/5 border-white/5 rounded-xl text-lg" />
                    {errors.teamName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.teamName.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10 bg-black/50 rounded-2xl md:rounded-[2.5rem] border border-white/5">
                    <div className="space-y-3">
                      <Label className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em]">Driver Name</Label>
                      <Input {...register("driverName")} className="h-14 bg-zinc-900 border-white/5 rounded-xl text-lg" />
                      {errors.driverName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.driverName.message}</p>}
                    </div>
                    <div className="space-y-3">
                      <Label className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em]">Driver Comms Link</Label>
                      <Input {...register("driverPhone")} placeholder="10-DIGIT MOBILE" className="h-14 bg-zinc-900 border-white/5 rounded-xl text-lg font-mono tracking-widest" />
                      {errors.driverPhone && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.driverPhone.message}</p>}
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
                       {errors.driverBloodGroup && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.driverBloodGroup.message}</p>}
                    </div>
                  </div>

                  <Button 
                    type="button" 
                    onClick={async () => {
                      const isValid = await trigger(["category", "teamName", "driverName", "driverPhone", "driverBloodGroup"]);
                      if (isValid) {
                        setStep(2);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }} 
                    className="w-full h-14 md:h-16 bg-primary text-black font-black uppercase tracking-wider rounded-xl md:rounded-2xl hover:scale-[1.02] active:scale-95 transition-all text-[10px] sm:text-xs md:text-base flex items-center justify-center p-2"
                  >
                    <span className="truncate">NEXT: CO-DRIVER DETAILS</span>
                    <ChevronRight className="ml-2 w-4 h-4 md:w-5 md:h-5 shrink-0" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-zinc-950/50 border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
              >
                <div className="flex items-center gap-4 mb-8">
                   <Users className="w-5 h-5 text-primary" />
                   <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.8em] leading-none">Secondary Manifest (02/04)</p>
                </div>
                <h2 className="text-3xl md:text-5xl font-heading text-white uppercase leading-none tracking-tighter mb-10">CO-DRIVER & <span className="text-primary italic">COMMS</span></h2>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10 bg-black/50 rounded-2xl md:rounded-[2.5rem] border border-white/5">
                    <div className="space-y-3">
                       <Label className="text-zinc-600 text-[10px] font-black tracking-[0.4em] uppercase">Co-Driver Full Identity</Label>
                       <Input {...register("coDriverName")} className="h-14 bg-zinc-900 border-white/5 rounded-xl text-lg" />
                       {errors.coDriverName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.coDriverName.message}</p>}
                    </div>
                    <div className="space-y-3">
                      <Label className="text-zinc-600 text-[10px] font-black tracking-[0.4em] uppercase">Mobile Comms Link</Label>
                      <Input {...register("coDriverPhone")} placeholder="10-DIGIT MOBILE" className="h-14 bg-zinc-900 border-white/5 rounded-xl text-lg font-mono tracking-widest" />
                      {errors.coDriverPhone && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.coDriverPhone.message}</p>}
                    </div>
                    <div className="space-y-3">
                       <Label className="text-zinc-600 text-[10px] font-black tracking-[0.4em] uppercase">Blood Class</Label>
                       <Select onValueChange={(v) => setValue("coDriverBloodGroup", v)}>
                         <SelectTrigger className="h-14 bg-zinc-900 border-white/5 rounded-xl text-white">
                           <SelectValue placeholder="CLASS" />
                         </SelectTrigger>
                         <SelectContent className="bg-zinc-950 border-white/10 text-white">
                            {["A +ve", "A -ve", "B +ve", "B -ve", "O +ve", "O -ve", "AB +ve", "AB -ve"].map(g => (
                              <SelectItem key={g} value={g}>{g}</SelectItem>
                            ))}
                         </SelectContent>
                       </Select>
                       {errors.coDriverBloodGroup && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.coDriverBloodGroup.message}</p>}
                    </div>
                    <div className="space-y-3">
                       <Label className="text-zinc-600 text-[10px] font-black tracking-[0.4em] uppercase">Secure Email Link</Label>
                       <Input {...register("email")} type="email" placeholder="CONFIRMATION @ EMAIL" className="h-14 bg-zinc-900 border-white/5 rounded-xl text-lg lowercase" />
                       {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-full sm:flex-1 h-14 md:h-16 border-white/10 rounded-xl md:rounded-2xl text-zinc-500 font-black uppercase tracking-widest hover:text-white text-[10px] md:text-sm"><ChevronLeft className="mr-2 w-4 h-4 md:w-5 md:h-5" /> BACK</Button>
                    <Button 
                      type="button" 
                      onClick={async () => {
                        const isValid = await trigger(["coDriverName", "coDriverPhone", "coDriverBloodGroup", "email"]);
                        if (isValid) {
                          setStep(3);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }} 
                      className="w-full sm:flex-[2] h-14 md:h-16 bg-primary text-black font-black uppercase tracking-wider rounded-xl md:rounded-2xl hover:scale-[1.02] transition-all text-[10px] md:text-base flex items-center justify-center p-2"
                    >
                      <span className="truncate">NEXT: BIO-DATA</span>
                      <ChevronRight className="ml-2 w-4 h-4 md:w-5 md:h-5 shrink-0" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-zinc-950/50 border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
              >
                <div className="flex items-center gap-4 mb-8">
                   <Gauge className="w-5 h-5 text-primary" />
                   <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em] leading-none">Manifest Protocol (03/04)</p>
                </div>
                <h2 className="text-3xl md:text-5xl font-heading text-white uppercase leading-none tracking-tighter mb-10">BIO-TECH & <span className="text-primary italic">LOGISTICS</span></h2>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <Label className="text-zinc-600 text-[10px] font-black tracking-[0.4em] uppercase">Medical Context</Label>
                       <Textarea {...register("medicalIssue")} className="h-28 bg-white/5 border-white/5 rounded-xl resize-none" placeholder="Allergies or 'NONE'" />
                    </div>
                    <div className="space-y-3">
                       <Label className="text-zinc-600 text-[10px] font-black tracking-[0.4em] uppercase">Companion Log</Label>
                       <Textarea {...register("extraNames")} placeholder="Crew names" className="h-28 bg-white/5 border-white/5 rounded-xl resize-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10 bg-black/50 rounded-2xl md:rounded-[2.5rem] border border-white/5">
                    <div className="space-y-4">
                      <Label className="text-primary text-[10px] font-black tracking-[0.5em] uppercase leading-none">Ration preference</Label>
                      <Select onValueChange={(v) => setValue("foodPreference", v)} defaultValue="Both Veg">
                        <SelectTrigger className="h-14 bg-zinc-900 border-white/5 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-white/10 text-white">
                          {["Both Veg", "Both Non-Veg", "One Veg One Non Veg"].map(f => (
                            <SelectItem key={f} value={f} className="h-12">{f}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-zinc-700 text-[10px] font-black tracking-[0.5em] uppercase">Total Entrants</Label>
                      <Input {...register("attendanceCount")} type="number" className="h-14 bg-zinc-900 border-white/5 rounded-xl text-3xl font-heading text-primary text-center" />
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                    {[
                      { id: "ageAgreement", label: "DRIVER AGE CERTIFICATION (18+ hold valid license)", error: errors.ageAgreement },
                      { id: "categoryAgreement", label: "VESSEL SPECIFICATION AUTHORIZATION", error: errors.categoryAgreement }
                    ].map((a) => (
                      <div key={a.id} className="flex items-start gap-3">
                        <Checkbox 
                          id={a.id} 
                          checked={watch(a.id)}
                          onCheckedChange={(checked) => setValue(a.id, checked, { shouldValidate: true })}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor={a.id} className="text-[10px] font-medium leading-tight text-zinc-400 group-hover:text-zinc-200 uppercase tracking-widest italic">{a.label} *</Label>
                          {a.error && <p className="text-red-500 text-[9px] font-black uppercase mt-1">{a.error.message}</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} className="w-full sm:flex-1 h-14 md:h-16 border-white/10 rounded-xl md:rounded-2xl text-zinc-500 font-black uppercase tracking-widest hover:text-white text-[10px] md:text-sm"><ChevronLeft className="mr-2 w-4 h-4 md:w-5 md:h-5" /> BACK</Button>
                    <Button 
                      type="button" 
                      onClick={async () => {
                        const isValid = await trigger(["medicalIssue", "attendanceCount", "extraNames", "ageAgreement", "categoryAgreement"]);
                        if (isValid) {
                          setStep(4);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }} 
                      className="w-full sm:flex-[2] h-14 md:h-16 bg-primary text-black font-black uppercase tracking-wider rounded-xl md:rounded-2xl hover:scale-[1.02] transition-all text-[10px] md:text-base flex items-center justify-center p-2"
                    >
                      <span className="truncate">FINAL STEP: GRID PASS</span>
                      <ChevronRight className="ml-2 w-4 h-4 md:w-5 md:h-5 shrink-0" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-950/50 border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
              >
                <div className="flex justify-center mb-8">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-primary/20 border border-primary/40 flex items-center justify-center rotate-3">
                     <Award className="w-8 h-8 md:w-12 md:h-12 text-primary" />
                  </div>
                </div>
                <div className="text-center mb-10">
                  <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.8em] mb-4">Final Protocol (04/04)</p>
                  <h2 className="text-4xl md:text-7xl font-heading text-white uppercase tracking-tighter leading-none mb-4">THE <span className="text-primary italic">GRID PASS</span></h2>
                  <p className="text-zinc-500 max-w-lg mx-auto text-sm md:text-lg font-medium">Claim your legendary sticker number for Season 1.</p>
                </div>

                <div className="space-y-8">
                  <div className="p-6 md:p-10 bg-zinc-900/50 rounded-[2rem] border border-white/10 text-center">
                    <p className="text-primary/60 text-[10px] font-black tracking-[0.4em] uppercase mb-4">Queue Position</p>
                    <p className="text-white text-3xl md:text-5xl font-heading uppercase leading-none italic tracking-tighter">{CATEGORIES[selectedCategory]?.name}</p>
                  </div>

                  <div className="perspective-1000">
                    <NumberPicker 
                      category={selectedCategory} 
                      selectedNumber={selectedNumber}
                      onSelect={(n) => setValue("carNumber", n, { shouldValidate: true })}
                      takenNumbers={takenNumbers}
                    />
                    {errors.carNumber && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center mt-4">{errors.carNumber.message}</p>}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-12">
                    <Button type="button" variant="outline" onClick={() => setStep(3)} className="w-full sm:flex-1 h-14 md:h-16 border-white/10 rounded-xl md:rounded-2xl text-zinc-500 font-black uppercase tracking-widest text-[10px] md:text-sm"><ChevronLeft className="mr-2 w-4 h-4 md:w-5 md:h-5" /> BACK</Button>
                    <Button 
                      disabled={!selectedNumber || loading} 
                      type="submit" 
                      className={cn(
                        "w-full sm:flex-[2.5] h-14 md:h-16 text-black font-black uppercase tracking-wider rounded-xl md:rounded-2xl transition-all shadow-[0_0_60px_rgba(255,165,0,0.3)] text-[10px] md:text-base flex items-center justify-center p-2",
                        selectedNumber ? "bg-primary" : "bg-zinc-800 text-zinc-600 grayscale opacity-50 cursor-not-allowed"
                      )}
                    >
                      <span className="truncate">{loading ? "AUTHORIZING..." : "CONFIRM & PAY"}</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
