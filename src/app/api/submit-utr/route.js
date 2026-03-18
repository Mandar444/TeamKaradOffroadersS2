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

    const sheet = await getSheetByName("Registrations");
    if (!sheet) {
        return NextResponse.json({ error: "Registrations sheet not found. Ensure headers are initialized." }, { status: 500 });
    }

    const rows = await sheet.getRows();
    const row = rows.find(r => {
      const sid = String(r.get("reg_id") || "").trim();
      const tid = String(regId).trim();
      return sid === tid;
    });

    if (!row) {
      console.error("ROW NOT FOUND FOR ID:", regId, "AVAILABLE IDS:", rows.slice(0, 5).map(r => r.get("reg_id")));
      return NextResponse.json({ error: "Registration reference not found in database" }, { status: 404 });
    }

    // Use multiple methods to ensure update in different versions of lib
    const updateData = {
      utr_number: String(utr).trim(),
      has_screenshot: screenshot ? "YES" : "NO",
      screenshot_link: screenshotLink || row.get("screenshot_link") || "",
      status: "PENDING_VERIFICATION"
    };

    row.assign(updateData);
    await row.save();
    console.log("SHEET UPDATE SUCCESSFUL:", regId);

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
