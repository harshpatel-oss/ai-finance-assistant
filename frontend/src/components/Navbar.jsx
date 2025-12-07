import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // for mobile menu icons

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
     localStorage.removeItem("accessToken");
+    localStorage.removeItem("refreshToken");
+    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center ">
        {/* Left: Logo */}
        <h1
          className="text-lg sm:text-xl font-bold cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          💰 AI Finance Assistant
        </h1>

        {/* Right: Desktop Links */}
        <div className="hidden ml-auto md:flex items-center space-x-6 ">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-200">
                Dashboard
              </Link>
              <Link to="/income" className="hover:text-gray-200">
                Income
              </Link>
              <Link to="/expense" className="hover:text-gray-200">
                Expense
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition cursor-pointer"
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 flex flex-col space-y-2 px-6 py-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="hover:text-gray-200"
              >
                Dashboard
              </Link>
              <Link
                to="/income"
                onClick={() => setIsOpen(false)}
                className="hover:text-gray-200"
              >
                Income
              </Link>
              <Link
                to="/expense"
                onClick={() => setIsOpen(false)}
                className="hover:text-gray-200"
              >
                Expense
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="hover:text-gray-200"
              >
                Login
              </Link>
              <Link
                to="/signUp"
                onClick={() => setIsOpen(false)}
                className="hover:text-gray-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
