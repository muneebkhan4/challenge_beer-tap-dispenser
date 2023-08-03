const express = require("express");
const connectToDB = require("./connectDB");
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
