import { NextResponse } from "next/server";
import { getSheetByName } from "@/lib/google-sheets/client";

export async function GET() {
  try {
    const sheet = await getSheetByName("Registrations");
    const rows = await sheet.getRows();
    
    // Only return CONFIRMED registrations
    const confirmedTeams = rows
      .filter((row) => row.get("status") === "CONFIRMED")
      .map((row) => ({
        driver_name: row.get("driver_name"),
        codriver_name: row.get("codriver_name"),
        car_number: row.get("car_number"),
        category: row.get("category"),
        car_model: row.get("car_model"),
        modification_type: row.get("modification_type"),
      }));

    // Sort by car number
    confirmedTeams.sort((a, b) => parseInt(a.car_number) - parseInt(b.car_number));

    return NextResponse.json({ teams: confirmedTeams });
  } catch (error) {
    console.error("Teams fetch error:", error);
    return NextResponse.json({ teams: [] });
  }
}
