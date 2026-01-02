import React from "react";
import Login from "../../components/Login/login";
import SignUp from "../../components/Signup/signUp";

const Home = () => {
  const [isLogin, setIsLogin] = React.useState(true);

  const handleToggle = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="w-full h-[100vh]">
      <div className="w-full bg-cover flex justify-center items-center h-[100%] bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170')]">
        <div className="w-full md:w-1/3 min-w-[350px] p-8 backdrop-blur-md bg-black bg-opacity-60 rounded-3xl shadow-2xl border border-gray-600">
          <div className="mb-6 text-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-lg">
              Gym Management System
            </h1>
            <p className="text-gray-300 mt-2 text-sm">
              Manage your gym with ease and style
            </p>
          </div>

          <div className="transition-all duration-500 ease-in-out">
            {isLogin ? (
              <Login handleToggle={handleToggle} />
            ) : (
              <SignUp handleToggle={handleToggle} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
