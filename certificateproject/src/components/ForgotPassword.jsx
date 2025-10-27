import React, { useState } from "react";
import axios from "axios";
import Bg from "../images/Bg.png";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    setMessage("");
    setErrors({});

    // 🔴 Frontend validation
    if (!email.trim()) {
      newErrors.email = "Email is required.";
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/auth/forgot-password",
        { email }
      );

      // ✅ Success
      setMessage("Password reset link sent to your email.");
      setErrors({});

      // Redirect after 1 second
      setTimeout(() => {
        navigate("/resetpassword", { state: { email } });
      }, 1000);
    } catch (error) {
      console.error("Error sending reset link:", error);

      // 🔴 Backend error handling
      if (error.response?.status === 404) {
        setErrors({ email: "Email not registered." });
      } else {
        setMessage("Error sending reset link. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      <div className="rounded-xl px-8 py-10 w-full max-w-md text-center bg-white/80 backdrop-blur">
        {/* Header */}
        <h2 className="text-3xl font-bold text-[#101828] mb-2">
          Forgot Password?
        </h2>
        <p className="text-gray-600 font-medium mb-6">
          No worries, we’ll send you reset instructions
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className={`w-full font-medium border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#11860F]"
              }`}
            />
            {errors.email && (
              <p className="text-red-500  font-medium text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-2 rounded-lg transition-all duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#11860F] hover:bg-green-700"
            }`}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p
            className={`text-sm mt-3 ${
              message.includes("sent") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Back to login */}
        <div className="mt-6">
          <a
            className="flex items-center justify-center cursor-pointer font-medium text-[#475467] text-sm hover:underline"
            onClick={handleLoginRedirect}
          >
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
