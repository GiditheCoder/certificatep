// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import StateLogo from "../images/StateLogo.png";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const OfficialSignUp = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     position: "",
//     staffID: "",
//     lga: "",
//     stateofOrigin: ""
//   });

//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const OGUN_LGAS = [
//     "Abeokuta North", "Abeokuta South", "Ewekoro", "Ifo", "Obafemi Owode",
//     "Odeda", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode",
//     "Ikenne", "Odogbolu", "Ogun Waterside", "Remo North", "Sagamu",
//     "Ado-Odo/Ota", "Imeko Afon", "Ipokia", "Yewa North (Egbado North)", "Yewa South (Egbado South)"
//   ];

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     const newErrors = {};

//     if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
//     if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
//     if (!formData.email.trim()) newErrors.email = "Email is required";
//     if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
//     if (!formData.position.trim()) newErrors.position = "Please enter your role";
//     if (!formData.staffID.trim()) newErrors.staffID = "Staff ID is required";
//     if (!formData.lga.trim()) newErrors.lga = "Please select your LGA";

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     const token = localStorage.getItem("token"); // ⚡ Make sure your super admin token is stored
//     if (!token) {
//       toast.error("You must be logged in as a super admin to register an official.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await axios.post(
//         "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/admin/signup",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("✅ Form submitted:", res.data);

//       toast.success("Email registered successfully! Please verify your email.", {
//         position: "top-center",
//         autoClose: 4000,
//         theme: "colored",
//       });

//       setMessage("Official registered successfully!");

//       // Redirect after a short delay
//       setTimeout(() => {
//         navigate("/official");
//       }, 1500);

//     } catch (err) {
//       console.error("❌ Error:", err.response?.data || err.message);
//       const errorMessage =
//         err.response?.data?.message || "Something went wrong. Please try again.";

//       toast.error(errorMessage, {
//         position: "top-center",
//         autoClose: 4000,
//         theme: "colored",
//       });

//       setMessage(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen flex-col lg:flex-row">
//       {/* LEFT SIDE */}
//       <div className="hidden lg:flex w-1/2 bg-green-700 text-white flex-col justify-center items-center p-10">
//         <img src={StateLogo} alt="State Logo" className="w-24 h-24 mb-4" />
//         <h1 className="text-2xl font-semibold">Ogun State Government</h1>
//         <p className="text-lg mt-2 font-medium">L.G.A</p>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8 sm:px-12 py-12">
//         <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
//           {/* Header */}
//           <div className="flex flex-col items-center mb-6">
//             <img src={StateLogo} alt="State Logo" className="w-14 h-14 mb-2" />
//             <h3 className="text-gray-800 font-semibold text-lg">Ogun State Government</h3>
//             <p className="text-xs font-medium text-gray-500">Register a Local Government Official</p>
//           </div>

//           {/* First & Last Name */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="w-full sm:w-1/2">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//                firstName
//               </label>
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="First Name"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 className={`w-full p-2 border rounded font-medium ${errors.firstName ? "border-red-600" : "border-gray-300"}`}
//               />
//               {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
//             </div>

//             <div className="w-full sm:w-1/2">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//                 lastName
//               </label>
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Last Name"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 className={`w-full p-2 border rounded font-medium ${errors.lastName ? "border-red-600" : "border-gray-300"}`}
//               />
//               {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
//             </div>
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//               </label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Official Email Address"
//               value={formData.email}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded font-medium ${errors.email ? "border-red-600" : "border-gray-300"}`}
//             />
//             {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Phone
//               </label>
//             <input
//               type="tel"
//               name="phone"
//               placeholder="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded font-medium ${errors.phone ? "border-red-600" : "border-gray-300"}`}
//             />
//             {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
//           </div>

//           {/* Position */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Position
//               </label>
//             <input
//               type="text"
//               name="position"
//               placeholder="Enter your official role"
//               value={formData.position}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded font-medium ${errors.position ? "border-red-600" : "border-gray-300"}`}
//             />
//             {errors.position && <p className="text-xs text-red-600 mt-1">{errors.position}</p>}
//           </div>

//           {/* Staff ID */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//                 StaffID
//               </label>
//             <input
//               type="text"
//               name="staffID"
//               placeholder="Staff ID/Official Number"
//               value={formData.staffID}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded font-medium ${errors.staffID ? "border-red-600" : "border-gray-300"}`}
//             />
//             {errors.staffID && <p className="text-xs text-red-600 mt-1">{errors.staffID}</p>}
//           </div>


//  {/* State of Origin */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               State of Origin
//             </label>
//             <input
//               type="text"
//               name="stateOfOrigin"
//               placeholder="e.g. Ogun"
//               value={formData.stateOfOrigin}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded font-medium ${errors.stateOfOrigin ? "border-red-600" : "border-gray-300"}`}
//             />
//             {errors.stateOfOrigin && <p className="text-xs text-red-600 mt-1">{errors.stateOfOrigin}</p>}
//           </div>




//           {/* LGA */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Local Government Area (LGA)
//             </label>
//             <select
//               name="lga"
//               value={formData.lga}
//               onChange={handleChange}
//               className={`w-full px-4 py-2 rounded-lg border font-medium focus:ring-2 ${errors.lga ? "border-red-600 focus:ring-red-600" : "border-gray-300 focus:ring-green-600"}`}
//             >
//               <option value="">Select your LGA</option>
//               {OGUN_LGAS.map((lga) => (
//                 <option key={lga} value={lga}>{lga}</option>
//               ))}
//             </select>
//             {errors.lga && <p className="text-xs text-red-600 mt-1">{errors.lga}</p>}
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//               disabled={loading}
//             className={`w-full bg-[#11860F] text-white font-semibold py-3 rounded-md hover:bg-[#0c670b] transition-colors
//               ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#0c670b]"}`}
//           >
//             {loading ? "Creating Account..." : "Register Official"}
//           </button>

