const cron = require("node-cron");
const Member = require("./Modals/member");
const sendEmail = require("./utils/mailer");


const runExpiryCheck = async () => {
    console.log("🔍 Running expiry check cron job...");
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

        console.log(`📊 Found ${expiringMembers.length} members expiring within 3 days.`);

        let emailsSent = 0;
        for (const member of expiringMembers) {
            console.log(`   Processing: ${member.name} (${member.email}) - Expires: ${new Date(member.nextBillDate).toLocaleDateString()}`);
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
                emailsSent++;
            } else {
                console.log(`   ⚠️  Skipped: ${member.name} (no email address)`);
            }
        }
        console.log(`✅ Expiry check completed. Emails sent: ${emailsSent}/${expiringMembers.length}`);
        return { message: "Expiry check completed", count: expiringMembers.length, emailsSent };
    } catch (error) {
        console.error("❌ Error in cron job:", error);
        throw error;
    }
};

const runStatusUpdate = async () => {
    console.log("🔄 Running status update cron job...");
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

        console.log(`✅ Updated ${result.modifiedCount} members to Inactive status.`);
        return { message: "Status update completed", modifiedCount: result.modifiedCount };

    } catch (error) {
        console.error("❌ Error in status update cron job:", error);
        throw error;
    }
};

const runExpiredMembersReminder = async () => {
    console.log("📬 Running expired members reminder cron job...");
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find members whose membership has already expired
        const expiredMembers = await Member.find({
            status: "Inactive",
            nextBillDate: { $lt: today }
        });

        console.log(`📊 Found ${expiredMembers.length} members with expired memberships.`);

        let emailsSent = 0;
        for (const member of expiredMembers) {
            const daysExpired = Math.floor((today - new Date(member.nextBillDate)) / (1000 * 60 * 60 * 24));
            console.log(`   Processing: ${member.name} (${member.email}) - Expired ${daysExpired} days ago`);

            if (member.email) {
                const subject = "Membership Expired - Renewal Required";
                const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #d32f2f;">Membership Expired</h2>
                <p>Hello <strong>${member.name}</strong>,</p>
                <p>Your gym membership expired on <strong>${new Date(member.nextBillDate).toLocaleDateString()}</strong> (${daysExpired} day${daysExpired > 1 ? 's' : ''} ago).</p>
                <p style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
                    <strong>⚠️ Action Required:</strong> Please renew your membership to continue enjoying our gym facilities and services.
                </p>
                <p>To renew your membership, please contact us or visit the gym at your earliest convenience.</p>
                <p style="margin-top: 30px;">Best regards,<br/><strong>Gym Management Team</strong></p>
            </div>
        `;
                await sendEmail(member.email, subject, html);
                emailsSent++;
            } else {
                console.log(`   ⚠️  Skipped: ${member.name} (no email address)`);
            }
        }
        console.log(`✅ Expired members reminder completed. Emails sent: ${emailsSent}/${expiredMembers.length}`);
        return { message: "Expired members reminder completed", count: expiredMembers.length, emailsSent };
    } catch (error) {
        console.error("❌ Error in expired members reminder cron job:", error);
        throw error;
    }
};

const startCronJobs = () => {
    // Run every day at 9:00 AM - Check for memberships expiring within 3 days
    cron.schedule("0 9 * * *", runExpiryCheck);

    // Run every day at 10:00 AM - Send reminders for already expired memberships
    cron.schedule("0 10 * * *", runExpiredMembersReminder);

    // Run every day at 12:00 AM to check for expired members and set them to Inactive
    cron.schedule("0 0 * * *", runStatusUpdate);

    console.log("✅ Cron jobs scheduled:");
    console.log("   - 9:00 AM: Expiry check (3 days before)");
    console.log("   - 10:00 AM: Expired members reminder");
    console.log("   - 12:00 AM: Status update (Active → Inactive)");
};

module.exports = { startCronJobs, runExpiryCheck, runStatusUpdate, runExpiredMembersReminder };
