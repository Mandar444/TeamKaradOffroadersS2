import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY
  ? process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n').replace(/\\n/g, '\n').replace(/"/g, '').trim()
  : undefined;
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID; // Optional folder ID
const LEADERBOARD_FILE_NAME = process.env.GOOGLE_LEADERBOARD_FILE_NAME || 'leaderboard-export.json';

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
      supportsAllDrives: true,
    });

    console.log(`[DRIVE] Upload Successful. File ID: ${response.data.id}`);

    // Try to make the file public, but don't fail the whole process if it errors
    try {
      await drive.permissions.create({
          fileId: response.data.id,
          requestBody: {
              role: 'reader',
              type: 'anyone',
          },
          supportsAllDrives: true,
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

async function findDriveFileByName(fileName) {
  const queryParts = [`name = '${fileName.replace(/'/g, "\\'")}'`, 'trashed = false'];
  if (DRIVE_FOLDER_ID) {
    queryParts.unshift(`'${DRIVE_FOLDER_ID}' in parents`);
  }

  const response = await drive.files.list({
    q: queryParts.join(' and '),
    fields: 'files(id, name, modifiedTime)',
    orderBy: 'modifiedTime desc',
    pageSize: 1,
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
  });

  return response.data.files?.[0] || null;
}

export async function upsertJsonToDrive(fileName, jsonContent) {
  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error('Missing Google Drive Credentials in environment.');
  }

  const existingFile = await findDriveFileByName(fileName);
  const media = {
    mimeType: 'application/json',
    body: jsonContent,
  };

  if (existingFile?.id) {
    const response = await drive.files.update({
      fileId: existingFile.id,
      media,
      fields: 'id, webViewLink, webContentLink',
      supportsAllDrives: true,
    });

    try {
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
        supportsAllDrives: true,
      });
    } catch (permError) {
      console.warn('[DRIVE] Warning: Could not update public permissions for leaderboard JSON:', permError.message);
    }

    return response.data;
  }

  const fileMetadata = {
    name: fileName,
    parents: DRIVE_FOLDER_ID ? [DRIVE_FOLDER_ID] : [],
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id, webViewLink, webContentLink',
    supportsAllDrives: true,
  });

  try {
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
      supportsAllDrives: true,
    });
  } catch (permError) {
    console.warn('[DRIVE] Warning: Could not set public permissions for leaderboard JSON:', permError.message);
  }

  return response.data;
}

export async function readJsonFromDrive(fileName = LEADERBOARD_FILE_NAME) {
  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error('Missing Google Drive Credentials in environment.');
  }

  const existingFile = await findDriveFileByName(fileName);

  if (!existingFile?.id) {
    throw new Error('Leaderboard export file not found in Drive.');
  }

  const response = await drive.files.get(
    {
      fileId: existingFile.id,
      alt: 'media',
      supportsAllDrives: true,
    },
    {
      responseType: 'arraybuffer',
    }
  );

  const jsonText =
    typeof response.data === 'string'
      ? response.data
      : Buffer.from(response.data).toString('utf8');

  return JSON.parse(jsonText);
}
