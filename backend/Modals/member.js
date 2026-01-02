const mongoose = require("mongoose");

const memberSchema = mongoose.Schema(
  {
    name: {
      type: String,
      reuired: true,
    },
    mobileNo: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    membership: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "membership",
      reuired: true,
    },
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "gym",
      reuired: true,
    },
    profilePic: {
      type: String,
      reuired: true,
    },
    status: {
      type: String,
      default: "Active",
    },
    lastPayment: {
      type: String,
      default: new Date(),
    },
    nextBillDate: {
      type: Date,
      reuired: true,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    slotTiming: {
      type: String,
      default: "Not Set",
    },
  },
  { timestamps: true }
);

const memberModal = mongoose.model("member", memberSchema);

module.exports = memberModal;
