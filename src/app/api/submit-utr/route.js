import { NextResponse } from "next/server";
import { getSheetByName } from "@/lib/google-sheets/client";
import { uploadToDrive } from "@/lib/google-drive/client";

export async function POST(request) {
  let regId = "UNKNOWN";
  try {
    const formData = await request.formData();
    regId = formData.get("regId");
    const utr = formData.get("utr");
    const screenshot = formData.get("screenshot");

    console.log(`[UTR-SUBMIT] Processing UTR for ${regId}, UTR: ${utr}`);

    if (!regId || !utr) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let screenshotLink = "";
    if (screenshot && screenshot instanceof File) {
      try {
        screenshotLink = await uploadToDrive(screenshot, `screenshot_${regId}_${Date.now()}`);
        console.log(`[UTR-SUBMIT] Screenshot uploaded: ${screenshotLink}`);
      } catch (driveError) {
        console.error("[UTR-SUBMIT] Drive upload failed:", driveError);
      }
    }

    const regSheet = await getSheetByName("Registrations");
    const bookedSheet = await getSheetByName("Booked Numbers");

    if (!regSheet || !bookedSheet) {
      console.error("[UTR-SUBMIT] Sheets missing!");
      return NextResponse.json({ error: "System initialization failed. Sheets missing." }, { status: 500 });
    }

    // Normalized matching helper
    const matchId = (val) => String(val || "").trim().toUpperCase() === String(regId).trim().toUpperCase();

    // 1. Check if already in Master
    const masterRows = await regSheet.getRows();
    let masterRow = masterRows.find(r => matchId(r.get("reg_id")));

    if (!masterRow) {
      console.log(`[UTR-SUBMIT] ${regId} not in Master. Searching in Drafts...`);
      // 2. Search in Drafts (Booked Numbers)
      const draftRows = await bookedSheet.getRows();
      const draft = draftRows.find(r => matchId(r.get("reg_id")));

      if (!draft) {
        console.error(`[UTR-SUBMIT] ${regId} NOT FOUND in Drafts or Master.`);
        return NextResponse.json({ error: "Registration record not found or session expired." }, { status: 404 });
      }

      console.log(`[UTR-SUBMIT] Found ${regId} in Drafts. Moving to Master...`);

      // 3. Move from Draft to Master Registrations in ONE SHOT
      masterRow = await regSheet.addRow({
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
        // Payment info integrated immediately
        utr_number: String(utr).trim(),
        has_screenshot: screenshotLink ? "YES" : (screenshot ? "YES" : "WA_MANUAL"),
        screenshot_link: screenshotLink || "",
        status: "PENDING_VERIFICATION",
      });

      console.log(`[UTR-SUBMIT] Created row in Master for ${regId}`);

      // 4. Update draft status
      try {
        draft.set("status", "BOOKED");
        await draft.save();
        console.log(`[UTR-SUBMIT] Marked draft ${regId} as BOOKED`);
      } catch (draftErr) {
        console.error(`[UTR-SUBMIT] FAILED to mark draft as BOOKED:`, draftErr.message);
        // We don't fail the whole request since it's already in Master
      }
    } else {
      console.log(`[UTR-SUBMIT] ${regId} already in Master. Updating payment info...`);
      // Update existing master row
      masterRow.set("utr_number", String(utr).trim());
      masterRow.set("has_screenshot", screenshotLink ? "YES" : (screenshot ? "YES" : "WA_MANUAL"));
      if (screenshotLink) masterRow.set("screenshot_link", screenshotLink);
      masterRow.set("status", "PENDING_VERIFICATION");
      await masterRow.save();
      console.log(`[UTR-SUBMIT] Master row updated for ${regId}`);
    }

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
