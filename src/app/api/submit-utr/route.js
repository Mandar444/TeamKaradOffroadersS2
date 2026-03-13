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
    const rows = await sheet.getRows();
    const row = rows.find(r => r.get("reg_id") === regId);

    if (!row) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    row.set("utr_number", utr);
    row.set("has_screenshot", screenshot ? "YES" : "NO");
    if (screenshotLink) {
        row.set("screenshot_link", screenshotLink);
    }
    row.set("status", "PENDING_VERIFICATION");
    await row.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("UTR submission error:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
