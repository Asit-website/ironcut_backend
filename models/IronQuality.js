const mongoose = require("mongoose");

const IronQualitySchema = new mongoose.Schema(
    {
        Name: String,
        CuttingPrice: Number,
    }
);

const IronQuality = mongoose.model("IronQuality", IronQualitySchema);

module.exports = IronQuality;
