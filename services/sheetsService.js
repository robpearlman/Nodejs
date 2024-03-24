const { google } = require("googleapis");
const sheets = google.sheets("v4");

async function accessSheet() {
  // Parse the credentials from the environment variable
  const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

  const auth = new google.auth.GoogleAuth({
    credentials: credentials, // Use the parsed credentials directly
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const client = await auth.getClient();

  const res = await sheets.spreadsheets.values.get({
    auth: client,
    spreadsheetId: "1tMPOQFU3qXf6VRI8EyLGWlEQAIq7YxK7CheXloFGGQU",
    range: "whywhat!A1:E", // Adjust range accordingly
  });

  const rows = res.data.values;
  if (rows.length) {
    console.log("Data:", rows);
    return rows; // Return the rows here
  } else {
    console.log("No data found.");
    return []; // Return an empty array or some indication that no data was found
  }
}
// the following is basically a debugging line and will execute immediately as the app is opened
// accessSheet().catch(console.error);

module.exports = { accessSheet };
