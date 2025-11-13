import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShieldCheck } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyCertificate = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const certificateId = state?.certificateId;
  const fromStart = state?.fromStart || false;

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [fetchedCode, setFetchedCode] = useState(""); // ✅ for displaying fetched code
  const [inputCode, setInputCode] = useState("");     // ✅ for user input
  const [certificateRef, setCertificateRef] = useState("");

  const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com";


const handleVerifyCertificate = async () => {
  if (!inputCode) {
    toast.error("Please enter your verification code.");
    return;
  }

  try {
    setLoading(true);

    // Step 1: Verify code
    const verifyResponse = await axios.get(`${baseURL}/api/v1/certificate/verify/${inputCode}`);
    console.log("Full verification response:", verifyResponse.data);


    if (!verifyResponse.data?.success) {
      toast.warn("Invalid or expired verification code.");
      return;
    }

    // const certificate = verifyResponse.data.data?.certificate;
    const certificate = verifyResponse?.data?.data?.certificate;

    console.log("Verified certificate data:", certificate);
    if (!certificate || !certificate.application?._id) {
      console.log(certificate.application?._id)
      toast.error("Verification failed — application ID not found.");
      return;
    }

    toast.success("✅ Certificate verified successfully!");

    // Navigate using application _id
   const applicationId = certificate?.application?._id 

if (!applicationId) {
  toast.error("Application ID not found for navigation.");
  return;
}

console.log("Navigating to certificate with application ID:", applicationId);
console.log("certificate.application:", certificate.application);
console.log("certificate.application._id:", certificate.application?._id);

    // navigate(`/certificate/${applicationId} , { state: { fromVerification: true }}`);
    navigate(`/certificate/${applicationId}`, { state: { fromVerification: true } });


    // Nullify verification in background
    setTimeout(async () => {
      try {
        await axios.delete(`${baseURL}/api/v1/certificate/nullify-verification/${certificate.certificateRef}`);
        console.log(`Verification for ${certificate.certificateRef} nullified ✅`);
      } catch (err) {
        console.warn("Failed to nullify verification:", err);
      }
    }, 500);

  } catch (error) {
    console.error("Error verifying certificate:", error);
    toast.error("Error verifying certificate.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">

         {fetchedCode && (
          <div className="mb-4 text-left">
            <span className="text-gray-600 font-semibold">
              Your verification code: <strong>{fetchedCode}</strong>
            </span>
          </div>
        )}

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <ShieldCheck className="text-[#11860F]" />
          Verify Certificate
        </h2>

        {!fromStart && (
          <>
            {/* Optional: Request verification code UI if needed */}
          </>
        )}

        {/* Display fetched verification code outside input */}
     

        {/* User input for verification */}
        <div className="mt-6 text-left">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Enter verification code here"
            className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-green-700"
          />

          <button
            onClick={handleVerifyCertificate}
            disabled={loading}
            className={`w-full bg-green-800 text-white py-3 rounded font-semibold hover:bg-green-900 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Verifying..." : "Verify Certificate"}
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
