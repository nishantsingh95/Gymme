import React from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { Link } from "react-router-dom";

const MemberCard = ({ item }) => {
  return (
    <Link
      to={`/member/${item?._id}`}
      className="bg-white rounded-lg p-3 hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-white cursor-pointer flex flex-row md:flex-col items-center gap-4 md:gap-0 shadow-sm border border-slate-100"
    >
      <div className="w-16 h-16 md:w-28 md:h-28 flex-shrink-0 flex justify-center relative items-center border-2 p-1 md:mx-auto rounded-full">
        <img
          className="w-full h-full rounded-full object-cover"
          src={item?.profilePic}
          alt="Profile Pic"
        />
        <CircleIcon
          className="absolute top-0 left-0"
          sx={{ color: item?.status === "Active" ? "greenyellow" : "red", fontSize: "1rem" }}
        />
      </div>

      <div className="flex-1 md:w-full">
        <div className="md:mx-auto md:mt-5 text-left md:text-center text-lg md:text-xl font-semibold font-mono truncate">
          {item?.name}
        </div>
        <div className="md:mx-auto mt-1 md:mt-2 text-left md:text-center text-xs md:text-xl font-mono text-gray-500 hover:text-white">
          {"+91 " + item?.mobileNo}
        </div>
        <div className="md:mx-auto mt-1 md:mt-2 text-left md:text-center text-xs md:text-xl font-mono text-gray-500 hover:text-white">
          Exp: {item?.nextBillDate.slice(0, 10).split("-").reverse().join("-")}
        </div>
        <div className="md:mx-auto mt-1 md:mt-2 text-left md:text-center text-xs md:text-xl font-mono text-gray-500 hover:text-white">
          {item?.slotTiming || "Shift Not Set"}
        </div>
      </div>
    </Link>
  );
};

export default MemberCard;