//           {/* Success/Error Message */}
//           {message && (
//             <p className="text-sm text-center text-green-700 mt-4 font-medium">
//               {message}
//             </p>
//           )}
//         </form>
//       </div>

//       <ToastContainer
//         position="top-center"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         pauseOnHover
//         draggable
//         theme="colored"
//       />
//     </div>
//   );
// };

// export default OfficialSignUp;



  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setMessage("");
  //   const newErrors = {};

  //   if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
  //   if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
  //   if (!formData.email.trim()) newErrors.email = "Email is required";
  //   if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
  //   if (!formData.position.trim()) newErrors.position = "Please enter your role";
  //   if (!formData.staffID.trim()) newErrors.staffID = "Staff ID is required";
  //   if (!formData.lga.trim()) newErrors.lga = "Please select your LGA";
  //   if (!formData.stateOfOrigin.trim()) newErrors.stateOfOrigin = "Please select your State of Origin"; // ✅ Added validation

  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return;
  //   }

  //   const token = localStorage.getItem("token");
    
  //   if (!token) {
  //     toast.error("You must be logged in as a super admin to register an official.");
  //     return;
  //   }
  //   console.log('token:', localStorage.getItem('token'));

    
  //   try {
  //     setLoading(true);

  //     const res = await axios.post(
  //       "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/admin/signup",
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     console.log("✅ Form submitted:", res.data);

  //     toast.success("Email registered successfully! Please verify your email.", {
  //       position: "top-center",
  //       autoClose: 4000,
  //       theme: "colored",
  //     });

  //     setMessage("Official registered successfully!");

  //     setTimeout(() => {
  //       navigate("/official");
  //     }, 1500);
  //   } catch (err) {
  //     console.error("❌ Error:", err.response?.data || err.message);
  //     const errorMessage =
  //       err.response?.data?.message || "Something went wrong. Please try again.";

  //     toast.error(errorMessage, {
  //       position: "top-center",
  //       autoClose: 4000,
  //       theme: "colored",
  //     });

  //     setMessage(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const [formData, setFormData] = useState({
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   phone: "",
  //   position: "",
  //   staffID: "",
  //   lga: "",
  //   stateOfOrigin: "", // ✅ Added here
  // });



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import StateLogo from "../images/StateLogo.png";
// import CloseLogo from "../images/close.png";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const OfficialSignUp = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//   firstName: "",
//   lastName: "",
//   email: "",
//   phone: "",
//   position: "",
//   staffID: "",
//   lga: "",
//   stateOfOrigin: "",
//   chairmanName: "",
//   secretaryName: "",
//   chairmanSignature: "",
//   secretarySignature: "",
// });

//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [states, setStates] = useState([]);
//   const [lgas, setLgas] = useState([]);


//   const [previews, setPreviews] = useState({
//   chairmanSignature: null,
//   secretarySignature: null,
// });



// // const handleFileChange = (e, field) => {
// //   const file = e.target.files[0];
// //   if (!file) return;

// //   const reader = new FileReader();
// //   reader.onloadend = () => {
// //     const base64String = reader.result.split(",")[1]; // extract only the Base64 data
// //     console.log("✅ Base64 output:", base64String.slice(0, 100) + "..."); // log first 100 chars

// //     setFormData((prev) => ({
// //       ...prev,
// //       [field]: base64String,
// //     }));
// //   };
// //   reader.readAsDataURL(file);
// // };

// const handleFileChange = (e, field) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const reader = new FileReader();
//   reader.onloadend = () => {
//     const base64Data = reader.result.split(",")[1];

//     setFormData((prev) => ({
//       ...prev,
//       [field]: base64Data, // Base64 only for backend
//     }));

//     setPreviews((prev) => ({
//       ...prev,
//       [field]: reader.result, // Full Data URL for preview
//     }));
//   };

//   reader.readAsDataURL(file);
// };


//   // state of origin
//  useEffect(() => {
//   const fetchStates = async () => {
//     try {
//       const res = await axios.get("https://lgacertificate-011d407b356b.herokuapp.com/api/v1/states");
//         console.log("🌍 States API response:", res.data); // 👈 ADD THIS
//       if (res.data.success && Array.isArray(res.data.data)) {
//         setStates(res.data.data);
//       } else {
//         toast.error("Failed to load states");
//       }
//     } catch (error) {
//       console.error("❌ Error fetching states:", error);
//       toast.error("Could not fetch states. Please try again.");
//     }
//   };

//   fetchStates();
// }, []);


// // lga
// useEffect(() => {
//   const fetchLgas = async () => {
//     if (!formData.stateOfOrigin) return; // Don’t fetch until a state is chosen

//     try {
//       const encodedState = encodeURIComponent(formData.stateOfOrigin);
//       const res = await axios.get(
//         `https://lgacertificate-011d407b356b.herokuapp.com/api/v1/lgas?state=${encodedState}`
//       );

//       // ✅ Access nested structure
//       const lgaArray = res.data?.data?.lgas;

//       if (res.data.success && Array.isArray(lgaArray)) {
//         setLgas(lgaArray);
//       } else {
//         toast.error(`Failed to locate LGAs for ${formData.stateOfOrigin}`);
//       }
//     } catch (error) {
//       console.error("❌ Error fetching LGAs:", error);
//       toast.error("Could not fetch LGAs. Please try again.");
//     }
//   };

//   fetchLgas();
// }, [formData.stateOfOrigin]);


//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//   };


//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setMessage("");
//   const newErrors = {};

