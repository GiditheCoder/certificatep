import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StateLogo from "../images/StateLogo.png";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OfficialSignUp = () => {
  const navigate = useNavigate();

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

  const OGUN_LGAS = [
    "Abeokuta North", "Abeokuta South", "Ewekoro", "Ifo", "Obafemi Owode",
    "Odeda", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode",
    "Ikenne", "Odogbolu", "Ogun Waterside", "Remo North", "Sagamu",
    "Ado-Odo/Ota", "Imeko Afon", "Ipokia", "Yewa North (Egbado North)", "Yewa South (Egbado South)"
  ];

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

    const token = localStorage.getItem("token"); // ⚡ Make sure your super admin token is stored
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

      console.log("✅ Form submitted:", res.data);

      toast.success("Email registered successfully! Please verify your email.", {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
      });

      setMessage("Official registered successfully!");

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/official");
      }, 1500);

    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.message || "Something went wrong. Please try again.";

      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
      });

      setMessage(errorMessage);
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
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <img src={StateLogo} alt="State Logo" className="w-14 h-14 mb-2" />
            <h3 className="text-gray-800 font-semibold text-lg">Ogun State Government</h3>
            <p className="text-xs font-medium text-gray-500">Register a Local Government Official</p>
          </div>

          {/* First & Last Name */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
               firstName
              </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
                lastName
              </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
              </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
              </label>
            <input
              type="tel"
              name="phone"
              placeholder="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-2 border rounded font-medium ${errors.phone ? "border-red-600" : "border-gray-300"}`}
            />
            {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
                StaffID
              </label>
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

          {/* LGA */}
          <div>
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
          </div>

          {/* Submit */}
          <button
            type="submit"
              disabled={loading}
            className={`w-full bg-[#11860F] text-white font-semibold py-3 rounded-md hover:bg-[#0c670b] transition-colors
              ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#0c670b]"}`}
          >
            {loading ? "Creating Account..." : "Register Official"}
          </button>

          {/* Success/Error Message */}
          {message && (
            <p className="text-sm text-center text-green-700 mt-4 font-medium">
              {message}
            </p>
          )}
        </form>
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

export default OfficialSignUp;


