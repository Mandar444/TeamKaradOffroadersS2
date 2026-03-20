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

export const REG_HEADERS = [
  'reg_id', 'team_name', 'driver_name', 'driver_blood_group', 'driver_phone', 'driver_food',
  'codriver_name', 'codriver_blood_group', 'codriver_phone', 'codriver_food', 
  'category', 'car_number', 'vehicle_name', 'vehicle_model', 'team_food', 'food_preference', 'medical_issue',
  'attendance_count', 'extra_names', 'email', 'socials', 'amount_paid', 'utr_number', 'has_screenshot', 'screenshot_link', 'status', 'submitted_at', 'confirmed_at'
];

export const BOOKED_HEADERS = [
  'reg_id', 'category', 'car_number', 'status', 'expires_at', 
  'team_name', 'driver_name', 'driver_blood_group', 'driver_phone', 'driver_food',
  'codriver_name', 'codriver_blood_group', 'codriver_phone', 'codriver_food',
  'vehicle_name', 'vehicle_model', 'team_food', 'food_preference', 'medical_issue',
  'attendance_count', 'extra_names', 'email', 'socials', 'amount_paid', 'submitted_at'
];

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
    if (!regSheet) {
      console.log("[SHEETS] 'Registrations' missing. Initializing schema...");
      regSheet = await doc.addSheet({
        title: 'Registrations',
        headerValues: REG_HEADERS
      });
    } else {
      await regSheet.loadHeaderRow();
    }

    // Ensure "Booked Numbers" sheet exists
    let bookedSheet = doc.sheetsByTitle['Booked Numbers'];
    if (!bookedSheet) {
      console.log("[SHEETS] 'Booked Numbers' missing. Initializing schema...");
      bookedSheet = await doc.addSheet({
        title: 'Booked Numbers',
        headerValues: BOOKED_HEADERS
      });
    } else {
      await bookedSheet.loadHeaderRow();
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
