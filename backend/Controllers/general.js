const Expense = require("../Modals/expense");
const Outlet = require("../Modals/outlet");

exports.addExpense = async (req, res) => {
    try {
        const { date, name, amount } = req.body;
        const gymId = req.gym._id; // Assuming auth middleware attaches user/gym

        const newExpense = new Expense({
            date,
            name,
            amount,
            gym: gymId,
        });

        await newExpense.save();
        res.status(201).json({ message: "Expense added successfully", expense: newExpense });
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.addOutlet = async (req, res) => {
    try {
        const { location } = req.body;
        const gymId = req.gym._id;

        const newOutlet = new Outlet({
            location,
            gym: gymId,
        });

        await newOutlet.save();
        res.status(201).json({ message: "Outlet added successfully", outlet: newOutlet });
    } catch (error) {
        console.error("Error adding outlet:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const gymId = req.gym._id;
        const expenses = await Expense.find({ gym: gymId }).sort({ createdAt: -1 });
        res.status(200).json({ expenses });
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getOutlets = async (req, res) => {
    try {
        const gymId = req.gym._id;
        const outlets = await Outlet.find({ gym: gymId }).sort({ createdAt: -1 });
        res.status(200).json({ outlets });
    } catch (error) {
        console.error("Error fetching outlets:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getDashboardCounts = async (req, res) => {
    try {
        const gymId = req.gym._id;

        // Count expenses
        const expenseCount = await Expense.countDocuments({ gym: gymId });

        // Count outlets
        const outletCount = await Outlet.countDocuments({ gym: gymId });

        res.status(200).json({
            expenseCount,
            outletCount
        });

    } catch (error) {
        console.error("Error fetching dashboard counts:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const { runExpiryCheck, runStatusUpdate } = require("../cron");

exports.cronExpiryCheck = async (req, res) => {
    try {
        const result = await runExpiryCheck();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error running expiry check", error: error.message });
    }
};

exports.cronStatusUpdate = async (req, res) => {
    try {
        const result = await runStatusUpdate();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error running status update", error: error.message });
    }
};
