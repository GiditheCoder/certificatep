import React, { useState, useEffect } from "react";
import axios from "axios";
import Bg from "../images/Bg.png";
import { Eye, EyeOff } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const navigate = useNavigate();
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
  const passwordsDoNotMatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;
  const passwordMismatchStyle = passwordsDoNotMatch
    ? { borderColor: "#ef4444" }
    : undefined;

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
        "https://certapp-aae046f75d3f.herokuapp.com/api/v1/auth/resend-otp",
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
    setErrors((previousErrors) => ({ ...previousErrors, otp: "" }));
    setMessage("");

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

  if (Object.keys(newErrors).length > 0) {
    toast.error(Object.values(newErrors)[0], {
      position: "top-center",
      autoClose: 4000,
      theme: "colored",
    });
    return;
  }

  setLoading(true);
  try {
    const response = await axios.post(
      "https://certapp-aae046f75d3f.herokuapp.com/api/v1/auth/reset-password",
      {
        email,
        otp,
        password: newPassword,
        confirmPassword,
      }
    );

    const responseMessage =
      response.data?.message || response.data?.error || "";
    const responseIndicatesInvalidOtp =
      response.data?.success === false ||
      /(?:invalid|incorrect|expired|wrong|not valid).{0,30}(?:otp|one.?time|verification code|code)|(?:otp|one.?time|verification code|code).{0,30}(?:invalid|incorrect|expired|wrong|not valid)/i.test(
        responseMessage
      );

    if (responseIndicatesInvalidOtp) {
      const errorMessage =
        typeof responseMessage === "string" && responseMessage
          ? responseMessage
          : "Invalid OTP. Please check the code and try again.";
      setErrors((previousErrors) => ({ ...previousErrors, otp: errorMessage }));
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
      });
      return;
    }

    // ✅ Reset UI
    setMessage("🎉 Password reset successful! Redirecting to login...");
    setErrors({});
    setCodeArray(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setTimeLeft(0);

    // ✅ Add simple animation (fade-in/out)
    const msgEl = document.getElementById("reset-message");
    if (msgEl) {
      msgEl.classList.add("animate-pulse"); // Tailwind pulse animation
    }

    // ✅ Redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 1000);

    // Clean up timer if component unmounts
    return () => clearTimeout(timer);

  } catch (error) {
    console.error("Error resetting password:", error);
    const rawApiMessage =
      error.response?.data?.message || error.response?.data?.error || "";
    const apiMessage =
      typeof rawApiMessage === "string" ? rawApiMessage : "";
    const isInvalidOtp =
      /(?:invalid|incorrect|expired|wrong|not valid).{0,30}(?:otp|one.?time|verification code|code)|(?:otp|one.?time|verification code|code).{0,30}(?:invalid|incorrect|expired|wrong|not valid)/i.test(
        apiMessage
      ) || (!apiMessage && [400, 401, 422].includes(error.response?.status));

    if (isInvalidOtp) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        otp: "Invalid OTP. Please check the code and try again.",
      }));
      setMessage("");
      toast.error("Invalid OTP. Please check the code and try again.", {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
      });
    } else {
      toast.error(apiMessage || "Failed to reset password. Try again.", {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
      });
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 sm:px-6"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      <ToastContainer
        position="top-center"
        autoClose={4000}
        theme="colored"
        style={{ zIndex: 9999 }}
      />
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
              className={`w-10 h-10 sm:w-12 sm:h-12 font-semibold text-black text-lg text-center rounded-md bg-transparent border 
                focus:outline-none focus:border-green-600 transition 
                ${errors.otp ? "border-red-500" : "border-[#3c3c51]"}`}
            />
          ))}
        </div>

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
            style={passwordMismatchStyle}
            className={`w-full px-4 py-4 border rounded-lg font-semibold text-black placeholder-gray-400 pr-12 focus:outline-none ${
              passwordsDoNotMatch
                ? "border-red-500 focus:border-red-500"
                : "border-[#3c3c51] focus:border-green-600"
            }`}
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
            style={passwordMismatchStyle}
            className={`w-full px-4 py-4 border rounded-lg font-semibold text-black placeholder-gray-400 pr-12 focus:outline-none ${
              passwordsDoNotMatch
                ? "border-red-500 focus:border-red-500"
                : "border-[#3c3c51] focus:border-green-600"
            }`}
          />
          
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-4 text-gray-500"
             >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>

        </div>
        {passwordsDoNotMatch && (
          <p className="text-sm font-bold" style={{ color: "#ef4444" }}>
            Passwords do not match.
          </p>
        )}

        {/* API Message */}
        {message && (
  <p
    id="reset-message"
    className={`text-center font-semibold text-sm transition-all duration-700 ${
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
          type="button"
          onClick={handleResetPassword}
          disabled={loading}
          className="w-full bg-[#11860F] text-white font-semibold py-4 rounded-lg hover:bg-[#0c670b] transition"
        >
          {loading ? "Resetting..." : "Set New Password"}
        </button>
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

export default ResetPassword;
