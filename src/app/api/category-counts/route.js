import { NextResponse } from "next/server";
import { getSheetByName, initSheets } from "@/lib/google-sheets/client";
import { CATEGORIES, MAX_CAR_NUMBER } from "@/config/pricing";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await initSheets();
    const regSheet = await getSheetByName("Registrations");
    const bookedSheet = await getSheetByName("Booked Numbers");

    const [regRows, bookedRows] = await Promise.all([
      regSheet.getRows(),
      bookedSheet.getRows()
    ]);
    
    const counts = {};
    Object.keys(CATEGORIES).forEach(cat => counts[cat] = 0);
    
    const now = new Date();
    const normalize = (s) => (s || "").toString().toUpperCase().replace(/[^A-Z0-9]/g, "").trim();
    
    // Create a mapping from normalized category names/keys to the canonical keys
    const catMap = {};
    Object.keys(CATEGORIES).forEach(key => {
      catMap[normalize(key)] = key;
      catMap[normalize(CATEGORIES[key].name)] = key;
    });

    // Track processed IDs to avoid double counting
    const processedIds = new Set();

    // 1. Count from Master Registrations (PRIORITY)
    regRows.forEach(row => {
      const id = normalize(row.get("reg_id"));
      const rawCat = row.get("category");
      const cat = catMap[normalize(rawCat)];
      const status = (row.get("status") || "").toUpperCase().trim();
      
      if (id && cat && counts[cat] !== undefined && status !== "REJECTED") {
        counts[cat]++;
        processedIds.add(id);
      }
    });

    // 2. Count from Booked Numbers (Holds) ONLY if not already in master
    bookedRows.forEach(row => {
      const id = normalize(row.get("reg_id"));
      const rawCat = row.get("category");
      const cat = catMap[normalize(rawCat)];
      const status = (row.get("status") || "").toUpperCase().trim();
      
      if (!id || processedIds.has(id)) return;

      let shouldCount = false;
      if (status === "BOOKED") {
        shouldCount = true;
      } else if (status === "HELD") {
        const expiresAt = new Date(row.get("expires_at"));
        if (expiresAt > now) shouldCount = true;
      }

      if (shouldCount && cat && counts[cat] !== undefined) {
        counts[cat]++;
        processedIds.add(id);
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
