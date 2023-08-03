const express = require("express");
const { connectToDB, closeDBConnection } = require("./connectDB");
const dispenserRoutes = require("./routes/dispenser");
const dispenserUsageRoutes = require("./routes/dispenserUsage");

const app = express();

app.use(express.json()); // To parse the incoming requests with JSON payloads

// Connect to MongoDB
connectToDB();

// Use dispenser and dispenser usage routes
app.use("/dispensers", dispenserRoutes);
app.use("/dispenser_usage", dispenserUsageRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Gracefully close the MongoDB connection when the server is terminated
process.on("SIGINT", async () => {
  try {
    await closeDBConnection();
    console.log("Server and MongoDB connection terminated.");
    process.exit(0);
  } catch (error) {
    console.error("Error closing MongoDB connection:", error.message);
    process.exit(1);
  }
});

module.exports = app;
