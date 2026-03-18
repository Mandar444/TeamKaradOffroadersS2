import { NextResponse } from "next/server";
import { getSheetByName, initSheets } from "@/lib/google-sheets/client";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initSheets();
    const sheet = await getSheetByName("Registrations");
    const rows = await sheet.getRows();
    
    // Return only CONFIRMED registrations for public Grid Lineup
    const confirmedTeams = rows
      .filter((row) => (row.get("status") || "").trim() === "CONFIRMED")
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
        status: row.get("status") || "CONFIRMED",
      }));

    // Sort by car number
    confirmedTeams.sort((a, b) => parseInt(a.car_number) - parseInt(b.car_number));

    return NextResponse.json({ teams: confirmedTeams });
  } catch (error) {
    console.error("Teams fetch error:", error);
    return NextResponse.json({ teams: [] });
  }
}
