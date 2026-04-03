import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

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

export let doc = null;
let serviceAccountAuth = null;
let isInitialized = false;
let initPromise = null;

export async function getSheetByName(name) {
  await initSheets();
  return doc.sheetsByTitle[name];
}

export async function initSheets() {
  if (isInitialized) return;
  
  if (initPromise) {
    await initPromise;
    return;
  }

  initPromise = (async () => {
    try {
      console.log("[SHEETS] Initializing Master Synchronization Link...");
      
      const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
      const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
      let GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

      if (!SPREADSHEET_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
        throw new Error("Missing Google Sheets environment variables (ID, Email, or Private Key)");
      }

      // Handle både literal newlines and escaped \n sequences
      GOOGLE_PRIVATE_KEY = GOOGLE_PRIVATE_KEY
        .replace(/\\n/g, '\n')     // Convert literal \n to newlines
        .replace(/"/g, '')         // Remove wrapping quotes if present
        .trim();

      if (!serviceAccountAuth) {
        serviceAccountAuth = new JWT({
          email: GOOGLE_CLIENT_EMAIL,
          key: GOOGLE_PRIVATE_KEY,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
      }

      if (!doc) {
        doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
      }

      await doc.loadInfo();
      
      // Ensure "Registrations" sheet exists
      let regSheet = doc.sheetsByTitle['Registrations'];
      if (!regSheet) {
        console.log("[SHEETS] 'Registrations' missing. Initializing schema...");
        regSheet = await doc.addSheet({
          title: 'Registrations',
          headerValues: REG_HEADERS,
          gridProperties: { columnCount: 35, rowCount: 2000 }
        });
      } else {
        if ((regSheet.gridProperties?.columnCount || 0) < 35) {
          console.log("[SHEETS] Resizing 'Registrations' grid...");
          await regSheet.updateProperties({ gridProperties: { columnCount: 35 } });
        }
        await regSheet.loadHeaderRow();
        const currentHeaders = regSheet.headerValues || [];
        const missingHeaders = REG_HEADERS.filter(h => !currentHeaders.includes(h));
        
        if (missingHeaders.length > 0) {
           console.log(`[SHEETS] Appending ${missingHeaders.length} missing headers to 'Registrations'...`);
           await regSheet.setHeaderRow([...currentHeaders, ...missingHeaders]);
        }
      }

      // Ensure "Booked Numbers" sheet exists
      let bookedSheet = doc.sheetsByTitle['Booked Numbers'];
      if (!bookedSheet) {
        console.log("[SHEETS] 'Booked Numbers' missing. Initializing schema...");
        bookedSheet = await doc.addSheet({
          title: 'Booked Numbers',
          headerValues: BOOKED_HEADERS,
          gridProperties: { columnCount: 35, rowCount: 2000 }
        });
      } else {
        if ((bookedSheet.gridProperties?.columnCount || 0) < 35) {
          console.log("[SHEETS] Resizing 'Booked Numbers' grid...");
          await bookedSheet.updateProperties({ gridProperties: { columnCount: 35 } });
        }
        await bookedSheet.loadHeaderRow();
        const currentHeaders = bookedSheet.headerValues || [];
        const missingHeaders = BOOKED_HEADERS.filter(h => !currentHeaders.includes(h));
        
        if (missingHeaders.length > 0) {
           console.log(`[SHEETS] Appending ${missingHeaders.length} missing headers to 'Booked Numbers'...`);
           await bookedSheet.setHeaderRow([...currentHeaders, ...missingHeaders]);
        }
      }

      isInitialized = true;
      console.log("[SHEETS] Core systems synchronized.");
    } catch (error) {
      console.error("[SHEETS] CRITICAL INITIALIZATION ERROR:", {
        message: error.message,
        stack: error.stack
      });
      throw error;
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}
