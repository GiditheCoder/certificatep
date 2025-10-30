import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import StateLogo from "../images/StateLogo.png";
import { LogOutIcon } from "lucide-react";
import MenuLogo from "../images/menu.png";
import CloseLogo from "../images/close.png";

const ApprovedCertificate = () => {
  const certRef = useRef();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { name, address, lga, nativeTown, image, approvedDate, certificateId } = state || {};
  const Admin = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/official");
  };

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

  if (!state) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700 px-4 text-center">
        <p className="text-lg font-semibold">No certificate data available.</p>
        <p className="text-sm text-gray-500 mt-2">
          Please go back to the Dashboard and select your approved certificate.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <header className="flex justify-between items-center border-b border-gray-200 w-full px-4 sm:px-6 py-3 fixed top-0 left-0 bg-white z-50">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <img src={StateLogo} alt="State Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
          <span className="text-sm sm:text-lg font-semibold text-[#475467]">Ogun State Government</span>
        </div>

        {/* Desktop Info */}
        <div className="hidden sm:flex items-center gap-4 text-sm">
          <div className="text-right leading-tight">
            <p className="font-semibold text-gray-800">{`${Admin?.firstName || ""} ${Admin?.lastName || ""}`}</p>
            <p className="text-gray-400 font-medium text-xs">{Admin?.position}</p>
          </div>
          <LogOutIcon
            onClick={handleLogout}
            className="cursor-pointer hover:text-red-500 transition"
          />
        </div>

        {/* Mobile Menu */}
        <div className="sm:hidden">
          <img
            src={MenuLogo}
            alt="Menu"
            className="w-6 h-6 cursor-pointer"
            onClick={() => setMenuOpen(true)}
          />
        </div>
      </header>

      {/* MOBILE MENU DROPDOWN */}
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
          <div className="flex items-center space-x-3 text-sm">
            <div className="text-right">
              <p className="font-semibold">
                {`${Admin?.firstName || ""} ${Admin?.lastName || ""}`}
              </p>
              <p className="text-gray-400 font-medium text-xs">{Admin?.position}</p>
            </div>
            <LogOutIcon
              onClick={handleLogout}
              className="cursor-pointer hover:text-red-500 transition"
            />
          </div>
        </div>
      )}

      {/* MAIN CERTIFICATE */}
      <main className="flex flex-col items-center flex-grow mt-24 px-2 sm:px-4">
        <div
          ref={certRef}
          className="w-full max-w-[850px] bg-white border border-gray-200 shadow-md rounded-lg p-4 sm:p-8 text-center relative"
        >
          {/* Applicant Image (Circular + Centered) */}
          {image && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <img
                src={image.startsWith("http") ? image : `${window.location.origin}/${image}`}
                alt="Applicant"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          )}

          {/* Header Text */}
          <div className="mt-28 sm:mt-32 text-center">
            <p className="text-xs sm:text-sm font-semibold text-gray-600">OGUN STATE GOVERNMENT</p>
            <p className="text-[10px] sm:text-xs text-gray-500">Local Government Authority</p>
            <img src={StateLogo} alt="Seal" className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mt-2" />
          </div>

          <h2 className="text-base sm:text-xl font-bold text-gray-900 underline mb-6">
            CERTIFICATE OF ORIGIN
          </h2>

          {/* Certificate Text */}
          <div className="text-left leading-relaxed text-gray-800 text-xs sm:text-sm md:text-base space-y-3 sm:space-y-4">
            <p>
              This is to certify that from enquiry made,{" "}
              <span className="font-semibold underline">{name || "Full Name"}</span> of{" "}
              <span className="font-semibold underline">{address || "Full Address"}</span> is a native
              of <span className="font-semibold underline">{lga || "Local Government Area"}</span> of
              Ogun State, Nigeria.
            </p>

            <p>
              Ancestral, historical and administrative records verified by the local government
              attested to this fact.
            </p>

            <p>
              This certificate of origin is attested under my hand and the public seal of{" "}
              <span className="font-semibold underline">{lga || "Local Government Area"}</span> on{" "}
              <span className="font-semibold underline">
                {approvedDate
                  ? (() => {
                      const date = new Date(approvedDate);
                      const day = date.getDate();
                      const month = date.toLocaleString("en-US", { month: "long" });
                      const year = date.getFullYear();
                      const suffix =
                        day % 10 === 1 && day !== 11
                          ? "st"
                          : day % 10 === 2 && day !== 12
                          ? "nd"
                          : day % 10 === 3 && day !== 13
                          ? "rd"
                          : "th";
                      return `${day}${suffix} of ${month} ${year}`;
                    })()
                  : "Date"}
              </span>.
            </p>
          </div>
{/* Signature Section */}
<div className="flex justify-between items-end mt-16 px-4 sm:px-12 gap-6 w-full max-w-[600px] mx-auto">
  <div className="text-center flex-1">
    <div className="border-t border-gray-400 w-28 sm:w-32 mx-auto"></div>
    <p className="text-xs mt-2 text-gray-700 font-medium">Secretary</p>
  </div>
  <div className="text-center flex-1">
    <div className="border-t border-gray-400 w-28 sm:w-32 mx-auto"></div>
    <p className="text-xs mt-2 text-gray-700 font-medium">Chairman</p>
  </div>
</div>


          <p className="text-xs text-gray-500 mt-8 break-words">
            Certificate ID: {certificateId || "N/A"}
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
      </main>
    </div>
  );
};

export default ApprovedCertificate;


