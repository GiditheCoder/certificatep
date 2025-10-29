// import React, { useEffect, useState } from "react";
// import { Bell, LogOutIcon , ShieldCheck } from "lucide-react";
// import StateLogo from "../images/StateLogo.png";
// import box from "../images/box.png";
// import blob from "../images/blob.png";
// import Bg from "../images/Bg.png";
// import { useNavigate } from "react-router-dom";
// import MenuLogo from "../images/menu.png";
// import CloseLogo from "../images/close.png";
// import certImg from "../images/cert.png";
// import pendingLogo from "../images/pending.png";
// import download from "../images/download.png";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { UserContext } from "../context/UserContext";
// import { useContext } from "react";
// import axios from "axios";


// const Dashboard = () => {
//   const navigate = useNavigate();
//   // const [user, setUser] = useState(null);
//    const { user, updateUser } = useContext(UserContext);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [applicationId, setApplicationId] = useState(null);

//   // 👇 3 possible states: "noapplication", "pending", "approved"
//   const [status, setStatus] = useState("noapplication");
//   const [pendingPaymentLink, setPendingPaymentLink] = useState(null);

// const handleVerifyCertificateDashboard = () => {
//   if (!applicationId) {
//     toast.error("No application found to verify.");
//     return;
//   }

//   navigate("/verify-certificate", { state: { certificateId: applicationId } });
// };


//   useEffect(() => {
//   console.log("User from context:", user);
// }, [user]);


// useEffect(() => {
//   const storedUser = localStorage.getItem("user");
//   const token = localStorage.getItem("token");

//   if (!storedUser || !token) {
//     navigate("/login");
//     return;
//   }

//   const parsedUser = JSON.parse(storedUser);
//   updateUser(parsedUser);

//   // ✅ Unified fetch function
//   const fetchApplication = async (applicationId = null) => {
//     try {
//       // If `applicationId` is provided, fetch that specific one
//       const url = applicationId
//         ? `https://lgacertificate-011d407b356b.herokuapp.com/api/v1/application/${applicationId}`
//         : `https://lgacertificate-011d407b356b.herokuapp.com/api/v1/application`;

//       const res = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // ✅ Handle data depending on what type of fetch was done
//       let applications = [];

//       if (applicationId) {
//         // Single application
//         applications = [res.data?.data?.application].filter(Boolean);
//       } else {
//         // All applications
//         applications = res.data?.data?.applications || [];
//       }

//       console.log("Fetched applications:", applications);

//       if (applications.length === 0) {
//         setStatus("noapplication");
//         return;
//       }

//       // ✅ Filter for the logged-in user's applications
//       const userApplications = applications.filter(
//         (app) => app.user === parsedUser._id
//       );

//       console.log("User's applications:", userApplications);

//       if (userApplications.length === 0) {
//         toast.info("You have not submitted any application yet.");
//         setStatus("noapplication");
//         return;
//       }

//       // ✅ Get latest or specific
//       const latestApp = userApplications[userApplications.length - 1];
//       setApplicationId(latestApp._id);
//       console.log("Saved Application ID:", latestApp._id);

//       // ✅ Determine status
//       if (latestApp.isPendingPayment || latestApp.isPendingApproval) {
//         setStatus("pending");
//       } else if (latestApp.isApproved) {
//         setStatus("approved");
//       } else if (latestApp.isRejected) {
//         setStatus("noapplication");
//       }

//     } catch (error) {
//       console.error("Error fetching applications:", error);
//       setStatus("noapplication");
//     }
//   };

//   // ✅ Call it for all applications by default
//   fetchApplication();

//   // ✅ (Optional) — if you want to fetch a specific one later:
//   // fetchApplication("66fd9e8882dbd1a43b4ff221");

// }, [navigate]);




// const handleNewApplication = () => {
//   if (user?.state !== "verified") {
//     toast.error("User must be verified to start an application");
//     return;
//   }

//   if (pendingPaymentLink) {
//     toast.info("💳 Redirecting to continue your incomplete payment...");
//     window.location.href = pendingPaymentLink;
//     return;
//   }

//   if (status === "pending" || status === "approved") {
//       toast.error("User has a verified or pending application");
//     return;
//   }

//   navigate("/application");
// };




//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navbar */}
//       <header className="flex items-center justify-between px-6 sm:px-8 py-4 bg-white shadow-sm relative">
//         <div className="flex items-center gap-3">
//           <img src={StateLogo} alt="State Logo" className="w-10 h-10" />
//           <h1 className="text-base sm:text-lg font-semibold text-[#475467]">
//             Ogun State Government
//           </h1>
//         </div>

