import React, { useState, useEffect } from "react";
import axios from "axios";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import { ToastContainer, toast } from "react-toastify";

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
        } else {
          let a = response.data.membership[0]._id;
          setSelectedOption(a);
          setInputField({ ...inputField, membership: a });
        }
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
      <div className="grid gap-5 grid-cols-2 text-lg">
        <input
          value={inputField.name}
          onChange={(event) => {
            handleOnChange(event, "name");
          }}
          placeholder="Name of the Joinee"
          type="text"
          className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12"
        />
        <input
          value={inputField.email}
          onChange={(e) => {
            handleOnChange(e, "email");
          }}
          placeholder="Enter Email"
          type="email"
          className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12"
        />
        <input
          value={inputField.mobileNo}
          onChange={(event) => {
            handleOnChange(event, "mobileNo");
          }}
          placeholder="Mobile No"
          type="number"
          className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12"
        />
        <input
          value={inputField.address}
          onChange={(event) => {
            handleOnChange(event, "address");
          }}
          placeholder="Enter Address"
          type="text"
          className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12"
        />
        <input
          value={inputField.joiningDate}
          onChange={(event) => {
            handleOnChange(event, "joiningDate");
          }}
          type="date"
          className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12"
        />

        <select
          value={selectedOption}
          onChange={handleOnChangeSelect}
          className="border-2 w-[90%] h-12 pt-2 pb-2 border-slate-400 rounded-md placeholder:text-grey"
        >
          {membershipList.map((item, index) => {
            return (
              <option key={index} value={item._id}>
                {item.months} Monthly Membership{" "}
              </option>
            );
          })}
        </select>

        <input
          value={inputField.slotTiming}
          onChange={(event) => {
            handleOnChange(event, "slotTiming");
          }}
          placeholder="Slot Timing (e.g., Morning)"
          type="text"
          className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12"
        />

        <input type="file" onChange={(e) => uploadImage(e)} />

        <div className="w-[100px] h-[100px]">
          <img
            src={inputField.profilePic}
            className="w-full h-full rounded-full"
          />
          {imageLoader && (
            <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
              <LinearProgress color="secondary" />
            </Stack>
          )}
        </div>

        <div
          onClick={() => handleRegisterButton()}
          className="p-3 border-2 w-28 text-lg h-14 text-center bg-slate-900 text-white rounded-xl cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
        >
          Register
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Addmembers;
