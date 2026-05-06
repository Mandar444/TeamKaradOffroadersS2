import { NextResponse } from "next/server";
import { getSheetByName, initSheets } from "@/lib/google-sheets/client";
import { CATEGORIES } from "@/config/pricing";

export const dynamic = 'force-dynamic';

function normalizeValue(value) {
  return String(value ?? "").trim().toLowerCase();
}

function buildTeamId(team) {
  return [
    normalizeValue(team.category),
    normalizeValue(team.car_number),
  ].join("|");
}

export async function GET() {
  try {
    await initSheets();
    const sheet = await getSheetByName("Registrations");
    const rows = await sheet.getRows();
    
    // Categorization Helper
    const normalize = (s) => (s || "").toString().toUpperCase().replace(/[^A-Z0-9]/g, "").trim();
    const catMap = {};
    Object.keys(CATEGORIES).forEach(key => {
      catMap[normalize(key)] = key;
      catMap[normalize(CATEGORIES[key].name)] = key;
    });

    // Filter: Show only Authorized teams with explicit UTR (Payment Evidence)
    const confirmedTeams = rows
      .filter((row) => {
        const s = (row.get("status") || "").trim().toUpperCase();
        const utr = (row.get("utr_number") || "").trim();
        const isVerified = (s === "CONFIRMED" || s === "AUTHORIZED GRID" || s === "AUTHORIZED");
        
        // Strict Mode: Must be verified AND have a UTR tracked
        return isVerified && utr !== "";
      })
      .map((row) => {
        const rawCat = row.get("category");
        const canonicalCat = catMap[normalize(rawCat)] || rawCat;
        
        return {
          team_name: row.get("team_name"),
          driver_name: row.get("driver_name"),
          driver_blood_group: row.get("driver_blood_group"),
          codriver_name: row.get("codriver_name"),
          codriver_blood_group: row.get("codriver_blood_group"),
          car_number: row.get("car_number"),
          category: canonicalCat,
          vehicle_name: row.get("vehicle_name"),
          vehicle_model: row.get("vehicle_model"),
          socials: row.get("socials"),
          status: "CONFIRMED", 
        };
      });

    const uniqueTeams = [];
    const seenIds = new Set();

    for (const team of confirmedTeams) {
      const recordId = buildTeamId(team);
      if (seenIds.has(recordId)) {
        continue;
      }

      seenIds.add(recordId);
      uniqueTeams.push({
        ...team,
        recordId,
      });
    }

    // Robust Sort: Handle car numbers with letters (e.g., 'S7')
    uniqueTeams.sort((a, b) => {
      const categoryA = normalizeValue(a.category);
      const categoryB = normalizeValue(b.category);
      if (categoryA !== categoryB) {
        return categoryA.localeCompare(categoryB);
      }

      const numA = parseInt(String(a.car_number).replace(/[^0-9]/g, "")) || 0;
      const numB = parseInt(String(b.car_number).replace(/[^0-9]/g, "")) || 0;
      return numA - numB;
    });

    return NextResponse.json({ teams: uniqueTeams });
  } catch (error) {
    console.error("Teams fetch error:", error);
    return NextResponse.json({ teams: [] });
  }
}
