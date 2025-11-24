import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Bell, LogOutIcon, AlertCircle } from "lucide-react";
import Bg from "../images/Bg.png";
import StateLogo from "../images/StateLogo.png";
import { useNavigate } from "react-router-dom";
import CloseLogo from "../images/close.png";
import MenuLogo from "../images/menu.png";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as faceapi from "face-api.js";

const Application = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isValidatingFace, setIsValidatingFace] = useState(false);
  const [states, setStates] = useState([]);
const [lgas, setLgas] = useState([]);
const [ogunLgas, setOgunLgas] = useState([]);
const [previewUrl, setPreviewUrl] = useState(null);
const communityDocRef = useRef(null);







  const [formData, setFormData] = useState({
    fullNames: "",
    fatherNames: "",
    motherNames: "",
    nativeTown: "",
    nativePoliticalWard: "",
    village: "",
    communityHead: "",
    communityHeadContact: "",
    currentAddress: "",
    lga: "",
    nin: "",
    stateOfOrigin: "",
    passport: null,
    isResidentOfOgun: "",
    lgaOfResident: "", // ✅ NEW FIELD
     docFromCommunityHead: null, // ✅ NEW OPTIONAL FIELD
  });

  
const isNonOgun = formData.stateOfOrigin.toLowerCase() !== "ogun";


  // // ✅ Detect successful payment redirect
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const paymentStatus = params.get("status"); // e.g. ?status=successful&ref=12345
  const reference = params.get("ref");

  if (paymentStatus === "successful") {
    toast.success("🎉 Payment confirmed successfully!");
    console.log("✅ Payment reference:", reference);
    setTimeout(() => navigate("/successful"), 1000);
  }
}, [navigate]);


  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
       const MODEL_URL = `${import.meta.env.BASE_URL}models`;

        
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        console.log("✅ Face detection models loaded");
         // ⏱ Add 1000 seconds (1,000,000 ms) delay before marking as loaded
      setTimeout(() => {
        setModelsLoaded(true);
        console.log("⏳ Loader finished after 1000 seconds");
      }, 1000); // 1000 seconds * 1000 ms

        // setModelsLoaded(true);
      } catch (error) {
        console.error("❌ Error loading face detection models:", error);
        toast.warning("Face detection unavailable. You can still submit without validation.");
      }
    };

    loadModels();
  }, []);



  // Check for existing application on mount 
useEffect(() => {
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  console.log("TOKEN ON PAGE LOAD:", token);


  if (!storedUser || !token) {
    navigate("/login");
    return;
  }

  setUser(JSON.parse(storedUser));

//   const checkExistingApplication = async () => {
//     try {
//       const res = await axios.get(
//         "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/application",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = res.data;
//       const applications = data?.data?.applications || [];

//       if (!data.success || applications.length === 0) {
//         toast.info("✅ You can proceed with your new application.");
//         return;
//       }

   
//         if (existingPendingApp.isPendingPayment || existingPendingApp.paymentStatus === "incomplete") {
//   // ✅ Check for any possible payment link property names
//   const paymentLink =
//     existingPendingApp.pendingPaymentLink || // ✅ your preferred field
//     existingPendingApp.paymentLink ||
//     existingPendingApp.payment_url ||
//     existingPendingApp.paymentLinkUrl ||
//     existingPendingApp.payment_reference ||
//     null;

//   if (paymentLink) {
//     toast.info("💳 You have an incomplete payment. Redirecting you to continue...");
//     setTimeout(() => {
//       window.location.href = paymentLink;
//     }, 1500);
//   } else {
//     toast.warning(
//       "⚠️ Your payment is pending, but we couldn’t find a valid payment link. Redirecting to your dashboard..."
//     );
//     setTimeout(() => navigate("/dashboard"), 4000);
//   }
//   return;
// }

//       // Allow reapply only if all previous applications are rejected
//       const allRejected = applications.every(app => app.isRejected);
//       if (!allRejected) {
//         toast.warning("⚠️ You cannot reapply yet. Please wait for your pending application.");
//         setTimeout(() => navigate("/dashboard"), 2000);
//         return;
//       }

//       // Safe to reapply
//       // toast.info("❌ Your previous application was rejected. You can reapply.");
      
//     } catch (error) {
//       console.error("❌ Error checking application:", error);
//     }
//   };

//   checkExistingApplication();
}, []);


