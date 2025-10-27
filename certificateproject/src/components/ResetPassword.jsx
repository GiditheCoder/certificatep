import React, { useState, useEffect } from "react";
import axios from "axios";
import Bg from "../images/Bg.png";
import { Eye, EyeOff } from "lucide-react";
import { useLocation } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const [codeArray, setCodeArray] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState(location.state?.email || ""); // 🟢 prefill email
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 🕒 Timer state (10 minutes = 600 seconds)
  const [timeLeft, setTimeLeft] = useState(600);
  const [resending, setResending] = useState(false);

  // 🕒 Countdown effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // ⏱ Format MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // 📨 Handle resend OTP
  const handleResendOtp = async () => {
    if (!email) {
      setErrors({ email: "Please enter your email before requesting OTP." });
      return;
    }

    setResending(true);
    setMessage("");
    try {
      const res = await axios.post(
        "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/auth/resend-otp",
        { email }
      );

      setMessage(res.data.message || "A new OTP has been sent to your email.");
      setCodeArray(["", "", "", "", "", ""]);
      setTimeLeft(600); // 🟢 restart timer
    } catch (error) {
      console.error("Error resending OTP:", error);
      setMessage(
        error.response?.data?.message ||
          "Failed to send OTP. Please try again later."
      );
    } finally {
      setResending(false);
    }
  };

  // 🧩 Handle OTP input
  const handleInputChange = (e, index) => {
    const value = e.target.value.slice(-1);
    const newCode = [...codeArray];
    newCode[index] = value;
    setCodeArray(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (codeArray[index] === "" && index > 0) {
        const prevInput = document.getElementById(`code-input-${index - 1}`);
        if (prevInput) prevInput.focus();
      }

      const newCode = [...codeArray];
      newCode[index] = "";
      setCodeArray(newCode);
    }
  };

  // 🔐 Handle password reset
  const handleResetPassword = async () => {
    const otp = codeArray.join("");
    const newErrors = {};

    if (!email) newErrors.email = "Email is required.";
    if (!otp || otp.length < 6) newErrors.otp = "OTP code must be 6 digits.";
    if (!newPassword) newErrors.newPassword = "New password is required.";
    else if (newPassword.length < 8)
      newErrors.newPassword = "Password must be at least 8 characters.";
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password.";
    else if (newPassword !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    setMessage("");

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "https://lgacertificate-011d407b356b.herokuapp.com/api/reset-password",
        {
          email,
          otp,
          password: newPassword,
          confirmPassword,
        }
      );

      setMessage(response.data.message || "Password reset successful!");
      setErrors({});
      setCodeArray(["", "", "", "", "", ""]);
      setNewPassword("");
      setConfirmPassword("");
      setTimeLeft(0);
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage(
        error.response?.data?.message || "Failed to reset password. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 sm:px-6"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-white text-2xl sm:text-3xl font-bold text-center mb-6">
          Set a New Password
        </h1>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            readOnly
            className="w-full font-medium px-4 py-4 border rounded-lg text-black bg-gray-200 cursor-not-allowed"
          />
        </div>

        {/* OTP Inputs */}
        <div className="flex space-x-2 sm:space-x-3 mb-2 justify-center">
          {codeArray.map((char, index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={char}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength={1}
              className={`w-10 h-10 sm:w-12 sm:h-12 text-black text-lg text-center rounded-md bg-transparent border 
                focus:outline-none focus:border-green-600 transition 
                ${errors.otp ? "border-red-500" : "border-[#3c3c51]"}`}
            />
          ))}
        </div>
        {errors.otp && (
          <p className="text-red-500 text-sm text-center">{errors.otp}</p>
        )}

        {/* Timer or Resend */}
        <div className="text-center font-medium text-gray-600 text-sm mt-2">
          {timeLeft > 0 ? (
            <p className="font-medium">
              OTP expires in{" "}
              <span className="text-green-600 font-semibold">
                {formatTime(timeLeft)}
              </span>
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
              disabled={resending}
              className="text-green-600 font-semibold hover:underline"
            >
              {resending ? "Sending OTP..." : "Get / Resend OTP"}
            </button>
          )}
        </div>

        {/* New Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-4 border rounded-lg text-black placeholder-gray-400 pr-12 focus:border-green-600 focus:outline-none border-[#3c3c51]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-4 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-4 border rounded-lg text-black placeholder-gray-400 pr-12 focus:border-green-600 focus:outline-none border-[#3c3c51]"
          />
          
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-4 text-gray-500"
             >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>

        </div>

        {/* API Message */}
        {message && (
          <p
            className={`text-center text-sm ${
              message.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Submit Button */}
        <button
          onClick={handleResetPassword}
          disabled={loading}
          className="w-full bg-[#11860F] text-white font-semibold py-4 rounded-lg hover:bg-[#0c670b] transition"
        >
          {loading ? "Resetting..." : "Set New Password"}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;

