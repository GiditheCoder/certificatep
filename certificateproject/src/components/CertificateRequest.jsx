// CertificateRequest.jsx
import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CertificateRequest = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const certificateId = state?.certificateId;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com";

 
  // ✅ Request verification code
  const handleRequestCode = async () => {
    if (!certificateId) {
      toast.error("Missing certificate ID — please go back and try again.");
      return;
    }
    if (!email) {
      toast.error("Please enter your email to receive the verification code.");
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
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.success && response.data?.data?.paymentLink) {
        toast.info("Redirecting to payment page...");
        setTimeout(() => {
          window.location.href = response.data.data.paymentLink;
        }, 1500);
        return;
      }

      toast.success("Verification code has been sent to your email!");
    } catch (error) {
      const message = error.response?.data?.message;
      if (message?.toLowerCase().includes("already been generated")) {
        toast.info("You already have an active verification code. Please check your email.");
      } else {
        toast.error(message || "Failed to request verification code.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2 text-gray-800">
          <ShieldCheck className="text-[#11860F]" />
          Request Verification Code
        </h2>
        <p className="text-gray-500 mb-4">
          Enter your email to receive a verification code for your certificate.
        </p>

        <input
          type="email"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 font-semibold"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />

        <button
          onClick={handleRequestCode}
          disabled={loading}
          className={`w-full bg-[#11860F] text-white py-3 rounded font-semibold hover:bg-green-700 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Sending..." : "Send Verification Code"}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-gray-500 hover:text-[#11860F] text-sm font-medium"
        >
          ← Go Back
        </button>
      </div>
      <ToastContainer position="top-center" theme="colored" />
    </div>
  );
};

export default CertificateRequest;
