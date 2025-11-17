import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams ,  useLocation  } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import StateLogo from "../images/StateLogo.png";
import { LogOutIcon } from "lucide-react";
import MenuLogo from "../images/menu.png";
import CloseLogo from "../images/close.png";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApprovedCertificate = () => {
  const certRef = useRef();
  const navigate = useNavigate();
  const { id } = useParams(); // Certificate ID from URL
 const location = useLocation();
  const passedEmail = location.state?.email;
  console.log("📧 Email passed from Dashboard:", passedEmail);
  const [certificate, setCertificate] = useState(null);
  const [signatory, setSignatory] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const Admin = JSON.parse(localStorage.getItem("user"));

  // Fetch certificate data by ID
  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        
        console.log("🔑 Token exists:", !!token);
        console.log("🔑 Token preview:", token?.substring(0, 20) + "...");
        console.log("👤 User role:", user?.role || "user");
        console.log("🆔 Certificate ID:", id);
        
        if (!token) {
          toast.error("Authentication token not found. Please login again.");
          navigate("/login");
          return;
        }

        if (!id) {
          toast.error("Certificate ID not provided");
          navigate("/dashboard");
          return;
        }

        // Try multiple endpoints based on user role
        let applications = [];
        let cert = null;

        try {
          // First, try the admin approved endpoint
          console.log("🔍 Trying admin approved endpoint...");
          const approvedRes = await axios.get(
            "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/admin/applications/approved",
            { 
              headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              } 
            }
          );
          
          const approvedApps = approvedRes?.data?.data?.applications || 
                               approvedRes?.data?.data?.approvedApplications || 
                               approvedRes?.data?.data || 
                               [];
          
          console.log("✅ Admin approved endpoint successful:", approvedApps.length, "applications");
          cert = approvedApps.find(app => app._id === id);
          
          if (cert) {
            console.log("🎯 Found certificate in approved applications");
          }
        } catch (adminError) {
          console.log("⚠️ Admin endpoint failed, trying user endpoint...", adminError.response?.status);
          
          // If admin endpoint fails, try the regular application endpoint
          try {
            const userRes = await axios.get(
              "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/application",
              { 
                headers: { 
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                } 
              }
            );
            
            applications = userRes?.data?.data?.applications || [];
            console.log("✅ User endpoint successful:", applications.length, "applications");
            cert = applications.find(app => app._id === id);
            
            if (cert) {
              console.log("🎯 Found certificate in user applications");
            }
          } catch (userError) {
            console.error("❌ Both endpoints failed");
            throw userError; // Throw the user endpoint error to be caught by outer catch
          }
        }

        console.log("🔍 Final certificate found:", !!cert);

        if (!cert) {
          toast.error("Certificate not found with ID: " + id);
          navigate("/dashboard");
          return;
        }

        setCertificate(cert);
        setLoading(false);

      } catch (error) {
        console.error("❌ Failed to fetch certificate:", error);
        console.error("❌ Error response:", error.response);
        setError(error.message);
        setLoading(false);

        if (error.response?.status === 401) {
          toast.error("Session expired or invalid token. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => {
            // Redirect based on user role
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            navigate(user?.role === "admin" ? "/official" : "/login");
          }, 2000);
        } else if (error.response?.status === 404) {
          toast.error("Certificate not found");
          setTimeout(() => navigate("/dashboard"), 2000);
        } else {
          toast.error("Failed to load certificate. Please try again.");
        }
      }
    };

    fetchCertificate();
  }, [id, navigate]);

  // Determine effective LGA based on state of origin
  const effectiveLga =
    certificate?.stateOfOrigin?.toLowerCase() === "ogun"
      ? certificate?.lga
      : certificate?.lgaOfResident;

  // Fetch signatory data
  useEffect(() => {
    if (!effectiveLga) return;

    const fetchSignatory = async () => {
      try {
        const response = await axios.get(
          `https://lgacertificate-011d407b356b.herokuapp.com/api/v1/signatory/${encodeURIComponent(
            effectiveLga
          )}`
        );
        setSignatory(response.data.data || response.data);
        console.log("✍️ Signatory data:", response.data);
      } catch (error) {
        console.error("❌ Failed to fetch signatory:", error);
        toast.warning("Could not load signature details");
      }
    };

    fetchSignatory();
  }, [effectiveLga]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/official");
  };

  const downloadPDF = async () => {
    if (!certRef.current) {
      toast.error("Certificate element not found");
      return;
    }

    try {
      toast.info("Generating PDF...");

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
      pdf.save(`${certificate?.fullNames || "certificate"}.pdf`);
      
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700 px-4 text-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-semibold">Loading certificate data...</p>
      </div>
    );
  }

  // Error state
  if (error || !certificate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700 px-4 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <p className="text-lg font-semibold mb-2">Failed to load certificate</p>
        <p className="text-sm text-gray-500 mb-4">{error || "Certificate not found"}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-[#11860F] text-white px-6 py-2 rounded-md hover:bg-[#0a5608] transition"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const {
    fullNames: name,
    currentAddress: address,
    lga,
    lgaOfResident,
    town: nativeTown,
    email,
    stateOfOrigin,
    passport: image,
    updatedAt: approvedDate,
    _id: certificateId,
  } = certificate;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <header className="flex justify-between items-center border-b border-gray-200 w-full px-4 sm:px-6 py-3 fixed top-0 left-0 bg-white z-50">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src={StateLogo} alt="State Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
          <span className="text-sm sm:text-lg font-semibold text-[#475467]">Ogun State Government</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-sm">
          <div className="text-right leading-tight">
            <p className="font-semibold text-gray-800">{`${Admin?.firstName || ""} ${Admin?.lastName || ""}`}</p>
            <p className="text-gray-400 font-medium text-xs">{Admin?.position}</p>
          </div>
        </div>

        <div className="sm:hidden">
          <img src={MenuLogo} alt="Menu" className="w-6 h-6 cursor-pointer" onClick={() => setMenuOpen(true)} />
        </div>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="sm:hidden absolute top-14 right-4 bg-white shadow-lg border rounded-md p-4 z-50 w-64">
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold">User Info</p>
            <img src={CloseLogo} alt="Close" className="w-5 h-5 cursor-pointer" onClick={() => setMenuOpen(false)} />
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="text-right">
              <p className="font-semibold">{`${Admin?.firstName || ""} ${Admin?.lastName || ""}`}</p>
              <p className="text-gray-400 font-medium text-xs">{Admin?.position}</p>
            </div>
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
          {image && (
            <div className="absolute top-4 right-1 -translate-x-1/2 z-10">
              <img
                src={image.startsWith("http") ? image : `${window.location.origin}/${image}`}
                alt="Applicant"
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover border-2 border-gray-300 shadow-sm"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          )}

          {/* Certificate Header */}
          <div className="mt-28 sm:mt-32 text-center relative z-10">
            <p className="text-xs sm:text-sm font-semibold text-gray-600">OGUN STATE GOVERNMENT</p>
            <p className="text-[10px] sm:text-xs text-gray-500">Local Government Authority</p>
            <img src={StateLogo} alt="Seal" className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mt-2" />
          </div>

          {/* Certificate Type */}
          <h2 className="text-base sm:text-xl font-bold text-gray-900 underline mb-6 relative z-10">
            {stateOfOrigin?.toLowerCase() === "ogun" ? "CERTIFICATE OF ORIGIN" : "CERTIFICATE OF RESIDENCY"}
          </h2>

          {/* Certificate Text */}
          <div className="text-left leading-relaxed text-gray-800 text-xs sm:text-sm md:text-base space-y-3 sm:space-y-4 relative z-10">
            <p>
              This is to certify that from enquiry made,{" "}
              <span className="font-semibold underline">{name}</span> of{" "}
              <span className="font-semibold underline">{address}</span> is a native of{" "}
              <span className="font-semibold underline">{lga}</span> of{" "}
              <span className="font-semibold underline">{stateOfOrigin}</span> State, Nigeria.
            </p>

          {stateOfOrigin?.toLowerCase() === "ogun" && (
  <p>
    Ancestral, historical and administrative records verified by the local government attested to this fact.
  </p>
)}


            <p>
              This certificate of {stateOfOrigin?.toLowerCase() === "ogun" ? "origin" : "residency"} is attested under my hand and the public seal of{" "}
              <span className="font-semibold underline">{effectiveLga}</span> on{" "}
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
              <p className="text-xs mt-1 font-semibold">{signatory?.secretaryName || "Secretary"} ({effectiveLga})</p>
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
              <p className="text-xs mt-1 font-semibold">{signatory?.chairmanName || "Chairman"} ({effectiveLga})</p>
            </div>
          </div>

          <p className="text-xs font-medium text-black mt-2 break-words relative z-10">
            Email: {email || passedEmail || "N/A"}
          </p>
          <p className="text-xs font-medium text-black mt-1 break-words relative z-10">
            Certificate ID: {certificateId}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full sm:w-auto justify-center px-4">
          <button
            onClick={downloadPDF}
            className="bg-[#11860F] font-semibold text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-md hover:bg-[#0a5608] transition text-sm sm:text-base w-full sm:w-auto"
          >
            Download Certificate
          </button>
        </div>

        {/* Back */}
        <div className="mt-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-[#11860F] font-semibold hover:underline text-sm"
          >
            &larr; Back
          </button>
        </div>
      </main>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default ApprovedCertificate;