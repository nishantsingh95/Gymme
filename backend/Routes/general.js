const express = require("express");
const router = express.Router();
const GeneralController = require("../Controllers/general");
const auth = require("../Auth/auth");

router.post("/add-expense", auth, GeneralController.addExpense);
router.post("/add-outlet", auth, GeneralController.addOutlet);
router.get("/get-expenses", auth, GeneralController.getExpenses);
router.get("/get-outlets", auth, GeneralController.getOutlets);
router.get("/get-dashboard-counts", auth, GeneralController.getDashboardCounts);

router.get("/cron/expiry-check", GeneralController.cronExpiryCheck);
router.get("/cron/status-update", GeneralController.cronStatusUpdate);

module.exports = router;
