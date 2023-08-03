const mongoose = require("mongoose");

const dispenserSchema = new mongoose.Schema({
  flow_volume: {
    type: Number,
    required: true,
  },
  is_open: {
    type: Boolean,
    default: false,
  },
  total_usage_time: {
    type: Number,
    default: 0,
  },
  total_money_made: {
    type: Number,
    default: 0,
  },
});

// Pre-save hook to validate flow_volume field
dispenserSchema.pre("save", function (next) {
  // Check if the flow_volume field is present
  if (!this.flow_volume) {
    const err = new Error("Flow volume is required.");
    return next(err);
  }

  next(); // Call the next middleware (or save the document if no errors)
});

const Dispenser = mongoose.model("Dispenser", dispenserSchema);

module.exports = Dispenser;
