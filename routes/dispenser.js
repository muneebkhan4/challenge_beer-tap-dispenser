const express = require("express");
const Dispenser = require("../models/Dispenser");

const router = express.Router();

// Create a new dispenser
router.post("/", async (req, res) => {
  try {
    const { flow_volume, is_open, total_usage_time, total_money_made } =
      req.body;

    if (!flow_volume) {
      return res.status(400).json({ message: "Flow volume is required." });
    }

    const dispenser = await Dispenser.create({
      flow_volume,
      is_open: is_open || false,
      total_usage_time: total_usage_time || 0,
      total_money_made: total_money_made || 0,
    });

    res.status(201).json(dispenser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating dispenser.", error: error.message });
  }
});

// Retrieve all dispensers
router.get("/", async (req, res) => {
  try {
    const dispensers = await Dispenser.find();
    res.status(200).json(dispensers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving dispensers.", error: error.message });
  }
});

// Retrieve a specific dispenser by id
router.get("/:id", async (req, res) => {
  try {
    const dispenserId = req.params.id;

    const dispenser = await Dispenser.findById(dispenserId);
    if (!dispenser) {
      return res.status(404).json({ message: "Dispenser not found." });
    }

    res.status(200).json(dispenser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving dispenser.", error: error.message });
  }
});

// Update a specific dispenser by id (change is_open status)
router.patch("/:id", async (req, res) => {
  try {
    const dispenserId = req.params.id;
    const { is_open } = req.body;

    const dispenser = await Dispenser.findById(dispenserId);
    if (!dispenser) {
      return res.status(404).json({ message: "Dispenser not found." });
    }

    if (is_open !== undefined) {
      dispenser.is_open = is_open;
    }

    await dispenser.save();
    res.status(200).json({ message: "Updated dispenser." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating dispenser.", error: error.message });
  }
});

module.exports = router;
