const express = require("express");
const { accessSheet, updateVote } = require("./services/sheetsService");
const app = express();
const path = require("path");

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.json());

// Place your API routes before the catchall handler
app.get("/api/data", async (req, res) => {
  try {
    const data = await accessSheet(); // Assuming this is your function to fetch data from Sheets
    res.json(data);
  } catch (error) {
    console.error("Failed to fetch data from Google Sheets:", error);
    res.status(500).send("Failed to fetch data");
  }
});

app.get("/api/test-sheets", async (req, res) => {
  try {
    const data = await accessSheet(); // Call your function
    res.json(data); // Send back the data as JSON
  } catch (error) {
    console.error("Error accessing Google Sheets:", error);
    res.status(500).send("Error accessing Google Sheets");
  }
});

app.post('/api/vote', async (req, res) => {
  const { itemId, userRole } = req.body;
  console.log(`Received vote for item ${itemId} from user role ${userRole}`);
  try {
    await updateVote(itemId, userRole);
    res.status(200).json({ message: "Vote successfully updated" });
  } catch (error) {
    console.error("Failed to update vote:", error);
    res.status(500).send("Failed to update vote");
  }
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
