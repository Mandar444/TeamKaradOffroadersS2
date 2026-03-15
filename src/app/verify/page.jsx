"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";

export default function VerifyRootPage() {
  const router = useRouter();

  useEffect(() => {
    // If someone visits /verify without a car number, send them to the teams lineup
    // instead of showing a blank page or error
    router.replace("/teams");
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <div className="flex flex-col items-center gap-4">
        <ShieldAlert className="w-12 h-12 text-primary animate-pulse" />
        <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Accessing Marshal Console...</p>
      </div>
    </div>
  );
}
