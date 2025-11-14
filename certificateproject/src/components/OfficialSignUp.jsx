import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StateLogo from "../images/StateLogo.png";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseLogo from "../images/close.png";

const OfficialSignUp = () => {
  const navigate = useNavigate();

  const [previews, setPreviews] = useState({
  chairmanSignature: "",
  secretarySignature: "",
});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    staffID: "",
    lga: "",
    stateOfOrigin: "",
  });

  const [signatureData, setSignatureData] = useState({
    chairmanName: "",
    secretaryName: "",
    chairmanSignature: "",
    secretarySignature: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [showSignatureForm, setShowSignatureForm] = useState(false);


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


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSignatureChange = (e) => {
    setSignatureData({ ...signatureData, [e.target.name]: e.target.value });
  };



//   const handleFileChange = (e, field) => {
//   const file = e.target.files?.[0];
//   if (!file) return;

//   const reader = new FileReader();
//   reader.onloadend = () => {
//     const dataUrl = reader.result; // full "data:image/png;base64,..." string
//     setSignatureData((prev) => ({ ...prev, [field]: dataUrl })); // ✅ update signatureData
//     setPreviews((prev) => ({ ...prev, [field]: dataUrl })); // ✅ show preview
//   };

//   reader.readAsDataURL(file);
// };

const handleFileChange = (e, field) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setSignatureData((prev) => ({ ...prev, [field]: file })); // store raw file
  setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) })); // for preview
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.position.trim()) newErrors.position = "Please enter your role";
    if (!formData.staffID.trim()) newErrors.staffID = "Staff ID is required";
    if (!formData.lga.trim()) newErrors.lga = "Please select your LGA";
    if (!formData.stateOfOrigin.trim()) newErrors.stateOfOrigin = "Please select your State of Origin";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in as a super admin to register an official.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/admin/signup",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Official registered successfully!");  
       if (formData.stateOfOrigin === "Ogun") {
    // Only show signature question for Ogun State
    setMessage("Does your LGA have official signatures?");
    setShowSignatureForm(false);
  } else {
    // For all other states, just navigate directly
    navigate("/official");
  }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

//   const handleSignatureSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("You must be logged in as a super admin.");
//       return;
//     }

