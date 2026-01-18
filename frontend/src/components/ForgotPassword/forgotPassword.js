import React, { useState } from "react";
import Loader from "../Loader/loader";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton } from "@mui/material";

const ForgotPassword = ({ handleClose }) => {
  const [emailSubmit, setEmailSubmit] = useState(false);
  const [otpValidate, setOtpValidate] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [contentVal, setContentValue] = useState("Submit Your Email");
  const [inputField, setInputField] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const handleSubmit = () => {
    if (!emailSubmit) {
      sendOtp();
    } else if (emailSubmit && !otpValidate) {
      verifyOTP();
    } else {
      changePassword();
    }
  };

  const changePassword = async () => {
    setLoader(true);
    await axios
      .post(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/auth/reset-password`, {
        email: inputField.email,
        newPassword: inputField.newPassword,
      })
      .then((response) => {
        toast.success(response.data.message);
        setLoader(false);
        if (handleClose) handleClose();
      })
      .catch((err) => {
        toast.error("Some technical issue while sending Mail");
        console.log(err);
        setLoader(false);
      });
  };

  const verifyOTP = async () => {
    setLoader(true);
    await axios
      .post(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/auth/reset-password/checkOtp`, {
        email: inputField.email,
        otp: inputField.otp,
      })
      .then((response) => {
        setOtpValidate(true);
        setContentValue("Submit Your New Password");
        toast.success(response.data.message);
        setLoader(false);
      })
      .catch((err) => {
        toast.error("Some technical issue while sending Mail");
        console.log(err);
        setLoader(false);
      });
  };

  const sendOtp = async () => {
    setLoader(true);
    await axios
      .post(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/auth/reset-password/sendOtp`, {
        email: inputField.email,
      })
      .then((response) => {
        setEmailSubmit(true);
        setContentValue("Submit Your OTP");
        toast.success(response.data.message);
        setLoader(false);
      })
      .catch((err) => {
        toast.error("Some technical issue while sending Mail");
        console.log(err);
        setLoader(false);
      });
  };

  const handleOnChange = (event, name) => {
    setInputField({ ...inputField, [name]: event.target.value });
  };

  return (
    <div className="w-full">
      <div className="w-full mb-6">
        <div className="text-gray-300 mb-2">Enter Your Email</div>
        <input
          type="email"
          value={inputField.email}
          onChange={(event) => handleOnChange(event, "email")}
          className="w-full p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
          placeholder="example@gmail.com"
        />
      </div>
      {emailSubmit && (
        <div className="w-full mb-6 relative">
          <div className="text-gray-300 mb-2 font-medium">Enter OTP</div>
          <input
            type="text"
            value={inputField.otp}
            onChange={(event) => handleOnChange(event, "otp")}
            className="w-full p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
            placeholder="Enter OTP"
          />
        </div>
      )}
      {otpValidate && (
        <div className="w-full mb-6 relative">
          <div className="text-gray-300 mb-2 font-medium">New Password</div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={inputField.newPassword}
              onChange={(event) => handleOnChange(event, "newPassword")}
              className="w-full p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner pr-12"
              placeholder="Enter new password"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                size="large"
                sx={{ color: "gray" }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </div>
          </div>
        </div>
      )}

      <div
        className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl text-white text-center text-lg font-bold cursor-pointer hover:opacity-90 transition-opacity shadow-lg mt-4"
        onClick={() => handleSubmit()}
      >
        {contentVal}
      </div>
      {loader && <Loader />}
      <ToastContainer theme="dark" />
    </div>
  );
};

export default ForgotPassword;
