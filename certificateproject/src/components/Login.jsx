import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // 👈 use Lucide icons
import StateLogo from "../images/StateLogo.png";
import Bg from "../images/Bg.png";

const Login = () => {
  // State to store user input
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
     setErrors({ ...errors, [e.target.name]: "" }); // clear error when typing
  };

  // Loading and messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
   const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleHomeRedirect = () => {
    navigate("/");
  }


const handleSignIn = async (e) => {
  e.preventDefault();

  setMessage("");
  const newErrors = {};

  // 🔹 Basic frontend validation
  if (!formData.email.trim()) newErrors.email = "Required";
  if (!formData.password.trim()) newErrors.password = "Required";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setLoading(true);

  try {
    const res = await axios.post(
      "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/auth/login",
      {
        email: formData.email,
        password: formData.password,
      }
    );

    if (res.data.success) {
      const { token, userObj } = res.data.data;

      // ✅ Save both token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userObj));

      setMessage(res.data.message || "Login successful!");
      console.log("✅ Response:", res.data);

      // ✅ Redirect after short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);

    const errorMsg =
      error.response?.data?.message?.toLowerCase() ||
      "login failed. please try again.";

    const newErrors = {};

    // 🎯 Detect where the problem is
    if (errorMsg.includes("email")) {
      newErrors.email =
        error.response?.data?.message || "Invalid email address.";
    } else if (errorMsg.includes("password")) {
      newErrors.password =
        error.response?.data?.message || "Incorrect password.";
    } else if (errorMsg.includes("credential")) {
      newErrors.email = "Invalid email or password.";
      newErrors.password = "Invalid email or password.";
    } else {
      setMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }

    setErrors(newErrors);
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 sm:px-6"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      <div className="bg-white w-full max-w-sm sm:max-w-md rounded-lg shadow-md p-6 sm:p-8">
        {/* Logo + Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src={StateLogo}
            alt="State Logo"
            className="w-12 h-12 sm:w-16 sm:h-16 mb-3"
          />
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Ogun State Government
          </h2>
          <p className="text-xs sm:text-sm font-medium text-gray-500">Welcome Back</p>
          <p className="text-xs sm:text-sm font-medium text-gray-500">
            Sign in to your LGA Certificate account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
{/* Email Field */}
<div>
  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
    Email
  </label>
  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    placeholder="johndoe@example.com"
    className={`rounded-md px-3 py-2 text-sm sm:text-base font-medium w-full focus:outline-none focus:ring-1 pr-10
      ${errors.email
        ? "border-2 border-red-500 font-medium focus:ring-red-500"
        : "border border-gray-300 font-medium focus:ring-green-600"
      }`}
  />
  {errors.email && (
    <p className="text-xs font-medium text-red-600 mt-1">{errors.email}</p>
  )}
</div>

<div>
  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
    Password
  </label>

  <div className="relative mb-1"> {/* 👈 only for input & eye */}
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="••••••••"
      className={`rounded-md px-3 py-2 text-sm sm:text-base font-medium w-full focus:outline-none focus:ring-1 pr-10
        ${
          errors.password
            ? "border-2 border-red-500 font-medium focus:ring-red-500"
            : "border border-gray-300 font-medium focus:ring-green-600"
        }`}
    />

    {/* Eye toggle button */}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>

  {/* Error text placed OUTSIDE so it doesn’t affect the layout above */}
  {errors.password && (
    <p className="text-xs font-medium text-red-600 mt-1">{errors.password}</p>
  )}
</div>






          {/* Remember + Forgot Password */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm gap-2">
            <label className="flex items-center space-x-2 text-gray-600">
              <input type="checkbox" className="rounded border-gray-300" />
              <span>Remember for 30 days</span>
            </label>
            <a
              href="#"
              className="text-[#11860F] font-medium"
              onClick={handleForgotPassword}
            >
              Forgot password
            </a>
          </div>

          {/* Message */}
          {message && (
            <p
              className={`text-sm text-center ${
                message.toLowerCase().includes("success")
                  ? "text-green-600 font-medium"
                  : "text-red-600 font-medium"
              }`}
            >
              {message}
            </p>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-[#11860F] text-white font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-md hover:bg-[#0c670b] transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* Create account link */}
          <p className="text-center text-xs font-medium sm:text-sm text-gray-500">
            Don’t have an account?{" "}
          <span className="text-green-700 font-medium cursor-pointer"
          onClick={handleSignUp}>
   Create account
          </span>
            
          
          </p>
        </form>

        {/* Back to home */}
        <div className="mt-6 flex justify-center">
          <p
            onClick={handleHomeRedirect}
            className="flex items-center font-medium cursor-pointer text-xs sm:text-sm text-gray-600 hover:text-green-700"
          >
            <span className="mr-2 font-medium">←</span> Back to home
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;