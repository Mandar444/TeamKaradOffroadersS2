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

    // Make the file publicly viewable (optional, depends on security needs)
    await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
            role: 'reader',
            type: 'anyone',
        }
    });

    return response.data.webViewLink;
  } catch (error) {
    console.error('Drive upload error:', error);
    throw error;
  }
}
