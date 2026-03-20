import { NextResponse } from "next/server";
import { getSheetByName, initSheets } from "@/lib/google-sheets/client";
import { CATEGORIES } from "@/config/pricing";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    await initSheets();
    const regSheet = await getSheetByName("Registrations");
    const bookedSheet = await getSheetByName("Booked Numbers");
    
    let row = null;

    // 1. Search in master Registrations FIRST
    if (regSheet) {
      try {
        const rows = await regSheet.getRows();
        row = rows.find(r => r.get("reg_id") === id);
      } catch (e) {
        console.error("Registrations sheet fetch issue:", e.message);
      }
    }

    // 2. Search in Drafts (Booked Numbers) ONLY if not found in master
    if (!row && bookedSheet) {
      try {
        const rows = await bookedSheet.getRows();
        row = rows.find(r => r.get("reg_id") === id);
      } catch (e) {
        console.error("Booked Numbers sheet fetch issue:", e.message);
      }
    }

    if (!row) {
      // Final attempt: wait 1 second and retry just once in case of write-lag
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Re-fetch to be absolutely certain
      const [rRows, bRows] = await Promise.all([
        regSheet ? regSheet.getRows() : [],
        bookedSheet ? bookedSheet.getRows() : []
      ]);
      row = rRows.find(r => r.get("reg_id") === id) || bRows.find(r => r.get("reg_id") === id);
    }

    if (!row) {
      return NextResponse.json({ error: "Registration details not found. Please try refreshing in 10 seconds." }, { status: 404 });
    }

    const category = row.get("category");
    const amount = CATEGORIES[category]?.fee || row.get("amount_paid") || 0;



    return NextResponse.json({
      id: row.get("reg_id"),
      team_name: row.get("team_name"),
      driver_name: row.get("driver_name"),
      codriver_name: row.get("codriver_name"),
      car_number: row.get("car_number"),
      category: category,
      amount: currentFee,
      status: row.get("status")
    });
    } catch (error) {
    console.error("REGISTRATION DETAILS FETCH ERROR:", {
      message: error.message,
      stack: error.stack,
      id
    });
    return NextResponse.json({ 
      error: `Server Exception: ${error.message || "Unknown error during data parsing"}`, 
      id: id,
      hint: "Check your spreadsheet columns for 'reg_id' and 'category'"
    }, { status: 500 });
  }

}
