import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShieldCheck, Copy } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyCertificate = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const certificateId = state?.certificateId;
  console.log("Certificate ID from state:", certificateId);

  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
   

  const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com";


  // 🔹 Request verification code
 const handleRequestCode = async () => {
  if (!certificateId) {
    toast.error("Missing certificate ID — please go back and try again.");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Session expired. Please log in again.");
    navigate("/login");
    return;
  }

  try {
    setLoading(true);
    const response = await axios.post(
      `${baseURL}/api/v1/certificate/request-verification/${certificateId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Verification response:", response.data);

    if (response.data?.success && response.data?.data?.paymentLink) {
      toast.info("Redirecting to payment page...");
      setTimeout(() => {
        window.location.href = response.data.data.paymentLink;
      }, 1500);
      return;
    }

    const code = response.data?.data?.verificationCode;

    if (code) {
      // ✅ Log the generated verification code here
      console.log("✅ Generated verification code:", code);

      setVerificationCode(code);
      toast.success("Verification code generated successfully!");
      setStep("verify");
    } else {
      toast.info("Verification code sent to your registered email.");
      setStep("verify");
    }
  } catch (error) {
    console.error("Request verification failed:", error);
    const message = error.response?.data?.message;

    if (message?.toLowerCase().includes("already been generated")) {
      toast.info(
        "You already have an active verification code. You can get it below or delete it."
      );
      setStep("verify");
    } else {
      toast.error(message || "Failed to request verification code.");
    }
  } finally {
    setLoading(false);
  }
};


  // 🔹 Get verification code (GET axios)
  const handleGetCode = async () => {
    if (!certificateId) {
      toast.error("Missing certificate ID — please go back and try again.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${baseURL}/api/v1/certificate/verify/${certificateId}`
      );
      console.log("Get verification response:", response.data);

      const code = response.data?.data?.verificationCode;
      if (code) {
        setVerificationCode(code);
        toast.success("Verification code retrieved successfully!");
        setStep("verify");
      } else {
        toast.info("No active verification code found. Request a new one.");
      }
    } catch (error) {
      console.error("Failed to get code:", error);
      toast.error("Unable to fetch verification code.");
    } finally {
      setLoading(false);
    }
  };



  

  // 🔹 Nullify code
  const handleNullifyCode = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${baseURL}/api/v1/certificate/nullify-verification/${certificateId}`
      );
      console.log("Nullify response:", response.data);
      toast.success("Verification code deleted successfully!");
      setVerificationCode("");
      setStep("request");
    } catch (error) {
      toast.error("Failed to delete verification code.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Verify certificate
  const handleVerifyCertificate = async () => {
    if (!verificationCode) {
      toast.error("Please enter your verification code.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${baseURL}/api/v1/certificate/verify/${verificationCode}`
      );

      console.log("Verify response:", response.data);

      if (response.data?.success) {
        toast.success("Certificate verified successfully!");
      } else {
        toast.warn("Invalid or expired verification code.");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error(
        error.response?.data?.message || "Error verifying certificate."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Copy to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(verificationCode);
    toast.success("Verification code copied!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <ShieldCheck className="text-[#11860F]" />
          Verify Certificate
        </h2>

        {/* 🔹 Request button always visible */}
        <p className="text-gray-500 mb-4">
          Click below to request a verification code for your certificate.
        </p>

        <button
          onClick={handleRequestCode}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 bg-[#11860F] text-white py-3 rounded font-semibold hover:bg-[#0d6b0b] transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Requesting..." : "Request Verification Code"}
        </button>

        {/* 🔹 Always show Get & Delete buttons */}
        <div className="mt-4 flex gap-2 justify-between">
          <button
            onClick={handleGetCode}
            disabled={loading}
            className={`flex-1 bg-green-700 text-white py-3 rounded font-semibold hover:bg-green-800 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Getting..." : "Get Verification Code"}
          </button>

          <button
            onClick={handleNullifyCode}
            disabled={loading}
            className={`flex-1 bg-red-600 text-white py-3 rounded font-semibold hover:bg-red-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Deleting..." : "Delete Verification Code"}
          </button>
        </div>

        {/* 🔹 Display code if exists */}
        {verificationCode && (
          <div className="mt-6 bg-green-50 border border-green-300 rounded-md p-3 text-green-700 relative">
            <p className="font-semibold">Your Verification Code:</p>
            <p className="text-lg font-mono">{verificationCode}</p>

            <button
              onClick={handleCopyCode}
              className="absolute top-2 right-2 text-green-600 hover:text-green-800"
              title="Copy to clipboard"
            >
              <Copy size={18} />
            </button>
          </div>
        )}

        {/* 🔹 Verify certificate input */}
        <div className="mt-4">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3"
          />

          <button
            onClick={handleVerifyCertificate}
            disabled={loading}
            className={`w-full bg-gray-800 text-white py-3 rounded font-semibold hover:bg-gray-900 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Verifying..." : "Verify Certificate"}
          </button>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-gray-500 hover:text-[#11860F] text-sm"
        >
          ← Go Back
        </button>
      </div>

      {loading && (
        <p className="text-gray-500 mt-3 text-sm">
          Please wait, processing request...
        </p>
      )}

      <ToastContainer position="top-center" theme="colored" />
    </div>
  );
};

export default VerifyCertificate;