//   // 🧾 Basic field validations
//   if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
//   if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
//   if (!formData.email.trim()) newErrors.email = "Email is required";
//   if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
//   if (!formData.position.trim()) newErrors.position = "Please enter your role";
//   if (!formData.staffID.trim()) newErrors.staffID = "Staff ID is required";
//   if (!formData.lga.trim()) newErrors.lga = "Please select your LGA";
//   if (!formData.stateOfOrigin.trim()) newErrors.stateOfOrigin = "Please select your State of Origin";

//   // 🖋️ Optional: validation for signatory fields (only if they’re visible)
//   if (!formData.chairmanName.trim()) newErrors.chairmanName = "Chairman name is required";
//   if (!formData.secretaryName.trim()) newErrors.secretaryName = "Secretary name is required";
//   if (!formData.chairmanSignature) newErrors.chairmanSignature = "Chairman signature is required";
//   if (!formData.secretarySignature) newErrors.secretarySignature = "Secretary signature is required";

//   if (Object.keys(newErrors).length > 0) {
//     setErrors(newErrors);
//     return;
//   }

//   const token = localStorage.getItem("token");

//   if (!token) {
//     toast.error("You must be logged in as a super admin to register an official.", {
//       position: "top-center",
//       autoClose: 4000,
//       theme: "colored",
//     });
//     return;
//   }

//   console.log("🔐 Token:", token);

//   try {
//     setLoading(true);

//     // 1️⃣ Register the official
//     const officialRes = await axios.post(
//       "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/admin/signup",
//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("✅ Official registered:", officialRes.data);

//     // 2️⃣ Register the LGA signatures
//     const signatoryData = {
//       lga: formData.lga,
//       chairmanName: formData.chairmanName,
//       secretaryName: formData.secretaryName,
//       chairmanSignature: formData.chairmanSignature,
//       secretarySignature: formData.secretarySignature,
//     };

//     const signatoryRes = await axios.post(
//       "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/signatory",
//       signatoryData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("✅ Signatory registered:", signatoryRes.data);

//     toast.success("Official and signatures registered successfully!", {
//       position: "top-center",
//       autoClose: 4000,
//       theme: "colored",
//     });

//     setMessage("Official and signatures registered successfully!");

//     setTimeout(() => {
//       navigate("/official");
//     }, 1500);
//   } catch (err) {
//     console.error("❌ Error:", err.response?.data || err.message);
//     const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";

//     toast.error(errorMessage, {
//       position: "top-center",
//       autoClose: 4000,
//       theme: "colored",
//     });

//     setMessage(errorMessage);
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="flex min-h-screen flex-col lg:flex-row">
//       {/* LEFT SIDE */}
//       <div className="hidden lg:flex w-1/2 bg-green-700 text-white flex-col justify-center items-center p-10">
//         <img src={StateLogo} alt="State Logo" className="w-24 h-24 mb-4" />
//         <h1 className="text-2xl font-semibold">Ogun State Government</h1>
//         <p className="text-lg mt-2 font-medium">L.G.A</p>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8 sm:px-12 py-12">
//         <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
//           {/* Header */}
//           <div className="flex flex-col items-center mb-6">
//             <img src={StateLogo} alt="State Logo" className="w-14 h-14 mb-2" />
//             <h3 className="text-gray-800 font-semibold text-lg">Ogun State Government</h3>
//             <p className="text-xs font-medium text-gray-500">Register a Local Government Official</p>
//           </div>

//           {/* First & Last Name */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="w-full sm:w-1/2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="First Name"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 className={`w-full p-2 border rounded font-medium ${errors.firstName ? "border-red-600" : "border-gray-300"}`}
//               />
//               {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
//             </div>

//             <div className="w-full sm:w-1/2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Last Name"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 className={`w-full p-2 border rounded font-medium ${errors.lastName ? "border-red-600" : "border-gray-300"}`}
//               />
//               {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
//             </div>
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Official Email Address"
//               value={formData.email}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded font-medium ${errors.email ? "border-red-600" : "border-gray-300"}`}
//             />
//             {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//             <input
//               type="tel"
//               name="phone"
//               placeholder="Phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded font-medium ${errors.phone ? "border-red-600" : "border-gray-300"}`}
//             />
//             {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
//           </div>

//           {/* Position */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
//             <input
//               type="text"
//               name="position"
//               placeholder="Enter your official role"
//               value={formData.position}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded font-medium ${errors.position ? "border-red-600" : "border-gray-300"}`}
//             />
//             {errors.position && <p className="text-xs text-red-600 mt-1">{errors.position}</p>}
//           </div>

//           {/* Staff ID */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID</label>
//             <input
//               type="text"
//               name="staffID"
//               placeholder="Staff ID/Official Number"
//               value={formData.staffID}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded font-medium ${errors.staffID ? "border-red-600" : "border-gray-300"}`}
//             />
//             {errors.staffID && <p className="text-xs text-red-600 mt-1">{errors.staffID}</p>}
//           </div>

    

//           {/* state of Origin */}
// <div>
//   <label className="block text-sm font-medium text-gray-700 mb-1">
//     State of Origin
//   </label>
//   <select
//     name="stateOfOrigin"
//     value={formData.stateOfOrigin}
//     onChange={handleChange}
//     className={`w-full px-4 py-2 rounded-lg border font-medium focus:ring-2 ${
//       errors.stateOfOrigin
//         ? "border-red-600 focus:ring-red-600"
//         : "border-gray-300 focus:ring-green-600"
//     }`}
//   >
//     <option value="">Select your State</option>
//     {states.length > 0 ? (
//       states.map((state, index) => (
//         <option key={index} value={state}>
//           {state}
//         </option>
//       ))
//     ) : (
//       <option disabled>Loading states...</option>
//     )}
//   </select>
//   {errors.stateOfOrigin && (
//     <p className="text-xs text-red-600 mt-1">{errors.stateOfOrigin}</p>
//   )}
// </div>

