import "dotenv/config";
import { getSheetByName, initSheets, REG_HEADERS } from "./src/lib/google-sheets/client.js";

async function checkSheet() {
  try {
    await initSheets();
    const sheet = await getSheetByName("Registrations");
    console.log("Headers in sheet (Registrations):", sheet.headerValues);
    console.log("Expected headers:", REG_HEADERS);
    const rows = await sheet.getRows();
    console.log("Total rows in Registrations:", rows.length);
    if (rows.length > 0) {
       console.log("Row 0 keys:", Object.keys(rows[0].toObject()));
       console.log("Row 0 data:", rows[0].toObject());
    }
  } catch (err) {
    console.error("Debug failed:", err.message);
  }
}

checkSheet();
