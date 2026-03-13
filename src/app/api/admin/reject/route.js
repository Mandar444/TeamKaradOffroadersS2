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

    const regSheet = await getSheetByName("Registrations");
    const bookedSheet = await getSheetByName("Booked Numbers");

    const regRows = await regSheet.getRows();
    const regRow = regRows.find(r => r.get("reg_id") === regId);

    if (!regRow) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Update status to REJECTED
    regRow.set("status", "REJECTED");
    await regRow.save();

    // Delete from Booked Numbers to release the number
    const bookedRows = await bookedSheet.getRows();
    const bookedRowIndex = bookedRows.findIndex(r => r.get("reg_id") === regId);
    if (bookedRowIndex !== -1) {
      await bookedRows[bookedRowIndex].delete();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reject error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
