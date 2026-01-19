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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);

app.use(cookieParser());
app.use(express.json());
require("./DBConn/conn");

const GymRoutes = require("./Routes/gym");
const MembershipRoutes = require("./Routes/membership");
const MemberRoutes = require("./Routes/member");

const router = express.Router();
router.use("/auth", GymRoutes);
router.use("/plans", MembershipRoutes);
router.use("/members", MemberRoutes);
const GeneralRoutes = require("./Routes/general");
router.use("/general", GeneralRoutes);

const AiRoutes = require("./Routes/ai");
router.use("/ai", AiRoutes);

app.use("/.netlify/functions/api", router);
app.use("/", router);

const { startCronJobs } = require("./cron");

// Only start cron jobs in development (not in Netlify Functions)
// In production, Netlify Scheduled Functions handle this
if (process.env.NODE_ENV !== 'production') {
  startCronJobs();
}

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log("server is running on PORT 4000");
  });
}

module.exports = app;
