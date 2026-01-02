const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config({ quiet: true });

const PORT = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:3000", //react url
    credentials: true,
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
