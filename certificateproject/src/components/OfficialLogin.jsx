import React, { useState } from "react";
import Baale from "../images/Baale.png";
import StateLogo from "../images/StateLogo.png";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OfficialLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrors({});

    // Basic frontend validation
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/admin/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (res.data.success) {
        const { token, admin } = res.data.data;

        console.log("✅ Admin object received:", admin);
        console.log("✅ Role:", admin.role);

        // Save token and admin info
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(admin));

        toast.success(res.data.message || "Login successful!", {
          position: "top-center",
          autoClose: 3000,
        });

        // Dynamic navigation based on role
        setTimeout(() => {
          if (admin.role === "super_admin") {
            navigate("/officialsignup"); // Super admin route
          } else if (admin.role === "admin") {
            navigate("/officialscreen"); // Normal admin route
          } else {
            toast.error("Unrecognized role. Contact support.");
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);

      const errorMsg =
        error.response?.data?.message || "Login failed. Please try again.";

      toast.error(errorMsg, { position: "top-center", autoClose: 4000 });

      const fieldErrors = {};
      if (errorMsg.toLowerCase().includes("email")) fieldErrors.email = errorMsg;
      if (errorMsg.toLowerCase().includes("password"))
        fieldErrors.password = errorMsg;

      setErrors(fieldErrors);
    } finally {
      setLoading(false);
    }
  };

  const handleDashBoard = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 bg-[#11860F] flex-col justify-center items-center text-white p-10">
        <img src={StateLogo} alt="Baale" className="w-56 h-auto mb-6" />
        <h2 className="text-2xl font-semibold">Ogun State Government</h2>
        <p className="text-lg font-medium mt-2">L.G.A</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8 sm:px-12">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <img src={StateLogo} alt="State Logo" className="w-14 h-14 mb-3" />
            <h3 className="text-gray-800 font-semibold text-lg">
              Ogun State Government
            </h3>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Welcome Back
            </p>
            <p className="text-xs text-gray-500 font-medium">
              Sign in to your L.G.A account
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`rounded-md px-3 py-2 text-sm sm:text-base font-medium w-full focus:outline-none focus:ring-1
                ${
                  errors.email
                    ? "border-2 border-red-500 font-medium focus:ring-red-500"
                    : "border border-gray-300 font-medium focus:ring-green-600"
                }`}
                placeholder="example@og.gov"
              />
              {errors.email && (
                <p className="text-xs font-medium text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD (Fixed Layout) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>

              {/* Input + Eye container */}
              <div className="relative mb-1">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`rounded-md px-3 py-2 text-sm sm:text-base font-medium w-full focus:outline-none focus:ring-1 pr-10
                  ${
                    errors.password
                      ? "border-2 border-red-500 font-medium focus:ring-red-500"
                      : "border border-gray-300 font-medium focus:ring-green-600"
                  }`}
                  placeholder="Enter your password"
                />

                {/* Eye toggle */}
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 hover:text-green-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Error placed outside for stable layout */}
              {errors.password && (
                <p className="text-xs font-medium text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

   {/* REMEMBER & FORGOT */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm gap-3 sm:gap-0">
  {/* Remember me */}
  <label className="flex items-center">
    <input type="checkbox" className="mr-2 accent-green-600" /> 
    <span className="font-medium text-gray-700">Remember me</span>
  </label>

  {/* Forgot / Change password */}
  <div className="flex flex-col sm:flex-row items-center sm:space-x-1 space-y-1 sm:space-y-0">
    <button
      type="button"
      className="text-green-600 font-medium hover:underline"
      onClick={() => navigate("/officialforgotpassword")}
    >
      Forgot password
    </button>

    {/* <span className="hidden sm:inline text-gray-400">/</span> */}

    {/* <button
      type="button"
      className="text-green-600 font-medium hover:underline"
      onClick={() => navigate("/officialchangepassword")}
    >
      Change password
    </button> */}
  </div>
</div>

{/* Back to home */}
<div className="mt-6 flex justify-center">
  <p
    onClick={handleDashBoard}
    className="flex items-center font-medium cursor-pointer text-xs sm:text-sm text-gray-600 hover:text-green-700"
  >
    <span className="mr-2 font-medium">←</span> Back
  </p>
</div>

            {/* SIGN IN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#11860F] text-white py-2 rounded-md font-semibold transition 
                ${
                  loading
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-[#0c670b]"
                }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default OfficialLogin;
