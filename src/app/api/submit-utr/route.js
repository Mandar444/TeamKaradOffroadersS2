import { NextResponse } from "next/server";
import { getSheetByName } from "@/lib/google-sheets/client";
import { uploadToDrive } from "@/lib/google-drive/client";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const regId = formData.get("regId");
    const utr = formData.get("utr");
    const screenshot = formData.get("screenshot");

    if (!regId || !utr) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let screenshotLink = "";
    if (screenshot && screenshot instanceof File) {
      try {
        screenshotLink = await uploadToDrive(screenshot, `screenshot_${regId}_${Date.now()}`);
      } catch (driveError) {
        console.error("Drive upload failed:", driveError);
        // We continue anyway so the UTR is at least saved
      }
    }

    const regSheet = await getSheetByName("Registrations");
    const bookedSheet = await getSheetByName("Booked Numbers");

    if (!regSheet || !bookedSheet) {
        return NextResponse.json({ error: "System initialization failed. Sheets missing." }, { status: 500 });
    }

    // 1. Search in master Registrations first (In case of re-submission)
    const masterRows = await regSheet.getRows();
    let row = masterRows.find(r => String(r.get("reg_id") || "").trim() === String(regId).trim());

    if (!row) {
      // 2. Search in Drafts (Booked Numbers)
      const draftRows = await bookedSheet.getRows();
      const draft = draftRows.find(r => String(r.get("reg_id") || "").trim() === String(regId).trim());

      if (!draft) {
        return NextResponse.json({ error: "Registration session expired or not found. Please register again." }, { status: 404 });
      }

      // 3. Move from Draft to Master Registrations
      row = await regSheet.addRow({
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
      });

      // Update draft status to HELD (now backed by a real entry)
      draft.set("status", "BOOKED");
      await draft.save();
    }

    // 4. Finalize UTR update in Master Row
    row.set("utr_number", String(utr).trim());
    row.set("has_screenshot", screenshot ? "YES" : "NO");
    if (screenshotLink) {
      row.set("screenshot_link", screenshotLink);
    } else {
        // Fallback or explicit marker if screenshot wasn't uploaded via Drive (now manually via WA)
        row.set("has_screenshot", "WA_MANUAL");
    }
    row.set("status", "PENDING_VERIFICATION");

    await row.save();
    console.log("MASTER SHEET RECORD UPDATED:", regId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("UTR SUBMISSION ERROR:", {
       message: error.message,
       stack: error.stack,
       regId: regId
    });
    return NextResponse.json({ 
      error: "Final submission failed", 
      details: error.message 
    }, { status: 500 });
  }
}
