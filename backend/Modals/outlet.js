const mongoose = require("mongoose");

const outletSchema = mongoose.Schema(
    {
        location: {
            type: String,
            required: true,
        },
        gym: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "gym",
            required: true,
        },
    },
    { timestamps: true }
);

const outletModel = mongoose.model("outlet", outletSchema);

module.exports = outletModel;