// <select
//   name="lga"
//   value={formData.lga}
//   onChange={handleChange}
//   className={`w-full px-4 py-2 rounded-lg border focus:ring-2 font-medium focus:border-transparent ${
//     errors.lga
//       ? "border-red-600 focus:ring-red-600"
//       : "border-gray-300 focus:ring-green-600"
//   }`}
//   disabled={!formData.stateOfOrigin}
// >
//   <option value="">
//     {formData.stateOfOrigin ? "Select your LGA" : "Select a State first"}
//   </option>
//   {lgas.length > 0 &&
//     lgas.map((lga, index) => (
//       <option key={index} value={lga}>
//         {lga}
//       </option>
//     ))}
// </select>



// {/* Chairman Signature */}
// <div>
//   <label className="block text-sm font-medium text-gray-700 mb-1">
//     Chairman Signature
//   </label>
//   <input
//     type="file"
//     accept="image/*"
//     onChange={(e) => handleFileChange(e, "chairmanSignature")}
//     className="w-full p-2 border rounded font-medium border-gray-300"
//   />

//   {previews.chairmanSignature && (
//     <div className="relative mt-3 w-40">
//       <img
//         src={previews.chairmanSignature}
//         alt="Chairman Signature Preview"
//         className="w-full h-auto border rounded shadow"
//       />
//    <button
//   type="button"
//   onClick={() => {
//     setPreviews((prev) => ({ ...prev, chairmanSignature: null }));
//     setFormData((prev) => ({
//       ...prev,
//       chairmanSignature: "",
//       chairmanName: "", // 👈 clears name too
//     }));
//   }}
//   className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
// >
//   ×
// </button>

//     </div>
//   )}
// </div>






// {/* Chairman Signature */}
// <div>
//   <label className="block text-sm font-medium text-gray-700 mb-1">
//     Secretary Signature
//   </label>
//   <input
//     type="file"
//     accept="image/*"
//     onChange={(e) => handleFileChange(e, "secretarySignature")}
//     className="w-full p-2 border rounded font-medium border-gray-300"
//   />

//   {previews.secretarySignature && (
//     <div className="relative mt-3 w-40">
//       <img
//         src={previews.secretarySignature}
//         alt="Chairman Signature Preview"
//         className="w-full h-auto border rounded shadow"
//       />
//    <button
//   type="button"
//   onClick={() => {
//     setPreviews((prev) => ({ ...prev, secretarySignature: null }));
//     setFormData((prev) => ({
//       ...prev,
//       secretarySignature: "",
//       secretaryName: "", // 👈 clears name too
//     }));
//   }}
//   className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
// >
//   ×
// </button>

//     </div>
//   )}
// </div>




//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full bg-[#11860F] text-white font-semibold py-3 rounded-md transition-colors
//               ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#0c670b]"}`}
//           >
//             {loading ? "Creating Account..." : "Register Official"}
//           </button>

//           {message && (
//             <p className="text-sm text-center text-green-700 mt-4 font-medium">
//               {message}
//             </p>
//           )}
//         </form>
//       </div>

//       <ToastContainer
//         position="top-center"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         pauseOnHover
//         draggable
//         theme="colored"
//       />
//     </div>
//   );
// };

// export default OfficialSignUp;



// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import StateLogo from "../images/StateLogo.png";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const OfficialSignUp = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     position: "",
//     staffID: "",
//     lga: "",
//     stateOfOrigin: "",
//     chairmanName: "",
//     secretaryName: "",
//     chairmanSignature: "",
//     secretarySignature: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [states, setStates] = useState([]);
//   const [lgas, setLgas] = useState([]);

//   const [previews, setPreviews] = useState({
//     chairmanSignature: null,
//     secretarySignature: null,
//   });

//   // Refs so we can reset the file input value
//   const chairmanFileRef = useRef(null);
//   const secretaryFileRef = useRef(null);

//   const handleFileChange = (e, field) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const dataUrl = reader.result;
//       const base64Data = dataUrl.split(",")[1] ?? ""; // extract base64 portion

//       setFormData((prev) => ({ ...prev, [field]: base64Data }));
//       setPreviews((prev) => ({ ...prev, [field]: dataUrl }));
//     };

//     reader.readAsDataURL(file);
//   };

//   // Generalized remove handler
//   const handleRemoveSignature = (field) => {
//     setPreviews((prev) => ({ ...prev, [field]: null }));

//     setFormData((prev) => {
//       const updated = { ...prev, [field]: "" };
//       if (field === "chairmanSignature") updated.chairmanName = "";
//       if (field === "secretarySignature") updated.secretaryName = "";
//       return updated;
//     });

//     if (field === "chairmanSignature" && chairmanFileRef.current) {
//       chairmanFileRef.current.value = "";
//     }
//     if (field === "secretarySignature" && secretaryFileRef.current) {
//       secretaryFileRef.current.value = "";
//     }

//   };

//   // state of origin
//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         const res = await axios.get(
//           "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/states"
//         );
//         console.log("🌍 States API response:", res.data);
//         if (res.data.success && Array.isArray(res.data.data)) {
//           setStates(res.data.data);
//         } else {
//           toast.error("Failed to load states");
//         }
//       } catch (error) {
//         console.error("❌ Error fetching states:", error);
//         toast.error("Could not fetch states. Please try again.");
//       }
//     };

//     fetchStates();
//   }, []);

//   // lga
//   useEffect(() => {
//     const fetchLgas = async () => {
//       if (!formData.stateOfOrigin) return;

//       try {
//         const encodedState = encodeURIComponent(formData.stateOfOrigin);
//         const res = await axios.get(
//           `https://lgacertificate-011d407b356b.herokuapp.com/api/v1/lgas?state=${encodedState}`
//         );

//         const lgaArray = res.data?.data?.lgas;

