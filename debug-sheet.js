import { getSheetByName, initSheets } from "./src/lib/google-sheets/client.js";

async function checkSheet() {
  await initSheets();
  const sheet = await getSheetByName("Registrations");
  const rows = await sheet.getRows();
  console.log("Total rows in Registrations:", rows.length);
  rows.forEach((row, i) => {
    console.log(`Row ${i} Status:`, row.get("status"));
    console.log(`Row ${i} reg_id:`, row.get("reg_id"));
    console.log(`Row ${i} Raw Values:`, row.toObject());
  });
}

checkSheet();
