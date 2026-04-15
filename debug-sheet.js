import "dotenv/config";
import { getSheetByName, initSheets, REG_HEADERS } from "./src/lib/google-sheets/client.js";

async function checkSheet() {
  try {
    await initSheets();
    const sheet = await getSheetByName("Registrations");
    console.log("Headers in sheet (Registrations):", sheet.headerValues);
    
    // Testing write permission
    console.log("Attempting to add a test row...");
    const testRow = await sheet.addRow({
      reg_id: "TEST-WRITE",
      team_name: "DEBUG TEST",
      submitted_at: new Date().toISOString()
    });
    console.log("Successfully added test row. ID:", testRow.get("reg_id"));
    
    // Cleaning up the test row
    console.log("Deleting test row...");
    await testRow.delete();
    console.log("Successfully deleted test row.");

    const rows = await sheet.getRows();
    console.log("Total rows in Registrations:", rows.length);
  } catch (err) {
    console.error("Debug failed:", err.message);
    if (err.response) {
       console.error("Response data:", err.response.data);
    }
  }
}

checkSheet();
