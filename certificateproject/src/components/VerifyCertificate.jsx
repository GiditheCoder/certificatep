import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ShieldCheck } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StateLogo from "../images/StateLogo.png";
import MenuLogo from "../images/menu.png";
import CloseLogo from "../images/close.png";
import CoatofArms from "../images/coatofarms.jpeg";

const VerifyCertificate = () => {
  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifiedData, setVerifiedData] = useState(null);
  const [signatory, setSignatory] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const certRef = useRef(null);

  const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com";

  // Check for small screens
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 420);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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
      setVerifiedData(data);
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

  // Nullify verification after delay
  useEffect(() => {
    if (!verifiedData) return;

    const certificateRef = verifiedData.certificate.certificateRef;
    if (!certificateRef) return;

    const timer = setTimeout(async () => {
      try {
        await axios.delete(`${baseURL}/api/v1/certificate/nullify-verification/${certificateRef}`);
        console.log(`Verification for ${certificateRef} nullified ✅`);
      } catch (err) {
        console.warn("Failed to nullify verification:", err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [verifiedData]);

  // Fetch signatory when certificate is verified
  useEffect(() => {
    if (!verifiedData) return;

    const certificateApp = verifiedData.certificate.application;
    const { stateOfOrigin, lga, lgaOfResident } = certificateApp;

    const effectiveLga = stateOfOrigin?.toLowerCase() === "ogun" ? lga : lgaOfResident;

    if (!effectiveLga) return;

    const fetchSignatory = async () => {
      try {
        const signRes = await axios.get(
          `${baseURL}/api/v1/signatory/${encodeURIComponent(effectiveLga)}`
        );
        setSignatory(signRes.data.data || signRes.data);
        console.log("✍️ Signatory data:", signRes.data);
      } catch (error) {
        console.error("❌ Failed to fetch signatory:", error);
        toast.warning("Could not load signature details");
      }
    };

    fetchSignatory();
  }, [verifiedData]);

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
        logging: false,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        windowWidth: certRef.current.scrollWidth,
        windowHeight: certRef.current.scrollHeight,
        onclone: (clonedDoc) => {
          const allElements = clonedDoc.querySelectorAll("*");
          
          allElements.forEach((el) => {
            const computedStyle = window.getComputedStyle(el);
            
            const colorProps = [
              'color', 'backgroundColor', 'borderColor', 
              'borderTopColor', 'borderRightColor', 
              'borderBottomColor', 'borderLeftColor',
              'outlineColor', 'textDecorationColor'
            ];
            
            colorProps.forEach(prop => {
              const value = computedStyle[prop];
              if (value && (value.includes('oklch') || value.includes('color('))) {
                if (prop === 'backgroundColor') {
                  el.style[prop] = '#ffffff';
                } else if (prop.includes('border')) {
                  el.style[prop] = '#d1d5db';
                } else {
                  el.style[prop] = '#000000';
                }
              }
            });
            
            const bgImage = computedStyle.backgroundImage;
            if (bgImage && (bgImage.includes('oklch') || bgImage.includes('color('))) {
              if (el.classList.contains('from-emerald-800') || 
                  el.classList.contains('from-emerald-700')) {
                el.style.backgroundImage = 'none';
                el.style.backgroundColor = '#047857';
              } else if (el.classList.contains('from-yellow-600')) {
                el.style.backgroundImage = 'none';
                el.style.backgroundColor = '#ca8a04';
              } else if (el.classList.contains('from-amber-50')) {
                el.style.backgroundImage = 'none';
                el.style.backgroundColor = '#fffbeb';
              } else {
                el.style.backgroundImage = 'none';
                el.style.backgroundColor = computedStyle.backgroundColor || '#ffffff';
              }
            }
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasAspectRatio = canvas.height / canvas.width;
      const pdfAspectRatio = pdfHeight / pdfWidth;
      
      let finalWidth, finalHeight, offsetX, offsetY;
      
      if (canvasAspectRatio > pdfAspectRatio) {
        finalHeight = pdfHeight;
        finalWidth = finalHeight / canvasAspectRatio;
        offsetX = (pdfWidth - finalWidth) / 2;
        offsetY = 0;
      } else {
        finalWidth = pdfWidth;
        finalHeight = finalWidth * canvasAspectRatio;
        offsetX = 0;
        offsetY = (pdfHeight - finalHeight) / 2;
      }
      
      pdf.addImage(imgData, "PNG", offsetX, offsetY, finalWidth, finalHeight);
      pdf.save(`${verifiedData?.certificate?.application?.fullNames || "certificate"}.pdf`);
      
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF. Please try again.");
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
      fullNames: name,
      currentAddress: address,
      lga,
      lgaOfResident,
      email,
      stateOfOrigin,
      passport: image,
      updatedAt: approvedDate,
      _id: certificateId,
    } = app;

    const effectiveLga = stateOfOrigin?.toLowerCase() === "ogun" ? lga : lgaOfResident;

    return (
      <div className="min-h-screen bg-white flex flex-col">
        {isSmallScreen && (
          <div className="fixed inset-0 z-50 bg-transparent bg-opacity-70 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm text-center shadow-lg">
              <h2 className="text-xl font-bold text-red-600 mb-4">⚠️ Screen Too Small</h2>
              <p className="text-gray-700 mb-4">
                For the best certificate view and proper formatting, please use a larger screen.
              </p>
              <button
                className="bg-[#11860F] text-white px-4 py-2 rounded-md hover:bg-[#0a5608] transition"
                onClick={() => setIsSmallScreen(false)}
              >
                Continue Anyway
              </button>
            </div>
          </div>
        )}

        {/* HEADER */}
        <header className="flex justify-between items-center border-b border-gray-200 w-full px-4 sm:px-6 py-3 fixed top-0 left-0 bg-white z-50">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src={StateLogo} alt="State Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
            <span className="text-sm sm:text-lg font-semibold text-[#475467]">Ogun State Government</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-sm">
            <div className="text-right leading-tight">
              <p className="font-semibold text-gray-800">Verified Certificate</p>
              <p className="text-gray-400 font-medium text-xs">Public Verification</p>
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
              <p className="font-semibold">Verification Info</p>
              <img src={CloseLogo} alt="Close" className="w-5 h-5 cursor-pointer" onClick={() => setMenuOpen(false)} />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-800">Verified Certificate</p>
              <p className="text-gray-400 text-xs">Public Verification</p>
            </div>
          </div>
        )}

        {/* MAIN CERTIFICATE */}
        <main className="flex flex-col items-center flex-grow mt-24 px-2 sm:px-4 pb-8">

          <div className="w-full max-w-4xl my-4">
  <div className="bg-green-50 border border-green-600 text-green-800 px-4 py-2 rounded-md text-center font-semibold text-sm sm:text-base flex items-center justify-center gap-2">
    <ShieldCheck className="w-5 h-5" />
    This certificate is publicly verified and authentic.
  </div>
</div>

          <div className="relative w-full max-w-4xl overflow-hidden m-0 p-0" ref={certRef}>
            {/* Outer Border */}
            <div className="bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-600 p-3 rounded-lg shadow-2xl">
              {/* Inner Border */}
              <div className="bg-gradient-to-br from-emerald-700 to-emerald-600 p-6 rounded-lg">
                {/* Certificate Body */}
                <div className="bg-gradient-to-br from-amber-50 via-cream-100 to-amber-100 p-8 rounded-lg relative overflow-hidden">
                  
                  {/* Watermark */}
                  <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                    <img
                      src={CoatofArms}
                      alt="Coat of Arms Watermark"
                      className="w-[60%] object-contain"
                    />
                  </div>

                  {/* Header */}
                  <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 sm:gap-0">
                    {/* Logo Badge */}
                    <div className="inline-block bg-gradient-to-br from-emerald-700 to-emerald-600 rounded-full p-1 mb-2 sm:mb-0">
                      <div className="bg-white rounded-full w-20 sm:w-24 h-20 sm:h-24 flex items-center justify-center border-4 border-emerald-600">
                        <img src={StateLogo} alt="State Logo" className="w-16 sm:w-20 h-16 sm:h-20 object-contain" />
                      </div>
                    </div>

                    {/* Center Text */}
                    <div className="flex flex-col items-center text-center flex-1 px-2">
                      <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1">
                        OGUN STATE GOVERNMENT
                      </h1>
                      <h2 className="text-sm sm:text-xl font-semibold text-gray-700">
                        Local Government Authority
                      </h2>
                    </div>

                    {/* Passport Photo */}
                    <div className="border-4 border-gray-300 bg-white p-1 w-20 sm:w-32 h-20 sm:h-32 shrink-0 mt-2 sm:mt-0">
                      {image ? (
                        <img
                          src={image.startsWith("http") ? image : `${window.location.origin}/${image}`}
                          className="w-full h-full object-cover"
                          alt="Applicant"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' fill='%239ca3af' font-size='12'%3ENo Photo%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
                          No Photo
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-center mb-8 text-amber-700"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Certificate Of {stateOfOrigin?.toLowerCase() === "ogun" ? "Origin" : "Residency"}
                  </h3>

                  {/* Certificate Body Text */}
                  <div className="text-left space-y-4 ml-5 text-gray-800 text-lg leading-relaxed">
                    <p className="font-medium">
                      This is to certify that from enquiry made,
                      <span className="font-bold border-b-2 border-gray-400 inline-block min-w-[200px] ml-2">
                        {name}
                      </span>
                    </p>

                    <p className="font-medium">
                      of
                      <span className="font-bold border-b-2 border-gray-400 inline-block min-w-[300px] gap-2 ml-2 mb-3">
                        {address}
                      </span>
                    </p>

                    <p className="font-medium">
                      is a native of
                      <span className="font-bold border-b-2 border-gray-400 inline-block min-w-[150px] gap-2 ml-2 mb-3">
                        {lga} (lga)
                      </span>
                      of
                      <span className="font-bold border-b-2 border-gray-400 inline-block min-w-[150px] gap-2 ml-2 mb-3">
                        {stateOfOrigin}
                      </span>
                      State, Nigeria.
                    </p>

                    {stateOfOrigin?.toLowerCase() === "ogun" && (
                      <p className="font-medium">
                        Ancestral, historical and administrative records verified by the local government attested to this fact.
                      </p>
                    )}
                  </div>

                  {/* Attestation */}
                  <div className="text-left mb-12 ml-5 text-gray-800 text-lg">
                    <p className="font-medium">
                      This certificate of {stateOfOrigin?.toLowerCase() === "ogun" ? "origin" : "residency"} is attested under my hand and the
                      public seal of
                      <span className="font-bold mx-1 underline">{effectiveLga}</span>
                      on
                      <span className="font-bold mx-1 underline">
                        {new Date(approvedDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>.
                    </p>
                  </div>

                  {/* Signatures */}
                  <div className="flex justify-between items-end gap-10 px-4 md:px-12 mb-8">
                    {/* Secretary */}
                    <div className="flex-1 text-center">
                      {signatory?.secretarySignature && (
                        <img
                          src={signatory?.secretarySignature}
                          className="w-24 h-14 md:w-28 md:h-16 mx-auto mb-2 object-contain"
                          alt="Secretary Signature"
                        />
                      )}
                      <div className="border-t-2 border-gray-400 pt-2">
                         
                        <div className="font-bold text-base md:text-lg">{signatory?.secretaryName}</div>
                         <h1 className="font-semibold"> Secretary</h1>
                        <div className="text-gray-600 font-semibold text-sm md:text-base">
                          {effectiveLga} (lga)
                        </div>
                      </div>
                    </div>

                    {/* Chairman */}
                    <div className="flex-1 text-center">
                      {signatory?.chairmanSignature && (
                        <img
                          src={signatory?.chairmanSignature}
                          className="w-24 h-14 md:w-28 md:h-16 mx-auto mb-2 object-contain"
                          alt="Chairman Signature"
                        />
                      )}
                      <div className="border-t-2 border-gray-400 pt-2">
                        <div className="font-bold text-base md:text-lg">{signatory?.chairmanName}</div>
                         <h1 className="font-semibold"> Chairman</h1>
                        <div className="text-gray-600 font-semibold text-sm md:text-base">
                          {effectiveLga} (lga)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center text-sm font-semibold text-gray-700 space-y-1">
                    <p>Email: {email || cert?.user?.email || "N/A"}</p>
                    <p>Certificate ID: {certificateId}</p>
                  </div>

                  {/* Decorative Element */}
                  <div className="flex justify-center mt-6">
                    <div className="text-amber-600 text-4xl">⚜ ❦ ⚜</div>
                  </div>
                </div>
              </div>
            </div>
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

          {/* Back Button */}
          <div className="mt-4 mb-4">
            <button
              onClick={() => window.history.back()}
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
          className="mt-2 mb-1 text-gray-500 font-medium hover:text-[#11860F] text-sm"
        >
          ← Go Back
        </button>
      </div>

      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </div>
  );
};

export default VerifyCertificate;