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

    // Update status to CONFIRMED
    regRow.set("status", "CONFIRMED");
    regRow.set("confirmed_at", new Date().toISOString());
    await regRow.save();

    // Update Booked Numbers status to BOOKED (locks it)
    const bookedRows = await bookedSheet.getRows();
    const bookedRow = bookedRows.find(r => r.get("reg_id") === regId);
    if (bookedRow) {
      bookedRow.set("status", "BOOKED");
      await bookedRow.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Confirm error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
