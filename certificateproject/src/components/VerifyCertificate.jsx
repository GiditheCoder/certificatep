// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ShieldCheck } from "lucide-react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const VerifyCertificate = () => {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const certificateId = state?.certificateId;
//   console.log("Certificate ID from state:", certificateId);

//   const [loading, setLoading] = useState(false);

//   const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com";

//   // 🔹 Handle verification request
//   const handleVerify = async () => {
//     if (!certificateId) {
//       toast.error("Missing certificate ID — please go back and try again.");
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Session expired. Please log in again.");
//       navigate("/login");
//       return;
//     }

//    try {
//   setLoading(true);
//   const response = await axios.post(
//     `${baseURL}/api/v1/certificate/request-verification/${certificateId}`,
//     {},
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   console.log("Verification response:", response.data);

//   // ✅ Check if backend says redirect to payment
//   if (response.data?.success && response.data?.data?.paymentLink) {
//     toast.info("Redirecting to payment page...");
//     setTimeout(() => {
//       window.location.href = response.data.data.paymentLink; // 👈 redirect to Flutterwave
//     }, 1500);
//   } else {
//     toast.success(response.data?.message || "Verification request successful!");
//   }

// }catch (error) {
//       console.error("Verification failed:", error);
//       toast.error(
//         error.response?.data?.message || "Failed to request verification."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
//       <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
//         <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
//           <ShieldCheck className="text-[#11860F]" />
//           Verify Certificate
//         </h2>

//         <p className="text-gray-500 mb-6">
//           Click below to request a verification code for your certificate.
//         </p>

//         <button
//           onClick={handleVerify}
//           disabled={loading}
//           className={`mt-2 w-full flex items-center justify-center gap-2 bg-[#11860F] text-white py-3 rounded font-semibold hover:bg-[#0d6b0b] transition ${
//             loading ? "opacity-70 cursor-not-allowed" : ""
//           }`}
//         >
//           {loading ? "Requesting..." : "Request Verification Code"}
//         </button>

//         <button
//           onClick={() => navigate(-1)}
//           className="mt-3 text-gray-500 hover:text-[#11860F] text-sm"
//         >
//           ← Go Back
//         </button>
//       </div>
//       {loading && (
//   <p className="text-gray-500 mt-3 text-sm">
//     Please wait, redirecting to payment...
//   </p>
// )}

//       <ToastContainer position="top-center" theme="colored" />
//     </div>
//   );
// };

// export default VerifyCertificate;


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
  const [step, setStep] = useState("request"); // 'request' | 'verify'

  const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com";

  // 🔹 STEP 1: Request verification code
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

      // ✅ Check for payment link
      if (response.data?.success && response.data?.data?.paymentLink) {
        toast.info("Redirecting to payment page...");
        setTimeout(() => {
          window.location.href = response.data.data.paymentLink;
        }, 1500);
        return;
      }

      // ✅ If a code is returned
      const code = response.data?.data?.verificationCode;
      if (code) {
        setVerificationCode(code);
        toast.success("Verification code generated successfully!");
        setStep("verify");
      } else {
        toast.info("Verification code sent to your registered email.");
        setStep("verify");
      }
    } catch (error) {
      console.error("Request verification failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to request verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 STEP 2: Verify using code
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
      toast.error(error.response?.data?.message || "Error verifying certificate.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Optional: Nullify verification code (cleanup)
  const handleNullifyCode = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${baseURL}/api/v1/certificate/nullify-verification/${certificateId}`
      );
      console.log("Nullify response:", response.data);
      toast.success("Verification code cleared successfully!");
      setVerificationCode("");
      setStep("request");
    } catch (error) {
      toast.error("Failed to nullify verification code.");
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

        {step === "request" && (
          <>
            <p className="text-gray-500 mb-6">
              Click below to request a verification code for your certificate.
            </p>

            <button
              onClick={handleRequestCode}
              disabled={loading}
              className={`mt-2 w-full flex items-center justify-center gap-2 bg-[#11860F] text-white py-3 rounded font-semibold hover:bg-[#0d6b0b] transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Requesting..." : "Request Verification Code"}
            </button>
          </>
        )}

        {step === "verify" && (
          <>
            <p className="text-gray-500 mb-6">
              Enter your verification code to verify this certificate.
            </p>

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
              className={`w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Verifying..." : "Verify Certificate"}
            </button>

            <button
              onClick={handleNullifyCode}
              disabled={loading}
              className="w-full mt-2 text-red-500 hover:text-red-600 text-sm"
            >
              Nullify Verification Code
            </button>
          </>
        )}

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
