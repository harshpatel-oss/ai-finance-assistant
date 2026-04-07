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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
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
      setFormData({
        name: userData?.name || "",
        email: userData?.email || "",
        username: userData?.username || "",
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
      await axiosInstance.put(API_PATHS.USER.UPDATE_PROFILE, formData);
      showToast("Profile updated successfully", "success");
      // Update local storage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("Failed to update profile", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = (field, value) => {
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
        <div className="space-y-6">
          {/* User Avatar and Basic Info */}
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
              {(user?.name || user?.username || user?.email || "").charAt(0).toUpperCase()}
            </div>
            <h3 className="text-base sm:text-lg font-semibold">{user?.name || user?.username}</h3>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>

          {/* Update Form */}
          <div className="space-y-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your name"
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