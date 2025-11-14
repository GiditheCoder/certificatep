import React, { useState, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ShieldCheck } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StateLogo from "../images/StateLogo.png";
import MenuLogo from "../images/menu.png";
import CloseLogo from "../images/close.png";

const VerifyCertificate = () => {
  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifiedData, setVerifiedData] = useState(null);
  const [signatory, setSignatory] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const certRef = useRef(null);

  const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com";// Adjust if needed


  const handleVerifyCertificate = async () => {
  if (!inputCode.trim()) {
    toast.error("Enter a verification code");
    return;
  }

  setLoading(true);
  try {
    const res = await axios.get(`${baseURL}/api/v1/certificate/verify/${inputCode}`);
    const { data } = res.data;

    toast.success("Certificate verified successfully!");
    setVerifiedData(data); // Only set verified data here
    console.log("✅ Certificate verified:", data);
  } catch (error) {
    console.error(error);
    toast.error(
      error?.response?.data?.message || "Failed to verify certificate. Please check your code."
    );
  } finally {
    setLoading(false);
  }
};


React.useEffect(() => {
  if (!verifiedData) return;

  const certificateRef = verifiedData.certificate.certificateRef;
  if (!certificateRef) return;

  // Nullify verification after 0.5s in the background
  const timer = setTimeout(async () => {
    try {
      await axios.delete(`${baseURL}/api/v1/certificate/nullify-verification/${certificateRef}`);
      console.log(`Verification for ${certificateRef} nullified ✅`);
    } catch (err) {
      console.warn("Failed to nullify verification:", err);
    }
  }, 1000);

  // Cleanup in case component unmounts before timeout
  return () => clearTimeout(timer);

}, [verifiedData]);



