const mongoose = require("mongoose");
const { runExpiryCheck } = require("../backend/cron");

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
        // Connect to database
        await connectDB();

        // Run the expiry check
        const result = await runExpiryCheck();

        console.log("✅ Scheduled: Expiry check completed", result);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Expiry check completed successfully",
                ...result
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
