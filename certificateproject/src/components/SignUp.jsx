import React, { useState } from "react";
import axios from "axios";
import StateLogo from "../images/StateLogo.png";
import Bg from "../images/Bg.png";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({}); // 🔴 store field-specific errors
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🔁 Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error when typing
  };
  

  // ✅ Handle submit
const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  const newErrors = {};

  // Simple validation
  if (!formData.firstName.trim()) newErrors.firstName = "Required";
  if (!formData.middleName.trim()) newErrors.middleName = "Required";
  if (!formData.lastName.trim()) newErrors.lastName = "Required";
  if (!formData.email.trim()) newErrors.email = "Required";
  if (!formData.phone.trim()) newErrors.phone = "Required";
  if (!formData.password.trim()) newErrors.password = "Required";
  if (!formData.confirmPassword.trim()) newErrors.confirmPassword = "Required";
  if (formData.password !== formData.confirmPassword)
    newErrors.confirmPassword = "Passwords do not match";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setLoading(true);

  try {
    const res = await axios.post(
      "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/auth/signup",
      formData
    );

    console.log("✅ Response:", res.data);

    // 🎉 Show toast notification on successful signup
    toast.success("Email registered successfully! Please verify your email.", {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    // Redirect to verify email page after a short delay
    setTimeout(() => {
      navigate("/verify-email", { state: { email: formData.email } });
    }, 1500);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    const errorMessage =
      err.response?.data?.message || "Something went wrong. Please try again.";

    // 🔴 Show error toast if signup fails
    toast.error(errorMessage, {
      position: "top-center",
      autoClose: 4000,
      theme: "colored",
    });

    setMessage(errorMessage);
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      <div className="bg-white w-full max-w-md md:max-w-2xl rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <img src={StateLogo} alt="State Logo" className="w-16 h-16 mb-3" />
          <h2 className="text-lg font-semibold text-gray-800">
            Ogun State Government
          </h2>
          <p className="text-sm font-medium text-gray-500">
            Fill in your details to create your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First/Last Names */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["firstName", "middleName", "lastName"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={
                    field === "firstName"
                      ? "John"
                      : field === "middleName"
                      ? "Michael"
                      : "Doe"
                  }
                  className={`border rounded-md px-3 py-2 w-full font-medium focus:ring-1 ${
                    errors[field]
                      ? "border-red-600 focus:ring-red-600"
                      : "border-gray-300 focus:ring-green-600"
                  }`}
                />
                {errors[field] && (
                  <p className="text-xs text-red-600 mt-1">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="johndoe@example.com"
              className={`border rounded-md px-3 py-2 w-full font-medium focus:ring-1 ${
                errors.email
                  ? "border-red-600 focus:ring-red-600"
                  : "border-gray-300 focus:ring-green-600"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number i.e 08123456789
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="08123456789"
              className={`border rounded-md px-3 py-2 w-full font-medium focus:ring-1 ${
                errors.phone
                  ? "border-red-600 focus:ring-red-600"
                  : "border-gray-300 focus:ring-green-600"
              }`}
            />
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={`border rounded-md px-3 py-2 w-full font-medium pr-10 focus:ring-1 ${
                  errors.password
                    ? "border-red-600 focus:ring-red-600"
                    : "border-gray-300 focus:ring-green-600"
                }`}
              />
              <div
                className="absolute right-3 top-11 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className={`border rounded-md px-3 py-2 w-full font-medium pr-10 focus:ring-1 ${
                  errors.confirmPassword
                    ? "border-red-600 focus:ring-red-600"
                    : "border-gray-300 focus:ring-green-600"
                }`}
              />
              <div
                className="absolute right-3 top-11 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {message && (
            <p className="text-sm text-center mt-2 text-gray-700">{message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#11860F] text-white font-semibold py-3 rounded-md hover:bg-[#0c670b] transition-colors"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Get started"}
          </button>

          <p className="text-center text-sm font-semibold text-gray-500 mt-4">
            Already have an account?{" "}
            <a
              className="text-[#11860F] font-medium cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Log in
            </a>
          </p>
        </form>
      </div>
        <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />
    </div>
  );
};

export default SignUp;

