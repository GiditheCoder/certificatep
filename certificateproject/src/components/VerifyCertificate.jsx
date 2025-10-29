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

  const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com";

  // 🔹 Handle verification request
  const handleVerify = async () => {
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

  // ✅ Check if backend says redirect to payment
  if (response.data?.success && response.data?.data?.paymentLink) {
    toast.info("Redirecting to payment page...");
    setTimeout(() => {
      window.location.href = response.data.data.paymentLink; // 👈 redirect to Flutterwave
    }, 1500);
  } else {
    toast.success(response.data?.message || "Verification request successful!");
  }

}catch (error) {
      console.error("Verification failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to request verification."
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

        <p className="text-gray-500 mb-6">
          Click below to request a verification code for your certificate.
        </p>

        <button
          onClick={handleVerify}
          disabled={loading}
          className={`mt-2 w-full flex items-center justify-center gap-2 bg-[#11860F] text-white py-3 rounded font-semibold hover:bg-[#0d6b0b] transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Requesting..." : "Request Verification Code"}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="mt-3 text-gray-500 hover:text-[#11860F] text-sm"
        >
          ← Go Back
        </button>
      </div>
      {loading && (
  <p className="text-gray-500 mt-3 text-sm">
    Please wait, redirecting to payment...
  </p>
)}

      <ToastContainer position="top-center" theme="colored" />
    </div>
  );
};

export default VerifyCertificate;
