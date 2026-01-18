import React, { useState } from "react";
import "./signUp.css";
import Modal from "../Modal/modal";
import axios from "axios";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import { ToastContainer, toast } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton } from "@mui/material";

const SignUp = ({ handleToggle }) => {
  const [inputField, setInputField] = useState({
    gymName: "",
    email: "",
    userName: "",
    password: "",
    profilePic:
      "https://c4.wallpaperflare.com/wallpaper/199/924/33/muscle-muscle-bodybuilding-press-wallpaper-preview.jpg",
  });
  const [loaderImage, setLoaderImage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleOnChange = (event, name) => {
    setInputField({ ...inputField, [name]: event.target.value });
  };

  // Image Compression Utility
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const MAX_WIDTH = 800; // Max width for the image
      const QUALITY = 0.7; // Quality (0 to 1)

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/jpeg",
            QUALITY
          );
        };
      };
    });
  };

  const uploadImage = async (event) => {
    setLoaderImage(true);
    console.log("Processing image...");
    const files = event.target.files;
    if (!files || files.length === 0) {
      setLoaderImage(false);
      return;
    }

    try {
      // Compress the image before uploading
      const compressedFile = await compressImage(files[0]);
      console.log("Image compressed. Original:", files[0].size, "Compressed:", compressedFile.size);

      const data = new FormData();
      data.append("file", compressedFile);
      data.append("upload_preset", "gym-management");

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
      toast.success("Image Uploaded");
    } catch (err) {
      console.log(err);
      toast.error("Image Upload Failed");
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
        const errorMessage =
          err.response && err.response.data && err.response.data.error
            ? err.response.data.error
            : "Registration Failed: Network Error";
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
        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={inputField.password}
            onChange={(event) => {
              handleOnChange(event, "password");
            }}
            className="w-full p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-500 focus:outline-none focus:border-white transition-colors"
            placeholder="Enter Password"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
              size="large"
            >
              {showPassword ? (
                <VisibilityOff sx={{ color: "white" }} />
              ) : (
                <Visibility sx={{ color: "white" }} />
              )}
            </IconButton>
          </div>
        </div>
        <div className="mb-2 text-white text-sm">Upload Profile Pic:</div>
        <input
          type="file"
          accept="image/*"
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
          alt="profile"
        />

        <div
          className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl text-white text-center text-lg font-bold cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
          onClick={() => handleRegister()}
        >
          Register
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
      <ToastContainer theme="dark" />
    </div>
  );
};

export default SignUp;
