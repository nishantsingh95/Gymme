import React, { useState, useEffect } from "react";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import sidebarBg from "./sidebar_bg.png";

const Sidebar = () => {
  const [greeting, setGreeting] = useState("");
  const location = useLocation(); //get the current location
  const navigate = useNavigate();

  const greetingMessage = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning 🌞");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon ☀️");
    } else if (currentHour < 21) {
      setGreeting("Good Evening 🌄");
    } else {
      setGreeting("Good Night 🌜");
    }
  };

  useEffect(() => {
    greetingMessage();
  }, []);

  const handleLogout = async () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div
      className="w-full md:w-1/4 h-auto md:h-screen md:sticky top-0 border-b-2 md:border-b-0 md:border-r-2 md:border-gray-700 text-white pt-20 pb-3 px-3 md:p-5 font-extralight flex flex-col justify-center md:justify-start items-center md:items-stretch z-50 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(${sidebarBg})`
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-80 z-[-1]" />

      {/* Branding - Centered */}
      <div className="text-2xl md:text-3center font-bold md:font-normal truncate mb-2 md:mb-5 text-center">
        {localStorage.getItem("gymName").substring(0, 15)}
      </div>

      {/* Profile Section - Visible on Mobile now, Centered */}
      <div className="flex flex-row md:flex-row gap-3 md:gap-5 my-2 md:my-5 items-center justify-center">
        <div className="w-[50px] h-[50px] md:w-[100px] md:h-[100px] rounded-lg">
          <img
            alt="gym pic"
            className="w-full h-full rounded-full object-cover"
            src={localStorage.getItem("gymPic")}
          />
        </div>
        <div className="text-center md:text-left">
          <div className="text-sm md:text-2xl">{greeting}</div>
          <div className="text-sm md:text-xl mt-1 font-semibold break-words">
            {localStorage.getItem("userName")}
          </div>
          <div className="text-xs md:text-xl mt-1 text-gray-400 md:text-white">admin</div>
        </div>
      </div>

      {/* Navigation - Row on Mobile, Col on Desktop */}
      <div className="mt-2 md:mt-10 md:py-10 md:border-t-2 md:border-gray-700 flex flex-row md:flex-col gap-6 md:gap-0 justify-center">
        <Link
          to="/dashboard"
          className={`flex gap-2 md:gap-8 items-center font-semibold text-sm md:text-xl p-2 md:p-3 rounded-xl cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black ${location.pathname === "/dashboard"
            ? "border-2 md:border-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            : "text-gray-400 md:text-white"
            }`}
        >
          <div>
            <HomeIcon fontSize="medium" />
          </div>
          <div className="hidden md:block">Dashboard</div>
        </Link>

        <Link
          to="/member"
          className={`flex gap-2 md:gap-8 items-center md:mt-5 font-semibold text-sm md:text-xl p-2 md:p-3 rounded-xl cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black ${location.pathname === "/member"
            ? "border-2 md:border-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            : "text-gray-400 md:text-white"
            }`}
        >
          <div>
            <GroupIcon fontSize="medium" />
          </div>
          <div className="hidden md:block">Members</div>
        </Link>

        <div
          onClick={() => {
            handleLogout();
          }}
          className="flex gap-2 md:gap-8 items-center md:mt-5 font-semibold text-sm md:text-xl p-2 md:p-3 rounded-xl cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black text-gray-400 md:text-white"
        >
          <div>
            <LogoutIcon fontSize="medium" />
          </div>
          <div className="hidden md:block">Logout</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
