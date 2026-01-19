const mongoose = require("mongoose");

// Member Schema
const memberSchema = new mongoose.Schema({
    name: String,
    email: String,
    nextBillDate: Date,
    status: String,
});

const Member = mongoose.models.Member || mongoose.model("Member", memberSchema);

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
        await connectDB();

        const today = new Date();

        const result = await Member.updateMany(
            {
                status: "Active",
                nextBillDate: { $lt: today }
            },
            {
                $set: { status: "Inactive" }
            }
        );

        console.log(`✅ Scheduled: Updated ${result.modifiedCount} members to Inactive status.`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Status update completed successfully",
                modifiedCount: result.modifiedCount
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
