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

function applyPublishedTeamCorrection(team) {
  const isRaviBhallaDieselModifiedEntry =
    normalizeValue(team.team_name) === "sahyadri offroaders" &&
    normalizeValue(team.driver_name) === "ravi bhalla" &&
    team.category === "DIESEL_MODIFIED" &&
    String(team.car_number).trim() === "1";

  if (!isRaviBhallaDieselModifiedEntry) {
    return team;
  }

  return {
    ...team,
    category: "STOCK_NDMS",
    car_number: "10",
  };
}

const PUBLISHED_TEAM_ENTRIES = [
  {
    team_name: "Crossovver",
    driver_name: "Jayesh Makhija",
    driver_blood_group: "O-ve",
    codriver_name: "Rahul Ahuja",
    codriver_blood_group: "B+ve",
    car_number: "416",
    category: "DIESEL_EXPERT",
    vehicle_name: "Mahindra",
    vehicle_model: "Bolero Diesel Expert",
    socials: "",
    status: "CONFIRMED",
  },
  {
    team_name: "PMW",
    driver_name: "Mahesh Birmane",
    driver_blood_group: "",
    codriver_name: "***",
    codriver_blood_group: "",
    car_number: "6",
    category: "STOCK_NDMS",
    vehicle_name: "",
    vehicle_model: "Stock NDMS",
    socials: "",
    status: "CONFIRMED",
  },
];

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

    // Show verified/authorized participants. Some confirmed rows may not have
    // a UTR in the public sheet columns, so status is the source of truth here.
    const confirmedTeams = rows
      .filter((row) => {
        const s = (row.get("status") || "").trim().toUpperCase();
        return ["CONFIRMED", "AUTHORIZED GRID", "AUTHORIZED", "FINALIZED"].includes(s);
      })
      .map((row) => {
        const rawCat = row.get("category");
        const canonicalCat = catMap[normalize(rawCat)] || rawCat;
        
        return applyPublishedTeamCorrection({
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
        });
      });

    const uniqueTeams = [];
    const seenIds = new Set();

    for (const team of [...confirmedTeams, ...PUBLISHED_TEAM_ENTRIES]) {
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
    return NextResponse.json({
      teams: PUBLISHED_TEAM_ENTRIES.map(team => ({
        ...team,
        recordId: buildTeamId(team),
      })),
    });
  }
}
