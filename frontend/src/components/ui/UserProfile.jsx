import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Input } from "./Input";
import { Loader } from "./Loader";
import { useToast } from "./Toast";

const UserProfile = ({ isOpen, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    avatar: null,
  });
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.USER.GET_PROFILE);
      const userData = res.data?.data;
      setUser(userData);
      setAvatarPreview(userData?.avatar || "");
      setFormData({
        fullName: userData?.fullName || "",
        email: userData?.email || "",
        username: userData?.username || "",
        avatar: null,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      showToast("Failed to load user data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("username", formData.username);
      if (formData.avatar) {
        data.append("avatar", formData.avatar);
      }

      const res = await axiosInstance.put(API_PATHS.USER.UPDATE_PROFILE, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = res.data?.data;
      setAvatarPreview(updatedUser?.avatar || avatarPreview);
      showToast("Profile updated successfully", "success");
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("Failed to update profile", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "avatar") {
      setAvatarPreview(value ? URL.createObjectURL(value) : user?.avatar || "");
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Profile" size="md">
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8 bg-white rounded-3xl p-5 sm:p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
          {/* User Avatar and Basic Info */}
          <div className="text-center px-3">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border border-gray-200 shadow-sm">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-semibold">
                  {(user?.fullName || user?.username || user?.email || "").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-semibold">{user?.fullName || user?.username}</h3>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>

          {/* Update Form */}
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="Enter your full name"
            />
            <Input
              label="Username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Enter username"
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleInputChange("avatar", e.target.files?.[0] ?? null)}
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleUpdate}
              loading={updating}
              className="flex-1"
            >
              Update Profile
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default UserProfile;