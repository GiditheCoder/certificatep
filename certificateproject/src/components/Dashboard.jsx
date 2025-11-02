// import React, { useEffect, useState, useContext } from "react";
// import { Bell, LogOutIcon, ShieldCheck } from "lucide-react";
// import StateLogo from "../images/StateLogo.png";
// import box from "../images/box.png";
// import blob from "../images/blob.png";
// import Bg from "../images/Bg.png";
// import MenuLogo from "../images/menu.png";
// import CloseLogo from "../images/close.png";
// import certImg from "../images/cert.png";
// import pendingLogo from "../images/pending.png";
// import download from "../images/download.png";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { UserContext } from "../context/UserContext";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { user, updateUser } = useContext(UserContext);

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [applicationId, setApplicationId] = useState(null);
//   const [status, setStatus] = useState("noapplication");
//   const [pendingPaymentLink, setPendingPaymentLink] = useState(null);
//   const [loading, setLoading] = useState(true); // ✅ loading state
//   const [latestApplication, setLatestApplication] = useState(null);


//   const handleVerifyCertificateDashboard = () => {
//     if (!applicationId) {
//       toast.error("No application found to verify.");
//       return;
//     }

//     navigate("/verify-certificate", { state: { certificateId: applicationId } });
//   };

//   useEffect(() => {
//     console.log("User from context:", user);
//   }, [user]);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const token = localStorage.getItem("token");

//     if (!storedUser || !token) {
//       navigate("/login");
//       return;
//     }

//     const parsedUser = JSON.parse(storedUser);
//     updateUser(parsedUser);

//     const fetchApplication = async (applicationId = null) => {
//       try {
//         setLoading(true); // ✅ start loading

//         const url = applicationId
//           ? `https://lgacertificate-011d407b356b.herokuapp.com/api/v1/application/${applicationId}`
//           : `https://lgacertificate-011d407b356b.herokuapp.com/api/v1/application`;

//         const res = await axios.get(url, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         let applications = [];

//         if (applicationId) {
//           applications = [res.data?.data?.application].filter(Boolean);
//         } else {
//           applications = res.data?.data?.applications || [];
//         }

//         console.log("Fetched applications:", applications);

//         if (applications.length === 0) {
//           setStatus("noapplication");
//           setLoading(false);
//           return;
//         }

//         const userApplications = applications.filter(
//           (app) => app.user === parsedUser._id
//         );

//         console.log("User's applications:", userApplications);

//         if (userApplications.length === 0) {
//           toast.info("You have not submitted any application yet.");
//           setStatus("noapplication");
//           setLoading(false);
//           return;
//         }

//         const latestApp = userApplications[userApplications.length - 1];
//         setApplicationId(latestApp._id);

//         setLatestApplication(latestApp);

//         console.log("Saved Application ID:", latestApp._id);

//         if (latestApp.isPendingPayment || latestApp.isPendingApproval) {
//           setStatus("pending");
//         } else if (latestApp.isApproved) {
//           setStatus("approved");
//         } else if (latestApp.isRejected) {
//           setStatus("noapplication");
//         }

//       } catch (error) {
//         console.error("Error fetching applications:", error);
//         setStatus("noapplication");
//       } finally {
//         setLoading(false); // ✅ stop loading
//       }
//     };

//     fetchApplication();
//   }, [navigate]);

//   const handleNewApplication = () => {
//     if (user?.state !== "verified") {
//       toast.error("User must be verified to start an application");
//       return;
//     }

//     if (pendingPaymentLink) {
//       toast.info("💳 Redirecting to continue your incomplete payment...");
//       window.location.href = pendingPaymentLink;
//       return;
//     }

//     if (status === "pending" || status === "approved") {
//       toast.error("User has a verified or pending application");
//       return;
//     }

//     navigate("/application");
//   };

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
//             {user?.state === "verified" ? (
//               <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
//                 Verified
//               </span>
//             ) : (
//               <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
//                 Unverified
//               </span>
//             )}
//             <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-semibold uppercase">
//               {user
//                 ? `${user.firstName?.charAt(0).toUpperCase()}${user.lastName
//                     ?.charAt(0)
//                     .toUpperCase()}`
//                 : "?"}
//             </div>
//           </div>
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
//                 ? `${user.firstName?.charAt(0).toUpperCase()}${user.lastName
//                     ?.charAt(0)
//                     .toUpperCase()}`
//                 : "?"}
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Main Content */}
//       <main className="px-5 sm:px-10 py-8 space-y-10">
//         <h2 className="text-xl sm:text-2xl text-center md:text-left font-semibold text-gray-900">
//           Welcome back, {user ? user.firstName : "User"}!
//         </h2>
//         <p className="text-gray-500 font-medium text-sm sm:text-base text-center md:text-left">
//           Manage your certificate applications and track their progress
//         </p>

