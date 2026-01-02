import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const AddOutlets = ({ handleClose }) => {
    const [location, setLocation] = useState("");

    const handleAddOutlet = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/general/add-outlet`,
                { location },
                { withCredentials: true }
            );
            toast.success(response.data.message);
            handleClose();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add outlet");
        }
    };

    return (
        <div className="text-black p-5">
            <div className="flex flex-col gap-5">
                <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="border-2 rounded-lg text-lg p-2 w-full"
                    type="text"
                    placeholder="Outlet Location"
                />
                <button
                    onClick={handleAddOutlet}
                    className="p-3 bg-slate-900 text-white rounded-xl hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                >
                    Add Outlet
                </button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AddOutlets;
