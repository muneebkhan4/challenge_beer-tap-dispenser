// Import required modules
const { parentPort, workerData } = require("worker_threads");
const { connectToDB, closeDBConnection } = require("./connectDB");
const Dispenser = require("./models/Dispenser");
const DispenserUsage = require("./models/DispenserUsage");

// Connect to MongoDB
connectToDB();

// Function to calculate dispenser usage
async function calculateDispenserUsage() {
  try {
    const startTime = new Date();
    const dispenserId = workerData.dispenserId;
    const flowVolume = workerData.flowVolume;

    // Wait for the dispenser to close (is_open becomes false) using a Promise
    await waitForDispenserClose(dispenserId);

    // Calculate usage and store in database
    const endTime = new Date();
    const elapsedTime = (endTime - startTime) / 1000; // Calculate time elapsed in seconds
    const moneyMade = flowVolume * elapsedTime; // Calculate money made based on flow volume and time elapsed
    await storeDispenserUsage(dispenserId, startTime, endTime, moneyMade);

    console.log("Dispenser usage calculation completed.");
  } catch (error) {
    console.error("Error calculating dispenser usage:", error.message);
    parentPort.postMessage({ error: error.message }); // Post an error message to the parent thread
  } finally {
    // Close the database connection
    closeDBConnection();
  }
}

// Function to wait for the dispenser to close (is_open becomes false)
function waitForDispenserClose(dispenserId) {
  return new Promise((resolve) => {
    const checkDispenserStatus = async () => {
      const dispenser = await Dispenser.findById(dispenserId);
      if (!dispenser.is_open) {
        resolve();
      } else {
        setTimeout(checkDispenserStatus, 1000); // Check again after 1 second
      }
    };

    checkDispenserStatus();
  });
}

// Function to store dispenser usage in the database
async function storeDispenserUsage(dispenserId, startTime, endTime, moneyMade) {
  await DispenserUsage.create({
    dispenser: dispenserId,
    start_time: startTime,
    end_time: endTime,
    money_made: moneyMade,
  });
}

// Call the main function to calculate dispenser usage
calculateDispenserUsage();