//         {user?.state !== "verified" && (
//   <div className="flex justify-center md:justify-start mt-4">
//     <button
//       onClick={() => navigate("/request-email-verify")}
//       className="flex items-center gap-2 bg-red-500 text-white font-semibold px-5 py-2 rounded-md hover:bg-yellow-600 transition-colors"
//     >
//       <ShieldCheck className="h-5 w-5" />
//       Verify Your Account
//     </button>
//   </div>
// )}

//         {/* ✅ Loading spinner */}
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
//             <p className="text-gray-600 mt-4 font-medium">
//               Loading application status...
//             </p>
//           </div>
//         ) : (
//           <>
//             {/* Normal UI below */}
//             <div className="relative rounded-xl p-6 sm:p-8 shadow-lg overflow-hidden">
//               <img
//                 src={Bg}
//                 alt="Background"
//                 className="absolute inset-0 w-full h-full object-cover opacity-100"
//               />
//               <img
//                 src={blob}
//                 alt="Pattern"
//                 className="absolute right-0 top-0 w-full h-full object-cover opacity-20 pointer-events-none"
//               />
//               <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
//                 <h3 className="text-2xl sm:text-3xl font-semibold text-black drop-shadow-md text-center md:text-left">
//                   Start a New Application
//                 </h3>
//                 <button
//                   className="bg-[#11860F] text-white px-3 sm:px-5 py-1.5 sm:py-2 text-sm sm:text-base rounded-md font-medium hover:bg-green-700 transition w-full sm:w-auto"
//                   onClick={handleNewApplication}
//                 >
//                   New Application
//                 </button>
//               </div>
//             </div>

//             <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
//               <div className="flex border-b border-gray-200 flex-wrap">
//                 <button
//                   className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-bold ${
//                     status === "pending"
//                       ? "text-black border-b-2 border-[#11860F]"
//                       : "text-gray-500 border-b-2 border-transparent"
//                   }`}
//                   disabled={status !== "pending"}
//                 >
//                   Pending
//                 </button>
//                 <button
//                   className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-bold ${
//                     status === "approved"
//                       ? "text-black border-b-2 border-[#11860F]"
//                       : "text-gray-500 border-b-2 border-transparent"
//                   }`}
//                   disabled={status !== "approved"}
//                 >
//                   Approved
//                 </button>
//               </div>

//               {/* Status Display */}
//               <div className="flex flex-col items-center justify-center py-10 sm:py-14 px-4 text-center space-y-4">
//                 {status === "noapplication" && (
//                   <>
//                     <img
//                       src={box}
//                       alt="No Application"
//                       className="w-24 sm:w-32 h-24 sm:h-32"
//                     />
//                     <h3 className="text-lg sm:text-xl font-bold text-gray-900">
//                       No Applications Yet
//                     </h3>
//                     <p className="text-gray-600 text-sm sm:text-base font-medium">
//                       You haven’t started any certificate application yet.
//                     </p>
//                     <button
//                       className="bg-[#11860F] hover:bg-green-700 text-white px-5 sm:px-6 py-2.5 rounded-lg font-semibold transition-colors"
//                       onClick={handleNewApplication}
//                     >
//                       Start New Application
//                     </button>
//                   </>
//                 )}

//                 {status === "pending" && (
//                   <>
//                     <img
//                       src={pendingLogo}
//                       alt="Pending"
//                       className="w-24 sm:w-32 h-24 sm:h-32"
//                     />
//                     <h3 className="text-lg sm:text-xl font-bold text-gray-900">
//                       Certificate of Origin
//                     </h3>
//                     <p className="text-gray-600 text-sm sm:text-base font-medium">
//                       Applied:{" "}
//                       {user?.createdAt
//                         ? new Date(user.createdAt).toLocaleString("en-US", {
//                             year: "numeric",
//                             month: "short",
//                             day: "numeric",
//                           })
//                         : "N/A"}
//                     </p>
                   
//                   </>
//                 )}

