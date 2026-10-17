import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ShieldCheck } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";
import StateLogo from "../images/StateLogo.png";
import MenuLogo from "../images/menu.png";
import CloseLogo from "../images/close.png";
import Borderside from "../images/border.png";
import QRCode from "react-qr-code";

const VerifyCertificate = () => {
  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifiedData, setVerifiedData] = useState(null);
  const [signatory, setSignatory] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const certRef = useRef(null);
  const [searchParams] = useSearchParams();

  const baseURL = "https://certapp-aae046f75d3f.herokuapp.com";

  // Check for small screens
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 420);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const hash = searchParams.get("hash");
    if (!hash) return;

    setInputCode(hash);
    setLoading(true);

    const verifyHash = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/api/v1/certificate/verify-hash/${encodeURIComponent(hash)}`
        );
        const data = res.data?.data ?? res.data;
        const verificationData = data?.certificate ? data : { certificate: data };

        setVerifiedData(verificationData);
        toast.success("Certificate verified successfully!");
        console.log("✅ Certificate hash verified:", verificationData);
      } catch (error) {
        console.error("❌ Certificate hash verification failed:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Certificate verification failed.");
      } finally {
        setLoading(false);
      }
    };

    verifyHash();
  }, [searchParams]);

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
      stateOfOrigin,
      passport: image,
      _id: certificateId,
    } = app;

    const effectiveLga = stateOfOrigin?.toLowerCase() === "ogun" ? lga : lgaOfResident;
    const nativeTown = app.nativeTown || app.town || "N/A";
    const nativePoliticalWard = app.nativePoliticalWard || "N/A";
    const lgaName = (effectiveLga?.trim() || "Abeokuta South")
      .split(/\s+/)
      .map((word) => word.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()))
      .join(" ");
    const verificationHash = cert.certificateHash || cert.hash || certificateId;
    const certificateDate = "8th day of October, 2026";

    return (
      <div className="min-h-screen bg-[#edf3ef] text-[#19221d] flex flex-col">
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
        <header className="flex justify-between items-center border-b border-[#d5e1d8] w-full px-4 sm:px-8 py-3 fixed top-0 left-0 bg-[#f8fbf8]/95 backdrop-blur z-50">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src={StateLogo} alt="Ogun State logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#55705c]">Digital certificate</p>
              <p className="text-sm sm:text-base font-bold text-[#1d3023]">Ogun State Government</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-sm">
            <div className="text-right leading-tight">
              <p className="font-semibold text-[#1d3023]">Verified Certificate</p>
              <p className="text-[#718078] font-medium text-xs">Public Verification</p>
            </div>
          </div>

          <div className="sm:hidden">
            <img src={MenuLogo} alt="Menu" className="w-6 h-6 cursor-pointer" onClick={() => setMenuOpen(true)} />
          </div>
        </header>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="sm:hidden absolute top-14 right-4 bg-white shadow-lg border border-[#d5e1d8] rounded-md p-4 z-50 w-64">
            <div className="flex justify-between items-center mb-4">
              <p className="font-semibold">Verification Info</p>
              <img src={CloseLogo} alt="Close" className="w-5 h-5 cursor-pointer" onClick={() => setMenuOpen(false)} />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-[#1d3023]">Verified Certificate</p>
              <p className="text-[#718078] text-xs">Public Verification</p>
            </div>
          </div>
        )}

        {/* MAIN CERTIFICATE */}
        <main className="flex flex-col items-center flex-grow mt-24 px-3 sm:px-6 pb-10">
          <div className="w-full max-w-5xl my-4">
            <div className="flex items-center justify-center gap-2 rounded-md border border-green-600 bg-green-50 px-4 py-2 text-center text-sm font-semibold text-green-800 sm:text-base">
              <ShieldCheck className="h-5 w-5" />
              This certificate is publicly verified and authentic.
            </div>
          </div>

          <div className="relative w-full max-w-5xl" ref={certRef}>
            <div className="relative border-[3px] border-[#11860f] bg-white p-1 shadow-[0_18px_50px_rgba(28,61,38,0.14)]">
              <div className="relative overflow-hidden p-5 sm:p-9 md:p-12">
                <img
                  src={Borderside}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-5 -top-8 z-0 h-32 w-24 rotate-90 object-contain sm:-left-7 sm:-top-10 sm:h-44 sm:w-32 md:h-52 md:w-36"
                />
                <img
                  src={Borderside}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-5 -top-8 z-0 h-32 w-24 rotate-180 object-contain sm:-right-7 sm:-top-10 sm:h-44 sm:w-32 md:h-52 md:w-36"
                />
                <img
                  src={Borderside}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-8 -left-5 z-0 h-32 w-24 object-contain sm:-bottom-10 sm:-left-7 sm:h-44 sm:w-32 md:h-52 md:w-36"
                />
                <img
                  src={Borderside}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-8 -right-5 z-0 h-32 w-24 rotate-[270deg] object-contain sm:-bottom-10 sm:-right-7 sm:h-44 sm:w-32 md:h-52 md:w-36"
                />

                <div className="relative z-10">
                  <div className="flex flex-col items-center pb-5 text-center">
                    <img src={StateLogo} alt="Ogun State seal" className="h-20 w-20 shrink-0 object-contain sm:h-24 sm:w-24" />
                    <h1 className="mt-2 w-full text-center text-[clamp(1.05rem,4vw,2rem)] font-black uppercase tracking-[0.03em] leading-tight text-[#111111]">
                      {lgaName} Local Government
                    </h1>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-[#26332a] sm:text-xs">
                      Owode Egba, Ogun State, Nigeria
                    </p>
                    <p className="mt-2 text-[9px] font-bold uppercase text-red-600 sm:text-[10px]">
                      Office of the Chairman
                    </p>
                    <div className="mt-3 flex w-full max-w-lg items-center justify-between gap-20 px-4 sm:gap-32">
                      <div className="h-24 w-20 shrink-0 border border-[#9cb99f] bg-[#f7faf7] p-1 sm:h-32 sm:w-28">
                        {image ? (
                          <img
                            src={image.startsWith("http") ? image : `${window.location.origin}/${image}`}
                            className="h-full w-full object-cover"
                            alt="Applicant"
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' fill='%239ca3af' font-size='12'%3ENo Photo%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                            No Photo
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
                        <QRCode
                          value={`${window.location.origin}/cert-validation?hash=${encodeURIComponent(verificationHash || "certificate")}`}
                          size={84}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="py-4 text-center sm:py-5">
                    <h2 className="text-2xl font-serif text-red-600 sm:text-4xl">Certificate of Origin</h2>
                  </div>

                  <div className="space-y-2 text-center text-sm font-medium leading-6 text-[#19221d] sm:text-base sm:leading-7">
                    <p>This is to certify that from enquiry made</p>
                    <p className="text-base font-bold sm:text-xl">{name || "N/A"},</p>
                    <p>whose photograph passport is affixed above and who resides at</p>
                    <p className="font-bold underline">{address || "N/A"}</p>
                    <p>
                      is a native of <strong className="underline">{nativeTown}</strong> within{" "}
                      <strong className="underline">{app.nativePollingUnit || "N/A"}</strong> of{" "}
                      <strong className="underline">{nativePoliticalWard}</strong> of
                    </p>
                    <p>
                      {lgaName} Local Government Area of Ogun State, Nigeria. Ancestral, Historical and
                      Administrative records verified by the Local Government attested to this fact.
                    </p>
                    <p className="pt-3">
                      This Certificate of Origin is issued today under my hand and the public seal of{" "}
                      {lgaName} Local Government at Owode this day {certificateDate}.
                    </p>
                  </div>

                  <div className="mt-10 mb-8 flex flex-col items-end justify-between gap-8 px-2 sm:mt-12 sm:mb-10 sm:flex-row sm:px-8">
                    <div className="w-full flex-1 text-center sm:min-w-0">
                      {signatory?.secretarySignature && (
                        <img
                          src={signatory.secretarySignature}
                          className="mx-auto mb-2 h-16 w-28 object-contain md:w-32"
                          alt="Secretary Signature"
                        />
                      )}
                      <div className="border-t border-[#26332a] pt-2">
                        <div className="text-sm font-bold md:text-base">{signatory?.secretaryName}</div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#55705c]">
                          Secretary to the Local Government
                        </p>
                      </div>
                    </div>
                    <div className="w-full flex-1 text-center sm:min-w-0">
                      {signatory?.chairmanSignature && (
                        <img
                          src={signatory.chairmanSignature}
                          className="mx-auto mb-2 h-16 w-28 object-contain md:w-32"
                          alt="Chairman Signature"
                        />
                      )}
                      <div className="border-t border-[#26332a] pt-2">
                        <div className="text-sm font-bold md:text-base">{signatory?.chairmanName}</div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#55705c]">
                          Executive Chairman
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full sm:w-auto justify-center px-4">
            <button
              onClick={downloadPDF}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#11860f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0a5608] sm:w-auto sm:text-base"
            >
              Download Certificate
            </button>
          </div>

          {/* Back Button */}
          <div className="mt-4 mb-4">
            <button
              onClick={() => window.history.back()}
              className="rounded-lg border border-[#11860f] bg-white px-5 py-3 text-sm font-semibold text-[#11860f] transition hover:bg-[#f1f8f2]"
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
    <div className="flex min-h-screen flex-col bg-[#edf3ef] text-[#19221d]">
      <header className="flex w-full items-center justify-between border-b border-[#d5e1d8] bg-[#f8fbf8]/95 px-4 py-3 backdrop-blur sm:px-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src={StateLogo} alt="Ogun State logo" className="h-8 w-8 rounded-full sm:h-10 sm:w-10" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#55705c] sm:text-xs">Digital certificate</p>
            <p className="text-sm font-bold text-[#1d3023] sm:text-base">Ogun State Government</p>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md border-[3px] border-[#11860f] bg-white p-1 shadow-[0_18px_50px_rgba(28,61,38,0.14)]">
          <div className="p-6 text-center sm:p-8">
            <img src={StateLogo} alt="" aria-hidden="true" className="mx-auto h-20 w-20 object-contain" />
            <h2 className="mt-4 flex items-center justify-center gap-2 text-2xl font-bold text-[#1d3023]">
              <ShieldCheck className="text-[#11860f]" />
              Verify Certificate
            </h2>
            <p className="mt-2 text-sm text-[#55705c]">
              Enter the certificate verification code to check its authenticity.
            </p>

            <div className="mt-6 text-left">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter verification code here"
                className="mb-3 w-full rounded-md border border-[#9cb99f] px-3 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-[#11860f]"
              />

              <button
                onClick={handleVerifyCertificate}
                disabled={loading}
                className={`w-full rounded-lg bg-[#11860f] py-3 font-semibold text-white transition hover:bg-[#0a5608] ${
                  loading ? "cursor-not-allowed opacity-70" : ""
                }`}
              >
                {loading ? "Verifying..." : "Verify Certificate"}
              </button>
            </div>

            <button
              onClick={() => window.history.back()}
              className="mt-4 text-sm font-medium text-[#55705c] hover:text-[#11860f]"
            >
              &larr; Go Back
            </button>
          </div>
        </div>
      </main>

      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </div>
  );
};

export default VerifyCertificate;