"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
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

const registrationSchema = z.object({
  teamName: z.string().min(2, "Team name is required"),
  driverName: z.string().min(3, "Driver name is required"),
  driverPhone: z.string().regex(/^[0-9]{10}$/, "Valid 10-digit mobile number required"),
  driverBloodGroup: z.string().min(1, "Required"),
  coDriverName: z.string().min(3, "Co-driver name is required"),
  coDriverPhone: z.string().regex(/^[0-9]{10}$/, "Valid 10-digit mobile number required"),
  coDriverBloodGroup: z.string().min(1, "Required"),
  category: z.string().min(1, "Required"),
  carNumber: z.string().min(1, "Pick a car number"),
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

  // Fetch taken numbers when category changes
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
        alert(result.error || "Submission failed");
      }
    } catch (e) {
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 bg-zinc-950">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-heading text-white mb-4">
            EVENT <span className="text-primary italic">REGISTRATION</span>
          </h1>
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-1 w-12 rounded-full ${step >= s ? 'bg-primary' : 'bg-zinc-800'}`} />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader><CardTitle className="font-heading text-primary">OFFICIAL REGISTRATION</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  {/* Category first as requested */}
                  <div className="space-y-2 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <Label className="text-primary font-bold">Vehicle Category *</Label>
                    <Select onValueChange={(v) => setValue("category", v)} defaultValue="DIESEL_MODIFIED">
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 h-12 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        {Object.entries(CATEGORIES).map(([key, cat]) => (
                          <SelectItem key={key} value={key}>{cat.name} (₹{cat.fee.toLocaleString()})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Team Name *</Label>
                    <Input {...register("teamName")} placeholder="e.g. Team Karad Offroaders" className="bg-zinc-800 border-zinc-700 text-white" />
                    {errors.teamName && <p className="text-red-500 text-xs">{errors.teamName.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Driver Full Name *</Label>
                      <Input {...register("driverName")} className="bg-zinc-800 border-zinc-700 text-white" />
                      {errors.driverName && <p className="text-red-500 text-xs">{errors.driverName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Driver Mobile Number *</Label>
                      <Input {...register("driverPhone")} placeholder="10-digit number" className="bg-zinc-800 border-zinc-700 text-white" />
                      {errors.driverPhone && <p className="text-red-500 text-xs">{errors.driverPhone.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Driver Blood Group *</Label>
                    <Select onValueChange={(v) => setValue("driverBloodGroup", v)}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        {["A +ve", "A -ve", "B +ve", "B -ve", "O +ve", "O -ve", "AB +ve", "AB -ve"].map(g => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.driverBloodGroup && <p className="text-red-500 text-xs">{errors.driverBloodGroup.message}</p>}
                  </div>

                  <Button 
                    type="button" 
                    onClick={async () => {
                      const isValid = await trigger(["category", "teamName", "driverName", "driverPhone", "driverBloodGroup"]);
                      if (isValid) setStep(2);
                    }} 
                    className="w-full h-12 bg-primary hover:bg-primary/80 text-black font-bold mt-4"
                  >
                    NEXT: CO-DRIVER INFO
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader><CardTitle className="font-heading text-primary">CO-DRIVER & ADDITIONAL INFO</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label>Co-Driver Full Name *</Label>
                       <Input {...register("coDriverName")} className="bg-zinc-800 border-zinc-700 text-white" />
                       {errors.coDriverName && <p className="text-red-500 text-xs">{errors.coDriverName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Co-Driver Mobile Number *</Label>
                      <Input {...register("coDriverPhone")} placeholder="10-digit number" className="bg-zinc-800 border-zinc-700 text-white" />
                      {errors.coDriverPhone && <p className="text-red-500 text-xs">{errors.coDriverPhone.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Co-Driver Blood Group *</Label>
                      <Select onValueChange={(v) => setValue("coDriverBloodGroup", v)}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                          {["A +ve", "A -ve", "B +ve", "B -ve", "O +ve", "O -ve", "AB +ve", "AB -ve"].map(g => (
                            <SelectItem key={g} value={g}>{g}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.coDriverBloodGroup && <p className="text-red-500 text-xs">{errors.coDriverBloodGroup.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address *</Label>
                      <Input {...register("email")} type="email" placeholder="for confirmation" className="bg-zinc-800 border-zinc-700 text-white" />
                      {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <Label>Food Preference (For Driver & Co-Driver) *</Label>
                    <Select onValueChange={(v) => setValue("foodPreference", v)} defaultValue="Both Veg">
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        {["Both Veg", "Both Non-Veg", "One Veg One Non Veg"].map(f => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 border-zinc-700">BACK</Button>
                    <Button 
                      type="button" 
                      onClick={async () => {
                        const isValid = await trigger(["coDriverName", "coDriverPhone", "coDriverBloodGroup", "email", "foodPreference"]);
                        if (isValid) setStep(3);
                      }} 
                      className="flex-2 h-12 bg-primary text-black font-bold"
                    >
                      NEXT: ADDITIONAL DETAILS
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader><CardTitle className="font-heading text-primary">MEDICAL & ATTENDANCE</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Medical Issues (Report in advance or type "NONE") *</Label>
                    <Textarea {...register("medicalIssue")} className="h-24 bg-zinc-800 border-zinc-700 text-white" />
                    {errors.medicalIssue && <p className="text-red-500 text-xs">{errors.medicalIssue.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Total members attending *</Label>
                      <Input {...register("attendanceCount")} type="number" className="bg-zinc-800 border-zinc-700 text-white" />
                      {errors.attendanceCount && <p className="text-red-500 text-xs">{errors.attendanceCount.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Extra Person Names & Details *</Label>
                    <Textarea {...register("extraNames")} placeholder="Names for companion arrangements" className="h-24 bg-zinc-800 border-zinc-700 text-white" />
                    {errors.extraNames && <p className="text-red-500 text-xs">{errors.extraNames.message}</p>}
                  </div>
                  <div className="space-y-4 pt-4">
                    <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                      <Checkbox 
                        id="ageAgreement" 
                        onCheckedChange={(checked) => setValue("ageAgreement", checked)}
                      />
                      <Label htmlFor="ageAgreement" className="text-sm leading-tight cursor-pointer">
                        I agree that both driver and co-driver are of legal driving age and hold a valid drivers license. *
                      </Label>
                    </div>
                    {errors.ageAgreement && <p className="text-red-500 text-xs ml-9">{errors.ageAgreement.message}</p>}

                    <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                      <Checkbox 
                        id="categoryAgreement" 
                        onCheckedChange={(checked) => setValue("categoryAgreement", checked)}
                      />
                      <Label htmlFor="categoryAgreement" className="text-sm leading-tight cursor-pointer">
                        I agree that I've checked all vehicle category specifications and have selected the correct category. *
                      </Label>
                    </div>
                    {errors.categoryAgreement && <p className="text-red-500 text-xs ml-9">{errors.categoryAgreement.message}</p>}
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 h-12 border-zinc-700">BACK</Button>
                    <Button 
                      type="button" 
                      onClick={async () => {
                        const isValid = await trigger(["medicalIssue", "attendanceCount", "extraNames", "ageAgreement", "categoryAgreement"]);
                        if (isValid) setStep(4);
                      }} 
                      className="flex-2 h-12 bg-primary text-black font-bold"
                    >
                      NEXT: PICK CAR NUMBER
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="font-heading text-primary">SELECT YOUR NUMBER</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded text-center">
                    <p className="text-primary font-heading tracking-widest text-sm mb-1 uppercase">Selected Category</p>
                    <p className="text-white text-2xl font-bold font-heading">{CATEGORIES[selectedCategory]?.name}</p>
                  </div>

                  <NumberPicker 
                    category={selectedCategory} 
                    selectedNumber={selectedNumber}
                    onSelect={(n) => setValue("carNumber", n)}
                    takenNumbers={takenNumbers}
                  />

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep(3)} className="flex-1 h-12 border-zinc-700">BACK</Button>
                    <Button 
                      disabled={!selectedNumber || loading} 
                      type="submit" 
                      className="flex-2 h-12 bg-primary text-black font-bold neon-glow active:translate-y-1 transition-all"
                    >
                      {loading ? "PROCESSING..." : "CONFIRM & PAY →"}
                    </Button>
                  </div>
                  {!selectedNumber && <p className="text-center text-zinc-500 text-xs italic">Please select a car number to continue</p>}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
}