//         <div className="hidden md:flex items-center gap-5">
//           <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#11860F]" />
//           <LogOutIcon
//             onClick={handleLogout}
//             className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#11860F]"
//           />
        
//           <div className="flex items-center gap-2">
//   {/* ✅ Verification Badge */}
//   {user?.state === "verified" ? (
//     <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
//       Verified
//     </span>
//   ) : (
//     <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
//       Unverified
//     </span>
//   )}

//   {/* 🧑 Avatar */}
//   <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-semibold uppercase">
//     {user
//       ? `${user.firstName?.charAt(0).toUpperCase()}${user.lastName?.charAt(
//           0
//         ).toUpperCase()}`
//       : "?"}
//   </div>
// </div>

//         </div>

//         {/* Mobile Menu */}
//         <div className="md:hidden flex items-center">
//           <button onClick={() => setMenuOpen(!menuOpen)}>
//             <img
//               src={menuOpen ? CloseLogo : MenuLogo}
//               alt="menu toggle"
//               className="w-6 h-6"
//             />
//           </button>
//         </div>

//         {menuOpen && (
//           <div className="absolute top-full right-4 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 p-4 flex flex-col items-center gap-4 w-40 z-50 md:hidden">
//             <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#11860F]" />
//             <LogOutIcon
//               onClick={handleLogout}
//               className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#11860F]"
//             />
//             <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-semibold uppercase">
//               {user
//                 ? `${user.firstName?.charAt(0).toUpperCase()}${user.lastName?.charAt(
//                     0
//                   ).toUpperCase()}`
//                 : "?"}
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Main Content */}
//       <main className="px-5 sm:px-10 py-8 space-y-10">
//         {/* Welcome Section */}
//         <div>
//           <h2 className="text-xl sm:text-2xl text-center md:text-left font-semibold text-gray-900">
//             Welcome back, {user ? user.firstName : "User"}!
//           </h2>
//           <p className="text-gray-500 font-medium text-sm sm:text-base text-center md:text-left">
//             Manage your certificate applications and track their progress
//           </p>
          
//         </div>
        

//           {/* Verify Account Button for Unverified Users */}
//   {user?.state === "pending" && (
//     <div className="flex justify-center mt-10">
//       <button
//         onClick={() => {
//           // Example: navigate("/verify-account");
//             navigate("/request-email-verify"); 
           
//         }}
//         className="bg-red-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-red-700 transition"
//       >
//         Verify Your Account
//       </button>
//     </div>
//   )}



//         {/* Start New Application */}
//         <div className="relative rounded-xl p-6 sm:p-8 shadow-lg overflow-hidden">
//           <img
//             src={Bg}
//             alt="Background"
//             className="absolute inset-0 w-full h-full object-cover opacity-100"
//           />
//           <img
//             src={blob}
//             alt="Pattern"
//             className="absolute right-0 top-0 w-full h-full object-cover opacity-20 pointer-events-none"
//           />

//           <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
//             <h3 className="text-2xl sm:text-3xl font-semibold text-black drop-shadow-md text-center md:text-left">
//               Start a New Application
//             </h3>
//             <button
//               className="bg-[#11860F] text-white px-3 sm:px-5 py-1.5 sm:py-2 text-sm sm:text-base rounded-md font-medium hover:bg-green-700 transition w-full sm:w-auto"
//               onClick={handleNewApplication}
//             >
//               New Application
//             </button>
//           </div>
//         </div>

//         {/* Status Tabs */}
//         <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
//           <div className="flex border-b border-gray-200 flex-wrap">
//             <button
//               className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-bold transition-colors  text-center ${
//                 status === "pending"
//                   ? "text-black border-b-2 border-[#11860F]"
//                   : "text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300"
//               }`}
//                disabled={status !== "pending"}
//             >
//               Pending
//             </button>

//             <button
//               className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-bold transition-colors text-center ${
//                 status === "approved"
//                   ? "text-black border-b-2 border-[#11860F]"
//                   : "text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300"
//               }`}
//                disabled={status !== "approved"}
//             >
//               Approved
//             </button>
//           </div>

//           {/* Status Display */}
//           <div className="flex flex-col items-center justify-center py-10 sm:py-14 px-4 text-center space-y-4">
//             {status === "noapplication" && (
//               <>
//                 <img src={box} alt="No Application" className="w-24 sm:w-32 h-24 sm:h-32" />
//                 <h3 className="text-lg sm:text-xl font-bold text-gray-900">
//                   No Applications Yet
//                 </h3>
//                 <p className="text-gray-600 text-sm sm:text-base font-medium">
//                   You haven’t started any certificate application yet.
//                 </p>
//                 <button
//                   className="bg-[#11860F] hover:bg-green-700 text-white px-5 sm:px-6 py-2.5 rounded-lg font-semibold transition-colors"
//                   onClick={handleNewApplication}
//                 >
//                   Start New Application
//                 </button>
//               </>
//             )}

