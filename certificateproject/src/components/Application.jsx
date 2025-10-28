import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Settings, Bell, LogOutIcon } from "lucide-react";
import Bg from "../images/Bg.png";
import StateLogo from "../images/StateLogo.png";
import { useNavigate } from "react-router-dom";
import CloseLogo from "../images/close.png";
import MenuLogo from "../images/menu.png";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const Application = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);



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
    passport: null,
  });




useEffect(() => {
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!storedUser || !token) {
    navigate("/login");
    return;
  }

  setUser(JSON.parse(storedUser));

  const checkExistingApplication = async () => {
    try {
      const res = await axios.get(
        "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/application",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;
      const applications = data?.data?.applications || [];

      if (!data.success || applications.length === 0) {
        toast.info("✅ You can proceed with your new application.");
        return;
      }

   
        if (existingPendingApp.isPendingPayment || existingPendingApp.paymentStatus === "incomplete") {
  // ✅ Check for any possible payment link property names
  const paymentLink =
    existingPendingApp.pendingPaymentLink || // ✅ your preferred field
    existingPendingApp.paymentLink ||
    existingPendingApp.payment_url ||
    existingPendingApp.paymentLinkUrl ||
    existingPendingApp.payment_reference ||
    null;

  if (paymentLink) {
    toast.info("💳 You have an incomplete payment. Redirecting you to continue...");
    setTimeout(() => {
      window.location.href = paymentLink;
    }, 1500);
  } else {
    toast.warning(
      "⚠️ Your payment is pending, but we couldn’t find a valid payment link. Redirecting to your dashboard..."
    );
    setTimeout(() => navigate("/dashboard"), 4000);
  }
  return;
}

      // Allow reapply only if all previous applications are rejected
      const allRejected = applications.every(app => app.isRejected);
      if (!allRejected) {
        toast.warning("⚠️ You cannot reapply yet. Please wait for your pending application.");
        setTimeout(() => navigate("/dashboard"), 2000);
        return;
      }

      // Safe to reapply
      // toast.info("❌ Your previous application was rejected. You can reapply.");
      
    } catch (error) {
      console.error("❌ Error checking application:", error);
      toast.error("Failed to verify application status. Please try again.");
    }
  };

  checkExistingApplication();
}, [navigate]);


  const OGUN_LGAS = [
  "Abeokuta North",
  "Abeokuta South",
  "Ewekoro",
  "Ifo",
  "Obafemi Owode",
  "Odeda",
  "Ijebu East",
  "Ijebu North",
  "Ijebu North East",
  "Ijebu Ode",
  "Ikenne",
  "Odogbolu",
  "Ogun Waterside",
  "Remo North",
  "Sagamu",
  "Ado-Odo/Ota",
  "Imeko Afon",
  "Ipokia",
  "Yewa North (Egbado North)",
  "Yewa South (Egbado South)"
];


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error when typing
  };


