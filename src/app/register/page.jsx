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
  Sticker,
  FileText
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
  category: z.string().min(1, "Please select a category"),
  teamName: z.string().min(2, "Team name is required"),
  driverName: z.string().min(2, "Driver name is required"),
  driverPhone: z.string().regex(/^\d{10}$/, "Invalid phone number (10 digits)"),
  driverBloodGroup: z.string().min(1, "Blood group is required"),

  coDriverName: z.string().min(2, "Co-driver name is required"),
  coDriverPhone: z.string().regex(/^\d{10}$/, "Invalid phone number (10 digits)"),
  coDriverBloodGroup: z.string().min(1, "Blood group is required"),
  email: z.string().email("Invalid email address"),
  socials: z.string().optional(),

  medicalIssue: z.string().min(2, "Please state 'None' or describe issues"),
  attendanceCount: z.coerce.number().min(2, "Minimum 2 people (Driver + Co-driver)"),
  extraNames: z.string().optional(),
  
  carNumber: z.string().min(1, "Sticker number is required"),
  ageAgreement: z.boolean().refine(v => v === true, "Must be 18+ to participate"),
  categoryAgreement: z.boolean().refine(v => v === true, "Must agree to category technical rules"),
});

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [takenNumbers, setTakenNumbers] = useState([]);
  const [counts, setCounts] = useState({});
  const [limit, setLimit] = useState(160);

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
    const fetchStats = async () => {
      try {
        const [numRes, countRes] = await Promise.all([
          fetch(`/api/numbers?category=${selectedCategory}`),
          fetch(`/api/category-counts`)
        ]);
        const numData = await numRes.json();
        const countData = await countRes.json();
        setTakenNumbers(numData.numbers || []);
        setCounts(countData.counts || {});
        setLimit(countData.limit || 160);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
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
        router.push(`/payment/${data.id}`);
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
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-full h-[50vh] bg-mesh-amber opacity-10 blur-[120px]" />
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
      </div>

      <div className="max-w-[700px] w-full mx-auto relative z-10 px-4">
        {/* Progress Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex justify-between items-end mb-4">
             <div>
                <p className="text-primary text-[10px] uppercase tracking-[0.6em] font-black mb-1">Registration</p>
                <h1 className="text-3xl md:text-5xl font-heading text-white uppercase italic tracking-tighter">GRID <span className="text-primary not-italic">ENTRY</span></h1>
             </div>
             <div className="text-right">
                <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest block mb-1">Progress</span>
                <span className="text-white font-heading text-2xl md:text-3xl">{step < 10 ? `0${step}` : step} <span className="text-zinc-700 text-xs md:text-base font-sans">/ 05</span></span>
             </div>
          </div>
          
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden flex gap-1 p-[2px] border border-white/5">
            {[1, 2, 3, 4, 5].map((s) => (
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
            
            {/* STEP 1: CATEGORY SELECTION */}
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
                   <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] leading-none">Category Selection (01/05)</p>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading text-white tracking-tighter uppercase leading-none mb-10">CHOOSE YOUR <span className="text-primary italic">CLASS</span></h2>

                <div className="space-y-8">
                  <div className="space-y-4 p-6 md:p-8 bg-zinc-900/40 rounded-2xl md:rounded-[2rem] border border-white/5">
                    <Label className="text-primary text-[10px] font-black tracking-[0.4em] uppercase">Vessel Category Authorization *</Label>
                    <Select onValueChange={(v) => setValue("category", v)} defaultValue="DIESEL_MODIFIED">
                      <SelectTrigger className="h-14 md:h-16 bg-black/60 border-white/5 rounded-xl md:rounded-2xl text-xs sm:text-base md:text-xl font-heading text-white tracking-widest overflow-hidden">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {Object.entries(CATEGORIES).map(([key, cat]) => (
                          <SelectItem key={key} value={key} className="h-12 md:h-14 font-heading text-xs sm:text-lg tracking-widest">
                            {cat.name} (₹{cat.fee.toLocaleString()})
                            {counts[key] >= limit ? " [WAITLIST]" : ` [${limit - (counts[key] || 0)} LEFT]`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Category Blueprint Preview */}
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={selectedCategory}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-zinc-900/40 border border-white/5 rounded-3xl"
                    >
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Gauge className="w-3 h-3" /> Technical highlights
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         {CATEGORIES[selectedCategory]?.technicalTerms?.map((term, i) => (
                           <div key={i} className="flex items-center gap-3 text-white text-[10px] md:text-xs font-medium uppercase tracking-tighter">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              {term}
                           </div>
                         ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  
                  {counts[selectedCategory] >= limit && (
                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-500 text-xs">
                      Note: Selected category is currenty full. New entries will be placed on the <b className="font-bold">Elite Waitlist</b>.
                    </div>
                  )}
                  
                  <Button 
                    type="button" 
                    onClick={async () => {
                      const isValid = await trigger(["category"]);
                      if (isValid) {
                        setStep(2);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }} 
                    className="w-full h-14 md:h-16 bg-primary text-black font-black uppercase tracking-wider rounded-xl hover:scale-[1.02] active:scale-95 transition-all text-[10px] sm:text-xs md:text-base flex items-center justify-center p-2"
                  >
                    <span className="truncate">NEXT: TERMS AND CONDITIONS</span>
                    <ChevronRight className="ml-2 w-4 h-4 md:w-5 md:h-5 shrink-0" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: TERMS AND CONDITIONS */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-zinc-950/50 border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
              >
                <div className="flex items-center gap-4 mb-4">
                   <FileText className="w-5 h-5 text-primary" />
                   <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] leading-none">Terms & Conditions (02/05)</p>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading text-white tracking-tighter uppercase leading-none mb-6">MANDATORY <span className="text-primary italic">AGREEMENT</span></h2>

                <div className="space-y-6">
                  <div className="p-6 bg-zinc-900/50 rounded-[1.5rem] border border-white/5 h-48 overflow-y-auto custom-scrollbar text-zinc-400 text-sm md:text-base space-y-4">
                     <p className="text-primary font-heading uppercase text-xs">Category Rules: {CATEGORIES[selectedCategory]?.name}</p>
                     <ul className="list-disc pl-5 space-y-2 text-white font-medium italic mb-6">
                        {CATEGORIES[selectedCategory]?.technicalTerms?.map((term, i) => (
                           <li key={i}>{term}</li>
                        ))}
                     </ul>

                     <p className="pt-4 border-t border-white/5 font-heading text-xs uppercase text-zinc-500">General Participation Rules:</p>
                     <ul className="list-disc pl-5 space-y-2">
                       <li>Motorsport is inherently dangerous. Team Karad Off-Roaders are not responsible for any personal injury, death, or damage to property.</li>
                       <li>All drivers and co-drivers must be 18 years of age or older and possess a valid driving license.</li>
                       <li>Vehicles MUST comply with the safety and technical regulations specified for the chosen category.</li>
                       <li>Consumption of alcohol or illicit substances is strictly prohibited.</li>
                       <li>The organizers reserve the right to modify the track or schedule for safety reasons.</li>
                     </ul>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    {[
                      { id: "categoryAgreement", label: `I AGREE TO ${CATEGORIES[selectedCategory]?.name.toUpperCase()} TECHNICAL RULES & GENERAL TERMS`, error: errors.categoryAgreement },
                      { id: "ageAgreement", label: "DRIVER AGE CERTIFICATION (18+ and hold valid license)", error: errors.ageAgreement }
                    ].map((a) => (
                      <div key={a.id} className="flex items-start gap-3 p-4 bg-zinc-900/20 border border-white/5 rounded-2xl hover:bg-zinc-900/40 transition-colors">
                        <Checkbox 
                          id={a.id} 
                          checked={watch(a.id)}
                          onCheckedChange={(checked) => setValue(a.id, checked, { shouldValidate: true })}
                          className="mt-1 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-black"
                        />
                        <div className="flex-1">
                          <Label htmlFor={a.id} className="text-[10px] md:text-xs font-medium leading-tight text-white uppercase tracking-widest cursor-pointer">{a.label} *</Label>
                          {a.error && <p className="text-red-500 text-[9px] font-black uppercase mt-1">{a.error.message}</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-full sm:flex-1 h-14 md:h-16 border-white/10 rounded-xl md:rounded-2xl text-zinc-500 font-black uppercase tracking-widest hover:text-white text-[10px] md:text-sm"><ChevronLeft className="mr-2 w-4 h-4" /> BACK</Button>
                    <Button 
                      type="button" 
                      onClick={async () => {
                        const isValid = await trigger(["categoryAgreement", "ageAgreement"]);
                        if (isValid) {
                          setStep(3);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }} 
                      className="w-full sm:flex-[2] h-14 md:h-16 bg-primary text-black font-black uppercase tracking-wider rounded-xl hover:scale-[1.02] transition-all text-[10px] md:text-base flex items-center justify-center p-2"
                    >
                      <span className="truncate">NEXT: CREW DETAILS</span>
                      <ChevronRight className="ml-2 w-4 h-4 shrink-0" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: DRIVER & CO-DRIVER HQ */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-zinc-950/50 border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
              >
                <div className="flex items-center gap-4 mb-8">
                   <Users className="w-5 h-5 text-primary" />
                   <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em] leading-none">Crew Manifest (03/05)</p>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading text-white tracking-tighter uppercase leading-none mb-10">DRIVER & CO-DRIVER <span className="text-primary italic">HQ</span></h2>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black tracking-[0.3em] text-zinc-600 uppercase">Tactical Call Sign (Team Name) *</Label>
                    <Input {...register("teamName")} placeholder="CALL SIGN / TEAM NAME" className="h-14 bg-white/5 border-white/5 rounded-xl text-lg" />
                    {errors.teamName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.teamName.message}</p>}
                  </div>

                  {/* Driver Section */}
                  <div className="p-6 md:p-8 bg-black/50 rounded-[2rem] border border-white/5 space-y-6">
                    <h3 className="text-primary font-heading uppercase tracking-widest text-lg">Driver Record</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3 md:col-span-2">
                        <Label className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em]">Driver Name *</Label>
                        <Input {...register("driverName")} className="h-14 bg-zinc-900 border-white/5 rounded-xl text-lg" />
                        {errors.driverName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.driverName.message}</p>}
                      </div>
                      <div className="space-y-3">
                        <Label className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em]">Mobile Number *</Label>
                        <Input {...register("driverPhone")} placeholder="10-DIGIT MOBILE" className="h-14 bg-zinc-900 border-white/5 rounded-xl text-lg font-mono tracking-widest" />
                        {errors.driverPhone && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.driverPhone.message}</p>}
                      </div>
                      <div className="space-y-3">
                         <Label className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em]">Blood Class *</Label>
                         <Select onValueChange={(v) => setValue("driverBloodGroup", v)}>
                           <SelectTrigger className="h-14 bg-zinc-900 border-white/5 rounded-xl text-white">
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
                  </div>

                  {/* Co-Driver Section */}
                  <div className="p-6 md:p-8 bg-black/50 rounded-[2rem] border border-white/5 space-y-6">
                    <h3 className="text-zinc-400 font-heading uppercase tracking-widest text-lg">Co-Driver Record</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3 md:col-span-2">
                        <Label className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em]">Co-Driver Name *</Label>
                        <Input {...register("coDriverName")} className="h-14 bg-zinc-900 border-white/5 rounded-xl text-lg" />
                        {errors.coDriverName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.coDriverName.message}</p>}
                      </div>
                      <div className="space-y-3">
                        <Label className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em]">Mobile Number *</Label>
                        <Input {...register("coDriverPhone")} placeholder="10-DIGIT MOBILE" className="h-14 bg-zinc-900 border-white/5 rounded-xl text-lg font-mono tracking-widest" />
                        {errors.coDriverPhone && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.coDriverPhone.message}</p>}
                      </div>
                      <div className="space-y-3">
                         <Label className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em]">Blood Class *</Label>
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
                      <div className="space-y-3 md:col-span-2">
                         <Label className="text-zinc-600 text-[9px] font-black tracking-[0.4em] uppercase">Secure Email Link *</Label>
                         <Input {...register("email")} type="email" placeholder="CONFIRMATION @ EMAIL" className="h-14 bg-zinc-900 border-white/5 rounded-xl text-lg lowercase" />
                         {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.email.message}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} className="w-full sm:flex-1 h-14 md:h-16 border-white/10 rounded-xl md:rounded-2xl text-zinc-500 font-black uppercase tracking-widest hover:text-white text-[10px] md:text-sm"><ChevronLeft className="mr-2 w-4 h-4" /> BACK</Button>
                    <Button 
                      type="button" 
                      onClick={async () => {
                        const isValid = await trigger(["teamName", "driverName", "driverPhone", "driverBloodGroup", "coDriverName", "coDriverPhone", "coDriverBloodGroup", "email"]);
                        if (isValid) {
                          setStep(4);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }} 
                      className="w-full sm:flex-[2] h-14 md:h-16 bg-primary text-black font-black uppercase tracking-wider rounded-xl hover:scale-[1.02] transition-all text-[10px] md:text-base flex items-center justify-center p-2"
                    >
                      <span className="truncate">NEXT: BIO-TECH</span>
                      <ChevronRight className="ml-2 w-4 h-4 shrink-0" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: BIO-TECH & LOGISTICS */}
            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-zinc-950/50 border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
              >
                <div className="flex items-center gap-4 mb-8">
                   <Gauge className="w-5 h-5 text-primary" />
                   <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em] leading-none">Logistics (04/05)</p>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading text-white uppercase leading-none tracking-tighter mb-10">BIO-TECH & <span className="text-primary italic">LOGISTICS</span></h2>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <Label className="text-zinc-600 text-[10px] font-black tracking-[0.4em] uppercase">Medical Context</Label>
                       <Textarea {...register("medicalIssue")} className="h-28 bg-white/5 border-white/5 rounded-xl resize-none p-4" placeholder="Allergies or 'NONE'" />
                       {errors.medicalIssue && <p className="text-red-500 text-[9px] font-black uppercase mt-1">{errors.medicalIssue.message}</p>}
                    </div>
                    <div className="space-y-3">
                       <Label className="text-zinc-600 text-[10px] font-black tracking-[0.4em] uppercase">Companion Log</Label>
                       <Textarea {...register("extraNames")} placeholder="Additional Crew names (If any)" className="h-28 bg-white/5 border-white/5 rounded-xl resize-none p-4" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8 p-6 md:p-10 bg-black/50 rounded-2xl md:rounded-[2.5rem] border border-white/5">
                    <div className="space-y-4">
                      <Label className="text-zinc-600 text-[10px] font-black tracking-[0.5em] uppercase">Total Entrants (including driver/co-driver)</Label>
                      <Input {...register("attendanceCount")} type="number" className="h-14 bg-zinc-900 border-white/5 rounded-xl text-3xl font-heading text-primary text-center" />
                      {errors.attendanceCount && <p className="text-red-500 text-[9px] font-black uppercase mt-1">{errors.attendanceCount.message}</p>}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button type="button" variant="outline" onClick={() => setStep(3)} className="w-full sm:flex-1 h-14 md:h-16 border-white/10 rounded-xl md:rounded-2xl text-zinc-500 font-black uppercase tracking-widest hover:text-white text-[10px] md:text-sm"><ChevronLeft className="mr-2 w-4 h-4" /> BACK</Button>
                    <Button 
                      type="button" 
                      onClick={async () => {
                        const isValid = await trigger(["medicalIssue", "attendanceCount", "extraNames"]);
                        if (isValid) {
                          setStep(5);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }} 
                      className="w-full sm:flex-[2] h-14 md:h-16 bg-primary text-black font-black uppercase tracking-wider rounded-xl hover:scale-[1.02] transition-all text-[10px] md:text-base flex items-center justify-center p-2"
                    >
                      <span className="truncate">FINAL STEP: GRID PASS</span>
                      <ChevronRight className="ml-2 w-4 h-4 shrink-0" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: GRID PASS & PAYMENT */}
            {step === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-950/50 border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
              >
                <div className="flex justify-center mb-8">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center rotate-3">
                     <Award className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="text-center mb-10">
                  <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.8em] mb-4">Final Protocol (05/05)</p>
                  <h2 className="text-4xl md:text-6xl font-heading text-white uppercase tracking-tighter leading-none mb-4">THE <span className="text-primary italic">GRID PASS</span></h2>
                  <p className="text-zinc-500 max-w-lg mx-auto text-sm md:text-lg font-medium">Claim your legendary sticker number for Season 2.</p>
                </div>

                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 p-6 md:p-8 bg-zinc-900/50 rounded-[2rem] border border-white/10 text-center">
                      <p className="text-primary/60 text-[10px] font-black tracking-[0.4em] uppercase mb-4">Queue Position</p>
                      <p className="text-white text-3xl md:text-4xl font-heading uppercase leading-none italic tracking-tighter">{CATEGORIES[selectedCategory]?.name}</p>
                    </div>
                    {selectedNumber && (
                      <div className="flex-1 p-6 md:p-8 bg-red-500/10 rounded-[2rem] border border-red-500/30 text-center">
                        <p className="text-red-500/60 text-[10px] font-black tracking-[0.4em] uppercase mb-4">Selected Number</p>
                        <p className="text-red-500 text-5xl md:text-6xl font-heading uppercase leading-none italic tracking-tighter drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">#{selectedNumber}</p>
                      </div>
                    )}
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
                    <Button type="button" variant="outline" onClick={() => setStep(4)} className="w-full sm:flex-1 h-14 md:h-16 border-white/10 rounded-xl md:rounded-2xl text-zinc-500 font-black uppercase tracking-widest hover:text-white text-[10px] md:text-sm"><ChevronLeft className="mr-2 w-4 h-4" /> BACK</Button>
                    <Button 
                      disabled={!selectedNumber || loading} 
                      type="submit" 
                      className={cn(
                        "w-full sm:flex-[2.5] h-14 md:h-16 text-black font-black uppercase tracking-wider rounded-xl md:rounded-2xl transition-all shadow-[0_0_60px_rgba(255,165,0,0.3)] text-[10px] md:text-base flex items-center justify-center p-2",
                        selectedNumber ? "bg-primary" : "bg-zinc-800 text-zinc-600 opacity-50 cursor-not-allowed"
                      )}
                    >
                      <span className="truncate">{loading ? "AUTHORIZING..." : "CONFIRM & PROCEED TO PAYMENT"}</span>
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
