const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

// Member Schema
const memberSchema = new mongoose.Schema({
    name: String,
    email: String,
    nextBillDate: Date,
    status: String,
});

const Member = mongoose.models.Member || mongoose.model("Member", memberSchema);

// Email transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

const sendEmail = async (to, subject, html) => {
    const transporter = createTransporter();
    try {
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            html,
        });
        console.log(`📧 Email sent successfully to ${to}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to send email to ${to}:`, error.message);
        return false;
    }
};

// Connect to database
const connectDB = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.DATABASE, {
            serverSelectionTimeoutMS: 5000
        });
    }
};

exports.handler = async (event, context) => {
    console.log("🔍 Scheduled: Expiry check starting...");

    try {
        await connectDB();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const next3Days = new Date();
        next3Days.setDate(today.getDate() + 3);
        next3Days.setHours(23, 59, 59, 999);

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
                const sent = await sendEmail(member.email, subject, html);
                if (sent) emailsSent++;
            } else {
                console.log(`   ⚠️  Skipped: ${member.name} (no email address)`);
            }
        }

        console.log(`✅ Scheduled: Expiry check completed. Emails sent: ${emailsSent}/${expiringMembers.length}`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Expiry check completed successfully",
                count: expiringMembers.length,
                emailsSent
            })
        };
    } catch (error) {
        console.error("❌ Scheduled: Expiry check failed", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Expiry check failed",
                error: error.message
            })
        };
    }
};
