const mongoose = require("mongoose");

// Function to connect to MongoDB
const connectToDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/beer_dispenser_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

module.exports = connectToDB;
