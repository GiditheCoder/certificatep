import React, { useState , useEffect } from "react";
import { ArrowLeft, Clock, X, Check } from "lucide-react";
import axios from "axios";
import StateLogo from "../images/StateLogo.png";
import { LogOutIcon } from "lucide-react";
import MenuLogo from "../images/menu.png";
import CloseLogo from "../images/close.png";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const ApproveApplications = () => {
  const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com";
  const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState("");

const location = useLocation();
const { application: passedApplication } = location.state || {};



const [application, setApplication] = useState(passedApplication || null);

const navigate = useNavigate();

useEffect(() => {
  if (!application) {
    navigate("/official"); // go back if no application is selected
  }
}, [application, navigate]);


useEffect(() => {
  if (application) {
    console.log("📄 Application details:", application);
  } else {
    console.log("⚠️ No application found in state");
  }
}, [application]);


  const Admin = JSON.parse(localStorage.getItem("user"));

 

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/official");
  };

  
const handleApprove = async () => {
  try {
    setLoading("approve");
    const token = localStorage.getItem("token");
    console.log(token)

    const response = await axios.post(
      `${baseURL}/api/v1/admin/application/${application._id}?approve=true`,
      {}, // ✅ empty body
      {
        headers: { Authorization: `Bearer ${token}` }, // ✅ correct place
      }
    );

    console.log("Application approved:", response.data);
    setApplication((prev) => ({ ...prev, status: "Approved" }));
    toast.success("✅ Application successfully approved!");

    setTimeout(() => {
      navigate("/officialscreen");
    }, 1500);
  } catch (error) {
    console.error("Error approving application:", error.response || error.message);
    toast.error("❌ Failed to approve application. Please try again.");
  } finally {
    setLoading("");
  }
};

