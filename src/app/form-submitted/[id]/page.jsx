"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function LegacyRedirect() {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    // If they land here, the record is already in DB from the old flow.
    // Send them directly to the payment page to prevent 404s.
    router.push(`/payment/${id}`);
  }, [id, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-zinc-500 font-heading tracking-widest uppercase animate-pulse">
          Synchronizing Grid Manifest...
        </p>
      </div>
    </div>
  );
}
