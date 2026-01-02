const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config({ quiet: true });

const PORT = process.env.PORT;

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://gymmeee.netlify.app"
      ];
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow any Netlify subdomain (for Deploy Previews)
      if (origin.endsWith(".netlify.app")) {
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) === -1) {
        var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(cookieParser());
app.use(express.json());
require("./DBConn/conn");

const GymRoutes = require("./Routes/gym");
const MembershipRoutes = require("./Routes/membership");
const MemberRoutes = require("./Routes/member");

app.use("/auth", GymRoutes);
app.use("/plans", MembershipRoutes);
app.use("/members", MemberRoutes);
const GeneralRoutes = require("./Routes/general");
app.use("/general", GeneralRoutes);

const AiRoutes = require("./Routes/ai");
app.use("/ai", AiRoutes);

const { startCronJobs } = require("./cron");
startCronJobs();

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log("server is running on PORT 4000");
  });
}

module.exports = app;
