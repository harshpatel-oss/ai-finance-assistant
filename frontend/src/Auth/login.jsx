import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_PATHS } from "../utils/apiPaths";
import { axiosInstance } from "../utils/axiosInstance";
import { UserContext } from "../context/userContext.jsx";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Login() {
  const { isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    // simple email regex
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { accessToken, refreshToken, user } = response.data.data;

      if (!accessToken) {
        setErrors({ form: "Login failed: no access token returned." });
        setLoading(false);
        return;
      }

      // store tokens (current behavior)
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      updateUser?.(user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message || error.message || "Login failed. Please try again.";
        console.log(message);
      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors ${
      isDark ? 'bg-gray-950' : 'bg-gradient-to-br from-gray-50 to-indigo-50'
    }`}>
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link to="/" className="flex items-center gap-2 text-sm font-medium text-indigo-600 mb-6 hover:text-indigo-700">
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <form
          onSubmit={handleLogin}
          className={`shadow-xl rounded-2xl p-6 sm:p-8 space-y-4 transition-colors ${
            isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white'
          }`}
          aria-label="Login form"
        >
          <div className="text-center">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Welcome back</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Sign in to access your dashboard</p>
          </div>

          {errors.form && <p className={`text-sm text-red-600 text-center p-3 rounded-lg ${isDark ? 'bg-red-950/50' : 'bg-red-50'}`}>{errors.form}</p>}

          <Input
            label="Email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <div className="relative">
            <Input
              dark={isDark}
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={`absolute right-3 top-10 p-2 rounded-full transition-colors ${
                isDark ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <p className={`text-sm text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Don't have an account? <Link to="/signUp" className="text-indigo-600 font-medium hover:text-indigo-700">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
