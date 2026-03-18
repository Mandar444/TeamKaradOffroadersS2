import { NextResponse } from "next/server";
import { getSheetByName, initSheets } from "@/lib/google-sheets/client";
import { CATEGORIES, MAX_CAR_NUMBER } from "@/config/pricing";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initSheets();
    const sheet = await getSheetByName("Registrations");
    const rows = await sheet.getRows();
    
    const counts = {};
    // Initialize with 0
    Object.keys(CATEGORIES).forEach(cat => counts[cat] = 0);
    
    // Count ONLY confirmed or pending verification entries in each category
    rows.forEach(row => {
      const cat = row.get("category");
      const status = row.get("status");
      if (counts[cat] !== undefined && (status === "CONFIRMED" || status === "PENDING_VERIFICATION")) {
        counts[cat]++;
      }
    });

    return NextResponse.json({ 
      counts,
      limit: MAX_CAR_NUMBER 
    });
  } catch (error) {
    console.error("Counts fetch error:", error);
    return NextResponse.json({ counts: {}, limit: MAX_CAR_NUMBER });
  }
}
