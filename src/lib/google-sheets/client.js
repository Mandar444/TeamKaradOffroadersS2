import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY
  ? process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n').replace(/\\n/g, '\n').replace(/"/g, '').trim()
  : undefined;

const serviceAccountAuth = new JWT({
  email: GOOGLE_CLIENT_EMAIL,
  key: GOOGLE_PRIVATE_KEY,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

export const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

let isInitialized = false;

export async function getSheetByName(name) {
  if (!isInitialized) {
    await initSheets();
  }
  return doc.sheetsByTitle[name];
}

export async function initSheets() {
  if (isInitialized) return;
  
  try {
    console.log("[SHEETS] Initializing Master Synchronization Link...");
    await doc.loadInfo();
    
    // Ensure "Registrations" sheet exists
    let regSheet = doc.sheetsByTitle['Registrations'];
    const regHeaders = [
      'reg_id', 'team_name', 'driver_name', 'driver_blood_group', 'driver_phone', 'driver_food',
      'codriver_name', 'codriver_blood_group', 'codriver_phone', 'codriver_food', 
      'category', 'car_number', 'vehicle_name', 'vehicle_model', 'team_food', 'food_preference', 'medical_issue',
      'attendance_count', 'extra_names', 'email', 'socials', 'amount_paid', 'utr_number', 'has_screenshot', 'screenshot_link', 'status', 'submitted_at', 'confirmed_at'
    ];

    if (!regSheet) {
      console.log("[SHEETS] Manifest missing. Initializing 'Registrations' schema...");
      regSheet = await doc.addSheet({
        title: 'Registrations',
        headerValues: regHeaders
      });
    } else {
      // Ensure all headers exist even if sheet was previously created
      await regSheet.loadHeaderRow();
      const currentHeaders = regSheet.headerValues;
      const missingHeaders = regHeaders.filter(h => !currentHeaders.includes(h));
      
      if (missingHeaders.length > 0) {
        console.log("[SHEETS] Syncing headers for 'Registrations'...");
        // This is a bit tricky with the library, usually best to just update all headers
        await regSheet.setHeaderRow(regHeaders);
      }
    }

    // Ensure "Booked Numbers" sheet exists
    let bookedSheet = doc.sheetsByTitle['Booked Numbers'];
    const bookedHeaders = [
      'reg_id', 'category', 'car_number', 'status', 'expires_at', 
      'team_name', 'driver_name', 'driver_blood_group', 'driver_phone', 'driver_food',
      'codriver_name', 'codriver_blood_group', 'codriver_phone', 'codriver_food',
      'vehicle_name', 'vehicle_model', 'team_food', 'food_preference', 'medical_issue',
      'attendance_count', 'extra_names', 'email', 'socials', 'amount_paid', 'submitted_at'
    ];

    if (!bookedSheet) {
      console.log("[SHEETS] Number manifest missing. Initializing 'Booked Numbers' schema...");
      bookedSheet = await doc.addSheet({
        title: 'Booked Numbers',
        headerValues: bookedHeaders
      });
    } else {
      await bookedSheet.loadHeaderRow();
      const currentHeaders = bookedSheet.headerValues;
      const missingHeaders = bookedHeaders.filter(h => !currentHeaders.includes(h));
      if (missingHeaders.length > 0) {
        await bookedSheet.setHeaderRow(bookedHeaders);
      }
    }

    isInitialized = true;
    console.log("[SHEETS] Core systems synchronized.");
  } catch (error) {
    console.error("[SHEETS] CRITICAL INITIALIZATION ERROR:", {
       message: error.message,
       code: error.code,
       details: error.response?.data
    });
    throw error;
  }
}