//             {status === "pending" && (
//               <>
//   <img src={pendingLogo} alt="Pending" className="w-24 sm:w-32 h-24 sm:h-32" />
//   <h3 className="text-lg sm:text-xl font-bold text-gray-900">
//     Certificate of Origin
//   </h3>
//   {/* <p className="text-gray-600 text-sm sm:text-base font-medium">
//     Reference: OG/CO/2024/001
//   </p> */}
//   <p className="text-gray-600 text-sm sm:text-base font-medium">
//         Applied:  {user?.createdAt
//           ? new Date(user.createdAt).toLocaleString("en-US", {
//               year: "numeric",
//               month: "short",
//               day: "numeric",
//             })
//           : "N/A"}
//   </p> 
//  <div className="flex justify-center gap-3 w-full mt-4">
//   <button className="flex items-center gap-2 bg-[#11860F] text-white font-semibold px-5 py-3 rounded hover:bg-[#0d6b0b] transition-colors">
//     <img src={download} alt="Download icon" className="h-5 w-5" />
//     Download
//   </button>

//   <button className="bg-green-50 text-[#11860F] font-semibold px-5 py-3 rounded hover:bg-green-100 transition-colors">
//     View Details
//   </button>
// </div>

// </>
//             )}

//             {status === "approved" && (
//               <>
//   <img src={certImg} alt="Pending" className="w-24 sm:w-32 h-24 sm:h-32" />
//   <h3 className="text-lg sm:text-xl font-bold text-gray-900">
//     Certificate of Origin
//   </h3>
//   <p className="text-gray-600 text-sm sm:text-base font-medium">
//     Reference: OG/CO/2024/001
//   </p>
//   <p className="text-gray-600 text-sm sm:text-base font-medium">
//     Applied:  {user?.createdAt
//           ? new Date(user.createdAt).toLocaleString("en-US", {
//               year: "numeric",
//               month: "short",
//               day: "numeric",
//             })
//           : "N/A"}
//   </p>
//  <div className="flex justify-center gap-3 w-full mt-4">
//   <button
//         className="flex items-center gap-2 bg-[#11860F] text-white font-semibold px-5 py-3 rounded hover:bg-[#0d6b0b] transition-colors"
//         onClick={() =>
//           navigate("/certificate", {
//             state: {
//               name: `${user?.firstName || ""} ${user?.lastName || ""}`,
//               address: user?.address || "Unknown Address",
//               nativeTown: user?.town || "Unknown",
//               approvedDate: new Date().toLocaleDateString(),
//               autoDownload: true, // 👈 important
//             },
//           })
//         }
//       >
//         <img src={download} alt="Download icon" className="h-5 w-5" />
//         Download
//       </button>

//     {/* VIEW */}
//       <button
//         className="bg-green-50 text-[#11860F] font-semibold px-5 py-3 rounded hover:bg-green-100 transition-colors"
//         onClick={() =>
//           navigate("/certificate", {
//             state: {
//               name: `${user?.firstName || ""} ${user?.lastName || ""}`,
//               address: user?.address || "Unknown Address",
//               nativeTown: user?.town || "Unknown",
//               approvedDate: new Date().toLocaleDateString(),
//               autoDownload: false, // 👈 just preview
//             },
//           })
//         }
//       >
//         View Details
//       </button>


// </div>