// state of origin
 useEffect(() => {
  const fetchStates = async () => {
    try {
      const res = await axios.get("https://lgacertificate-011d407b356b.herokuapp.com/api/v1/states");
        console.log("🌍 States API response:", res.data); // 👈 ADD THIS
      if (res.data.success && Array.isArray(res.data.data)) {
        setStates(res.data.data);
      } else {
        toast.error("Failed to load states");
      }
    } catch (error) {
      console.error("❌ Error fetching states:", error);
      toast.error("Could not fetch states. Please try again.");
    }
  };

  fetchStates();
}, []);


// lga
useEffect(() => {
  const fetchLgas = async () => {
    if (!formData.stateOfOrigin) return; // Don’t fetch until a state is chosen

    try {
      const encodedState = encodeURIComponent(formData.stateOfOrigin);
      const res = await axios.get(
        `https://lgacertificate-011d407b356b.herokuapp.com/api/v1/lgas?state=${encodedState}`
      );

      // ✅ Access nested structure
      const lgaArray = res.data?.data?.lgas;

      if (res.data.success && Array.isArray(lgaArray)) {
        setLgas(lgaArray);
      } else {
        toast.error(`Failed to locate LGAs for ${formData.stateOfOrigin}`);
      }
    } catch (error) {
      console.error("❌ Error fetching LGAs:", error);
      toast.error("Could not fetch LGAs. Please try again.");
    }
  };

  fetchLgas();
}, [formData.stateOfOrigin]);


// to fetch ony ogun states
useEffect(() => {
  const fetchOgunLgas = async () => {
    if (formData.isResidentOfOgun !== true) return; // Only fetch if Yes

    try {
      const encodedState = encodeURIComponent("Ogun");
      const res = await axios.get(
        `https://lgacertificate-011d407b356b.herokuapp.com/api/v1/lgas?state=${encodedState}`
      );

      const ogunLgaArray = res.data?.data?.lgas;

      console.log("🌍 Ogun LGAs API response:", ogunLgaArray); // 👈 ADD THIS

      if (res.data.success && Array.isArray(ogunLgaArray)) {
        setOgunLgas(ogunLgaArray);
      } else {
        toast.error("Failed to load Ogun LGAs");
      }
    } catch (error) {
      console.error("❌ Error fetching Ogun LGAs:", error);
      toast.error("Could not fetch Ogun LGAs. Please try again.");
    }
  };

  fetchOgunLgas();
}, [formData.isResidentOfOgun]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "nin") {
      if (!/^\d*$/.test(value)) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

// Face detection using file URL, not base64
const detectFace = async (imageUrl) => {
  if (!modelsLoaded) {
    console.log("Models not loaded, skipping face detection");
    return { valid: true, message: "Face detection unavailable" };
  }

  try {
    setIsValidatingFace(true);

    const img = new Image();
    img.src = imageUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    // Run detection
    const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions());
    const faceCount = detections.length;

    if (faceCount === 0) {
      return { valid: false, message: "No face detected. Please upload a clear passport photo." };
    }
    if (faceCount > 1) {
      return { valid: false, message: "Multiple faces detected. Please upload a photo with only one person." };
    }

    const confidence = detections[0].score;
    if (confidence < 0.5) {
      return { valid: false, message: "Face confidence too low. Please use a clearer photo." };
    }

    return { valid: true, message: 'Face detected successfully ' };
  } catch (error) {
    console.error("Face detection error:", error);
    return { valid: true, message: "Face validation failed but proceeding" };
  } finally {
    setTimeout(() => setIsValidatingFace(false), 1000);
  }
};

const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const maxSize = 3 * 1024 * 1024;
  if (file.size > maxSize) {
    setErrors((prev) => ({ ...prev, passport: "File too large. Max size is 3MB." }));
    e.target.value = "";
    return;
  }

  // Create a temporary URL for preview
  const imageUrl = URL.createObjectURL(file);

  const faceResult = await detectFace(imageUrl);

  if (!faceResult.valid) {
    toast.error(faceResult.message);
    setErrors((prev) => ({ ...prev, passport: faceResult.message }));
    e.target.value = "";
    URL.revokeObjectURL(imageUrl);
    return;
  }

  toast.success(faceResult.message);
  setFormData((prev) => ({ ...prev, passport: file }));
  setPreviewUrl(imageUrl); // ✅ store preview separately
  setErrors((prev) => ({ ...prev, passport: "" }));
};


const handleCommunityDocChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const maxSize = 3 * 1024 * 1024; // 3MB
  if (file.size > maxSize) {
    toast.error("File too large. Max size is 3MB.");
    e.target.value = "";
    return;
  }

  setFormData((prev) => ({ ...prev, docFromCommunityHead: file }));
  toast.success("✅ Document uploaded successfully!");
};



  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = {};

  // if (!formData.fullNames?.trim()) newErrors.fullNames = "Required";
  // if (!formData.fatherNames?.trim()) newErrors.fatherNames = "Required";
  // if (!formData.motherNames?.trim()) newErrors.motherNames = "Required";
  // if (!formData.nativeTown?.trim()) newErrors.nativeTown = "Required";
  // if (!formData.nativePoliticalWard?.trim())
  //   newErrors.nativePoliticalWard = "Required";
  // if (!formData.village?.trim()) newErrors.village = "Required";
  // if (!formData.communityHead?.trim()) newErrors.communityHead = "Required";
  // if (!formData.communityHeadContact?.toString().trim()) {
  //   newErrors.communityHeadContact = "Required";
  // } else if (!/^[\d+\s-]+$/.test(formData.communityHeadContact)) {
  //   newErrors.communityHeadContact = "Invalid contact format";
  // }

  if (!isNonOgun) {
  if (!formData.fatherNames?.trim()) newErrors.fatherNames = "Required";
  if (!formData.motherNames?.trim()) newErrors.motherNames = "Required";
  if (!formData.nativeTown?.trim()) newErrors.nativeTown = "Required";
  if (!formData.nativePoliticalWard?.trim())
    newErrors.nativePoliticalWard = "Required";
  if (!formData.village?.trim()) newErrors.village = "Required";
  if (!formData.communityHead?.trim()) newErrors.communityHead = "Required";
  if (!formData.communityHeadContact?.toString().trim()) {
    newErrors.communityHeadContact = "Required";
  } else if (!/^[\d+\s-]+$/.test(formData.communityHeadContact)) {
    newErrors.communityHeadContact = "Invalid contact format";
  }
}



  if (!formData.currentAddress?.trim()) newErrors.currentAddress = "Required";
  if (!formData.lga?.trim()) newErrors.lga = "Required";
 // ✅ NIN is optional — validate only if filled
