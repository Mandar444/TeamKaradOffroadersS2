import { NextResponse } from "next/server";
import { getSheetByName, initSheets } from "@/lib/google-sheets/client";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    await initSheets();
    const sheet = await getSheetByName("Registrations");
    const rows = await sheet.getRows();
    const row = rows.find(r => r.get("reg_id") === id);

    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      id: row.get("reg_id"),
      team_name: row.get("team_name"),
      driver_name: row.get("driver_name"),
      codriver_name: row.get("codriver_name"),
      car_number: row.get("car_number"),
      category: row.get("category"),
      amount: row.get("amount_paid"),
      status: row.get("status")
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
