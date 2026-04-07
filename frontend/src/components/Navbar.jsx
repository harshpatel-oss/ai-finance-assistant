import React, { useState, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "./ui/Button";
import { UserProfile } from "./ui";

const Navbar = ({ isDark = false, toggleDark = () => {} }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("accessToken");

  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

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

  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/income", label: "Income" },
    { path: "/expense", label: "Expense" },
    { path: "/ai-review", label: "AI Review" }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 shadow-sm transition-colors ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900 border-b border-gray-100"
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div
            className="text-lg font-bold cursor-pointer flex items-center gap-2"
            onClick={() => navigate("/dashboard")}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white">
              💰
            </div>
            <span className="hidden md:block">AI Finance</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium transition-colors ${
                      isDark
                        ? "hover:text-blue-400"
                        : "hover:text-blue-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            ) : null}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Avatar */}
                  {avatarUrl && !imgError ? (
                    <img
                      src={avatarUrl}
                      alt="avatar"
                      className="w-9 h-9 rounded-full object-cover border-2 border-blue-500 cursor-pointer"
                      onClick={() => setShowProfile(true)}
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div
                      onClick={() => setShowProfile(true)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer text-sm font-semibold border-2 border-blue-500 ${
                        isDark
                          ? "bg-gray-800 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {initials}
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signUp">
                    <Button size="sm">Sign Up</Button>
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
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          <div className={`absolute top-0 right-0 h-full w-4/5 max-w-sm ${
            isDark ? "bg-gray-900" : "bg-white"
          } shadow-lg p-5 flex flex-col`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Mobile Links */}
            <div className="flex flex-col gap-4 mb-6">
              {isAuthenticated ? (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="text-base font-medium hover:text-blue-600"
                    >
                      {link.label}
                    </Link>
                  ))}
                </>
              ) : null}
            </div>

            <div className="flex-grow" />

            {/* Mobile Logout */}
            {isAuthenticated && (
              <Button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                variant="danger"
                size="full"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      <UserProfile 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
