const nodemailer = require("nodemailer");

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
            console.log("No recipient email provided.");
            return;
        }
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendEmail;
