import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // for mobile menu icons

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (e) {
      return null;
    }
  }, [isAuthenticated]);

  const avatarUrl =
    user &&
    (typeof user === "string" ? user : (user.avatar ||  (user.avatar && user.avatar.url)));

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
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
              {avatarUrl && !imgError ? (
                <img
                  src={avatarUrl}
                  alt={user?.name || user?.email || "avatar"}
                  title={user?.name || user?.email}
                  className="w-10 h-10 rounded-full object-cover ml-4 border-2 border-white cursor-pointer"
                  onClick={() => navigate("/dashboard")}
                  onError={() => setImgError(true)}
                />
              ) : user ? (
                <div
                  //onClick={() => navigate("/profile")}
                  className="w-10 h-10 rounded-full bg-white text-blue-600 font-semibold flex items-center justify-center ml-4 cursor-pointer"
                >
                  {(user.name || user.username || user.email || "").toString().slice(0,1).toUpperCase()}
                </div>
              ) : null}
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
              {avatarUrl && !imgError ? (
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={avatarUrl}
                    alt={user?.name || "avatar"}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                    onError={() => setImgError(true)}
                  />
                  <div className="text-white font-semibold">{user?.name || user?.email}</div>
                </div>
              ) : user ? (
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-white text-blue-600 font-semibold flex items-center justify-center">{(user.name || user.username || user.email || "").toString().slice(0,1).toUpperCase()}</div>
                  <div className="text-white font-semibold">{user?.name || user?.email}</div>
                </div>
              ) : null}
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
