const mongoose = require("mongoose");
const { runExpiredMembersReminder } = require("../backend/cron");

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
        // Connect to database
        await connectDB();

        // Run the expired members reminder
        const result = await runExpiredMembersReminder();

        console.log("✅ Scheduled: Expired members reminder completed", result);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Expired members reminder completed successfully",
                ...result
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
