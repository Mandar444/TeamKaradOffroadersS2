import { NextResponse } from "next/server";
import { getSheetByName, initSheets } from "@/lib/google-sheets/client";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initSheets();
    const sheet = await getSheetByName("Registrations");
    const rows = await sheet.getRows();
    
    // Temporary debug: Return ALL registrations to see what is being fetched
    const confirmedTeams = rows
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
        status: row.get("status") || "NONE",
      }));

    console.log(`[TEAMS_API] Total: ${rows.length}, Teams: ${confirmedTeams.length}`);
    if (confirmedTeams.length > 0) {
        console.log(`[TEAMS_API] First team status: ${confirmedTeams[0].status}`);
    }

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
