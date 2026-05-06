import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSheetByName, initSheets } from "@/lib/google-sheets/client";
import { CATEGORIES } from "@/config/pricing";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session || session.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await initSheets();
    const regSheet = await getSheetByName("Registrations");
    const bookedSheet = await getSheetByName("Booked Numbers");
    
    // Categorization Helper
    const normalize = (s) => (s || "").toString().toUpperCase().replace(/[^A-Z0-9]/g, "").trim();
    const catMap = {};
    Object.keys(CATEGORIES).forEach(key => {
      catMap[normalize(key)] = key;
      catMap[normalize(CATEGORIES[key].name)] = key;
    });

    const [regRows, bookedRows] = await Promise.all([
      regSheet.getRows(),
      bookedSheet.getRows()
    ]);
    
    // 1. Process Master Registrations
    const masterRegistrations = regRows
      .filter(row => row.get("status") !== "PENDING" && row.get("status") !== "")
      .map(row => {
        let displayStatus = row.get("status");
        if (displayStatus === "PENDING_UTR") displayStatus = "AWAITING_PAYMENT";
        
        const rawCat = row.get("category");
        const canonicalCat = catMap[normalize(rawCat)] || rawCat;

        return {
          reg_id: row.get("reg_id"),
        team_name: row.get("team_name"),
        driver_name: row.get("driver_name"),
        driver_blood_group: row.get("driver_blood_group"),
        driver_phone: row.get("driver_phone"),
        codriver_name: row.get("codriver_name"),
        codriver_blood_group: row.get("codriver_blood_group"),
        codriver_phone: row.get("codriver_phone"),
        category: canonicalCat,
        car_number: row.get("car_number"),
        vehicle_name: row.get("vehicle_name"),
        vehicle_model: row.get("vehicle_model"),
        amount_paid: row.get("amount_paid"),
        utr_number: row.get("utr_number"),
        socials: row.get("socials"),
        screenshot_link: row.get("screenshot_link"),
        status: displayStatus,
        submitted_at: row.get("submitted_at") || new Date().toISOString(),
      };
    });

    const masterIds = new Set(masterRegistrations.map(r => String(r.reg_id).trim().toUpperCase()));

    // 2. Process "Stuck" or In-Progress entries from Booked Numbers
    const draftRegistrations = bookedRows
      .filter(row => {
        const id = String(row.get("reg_id") || "").trim().toUpperCase();
        return row.get("status") === "HELD" && !masterIds.has(id);
      })
      .map(row => {
        const rawCat = row.get("category");
        const canonicalCat = catMap[normalize(rawCat)] || rawCat;
        
        return {
          reg_id: row.get("reg_id"),
          team_name: row.get("team_name"),
          driver_name: row.get("driver_name"),
          driver_blood_group: row.get("driver_blood_group"),
          driver_phone: row.get("driver_phone"),
          codriver_name: row.get("codriver_name"),
          codriver_blood_group: row.get("codriver_blood_group"),
          codriver_phone: row.get("codriver_phone"),
          category: canonicalCat,
          car_number: row.get("car_number"),
          vehicle_name: row.get("vehicle_name"),
          vehicle_model: row.get("vehicle_model"),
          amount_paid: row.get("amount_paid"),
          utr_number: "IN_PAYMENT_GATE", // Special marker
          socials: row.get("socials"),
          screenshot_link: null,
          status: "STUCK_IN_DRAFT", // Admin can now see this
          submitted_at: row.get("submitted_at") || new Date().toISOString(),
        };
      });

    const registrations = [...masterRegistrations, ...draftRegistrations];

    // Sort: Pending/Stuck first, then by date
    registrations.sort((a, b) => {
      const isAWaiting = a.status.includes("PENDING") || a.status === "STUCK_IN_DRAFT" || a.status === "AWAITING_PAYMENT";
      const isBWaiting = b.status.includes("PENDING") || b.status === "STUCK_IN_DRAFT" || b.status === "AWAITING_PAYMENT";
      if (isAWaiting && !isBWaiting) return -1;
      if (!isAWaiting && isBWaiting) return 1;
      return new Date(b.submitted_at) - new Date(a.submitted_at);
    });

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error("Fetch reg error:", error);
    return NextResponse.json({ registrations: [] });
  }
}
