const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    client: {
      type: String,
    },
    Date: {
      type: Date,
      default: Date.now()
    },
    quantity: Number,
    Weight: Number,
    CuttingPrice: Number,

    form: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form' // Reference to the Form model
      }
    ]

  },
  { timestamps: true }
);

const order = mongoose.model("Order", OrderSchema);

module.exports = order;