//     try {
//       setLoading(true);
//     await axios.post(
//   "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/signatory",
//   { lga: formData.lga, ...signatureData },
//   {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   }
// );
//       toast.success("LGA signatures registered successfully!");
//       navigate("/official");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to register signatures");
//     } finally {
//       setLoading(false);
//     }
//   };
const handleSignatureSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("You must be logged in as a super admin.");
    return;
  }

  try {
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("lga", formData.lga);
    formDataToSend.append("chairmanName", signatureData.chairmanName);
    formDataToSend.append("secretaryName", signatureData.secretaryName);
    formDataToSend.append("chairmanSignature", signatureData.chairmanSignature);
    formDataToSend.append("secretarySignature", signatureData.secretarySignature);

    await axios.post(
      "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/signatory",
      formDataToSend,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("LGA signatures registered successfully!");
    navigate("/official");
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to register signatures");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 bg-green-700 text-white flex-col justify-center items-center p-10">
        <img src={StateLogo} alt="State Logo" className="w-24 h-24 mb-4" />
        <h1 className="text-2xl font-semibold">Ogun State Government</h1>
        <p className="text-lg mt-2 font-medium">L.G.A</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8 sm:px-12 py-12">
        {!showSignatureForm && !message && (
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
            {/* Header */}
            <div className="flex flex-col items-center mb-6">
              <img src={StateLogo} alt="State Logo" className="w-14 h-14 mb-2" />
              <h3 className="text-gray-800 font-semibold text-lg">Ogun State Government</h3>
              <p className="text-xs font-medium text-gray-500">Register a Local Government Official</p>
            </div>

            {/* Existing Form Inputs (First Name, Last Name, Email, Phone, Position, StaffID, State, LGA) */}
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full p-2 border rounded font-medium ${errors.firstName ? "border-red-600" : "border-gray-300"}`}
              />
              {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
            </div>

            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full p-2 border rounded font-medium ${errors.lastName ? "border-red-600" : "border-gray-300"}`}
              />
              {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Official Email Address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded font-medium ${errors.email ? "border-red-600" : "border-gray-300"}`}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-2 border rounded font-medium ${errors.phone ? "border-red-600" : "border-gray-300"}`}
            />
            {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <input
              type="text"
              name="position"
              placeholder="Enter your official role"
              value={formData.position}
              onChange={handleChange}
              className={`w-full p-2 border rounded font-medium ${errors.position ? "border-red-600" : "border-gray-300"}`}
            />
            {errors.position && <p className="text-xs text-red-600 mt-1">{errors.position}</p>}
          </div>

          {/* Staff ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID</label>
            <input
              type="text"
              name="staffID"
              placeholder="Staff ID/Official Number"
              value={formData.staffID}
              onChange={handleChange}
              className={`w-full p-2 border rounded font-medium ${errors.staffID ? "border-red-600" : "border-gray-300"}`}
            />
            {errors.staffID && <p className="text-xs text-red-600 mt-1">{errors.staffID}</p>}
          </div>

          {/* ✅ State of Origin Dropdown */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State of Origin
            </label>
            <select
              name="stateOfOrigin"
              value={formData.stateOfOrigin}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border font-medium focus:ring-2 ${errors.stateOfOrigin ? "border-red-600 focus:ring-red-600" : "border-gray-300 focus:ring-green-600"}`}
            >
              <option value="">Select your State</option>
              {NIGERIAN_STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.stateOfOrigin && <p className="text-xs text-red-600 mt-1">{errors.stateOfOrigin}</p>}
          </div> */}

          {/* LGA */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Local Government Area (LGA)
            </label>
            <select
              name="lga"
              value={formData.lga}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border font-medium focus:ring-2 ${errors.lga ? "border-red-600 focus:ring-red-600" : "border-gray-300 focus:ring-green-600"}`}
            >
              <option value="">Select your LGA</option>
              {OGUN_LGAS.map((lga) => (
                <option key={lga} value={lga}>{lga}</option>
              ))}
            </select>
            {errors.lga && <p className="text-xs text-red-600 mt-1">{errors.lga}</p>}
          </div> */}


          {/* state of Origin */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    State of Origin
  </label>
  <select
    name="stateOfOrigin"
    value={formData.stateOfOrigin}
    onChange={handleChange}
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
  onChange={handleChange}
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
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#11860F] text-white font-semibold py-3 rounded-md transition-colors
              ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#0c670b]"}`}
            >
              {loading ? "Creating Account..." : "Register Official"}
            </button>
          </form>
        )}

        {message && !showSignatureForm && (
          <div className="mt-6 text-center">
            <p className="text-black font-medium">{message}</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => navigate("/official")}
                className="bg-green-700 font-medium px-4 py-2 text-white rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setShowSignatureForm(true)}
                className="bg-red-600 font-medium px-4 py-2 text-white rounded"
              >
                No (Register)
              </button>
            </div>
          </div>
        )}

{/* signature aspect */}

        {showSignatureForm && (
          <form onSubmit={handleSignatureSubmit} className="w-full max-w-md space-y-5 mt-4">
             <label className="block text-sm font-medium text-gray-700 mb-1">
    Chairman Name
  </label>
            <input
              type="text"
              name="chairmanName"
              placeholder="Chairman Name"
              value={signatureData.chairmanName}
              onChange={handleSignatureChange}
              className="w-full p-2 font-medium border rounded"
              required
            />
                     <label className="block text-sm font-medium text-gray-700 mb-1">
    Secretary Name
  </label>
            <input
              type="text"
              name="secretaryName"
              placeholder="Secretary Name"
              value={signatureData.secretaryName}
              onChange={handleSignatureChange}
              className="w-full p-2 font-medium  border rounded"
              required
            />

{/* Chairman Signature Upload */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Chairman Signature
  </label>

  {!previews.chairmanSignature ? (
    <input
      type="file"
      accept="image/*"
      onChange={(e) => handleFileChange(e, "chairmanSignature")}
      required
      className="w-full border rounded p-2"
    />
  ) : (
    <div className="relative w-40 h-40">
      <img
        src={previews.chairmanSignature}
        alt="Chairman Preview"
        className="w-full h-full object-contain border rounded-md"
      />
      <img
        src={CloseLogo}
        alt="Remove"
        className="absolute top-1 right-1 w-5 h-5 cursor-pointer"
        onClick={() => {
          setPreviews((prev) => ({ ...prev, chairmanSignature: "" }));
          setSignatureData((prev) => ({ ...prev, chairmanSignature: "" }));
        }}
      />
    </div>
  )}
</div>

{/* Secretary Signature Upload */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Secretary Signature
  </label>

  {!previews.secretarySignature ? (
    <input
      type="file"
      accept="image/*"
      onChange={(e) => handleFileChange(e, "secretarySignature")}
      required
      className="w-full border rounded p-2"
    />
  ) : (
    <div className="relative w-40 h-40">
      <img
        src={previews.secretarySignature}
        alt="Secretary Preview"
        className="w-full h-full object-contain border rounded-md"
      />
      <img
        src={CloseLogo}
        alt="Remove"
        className="absolute top-1 right-1 w-5 h-5 cursor-pointer"
        onClick={() => {
          setPreviews((prev) => ({ ...prev, secretarySignature: "" }));
          setSignatureData((prev) => ({ ...prev, secretarySignature: "" }));
        }}
      />
    </div>
  )}
</div>


            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#11860F] text-white font-semibold py-3 rounded-md transition-colors
              ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#0c670b]"}`}
            >
              {loading ? "Submitting..." : "Submit Signatures"}
            </button>
          </form>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default OfficialSignUp;
