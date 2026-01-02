import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import MemberCard from "../../components/MemberCard/memberCard";
import {
  getMonthlyJoined,
  threeDayExpire,
  fourToSevenDaysExpire,
  expired,
  inActiveMembers,
  getExpenses,
  getOutlets,
} from "./data";
import ExpenseCard from "../../components/ExpenseCard/ExpenseCard";
import OutletCard from "../../components/OutletCard/OutletCard";

const GeneralUser = () => {
  const [header, setHeader] = useState("");
  const [data, setData] = useState([]);
  const [type, setType] = useState("member");

  useEffect(() => {
    const func = sessionStorage.getItem("func");
    functionCall(func);
  }, []);

  const functionCall = async (func) => {
    let datas;
    switch (func) {
      case "monthlyJoined":
        setHeader("Monthly Joined Members");
        datas = await getMonthlyJoined();
        setData(datas.members);
        break;

      case "threeDayExpire":
        setHeader("Expiring In 3 Days Members");
        datas = await threeDayExpire();
        setData(datas.members);
        break;

      case "fourToSevenDaysExpire":
        setHeader("Expiring In 4-7 Days Members");
        datas = await fourToSevenDaysExpire();
        setData(datas.members);
        break;

      case "expired":
        setHeader("Expired Members");
        datas = await expired();
        setData(datas.members);
        break;

      case "inActiveMembers":
        setHeader("InActive Members");
        datas = await inActiveMembers();
        setData(datas.members);
        setType("member");
        break;

      case "expenses":
        setHeader("All Expenses");
        datas = await getExpenses();
        setData(datas.expenses);
        setType("expense");
        break;

      case "outlets":
        setHeader("All Outlets");
        datas = await getOutlets();
        setData(datas.outlets);
        setType("outlet");
        break;
      default:
        break;
    }
  };

  return (
    <div className="text-black p-3 md:p-5 w-full md:w-3/4 flex-col h-screen overflow-y-auto pb-20">
      <div className="border-2 bg-slate-900 flex justify-between w-full text-white rounded-lg p-3">
        <Link
          to={"/dashboard"}
          className="border-2 pl-3 pr-3 pt-1 rounded-2xl cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black"
        >
          <ArrowBackIcon /> Back To Dasahboard
        </Link>
      </div>

      <div className="mt-5 text-xl text-slate-900">{header}</div>

      <div className="bg-slate-100 p-3 md:p-5 mt-5 rounded-lg grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto h-[80%] pb-10">
        {data.map((item, index) => {
          if (type === "member") return <MemberCard key={index} item={item} />;
          if (type === "expense") return <ExpenseCard key={index} item={item} />;
          if (type === "outlet") return <OutletCard key={index} item={item} />;
        })}
      </div>
    </div>
  );
};

export default GeneralUser;
