import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      {/* App Logo / Title */}
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        💰 AI Finance Assistant
      </h1>

      {/* Right Side Links */}
      <div className="flex space-x-6 items-center">
        {isAuthenticated ? (
          <>
            <Link to="/income" className="hover:text-gray-200">Income</Link>
            <Link to="/expense" className="hover:text-gray-200">Expense</Link>
            <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
            {/* ✅ Logout always visible in Navbar */}
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-200">Login</Link>
            <Link to="/signUp" className="hover:text-gray-200">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