React.useEffect(() => {
  if (!verifiedData) return;

  const certificateApp = verifiedData.certificate.application;
  const { stateOfOrigin, lga, lgaOfResident } = certificateApp;

  const effectiveLga =
    stateOfOrigin?.toLowerCase() === "ogun" ? lga : lgaOfResident;

  if (!effectiveLga) return;

  const fetchSignatory = async () => {
    try {
      const signRes = await axios.get(
        `${baseURL}/api/v1/signatory/${encodeURIComponent(effectiveLga)}`
      );
      setSignatory(signRes.data.data || signRes.data);
    } catch (error) {
      console.error("❌ Failed to fetch signatory:", error);
      toast.error("Failed to fetch signatory data");
    }
  };

  fetchSignatory();
}, [verifiedData]);


  
   const downloadPDF = async () => {
    if (!certRef.current) return console.warn("Certificate element not found");

    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        foreignObjectRendering: false,
        onclone: (clonedDoc) => {
          const allElements = clonedDoc.body.querySelectorAll("*");
          allElements.forEach((el) => {
            const style = window.getComputedStyle(el);
            if (style.color && style.color.includes("oklch")) el.style.color = "#000000";
            if (style.backgroundColor && style.backgroundColor.includes("oklch"))
              el.style.backgroundColor = "#ffffff";
            if (style.borderColor && style.borderColor.includes("oklch"))
              el.style.borderColor = "#d1d5db";
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`${name || "certificate"}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };
 

  // Loading State
  if (loading && !verifiedData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700 px-4 text-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-semibold">Verifying certificate...</p>
      </div>
    );
  }

  // Certificate display when verified
  if (verifiedData) {
    const cert = verifiedData.certificate;
    const app = cert.application;

    const {
      fullNames,
      currentAddress,
      lga,
      email,
      lgaOfResident,
      stateOfOrigin,
      passport,
      updatedAt,
      _id: certificateId,
    } = app;

    const approvedDate = updatedAt;

    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* HEADER */}
        <header className="flex justify-between items-center border-b border-gray-200 w-full px-4 sm:px-6 py-3 fixed top-0 left-0 bg-white z-50">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src={StateLogo} alt="State Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
            <span className="text-sm sm:text-lg font-semibold text-[#475467]">
              Ogun State Government
            </span>
          </div>

          <div className="sm:hidden">
            <img
              src={MenuLogo}
              alt="Menu"
              className="w-6 h-6 cursor-pointer"
              onClick={() => setMenuOpen(true)}
            />
          </div>
        </header>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="sm:hidden absolute top-14 right-4 bg-white shadow-lg border rounded-md p-4 z-50 w-64">
            <div className="flex justify-between items-center mb-4">
              <p className="font-semibold">User Info</p>
              <img
                src={CloseLogo}
                alt="Close"
                className="w-5 h-5 cursor-pointer"
                onClick={() => setMenuOpen(false)}
              />
            </div>
            <div className="text-sm text-gray-700">
              <p>
                <span className="font-semibold">Verified by:</span>{" "}
                {cert?.emailOfVerification || "N/A"}
              </p>
            </div>
          </div>
        )}

        {/* MAIN CERTIFICATE */}
        <main className="flex flex-col items-center flex-grow mt-24 px-2 sm:px-4">
          <div
            ref={certRef}
            className="w-full max-w-[850px] bg-white border border-gray-200 shadow-md rounded-lg p-4 sm:p-8 text-center relative overflow-hidden"
          >
            {/* WATERMARK */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <img src={StateLogo} alt="Watermark" className="w-64 h-64 sm:w-96 sm:h-96 opacity-5 object-contain" />
            </div>

            {/* Applicant Image */}
            {passport && (
              <div className="absolute top-4 right-4 z-10">
                <img
                  src={passport}
                  alt="Applicant"
                  className="w-24 h-24 object-cover border-2 border-gray-300 shadow-sm"
                />
              </div>
            )}

            {/* Header */}
            <div className="mt-28 sm:mt-32 text-center relative z-10">
              <p className="text-xs sm:text-sm font-semibold text-gray-600">OGUN STATE GOVERNMENT</p>
              <p className="text-[10px] sm:text-xs text-gray-500">Local Government Authority</p>
              <img src={StateLogo} alt="Seal" className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mt-2" />
            </div>

            <h2 className="text-base sm:text-xl font-bold text-gray-900 underline mb-6 relative z-10">
              {stateOfOrigin?.toLowerCase() === "ogun"
                ? "CERTIFICATE OF ORIGIN"
                : "CERTIFICATE OF RESIDENCY"}
            </h2>

            {/* Certificate Text */}
            <div className="text-left leading-relaxed text-gray-800 text-sm md:text-base space-y-4 relative z-10">
              <p>
                This is to certify that from enquiry made,{" "}
                <span className="font-semibold underline">{fullNames}</span> of{" "}
                <span className="font-semibold underline">{currentAddress}</span> is a native of{" "}
                <span className="font-semibold underline">{lga}</span> of{" "}
                <span className="font-semibold underline">{stateOfOrigin}</span> State, Nigeria.
              </p>
              <p>
                Ancestral, historical and administrative records verified by the local government
                attested to this fact.
              </p>
              <p>
                This certificate of {stateOfOrigin?.toLowerCase() === "ogun" ? "origin" : "residency"} is attested
                under my hand and the public seal of{" "}
                <span className="font-semibold underline">{lgaOfResident || lga}</span> on{" "}
                <span className="font-semibold underline">
                  {approvedDate
                    ? new Date(approvedDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Date"}
                </span>.
              </p>
            </div>

            {/* Signatories */}
            <div className="flex justify-between items-end mt-16 px-4 sm:px-12 gap-6 w-full max-w-[600px] mx-auto relative z-10">
              <div className="text-center flex-1">
                {signatory?.secretarySignature && (
                  <img
                    src={signatory.secretarySignature}
                    alt="Secretary Signature"
                    className="w-24 h-16 object-contain mx-auto mb-1"
                  />
                )}
                <div className="border-t border-gray-400 w-28 sm:w-32 mx-auto"></div>
                <p className="text-xs mt-1 font-semibold">
                  {signatory?.secretaryName || "Secretary"} ({lgaOfResident || lga})
                </p>
              </div>

              <div className="text-center flex-1">
                {signatory?.chairmanSignature && (
                  <img
                    src={signatory.chairmanSignature}
                    alt="Chairman Signature"
                    className="w-24 h-16 object-contain mx-auto mb-1"
                  />
                )}
                <div className="border-t border-gray-400 w-28 sm:w-32 mx-auto"></div>
                <p className="text-xs mt-1 font-semibold">
                  {signatory?.chairmanName || "Chairman"} ({lgaOfResident || lga})
                </p>
              </div>
            </div>

            <p className="text-xs font-medium text-black mt-2 break-words relative z-10">
            Email: {cert?.user?.email || "N/A"}
            </p>
            <p className="text-xs font-medium text-black mt-1 break-words relative z-10">
              Certificate ID: {certificateId}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full sm:w-auto justify-center px-4">
            <button
              onClick={downloadPDF}
              className="bg-[#11860F] font-semibold text-white px-4 sm:px-6 py-2 rounded-md hover:bg-[#0a5608] transition text-sm sm:text-base w-full sm:w-auto"
            >
              Download Certificate
            </button>
          </div>
        </main>

        
        <button
          onClick={() => window.history.back()}
          className="mt-4  mb-4 text-gray-500 font-medium hover:text-[#11860F] text-sm"
        >
          ← Go Back
        </button>

        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      </div>
    );
  }

  // Default: verification input view
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <ShieldCheck className="text-[#11860F]" />
          Verify Certificate
        </h2>

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
          onClick={() => window.history.back()}
          className="mt-2  mb-1 text-gray-500 font-medium hover:text-[#11860F] text-sm"
        >
          ← Go Back
        </button>

      </div>
      


      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </div>
  );
};

export default VerifyCertificate;

