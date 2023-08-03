const mongoose = require("mongoose");

// Shared MongoDB connection instance
let dbConnection;

// Function to connect to MongoDB
const connectToDB = async () => {
  try {
    if (!dbConnection) {
      dbConnection = await mongoose.connect(
        "mongodb://localhost:27017/beer_dispenser_db",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

// Function to close the database connection
const closeDBConnection = async () => {
  try {
    if (dbConnection) {
      await mongoose.disconnect();
    }
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error.message);
  }
};

module.exports = {
  connectToDB,
  closeDBConnection,
};
