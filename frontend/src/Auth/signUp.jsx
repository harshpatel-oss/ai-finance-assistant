import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_PATHS } from "../utils/apiPaths";
import { axiosInstance } from "../utils/axiosInstance";
import { UserContext } from "../context/userContext.jsx";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setError("");

    try {
      if (!avatarFile) {
        setError("Please upload an avatar.");
        return;
      }
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("avatar", avatarFile);

      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } } // override instance header
      );

      console.log(response.data);
      const { accessToken, user } = response.data.data;
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred during sign up. Please try again.");
      }
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-[90%] md:w-[50%] flex justify-center">
        <form
          onSubmit={handleSignUp}
          className="bg-white p-8 shadow-lg rounded w-80 md:w-96"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border mb-2">
              {preview ? (
                <img
                  src={preview}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                  Avatar
                </div>
              )}
            </div>
            <label className="text-sm font-medium text-green-600 cursor-pointer hover:underline">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              Upload Avatar
            </label>
          </div>

          <input
            type="text"
            placeholder="enter your full name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="email"
            placeholder="enter your email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="password"
            placeholder="enter your password here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-all"
          >
            Sign Up
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          <p className="text-sm text-center mt-3">
            Already have an account?{" "}
            <Link to="/login" className="text-green-500 underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
