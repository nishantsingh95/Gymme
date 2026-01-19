const nodemailer = require("nodemailer");

// Validate email configuration on startup
if (!process.env.SENDER_EMAIL || !process.env.EMAIL_PASSWORD) {
    console.error("❌ EMAIL CONFIGURATION ERROR:");
    console.error("   SENDER_EMAIL:", process.env.SENDER_EMAIL ? "✓ Set" : "✗ Not Set");
    console.error("   EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "✓ Set" : "✗ Not Set");
    console.error("   Please configure email credentials in .env file");
} else {
    console.log("✅ Email configuration loaded:");
    console.log("   SENDER_EMAIL:", process.env.SENDER_EMAIL);
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendEmail = async (to, subject, html) => {
    try {
        if (!to) {
            console.log("⚠️  No recipient email provided.");
            return;
        }

        if (!process.env.SENDER_EMAIL || !process.env.EMAIL_PASSWORD) {
            console.error("❌ Cannot send email: Email credentials not configured");
            return;
        }

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            html,
        };

        console.log(`📧 Sending email to: ${to}`);
        console.log(`   Subject: ${subject}`);

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${to}`);
        console.log(`   Response: ${info.response}`);
    } catch (error) {
        console.error(`❌ Error sending email to ${to}:`, error.message);
        if (error.code) console.error(`   Error Code: ${error.code}`);
        if (error.response) console.error(`   Response: ${error.response}`);
    }
};

module.exports = sendEmail;
