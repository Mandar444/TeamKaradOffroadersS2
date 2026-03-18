import { NextResponse } from "next/server";
import { getSheetByName, initSheets } from "@/lib/google-sheets/client";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  if (!category) {
    return NextResponse.json({ error: "Category is required" }, { status: 400 });
  }

  try {
    await initSheets();
    const sheet = await getSheetByName("Booked Numbers");
    const rows = await sheet.getRows();
    
    const now = new Date();
    const bookedNumbers = rows
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

    return NextResponse.json({ numbers: bookedNumbers });
  } catch (error) {
    console.error("Fetch booked numbers error:", error);
    return NextResponse.json({ numbers: [] }); // Fallback to empty if sheet not ready
  }
}
