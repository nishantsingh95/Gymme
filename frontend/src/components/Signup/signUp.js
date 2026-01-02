import React, { useState } from "react";
import "./signUp.css";
import Modal from "../Modal/modal";
import ForgotPassword from "../ForgotPassword/forgotPassword";
import axios from "axios";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import { ToastContainer, toast } from "react-toastify";

const SignUp = ({ handleToggle }) => {
  const [forgotPassword, setForgotPassword] = useState(false);
  const [inputField, setInputField] = useState({
    gymName: "",
    email: "",
    userName: "",
    password: "",
    profilePic:
      "https://c4.wallpaperflare.com/wallpaper/199/924/33/muscle-muscle-bodybuilding-press-wallpaper-preview.jpg",
  });
  const [loaderImage, setLoaderImage] = useState(false);

  const handleClose = () => {
    setForgotPassword((prev) => !prev);
  };

  const handleOnChange = (event, name) => {
    setInputField({ ...inputField, [name]: event.target.value });
  };

  const uploadImage = async (event) => {
    setLoaderImage(true);
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
      let imageUrl = response.data.url;
      if (imageUrl.startsWith("http:")) {
        imageUrl = imageUrl.replace("http:", "https:");
      }
      setLoaderImage(false);
      setInputField({ ...inputField, ["profilePic"]: imageUrl });
    } catch (err) {
      console.log(err);
      setLoaderImage(false);
    }
  };

  const handleRegister = async () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    console.log("DEBUG: Attempting Register with API URL:", apiUrl);

    await axios
      .post(`${apiUrl}/auth/register`, inputField)
      .then((resp) => {
        const successMsg = resp.data.message;
        toast.success(successMsg);
        handleToggle();
      })
      .catch((err) => {
        const errorMessage = err.response.data.error;
        // console.log(errorMessage)
        toast.error(errorMessage);
      });
  };

  return (
    <div className="w-full h-full">
      <div className="font-sans text-white text-center text-3xl mb-6 font-bold">
        Register Gym
      </div>
      <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        <input
          type="text"
          value={inputField.email}
          onChange={(event) => {
            handleOnChange(event, "email");
          }}
          className="w-full mb-4 p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-500 focus:outline-none focus:border-white transition-colors"
          placeholder="Enter Email"
        />
        <input
          type="text"
          value={inputField.gymName}
          onChange={(event) => {
            handleOnChange(event, "gymName");
          }}
          className="w-full mb-4 p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-500 focus:outline-none focus:border-white transition-colors"
          placeholder="Enter Gym Name"
        />
        <input
          type="text"
          value={inputField.userName}
          onChange={(event) => {
            handleOnChange(event, "userName");
          }}
          className="w-full mb-4 p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-500 focus:outline-none focus:border-white transition-colors"
          placeholder="Enter UserName"
        />
        <input
          type="password"
          value={inputField.password}
          onChange={(event) => {
            handleOnChange(event, "password");
          }}
          className="w-full mb-4 p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-500 focus:outline-none focus:border-white transition-colors"
          placeholder="Enter Password"
        />
        <input
          type="file"
          onChange={(e) => {
            uploadImage(e);
          }}
          className="w-full mb-4 p-3 rounded-xl bg-white bg-opacity-20 text-white border border-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />

        {loaderImage && (
          <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
            <LinearProgress color="secondary" />
          </Stack>
        )}

        <img
          src={inputField.profilePic}
          className="mb-6 h-[150px] w-full object-cover rounded-xl"
        />

        <div
          className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl text-white text-center text-lg font-bold cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
          onClick={() => handleRegister()}
        >
          Register
        </div>
        <div
          className="mt-4 text-center text-gray-300 cursor-pointer hover:text-white underline"
          onClick={() => handleClose()}
        >
          Forgot Password?
        </div>
      </div>
      <div className="mt-6 text-center text-gray-300">
        Already have an account?{" "}
        <span
          className="text-white font-semibold cursor-pointer hover:underline"
          onClick={handleToggle}
        >
          Login
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

export default SignUp;
