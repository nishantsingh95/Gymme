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
      <div className="flex flex-wrap gap-5 items-center justify-center">
        {membership.map((item, index) => {
          return (
            <div className="text-lg bg-slate-900 text-white border-2 pl-2 pr-2 flex-col gap-3 justify-between pt-1 pb-1 rounded-xl font-semibold hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              <div>{item.months} Months Membership</div>
              <div>Rs {item.price}</div>
            </div>
          );
        })}
      </div>
      <hr className="mt-10 mb-10" />
      <div className="flex flex-col gap-4 mb-10 items-stretch">
        <input
          value={inputField.months}
          onChange={(event) => handleOnChange(event, "months")}
          className="border-2 rounded-lg text-lg w-full p-2"
          type="number"
          placeholder="No. of Months"
        />
        <input
          value={inputField.price}
          onChange={(event) => handleOnChange(event, "price")}
          className="border-2 rounded-lg text-lg w-full p-2"
          type="number"
          placeholder="Price"
        />
        <div
          onClick={() => {
            handleAddmembership();
          }}
          className="text-lg border-2 p-2 w-full whitespace-nowrap rounded-xl cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-center text-white"
        >
          Add +
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddmemberShip;
