import React, { useState, useEffect, useRef } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import Switch from "react-switch";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const MemberDetail = () => {
  const [status, setStatus] = useState("Pending");
  const [renew, setRenew] = useState(false);
  const [membership, setMembership] = useState([]);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [planMember, setPlanMember] = useState("");
  const [renewDate, setRenewDate] = useState("");
  const { id } = useParams();

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchData();
      fetchMembership();
    }
  }, [id]);

  const fetchMembership = async () => {
    axios
      .get(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/plans/get-membership`, {
        withCredentials: true,
      })
      .then((response) => {
        setMembership(response.data.membership);
        setPlanMember(response.data.membership[0]._id);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/members/get-member/${id}`,
        { withCredentials: true }
      );
      console.log(response);
      setData(response.data.member);
      setStatus(response.data.member.status);
      toast.success(response.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleSwitchBtn = async () => {
    const statuss = status === "Active" ? "Pending" : "Active";

    await axios
      .post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/members/change-status/${id}`,
        { status: statuss },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("Response from backend:", response.data);

        if (response.data && response.data.message) {
          toast.success(response.data.message);
        } else {
          toast.success("Status changed successfully");
        }

        setStatus(statuss);
      })
      .catch((err) => {
        console.error(
          "Error updating status:",
          err.response?.data || err.message
        );
        toast.error("Something went wrong");
      });
  };

  const isDateInPast = (inputDate) => {
    const today = new Date();
    const givenDate = new Date(inputDate);

    return givenDate < today;
  };

  const handleOnChangeSelect = (event) => {
    let value = event.target.value;
    setPlanMember(value);
  };

  const handleRenewSaveBtn = async () => {
    await axios
      .put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/members/update-member-plan/${id}`,
        { membership: planMember, renewDate: renewDate },
        { withCredentials: true }
      )
      .then((response) => {
        toast.success(response.data.message);
        fetchData(); // Refetch to ensure data is consistent
        setRenew(false); // Close the renew section
        setRenewDate(""); // Clear the date input
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong");
      });
  };

  return (
    <div className="w-full md:w-3/4 text-black p-3 md:p-5 mb-20 md:mb-0 h-screen overflow-y-auto">
      <div
        onClick={() => {
          navigate(-1);
        }}
        className="border-2 w-fit text-sm md:text-xl font-sans text-white p-2 rounded-xl bg-slate-900 cursor-pointer hover:bg-slate-700 transition-colors"
      >
        <ArrowBackIcon fontSize="small" /> Go Back
      </div>

      <div className="mt-5 md:mt-10 p-2 bg-white rounded-lg shadow-sm border border-slate-100">
        <div className="w-full h-fit flex flex-col md:flex-row gap-6 md:gap-0">
          <div className="w-full md:w-1/3 flex justify-center items-start pt-5">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-slate-100 shadow-lg">
              <img
                src={data?.profilePic}
                className="w-full h-full object-cover"
                alt="Member"
              />
            </div>
          </div>

          <div className="w-full md:w-2/3 md:mt-5 text-sm md:text-xl p-2 md:p-5">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-gray-500 block text-xs md:text-sm uppercase tracking-wide">Name</span>
                <span className="text-lg md:text-2xl font-bold text-slate-800 break-words">{data?.name}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-gray-500 block text-xs md:text-sm uppercase tracking-wide">Mobile</span>
                <span className="text-lg md:text-2xl font-bold text-slate-800">{data?.mobileNo}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-gray-500 block text-xs md:text-sm uppercase tracking-wide">Address</span>
                <span className="text-lg md:text-2xl font-bold text-slate-800 break-words">{data?.address}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-gray-500 block text-xs md:text-sm uppercase tracking-wide">Joined</span>
                  <span className="text-base md:text-xl font-semibold text-slate-800">
                    {(data?.joiningDate || data?.createdAt)
                      ?.slice(0, 10)
                      .split("-")
                      .reverse()
                      .join("-")}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-gray-500 block text-xs md:text-sm uppercase tracking-wide">Next Bill</span>
                  <span className="text-base md:text-xl font-semibold text-slate-800">
                    {data?.nextBillDate?.slice(0, 10).split("-").reverse().join("-")}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-gray-500 block text-xs md:text-sm uppercase tracking-wide">Status</span>
                  <span className={`text-base md:text-xl font-bold ${status === "Active" ? "text-green-600" : "text-red-500"}`}>
                    {status}
                  </span>
                </div>
                <Switch
                  onColor="#6366F1"
                  checked={status === "Active"}
                  onChange={handleSwitchBtn}
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-gray-500 block text-xs md:text-sm uppercase tracking-wide">Shift</span>
                <span className="text-base md:text-xl font-semibold text-slate-800">{data?.slotTiming || "Not Set"}</span>
              </div>
            </div>

            <div className="flex gap-4 w-full mt-6">
              <div
                onClick={() => setRenew((prev) => !prev)}
                className={`flex-1 rounded-xl p-3 md:p-4 border-2 border-slate-900 text-center font-bold transition-all transform active:scale-95 ${renew && status === "Active"
                  ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-transparent"
                  : "hover:bg-slate-100"
                  } cursor-pointer`}
              >
                Renew
              </div>
              <div
                onClick={async () => {
                  if (window.confirm("Are you sure you want to delete this member?")) {
                    await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/members/delete-member/${id}`, { withCredentials: true })
                      .then(() => {
                        toast.success("Member deleted successfully");
                        navigate(-1);
                      })
                      .catch(() => toast.error("Failed to delete member"));
                  }
                }}
                className="flex-1 rounded-xl p-3 md:p-4 border-2 border-red-500 text-red-500 text-center font-bold cursor-pointer hover:bg-red-500 hover:text-white transition-all transform active:scale-95"
              >
                Delete
              </div>
            </div>

            {renew && status === "Active" ? (
              <div className="rounded-xl p-5 mt-5 mb-5 bg-white border border-indigo-100 shadow-lg w-full">
                <div className="w-full">
                  <div className="my-2">
                    <div className="font-bold text-lg mb-2 text-indigo-900">Renew Membership</div>
                    <label className="text-sm text-gray-500 mb-1 block">Select Plan</label>
                    <select
                      value={planMember}
                      onChange={handleOnChangeSelect}
                      className="w-full border p-3 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {membership.map((item, index) => {
                        return (
                          <option key={index} value={item._id}>
                            {item.months} Months Membership
                          </option>
                        );
                      })}
                    </select>

                    <div className="mt-4">
                      <label className="text-sm text-gray-500 mb-1 block">Joining Date (Start Date)</label>
                      <input
                        type="date"
                        value={renewDate}
                        onChange={(e) => setRenewDate(e.target.value)}
                        className="w-full border p-3 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div
                      className="mt-6 rounded-lg p-3 bg-slate-900 text-white text-center w-full font-bold cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all shadow-md"
                      onClick={() => {
                        handleRenewSaveBtn();
                      }}
                    >
                      Confirm Renewal
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default MemberDetail;
