const mongoose = require("mongoose");

// Define the sub-schema for individual form items
const FormItemSchema = new mongoose.Schema({
  client: String,
  type: String,
  ironQuality: String,
  Width: String,
  Diameter: { type: Number, default: 0 }, // Set default value for Diameter
  quantity: Number,
  Length: { type: Number, default: 0 }, // Set default value for Length
  Height: { type: Number, default: 0 }, // Set default value for Height
  Weight: Number,
  CuttingPrice: Number
});

const form = mongoose.model("Form", FormItemSchema);

module.exports = form;

