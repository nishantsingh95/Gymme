import "./App.css";
import Sidebar from "./components/Sidebar/sidebar";
import Dashboard from "./pages/Dashboard/dashboard";
import Home from "./pages/Home/home";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Member from "./pages/Member/member";
import GeneralUser from "./pages/GeneralUser/generalUser";
import MemberDetail from "./pages/MemberDetail/memberDetail";
import "react-toastify/dist/ReactToastify.css";
import Chatbot from "./components/Chatbot/Chatbot";

function App() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    let isLogedIn = localStorage.getItem("isLogin");
    if (isLogedIn) {
      setIsLogin(true);
      navigate("/dashboard");
    } else {
      setIsLogin(false);
      navigate("/");
    }
  }, [localStorage.getItem("isLogin")]);

  return (
    <div className="flex h-screen overflow-hidden">
      {isLogin && <Sidebar />}
      {isLogin && <Chatbot />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/member" element={<Member />} />
        <Route path="/specific/:page" element={<GeneralUser />} />
        <Route path="/member/:id" element={<MemberDetail />} />
      </Routes>
    </div>
  );
}

export default App;
