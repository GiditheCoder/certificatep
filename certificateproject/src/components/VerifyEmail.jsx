import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [codeArray, setCodeArray] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(600); // 🕒 10 minutes
  const email = location.state?.email || "";
  const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com";

  // 🕒 Countdown effect
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(countdown);
  }, [timer]);

  // 🧮 Format time as MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // 🧩 OTP Input Handlers
  const handleInputChange = (e, index) => {
    const value = e.target.value.slice(-1); // only one character
    const newCode = [...codeArray];
    newCode[index] = value;
    setCodeArray(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (codeArray[index] === "" && index > 0) {
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        if (prevInput) prevInput.focus();
      }

      const newCode = [...codeArray];
      newCode[index] = "";
      setCodeArray(newCode);
    }
  };

  // ✅ Handle Verification
  const handleVerify = async (e) => {
    e.preventDefault();
    const otp = codeArray.join("");

    if (!otp || otp.length < 6) {
      toast.warn("Please enter the 6-digit OTP sent to your email.", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${baseURL}/api/v1/auth/email/verify`, {
        email,
        otp,
      });
      console.log("✅ Verify Response:", res.data);

      toast.success(res.data.message || "Email verified successfully!", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error("❌ Verify Error:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.message || "Invalid OTP or verification failed.";

      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-md p-8 text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Verify Your Email
        </h2>
        <p className="text-sm  text-gray-500 mb-6 ">
          An OTP has been sent to <strong>{email}</strong> (valid for 10 minutes)
        </p>

        {/* OTP Input Area */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center space-x-3 sm:space-x-4 mb-2">
            {codeArray.map((char, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={char}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-lg sm:text-xl border border-gray-400 rounded-md text-black focus:outline-none focus:border-green-600 transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#11860F] text-white font-semibold py-3 rounded-md hover:bg-[#0b5b0a] transition-colors"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {/* 🕓 Timer Visualization */}
        <div className="mt-6">
          <p className="text-sm text-gray-600">
            OTP expires in <strong>{formatTime(timer)}</strong>
          </p>

          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${((600 - timer) / 600) * 100}%` }}
            />
          </div>
        </div>
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

export default VerifyEmail;

