const mongoose = require("mongoose");

const gymSchema = mongoose.Schema(
  {
    email: {
      type: String,
      reuired: true,
    },
    userName: {
      type: String,
      reuired: true,
    },
    password: {
      type: String,
      reuired: true,
    },
    profilePic: {
      type: String,
      reuired: true,
    },
    gymName: {
      type: String,
      reuired: true,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

const modal = mongoose.model("gym", gymSchema);

module.exports = modal;
