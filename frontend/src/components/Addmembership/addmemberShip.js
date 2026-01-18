import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const AddmemberShip = ({ handleClose }) => {
  const [inputField, setInputField] = useState({ months: "", price: "" });
  const [membership, setMembership] = useState([]);
  const fetchedRef = useRef(false);

  const handleOnChange = (event, name) => {
    setInputField({ ...inputField, [name]: event.target.value });
  };

  const fetchMembership = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/plans/get-membership`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        setMembership(res.data.membership);
        toast.success(res.data.membership.length + " Membership fetched");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something Wrong Happened");
      });
  };

  useEffect(() => {
    if (fetchedRef.current) return; // ✅ Stop if already fetched
    fetchedRef.current = true;
    fetchMembership();
  }, []);

  const handleAddmembership = async () => {
    await axios
      .post(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/plans/add-membership`, inputField, {
        withCredentials: true,
      })
      .then((response) => {
        toast.success(response.data.message);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something Wrong Happened");
      });
  };

  return (
    <div className="text-black">
      {/* White Card Container */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        {/* Gradient Header */}
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Add New Membership
        </h2>

        {/* Existing Memberships */}
        {membership.length > 0 && (
          <>
            <div className="flex flex-wrap gap-3 items-center justify-center mb-6">
              {membership.map((item, index) => {
                return (
                  <div key={index} className="text-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold">
                    <div>{item.months} Months</div>
                    <div>₹{item.price}</div>
                  </div>
                );
              })}
            </div>
            <hr className="my-6 border-gray-200" />
          </>
        )}

        {/* Input Fields */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (Months)
            </label>
            <input
              value={inputField.months}
              onChange={(event) => handleOnChange(event, "months")}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg text-base p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              type="number"
              placeholder="e.g. 6"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              value={inputField.price}
              onChange={(event) => handleOnChange(event, "price")}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg text-base p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              type="number"
              placeholder="e.g. 5000"
            />
          </div>

          {/* Gradient Button */}
          <button
            onClick={() => {
              handleAddmembership();
            }}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-lg font-semibold py-3 rounded-lg hover:shadow-lg transition-shadow duration-200 mt-2"
          >
            Add Membership
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddmemberShip;
