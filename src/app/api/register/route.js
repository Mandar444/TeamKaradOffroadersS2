import { NextResponse } from "next/server";
import { getSheetByName, initSheets } from "@/lib/google-sheets/client";
import { CATEGORIES } from "@/config/pricing";
// Registration logic without uuid dependency

export async function POST(request) {
  try {
    const data = await request.json();
    await initSheets();

    const amount = CATEGORIES[data.category]?.fee || 0;

    const bookedSheet = await getSheetByName("Booked Numbers");
    const regSheet = await getSheetByName("Registrations");
    
    if (!bookedSheet || !regSheet) {
        return NextResponse.json({ error: "Storage error. Please try again." }, { status: 500 });
    }

    const [bookedRows, regRows] = await Promise.all([
        bookedSheet.getRows(),
        regSheet.getRows()
    ]);
    
    const now = new Date();

    // Helper for robust category matching
    const normalize = (s) => (s || "").toString().toUpperCase().replace(/[^A-Z0-9]/g, "").trim();
    const targetCatNormalized = normalize(data.category);
    const targetCatNameNormalized = normalize(CATEGORIES[data.category]?.name || "");
    const targetNum = String(data.carNumber).trim();

    // 1. Check master Registrations first
    const isTakenInMaster = regRows.some(row => {
        const rowCatNorm = normalize(row.get("category"));
        const rowNum = String(row.get("car_number")).trim();
        const rowStatus = (row.get("status") || "").toUpperCase().trim();

        // Match if either the key (PETROL_EXPERT) or name (Petrol Expert) matches normalized
        const isMatch = (rowCatNorm === targetCatNormalized || rowCatNorm === targetCatNameNormalized);
        if (!isMatch) return false;
        if (rowNum !== targetNum) return false;
        
        return rowStatus !== "REJECTED";
    });

    if (isTakenInMaster) {
        return NextResponse.json({ error: "This sticker number has already been finalized by another team." }, { status: 400 });
    }

    // 2. Check temporary holds
    const isTakenInHolds = bookedRows.some(row => {
      const rowCatNorm = normalize(row.get("category"));
      const rowNum = String(row.get("car_number")).trim();

      const isMatch = (rowCatNorm === targetCatNormalized || rowCatNorm === targetCatNameNormalized);
      if (!isMatch) return false;
      if (rowNum !== targetNum) return false;
      
      const status = (row.get("status") || "").toUpperCase().trim();
      if (status === "BOOKED") return true; 
      if (status === "HELD") {
        const expiresAt = new Date(row.get("expires_at"));
        return expiresAt > now;
      }
      return false;
    });

    if (isTakenInHolds) {
      return NextResponse.json({ error: "Number is currently being held or already booked by someone else." }, { status: 400 });
    }



    const regId = `REG-${Date.now().toString().slice(-8)}`;
    const submissionData = {
      reg_id: regId,
      category: data.category,
      car_number: data.carNumber,
      status: "HELD",
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      team_name: data.teamName,
      driver_name: data.driverName,
      driver_blood_group: data.driverBloodGroup,
      driver_phone: data.driverPhone,
      driver_food: data.driverFood,
      codriver_name: data.coDriverName,
      codriver_blood_group: data.coDriverBloodGroup,
      codriver_phone: data.coDriverPhone,
      codriver_food: data.coDriverFood,
      vehicle_name: data.vehicleName || "",
      vehicle_model: data.vehicleModel || "",
      team_food: data.teamFood || "",
      food_preference: `${data.driverFood} (D), ${data.coDriverFood} (CD), ${data.teamFood || 'No extra'} (T)`,
      medical_issue: data.medicalIssue,
      attendance_count: data.attendanceCount,
      extra_names: data.extraNames || "",
      email: data.email,
      socials: data.socials || "",
      amount_paid: amount,
      submitted_at: new Date().toISOString(),
    };

    // Add to BOTH sheets initially as requested by user
    await Promise.all([
      bookedSheet.addRow(submissionData),
      regSheet.addRow({
        ...submissionData,
        status: "PENDING_UTR" // Distinguish in main sheet that UTR is missing
      })
    ]);

    return NextResponse.json({ success: true, id: regId });

  } catch (error) {
    console.error("FULL REGISTRATION ERROR:", {
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json({ 
      error: `Failed to save registration: ${error.message || "Unknown error"}`, 
    }, { status: 500 });
  }

}
