const express = require("express");
const { Worker } = require("worker_threads");
const Dispenser = require("../models/Dispenser");
const DispenserUsage = require("../models/DispenserUsage");

const router = express.Router();

// Get the count of times a dispenser was used
router.get("/:id/usage_count", async (req, res) => {
  try {
    const dispenserId = req.params.id;

    // Check if the dispenser exists
    const dispenser = await Dispenser.findById(dispenserId).exec();
    if (!dispenser) {
      return res.status(404).json({ message: "Dispenser not found." });
    }

    // Count the occurrences of the dispenser_id in the dispenserUsage collection
    const usageCount = await DispenserUsage.countDocuments({
      dispenser: dispenserId,
    });

    res.json({ usage_count: usageCount });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving dispenser usage count." });
  }
});

// Get the total time a dispenser was used
router.get("/:id/total_usage_time", async (req, res) => {
  try {
    const dispenserId = req.params.id;

    // Check if the dispenser exists
    const dispenser = await Dispenser.findById(dispenserId).exec();
    if (!dispenser) {
      return res.status(404).json({ message: "Dispenser not found." });
    }

    // Find all dispenserUsage documents with the given dispenserId
    const dispenserUsages = await DispenserUsage.find({
      dispenser: dispenserId,
    }).exec();

    // Calculate the total time used for the dispenser
    let totalTimeUsed = 0;
    dispenserUsages.forEach((usage) => {
      if (usage.start_time && usage.end_time) {
        const elapsedTime = (usage.end_time - usage.start_time) / 1000; // Time in seconds
        totalTimeUsed += elapsedTime;
      }
    });

    res.json({ total_usage_time: totalTimeUsed });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving dispenser usage time." });
  }
});

// Get the total money made from a dispenser
router.get("/:id/total_money_made", async (req, res) => {
  try {
    const dispenserId = req.params.id;

    // Check if the dispenser exists
    const dispenser = await Dispenser.findById(dispenserId).exec();
    if (!dispenser) {
      return res.status(404).json({ message: "Dispenser not found." });
    }

    // Find all dispenserUsage documents with the given dispenserId
    const dispenserUsages = await DispenserUsage.find({
      dispenser: dispenserId,
    }).exec();

    // Calculate the total money made for the dispenser
    let totalMoneyMade = 0;
    dispenserUsages.forEach((usage) => {
      totalMoneyMade += usage.money_made;
    });

    res.json({ total_money_made: totalMoneyMade });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving total money made." });
  }
});

// Record dispenser usage
router.post("/", async (req, res) => {
  try {
    const dispenserId = req.body.dispenserId;
    if (!dispenserId) {
      res.status(400).json({ message: "Dispenser ID is required." });
      return;
    }

    const dispenser = await Dispenser.findById(dispenserId);
    if (!dispenser) {
      res.status(404).json({ message: "Dispenser not found." });
      return;
    }

    // Check if dispenser is already in use
    if (dispenser.is_open) {
      res.status(400).json({ message: "Dispenser is already in use." });
      return;
    }

    // Update the dispenser status to open
    await dispenser.updateOne({ is_open: true });

    // Start a worker thread to calculate dispenser usage
    const workerData = {
      dispenserId,
      flowVolume: dispenser.flow_volume,
    };

    const worker = new Worker("./dispenserUsageWorker.js", { workerData });
    res.status(200).json({ message: "Opened" });
  } catch (error) {
    res.status(500).json({ message: "Error recording dispenser usage." });
  }
});

module.exports = router;
