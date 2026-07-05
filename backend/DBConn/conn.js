const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.DATABASE) {
    throw new Error("DATABASE environment variable is not defined");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  console.log("Awaiting DB connection...");
  await mongoose.connect(process.env.DATABASE, {
    serverSelectionTimeoutMS: 5000
  });
};

// Start connection on load
if (process.env.DATABASE) {
  mongoose.connect(process.env.DATABASE, {
    serverSelectionTimeoutMS: 5000
  }).then(() => {
    console.log("DB Connection successful on startup");
  }).catch((err) => {
    console.error("DB Connection failed on startup:", err.message);
  });
} else {
  console.warn("DATABASE environment variable is missing on startup");
}

module.exports = connectDB;
