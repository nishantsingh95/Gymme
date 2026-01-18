import React, { useState, useEffect } from "react";
import axios from "axios";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import { ToastContainer, toast } from "react-toastify";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import "./addmembers.css";

const Addmembers = () => {
  const [inputField, setInputField] = useState({
    name: "",
    address: "",
    email: "",
    joiningDate: "",
    membership: "",
    slotTiming: "",
    profilePic:
      "https://tse1.explicit.bing.net/th/id/OIP.ZXSgz-LNexQRb5OgjOrr6wHaFv?rs=1&pid=ImgDetMain&o=7&rm=3",
  });
  const [imageLoader, setImageLoader] = useState(false);
  const [membershipList, setMembershipList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  const handleOnChange = (event, name) => {
    setInputField({ ...inputField, [name]: event.target.value });
  };
  console.log(inputField);

  const uploadImage = async (event) => {
    setImageLoader(true);
    console.log("image uploading");
    const files = event.target.files;
    const data = new FormData();
    data.append("file", files[0]);

    // ddtxroaol

    data.append("upload_preset", "gym-management");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/ddtxroaol/image/upload",
        data
      );
      console.log(response);
      const imageUrl = response.data.url;
      setInputField({ ...inputField, ["profilePic"]: imageUrl });
      setImageLoader(false);
    } catch (err) {
      console.log(err);
      setImageLoader(false);
    }
  };

  const fetchMembership = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/plans/get-membership`, {
        withCredentials: true,
      })
      .then((response) => {
        setMembershipList(response.data.membership);
        if (response.data.membership.length === 0) {
          return toast.error("No any Membership added yet", {
            className: "text-lg",
          });
        }
        /* else {
          let a = response.data.membership[0]._id;
          setSelectedOption(a);
          setInputField({ ...inputField, membership: a });
        } */
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something Wrong Happened");
      });
  };

  useEffect(() => {
    console.log(inputField);
    fetchMembership();
  }, []);

  const handleOnChangeSelect = (event) => {
    let value = event.target.value;
    setSelectedOption(value);
    setInputField({ ...inputField, membership: value });
  };

  const handleRegisterButton = async () => {
    await axios
      .post(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/members/register-member`, inputField, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success("Added Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something Wrong Happened");
      });
  };

  return (
    <div className="text-black">
      {/* White Card Container */}
      <div className="bg-white rounded-xl p-6 shadow-lg max-h-[80vh] overflow-y-auto">
        {/* Gradient Header */}
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Add New Member
        </h2>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          {/* Name and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                value={inputField.name}
                onChange={(event) => {
                  handleOnChange(event, "name");
                }}
                placeholder="Enter full name"
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg text-base p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                value={inputField.email}
                onChange={(e) => {
                  handleOnChange(e, "email");
                }}
                placeholder="Enter email"
                type="email"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg text-base p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Mobile and Address Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                value={inputField.mobileNo}
                onChange={(event) => {
                  handleOnChange(event, "mobileNo");
                }}
                placeholder="Enter mobile number"
                type="number"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg text-base p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                value={inputField.address}
                onChange={(event) => {
                  handleOnChange(event, "address");
                }}
                placeholder="Enter address"
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg text-base p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Date and Membership Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Joining Date
              </label>
              <div className="relative">
                <input
                  value={inputField.joiningDate}
                  onChange={(event) => {
                    handleOnChange(event, "joiningDate");
                  }}
                  type="date"
                  placeholder="YYYY-MM-DD"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg text-base p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:opacity-0"
                  style={{ colorScheme: 'light' }}
                />
                <CalendarMonthIcon
                  className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                  onClick={(e) => {
                    e.currentTarget.previousSibling.showPicker?.();
                  }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Membership Plan
              </label>
              <select
                value={selectedOption}
                onChange={handleOnChangeSelect}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg text-base p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="" disabled>Select Membership</option>
                {membershipList.map((item, index) => {
                  return (
                    <option key={index} value={item._id}>
                      {item.months} Monthly Membership
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Slot Timing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slot Timing
            </label>
            <input
              value={inputField.slotTiming}
              onChange={(event) => {
                handleOnChange(event, "slotTiming");
              }}
              placeholder="e.g., Morning (6 AM - 10 AM)"
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg text-base p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                onChange={(e) => uploadImage(e)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg text-base p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={inputField.profilePic}
                  className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                  alt="Profile"
                />
              </div>
            </div>
            {imageLoader && (
              <Stack sx={{ width: "100%", color: "grey.500", mt: 1 }} spacing={2}>
                <LinearProgress color="secondary" />
              </Stack>
            )}
          </div>

          {/* Register Button */}
          <button
            onClick={() => handleRegisterButton()}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-lg font-semibold py-3 rounded-lg hover:shadow-lg transition-shadow duration-200 mt-2"
          >
            Register Member
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Addmembers;