//         if (res.data.success && Array.isArray(lgaArray)) {
//           setLgas(lgaArray);
//         } else {
//           toast.error(`Failed to locate LGAs for ${formData.stateOfOrigin}`);
//         }
//       } catch (error) {
//         console.error("❌ Error fetching LGAs:", error);
//         toast.error("Could not fetch LGAs. Please try again.");
//       }
//     };

//     fetchLgas();
//   }, [formData.stateOfOrigin]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setMessage("");
//   //   const newErrors = {};

//   //   // Basic field validations
//   //   if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
//   //   if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
//   //   if (!formData.email.trim()) newErrors.email = "Email is required";
//   //   if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
//   //   if (!formData.position.trim()) newErrors.position = "Please enter your role";
//   //   if (!formData.staffID.trim()) newErrors.staffID = "Staff ID is required";
//   //   if (!formData.lga.trim()) newErrors.lga = "Please select your LGA";
//   //   if (!formData.stateOfOrigin.trim()) newErrors.stateOfOrigin = "Please select your State of Origin";

//   //   // validation for signatory fields
//   //   if (!formData.chairmanName.trim()) newErrors.chairmanName = "Chairman name is required";
//   //   if (!formData.secretaryName.trim()) newErrors.secretaryName = "Secretary name is required";
//   //   if (!formData.chairmanSignature) newErrors.chairmanSignature = "Chairman signature is required";
//   //   if (!formData.secretarySignature) newErrors.secretarySignature = "Secretary signature is required";

//   //   if (Object.keys(newErrors).length > 0) {
//   //     setErrors(newErrors);
//   //     return;
//   //   }

//   //   const token = localStorage.getItem("token");

//   //   if (!token) {
//   //     toast.error("You must be logged in as a super admin to register an official.", {
//   //       position: "top-center",
//   //       autoClose: 4000,
//   //       theme: "colored",
//   //     });
//   //     return;
//   //   }

//   //   console.log("🔐 Token:", token);

//   //   try {
//   //     setLoading(true);

//   //     // 🔹 Add this log here before sending
//   //   console.log("📦 Sending official data:", JSON.stringify(formData, null, 2));

//   //     // 1️⃣ Register the official
//   //     const officialRes = await axios.post(
//   //       "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/admin/signup",
//   //       formData,
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //           "Content-Type": "application/json",
//   //         },
//   //       }
//   //     );
      

//   //     console.log("✅ Official registered:", officialRes.data);

//   //     // 2️⃣ Register the LGA signatures
//   //     const signatoryData = {
//   //       lga: formData.lga,
//   //       chairmanName: formData.chairmanName,
//   //       secretaryName: formData.secretaryName,
//   //       chairmanSignature: formData.chairmanSignature,
//   //       secretarySignature: formData.secretarySignature,
//   //     };

//   //     const signatoryRes = await axios.post(
//   //       "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/signatory",
//   //       signatoryData,
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //           "Content-Type": "application/json",
//   //         },
//   //       }
//   //     );

//   //     console.log("✅ Signatory registered:", signatoryRes.data);

//   //     toast.success("Official and signatures registered successfully!", {
//   //       position: "top-center",
//   //       autoClose: 4000,
//   //       theme: "colored",
//   //     });

//   //     setMessage("Official and signatures registered successfully!");

//   //     setTimeout(() => {
//   //       navigate("/official");
//   //     }, 1500);
//   //   } catch (err) {
//   //     console.error("❌ Error:", err.response?.data || err.message);
//   //     const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";

//   //     toast.error(errorMessage, {
//   //       position: "top-center",
//   //       autoClose: 4000,
//   //       theme: "colored",
//   //     });

//   //     setMessage(errorMessage);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setMessage("");
//   const newErrors = {};

//   // Validate required fields for signup
//   if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
//   if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
//   if (!formData.email.trim()) newErrors.email = "Email is required";
//   if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
//   if (!formData.position.trim()) newErrors.position = "Please enter your role";
//   if (!formData.staffID.trim()) newErrors.staffID = "Staff ID is required";
//   if (!formData.lga.trim()) newErrors.lga = "Please select your LGA";
//   if (!formData.stateOfOrigin.trim()) newErrors.stateOfOrigin = "Please select your State of Origin";

//   // Validate signatory fields only if a signature file exists
//   if (formData.chairmanSignature && !formData.chairmanName.trim())
//     newErrors.chairmanName = "Chairman name is required";
//   if (formData.secretarySignature && !formData.secretaryName.trim())
//     newErrors.secretaryName = "Secretary name is required";

//   if (Object.keys(newErrors).length > 0) {
//     setErrors(newErrors);
//     return;
//   }

//   const token = localStorage.getItem("token");
//   if (!token) {
//     toast.error("You must be logged in as a super admin to register an official.");
//     return;
//   }

//   try {
//     setLoading(true);

//     // 1️⃣ Prepare data for admin/signup
//     const officialData = {
//       firstName: formData.firstName,
//       lastName: formData.lastName,
//       email: formData.email,
//       phone: formData.phone,
//       position: formData.position,
//       staffID: formData.staffID,
//       lga: formData.lga,
//       stateOfOrigin: formData.stateOfOrigin,
//     };

//     console.log("📦 Sending official data:", officialData);

//     const officialRes = await axios.post(
//       "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/admin/signup",
//       officialData,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     console.log("✅ Official registered:", officialRes.data);

//     // 2️⃣ If signatures exist, register signatory
//     if (formData.chairmanSignature || formData.secretarySignature) {
//       const signatoryData = {
//         lga: formData.lga,
//         chairmanName: formData.chairmanName,
//         secretaryName: formData.secretaryName,
//         chairmanSignature: formData.chairmanSignature,
//         secretarySignature: formData.secretarySignature,
//       };

//       console.log("📦 Sending signatory data:", signatoryData);

//       const signatoryRes = await axios.post(
//         "https://lgacertificate-011d407b356b356b.herokuapp.com/api/v1/signatory",
//         signatoryData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       console.log("✅ Signatory registered:", signatoryRes.data);
//     }

