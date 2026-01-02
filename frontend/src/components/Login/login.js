import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Modal from "../Modal/modal";
import ForgotPassword from "../ForgotPassword/forgotPassword";

const Login = ({ handleToggle }) => {
  const [loginField, setLoginField] = useState({ userName: "", password: "" });
  const [forgotPassword, setForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setForgotPassword((prev) => !prev);
  };

  const handleLogin = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/auth/login`,
        loginField,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("gymName", response.data.gym.gymName);
        localStorage.setItem("gymPic", response.data.gym.profilePic);
        localStorage.setItem("userName", response.data.gym.userName);
        localStorage.setItem("email", response.data.gym.email);
        localStorage.setItem("isLogin", true);
        localStorage.setItem("token", response.data.token);

        navigate("/dashboard");
      })
      .catch((err) => {
        // Fix for "Cannot read properties of undefined"
        const errorMessage =
          err.response && err.response.data && err.response.data.error
            ? err.response.data.error
            : "Network Error or Server not reachable";
        toast.error(errorMessage);
        console.error(err);
      });
  };

  const handleOnChange = (event, name) => {
    setLoginField({ ...loginField, [name]: event.target.value });
  };

  return (
    <div className="w-full">
      <div className="font-sans text-white text-center text-3xl mb-8 font-bold">
        Login
      </div>
      <input
        value={loginField.userName}
        onChange={(event) => {
          handleOnChange(event, "userName");
        }}
        type="text"
        className="w-full mb-6 p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-500 focus:outline-none focus:border-white transition-colors"
        placeholder="Username"
      />
      <input
        value={loginField.password}
        onChange={(event) => {
          handleOnChange(event, "password");
        }}
        type="password"
        className="w-full mb-8 p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-500 focus:outline-none focus:border-white transition-colors"
        placeholder="Password"
      />
      <div
        className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl text-white text-center text-lg font-bold cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
        onClick={() => {
          handleLogin();
        }}
      >
        Login
      </div>

      <div
        className="mt-4 text-center text-gray-300 cursor-pointer hover:text-white underline"
        onClick={() => handleClose()}
      >
        Forgot Password?
      </div>

      <div className="mt-6 text-center text-gray-300">
        Don't have an account?{" "}
        <span
          className="text-white font-semibold cursor-pointer hover:underline"
          onClick={handleToggle}
        >
          Sign Up
        </span>
      </div>
      {forgotPassword && (
        <Modal
          header="Forgot Password"
          handleClose={handleClose}
          content={<ForgotPassword />}
        />
      )}
      <ToastContainer theme="dark" />
    </div>
  );
};

export default Login;
