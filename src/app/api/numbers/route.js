import { NextResponse } from "next/server";
import { getSheetByName, initSheets } from "@/lib/google-sheets/client";

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

    // 1. Get numbers from Booked Numbers (Temporary holds)
    const holdNumbers = bookedRows
      .filter((row) => {
        if (row.get("category") !== category) return false;
        
        const status = row.get("status");
        if (status === "BOOKED") return true;
        
        if (status === "HELD") {
          const expiresAt = new Date(row.get("expires_at"));
          return expiresAt > now;
        }
        
        return false;
      })
      .map((row) => String(row.get("car_number")));

    // 2. Get numbers from Registrations (Finalized/Pending Verification/Confirmed)
    // IMPORTANT: Even PENDING_VERIFICATION entries should block the number!
    const confirmedNumbers = regRows
      .filter((row) => {
        if (row.get("category") !== category) return false;
        
        const status = row.get("status");
        // We block the number if it's confirmed, pending verification, or even rejected (until manual cleanup)
        return status !== "REJECTED"; 
      })
      .map((row) => String(row.get("car_number")));

    // Combine and unique
    const allTaken = Array.from(new Set([...holdNumbers, ...confirmedNumbers]));

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