//     toast.success("Official and signatures registered successfully!");
//     setTimeout(() => navigate("/official"), 1500);
//   } catch (err) {
//     console.error("❌ Error:", err.response?.data || err.message);
//     toast.error(err.response?.data?.message || "Something went wrong.");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="flex min-h-screen flex-col lg:flex-row">
//       {/* LEFT SIDE */}
//       <div className="hidden lg:flex w-1/2 bg-green-700 text-white flex-col justify-center items-center p-10">
//         <img src={StateLogo} alt="State Logo" className="w-24 h-24 mb-4" />
//         <h1 className="text-2xl font-semibold">Ogun State Government</h1>
//         <p className="text-lg mt-2 font-medium">L.G.A</p>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8 sm:px-12 py-12">
//         <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
//           {/* Header */}
//           <div className="flex flex-col items-center mb-6">
//             <img src={StateLogo} alt="State Logo" className="w-14 h-14 mb-2" />
//             <h3 className="text-gray-800 font-semibold text-lg">Ogun State Government</h3>
//             <p className="text-xs font-medium text-gray-500">Register a Local Government Official</p>
//           </div>

//           {/* First & Last Name */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="w-full sm:w-1/2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="First Name"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 className={`w-full p-2 border rounded font-medium ${errors.firstName ? "border-red-600" : "border-gray-300"}`}
//               />
//               {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
//             </div>

//             <div className="w-full sm:w-1/2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Last Name"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 className={`w-full p-2 border rounded font-medium ${errors.lastName ? "border-red-600" : "border-gray-300"}`}
//               />
//               {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
//             </div>
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Official Email Address"
//               value={formData.email}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded font-medium ${errors.email ? "border-red-600" : "border-gray-300"}`}
//             />
//             {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//             <input
//               type="tel"
//               name="phone"
//               placeholder="Phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded font-medium ${errors.phone ? "border-red-600" : "border-gray-300"}`}
//             />
//             {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
//           </div>

//           {/* Position */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
//             <input
//               type="text"
//               name="position"
//               placeholder="Enter your official role"
//               value={formData.position}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded font-medium ${errors.position ? "border-red-600" : "border-gray-300"}`}
//             />
//             {errors.position && <p className="text-xs text-red-600 mt-1">{errors.position}</p>}
//           </div>

//           {/* Staff ID */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID</label>
//             <input
//               type="text"
//               name="staffID"
//               placeholder="Staff ID/Official Number"
//               value={formData.staffID}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded font-medium ${errors.staffID ? "border-red-600" : "border-gray-300"}`}
//             />
//             {errors.staffID && <p className="text-xs text-red-600 mt-1">{errors.staffID}</p>}
//           </div>

//           {/* state of Origin */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">State of Origin</label>
//             <select
//               name="stateOfOrigin"
//               value={formData.stateOfOrigin}
//               onChange={handleChange}
//               className={`w-full px-4 py-2 rounded-lg border font-medium focus:ring-2 ${
//                 errors.stateOfOrigin ? "border-red-600 focus:ring-red-600" : "border-gray-300 focus:ring-green-600"
//               }`}
//             >
//               <option value="">Select your State</option>
//               {states.length > 0 ? (
//                 states.map((state, index) => (
//                   <option key={index} value={state}>
//                     {state}
//                   </option>
//                 ))
//               ) : (
//                 <option disabled>Loading states...</option>
//               )}
//             </select>
//             {errors.stateOfOrigin && <p className="text-xs text-red-600 mt-1">{errors.stateOfOrigin}</p>}
//           </div>

//           <select
//             name="lga"
//             value={formData.lga}
//             onChange={handleChange}
//             className={`w-full px-4 py-2 rounded-lg border focus:ring-2 font-medium focus:border-transparent ${
//               errors.lga ? "border-red-600 focus:ring-red-600" : "border-gray-300 focus:ring-green-600"
//             }`}
//             disabled={!formData.stateOfOrigin}
//           >
//             <option value="">{formData.stateOfOrigin ? "Select your LGA" : "Select a State first"}</option>
//             {lgas.length > 0 &&
//               lgas.map((lga, index) => (
//                 <option key={index} value={lga}>
//                   {lga}
//                 </option>
//               ))}
//           </select>

//           {/* Chairman Name & Signature */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Chairman Name</label>
//             <input
//               type="text"
//               name="chairmanName"
//               placeholder="Enter Chairman Name"
//               value={formData.chairmanName}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded font-medium ${errors.chairmanName ? "border-red-600" : "border-gray-300"}`}
//             />
//             {errors.chairmanName && <p className="text-xs text-red-600 mt-1">{errors.chairmanName}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Chairman Signature</label>
//             <input
//               ref={chairmanFileRef}
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleFileChange(e, "chairmanSignature")}
//               className="w-full p-2 border rounded font-medium border-gray-300"
//             />

//             {previews.chairmanSignature && (
//               <div className="relative mt-3 w-40">
//                 <img
//                   src={previews.chairmanSignature}
//                   alt="Chairman Signature Preview"
//                   className="w-full h-auto border rounded shadow"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveSignature("chairmanSignature")}
//                   className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
//                 >
//                   ×
//                 </button>
//               </div>
//             )}
//             {errors.chairmanSignature && <p className="text-xs text-red-600 mt-1">{errors.chairmanSignature}</p>}
//           </div>

//           {/* Secretary Name & Signature */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Secretary Name</label>
//             <input
//               type="text"
//               name="secretaryName"
//               placeholder="Enter Secretary Name"
//               value={formData.secretaryName}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded font-medium ${errors.secretaryName ? "border-red-600" : "border-gray-300"}`}
//             />
//             {errors.secretaryName && <p className="text-xs text-red-600 mt-1">{errors.secretaryName}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Secretary Signature</label>
//             <input
//               ref={secretaryFileRef}
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleFileChange(e, "secretarySignature")}
//               className="w-full p-2 border rounded font-medium border-gray-300"
//             />

