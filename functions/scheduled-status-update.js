const mongoose = require("mongoose");
const { runStatusUpdate } = require("../backend/cron");

// Connect to database
const connectDB = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.DATABASE, {
            serverSelectionTimeoutMS: 5000
        });
    }
};

exports.handler = async (event, context) => {
    console.log("🔄 Scheduled: Status update starting...");

    try {
        // Connect to database
        await connectDB();

        // Run the status update
        const result = await runStatusUpdate();

        console.log("✅ Scheduled: Status update completed", result);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Status update completed successfully",
                ...result
            })
        };
    } catch (error) {
        console.error("❌ Scheduled: Status update failed", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Status update failed",
                error: error.message
            })
        };
    }
};
