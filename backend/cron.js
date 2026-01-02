const cron = require("node-cron");
const Member = require("./Modals/member");
const sendEmail = require("./utils/mailer");


const runExpiryCheck = async () => {
    console.log("Running expiry check cron job...");
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        const next3Days = new Date();
        next3Days.setDate(today.getDate() + 3);
        next3Days.setHours(23, 59, 59, 999); // End of the 3rd day

        // Find members expiring within the next 3 days (inclusive of today)
        const expiringMembers = await Member.find({
            nextBillDate: {
                $gte: today,
                $lte: next3Days
            }
        });

        console.log(`Found ${expiringMembers.length} members expiring soon.`);

        for (const member of expiringMembers) {
            if (member.email) {
                const subject = "Membership Expiry Reminder";
                const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Hello ${member.name},</h2>
                <p>This is a friendly reminder that your gym membership is set to expire on <strong>${new Date(member.nextBillDate).toLocaleDateString()}</strong>.</p>
                <p>Please renew your membership to continue enjoying our facilities.</p>
                <p>Best regards,<br/>Gym Management Team</p>
            </div>
        `;
                await sendEmail(member.email, subject, html);
            }
        }
        return { message: "Expiry check completed", count: expiringMembers.length };
    } catch (error) {
        console.error("Error in cron job:", error);
        throw error;
    }
};

const runStatusUpdate = async () => {
    console.log("Running status update cron job...");
    try {
        const today = new Date();

        // Update members whose nextBillDate is in the past and are currently Active
        const result = await Member.updateMany(
            {
                status: "Active",
                nextBillDate: { $lt: today }
            },
            {
                $set: { status: "Inactive" }
            }
        );

        console.log(`Updated ${result.modifiedCount} members to Inactive status.`);
        return { message: "Status update completed", modifiedCount: result.modifiedCount };

    } catch (error) {
        console.error("Error in status update cron job:", error);
        throw error;
    }
};

const startCronJobs = () => {
    // Run every day at 9:00 AM
    cron.schedule("0 9 * * *", runExpiryCheck);

    // Run every day at 12:00 AM to check for expired members and set them to Inactive
    cron.schedule("0 0 * * *", runStatusUpdate);
};

module.exports = { startCronJobs, runExpiryCheck, runStatusUpdate };