// </>
//             )}
//           </div>
//         </div>







        
//      <button className="flex items-center gap-2 bg-[#11860F] text-white font-semibold px-5 py-3 rounded hover:bg-[#0d6b0b] transition-colors"
//      onClick={handleVerifyCertificateDashboard}>
//   <ShieldCheck className="h-5 w-5" />
//   Verify Certificate
// </button>
//       </main>

      
//        <ToastContainer
//               position="top-center"
//               autoClose={3000}
//               hideProgressBar={false}
//               newestOnTop={false}
//               closeOnClick
//               pauseOnHover
//               draggable
//               theme="colored"
//             />
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState, useContext } from "react";
import { Bell, LogOutIcon, ShieldCheck } from "lucide-react";
import StateLogo from "../images/StateLogo.png";
import box from "../images/box.png";
import blob from "../images/blob.png";
import Bg from "../images/Bg.png";
import MenuLogo from "../images/menu.png";
import CloseLogo from "../images/close.png";
import certImg from "../images/cert.png";
import pendingLogo from "../images/pending.png";
import download from "../images/download.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(UserContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [status, setStatus] = useState("noapplication");
  const [pendingPaymentLink, setPendingPaymentLink] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ loading state

  const handleVerifyCertificateDashboard = () => {
    if (!applicationId) {
      toast.error("No application found to verify.");
      return;
    }

    navigate("/verify-certificate", { state: { certificateId: applicationId } });
  };

  useEffect(() => {
    console.log("User from context:", user);
  }, [user]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    updateUser(parsedUser);

    const fetchApplication = async (applicationId = null) => {
      try {
        setLoading(true); // ✅ start loading

        const url = applicationId
          ? `https://lgacertificate-011d407b356b.herokuapp.com/api/v1/application/${applicationId}`
          : `https://lgacertificate-011d407b356b.herokuapp.com/api/v1/application`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let applications = [];

        if (applicationId) {
          applications = [res.data?.data?.application].filter(Boolean);
        } else {
          applications = res.data?.data?.applications || [];
        }

        console.log("Fetched applications:", applications);

        if (applications.length === 0) {
          setStatus("noapplication");
          setLoading(false);
          return;
        }

        const userApplications = applications.filter(
          (app) => app.user === parsedUser._id
        );

        console.log("User's applications:", userApplications);

        if (userApplications.length === 0) {
          toast.info("You have not submitted any application yet.");
          setStatus("noapplication");
          setLoading(false);
          return;
        }

        const latestApp = userApplications[userApplications.length - 1];
        setApplicationId(latestApp._id);
        console.log("Saved Application ID:", latestApp._id);

        if (latestApp.isPendingPayment || latestApp.isPendingApproval) {
          setStatus("pending");
        } else if (latestApp.isApproved) {
          setStatus("approved");
        } else if (latestApp.isRejected) {
          setStatus("noapplication");
        }

      } catch (error) {
        console.error("Error fetching applications:", error);
        setStatus("noapplication");
      } finally {
        setLoading(false); // ✅ stop loading
      }
    };

    fetchApplication();
  }, [navigate]);

  const handleNewApplication = () => {
    if (user?.state !== "verified") {
      toast.error("User must be verified to start an application");
      return;
    }

    if (pendingPaymentLink) {
      toast.info("💳 Redirecting to continue your incomplete payment...");
      window.location.href = pendingPaymentLink;
      return;
    }

    if (status === "pending" || status === "approved") {
      toast.error("User has a verified or pending application");
      return;
    }

    navigate("/application");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 sm:px-8 py-4 bg-white shadow-sm relative">
        <div className="flex items-center gap-3">
          <img src={StateLogo} alt="State Logo" className="w-10 h-10" />
          <h1 className="text-base sm:text-lg font-semibold text-[#475467]">
            Ogun State Government
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-5">
          <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#11860F]" />
          <LogOutIcon
            onClick={handleLogout}
            className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#11860F]"
          />
          <div className="flex items-center gap-2">
            {user?.state === "verified" ? (
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                Verified
              </span>
            ) : (
              <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
                Unverified
              </span>
            )}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-semibold uppercase">
              {user
                ? `${user.firstName?.charAt(0).toUpperCase()}${user.lastName
                    ?.charAt(0)
                    .toUpperCase()}`
                : "?"}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
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
          <div className="absolute top-full right-4 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 p-4 flex flex-col items-center gap-4 w-40 z-50 md:hidden">
            <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#11860F]" />
            <LogOutIcon
              onClick={handleLogout}
              className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#11860F]"
            />
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-semibold uppercase">
              {user
                ? `${user.firstName?.charAt(0).toUpperCase()}${user.lastName
                    ?.charAt(0)
                    .toUpperCase()}`
                : "?"}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="px-5 sm:px-10 py-8 space-y-10">
        <h2 className="text-xl sm:text-2xl text-center md:text-left font-semibold text-gray-900">
          Welcome back, {user ? user.firstName : "User"}!
        </h2>
        <p className="text-gray-500 font-medium text-sm sm:text-base text-center md:text-left">
          Manage your certificate applications and track their progress
        </p>

        {/* ✅ Loading spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-4 font-medium">
              Loading application status...
            </p>
          </div>
        ) : (
          <>
            {/* Normal UI below */}
            <div className="relative rounded-xl p-6 sm:p-8 shadow-lg overflow-hidden">
              <img
                src={Bg}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover opacity-100"
              />
              <img
                src={blob}
                alt="Pattern"
                className="absolute right-0 top-0 w-full h-full object-cover opacity-20 pointer-events-none"
              />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                <h3 className="text-2xl sm:text-3xl font-semibold text-black drop-shadow-md text-center md:text-left">
                  Start a New Application
                </h3>
                <button
                  className="bg-[#11860F] text-white px-3 sm:px-5 py-1.5 sm:py-2 text-sm sm:text-base rounded-md font-medium hover:bg-green-700 transition w-full sm:w-auto"
                  onClick={handleNewApplication}
                >
                  New Application
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="flex border-b border-gray-200 flex-wrap">
                <button
                  className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-bold ${
                    status === "pending"
                      ? "text-black border-b-2 border-[#11860F]"
                      : "text-gray-500 border-b-2 border-transparent"
                  }`}
                  disabled={status !== "pending"}
                >
                  Pending
                </button>
                <button
                  className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-bold ${
                    status === "approved"
                      ? "text-black border-b-2 border-[#11860F]"
                      : "text-gray-500 border-b-2 border-transparent"
                  }`}
                  disabled={status !== "approved"}
                >
                  Approved
                </button>
              </div>

              {/* Status Display */}
              <div className="flex flex-col items-center justify-center py-10 sm:py-14 px-4 text-center space-y-4">
                {status === "noapplication" && (
                  <>
                    <img
                      src={box}
                      alt="No Application"
                      className="w-24 sm:w-32 h-24 sm:h-32"
                    />
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      No Applications Yet
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base font-medium">
                      You haven’t started any certificate application yet.
                    </p>
                    <button
                      className="bg-[#11860F] hover:bg-green-700 text-white px-5 sm:px-6 py-2.5 rounded-lg font-semibold transition-colors"
                      onClick={handleNewApplication}
                    >
                      Start New Application
                    </button>
                  </>
                )}

                {status === "pending" && (
                  <>
                    <img
                      src={pendingLogo}
                      alt="Pending"
                      className="w-24 sm:w-32 h-24 sm:h-32"
                    />
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      Certificate of Origin
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base font-medium">
                      Applied:{" "}
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                    <div className="flex justify-center gap-3 w-full mt-4">
                      <button className="flex items-center gap-2 bg-[#11860F] text-white font-semibold px-5 py-3 rounded hover:bg-[#0d6b0b] transition-colors">
                        <img
                          src={download}
                          alt="Download icon"
                          className="h-5 w-5"
                        />
                        Download
                      </button>

                      <button className="bg-green-50 text-[#11860F] font-semibold px-5 py-3 rounded hover:bg-green-100 transition-colors">
                        View Details
                      </button>
                    </div>
                  </>
                )}

                {status === "approved" && (
                  <>
                    <img
                      src={certImg}
                      alt="Approved"
                      className="w-24 sm:w-32 h-24 sm:h-32"
                    />
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      Certificate of Origin
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base font-medium">
                      Applied:{" "}
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                    <div className="flex justify-center gap-3 w-full mt-4">
                      <button
                        className="flex items-center gap-2 bg-[#11860F] text-white font-semibold px-5 py-3 rounded hover:bg-[#0d6b0b] transition-colors"
                        onClick={() =>
                          navigate("/certificate", {
                            state: {
                              name: `${user?.firstName || ""} ${
                                user?.lastName || ""
                              }`,
                              address: user?.address || "Unknown Address",
                              nativeTown: user?.town || "Unknown",
                              approvedDate: new Date().toLocaleDateString(),
                              autoDownload: true,
                            },
                          })
                        }
                      >
                        <img
                          src={download}
                          alt="Download icon"
                          className="h-5 w-5"
                        />
                        Download
                      </button>

                      <button
                        className="bg-green-50 text-[#11860F] font-semibold px-5 py-3 rounded hover:bg-green-100 transition-colors"
                        onClick={() =>
                          navigate("/certificate", {
                            state: {
                              name: `${user?.firstName || ""} ${
                                user?.lastName || ""
                              }`,
                              address: user?.address || "Unknown Address",
                              nativeTown: user?.town || "Unknown",
                              approvedDate: new Date().toLocaleDateString(),
                              autoDownload: false,
                            },
                          })
                        }
                      >
                        View Details
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* Verify Button */}
        <button
          className="flex items-center gap-2 bg-[#11860F] text-white font-semibold px-5 py-3 rounded hover:bg-[#0d6b0b] transition-colors mt-6"
          onClick={handleVerifyCertificateDashboard}
        >
          <ShieldCheck className="h-5 w-5" />
          Verify Certificate
        </button>
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

export default Dashboard;














