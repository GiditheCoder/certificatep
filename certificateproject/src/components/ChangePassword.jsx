import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Bg from "../images/Bg.png";

const baseURL = "https://certapp-aae046f75d3f.herokuapp.com";

const initialFormData = {
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previousData) => ({ ...previousData, [name]: value }));
    setErrors((previousErrors) => ({ ...previousErrors, [name]: "" }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.oldPassword.trim()) {
      nextErrors.oldPassword = "Old password is required.";
    }
    if (!formData.newPassword.trim()) {
      nextErrors.newPassword = "New password is required.";
    } else if (formData.newPassword.length < 8) {
      nextErrors.newPassword = "Password must be at least 8 characters.";
    }
    if (!formData.confirmNewPassword.trim()) {
      nextErrors.confirmNewPassword = "Please confirm your new password.";
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      nextErrors.confirmNewPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to change your password.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${baseURL}/api/v1/auth/change-password`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data?.message || "Password changed successfully.");
      setFormData(initialFormData);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.error(
        "Change password error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Unable to change password. Check your current password and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordFields = [
    { name: "oldPassword", label: "Old Password", visibility: "old" },
    { name: "newPassword", label: "New Password", visibility: "new" },
    {
      name: "confirmNewPassword",
      label: "Confirm New Password",
      visibility: "confirm",
    },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 sm:px-6"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      <div className="bg-white shadow-md rounded-md p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6 text-black">
          Change Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {passwordFields.map(({ name, label, visibility }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {label}
              </label>
              <div className="relative">
                <input
                  id={name}
                  type={showPassword[visibility] ? "text" : "password"}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  autoComplete={
                    name === "oldPassword" ? "current-password" : "new-password"
                  }
                  disabled={loading}
                  className={`w-full border rounded-md px-3 py-2 pr-10 focus:ring-2 focus:outline-none ${
                    errors[name]
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => ({
                      ...previous,
                      [visibility]: !previous[visibility],
                    }))
                  }
                  aria-label={`Toggle ${label.toLowerCase()} visibility`}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-green-600"
                >
                  {showPassword[visibility] ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors[name] && (
                <p className="text-xs text-red-600 mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#11860F] text-white py-2 rounded-md font-semibold transition ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#0c670b]"
            }`}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full text-sm font-medium text-gray-600 hover:text-[#11860F]"
          >
            Back to Dashboard
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ChangePassword;
