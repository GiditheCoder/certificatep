import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Bg from "../images/Bg.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OfficialChangePassword = () => {
  const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // toggle password visibility
  const togglePassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  // validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.oldPassword.trim())
      newErrors.oldPassword = "Old password is required";
    if (!formData.newPassword.trim())
      newErrors.newPassword = "New password is required";
    if (!formData.confirmNewPassword.trim())
      newErrors.confirmNewPassword = "Confirm new password is required";

    if (formData.newPassword && formData.newPassword.length < 8) {
      newErrors.newPassword = "Password is weak (must be at least 8 characters)";
    }

    if (
      formData.newPassword &&
      formData.confirmNewPassword &&
      formData.newPassword !== formData.confirmNewPassword
    ) {
      newErrors.confirmNewPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // same as OfficialLogin
      const response = await axios.post(
        `${baseURL}/api/v1/admin/change-password`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message || "Password changed successfully!");
        toast.success(response.data.message || "Password changed successfully!", {
          position: "top-center",
          autoClose: 2500,
        });

        // reset form
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });

        // redirect after short delay
        setTimeout(() => {
          navigate("/official");
        }, 2500);
      }
    } catch (err) {
      console.error("Change password error:", err.response?.data || err.message);
      const errMsg =
        err.response?.data?.message ||
        "Old password incorrect or failed to change password.";
      toast.error(errMsg, { position: "top-center", autoClose: 4000 });
      setErrors({ oldPassword: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 sm:px-6"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      <div className="bg-white shadow-md rounded-md p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-black">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Old Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Old Password
            </label>
            <div className="relative">
              <input
                type={showPassword.old ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className={`w-full font-medium  border rounded-md px-3 py-2 focus:ring-2 focus:outline-none ${
                  errors.oldPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-green-500"
                }`}
                placeholder="Enter old password"
              />
              <button
                type="button"
                onClick={() => togglePassword("old")}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-green-600"
              >
                {showPassword.old ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="text-xs text-red-600 mt-1">{errors.oldPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full font-medium  border rounded-md px-3 py-2 focus:ring-2 focus:outline-none ${
                  errors.newPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-green-500"
                }`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => togglePassword("new")}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-green-600"
              >
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-red-600 mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className={`w-full font-medium border rounded-md px-3 py-2 focus:ring-2 focus:outline-none ${
                  errors.confirmNewPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-green-500"
                }`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => togglePassword("confirm")}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-green-600"
              >
                {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmNewPassword && (
              <p className="text-xs text-red-600 mt-1">
                {errors.confirmNewPassword}
              </p>
            )}
          </div>

          {/* Success Message */}
          {success && (
            <p className="text-green-600 text-sm font-medium">{success}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#11860F] text-white py-2 rounded-md font-semibold transition ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#0c670b]"
            }`}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default OfficialChangePassword;
