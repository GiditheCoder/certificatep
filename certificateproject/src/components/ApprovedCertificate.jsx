import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import certificateTemplate from "../images/certificateTemplate.jpg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ApprovedCertificate = () => {
  const certRef = useRef();
  const { state } = useLocation();

  // Destructure data safely
  const { name, address, nativeTown, approvedDate } = state || {};

  const downloadPDF = async () => {
    const element = certRef.current;
    const canvas = await html2canvas(element, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`${name || "certificate"}.pdf`);
  };

  // 🔹 Prevent blank screen when no data is passed
  if (!state) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700">
        <p className="text-lg font-semibold">No certificate data available.</p>
        <p className="text-sm text-gray-500 mt-2">
          Please go back to the Approved list and select an application.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <div
        ref={certRef}
        className="relative w-[800px] h-[650px] bg-white shadow-lg overflow-hidden"
      >
        <img
          src={certificateTemplate}
          alt="Certificate Template"
          className="w-full h-full object-cover"
        />

        {/* Overlay Texts */}
        <div className="absolute top-[300px] left-[180px] text-[18px] font-semibold text-black">
          {name}
        </div>

        <div className="absolute top-[345px] left-[180px] text-[16px] font-medium text-black w-[500px]">
          {address}
        </div>

        <div className="absolute top-[390px] left-[180px] text-[18px] font-semibold text-black">
          {nativeTown}
        </div>

        <div className="absolute bottom-[90px] left-[380px] text-[15px] text-black font-semibold">
          {approvedDate}
        </div>
      </div>

      <button
        onClick={downloadPDF}
        className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg"
      >
        Download Certificate
      </button>
    </div>
  );
};

export default ApprovedCertificate;



