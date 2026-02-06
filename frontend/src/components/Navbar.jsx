import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("accessToken");

  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, [isAuthenticated]);

  const avatarUrl = user?.avatar?.url || user?.avatar || null;

  const initials =
    (user?.name || user?.username || user?.email || "")
      .charAt(0)
      .toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-blue-600 text-white shadow-md fixed top-0 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo */}
          <div
            className="text-lg sm:text-xl font-bold cursor-pointer flex items-center gap-2"
            onClick={() => navigate("/dashboard")}
          >
            💰 AI Finance Assistant
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
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

                {/* Avatar */}
                {avatarUrl && !imgError ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover border-2 border-white cursor-pointer"
                    onClick={() => navigate("/dashboard")}
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div
                    onClick={() => navigate("/dashboard")}
                    className="w-9 h-9 rounded-full bg-white text-blue-600 font-semibold flex items-center justify-center cursor-pointer"
                  >
                    {initials}
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-200">
                  Login
                </Link>
                <Link
                  to="/signUp"
                  className="bg-white text-blue-600 px-4 py-1.5 rounded-md font-semibold hover:bg-gray-100 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={26} />
          </button>
        </div>
      </nav>

      {/* Mobile Slide Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute top-0 right-0 h-full w-4/5 max-w-sm bg-blue-700 shadow-lg p-5 flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>

            {/* User Info */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-blue-500">
                {avatarUrl && !imgError ? (
                  <img
                    src={avatarUrl}
                    className="w-12 h-12 rounded-full border-2 border-white"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white text-blue-600 font-semibold flex items-center justify-center">
                    {initials}
                  </div>
                )}
                <div>
                  <div className="font-semibold">
                    {user.name || "User"}
                  </div>
                  <div className="text-sm text-blue-200">
                    {user.email}
                  </div>
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-col gap-4 text-base">
              {isAuthenticated ? (
                <>
                  <Link onClick={() => setIsOpen(false)} to="/dashboard">
                    Dashboard
                  </Link>
                  <Link onClick={() => setIsOpen(false)} to="/income">
                    Income
                  </Link>
                  <Link onClick={() => setIsOpen(false)} to="/expense">
                    Expense
                  </Link>
                </>
              ) : (
                <>
                  <Link onClick={() => setIsOpen(false)} to="/login">
                    Login
                  </Link>
                  <Link
                    onClick={() => setIsOpen(false)}
                    to="/signUp"
                    className="bg-white text-blue-600 py-2 rounded-md text-center font-semibold"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Spacer */}
            <div className="flex-grow" />

            {/* Logout */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="bg-red-500 py-2 rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
