import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY
  ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '')
  : undefined;

const serviceAccountAuth = new JWT({
  email: GOOGLE_CLIENT_EMAIL,
  key: GOOGLE_PRIVATE_KEY,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

export const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

export async function getSheetByName(name) {
  await doc.loadInfo();
  return doc.sheetsByTitle[name];
}

export async function initSheets() {
  await doc.loadInfo();
  
  // Ensure "Registrations" sheet exists and has correct headers
  let regSheet = doc.sheetsByTitle['Registrations'];
  const regHeaders = [
    'reg_id', 'team_name', 'driver_name', 'driver_blood_group', 'driver_phone',
    'codriver_name', 'codriver_blood_group', 'codriver_phone', 'category', 'car_number',
    'vehicle_name', 'vehicle_model', 'food_preference', 'medical_issue', 'attendance_count', 'extra_names',
    'email', 'socials', 'amount_paid', 'utr_number', 'has_screenshot', 'screenshot_link', 'status', 'submitted_at', 'confirmed_at'
  ];

  if (!regSheet) {
    regSheet = await doc.addSheet({
      title: 'Registrations',
      headerValues: regHeaders
    });
  } else {
    await regSheet.setHeaderRow(regHeaders);
  }

  // Ensure "Booked Numbers" sheet exists and has correct headers
  let bookedSheet = doc.sheetsByTitle['Booked Numbers'];
  const bookedHeaders = ['category', 'car_number', 'reg_id', 'status', 'expires_at'];

  if (!bookedSheet) {
    bookedSheet = await doc.addSheet({
      title: 'Booked Numbers',
      headerValues: bookedHeaders
    });
  } else {
    await bookedSheet.setHeaderRow(bookedHeaders);
  }
}
