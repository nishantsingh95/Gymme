const mongoose = require("mongoose");
console.log("Attempting to connect to DB...");
mongoose
  .connect(process.env.DATABASE, {
    serverSelectionTimeoutMS: 5000 // Fail after 5 seconds if not connected
  })
  .then(() => console.log("DB connection successfull"))
  .catch((err) => {
    console.log("DB Connection Failed:");
    console.log(err);
  });