//             {previews.secretarySignature && (
//               <div className="relative mt-3 w-40">
//                 <img
//                   src={previews.secretarySignature}
//                   alt="Secretary Signature Preview"
//                   className="w-full h-auto border rounded shadow"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveSignature("secretarySignature")}
//                   className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
//                 >
//                   ×
//                 </button>
//               </div>
//             )}
//             {errors.secretarySignature && <p className="text-xs text-red-600 mt-1">{errors.secretarySignature}</p>}
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full bg-[#11860F] text-white font-semibold py-3 rounded-md transition-colors
//               ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#0c670b]"}`}
//           >
//             {loading ? "Creating Account..." : "Register Official"}
//           </button>

//           {message && (
//             <p className="text-sm text-center text-green-700 mt-4 font-medium">
//               {message}
//             </p>
//           )}
//         </form>
//       </div>

//       <ToastContainer
//         position="top-center"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         pauseOnHover
//         draggable
//         theme="colored"
//       />
//     </div>
//   );
// };

// export default OfficialSignUp;



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import StateLogo from "../images/StateLogo.png";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const OfficialSignUp = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     position: "",
//     staffID: "",
//     lga: "",
//     stateOfOrigin: "", // ✅ Added here
//   });

//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [states, setStates] = useState([]);
//   const [lgas, setLgas] = useState([]);


//   // state of origin
//  useEffect(() => {
//   const fetchStates = async () => {
//     try {
//       const res = await axios.get("https://lgacertificate-011d407b356b.herokuapp.com/api/v1/states");
//         console.log("🌍 States API response:", res.data); // 👈 ADD THIS
//       if (res.data.success && Array.isArray(res.data.data)) {
//         setStates(res.data.data);
//       } else {
//         toast.error("Failed to load states");
//       }
//     } catch (error) {
//       console.error("❌ Error fetching states:", error);
//       toast.error("Could not fetch states. Please try again.");
//     }
//   };

//   fetchStates();
// }, []);


// // lga
// useEffect(() => {
//   const fetchLgas = async () => {
//     if (!formData.stateOfOrigin) return; // Don’t fetch until a state is chosen

//     try {
//       const encodedState = encodeURIComponent(formData.stateOfOrigin);
//       const res = await axios.get(
//         `https://lgacertificate-011d407b356b.herokuapp.com/api/v1/lgas?state=${encodedState}`
//       );

//       // ✅ Access nested structure
//       const lgaArray = res.data?.data?.lgas;

//       if (res.data.success && Array.isArray(lgaArray)) {
//         setLgas(lgaArray);
//       } else {
//         toast.error(`Failed to locate LGAs for ${formData.stateOfOrigin}`);
//       }
//     } catch (error) {
//       console.error("❌ Error fetching LGAs:", error);
//       toast.error("Could not fetch LGAs. Please try again.");
//     }
//   };

//   fetchLgas();
// }, [formData.stateOfOrigin]);


//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     const newErrors = {};

//     if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
//     if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
//     if (!formData.email.trim()) newErrors.email = "Email is required";
//     if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
//     if (!formData.position.trim()) newErrors.position = "Please enter your role";
//     if (!formData.staffID.trim()) newErrors.staffID = "Staff ID is required";
//     if (!formData.lga.trim()) newErrors.lga = "Please select your LGA";
//     if (!formData.stateOfOrigin.trim()) newErrors.stateOfOrigin = "Please select your State of Origin"; // ✅ Added validation

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     const token = localStorage.getItem("token");
    
//     if (!token) {
//       toast.error("You must be logged in as a super admin to register an official.");
//       return;
//     }
//     console.log('token:', localStorage.getItem('token'));

    
//     try {
//       setLoading(true);

//       const res = await axios.post(
//         "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/admin/signup",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("✅ Form submitted:", res.data);

//       toast.success("Email registered successfully! Please verify your email.", {
//         position: "top-center",
//         autoClose: 4000,
//         theme: "colored",
//       });

//       setMessage("Official registered successfully!");

//       setTimeout(() => {
//         navigate("/official");
//       }, 1500);
//     } catch (err) {
//       console.error("❌ Error:", err.response?.data || err.message);
//       const errorMessage =
//         err.response?.data?.message || "Something went wrong. Please try again.";

//       toast.error(errorMessage, {
//         position: "top-center",
//         autoClose: 4000,
//         theme: "colored",
//       });

//       setMessage(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen flex-col lg:flex-row">
//       {/* LEFT SIDE */}
//       <div className="hidden lg:flex w-1/2 bg-green-700 text-white flex-col justify-center items-center p-10">
//         <img src={StateLogo} alt="State Logo" className="w-24 h-24 mb-4" />
//         <h1 className="text-2xl font-semibold">Ogun State Government</h1>
//         <p className="text-lg mt-2 font-medium">L.G.A</p>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8 sm:px-12 py-12">
//         <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
//           {/* Header */}
//           <div className="flex flex-col items-center mb-6">
//             <img src={StateLogo} alt="State Logo" className="w-14 h-14 mb-2" />
//             <h3 className="text-gray-800 font-semibold text-lg">Ogun State Government</h3>
//             <p className="text-xs font-medium text-gray-500">Register a Local Government Official</p>
//           </div>

//           {/* First & Last Name */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="w-full sm:w-1/2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="First Name"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 className={`w-full p-2 border rounded font-medium ${errors.firstName ? "border-red-600" : "border-gray-300"}`}
//               />
//               {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
//             </div>

//             <div className="w-full sm:w-1/2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Last Name"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 className={`w-full p-2 border rounded font-medium ${errors.lastName ? "border-red-600" : "border-gray-300"}`}
//               />
//               {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
//             </div>
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Official Email Address"
//               value={formData.email}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded font-medium ${errors.email ? "border-red-600" : "border-gray-300"}`}
//             />
//             {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//             <input
//               type="tel"
//               name="phone"
//               placeholder="Phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded font-medium ${errors.phone ? "border-red-600" : "border-gray-300"}`}
//             />
//             {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
//           </div>

//           {/* Position */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
//             <input
//               type="text"
//               name="position"
//               placeholder="Enter your official role"
//               value={formData.position}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded font-medium ${errors.position ? "border-red-600" : "border-gray-300"}`}
//             />
//             {errors.position && <p className="text-xs text-red-600 mt-1">{errors.position}</p>}
//           </div>

//           {/* Staff ID */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID</label>
//             <input
//               type="text"
//               name="staffID"
//               placeholder="Staff ID/Official Number"
//               value={formData.staffID}
//               onChange={handleChange}
//               className={`w-full p-2 border rounded font-medium ${errors.staffID ? "border-red-600" : "border-gray-300"}`}
//             />
//             {errors.staffID && <p className="text-xs text-red-600 mt-1">{errors.staffID}</p>}
//           </div>

//           {/* ✅ State of Origin Dropdown */}
//           {/* <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               State of Origin
//             </label>
//             <select
//               name="stateOfOrigin"
//               value={formData.stateOfOrigin}
//               onChange={handleChange}
//               className={`w-full px-4 py-2 rounded-lg border font-medium focus:ring-2 ${errors.stateOfOrigin ? "border-red-600 focus:ring-red-600" : "border-gray-300 focus:ring-green-600"}`}
//             >
//               <option value="">Select your State</option>
//               {NIGERIAN_STATES.map((state) => (
//                 <option key={state} value={state}>{state}</option>
//               ))}
//             </select>
//             {errors.stateOfOrigin && <p className="text-xs text-red-600 mt-1">{errors.stateOfOrigin}</p>}
//           </div> */}

//           {/* LGA */}
//           {/* <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Local Government Area (LGA)
//             </label>
//             <select
//               name="lga"
//               value={formData.lga}
//               onChange={handleChange}
//               className={`w-full px-4 py-2 rounded-lg border font-medium focus:ring-2 ${errors.lga ? "border-red-600 focus:ring-red-600" : "border-gray-300 focus:ring-green-600"}`}
//             >
//               <option value="">Select your LGA</option>
//               {OGUN_LGAS.map((lga) => (
//                 <option key={lga} value={lga}>{lga}</option>
//               ))}
//             </select>
//             {errors.lga && <p className="text-xs text-red-600 mt-1">{errors.lga}</p>}
//           </div> */}


//           {/* state of Origin */}
// <div>
//   <label className="block text-sm font-medium text-gray-700 mb-1">
//     State of Origin
//   </label>
//   <select
//     name="stateOfOrigin"
//     value={formData.stateOfOrigin}
//     onChange={handleChange}
//     className={`w-full px-4 py-2 rounded-lg border font-medium focus:ring-2 ${
//       errors.stateOfOrigin
//         ? "border-red-600 focus:ring-red-600"
//         : "border-gray-300 focus:ring-green-600"
//     }`}
//   >
//     <option value="">Select your State</option>
//     {states.length > 0 ? (
//       states.map((state, index) => (
//         <option key={index} value={state}>
//           {state}
//         </option>
//       ))
//     ) : (
//       <option disabled>Loading states...</option>
//     )}
//   </select>
//   {errors.stateOfOrigin && (
//     <p className="text-xs text-red-600 mt-1">{errors.stateOfOrigin}</p>
//   )}
// </div>

// <select
//   name="lga"
//   value={formData.lga}
//   onChange={handleChange}
//   className={`w-full px-4 py-2 rounded-lg border focus:ring-2 font-medium focus:border-transparent ${
//     errors.lga
//       ? "border-red-600 focus:ring-red-600"
//       : "border-gray-300 focus:ring-green-600"
//   }`}
//   disabled={!formData.stateOfOrigin}
// >
//   <option value="">
//     {formData.stateOfOrigin ? "Select your LGA" : "Select a State first"}
//   </option>
//   {lgas.length > 0 &&
//     lgas.map((lga, index) => (
//       <option key={index} value={lga}>
//         {lga}
//       </option>
//     ))}
// </select>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full bg-[#11860F] text-white font-semibold py-3 rounded-md transition-colors
//               ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#0c670b]"}`}
//           >
//             {loading ? "Creating Account..." : "Register Official"}
//           </button>

//           {message && (
//             <p className="text-sm text-center text-green-700 mt-4 font-medium">
//               {message}
//             </p>
//           )}
//         </form>
//       </div>

//       <ToastContainer
//         position="top-center"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         pauseOnHover
//         draggable
//         theme="colored"
//       />
//     </div>
//   );
// };

// export default OfficialSignUp;



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



  const handleFileChange = (e, field) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    const dataUrl = reader.result; // full "data:image/png;base64,..." string
    setSignatureData((prev) => ({ ...prev, [field]: dataUrl })); // ✅ update signatureData
    setPreviews((prev) => ({ ...prev, [field]: dataUrl })); // ✅ show preview
  };

  reader.readAsDataURL(file);
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
      setMessage("Does your LGA have official signatures?");
      setShowSignatureForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignatureSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in as a super admin.");
      return;
    }

    try {
      setLoading(true);
    await axios.post(
  "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/signatory",
  { lga: formData.lga, ...signatureData },
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
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
            {/* ...keep your existing input code here, unchanged... */}
            {/* State & LGA dropdowns already handled above */}


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
            <p className="text-gray-700">{message}</p>
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
                No
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
