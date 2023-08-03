const { parentPort, workerData } = require("worker_threads");

const connectToDB = require("./connectDB");
const Dispenser = require("./models/Dispenser");
const DispenserUsage = require("./models/DispenserUsage");

// Connect to MongoDB
connectToDB();

async function calculateDispenserUsage() {
  const startTime = new Date();
  const dispenserId = workerData.dispenserId;
  const flowVolume = workerData.flowVolume;
  let dispenser = await Dispenser.findById(dispenserId, null, {
    maxTimeMS: 20000, // Set a timeout of 20 seconds (adjust as needed)
  });
  while (dispenser.is_open) {
    dispenser = await Dispenser.findById(dispenserId, null, {
      maxTimeMS: 20000, // Set a timeout of 20 seconds (adjust as needed)
    });
  }
  try {
    const endTime = new Date();
    const elapsedTime = (endTime - startTime) / 1000; // Calculate time elapsed in seconds
    const moneyMade = flowVolume * elapsedTime; // Calculate money made based on flow volume and time elapsed
    DispenserUsage.create({
      dispenser: dispenser,
      start_time: startTime,
      end_time: endTime,
      money_made: moneyMade,
    });
  } catch (error) {
    console.error("Error calculating dispenser usage:", error.message);
    parentPort.postMessage({ error: error.message }); // Post an error message to the parent thread
  }
}

calculateDispenserUsage();
