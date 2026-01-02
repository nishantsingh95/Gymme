import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const AddExpenses = ({ handleClose }) => {
    const [inputField, setInputField] = useState({
        date: "",
        name: "",
        amount: "",
    });

    const handleOnChange = (event, name) => {
        setInputField({ ...inputField, [name]: event.target.value });
    };

    const handleAddExpense = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/general/add-expense`,
                inputField,
                { withCredentials: true }
            );
            toast.success(response.data.message);
            handleClose();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add expense");
        }
    };

    return (
        <div className="p-1">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md mx-auto border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                    Add New Expense
                </h2>
                <div className="flex flex-col gap-5">
                    <div className="relative">
                        <label className="text-sm font-semibold text-gray-600 ml-1 mb-1 block">Date</label>
                        <input
                            value={inputField.date}
                            onChange={(event) => handleOnChange(event, "date")}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200 text-gray-700"
                            type="date"
                            placeholder="Date"
                        />
                    </div>

                    <div className="relative">
                        <label className="text-sm font-semibold text-gray-600 ml-1 mb-1 block">Expense Name</label>
                        <input
                            value={inputField.name}
                            onChange={(event) => handleOnChange(event, "name")}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                            type="text"
                            placeholder="e.g. Electricity Bill"
                        />
                    </div>

                    <div className="relative">
                        <label className="text-sm font-semibold text-gray-600 ml-1 mb-1 block">Amount</label>
                        <input
                            value={inputField.amount}
                            onChange={(event) => handleOnChange(event, "amount")}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                            type="number"
                            placeholder="e.g. 5000"
                        />
                    </div>

                    <button
                        onClick={handleAddExpense}
                        className="mt-2 w-full py-3.5 px-6 rounded-xl text-white font-semibold text-lg shadow-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
                    >
                        Add Expense
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AddExpenses;
