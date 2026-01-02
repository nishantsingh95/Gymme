import React from "react";
import StorefrontIcon from "@mui/icons-material/Storefront";

const OutletCard = ({ item }) => {
    return (
        <div className="bg-white rounded-lg p-3 hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-white cursor-pointer shadow-md">
            <div className="w-20 h-20 flex justify-center items-center border-2 p-1 mx-auto rounded-full bg-slate-100">
                <StorefrontIcon sx={{ fontSize: "40px", color: "orange" }} />
            </div>

            <div className="mx-auto mt-5 text-center text-xl font-semibold font-mono">
                {item?.location}
            </div>
        </div>
    );
};

export default OutletCard;
