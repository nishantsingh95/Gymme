import React from "react";
import PaidIcon from "@mui/icons-material/Paid";

const ExpenseCard = ({ item }) => {
    return (
        <div className="bg-white rounded-lg p-4 h-fit hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-white cursor-pointer shadow-md transform transition-transform hover:scale-105">
            <div className="w-14 h-14 flex justify-center items-center border-2 p-1 mx-auto rounded-full bg-slate-100">
                <PaidIcon sx={{ fontSize: "30px", color: "gold" }} />
            </div>

            <div className="mx-auto mt-3 text-center text-xl font-bold font-mono truncate">
                {item?.name}
            </div>
            <div className="mx-auto mt-2 text-center text-lg font-mono">
                Rs {item?.amount}
            </div>
            <div className="mx-auto mt-1 text-center text-sm font-mono text-gray-500">
                {new Date(item?.date).toLocaleDateString()}
            </div>
        </div>
    );
};

export default ExpenseCard;
