import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSheetByName, initSheets } from "@/lib/google-sheets/client";

export async function POST(request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session || session.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await initSheets();
    const { regId } = await request.json();
    if (!regId) return NextResponse.json({ error: "Missing regId" }, { status: 400 });

    const regSheet = await getSheetByName("Registrations");
    const bookedSheet = await getSheetByName("Booked Numbers");

    const matchId = (val) => String(val || "").trim().toUpperCase() === String(regId).trim().toUpperCase();

    const regRows = await regSheet.getRows();
    let regRow = regRows.find(r => matchId(r.get("reg_id")));

    // If NOT in master, check if it's stuck in Booked Numbers
    if (!regRow) {
      console.log(`[ADMIN-CONFIRM] ${regId} not in Master. Checking Booked Numbers (stuck record recovery)...`);
      const bookedRows = await bookedSheet.getRows();
      const draft = bookedRows.find(r => matchId(r.get("reg_id")));

      if (!draft) {
        return NextResponse.json({ error: "Registration not found in any sheet." }, { status: 404 });
      }

      console.log(`[ADMIN-CONFIRM] Found ${regId} in Booked Numbers. Moving to Master before confirmation...`);
      // Move to Master (equivalent to submit-utr move but initiated by admin)
      regRow = await regSheet.addRow({
        reg_id: draft.get("reg_id"),
        team_name: draft.get("team_name"),
        driver_name: draft.get("driver_name"),
        driver_blood_group: draft.get("driver_blood_group"),
        driver_phone: draft.get("driver_phone"),
        driver_food: draft.get("driver_food"),
        codriver_name: draft.get("codriver_name"),
        codriver_blood_group: draft.get("codriver_blood_group"),
        codriver_phone: draft.get("codriver_phone"),
        codriver_food: draft.get("codriver_food"),
        category: draft.get("category"),
        car_number: draft.get("car_number"),
        vehicle_name: draft.get("vehicle_name"),
        vehicle_model: draft.get("vehicle_model"),
        team_food: draft.get("team_food"),
        food_preference: draft.get("food_preference"),
        medical_issue: draft.get("medical_issue"),
        attendance_count: draft.get("attendance_count"),
        extra_names: draft.get("extra_names"),
        email: draft.get("email"),
        socials: draft.get("socials"),
        amount_paid: draft.get("amount_paid"),
        submitted_at: draft.get("submitted_at") || new Date().toISOString(),
        status: "PENDING_VERIFICATION", // Temporary status before we flip to CONFIRMED
      });
      
      // Update the draft to BOOKED
      draft.set("status", "BOOKED");
      await draft.save();
    }

    // Now definitely have a regRow (either existing or just moved)
    // Update status to CONFIRMED
    regRow.set("status", "CONFIRMED");
    regRow.set("confirmed_at", new Date().toISOString());
    await regRow.save();

    // Ensure Booked Numbers is synced
    const bookedRows = await bookedSheet.getRows();
    const bookedRow = bookedRows.find(r => matchId(r.get("reg_id")));
    if (bookedRow && bookedRow.get("status") !== "BOOKED") {
      bookedRow.set("status", "BOOKED");
      await bookedRow.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Confirm error:", error);
    return NextResponse.json({ error: `Move & Confirm failed: ${error.message}` }, { status: 500 });
  }
}
