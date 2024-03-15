const mongoose = require("mongoose");

const TypeSchema = new mongoose.Schema(
  {
    Name: String,
  }
);

const type = mongoose.model("Type", TypeSchema);

module.exports = type;
