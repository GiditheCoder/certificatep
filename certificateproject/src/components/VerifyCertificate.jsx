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
//    const [email, setEmail] = useState(""); // ✅ Added email state
//   const [verificationCode, setVerificationCode] = useState("");
//   const [certificateRef, setCertificateRef] = useState(""); // 🔹 Store ref from verification response

//   const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com";

//   // ✅ Request verification code (sends code to user's email)
//   const handleRequestCode = async () => {
//     if (!certificateId) {
//       toast.error("Missing certificate ID — please go back and try again.");
//       return;
//     }

//     if (!email) {
//       toast.error("Please enter your email to receive the verification code.");
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Session expired. Please log in again.");
//       navigate("/login");
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `${baseURL}/api/v1/certificate/request-verification/${certificateId}`,
//         { email }, // ✅ send email in request body
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log("Verification response:", response.data);

//       if (response.data?.success && response.data?.data?.paymentLink) {
//         toast.info("Redirecting to payment page...");
//         setTimeout(() => {
//           window.location.href = response.data.data.paymentLink;
//         }, 1500);
//         return;
//       }

//       toast.success("Verification code has been sent to your email!");
//     } catch (error) {
//       console.error("Request verification failed:", error);
//       const message = error.response?.data?.message;

//       if (message?.toLowerCase().includes("already been generated")) {
//         toast.info(
//           "You already have an active verification code. Please check your email."
//         );
//       } else {
//         toast.error(message || "Failed to request verification code.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Verify certificate → auto-nullify → navigate to /certificate/:ref
// const handleVerifyCertificate = async () => {
//   if (!verificationCode) {
//     toast.error("Please enter your verification code.");
//     return;
//   }

//   try {
//     setLoading(true);

//     // Step 1: Verify certificate
//     const verifyResponse = await axios.get(
//       `${baseURL}/api/v1/certificate/verify/${verificationCode}`
//     );

//     console.log("Verify response:", verifyResponse.data);

//     if (!verifyResponse.data?.success) {
//       toast.warn("Invalid or expired verification code.");
//       setLoading(false);
//       return;
//     }

//     const ref = verifyResponse.data.data?.ref;
//     setCertificateRef(ref);

//     toast.success(`✅ Certificate verified successfully! Ref: ${ref}`);

//     // Step 2: Automatically nullify
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Session expired. Please log in again.");
//       return;
//     }

//     console.log("🔹 Nullifying verification code for ref:", ref);
//     const nullifyResponse = await axios.delete(
//       `${baseURL}/api/v1/certificate/nullify-verification/${ref}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     console.log("✅ Nullify response:", nullifyResponse.data);

//     if (nullifyResponse.data?.success) {
//       toast.info("Verification code nullified automatically!");
//     } else {
//       toast.warn(
//         nullifyResponse.data?.message ||
//           "Certificate verified, but nullification failed."
//       );
//     }

//      // ✅ Step 3: Redirect to confirmation page
//     setTimeout(() => {
//       navigate(`/certificate-confirmation/${ref}`, {
//         state: {
//           ref,
//           message:
//             "This is to certify that this certificate is from the Ogun State Local Government.",
//         },
//       });
//     }, 1200);

 
//   } catch (error) {
//     console.error("Verification/nullify failed:", error);
//     toast.error(
//       error.response?.data?.message ||
//         "Error verifying and nullifying certificate."
//     );
//   } finally {
//     setLoading(false);
//   }
// };



//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
//       <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
//         <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
//           <ShieldCheck className="text-[#11860F]" />
//           Verify Certificate
//         </h2>

//         <p className="text-gray-500 mb-4">
//           Request a verification code for your certificate.
//         </p>

//         <input
//   type="email"
//   value={email}
//   onChange={(e) => setEmail(e.target.value)}
//   placeholder="Enter your email"
//   className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3"
// />


//         {/* 🔹 Request verification code */}
//         <button
//           onClick={handleRequestCode}
//           disabled={loading}
//           className={`w-full flex items-center justify-center gap-2 bg-[#11860F] text-white py-3 rounded font-semibold hover:bg-[#0d6b0b] transition ${
//             loading ? "opacity-70 cursor-not-allowed" : ""
//           }`}
//         >
//           {loading ? "Requesting..." : "Request Verification Code"}
//         </button>

//         {/* 🔹 Input for verification code */}
//         <div className="mt-6">
//           <input
//             type="text"
//             value={verificationCode}
//             onChange={(e) => setVerificationCode(e.target.value)}
//             placeholder="Enter verification code from email"
//             className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 mb-3"
//           />

//           {/* 🔹 Verify certificate */}
//           <button
//             onClick={handleVerifyCertificate}
//             disabled={loading}
//             className={`w-full bg-green-800 text-white py-3 rounded font-semibold hover:bg-green-900 transition ${
//               loading ? "opacity-70 cursor-not-allowed" : ""
//             }`}
//           >
//             {loading ? "Verifying..." : "Verify Certificate"}
//           </button>

     
//         </div>

//         <button
//           onClick={() => navigate(-1)}
//           className="mt-4 text-gray-500 font-medium hover:text-[#11860F] text-sm"
//         >
//           ← Go Back
//         </button>
//       </div>

//       {loading && (
//         <p className="text-gray-500 mt-3 text-sm">
//           Please wait, processing request...
//         </p>
//       )}

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
  const fromStart = state?.fromStart || false; // ✅ detect if from Start.jsx

  console.log("Certificate ID from state:", certificateId, "From start:", fromStart);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [certificateRef, setCertificateRef] = useState("");

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

  // ✅ Verify certificate → auto-nullify → navigate to confirmation
  const handleVerifyCertificate = async () => {
    if (!verificationCode) {
      toast.error("Please enter your verification code.");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Verify certificate
      const verifyResponse = await axios.get(`${baseURL}/api/v1/certificate/verify/${verificationCode}`);

      if (!verifyResponse.data?.success) {
        toast.warn("Invalid or expired verification code.");
        setLoading(false);
        return;
      }

      const ref = verifyResponse.data.data?.ref;
      setCertificateRef(ref);
      toast.success(`✅ Certificate verified successfully! Ref: ${ref}`);

      // Step 2: Automatically nullify
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      await axios.delete(`${baseURL}/api/v1/certificate/nullify-verification/${ref}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.info("Verification code nullified automatically!");

      // Step 3: Redirect to confirmation
      setTimeout(() => {
        navigate(`/certificate-confirmation/${ref}`, {
          state: {
            ref,
            message: "This is to certify that this certificate is from the Ogun State Local Government.",
          },
        });
      }, 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error verifying and nullifying certificate.");
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

        {!fromStart && (
          <>
            <p className="text-gray-500 mb-4">Request a verification code for your certificate.</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3"
            />

            <button
              onClick={handleRequestCode}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 bg-[#11860F] text-white py-3 rounded font-semibold hover:bg-[#0d6b0b] transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Requesting..." : "Request Verification Code"}
            </button>
          </>
        )}

        {/* Always show code verification section */}
        <div className="mt-6">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code from email"
            className="w-full border font-semibold border-gray-300 rounded-md px-3 py-2 mb-3"
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

      {loading && <p className="text-gray-500 mt-3 text-sm">Please wait, processing request...</p>}

      <ToastContainer position="top-center" theme="colored" />
    </div>
  );
};

export default VerifyCertificate;
