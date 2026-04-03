import "dotenv/config";
import { doc, initSheets, REG_HEADERS, BOOKED_HEADERS } from "./src/lib/google-sheets/client.js";

async function forceSyncHeaders() {
  try {
    await initSheets();
    await doc.loadInfo();
    
    console.log("Setting headers for Registrations...");
    const regSheet = doc.sheetsByTitle['Registrations'];
    if (regSheet) {
      await regSheet.setHeaderRow(REG_HEADERS);
      console.log("Registrations headers set successfully.");
    } else {
      console.log("Registrations sheet not found!");
    }

    console.log("Setting headers for Booked Numbers...");
    const bookedSheet = doc.sheetsByTitle['Booked Numbers'];
    if (bookedSheet) {
      await bookedSheet.setHeaderRow(BOOKED_HEADERS);
      console.log("Booked Numbers headers set successfully.");
    } else {
      console.log("Booked Numbers sheet not found!");
    }

    console.log("--- FINAL SYNC COMPLETE ---");
  } catch (err) {
    console.error("SYNC FAILED:", err.message);
  }
}

forceSyncHeaders();
