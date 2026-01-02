const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
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

const expenseModel = mongoose.model("expense", expenseSchema);

module.exports = expenseModel;
