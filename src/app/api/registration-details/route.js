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
    
    const [regRows, bookedRows] = await Promise.all([
      regSheet.getRows(),
      bookedSheet.getRows()
    ]);

    // Search Master first, then Drafts
    let row = regRows.find(r => r.get("reg_id") === id);
    if (!row) {
      row = bookedRows.find(r => r.get("reg_id") === id);
    }

    if (!row) {
      return NextResponse.json({ error: "Registration Record Not Found" }, { status: 404 });
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
    return NextResponse.json({ error: "Failed to fetch registration details", details: error.message }, { status: 500 });
  }
}
