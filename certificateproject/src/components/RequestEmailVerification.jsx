import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const RequestEmailVerification = () => {
  const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com";
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // 🔹 States
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("request"); // 'request' or 'verify'
  const [codeArray, setCodeArray] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(600); // 10 minutes countdown
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  // 🔹 Sync user email
  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  // 🔹 Countdown effect
  useEffect(() => {
    let countdown;
    if (step === "verify" && timer > 0) {
      countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true); // ✅ Enable resend button when expired
    }
    return () => clearTimeout(countdown);
  }, [timer, step]);

  // 🔹 Format time as MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // 🔹 Handle OTP input change
  const handleInputChange = (e, index) => {
    const value = e.target.value.slice(-1);
    const newCode = [...codeArray];
    newCode[index] = value;
    setCodeArray(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // 🔹 Handle backspace
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

  // 🔹 Request Verification
  const handleRequestVerification = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.warn("Please enter your email.", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to request verification.", {
          position: "top-center",
          theme: "colored",
        });
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${baseURL}/api/v1/auth/email/request-verification`,
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.message || "Verification code sent!", {
        position: "top-center",
        theme: "colored",
      });

      updateUser({ ...user, state: "pending-verification" });
      setStep("verify");
      setTimer(600);
      setCodeArray(["", "", "", "", "", ""]);
      setCanResend(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send verification code.",
        { position: "top-center", theme: "colored" }
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Verify OTP
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

      toast.success(res.data.message || "Email verified successfully!", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });

      updateUser({ ...user, state: "verified" });
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid OTP or verification failed.",
        { position: "top-center", autoClose: 4000, theme: "colored" }
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Resend OTP when expired
  const handleResendOtp = async () => {
    setResending(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to resend OTP.", {
          position: "top-center",
          theme: "colored",
        });
        setResending(false);
        return;
      }

      const res = await axios.post(
        `${baseURL}/api/v1/auth/resend-otp`,
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.message || "A new OTP has been sent!", {
        position: "top-center",
        theme: "colored",
      });

      setCodeArray(["", "", "", "", "", ""]);
      setTimer(600);
      setCanResend(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to resend OTP.",
        { position: "top-center", theme: "colored" }
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-md p-8 text-center">
        {step === "request" && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Request Email Verification
            </h2>
            <form onSubmit={handleRequestVerification} className="space-y-6">
              <p className="w-full p-3 border font-bold border-gray-300 rounded-md bg-gray-100 text-gray-700">
                {email || "Loading user email..."}
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#11860F] text-white font-semibold py-3 rounded-md hover:bg-[#0b5b0a] transition-colors"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </form>
          </>
        )}

        {step === "verify" && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Verify Your Email
            </h2>
            <p className="text-sm font-medium text-gray-500 mb-6">
              An OTP has been sent to <strong>{email}</strong> (valid for 10 minutes)
            </p>

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
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-lg sm:text-xl font-medium border border-gray-400 rounded-md text-black focus:outline-none focus:border-green-600 transition-all"
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

            {/* 🕒 Timer + Progress */}
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

              {/* 🔁 Resend Button */}
              {canResend && (
                <button
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="mt-4 w-full bg-[#11860F] text-white font-semibold py-3 rounded-md hover:bg-[#0b5b0a] transition-colors"
                >
                  {resending ? "Resending..." : "Resend OTP"}
                </button>
              )}
            </div>
          </>
        )}
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

export default RequestEmailVerification;