const handleReject = async () => {
  try {
    setLoading("reject");
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${baseURL}/api/v1/admin/application/${application._id}?approve=false`,
      {}, // ✅ empty body
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Application rejected:", response.data);
    setApplication((prev) => ({ ...prev, status: "Rejected" }));
    toast.success("🚫 Application successfully rejected!");

    setTimeout(() => {
      navigate("/officialscreen");
    }, 1500);
  } catch (error) {
    console.error("Error rejecting application:", error.response || error.message);
    toast.error("❌ Failed to reject application. Please try again.");
  } finally {
    setLoading("");
  }
};










  const handleBack = () => {
    navigate("/officialscreen");
  };

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-gray-200 sm:px-8 md:px-0.5 pb-3 mb-6">
        <div className="flex items-center space-x-2">
          <img src={StateLogo} alt="State Logo" className="w-8 h-8 rounded-full" />
          <span className="text-base sm:text-lg font-semibold text-[#475467]">
            Ogun State Government
          </span>
        </div>

        {/* Desktop User Info */}
        <div className="hidden sm:flex items-center space-x-3 text-sm">
          <div className="text-right">
            <p className="font-semibold">
              {`${Admin?.firstName || ""} ${Admin?.lastName || ""}`}
            </p>
            <p className="text-gray-400 font-medium text-xs">{Admin?.position}</p>
          </div>
          <LogOutIcon
            onClick={handleLogout}
            className="cursor-pointer hover:text-red-500 transition"
          />
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden">
          <img
            src={MenuLogo}
            alt="Menu"
            className="w-6 h-6 cursor-pointer"
            onClick={() => setMenuOpen(true)}
          />
        </div>
      </header>

      {/* Mobile User Menu */}
      {menuOpen && (
        <div className="sm:hidden absolute top-16 right-4 bg-white shadow-lg border rounded-md p-4 z-50 w-64">
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold">User Info</p>
            <img
              src={CloseLogo}
              alt="Close"
              className="w-5 h-5 cursor-pointer"
              onClick={() => setMenuOpen(false)}
            />
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="text-right">
              <p className="font-semibold">
                {`${Admin?.firstName || ""} ${Admin?.lastName || ""}`}
              </p>
              <p className="text-gray-400 font-medium text-xs">{Admin?.position}</p>
            </div>
            <LogOutIcon
              onClick={handleLogout}
              className="cursor-pointer hover:text-red-500 transition"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
      <button
  onClick={handleBack}
  className="flex items-center justify-center sm:justify-start space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition w-full sm:w-auto"
>
  <ArrowLeft className="w-4 h-4" />
  <span className="text-sm font-medium">Back to Applications</span>
</button>


      {/* Application Details Card */}
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col items-center text-center sm:text-left sm:items-start">
  {/* Title Section */}
  <div className="mb-8">
    <h1 className="text-2xl font-semibold text-gray-900 mb-1">
      Application Details
    </h1>
    <p className="text-sm text-gray-500 font-medium">
      Review and take action
    </p>
  </div>

  {/* Applicant Photo */}
      <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200 mb-4">
      {application.passport ? (
        <img
          src={
            application.passport.startsWith("data:image") ||
            application.passport.startsWith("http")
              ? application.passport
              : `${baseURL}/${application.passport}`
          }
          alt="Applicant Passport"
          className="w-full h-full object-cover"
          onError={(e) =>
            (e.target.src = "https://via.placeholder.com/40")
          }
        />
      ) : (
        <span className="text-xs text-gray-400 flex items-center justify-center h-full">
          No Image
        </span>
      )}
    </div>
 

  {/* Applicant Name */}
  <h2 className="text-xl font-semibold text-gray-900 mb-6">
    {application.fullNames}
  </h2>

  {/* Details Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 mb-8 w-full">
    {/* Application ID */}
    <div>
      <p className="text-sm text-gray-500 mb-1 font-medium">
        Application ID
      </p>
      <p className="text-base font-medium text-gray-900">
        {application._id}
      </p>
    </div>

    {/* Status */}
    <div>
      <p className="text-sm text-gray-500 mb-1">Status</p>
      <div className="flex items-center justify-center sm:justify-start space-x-2">
        <Clock
          className={`w-4 h-4 ${
            application.status === "Approved"
              ? "text-green-600"
              : application.status === "Rejected"
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        />
        <span
          className={`text-base font-medium ${
            application.status === "Approved"
              ? "text-green-600"
              : application.status === "Rejected"
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        >
          {application.status}
        </span>
      </div>
    </div>

    {/* Date Submitted */}
    <div>
      <p className="text-sm text-gray-500 mb-1 font-medium">
        Date Submitted
      </p>
      <p className="text-base font-medium text-gray-900">
        {application?.createdAt
          ? new Date(application.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A"}
      </p>
    </div>

    {/* Certificate ID */}
    <div>
      <p className="text-sm text-gray-500 mb-1 font-medium">
        Certificate ID
      </p>
      <p className="text-base font-medium text-gray-900">
        {application.certificateId || "N/A"}
      </p>
    </div>
  </div>

  {/* Document Section */}
  <div className="mb-8 w-full">
    <p className="text-sm text-gray-500 mb-2 font-medium">Document</p>
    <p className="text-base font-medium text-gray-900">
      {application.document || "N/A"}
    </p>
  </div>

 
   {/* Action Buttons with loading */}
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end sm:space-x-3 space-y-3 sm:space-y-0 w-full pt-6 border-t border-gray-200">
          <button
  onClick={handleReject}
  disabled={loading === "reject"}
  className={`flex items-center justify-center space-x-2 px-6 py-2.5 border border-red-300 text-red-600 rounded-lg font-medium w-full sm:w-auto transition ${
    loading === "reject" ? "opacity-30 cursor-not-allowed" : "hover:bg-red-50"
  }`}
>
  {loading === "reject" ? (
    <span className="animate-pulse">Rejecting...</span>
  ) : (
    <>
      <X className="w-4 h-4" />
      <span>Reject</span>
    </>
  )}
</button>

        <button
  onClick={handleApprove}
  disabled={loading === "approve"}
  className={`flex items-center justify-center space-x-2 px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium w-full sm:w-auto transition ${
    loading === "approve" ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"
  }`}
>
  {loading === "approve" ? (
    <span className="animate-pulse">Approving...</span>
  ) : (
    <>
      <Check className="w-4 h-4" />
      <span>Approve</span>
    </>
  )}
</button>


</div>

</div>

      </div>
      <ToastContainer
  position="top-center"
  autoClose={2000}
  hideProgressBar={false}
  closeOnClick
  pauseOnHover
  draggable
  theme="colored"
/>

    </div>
  );
};

export default ApproveApplications;
