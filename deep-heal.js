import "dotenv/config";
import { getSheetByName, initSheets } from "./src/lib/google-sheets/client.js";
import { CATEGORY_PREFIXES } from "./src/config/pricing.js";

async function deepHeal() {
  try {
    await initSheets();
    const regSheet = await getSheetByName("Registrations");
    const rows = await regSheet.getRows();

    console.log(`Analyzing ${rows.length} rows for deep alignment fix...`);

    for (const row of rows) {
        const raw = row.toObject();
        const regId = row.get("reg_id");
        
        // Characteristic of the shift: category is empty, but codriver_phone contains a category name
        const possibleCat = (row.get("codriver_phone") || "").toUpperCase();
        const isMessedUp = !row.get("category") && CATEGORY_PREFIXES[possibleCat];

        if (isMessedUp) {
            console.log(`Deep fixing shifted row: ${regId} (${row.get("team_name")})`);
            
            // Shift start index: 5 (header: driver_food)
            // Header 5: driver_food      -> contains: real codriver_name
            // Header 6: codriver_name    -> contains: real codriver_blood_group
            // Header 7: codriver_blood_group -> contains: real codriver_phone
            // Header 8: codriver_phone   -> contains: real category
            // Header 9: codriver_food    -> contains: real car_number
            // Header 10: category        -> contains: real vehicle_name
            // Header 11: car_number      -> contains: real vehicle_model
            // Header 12: vehicle_name    -> contains: real team_food
            // Header 13: vehicle_model   -> contains: real food_preference
            // Header 14: team_food       -> contains: real medical_issue
            // Header 15: food_preference -> contains: real attendance_count
            // Header 16: medical_issue   -> contains: real extra_names
            // Header 17: attendance_count-> contains: real email
            // Header 18: extra_names     -> contains: real socials
            // Header 19: email           -> contains: real amount_paid
            // Header 20: socials         -> contains: real utr_number
            // Header 22: utr_number      -> contains: real status
            
            const real_codriver_name = row.get("driver_food");
            const real_codriver_blood = row.get("codriver_name");
            const real_codriver_phone = row.get("codriver_blood_group");
            const real_category = row.get("codriver_phone");
            const real_car_number = row.get("codriver_food");
            const real_vehicle_name = row.get("category");
            const real_vehicle_model = row.get("car_number");
            const real_team_food = row.get("vehicle_name");
            const real_food_pref = row.get("vehicle_model");
            const real_medical = row.get("team_food");
            const real_extra = row.get("food_preference");
            const real_email = row.get("medical_issue");
            const real_socials = row.get("extra_names"); // Assuming shifted
            const real_utr = row.get("email");
            const real_status = (row.get("socials") || "").toUpperCase().includes("CONFIRM") ? "CONFIRMED" : "PENDING_VERIFICATION";

            // Apply fixes
            row.set("codriver_name", real_codriver_name);
            row.set("codriver_blood_group", real_codriver_blood);
            row.set("codriver_phone", real_codriver_phone);
            row.set("category", real_category);
            row.set("car_number", real_car_number);
            row.set("vehicle_name", real_vehicle_name);
            row.set("vehicle_model", real_vehicle_model);
            row.set("team_food", real_team_food);
            row.set("food_preference", real_food_pref);
            row.set("medical_issue", real_medical);
            row.set("extra_names", real_extra);
            row.set("email", real_email);
            row.set("socials", real_socials);
            row.set("status", real_status);
            
            // Fix status specifically for the ones we know
            if (row.get("utr_number") === "MANUAL_FIX" || (row.get("utr_number") || "").toUpperCase() === "CONFIRMED") {
                 row.set("status", "CONFIRMED");
            }

            // Restore UTR if it shifted into email
            if (real_utr && real_utr.length > 5 && !real_utr.includes("@")) {
                row.set("utr_number", real_utr);
            }
            
            await row.save();
        }
    }

    console.log("Deep heal complete.");
  } catch (err) {
    console.error("Deep heal failed:", err.message);
  }
}

deepHeal();
