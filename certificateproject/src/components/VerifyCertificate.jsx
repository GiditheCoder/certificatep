import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShieldCheck } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyCertificate = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const certificateId = state?.certificateId;
  console.log("Certificate ID from state:", certificateId);

  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [certificateRef, setCertificateRef] = useState(""); // 🔹 Store ref from verification response

  const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com";

  // 🔹 Request verification code (sends code to user's email)
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

      toast.success("Verification code has been sent to your email!");
    } catch (error) {
      console.error("Request verification failed:", error);
      const message = error.response?.data?.message;

      if (message?.toLowerCase().includes("already been generated")) {
        toast.info(
          "You already have an active verification code. Please check your email."
        );
      } else {
        toast.error(message || "Failed to request verification code.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Verify certificate using the code from email
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
        const ref = response.data.data?.ref;
        setCertificateRef(ref); // ✅ Save the ref for nullification
        toast.success(`✅ Certificate verified! Ref: ${ref}`);
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

  // 🔹 Nullify verification code using the certificate REF from verify response
  const handleNullifyCode = async () => {
    if (!certificateRef) {
      toast.error("No certificate ref found. Please verify first.");
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
      console.log("🔹 Nullifying verification code for ref:", certificateRef);

      const response = await axios.delete(
        `${baseURL}/api/v1/certificate/nullify-verification/${certificateRef}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Nullify response:", response.data);

      if (response.data?.success) {
        toast.success("Verification code nullified successfully!");
        setCertificateRef("");
        setVerificationCode("");
      } else {
        toast.warn(response.data?.message || "Unable to nullify verification code.");
      }
    } catch (error) {
      console.error("❌ Nullify failed:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Failed to nullify verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <ShieldCheck className="text-[#11860F]" />
          Verify Certificate
        </h2>

        <p className="text-gray-500 mb-4">
          Request a verification code for your certificate.
        </p>

        {/* 🔹 Request verification code */}
        <button
          onClick={handleRequestCode}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 bg-[#11860F] text-white py-3 rounded font-semibold hover:bg-[#0d6b0b] transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Requesting..." : "Request Verification Code"}
        </button>

        {/* 🔹 Input for verification code */}
        <div className="mt-6">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code from email"
            className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 mb-3"
          />

          {/* 🔹 Verify certificate */}
          <button
            onClick={handleVerifyCertificate}
            disabled={loading}
            className={`w-full bg-green-800 text-white py-3 rounded font-semibold hover:bg-green-900 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Verifying..." : "Verify Certificate"}
          </button>

          {/* 🔹 Nullify using data.ref (auto-filled after verification) */}
          <button
            onClick={handleNullifyCode}
            disabled={loading || !certificateRef}
            className={`w-full bg-red-600 text-white py-3 rounded font-semibold hover:bg-red-700 mt-3 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading
              ? "Nullifying..."
              : certificateRef
              ? `Nullify Certificate (${certificateRef})`
              : "Nullify Certificate"}
          </button>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-gray-500 font-medium hover:text-[#11860F] text-sm"
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
