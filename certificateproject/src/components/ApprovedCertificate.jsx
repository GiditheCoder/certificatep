import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Document, Image, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import QRCodeGenerator from "qrcode";
import QRCode from "react-qr-code";
import StateLogo from "../images/StateLogo.png";
import MenuLogo from "../images/menu.png";
import CloseLogo from "../images/close.png";
import Borderside from "../images/border.png";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, Download, ShieldCheck } from "lucide-react";

const baseURL = "https://certapp-aae046f75d3f.herokuapp.com";
const certificateDate = "8th day of October, 2026";
const organizationLocation = "Owode Egba, Ogun State, Nigeria";

const pdfStyles = StyleSheet.create({
  page: {
    padding: 22,
    backgroundColor: "#ffffff",
    color: "#26332a",
    fontFamily: "Helvetica",
  },
  frame: {
    flex: 1,
    borderWidth: 3,
    borderColor: "#11860f",
    padding: 32,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 76,
    height: 76,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: "center",
  },
  applicantBlock: {
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  applicantImages: {
    width: 320,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 48,
    alignItems: "center",
  },
  applicantPhoto: {
    width: 76,
    height: 88,
    padding: 4,
    borderWidth: 1,
    borderColor: "#9cb99f",
    objectFit: "cover",
  },
  officeCaption: {
    marginTop: 4,
    color: "#b21e1e",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  organization: {
    marginTop: 4,
    color: "#111111",
    fontSize: 16,
    lineHeight: 1.2,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  organizationLocation: {
    marginTop: 2,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  qrCode: {
    width: 76,
    height: 76,
  },
  certificateType: {
    marginTop: 12,
    color: "#ff0000",
    fontSize: 25,
    textAlign: "center",
    fontFamily: "Times-Roman",
  },
  body: {
    marginTop: 16,
    alignItems: "center",
  },
  bodyText: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: 500,
    lineHeight: 1.5,
    textAlign: "center",
  },
  emphasizedText: {
    fontFamily: "Helvetica-Bold",
  },
  issuanceText: {
    marginTop: 14,
    fontSize: 10,
    fontWeight: 500,
    lineHeight: 1.5,
    textAlign: "center",
  },
  signatures: {
    marginTop: "auto",
    paddingTop: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  signatory: {
    width: 190,
    alignItems: "center",
  },
  signatureImage: {
    width: 100,
    height: 40,
    marginBottom: 5,
    objectFit: "contain",
  },
  signatureRule: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#26332a",
  },
  signatoryName: {
    marginTop: 7,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  signatoryTitle: {
    marginTop: 4,
    fontSize: 7,
    color: "#55705c",
    textAlign: "center",
    textTransform: "uppercase",
  },
  stateSeal: {
    width: 68,
    height: 68,
    objectFit: "contain",
  },
});

const resolveImageSource = (source) => {
  if (!source) return null;
  if (/^(https?:|data:|blob:)/i.test(source)) return source;
  return `${window.location.origin}/${source.replace(/^\/+/, "")}`;
};

const CertificatePdf = ({
  certificate,
  signatory,
  qrCode,
  applicantImage,
  organizationName,
  lgaName,
  nativeTown,
  nativePoliticalWard,
}) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.frame}>
        <Image src={Borderside} style={{ ...pdfStyles.corner, top: -9, left: -9, transform: "rotate(90deg)" }} />
        <Image src={Borderside} style={{ ...pdfStyles.corner, top: -9, right: -9, transform: "rotate(90deg) scaleY(-1)" }} />
        <Image src={Borderside} style={{ ...pdfStyles.corner, bottom: -9, left: -9, transform: "rotate(90deg) scaleX(-1)" }} />
        <Image src={Borderside} style={{ ...pdfStyles.corner, bottom: -9, right: -9, transform: "rotate(270deg)" }} />
        <View style={pdfStyles.content}>
          <View style={pdfStyles.header}>
            <Image src={StateLogo} style={pdfStyles.stateSeal} />
            <Text style={pdfStyles.organization}>{organizationName}</Text>
            <Text style={pdfStyles.organizationLocation}>{organizationLocation.toUpperCase()}</Text>
            <View style={pdfStyles.applicantBlock}>
              <Text style={pdfStyles.officeCaption}>OFFICE OF THE CHAIRMAN</Text>
              <View style={pdfStyles.applicantImages}>
              {applicantImage ? (
                <Image src={applicantImage} style={pdfStyles.applicantPhoto} />
              ) : (
                <View style={[pdfStyles.applicantPhoto, { justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6" }]}>
                  <Text style={{ fontSize: 8, color: "#718078" }}>No Photo</Text>
                </View>
              )}
                <Image src={qrCode} style={pdfStyles.qrCode} />
              </View>
            </View>
          </View>

          <Text style={pdfStyles.certificateType}>Certificate of Origin</Text>

          <View style={pdfStyles.body}>
            <Text style={pdfStyles.bodyText}>This is to certify that from enquiry made</Text>
            <Text style={[pdfStyles.bodyText, pdfStyles.emphasizedText]}>{certificate?.fullNames || "N/A"},</Text>
            <Text style={pdfStyles.bodyText}>whose photograph passport is affixed above and who resides at</Text>
            <Text style={[pdfStyles.bodyText, pdfStyles.emphasizedText]}>{certificate?.currentAddress || "N/A"}</Text>
            <Text style={pdfStyles.bodyText}>
              is a native of <Text style={pdfStyles.emphasizedText}>{nativeTown || "N/A"}</Text> within Polling Unit{" "}
              <Text style={pdfStyles.emphasizedText}>{certificate?.nativePollingUnit || "N/A"}</Text> of{" "}
              <Text style={pdfStyles.emphasizedText}>{nativePoliticalWard || "N/A"}</Text> of
            </Text>
            <Text style={pdfStyles.bodyText}>
              {lgaName} Local Government Area of Ogun State, Nigeria.
            </Text>
            <Text style={pdfStyles.bodyText}>
              Ancestral, Historical and Administrative records verified by the Local Government attested to this fact.
            </Text>
            <Text style={pdfStyles.issuanceText}>
              This Certificate of Origin is issued today under my hand and the public seal of {lgaName} Local Government
              at Owode this day {certificateDate}.
            </Text>
          </View>

          <View style={pdfStyles.signatures}>
            <View style={pdfStyles.signatory}>
              {signatory?.secretarySignature && (
                <Image src={resolveImageSource(signatory.secretarySignature)} style={pdfStyles.signatureImage} />
              )}
              <View style={pdfStyles.signatureRule} />
              <Text style={pdfStyles.signatoryName}>{signatory?.secretaryName || ""}</Text>
              <Text style={pdfStyles.signatoryTitle}>Secretary to the Local Government</Text>
            </View>
            <View style={pdfStyles.signatory}>
              {signatory?.chairmanSignature && (
                <Image src={resolveImageSource(signatory.chairmanSignature)} style={pdfStyles.signatureImage} />
              )}
              <View style={pdfStyles.signatureRule} />
              <Text style={pdfStyles.signatoryName}>{signatory?.chairmanName || ""}</Text>
              <Text style={pdfStyles.signatoryTitle}>Executive Chairman</Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const ApprovedCertificate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const passedEmail = location.state?.email;
  const passedCertificate = location.state?.certificate;
  const passedCertificateHash = location.state?.certificateHash;
  const [certificate, setCertificate] = useState(passedCertificate || null);
  const [certificateHash, setCertificateHash] = useState(
    passedCertificateHash || passedCertificate?.certificateHash || passedCertificate?.hash || ""
  );
  const [signatory, setSignatory] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [isSmallScreen, setIsSmallScreen] = useState(false);

  const Admin = JSON.parse(localStorage.getItem("user"));

  // Fetch certificate data by ID
  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        setError(null);

        if (passedCertificate) {
          const hashFromPayload =
            passedCertificate?.certificateHash ||
            passedCertificate?.hash ||
            passedCertificate?._id ||
            id;

          setCertificate(passedCertificate);
          setCertificateHash(hashFromPayload);
          setLoading(false);
          return;
        }

        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        
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

        const certificateRes = await axios.get(`${baseURL}/api/v1/certificate/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const cert =
          certificateRes?.data?.data ??
          certificateRes?.data?.certificate ??
          certificateRes?.data ??
          null;

        if (!cert) {
          toast.error("Certificate not found with ID: " + id);
          navigate("/dashboard");
          return;
        }

        setCertificate(cert);
        setCertificateHash(cert?.certificateHash || cert?.hash || cert?._id || id);
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
  }, [id, navigate, passedCertificate]);

  const effectiveLga =
    certificate?.stateOfOrigin?.trim().toLowerCase() === "ogun"
      ? certificate?.lga
      : certificate?.lgaOfResident;

  useEffect(() => {
    if (!effectiveLga) return;

    const fetchSignatory = async () => {
      try {
        const response = await axios.get(
          `https://certapp-aae046f75d3f.herokuapp.com/api/v1/signatory/${encodeURIComponent(
            effectiveLga
          )}`
        );
        setSignatory(response.data.data || response.data);
      } catch (error) {
        console.error("❌ Failed to fetch signatory:", error);
        toast.warning("Could not load signature details", { toastId: "signatory-load-error" });
      }
    };

    fetchSignatory();
  }, [effectiveLga]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/official");
  };


  // Check for small screens
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 420);
    };

    checkScreenSize(); // initial check

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // const downloadPDF = async () => {
  //   if (!certRef.current) {
  //     toast.error("Certificate element not found");
  //     return;
  //   }

  //   try {
  //     toast.info("Generating PDF...");

  //     const canvas = await html2canvas(certRef.current, {
  //       scale: 3,
  //       useCORS: true,
  //       allowTaint: true,
  //       backgroundColor: "#ffffff",
  //       foreignObjectRendering: false,
  //       logging: false,
  //       onclone: (clonedDoc) => {
  //         const allElements = clonedDoc.querySelectorAll("*");
          
  //         allElements.forEach((el) => {
  //           const computedStyle = window.getComputedStyle(el);
            
  //           // Fix all color properties that might contain oklch
  //           const colorProps = [
  //             'color', 'backgroundColor', 'borderColor', 
  //             'borderTopColor', 'borderRightColor', 
  //             'borderBottomColor', 'borderLeftColor',
  //             'outlineColor', 'textDecorationColor'
  //           ];
            
  //           colorProps.forEach(prop => {
  //             const value = computedStyle[prop];
  //             if (value && (value.includes('oklch') || value.includes('color('))) {
  //               // Convert to a safe color
  //               if (prop === 'backgroundColor') {
  //                 el.style[prop] = '#ffffff';
  //               } else if (prop.includes('border')) {
  //                 el.style[prop] = '#d1d5db';
  //               } else {
  //                 el.style[prop] = '#000000';
  //               }
  //             }
  //           });
            
  //           // Fix background and background-image (for gradients)
  //           const bgImage = computedStyle.backgroundImage;
  //           if (bgImage && (bgImage.includes('oklch') || bgImage.includes('color('))) {
  //             // Replace gradient with solid color based on class
  //             if (el.classList.contains('from-emerald-800') || 
  //                 el.classList.contains('from-emerald-700')) {
  //               el.style.backgroundImage = 'none';
  //               el.style.backgroundColor = '#047857'; // emerald-700
  //             } else if (el.classList.contains('from-yellow-600')) {
  //               el.style.backgroundImage = 'none';
  //               el.style.backgroundColor = '#ca8a04'; // yellow-600
  //             } else if (el.classList.contains('from-amber-50')) {
  //               el.style.backgroundImage = 'none';
  //               el.style.backgroundColor = '#fffbeb'; // amber-50
  //             } else {
  //               el.style.backgroundImage = 'none';
  //               el.style.backgroundColor = computedStyle.backgroundColor || '#ffffff';
  //             }
  //           }
  //         });
  //       },
  //     });

  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const width = pdf.internal.pageSize.getWidth();
  //     const height = (canvas.height * width) / canvas.width;


      
  //     pdf.addImage(imgData, "PNG", 0, 0, width, height);
  //     pdf.save(`${certificate?.fullNames || "certificate"}.pdf`);
      
  //     toast.success("PDF downloaded successfully!");
  //   } catch (error) {
  //     console.error("PDF generation failed:", error);
  //     toast.error("Failed to generate PDF. Please try again.");
  //   }
  // };
  
const downloadPDF = async () => {
  try {
    toast.info("Generating PDF...");
    const verificationHash = certificateHash || certificate?._id || id || "certificate";
    const qrCode = await QRCodeGenerator.toDataURL(
      `${window.location.origin}/cert-validation?hash=${encodeURIComponent(verificationHash)}`,
      { margin: 1, width: 256 }
    );
    const document = pdf(
      <CertificatePdf
        certificate={certificate}
        signatory={signatory}
        qrCode={qrCode}
        applicantImage={resolveImageSource(certificate?.passport)}
        organizationName={organizationName}
        lgaName={lgaName}
        nativeTown={nativeTown}
        nativePoliticalWard={certificate?.nativePoliticalWard}
      />
    );
    const blob = await document.toBlob();
    const downloadUrl = URL.createObjectURL(blob);
    const downloadLink = window.document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = `${certificate?.fullNames || "certificate"}.pdf`;
    downloadLink.click();
    URL.revokeObjectURL(downloadUrl);
    
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
    passport: image,
  } = certificate;

  const nativeTown = certificate?.nativeTown || certificate?.town || "N/A";
  const lgaWords = (effectiveLga?.trim() || "Abeokuta South").split(/\s+/);
  const lgaName = lgaWords
    .map((word, index) =>
      index === 0
        ? word.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())
        : word.toLowerCase()
    )
    .join("-");
  const organizationName = `${lgaName} Local Government`;

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
            <p className="font-semibold text-[#1d3023]">{`${Admin?.firstName || ""} ${Admin?.lastName || ""}`}</p>
            <p className="text-[#718078] font-medium text-xs">{Admin?.position}</p>
          </div>
        </div>

        <div className="sm:hidden">
          <img src={MenuLogo} alt="Menu" className="w-6 h-6 cursor-pointer" onClick={() => setMenuOpen(true)} />
        </div>
      </header>

      <main className="flex flex-col items-center flex-grow mt-24 px-3 sm:px-6 pb-10">
        <div className="w-full max-w-5xl">
          <div className="relative bg-white border-[3px] border-[#11860f] p-1 shadow-[0_18px_50px_rgba(28,61,38,0.14)]">
            <div className="relative p-5 sm:p-9 md:p-12 overflow-hidden">
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
                  <img
                    src={StateLogo}
                    alt="Ogun State seal"
                    className="h-20 w-20 shrink-0 object-contain sm:h-24 sm:w-24"
                  />
                  <h1 className="mt-2 w-full text-center text-[clamp(1.05rem,4vw,2rem)] font-black uppercase tracking-[0.03em] leading-tight text-[#111111]">
                    {organizationName}
                  </h1>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-[#26332a] sm:text-xs">
                    {organizationLocation}
                  </p>
                  <p className="mt-2 text-[9px] font-bold uppercase text-red-600 sm:text-[10px]">
                    Office of the Chairman
                  </p>
                  <div className="mt-3 flex w-full max-w-lg items-center justify-between gap-20 px-4 sm:gap-32">
                    <div className="h-24 w-20 shrink-0 border border-[#9cb99f] bg-[#f7faf7] p-1 sm:h-32 sm:w-28">
                      {image ? (
                        <img
                          src={resolveImageSource(image)}
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
                    <div className="shrink-0 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
                      <QRCode
                        value={`${window.location.origin}/cert-validation?hash=${encodeURIComponent(certificateHash || "certificate")}`}
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
                    is a native of <strong className="underline">{nativeTown}</strong> within Polling Unit{" "}
                    <strong className="underline">{certificate?.nativePollingUnit || "N/A"}</strong> of{" "}
                    <strong className="underline">{certificate?.nativePoliticalWard || "N/A"}</strong> of
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
  <div className="flex-1 text-center w-full sm:min-w-0">
    {signatory?.secretarySignature && (
      <img
        src={signatory?.secretarySignature}
        className="w-28 h-16 md:w-32 md:h-18 mx-auto mb-2 object-contain"
        alt="Secretary Signature"
      />
    )}
    <div className="border-t border-[#26332a] pt-2">
      <div className="font-bold text-sm md:text-base">{signatory?.secretaryName}</div>
        <p className="font-semibold text-xs uppercase tracking-wider text-[#55705c]">Secretary to the Local Government</p>
    </div>
  </div>

  <div className="flex-1 text-center w-full sm:min-w-0">
    {signatory?.chairmanSignature && (
      <img
        src={signatory?.chairmanSignature}
        className="w-28 h-16 md:w-32 md:h-18 mx-auto mb-2 object-contain"
        alt="Chairman Signature"
      />
    )}
    <div className="border-t border-[#26332a] pt-2">
      <div className="font-bold text-sm md:text-base">{signatory?.chairmanName}</div>
      <p className="font-semibold text-xs uppercase tracking-wider text-[#55705c]">Executive Chairman</p>
    </div>
  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6 w-full sm:w-auto justify-center px-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 border border-[#11860f] bg-white text-[#11860f] font-semibold px-5 py-3 rounded-lg hover:bg-[#f1f8f2] transition text-sm w-full sm:w-auto"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button
            onClick={downloadPDF}
            className="inline-flex items-center justify-center gap-2 bg-[#11860f] font-semibold text-white px-5 py-3 rounded-lg hover:bg-[#0a5608] transition text-sm shadow-sm w-full sm:w-auto"
          >
            <Download size={16} /> Download certificate
          </button>
        </div>

        <p className="mt-4 inline-flex items-center gap-2 text-xs text-[#55705c]"><ShieldCheck size={15} /> Digitally issued and ready for verification</p>
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
