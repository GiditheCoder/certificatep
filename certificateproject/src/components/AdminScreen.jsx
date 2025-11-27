import React, { useEffect, useState } from "react";
import { Search, LogOutIcon ,ArrowBigLeft } from "lucide-react";
import StateLogo from "../images/StateLogo.png";
import dropdown from "../images/Dropdown.png";
import checkBox from "../images/checkbox.png";
import box from "../images/boxadmin.png";
import close from "../images/closemark.png";
import load from "../images/load.png";
import mark from "../images/mark.png";
import plus from "../images/add.png";
import reject from "../images/cross.png";
import pending from "../images/wall-clock.png";
import back from "../images/back.png";
import axios from "axios";
import MenuLogo from "../images/menu.png";
import CloseLogo from "../images/close.png";
import { useNavigate } from "react-router-dom";

const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com";

const AdminScreen = () => {
  const [summary, setSummary] = useState(null);

  // 👇 fetched applications
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
   const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [downloadEmail, setDownloadEmail] = useState("");


  const navigate = useNavigate();

  const handleOfficalBackScreen = () => {
    navigate("/officialsignup");
  }
  const Admin = JSON.parse(localStorage.getItem("user"));

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  
  // 🔥 FETCH SUMMARY
  // ======================================================
  const fetchSummary = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/api/v1/admin/summary/application`,
        config
      );
      console.log("🔥 Summary response:", res.data?.data);
      console.log("🔥 Summary Raw:", res);

      const summaryData = res.data?.data?.summary;
      console.log("🔥 Summary Data:", summaryData);
      setSummary(summaryData || null);

    } catch (error) {
      console.error("❌ Summary error:", error);
    }
  };

  // ======================================================
  // 🔥 FETCH APPLICATIONS (All, Approved, Pending, Rejected)
  // ======================================================
  const fetchApplications = async (status = "all") => {
    setLoading(true);

    try {
      const params = {
        page: 1,
        startDate,
        endDate,
      };

      if (status !== "all") params.status = status.toLowerCase();

      const res = await axios.get(
        `${baseURL}/api/v1/admin/applications`,
        { ...config, params }
      );

      console.log("🔥 Applications Raw:", res.data);

      // Extract correct array
      const arr = res.data?.data?.data || [];
      setApplications(arr);

    } catch (error) {
      console.error("❌ Fetch apps error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // Load summary + ALL applications first
  useEffect(() => {
    fetchSummary();
    fetchApplications("all");
  }, []);

 
  const filteredApps = applications.filter((app) => {
  const name = app.fullNames || "";
  return name.toLowerCase().includes(search.toLowerCase());
});

const handleSendDownloadReport = async () => {
  if (!downloadEmail) {
    alert("Please enter an email address");
    return;
  }

  try {
    const body = {
      status: filter.toLowerCase() === "all" ? "" : filter.toLowerCase(),
      startDate,
      endDate,
      email: downloadEmail,
    };

    const res = await axios.post(
      `${baseURL}/api/v1/admin/download/application`,
      body,
      config
    );

    alert(res.data.message || "Report sent!");
    setDownloadEmail("");

  } catch (error) {
    console.log("❌ REPORT DOWNLOAD ERROR:", error.response?.data || error);
    alert(error.response?.data?.message || "Error sending report");
  }
};

 const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/official");
  };



  return (
    <div className="min-h-screen p-2 bg-white relative font-sans">
      {/* Header */}
            <header className="flex items-center justify-between px-1  py-4 sm:px-8 bg-white shadow-sm ">
              <div className="flex items-center gap-3">
                <img src={StateLogo} alt="State Logo" className="w-10 h-10" />
                <h1 className="text-base sm:text-lg font-semibold text-[#475467]">
                  Ogun State Government
                </h1>
              </div>
      
              <div className="hidden md:flex items-center gap-5">
             
                <LogOutIcon
                  onClick={handleLogout}
                  className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#11860F]"
                />
              
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
  <div className="absolute top-18 left-80 w-full bg-white border-t border-gray-200 shadow-md flex flex-col gap-4 p-4 md:hidden z-50">
    <LogOutIcon
      onClick={handleLogout}
      className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#11860F]"
    />
  </div>
)}

            </header>

      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600 font-medium mb-4">
        System-wide view of all certificate applications
      </p>

      {/* ===== SUMMARY CARDS ===== */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">

          <div className="p-4 border rounded-md shadow-sm bg-white">
            <div className="flex justify-between">
              <p className="font-bold text-xl">Total</p>
              <img src={dropdown} className="w-4 h-4" alt="" />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-2xl font-bold">
                {summary.totalApplications}
              </p>
              <img src={box} className="w-10 h-10" alt="" />
            </div>
          </div>

          <div className="p-4 border rounded-md shadow-sm bg-white">
            <div className="flex justify-between">
              <p className="font-bold text-xl">Approved</p>
              <img src={dropdown} className="w-4 h-4" alt="" />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-2xl font-bold">
                {summary.totalApproved}
              </p>
              <img src={checkBox} className="w-10 h-10" alt="" />
            </div>
          </div>

          <div className="p-4 border rounded-md shadow-sm bg-white">  
            <div className="flex justify-between">
              <p className="font-bold text-xl">Rejected</p>
              <img src={dropdown} className="w-4 h-4" alt="" />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-2xl font-bold">
                {summary.totalRejected}
              </p>
              <img src={close} className="w-10 h-10" alt="" />
            </div>
          </div>

          <div className="p-4 border rounded-md shadow-sm bg-white">
            <div className="flex justify-between">
              <p className="font-bold text-xl">Pending</p>
              <img src={dropdown} className="w-4 h-4" alt="" />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-2xl font-bold">
                {summary.totalPending}
              </p>
              <img src={load} className="w-8 h-8" alt="" />
            </div>
          </div>

{/* Today Approved */}
          <div className="p-4 border rounded-md shadow-sm bg-white">
            <div className="flex justify-between">
              <p className="font-bold text-xl">Today Approved</p>
              <img src={dropdown} className="w-4 h-4" alt="" />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-2xl font-bold">
                {summary.todayApproved}
              </p>
              <img src={mark} className="w-8 h-8" alt="" />
            </div>
          </div>

          {/* Today Count  */}
          <div className="p-4 border rounded-md shadow-sm bg-white">
            <div className="flex justify-between">
              <p className="font-bold text-xl">Today Count</p>
              <img src={dropdown} className="w-4 h-4" alt="" />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-2xl font-bold">
                {summary.todayCount}
              </p>
              <img src={plus} className="w-8 h-8" alt="" />
            </div>
          </div>

          {/* Today Pending */}
          <div className="p-4 border rounded-md shadow-sm bg-white">
            <div className="flex justify-between">
              <p className="font-bold text-xl">Today Pending</p>
              <img src={dropdown} className="w-4 h-4" alt="" />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-2xl font-bold">
                {summary.todayPending}
              </p>
              <img src={pending} className="w-8 h-8" alt="" />
            </div>
          </div>

          {/* Today Rejected */}
          <div className="p-4 border rounded-md shadow-sm bg-white">
            <div className="flex justify-between">
              <p className="font-bold text-xl">Today Rejected</p>
              <img src={dropdown} className="w-4 h-4" alt="" />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-2xl font-bold">
                {summary.todayRejected}
              </p>
              <img src={reject} className="w-8 h-8" alt="" />
            </div>
          </div>

        </div>
      )}

      {/* Search + Date Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center mb-4">
        <div className="relative flex-1">
         
        

          {/* Search + Date Filter */}
<div className="flex flex-col sm:flex-row gap-3 items-center mb-4">
  {/* Name Search */}
  <div className="relative flex-1">
    <input
      type="text"
      className="border border-gray-400 font-semibold py-2 px-10 rounded-md w-full"
      placeholder="Search name..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
  </div>

  {/* Date Range */}
  <div className="flex gap-2">
    <input
      type="date"
      className="border border-gray-400 font-semibold px-3 py-2 rounded-md"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
    />
    <input
      type="date"
      className="border border-gray-400 font-semibold px-3 py-2 rounded-md"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
    />
  </div>

  {/* Search Button */}
  <button
    onClick={() => fetchApplications(filter === "All" ? "all" : filter)}
    className="bg-green-600 text-white font-semibold px-4 py-2 rounded-md shadow-md hover:bg-green-700"
  >
    Apply Filter
  </button>
</div>

        </div>

     
      </div>

      {/* Tabs */}
      <div className="flex font-semibold border-b mb-4 space-x-4">
        {["All", "Pending", "Approved", "Rejected"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setFilter(t);
              fetchApplications(t === "All" ? "all" : t);
            }}
            className={`pb-2 ${
              filter === t
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Applications */}
      {loading ? (
        <p className="py-10 text-center">Loading...</p>
      ) : filteredApps.length === 0 ? (
        <p className="py-10 text-center text-gray-500">No applications found.</p>
      ) : (
        <div className="divide-y border rounded-md shadow-sm">
          {filteredApps.map((app) => (
            <div
              key={app._id}
              className="flex items-center p-4 space-x-4 hover:bg-gray-50 cursor-pointer"
            
            >
              <div className="flex-1">
                <p className="font-semibold">{app.fullNames}</p>
                <p className="text-xs text-gray-500">
                  {new Date(app.createdAt).toLocaleString()}
                </p>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  app.status === "approved"
                    ? "bg-green-200 text-green-700"
                    : app.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
          <div className="mt-4 flex gap-3 items-center">
  <input
    type="email"
    placeholder="Enter email to receive report"
    className="border font-semibold border-gray-400 px-3 py-2 rounded-md w-full"
    value={downloadEmail}
    onChange={(e) => setDownloadEmail(e.target.value)}
  />

  <button
    onClick={handleSendDownloadReport}
    className="bg-green-700 font-semibold text-white px-2 py-1 rounded-md hover:bg-green-800"
  >
    Send Report
  </button>
</div>

      <div className="font-semibold mt-4 cursor-pointer text-green-600"
      onClick={handleOfficalBackScreen}>
 <ArrowBigLeft className="inline-block mr-2" />
     Back
    </div>

    </div>

    
  );
};

export default AdminScreen;

