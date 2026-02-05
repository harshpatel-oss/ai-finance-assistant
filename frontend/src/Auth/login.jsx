import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_PATHS } from "../utils/apiPaths";
import {axiosInstance} from "../utils/axiosInstance"
import { UserContext } from "../context/userContext.jsx";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {updatedUser}= useContext(UserContext);
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  // Basic validation
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }
  try {                                                          
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
      email,
      password,
    });

    console.log("Login success:", response.data);

    // Extract from nested "data"
    const { accessToken, refreshToken, user } = response.data.data;

    if (!accessToken) {
      alert("Login failed: no access token returned.");
      return;
    }

    // tore tokens
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));

    // Navigate to dashboard
    navigate("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    const message =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during login. Please try again.";
    alert(message);
  }
};


  return (
    <div className="flex flex-row justify-center items-center h-screen  bg-gray-100">
      <div className="w-[90%] md:w-[50%]">

    
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 shadow-lg rounded w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="enter your email here"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="password"
          placeholder="enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>

        <p className="text-sm text-center mt-3">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 underline">
            Sign up
          </Link>
        </p>
      </form>
        </div>
    </div>
  );
}

export default Login;
