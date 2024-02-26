const mongoose = require("mongoose");

const IronQualitySchema = new mongoose.Schema(
    {
        Name: String,
    }
);

const IronQuality = mongoose.model("IronQuality", IronQualitySchema);

module.exports = IronQuality;
