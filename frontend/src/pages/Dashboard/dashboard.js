import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";

import ErrorIcon from "@mui/icons-material/Error";
import ReportIcon from "@mui/icons-material/Report";
import PaidIcon from "@mui/icons-material/Paid";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Modal from "../../components/Modal/modal";
import Addmembers from "../../components/Addmembers/addmembers";
import AddmemberShip from "../../components/Addmembership/addmemberShip";

import AddExpenses from "../../components/AddExpenses/AddExpenses";

const Dashboard = () => {
  const [accordianDashboard, setAccordianDashboard] = useState(false);
  const [openFab, setOpenFab] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalHeader, setModalHeader] = useState("");
  const [dashboardData, setDashboardData] = useState({
    expenseCount: 0,
    outletCount: 0,
  });
  const ref = useRef();
  const fabRef = useRef();

  const fetchDashboardCounts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/general/get-dashboard-counts`,
        {
          withCredentials: true,
        }
      );
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard counts:", error);
    }
  };

  useEffect(() => {
    fetchDashboardCounts();
  }, []);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        accordianDashboard &&
        ref.current &&
        !ref.current.contains(e.target)
      ) {
        setAccordianDashboard(false);
      }
      if (openFab && fabRef.current && !fabRef.current.contains(e.target)) {
        setOpenFab(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [accordianDashboard, openFab]);

  const handleOnClickMenu = (value) => {
    sessionStorage.setItem("func", value);
  };

  const handleFabClick = () => {
    setOpenFab((prev) => !prev);
  };

  const handleModalOpen = (content, header) => {
    setModalContent(content);
    setModalHeader(header);
    setIsModalOpen(true);
    setOpenFab(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalContent("");
    setModalHeader("");
  };

  return (
    <div className="w-full md:w-3/4 text-black p-3 md:p-5 relative overflow-y-auto h-full pb-20">
      <div className="w-full bg-slate-900 text-white rounded-lg flex p-3 justify-between items-center -mt-2">
        <MenuIcon
          sx={{ cursor: "pointer" }}
          onClick={() => {
            setAccordianDashboard((prev) => !prev);
          }}
        />

        <div className="relative group z-50">
          <img
            className="w-8 h-8 rounded-3xl border-2 cursor-pointer hover:scale-110 transition-transform"
            src={localStorage.getItem("gymPic") || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhP1LzsEOSiEWX4xedVLb8maKpMnHCUpdtNQ&s"}
            alt="Gym Logo"
          />
          {/* Admin Info Tooltip */}
          <div className="absolute top-full right-0 mt-3 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
            <div className="text-sm text-gray-300 space-y-3">
              <div className="border-b border-gray-700 pb-2 mb-2 flex items-center gap-3">
                <img src={localStorage.getItem("gymPic")} className="w-10 h-10 rounded-full border border-indigo-500" alt="profile" />
                <div>
                  <div className="font-bold text-white text-base">{localStorage.getItem("userName")}</div>
                  <div className="text-xs text-indigo-400 uppercase tracking-wider">Admin</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white font-medium text-xs">{localStorage.getItem("email") || "Not set"}</span>
                </div>
                <div className="flex items-center justify-between">
                  {/* Mobile number is not in DB scheme yet, using placeholder or omitting */}
                  <span className="text-gray-400">Gym:</span>
                  <span className="text-white font-medium text-xs">{localStorage.getItem("gymName")}</span>
                </div>
              </div>
            </div>
            {/* Arrow */}
            <div className="absolute -top-2 right-3 w-4 h-4 bg-gray-900 border-l border-t border-gray-700 transform rotate-45"></div>
          </div>
        </div>
      </div>

      {accordianDashboard && (
        <div
          ref={ref}
          className="absolute p-3 bg-slate-900 text-white rounded-xl text-lg font-extralight"
        >
          <div>Hi Welcome to our Gym Management System.</div>
          <p>Feel free to ask any queries</p>
        </div>
      )}

      <div className="mt-5 pt-3 bg-slate-100 bg-opacity-50 grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full pb-5">
        {/* this is the card block */}
        <Link
          to={"/member"}
          className="w-full h-full border-2 bg-white rounded-lg cursor-pointer flex flex-col"
        >
          <div className="h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div className="py-7 px-5 flex flex-col justify-center items-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white flex-grow">
            <PeopleAltIcon sx={{ color: "green", fontSize: "50px" }} />
            <p className="text-xl my-3 font-semibold font-mono">
              Joined Members
            </p>
          </div>
        </Link>

        {/* this is the card block */}
        <Link
          to={"/specific/monthly"}
          onClick={() => handleOnClickMenu("monthlyJoined")}
          className="w-full h-full border-2 bg-white rounded-lg cursor-pointer flex flex-col"
        >
          <div className="h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div className="py-7 px-5 flex flex-col justify-center items-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white flex-grow">
            <SignalCellularAltIcon sx={{ color: "purple", fontSize: "50px" }} />
            <p className="text-xl my-3 font-semibold font-mono">
              Monthly Joined
            </p>
          </div>
        </Link>

        {/* this is the card block */}
        <Link
          to={"/specific/expire-with-in-3-days"}
          onClick={() => handleOnClickMenu("threeDayExpire")}
          className="w-full h-full border-2 bg-white rounded-lg cursor-pointer flex flex-col"
        >
          <div className="h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div className="py-7 px-5 flex flex-col justify-center items-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white flex-grow">
            <AccessAlarmIcon sx={{ color: "red", fontSize: "50px" }} />
            <p className="text-xl my-3 font-semibold font-mono">
              Expiring Within 3 Days
            </p>
          </div>
        </Link>

        {/* this is the card block */}
        <Link
          to={"/specific/expire-with-in-4-7-days"}
          onClick={() => handleOnClickMenu("fourToSevenDaysExpire")}
          className="w-full h-full border-2 bg-white rounded-lg cursor-pointer flex flex-col"
        >
          <div className="h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div className="py-7 px-5 flex flex-col justify-center items-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white flex-grow">
            <AccessAlarmIcon sx={{ color: "red", fontSize: "50px" }} />
            <p className="text-xl my-3 font-semibold font-mono">
              Expiring within 4-7 Days
            </p>
          </div>
        </Link>

        {/* this is the card block */}
        <Link
          to={"/specific/expired"}
          onClick={() => handleOnClickMenu("expired")}
          className="w-full h-full border-2 bg-white rounded-lg cursor-pointer flex flex-col"
        >
          <div className="h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div className="py-7 px-5 flex flex-col justify-center items-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white flex-grow">
            <ErrorIcon sx={{ color: "red", fontSize: "50px" }} />
            <p className="text-xl my-3 font-semibold font-mono">Expired</p>
          </div>
        </Link>

        {/* this is the card block */}
        <Link
          to={"/specific/inactive-members"}
          onClick={() => handleOnClickMenu("inActiveMembers")}
          className="w-full h-full border-2 bg-white rounded-lg cursor-pointer flex flex-col"
        >
          <div className="h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div className="py-7 px-5 flex flex-col justify-center items-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white flex-grow">
            <ReportIcon sx={{ color: "brown", fontSize: "50px" }} />
            <p className="text-xl my-3 font-semibold font-mono">
              InActive Members
            </p>
          </div>
        </Link>
        <Link
          to={"/specific/expenses"}
          onClick={() => handleOnClickMenu("expenses")}
          className="w-full h-full border-2 bg-white rounded-lg cursor-pointer flex flex-col"
        >
          <div className="h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="py-7 px-5 flex flex-col justify-center items-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white flex-grow">
            <PaidIcon sx={{ color: "gold", fontSize: "50px" }} />
            <p className="text-xl my-3 font-semibold font-mono">
              Total Expenses: {dashboardData.expenseCount}
            </p>
          </div>
        </Link>
      </div>

      <div className="md:bottom-4 p-4 w-3/4 md:mb-0 absolute bg-black text-white mt-20 rounded-xl text-xl">
        Contact Developer for any technical Error at +911234567890
      </div>

      {/* Floating Action Button */}
      <div
        ref={fabRef}
        className="fixed bottom-10 right-10 flex flex-col items-end gap-3"
      >
        {openFab && (
          <div className="flex flex-col gap-3 bg-white p-4 rounded-xl shadow-2xl border border-slate-100 min-w-[200px] animate-fade-in-up">
            <button
              onClick={() => handleModalOpen(<Addmembers />, "Add Member")}
              className="flex items-center gap-3 p-3 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-all duration-200 group"
            >
              <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <PersonAddIcon fontSize="small" />
              </div>
              Add Member
            </button>
            <button
              onClick={() =>
                handleModalOpen(
                  <AddmemberShip handleClose={handleModalClose} />,
                  "Add Membership"
                )
              }
              className="flex items-center gap-3 p-3 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 hover:text-purple-600 transition-all duration-200 group"
            >
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <CardMembershipIcon fontSize="small" />
              </div>
              Add Membership
            </button>
            <button
              onClick={() =>
                handleModalOpen(
                  <AddExpenses
                    handleClose={() => {
                      handleModalClose();
                      fetchDashboardCounts();
                    }}
                  />,
                  "Add Expenses"
                )
              }
              className="flex items-center gap-3 p-3 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 hover:text-pink-600 transition-all duration-200 group"
            >
              <div className="p-2 bg-pink-100 rounded-lg group-hover:bg-pink-600 group-hover:text-white transition-colors">
                <AttachMoneyIcon fontSize="small" />
              </div>
              Add Expenses
            </button>
          </div>
        )}
        <div
          onClick={handleFabClick}
          className="bg-purple-600 text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-purple-700 transition-all"
        >
          <AddIcon sx={{ fontSize: 40 }} />
        </div>
      </div>

      {isModalOpen && (
        <Modal
          handleClose={handleModalClose}
          content={modalContent}
          header={modalHeader}
        />
      )}
    </div>
  );
};

export default Dashboard;
