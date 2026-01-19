const express = require("express");
const router = express.Router();
const MemberController = require("../Controllers/member");
const auth = require("../Auth/auth");

router.get("/all-member", auth, MemberController.getAllMember);
router.post("/register-member", auth, MemberController.registerMember);

router.get("/searched-members", auth, MemberController.searchMember);
router.get("/monthly-member", auth, MemberController.monthlyMember);
router.get(
  "/within-3-days-expiring",
  auth,
  MemberController.expiringWithin3Days
);
router.get(
  "/within-4-7-days-expiring",
  auth,
  MemberController.expiringWithIn4To7Days
);
router.get("/expired-member", auth, MemberController.expiredMember);
router.get("/inactive-member", auth, MemberController.inActiveMember);

router.get("/get-member/:id", auth, MemberController.getMemberDetails);
router.post("/change-status/:id", auth, MemberController.changeStatus);
router.put("/update-member-plan/:id", auth, MemberController.updateMemberPlan);
router.delete("/delete-member/:id", auth, MemberController.deleteMember);

// Test endpoints for email functionality
const { runExpiryCheck, runExpiredMembersReminder, runStatusUpdate } = require("../cron");

router.post("/test-expiry-emails", auth, async (req, res) => {
  try {
    const result = await runExpiryCheck();
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/test-expired-emails", auth, async (req, res) => {
  try {
    const result = await runExpiredMembersReminder();
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/test-status-update", auth, async (req, res) => {
  try {
    const result = await runStatusUpdate();
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
