import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StateLogo from "../images/StateLogo.png";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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
   
  });

 

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [showSignatureForm, setShowSignatureForm] = useState(false);




useEffect(() => {
  const fetchOgunLgas = async () => {
    try {
      const res = await axios.get(
        "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/lgas?state=Ogun"
      );

      const lgaArray = res.data?.data?.lgas;

      if (res.data.success && Array.isArray(lgaArray)) {
        setLgas(lgaArray);
      } else {
        toast.error("Failed to load Ogun LGAs");
      }
    } catch (error) {
      console.error("Error fetching Ogun LGAs:", error);
      toast.error("Could not fetch LGAs. Try again.");
    }
  };

  fetchOgunLgas();
}, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const token = localStorage.getItem("token");
    console.log("Token:", token); // Debugging line
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

      toast.success("Official registered successfully! , Check your email for login details.");  
    
    // ⏳ Delay navigation
  // setTimeout(() => {
  //   navigate("/official");
  // }, 2000); 
  // 2 seconds delay
 
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };






  return (
    <div className="flex min-h-screen justify-center items-center bg-white">
     

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

       

          {/* state of Origin */}


<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Local Government Area (LGA)
  </label>
  <select
    name="lga"
    value={formData.lga}
    onChange={handleChange}
    className={`w-full px-4 py-2 rounded-lg border font-medium focus:ring-2 ${
      errors.lga ? "border-red-600 focus:ring-red-600" : "border-gray-300 focus:ring-green-600"
    }`}
  >
    <option value="">Select your LGA</option>
    {lgas.map((lga, index) => (
      <option key={index} value={lga}>
        {lga}
      </option>
    ))}
  </select>
  {errors.lga && <p className="text-xs text-red-600 mt-1">{errors.lga}</p>}
</div>

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




        
       


      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default OfficialSignUp;
