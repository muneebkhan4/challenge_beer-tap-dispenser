// models/DispenserUsage.js
const mongoose = require("mongoose");

const dispenserUsageSchema = new mongoose.Schema({
  dispenser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dispenser",
  },
  start_time: {
    type: Date,
    default: Date.now,
  },
  end_time: {
    type: Date,
    default: null,
  },
  money_made: {
    type: Number,
    default: 0,
  },
});

const DispenserUsage = mongoose.model("DispenserUsage", dispenserUsageSchema);

module.exports = DispenserUsage;