const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const maxSize = 3 * 1024 * 1024; // 3MB
  if (file.size > maxSize) {
    setErrors(prev => ({ ...prev, passport: "File too large. Maximum size is 3MB." }));
    if (fileInputRef.current) fileInputRef.current.value = "";
    return;
  }

  // Convert file to base64 for preview & form submission
  const reader = new FileReader();
  reader.onloadend = () => {
    const base64Image = reader.result;

    // Basic image validation (ensure it's a valid image)
    const img = new Image();
    img.src = base64Image;

    img.onload = () => {
      setErrors(prev => ({ ...prev, passport: "" }));
      setFormData(prev => ({ ...prev, passport: base64Image }));
    };

    img.onerror = () => {
      setErrors(prev => ({ ...prev, passport: "Invalid image file." }));
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFormData(prev => ({ ...prev, passport: null }));
    };
  };

  reader.readAsDataURL(file);
};




  const handleDashboard = () => {
    navigate("/dashboard");
  };

    // ✅ Proper logout function
  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login
    navigate("/login");
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = {};
  

  // ✅ Basic required fields
  if (!formData.fullNames?.trim()) newErrors.fullNames = "Required";
  if (!formData.fatherNames?.trim()) newErrors.fatherNames = "Required";
  if (!formData.motherNames?.trim()) newErrors.motherNames = "Required";
  if (!formData.nativeTown?.trim()) newErrors.nativeTown = "Required";
  if (!formData.nativePoliticalWard?.trim())
    newErrors.nativePoliticalWard = "Required";
  if (!formData.village?.trim()) newErrors.village = "Required";
  if (!formData.communityHead?.trim()) newErrors.communityHead = "Required";
  if (!formData.communityHead?.trim()) newErrors.communityHead = "Required";
  // check this  
  if (!formData.communityHeadContact?.toString().trim()) {
  newErrors.communityHeadContact = "Required";
} else if (!/^[\d+\s-]+$/.test(formData.communityHeadContact)) {
  newErrors.communityHeadContact = "Invalid contact format";
}
  if (!formData.currentAddress?.trim()) newErrors.currentAddress = "Required";
  if (!formData.lga?.trim()) newErrors.lga = "Required";
  if (!formData.nin?.trim()) {
    newErrors.nin = "Required";
  } else if (!/^\d{11}$/.test(formData.nin)) {
    // ✅ NIN must be exactly 11 digits (numbers only)
    newErrors.nin = "NIN must be exactly 11 digits";
  }
  if (!formData.passport) newErrors.passport = "Required";

  // Stop if errors exist
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  
  setLoading(true); // ✅ Start loading
  try {
    const token = localStorage.getItem("token");
    if (!token) {
     toast.error("⚠️ Please log in again.", { position: "top-center" });
      navigate("/login");
      return;
    }

    // ✅ Submit to backend
    const res = await axios.post(
      "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/application",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Response:", res.data);

    // ✅ Handle success & redirect to payment
    if (res.data.success && res.data.data?.paymentLink) {
    // Success
toast.success("✅ Application submitted! Redirecting to payment...");
      window.location.href = res.data.data.paymentLink;
    } else {
      alert(res.data.message || "Something went wrong.");
    }

  } catch (error) {
    if (error.response) {
    console.error("Backend message:", error.response.data);
    toast.error(error.response.data.message || "Something went wrong.");
  } else {
    toast.error("Network error. Please try again.");
  }

  }finally{
     setLoading(false); // ✅ Stop loading
  }
};

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      {/* Header omitted for brevity */}
        {/* Top Navbar */}
            <header className="flex items-center justify-between px-6 sm:px-8 py-4 bg-white shadow-sm relative">
              {/* Left Section */}
              <div className="flex items-center gap-3">
                <img src={StateLogo} alt="State Logo" className="w-10 h-10" />
                <h1 className="text-base sm:text-lg font-semibold text-[#475467]">
                  Ogun State Government
                </h1>
              </div>
      
              {/* Desktop Icons */}
              <div className="hidden md:flex items-center gap-5">
                <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#11860F]" />
                <LogOutIcon onClick={handleLogout} className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#11860F]" />
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-semibold uppercase">
                  {user
                    ? `${user.firstName?.charAt(0).toUpperCase()}${user.lastName?.charAt(0).toUpperCase()}`
                    : "?"}
                </div>
              </div>
      
              {/* Mobile Menu Toggle */}
              <div className="md:hidden flex items-center">
                <button onClick={() => setMenuOpen(!menuOpen)}>
                  <img
                    src={menuOpen ? CloseLogo : MenuLogo}
                    alt="menu toggle"
                    className="w-6 h-6"
                  />
                </button>
              </div>
      
              {/* Mobile Dropdown Menu */}
              {menuOpen && (
                <div className="absolute top-full right-4 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 p-4 flex flex-col items-center gap-4 w-40 z-50 md:hidden animate-fadeIn">
                  <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#11860F]" />
                  <LogOutIcon onClick={handleLogout} className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#11860F]" />
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-semibold uppercase">
                    {user
                      ? `${user.firstName?.charAt(0).toUpperCase()}${user.lastName?.charAt(0).toUpperCase()}`
                      : "?"}
                  </div>
                </div>
              )}
            </header>

      {/* Back Button */}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Text Fields */}
            {[
              { name: "fullNames", label: "Full Name", placeholder: "John Doe" },
              { name: "fatherNames", label: "Father’s Name", placeholder: "Doe Monk" },
              { name: "motherNames", label: "Mother’s Name", placeholder: "Doe Mara" },
              { name: "nativeTown", label: "Native Town", placeholder: "Akute" },
              { name: "nativePoliticalWard", label: "Native Political Ward", placeholder: "Akute Central Ward" },
              { name: "village", label: "Village", placeholder: "Akute Village" },
              { name: "communityHead", label: "Community Head", placeholder: "Mr Ajayi Isaac" },
              { 
  name: "communityHeadContact", 
  label: "Community Head Contact", 
  placeholder: "e.g. 08012345678 or +2348012345678" 
},
              { name: "currentAddress", label: "Current Address", placeholder: "No 2, Moon Street, Akute" },
            
              { name: "nin", label: "NIN", placeholder: "2839293892" },
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
                  className={`w-full px-4 py-2 rounded-lg focus:ring-2 font-medium focus:border-transparent ${
                    errors[field.name]
                      ? "border-red-600 focus:ring-red-600"
                      : "border-gray-300 focus:ring-green-600"
                  } border`}
                />
                {errors[field.name] && (
                  <p className="text-xs text-red-600 mt-1">{errors[field.name]}</p>
                )}
              </div>
            ))}

            {/* LGA Dropdown */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Local Government Area (LGA)
  </label>
  <select
    name="lga"
    value={formData.lga}
    onChange={handleInputChange}
    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 font-medium focus:border-transparent ${
      errors.lga
        ? "border-red-600 focus:ring-red-600"
        : "border-gray-300 focus:ring-green-600"
    }`}
  >
    <option value="">Select your LGA</option>
    {OGUN_LGAS.map((lga) => (
      <option key={lga} value={lga}>
        {lga}
      </option>
    ))}
  </select>
  {errors.lga && (
    <p className="text-xs text-red-600 mt-1">{errors.lga}</p>
  )}
</div>


            {/* Passport Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport Photograph
              </label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className={`block w-full text-sm text-gray-700 border font-medium rounded-lg cursor-pointer focus:outline-none 
                file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 
                file:bg-green-600 file:text-white hover:file:bg-green-700
                ${
                  errors.passport
                    ? "border-red-600 focus:ring-red-600"
                    : "border-gray-300 focus:ring-green-600"
                }`}
              />
              {errors.passport && (
                <p className="text-xs text-red-600 mt-1">{errors.passport}</p>
              )}

              {formData.passport && (
                <div className="relative inline-block mt-3">
                  <img
                    src={formData.passport}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
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

              )}
              <p className="text-xs text-gray-500 font-medium mt-1">Maximum file size: 3MB</p>

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
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
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