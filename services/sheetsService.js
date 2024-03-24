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

async function updateVote(itemId, userRole) {
  // Use the same authentication setup as accessSheet
  const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  const auth = new google.auth.GoogleAuth({
    credentials: credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1tMPOQFU3qXf6VRI8EyLGWlEQAIq7YxK7CheXloFGGQU";
  const range = "whywhat!A2:E"; // Make sure this range is suitable for your needs

  try {
    // First, get the current data to find the row to update
    const getRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = getRes.data.values || [];
    const rowIndex = rows.findIndex((row) => row[0] === itemId);

    if (rowIndex !== -1) {
      // Assuming the votes are in the 5th column and stored as JSON
      const currentVotes = JSON.parse(rows[rowIndex][4] || "{}");
      currentVotes[userRole] = (currentVotes[userRole] || 0) + 1;

      // Now, write the updated votes back
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `whywhat!E${rowIndex + 2}`, // Adjusting for zero-based index and header row
        valueInputOption: "RAW",
        requestBody: {
          values: [[JSON.stringify(currentVotes)]],
        },
      });
    } else {
      console.log("Item ID not found in the sheet.");
    }
  } catch (error) {
    console.error("Error updating vote in Google Sheets:", error);
    throw error; // Re-throw the error for further handling
  }
}

module.exports = { accessSheet, updateVote };