if (formData.nin?.trim() && !/^\d{11}$/.test(formData.nin)) {
  newErrors.nin = "NIN must be exactly 11 digits";
}

  if (!formData.passport) newErrors.passport = "Required";
  if (!formData.stateOfOrigin?.trim())
    newErrors.stateOfOrigin = "Please select your State of Origin";


  
  // ✅ Only require isResidentOfOgun if NOT from Ogun
  if (
    formData.stateOfOrigin &&
    formData.stateOfOrigin.toLowerCase() !== "ogun" &&
    (formData.isResidentOfOgun === undefined || formData.isResidentOfOgun === "")
  ) {
    newErrors.isResidentOfOgun =
      "Please confirm if you are a resident of Ogun State";
  }

  // Stop submission if validation fails
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setLoading(true);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("⚠️ Please log in again.", { position: "top-center" });
      navigate("/login");
      return;
    }

    // ✅ Handle Ogun State logic before submission
    let cleanedFormData = { ...formData };
    if (
      cleanedFormData.stateOfOrigin &&
      cleanedFormData.stateOfOrigin.toLowerCase() === "ogun"
    ) {
      cleanedFormData.isResidentOfOgun = null;
      cleanedFormData.lgaOfResident = null;
    }

    // ✅ Build multipart form data
    const multipart = new FormData();
    for (const key in cleanedFormData) {
      if (
        cleanedFormData[key] !== null &&
        cleanedFormData[key] !== undefined &&
        cleanedFormData[key] !== ""
      ) {
        multipart.append(key, cleanedFormData[key]);
      }
    }

    // Send the request
    const res = await axios.post(
      "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/application",
      multipart,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ Response:", res.data);

    if (res.data.success && res.data.data?.paymentLink) {
      toast.success("✅ Application submitted! Redirecting to payment...");
      window.location.href = res.data.data.paymentLink;
    } else {
      toast.error(res.data.message || "Something went wrong.");
    }
  } catch (error) {
    console.error("❌ Submission error:", error);
    if (error.response) {
      toast.error(error.response.data.message || "Something went wrong.");
    } else {
      toast.error("Network error. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 sm:px-8 py-4 bg-white shadow-sm relative">
        <div className="flex items-center gap-3">
          <img src={StateLogo} alt="State Logo" className="w-10 h-10" />
          <h1 className="text-base sm:text-lg font-semibold text-[#475467]">
            Ogun State Government
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-5">
        
          <LogOutIcon onClick={handleLogout} className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#11860F]" />
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-semibold uppercase">
            {user
              ? `${user.firstName?.charAt(0).toUpperCase()}${user.lastName?.charAt(0).toUpperCase()}`
              : "?"}
          </div>
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <img
              src={menuOpen ? CloseLogo : MenuLogo}
              alt="menu toggle"
              className="w-6 h-6"
            />
          </button>
        </div>

        {menuOpen && (
          <div className="absolute top-full right-4 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 p-4 flex flex-col items-center gap-4 w-40 z-50 md:hidden animate-fadeIn">
          
            <LogOutIcon onClick={handleLogout} className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#11860F]" />
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-semibold uppercase">
              {user
                ? `${user.firstName?.charAt(0).toUpperCase()}${user.lastName?.charAt(0).toUpperCase()}`
                : "?"}
            </div>
          </div>
        )}
      </header>

      {/* Face Detection Loading Banner */}
      {!modelsLoaded && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-4 mt-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-blue-400 mr-2" />
            <p className="text-sm text-blue-700">Loading ...</p>
          </div>
        </div>
      )}

      <button
        onClick={handleDashboard}
        className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900 mt-6 mx-auto sm:ml-6 transition-colors justify-center"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="p-6 sm:p-8 bg-white rounded-xl shadow-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Apply for Certificate
            </h2>
            <p className="text-gray-600 font-medium text-sm">
              Fill in your personal details below to apply
            </p>
          </div>

          {user && (
  <div className="bg-green-50 text-green-800 text-sm font-medium px-4 py-2 rounded-md mb-4 border border-green-200">
    You are filling this application as: <span className="font-semibold">{user.email}</span>
  </div>
)}


          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Full Name
  </label>
  <input
    type="text"
    name="fullNames"
    value={formData.fullNames}
    onChange={handleInputChange}
    placeholder="John Doe"
    className={`w-full px-4 py-2 rounded-lg border font-medium focus:ring-2 ${
      errors.fullNames ? "border-red-600" : "border-gray-300 focus:ring-green-600"
    }`}
  />
  {errors.fullNames && (
    <p className="text-xs text-red-600 mt-1">{errors.fullNames}</p>
  )}
</div>



{/* state of Origin */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    State of Origin
  </label>
  <select
    name="stateOfOrigin"
    value={formData.stateOfOrigin}
    onChange={handleInputChange}
    className={`w-full px-4 py-2 rounded-lg border font-medium focus:ring-2 ${
      errors.stateOfOrigin
        ? "border-red-600 focus:ring-red-600"
        : "border-gray-300 focus:ring-green-600"
    }`}
  >
    <option value="">Select your State</option>
    {states.length > 0 ? (
      states.map((state, index) => (
        <option key={index} value={state}>
          {state}
        </option>
      ))
    ) : (
      <option disabled>Loading states...</option>
    )}
  </select>
  {errors.stateOfOrigin && (
    <p className="text-xs text-red-600 mt-1">{errors.stateOfOrigin}</p>
  )}
</div>

<select
  name="lga"
  value={formData.lga}
  onChange={handleInputChange}
  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 font-medium focus:border-transparent ${
    errors.lga
      ? "border-red-600 focus:ring-red-600"
      : "border-gray-300 focus:ring-green-600"
  }`}
  disabled={!formData.stateOfOrigin}
>
  <option value="">
    {formData.stateOfOrigin ? "Select your LGA" : "Select a State first"}
  </option>
  {lgas.length > 0 &&
    lgas.map((lga, index) => (
      <option key={index} value={lga}>
        {lga}
      </option>
    ))}
</select>



{/* state of origin */}
{formData.stateOfOrigin && formData.stateOfOrigin.toLowerCase() !== "ogun" && (
  <div className="mt-4">
    <div className="mb-4">
      <label className="block text-sm text-gray-700 font-medium mb-1">
        Are you Currently a resident of Ogun State?
      </label>
      <select
        name="isResidentOfOgun"
        value={
          formData.isResidentOfOgun === true
            ? "true"
            : formData.isResidentOfOgun === false
            ? "false"
            : ""
        }
        onChange={(e) => {
          const value = e.target.value === "true";
          setFormData((prev) => ({
            ...prev,
            isResidentOfOgun: value,
            // Reset LGA if "No"
            lgaOfResident: value ? prev.lgaOfResident : "",
          }));

          if (!value) {
            setErrors((prev) => ({
              ...prev,
              isResidentOfOgun:
                "You have to be a Resident to make an application",
              lgaOfResident: "",
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              isResidentOfOgun: "",
            }));
          }
        }}
        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 font-medium focus:border-transparent ${
          errors.isResidentOfOgun
            ? "border-red-600 focus:ring-red-600"
            : "border-gray-300 focus:ring-green-600"
        }`}
      >
        <option value="">Select an option</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>

      {errors.isResidentOfOgun && (
        <p className="text-xs font-medium text-red-600 mt-1">
          {errors.isResidentOfOgun}
        </p>
      )}
    </div>

    {/* ✅ Show this extra section only if "Yes" is selected */}
    {formData.isResidentOfOgun === true && (
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select LGA of Residence (Ogun State Only)
        </label>
        <select
          name="lgaOfResident"
          value={formData.lgaOfResident}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 font-medium focus:border-transparent ${
            errors.lgaOfResident
              ? "border-red-600 focus:ring-red-600"
              : "border-gray-300 focus:ring-green-600"
          }`}
        >
          <option value="">Select your LGA of residence</option>
          {ogunLgas.map((lga, index) => (
            <option key={index} value={lga}>
              {lga}
            </option>
          ))}
        </select>
        {errors.lgaOfResident && (
          <p className="text-xs text-red-600 mt-1">
            {errors.lgaOfResident}
          </p>
        )}
      </div>
    )}
  </div>
)}

            {[
              { name: "fatherNames", label: "Father's Name", placeholder: "Doe Monk" },
              { name: "motherNames", label: "Mother's Name", placeholder: "Doe Mara" },
              { name: "nativeTown", label: "Native Town", placeholder: "Akute" },
              { name: "nativePoliticalWard", label: "Native Political Ward", placeholder: "Akute Central Ward" },
              { name: "village", label: "Village", placeholder: "Akute Village" },
              { name: "communityHead", label: "Community Head", placeholder: "Mr Ajayi Isaac" },
              { 
                name: "communityHeadContact", 
                label: "Community Head Contact", 
                placeholder: "e.g. 08012345678 or +2348012345678" 
              },
              // { name: "currentAddress", label: "Current Address", placeholder: "No 2, Moon Street, Akute" },
              { name: "nin", label: "NIN", placeholder: "28392938921" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                   disabled={
        isNonOgun &&
        field.name !== "nin"  // NIN should NOT be disabled
      }
                //   className={`w-full px-4 py-2 rounded-lg focus:ring-2 font-medium focus:border-transparent ${
                //     errors[field.name]
                //       ? "border-red-600 focus:ring-red-600"
                //       : "border-gray-300 focus:ring-green-600"
                //   } border`}
                // />

                    className={`w-full px-4 py-2 rounded-lg font-medium 
        ${isNonOgun && field.name !== "nin" ? "bg-gray-100 cursor-not-allowed" : ""}
        ${errors[field.name]
          ? "border-red-600 focus:ring-red-600"
          : "border-gray-300 focus:ring-green-600"
        } border`}
    />
                {errors[field.name] && (
                  <p className="text-xs text-red-600 mt-1">{errors[field.name]}</p>
                )}
              </div>
            ))}


<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Current Address <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    name="currentAddress"
    value={formData.currentAddress}
    onChange={handleInputChange}
    placeholder="No 2, Moon Street, Akute"
    className={`w-full px-4 py-2 rounded-lg border font-medium focus:ring-2 ${
      errors.currentAddress
        ? "border-red-600 focus:ring-red-600"
        : "border-gray-300 focus:ring-green-600"
    }`}
  />

  {errors.currentAddress && (
    <p className="text-xs text-red-600 mt-1">{errors.currentAddress}</p>
  )}
</div>



{/* Optional Document from Community Head */}
<div className="mt-6">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Document from Community Head{" "}
    <span className="text-gray-400 text-xs">(Optional)</span>
  </label>

  <input
     ref={communityDocRef}
    type="file"
    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
    onChange={handleCommunityDocChange}
    className="block w-full text-sm text-gray-700 border font-medium rounded-lg cursor-pointer focus:outline-none 
      file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 
      file:bg-green-600 file:text-white hover:file:bg-green-700 
      border-gray-300 focus:ring-2 focus:ring-green-600"
  />

  {formData.docFromCommunityHead && (
    <div className="mt-3 flex items-center gap-3">
      {/* Preview for image files */}
      {formData.docFromCommunityHead.type.startsWith("image/") ? (
        <div className="relative">
          <img
            src={URL.createObjectURL(formData.docFromCommunityHead)}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-md border"
          />
          {/* Close (remove) button */}
          <button
            type="button"
             onClick={() => {
    // Clear the file from state
    setFormData((prev) => ({ ...prev, docFromCommunityHead: null }));

    // Also reset the input element value
    if (communityDocRef.current) {
      communityDocRef.current.value = ""; // clears the actual input field
    }

    // Optional: Revoke any temporary preview URLs if image
    if (formData.docFromCommunityHead?.type.startsWith("image/")) {
      URL.revokeObjectURL(formData.docFromCommunityHead.previewUrl);
    }
  }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
          >
            ×
          </button>
        </div>
      ) : (
      <div className="relative flex items-center gap-2 border p-2 rounded-md bg-gray-50">
  <div className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-md text-gray-600 font-semibold">
    📄
  </div>
  <span className="text-xs text-green-600 font-medium truncate max-w-[120px]">
    {formData.docFromCommunityHead?.name}
  </span>

  <button
    type="button"
    onClick={() => {
      setFormData((prev) => ({ ...prev, docFromCommunityHead: null }));
      if (communityDocRef.current) {
        communityDocRef.current.value = "";
      }
    }}
    className="ml-auto bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
  >
    ×
  </button>
</div>

      )}
    </div>
  )}

  <p className="text-xs text-gray-500 font-medium mt-2">
    Supported formats: PDF(Max: 3MB)
  </p>
</div>





   {/* Passport Upload with Face Detection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport Photograph {modelsLoaded && <span className="text-green-600 text-xs">(Face Detection Enabled)</span>}
              </label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isValidatingFace}
                className={`block w-full text-sm text-gray-700 border font-medium rounded-lg cursor-pointer focus:outline-none 
                file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 
                file:bg-green-600 file:text-white hover:file:bg-green-700
                ${isValidatingFace ? "opacity-50 cursor-not-allowed" : ""}
                ${
                  errors.passport
                    ? "border-red-600 focus:ring-red-600"
                    : "border-gray-300 focus:ring-green-600"
                }`}
              />
            
{isValidatingFace && (
  <div className="fixed inset-0 bg-transparent bg-opacity-40 flex flex-col items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
      <svg
        className="w-10 h-10 text-green-600 animate-spin mb-3"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <p className="text-sm font-medium text-gray-700">
      
      </p>
      <p className="text-xs text-gray-500 mt-1">Please wait a few seconds</p>
    </div>
  </div>
)}




              {/* {formData.passport && (
                <div className="relative inline-block mt-3">
                  <img
                    ref={imageRef}
                    src={formData.passport}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, passport: null }));
                      if (fileInputRef.current)
                        fileInputRef.current.value = "";
                    }}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                  >
                    <img src={CloseLogo} alt="Remove" className="w-3 h-3" />
                  </button>
                </div>
              )} */}

              {previewUrl && (
  <div className="relative inline-block mt-3">
    <img
      ref={imageRef}
      src={previewUrl} // ✅ use preview URL
      alt="Preview"
      className="w-24 h-24 object-cover rounded-lg border"
    />
    <canvas ref={canvasRef} className="hidden" />
    <button
      type="button"
      onClick={() => {
        setFormData((prev) => ({ ...prev, passport: null }));
        setPreviewUrl(null); // ✅ clear preview
        if (fileInputRef.current) fileInputRef.current.value = "";
      }}
      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
    >
      <img src={CloseLogo} alt="Remove" className="w-3 h-3" />
    </button>
  </div>
)}


              
              <p className="text-xs text-gray-500 font-medium mt-1">
                Maximum file size: 3MB. Photo must contain exactly one face.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 font-semibold py-3 rounded-lg transition-colors ${
                loading
                  ? "bg-green-500 cursor-not-allowed text-white"
                  : "bg-green-700 hover:bg-green-800 text-white"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );

};

  export default Application;

