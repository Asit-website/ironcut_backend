const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: String,
    Date: {
      type: Date,
      default: Date.now()
    },
    ironQuality: {
      type: String,
    },
    quantity: Number,
    Length: String,
    Height: String,
    Width: String,
    Weight: String,
    CuttingPrice: Number,
  },
  { timestamps: true }
);

const order = mongoose.model("Order", OrderSchema);

module.exports = order;
