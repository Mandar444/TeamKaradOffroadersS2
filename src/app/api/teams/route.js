import { NextResponse } from "next/server";
import { getSheetByName, initSheets } from "@/lib/google-sheets/client";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initSheets();
    const sheet = await getSheetByName("Registrations");
    const rows = await sheet.getRows();
    
    // Filter: Show only Authorized teams with explicit UTR (Payment Evidence)
    const confirmedTeams = rows
      .filter((row) => {
        const s = (row.get("status") || "").trim().toUpperCase();
        const utr = (row.get("utr_number") || "").trim();
        const isVerified = (s === "CONFIRMED" || s === "AUTHORIZED GRID" || s === "AUTHORIZED");
        
        // Strict Mode: Must be verified AND have a UTR tracked
        return isVerified && utr !== "";
      })
      .map((row) => ({
        team_name: row.get("team_name"),
        driver_name: row.get("driver_name"),
        driver_blood_group: row.get("driver_blood_group"),
        codriver_name: row.get("codriver_name"),
        codriver_blood_group: row.get("codriver_blood_group"),
        car_number: row.get("car_number"),
        category: row.get("category"),
        vehicle_name: row.get("vehicle_name"),
        vehicle_model: row.get("vehicle_model"),
        socials: row.get("socials"),
        status: "CONFIRMED", 
      }));

    // Robust Sort: Handle car numbers with letters (e.g., 'S7')
    confirmedTeams.sort((a, b) => {
      const numA = parseInt(String(a.car_number).replace(/[^0-9]/g, "")) || 0;
      const numB = parseInt(String(b.car_number).replace(/[^0-9]/g, "")) || 0;
      return numA - numB;
    });

    return NextResponse.json({ teams: confirmedTeams });
  } catch (error) {
    console.error("Teams fetch error:", error);
    return NextResponse.json({ teams: [] });
  }
}
