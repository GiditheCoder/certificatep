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
  const [paymentMethod, setPaymentMethod] = useState("online");
  const baseURL = "https://certapp-aae046f75d3f.herokuapp.com";

 
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
      const endpoint =
        paymentMethod === "transfer"
          ? `${baseURL}/api/v1/certificate/partner/request-verification/${certificateId}`
          : `${baseURL}/api/v1/certificate/request-verification/${certificateId}`;
      const response = await axios.post(
        endpoint,
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (paymentMethod === "transfer") {
        const paymentData = response.data?.data?.paymentData;
        const accountData = paymentData?.data ?? paymentData;
        if (
          response.data?.success &&
          accountData?.accountName &&
          accountData?.accountNumber
        ) {
          navigate("/bank-transfer", {
            state: {
              flow: "certificate-verification",
              transferDetails: {
                applicationId:
                  response.data.data.applicationId ??
                  response.data.data.certificateId ??
                  certificateId,
                accountName: accountData.accountName,
                accountNumber: accountData.accountNumber,
                expiryDateTime:
                  accountData.expiryDateTime || accountData.expiryTime,
              },
            },
          });
        } else {
          toast.error(
            response.data?.message ||
              "The bank transfer account could not be created."
          );
        }
        return;
      }

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

        <fieldset className="mb-4 space-y-3 rounded-lg border border-gray-200 p-4 text-left">
          <legend className="px-1 text-sm font-semibold text-gray-800">
            Payment method
          </legend>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value="online"
              checked={paymentMethod === "online"}
              onChange={() => setPaymentMethod("online")}
              disabled={loading}
              className="mt-1 accent-green-700"
            />
            <span>
              <span className="block text-sm font-medium text-gray-800">
                Online payment
              </span>
              <span className="block text-xs text-gray-500">
                Continue to the secure online payment page.
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value="transfer"
              checked={paymentMethod === "transfer"}
              onChange={() => setPaymentMethod("transfer")}
              disabled={loading}
              className="mt-1 accent-green-700"
            />
            <span>
              <span className="block text-sm font-medium text-gray-800">
                Bank transfer
              </span>
              <span className="block text-xs text-gray-500">
                Generate a temporary account for your verification request.
              </span>
            </span>
          </label>
        </fieldset>

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
          {loading
            ? paymentMethod === "transfer"
              ? "Creating account..."
              : "Sending..."
            : paymentMethod === "transfer"
              ? "Continue with Bank Transfer"
              : "Send Verification Code"}
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
