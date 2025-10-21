import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary dummy login
    if (email && password) {
      localStorage.setItem("token", "sample_token");
      navigate("/dashboard");
    } else {
      alert("Please fill all fields!");
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
