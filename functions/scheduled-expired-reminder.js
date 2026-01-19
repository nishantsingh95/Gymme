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
    return nodemailer.createTransporter({
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
    console.log("📬 Scheduled: Expired members reminder starting...");

    try {
        await connectDB();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const expiredMembers = await Member.find({
            nextBillDate: { $lt: today },
            status: "Inactive"
        });

        console.log(`📊 Found ${expiredMembers.length} expired members.`);

        let emailsSent = 0;
        for (const member of expiredMembers) {
            const daysExpired = Math.floor((today - new Date(member.nextBillDate)) / (1000 * 60 * 60 * 24));
            console.log(`   Processing: ${member.name} (${member.email}) - Expired ${daysExpired} days ago`);

            if (member.email) {
                const subject = "Membership Expired - Renewal Required";
                const html = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Hello ${member.name},</h2>
            <p>Your gym membership expired on <strong>${new Date(member.nextBillDate).toLocaleDateString()}</strong> (${daysExpired} days ago).</p>
            <p>Please renew your membership to regain access to our facilities.</p>
            <p>Best regards,<br/>Gym Management Team</p>
          </div>
        `;
                const sent = await sendEmail(member.email, subject, html);
                if (sent) emailsSent++;
            } else {
                console.log(`   ⚠️  Skipped: ${member.name} (no email address)`);
            }
        }

        console.log(`✅ Scheduled: Expired members reminder completed. Emails sent: ${emailsSent}/${expiredMembers.length}`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Expired members reminder completed successfully",
                count: expiredMembers.length,
                emailsSent
            })
        };
    } catch (error) {
        console.error("❌ Scheduled: Expired members reminder failed", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Expired members reminder failed",
                error: error.message
            })
        };
    }
};
