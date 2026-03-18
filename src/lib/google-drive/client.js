import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY
  ? process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n').replace(/\\n/g, '\n').replace(/"/g, '').trim()
  : undefined;
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID; // Optional folder ID

const auth = new JWT({
  email: GOOGLE_CLIENT_EMAIL,
  key: GOOGLE_PRIVATE_KEY,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

export async function uploadToDrive(file, fileName) {
  try {
    console.log(`[DRIVE] Initializing upload for: ${fileName}`);
    console.log(`[DRIVE] Using Folder ID: ${DRIVE_FOLDER_ID || 'ROOT (NONE PROVIDED)'}`);
    
    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      throw new Error("Missing Google Drive Credentials in environment.");
    }

    const fileMetadata = {
      name: fileName,
      parents: DRIVE_FOLDER_ID ? [DRIVE_FOLDER_ID] : [],
    };

    const media = {
      mimeType: file.type,
      body: Buffer.from(await file.arrayBuffer()),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink',
    });

    console.log(`[DRIVE] Upload Successful. File ID: ${response.data.id}`);

    // Try to make the file public, but don't fail the whole process if it errors
    try {
      await drive.permissions.create({
          fileId: response.data.id,
          requestBody: {
              role: 'reader',
              type: 'anyone',
          }
      });
      console.log(`[DRIVE] Permissions updated for: ${response.data.id}`);
    } catch (permError) {
      console.warn(`[DRIVE] Warning: Could not set public permissions (this may be normal for some restricted folders):`, permError.message);
    }

    return response.data.webViewLink;
  } catch (error) {
    console.error('[DRIVE] CRITICAL UPLOAD ERROR:', {
      message: error.message,
      folderId: DRIVE_FOLDER_ID,
      stack: error.stack
    });
    throw error;
  }
}
