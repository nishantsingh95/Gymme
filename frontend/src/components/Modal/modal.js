import React from "react";
import ClearIcon from "@mui/icons-material/Clear";
const Modal = ({ handleClose, content, header }) => {
  return (
    <div className="w-full h-[100vh] fixed bg-black bg-opacity-80 top-0 left-0 flex justify-center items-center z-[100]">
      <div className="w-[90%] md:w-1/3 bg-slate-900 text-white rounded-xl border border-gray-700 p-6 shadow-2xl relative">
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            {header}
          </div>
          <div
            onClick={() => handleClose()}
            className="cursor-pointer hover:text-red-500 transition-colors"
          >
            <ClearIcon sx={{ fontSize: "28px" }} />
          </div>
        </div>
        <div className="mt-2">{content}</div>
      </div>
    </div>
  );
};

export default Modal;