//                 {status === "approved" && (
//                   <>
//                     <img
//                       src={certImg}
//                       alt="Approved"
//                       className="w-24 sm:w-32 h-24 sm:h-32"
//                     />
//                     <h3 className="text-lg sm:text-xl font-bold text-gray-900">
//                       Certificate of Origin
//                     </h3>
//                     <p className="text-gray-600 text-sm sm:text-base font-medium">
//                       Applied:{" "}
//                       {user?.createdAt
//                         ? new Date(user.createdAt).toLocaleString("en-US", {
//                             year: "numeric",
//                             month: "short",
//                             day: "numeric",
//                           })
//                         : "N/A"}
//                     </p>
//                     <div className="flex justify-center gap-3 w-full mt-4">
//                       <button
//                         className="flex items-center gap-2 bg-[#11860F] text-white font-semibold px-5 py-3 rounded hover:bg-[#0d6b0b] transition-colors"
//                         onClick={() =>
//                           navigate("/certificate", {
//                             state: {
//                               name: `${user?.firstName || ""} ${
//                                 user?.lastName || ""
//                               }`,
//                               address: latestApplication?.currentAddress || user?.address || "Unknown Address",
//                               nativeTown: user?.town || "Unknown",
//                       approvedDate: latestApplication?.updatedAt || null,


//                               lga: latestApplication?.lga || "Unknown LGA",
//                               certificateId: applicationId || "N/A",
//                               image: latestApplication?.passport
//                             },
//                           })
//                         }
//                       >
//                         <img
//                           src={download}
//                           alt="Download icon"
//                           className="h-5 w-5"
//                         />
//                         Download
//                       </button>

                    
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </>
//         )}

//         {/* Verify Button */}
//         <button
//           className="flex items-center gap-2 bg-[#11860F] text-white font-semibold px-5 py-3 rounded hover:bg-[#0d6b0b] transition-colors mt-6"
//           onClick={handleVerifyCertificateDashboard}
//         >
//           <ShieldCheck className="h-5 w-5" />
//           Verify Certificate
//         </button>
//       </main>

//       <ToastContainer
//         position="top-center"
//         autoClose={3000}
//         hideProgressBar={false}
//         closeOnClick
//         pauseOnHover
//         draggable
//         theme="colored"
//       />
//     </div>
//   );
// };

// export default Dashboard;



