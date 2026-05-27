import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_PATHS } from "../utils/apiPaths";
import { axiosInstance } from "../utils/axiosInstance";
import { UserContext } from "../context/userContext.jsx";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function SignUp() {
  const { isDark } = useTheme();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    if (!username.trim()) e.username = "Username is required";
    if (!email.trim()) e.email = "Email is required";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!avatarFile) {
      setErrors((prev) => ({ ...prev, avatar: "Please upload an avatar" }));
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("avatar", avatarFile);

      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { accessToken, refreshToken, user } = response.data.data;
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
        localStorage.setItem("user", JSON.stringify(user));
        updateUser?.(user);
        navigate("/dashboard");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Sign up failed. Please try again.";
      setErrors({ form: message });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors ${
      isDark ? 'bg-gray-950' : 'bg-gradient-to-br from-gray-50 to-indigo-50'
    }`}>
      <div className="w-full max-w-lg">
        {/* Back Button */}
        <Link to="/" className="flex items-center gap-2 text-sm font-medium text-indigo-600 mb-6 hover:text-indigo-700">
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <form onSubmit={handleSignUp} className={`shadow-xl rounded-2xl p-6 sm:p-8 space-y-4 transition-colors ${
          isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white'
        }`}>
          <div className="text-center">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Create your account</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Quick sign up to start tracking finances</p>
          </div>

          {errors.form && <p className={`text-sm text-red-600 text-center p-3 rounded-lg ${isDark ? 'bg-red-950/50' : 'bg-red-50'}`}>{errors.form}</p>}

          <div className="flex items-center gap-4">
            <div className={`w-20 h-20 rounded-full overflow-hidden border flex items-center justify-center ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              {preview ? (
                <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <div className={isDark ? 'text-gray-500' : 'text-gray-400'}>Avatar</div>
              )}
            </div>
            <label className="text-sm font-medium text-indigo-600 cursor-pointer">
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              <span className="underline">Upload Avatar</span>
            </label>
            {errors.avatar && <p className="text-red-500 text-sm">{errors.avatar}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} error={errors.fullName} />
            <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} error={errors.username} />
          </div>

          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />

          <div className="relative">
            <Input
              dark={isDark}
              label="Password"
              type={showPassword ? "text" : "password"}
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

          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing up..." : "Sign up"}</Button>

          <p className={`text-sm text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Already have an account? <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-700">Login</Link></p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
