import { NextResponse } from "next/server";
import { getSheetByName, initSheets } from "@/lib/google-sheets/client";
import { CATEGORIES } from "@/config/pricing";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  if (!category) {
    return NextResponse.json({ error: "Category is required" }, { status: 400 });
  }

  try {
    await initSheets();
    const bookedSheet = await getSheetByName("Booked Numbers");
    const regSheet = await getSheetByName("Registrations");
    
    if (!bookedSheet || !regSheet) {
        return NextResponse.json({ booked: [] });
    }

    const [bookedRows, regRows] = await Promise.all([
        bookedSheet.getRows(),
        regSheet.getRows()
    ]);
    
    const now = new Date();

    // Helper for ULTRA-FUZZY category matching
    const normalize = (s) => (s || "").toString().toUpperCase().replace(/[^A-Z0-9]/g, "").trim();
    const targetCatNormalized = normalize(category);
    const targetCatNameNormalized = normalize(CATEGORIES[category]?.name || "");

    // 1. Get numbers from Booked Numbers (Temporary holds)
    const holdNumbers = bookedRows
      .filter((row) => {
        const rowCatNorm = normalize(row.get("category"));
        const isMatch = (rowCatNorm === targetCatNormalized || rowCatNorm === targetCatNameNormalized);
        
        if (!isMatch) return false;
        
        const status = (row.get("status") || "").toUpperCase().trim();
        if (status === "BOOKED") return true;
        
        if (status === "HELD") {
          const expiresAt = new Date(row.get("expires_at"));
          return expiresAt > now;
        }
        
        return false;
      })
      .map((row) => String(row.get("car_number")).trim());

    // 2. Get numbers from Registrations (Finalized/Pending Verification/Confirmed)
    const confirmedNumbers = regRows
      .filter((row) => {
        const rowCatNorm = normalize(row.get("category"));
        const isMatch = (rowCatNorm === targetCatNormalized || rowCatNorm === targetCatNameNormalized);
        
        if (!isMatch) return false;
        
        const status = (row.get("status") || "").toUpperCase().trim();
        return status !== "REJECTED"; 
      })
      .map((row) => String(row.get("car_number")).trim());

    const allTaken = Array.from(new Set([...holdNumbers, ...confirmedNumbers]));
    
    // DEBUG: Final consolidated taken set
    console.log(`[NUMBERS] Category: ${category} (Norm: ${targetCatNormalized}), Found: ${allTaken.length} taken slots: [${allTaken.join(', ')}]`);

    return NextResponse.json(
      { booked: allTaken },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error("Fetch booked numbers error:", error);
    return NextResponse.json({ booked: [] }); // Fallback to empty if sheet not ready
  }
}