import React, { useEffect, useState, useContext } from "react";
import {
  Bell,
  LogOutIcon,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
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
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("noapplication");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    updateUser(parsedUser);

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/application",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const allApps = res.data?.data?.applications || [];
        const userApps = allApps.filter((app) => app.user === parsedUser._id);

        setApplications(userApps);

        if (userApps.length === 0) {
          setActiveTab("noapplication");
        } else {
          setActiveTab("pending");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  const handleNewApplication = () => {
    if (user?.state !== "verified") {
      toast.error("User must be verified to start an application");
      return;
    }
    navigate("/application");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleVerifyCertificateDashboard = () => {
    navigate("/verify-certificate");
  };

  const pendingApps = applications.filter(
    (a) => a.isPendingPayment || a.isPendingApproval || a.isRejected
  );
  useEffect(() => {
  if (pendingApps.length > 0) {
    console.log("🟡 Pending Applications:", pendingApps);
  }
}, [pendingApps]);

  const approvedApps = applications.filter((a) => a.isApproved);

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

      <main className="px-5 sm:px-10 py-8 space-y-10">
        <h2 className="text-xl sm:text-2xl text-center md:text-left font-semibold text-gray-900">
          Welcome back, {user ? user.firstName : "User"}!
        </h2>
        <p className="text-gray-500 font-medium text-sm sm:text-base text-center md:text-left">
          Manage your certificate applications and track their progress
        </p>

        {user?.state !== "verified" && (
          <div className="flex justify-center md:justify-start mt-4">
            <button
              onClick={() => navigate("/request-email-verify")}
              className="flex items-center gap-2 bg-red-500 text-white font-semibold px-5 py-2 rounded-md hover:bg-yellow-600 transition-colors"
            >
              <ShieldCheck className="h-5 w-5" />
              Verify Your Account
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-4 font-medium">
              Loading application data...
            </p>
          </div>
        ) : (
          <>
            {/* Start new application */}
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

            {/* Tabs */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="flex border-b border-gray-200 flex-wrap">
                {["noapplication", "pending", "approved"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-bold ${
                      activeTab === tab
                        ? "text-black border-b-2 border-[#11860F]"
                        : "text-gray-500 border-b-2 border-transparent"
                    }`}
                  >
                    {tab === "noapplication"
                      ? "New Application"
                      : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "noapplication" && (
                  <div className="flex flex-col items-center py-10 text-center">
                    <img
                      src={box}
                      alt=" Application"
                      className="w-24 sm:w-32 h-24 sm:h-32"
                    />
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      No Applications Yet
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base font-medium">
                      You haven’t started any certificate application yet.
                    </p>
                    <button
                      className="bg-[#11860F] hover:bg-green-700 text-white px-5 sm:px-6 py-2.5 rounded-lg font-semibold mt-4"
                      onClick={handleNewApplication}
                    >
                      Start New Application
                    </button>
                  </div>
                )}

              
{activeTab === "pending" && (
  <div className="space-y-4">
    {pendingApps.length > 0 ? (
      pendingApps.map((app) => (
        <div
          key={app._id}
          className={`border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between transition ${
            app.isPendingPayment ? "cursor-pointer hover:bg-gray-50" : ""
          }`}
          onClick={() => {
            if (app.isPendingPayment && app.pendingPaymentLink) {
              toast.info("Redirecting you to complete your payment...");
              window.location.href = app.pendingPaymentLink; // ✅ Corrected property
            } else if (app.isPendingPayment && !app.pendingPaymentLink) {
              toast.error("Payment link unavailable. Please start a new application.");
            }
          }}
        >
          <div className="flex items-center gap-3">
            {app.isRejected ? (
              <XCircle className="text-red-600" />
            ) : app.isPendingPayment ? (
              <Clock className="text-yellow-600" />
            ) : (
              <FileText className="text-gray-600" />
            )}

            <div>
              <p className="font-semibold text-gray-900">
                {app.lga || "Certificate of Origin"}
              </p>
              <p className="text-gray-600 text-sm">
                Applied: {new Date(app.createdAt).toLocaleDateString()}
              </p>

              {app.isRejected && (
                <p className="text-red-600 font-medium text-sm">Rejected</p>
              )}
              {app.isPendingPayment && (
                <p className="text-yellow-600 font-medium text-sm">
                  Incomplete payment — click to retry
                </p>
              )}
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-center py-6">
        No pending applications found.
      </p>
    )}
  </div>
)}



                {/* {activeTab === "approved" && (
                  <div className="space-y-4">
                    {approvedApps.length > 0 ? (
                      approvedApps.map((app) => (
                        <div
                          key={app._id}
                          className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-green-600" />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {app.lga || "Certificate of Origin"}
                              </p>
                              <p className="text-gray-600 text-sm">
                                Approved:{" "}
                                {new Date(app.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <button
                            className="mt-3 sm:mt-0 flex items-center gap-2 bg-[#11860F] text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                            onClick={() =>
                              navigate("/certificate", {
                                state: {
                                  name: `${user?.firstName || ""} ${
                                    user?.lastName || ""
                                  }`,
                                  address:
                                    app.currentAddress ||
                                    user?.address ||
                                    "Unknown Address",
                                  nativeTown: user?.town || "Unknown",
                                  approvedDate: app.updatedAt,
                                  lga: app.lga || "Unknown LGA",
                                  certificateId: app._id,
                                  image: app.passport,
                                },
                              })
                            }
                          >
                            <img
                              src={download}
                              alt="Download"
                              className="w-4 h-4"
                            />
                            Download
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-6">
                        No approved certificates yet.
                      </p>
                    )}
                  </div>
                )} */}

                {activeTab === "approved" && (
  <div className="space-y-4">
    {approvedApps.length > 0 ? (
      approvedApps.map((app) => (
        <div
          key={app._id}
          className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-600" />
            <div>
              <p className="font-semibold text-gray-900">
                {app.lga || "Certificate of Origin"}
              </p>
              <p className="text-gray-600 text-sm">
                Approved: {new Date(app.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-3 sm:mt-0">
            {/* ✅ Download Certificate Button */}
            <button
              className="flex items-center gap-2 bg-[#11860F] text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              onClick={() =>
                navigate("/certificate", {
                  state: {
                    name: `${user?.firstName || ""} ${user?.lastName || ""}`,
                    address:
                      app.currentAddress || user?.address || "Unknown Address",
                    nativeTown: user?.town || "Unknown",
                    approvedDate: app.updatedAt,
                    lga: app.lga || "Unknown LGA",
                    certificateId: app._id,
                    image: app.passport,
                  },
                })
              }
            >
              <img src={download} alt="Download" className="w-4 h-4" />
              Download
            </button>

            {/* ✅ Verify Certificate Button */}
            <button
              className="flex items-center gap-2 bg-[#11860F] text-white px-4 py-2 rounded-md hover:bg-[#0b5b09] transition"
              onClick={() =>
                navigate("/verify-certificate", {
                  state: { certificateId: app._id },
                })
              }
            >
              <ShieldCheck className="h-5 w-5" />
              Verify
            </button>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-center py-6">
        No approved certificates yet.
      </p>
    )}
  </div>
)}




                
              </div>
            </div>
          </>
        )}

        {/* <button
          className="flex items-center gap-2 bg-[#11860F] text-white font-semibold px-5 py-3 rounded hover:bg-[#0d6b0b] transition-colors mt-6"
          onClick={handleVerifyCertificateDashboard}
        >
          <ShieldCheck className="h-5 w-5" />
          Verify Certificate
        </button> */}
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

