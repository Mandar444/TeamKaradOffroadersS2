import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY
  ? process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n').replace(/\\n/g, '\n').replace(/"/g, '').trim()
  : undefined;
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID; // Optional folder ID
const LEADERBOARD_FILE_NAME = process.env.GOOGLE_LEADERBOARD_FILE_NAME || 'leaderboard-export.json';
const LEADERBOARD_FILE_ID = process.env.GOOGLE_LEADERBOARD_FILE_ID;
const LEADERBOARD_VISIBILITY_FILE_NAME = process.env.GOOGLE_LEADERBOARD_VISIBILITY_FILE_NAME || 'leaderboard-visibility.json';
const LEADERBOARD_VISIBILITY_FILE_ID = process.env.GOOGLE_LEADERBOARD_VISIBILITY_FILE_ID;
const LEGACY_RESET_FILE_NAME = process.env.GOOGLE_LEADERBOARD_RESET_FILE_NAME || 'leaderboard-reset.json';
const RESET_VERSION_PROPERTY = 'liveDataResetVersion';
const RESET_AT_PROPERTY = 'liveDataResetAt';

const auth = new JWT({
  email: GOOGLE_CLIENT_EMAIL,
  key: GOOGLE_PRIVATE_KEY,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

function getConfiguredFileId(fileName) {
  if (fileName === LEADERBOARD_FILE_NAME) {
    return LEADERBOARD_FILE_ID;
  }

  if (fileName === LEADERBOARD_VISIBILITY_FILE_NAME) {
    return LEADERBOARD_VISIBILITY_FILE_ID;
  }

  return null;
}

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

async function listDriveFilesByName(fileName) {
  const queryParts = [`name = '${fileName.replace(/'/g, "\\'")}'`, 'trashed = false'];
  if (DRIVE_FOLDER_ID) {
    queryParts.unshift(`'${DRIVE_FOLDER_ID}' in parents`);
  }

  const files = [];
  let pageToken = null;

  do {
    const response = await drive.files.list({
      q: queryParts.join(' and '),
      fields: 'nextPageToken, files(id, name, modifiedTime, size)',
      orderBy: 'modifiedTime desc',
      pageSize: 1000,
      pageToken: pageToken || undefined,
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    });

    files.push(...(response.data.files || []));
    pageToken = response.data.nextPageToken || null;
  } while (pageToken);

  return files;
}

async function findDriveFileByName(fileName) {
  return (await listDriveFilesByName(fileName))[0] || null;
}

async function getDriveFile(fileName) {
  const configuredFileId = getConfiguredFileId(fileName);
  return configuredFileId ? { id: configuredFileId } : findDriveFileByName(fileName);
}

async function readDriveAppProperties(fileId) {
  const response = await drive.files.get({
    fileId,
    fields: 'appProperties',
    supportsAllDrives: true,
  });

  return response.data.appProperties || {};
}

const getResetProperties = resetMarker =>
  resetMarker
    ? {
        [RESET_VERSION_PROPERTY]: String(resetMarker.version),
        [RESET_AT_PROPERTY]: String(resetMarker.resetAt),
      }
    : null;

export async function readLeaderboardResetMarkerFromDrive() {
  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error('Missing Google Drive Credentials in environment.');
  }

  const existingFile = await getDriveFile(LEADERBOARD_FILE_NAME);

  if (!existingFile?.id) {
    return null;
  }

  const appProperties = await readDriveAppProperties(existingFile.id);
  if (!appProperties[RESET_VERSION_PROPERTY] || !appProperties[RESET_AT_PROPERTY]) {
    return null;
  }

  return {
    version: appProperties[RESET_VERSION_PROPERTY],
    resetAt: appProperties[RESET_AT_PROPERTY],
  };
}

async function deleteRetainedLeaderboardRevisions(fileId) {
  const metadataResponse = await drive.files.get({
    fileId,
    fields: 'headRevisionId',
    supportsAllDrives: true,
  });
  const revisionsResponse = await drive.revisions.list({
    fileId,
    fields: 'revisions(id, keepForever)',
    pageSize: 1000,
  });
  const headRevisionId = metadataResponse.data.headRevisionId;
  const retainedRevisions = (revisionsResponse.data.revisions || []).filter(
    revision => revision.keepForever === true && revision.id !== headRevisionId
  );

  for (const revision of retainedRevisions) {
    await drive.revisions.delete({
      fileId,
      revisionId: revision.id,
    });
  }

  return retainedRevisions.length;
}

export async function clearObsoleteLeaderboardDriveData(activeFileId) {
  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error('Missing Google Drive Credentials in environment.');
  }

  const [exportFiles, legacyResetFiles] = await Promise.all([
    listDriveFilesByName(LEADERBOARD_FILE_NAME),
    listDriveFilesByName(LEGACY_RESET_FILE_NAME),
  ]);
  const filesToDelete = new Map();

  [...exportFiles, ...legacyResetFiles].forEach(file => {
    if (file?.id && file.id !== activeFileId) {
      filesToDelete.set(file.id, file);
    }
  });

  let deletedFiles = 0;
  const warnings = [];
  for (const file of filesToDelete.values()) {
    try {
      await drive.files.delete({
        fileId: file.id,
        supportsAllDrives: true,
      });
      deletedFiles += 1;
    } catch (error) {
      warnings.push(`Unable to delete obsolete file ${file.name || file.id}: ${error.message}`);
    }
  }

  let deletedRevisions = 0;
  if (activeFileId) {
    try {
      deletedRevisions = await deleteRetainedLeaderboardRevisions(activeFileId);
    } catch (error) {
      warnings.push(`Unable to delete retained export revisions: ${error.message}`);
    }
  }

  return {
    deletedFiles,
    deletedRevisions,
    warnings,
  };
}

export async function upsertJsonToDrive(fileName, jsonContent, { resetMarker = null } = {}) {
  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error('Missing Google Drive Credentials in environment.');
  }

  const existingFile = await getDriveFile(fileName);
  const media = {
    mimeType: 'application/json',
    body: jsonContent,
  };
  const resetProperties = getResetProperties(resetMarker);

  if (existingFile?.id) {
    const requestBody = resetProperties
      ? { appProperties: { ...(await readDriveAppProperties(existingFile.id)), ...resetProperties } }
      : undefined;
    const response = await drive.files.update({
      fileId: existingFile.id,
      requestBody,
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
    ...(resetProperties ? { appProperties: resetProperties } : {}),
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

  const existingFile = await getDriveFile(fileName);

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
