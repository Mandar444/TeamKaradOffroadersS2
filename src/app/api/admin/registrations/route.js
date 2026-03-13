import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSheetByName, initSheets } from "@/lib/google-sheets/client";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session || session.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await initSheets();
    const sheet = await getSheetByName("Registrations");
    const rows = await sheet.getRows();
    
    const registrations = rows.map(row => ({
      reg_id: row.get("reg_id"),
      team_name: row.get("team_name"),
      driver_name: row.get("driver_name"),
      driver_blood_group: row.get("driver_blood_group"),
      driver_phone: row.get("driver_phone"),
      codriver_name: row.get("codriver_name"),
      codriver_blood_group: row.get("codriver_blood_group"),
      codriver_phone: row.get("codriver_phone"),
      category: row.get("category"),
      car_number: row.get("car_number"),
      vehicle_name: row.get("vehicle_name"),
      vehicle_model: row.get("vehicle_model"),
      amount_paid: row.get("amount_paid"),
      utr_number: row.get("utr_number"),
      socials: row.get("socials"),
      screenshot_link: row.get("screenshot_link"),
      status: row.get("status"),
      submitted_at: row.get("submitted_at"),
    }));

    // Sort: Pending first, then by date
    registrations.sort((a, b) => {
      if (a.status.includes("PENDING") && !b.status.includes("PENDING")) return -1;
      if (!a.status.includes("PENDING") && b.status.includes("PENDING")) return 1;
      return new Date(b.submitted_at) - new Date(a.submitted_at);
    });

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error("Fetch reg error:", error);
    return NextResponse.json({ registrations: [] });
  }
}
