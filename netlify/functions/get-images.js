// We need to install the official Google APIs client library for Node.js
// Command: npm install googleapis
const { google } = require('googleapis');

// --- Configuration ---
// This maps the collection name from your URL (e.g., ?collection=drifting)
// to the public Google Drive Folder ID.
const galleries = {
  drifting: '15BWMbzXgPMlBVpGb0Z_hfQDltWB9jfB7',
  views: '1-8pFF8RwmKjyMiVYY7HN2mGjsZo_wxz2',
  moments: '1coi2heKaadrM2gOamg2ZcZmo54ffhmvo',
  people: '1BHPma5tlqxdM_JMrKzi88yZKcTb4Id1l'
};

// This is the main function that will be executed.
exports.handler = async function(event) {
    
  // Get the secret API key from environment variables (set in your deployment platform)
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  // Get which collection we're looking for from the request URL
  const collectionName = event.queryStringParameters.collection;
  const folderId = galleries[collectionName];

  if (!folderId) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Gallery not found.' }),
    };
  }
  
  try {
    // Initialize the Google Drive API client
    const drive = google.drive({
      version: 'v3',
      auth: apiKey,
    });

    // Fetch the list of files from the specified folder
    const response = await drive.files.list({
      q: `'${folderId}' in parents and (mimeType='image/jpeg' or mimeType='image/png')`,
      fields: 'files(id, name)', // We only need the ID and name now
      orderBy: 'createdTime',
    });
    
    // Format the data to match the structure our front-end expects
    const formattedImages = response.data.files.map(file => ({
      id: file.id,
      name: file.name,
      url: `https://drive.google.com/uc?export=view&id=${file.id}`, 
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(formattedImages),
    };

  } catch (error) {
    console.error('Error fetching from Google Drive:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch images.' }),
    };
  }
};