import { NextResponse } from "next/server";
import { getSheetByName, initSheets } from "@/lib/google-sheets/client";
import { CATEGORIES } from "@/config/pricing";
// Registration logic without uuid dependency

export async function POST(request) {
  try {
    const data = await request.json();
    await initSheets();

    const regId = `REG-${Date.now()}`;
    const amount = CATEGORIES[data.category]?.fee || 0;

    const regSheet = await getSheetByName("Registrations");
    const bookedSheet = await getSheetByName("Booked Numbers");

    // 1. Check if number is already taken
    const existingRows = await bookedSheet.getRows();
    const isTaken = existingRows.some(row => 
      row.get("category") === data.category && 
      String(row.get("car_number")) === String(data.carNumber)
    );

    if (isTaken) {
      return NextResponse.json({ error: "Car number already taken in this category" }, { status: 400 });
    }

    // 2. Add to Registrations
    await regSheet.addRow({
      reg_id: regId,
      team_name: data.teamName,
      driver_name: data.driverName,
      driver_blood_group: data.driverBloodGroup,
      driver_phone: data.driverPhone,
      codriver_name: data.coDriverName,
      codriver_blood_group: data.coDriverBloodGroup,
      codriver_phone: data.coDriverPhone,
      category: data.category,
      car_number: data.carNumber,
      food_preference: data.foodPreference,
      medical_issue: data.medicalIssue,
      attendance_count: data.attendanceCount,
      extra_names: data.extraNames,
      email: data.email,
      amount_paid: amount,
      utr_number: "", 
      status: "PENDING",
      submitted_at: new Date().toISOString(),
    });

    // 3. Temporarily hold the number
    await bookedSheet.addRow({
      category: data.category,
      car_number: data.carNumber,
      reg_id: regId,
      status: "HELD",
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });

    return NextResponse.json({ success: true, id: regId });

  } catch (error) {
    console.error("FULL REGISTRATION ERROR:", {
      message: error.message,
      stack: error.stack,
      data: error.response?.data
    });
    return NextResponse.json({ 
      error: "Failed to save registration", 
      details: error.message 
    }, { status: 500 });
  }
}
