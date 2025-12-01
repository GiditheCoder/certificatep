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
import DashboardWithFilter from "./DashboardWithFilter";

const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com";

const AdminScreen = ({onOpenFilter}) => {
  const [summary, setSummary] = useState(null);

  // 👇 fetched applications
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
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
  console.log("🔥 Admin Token:", token);
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

  const handleFilterApply = (summaryData) => {
  console.log("🔄 Filter summary result:", summaryData);
  setSummary(summaryData);
};




  return (

    
    <div className="min-h-screen p-2 bg-white relative font-sans">

      
    {filterOpen && (
      <DashboardWithFilter
        onBack={() => setFilterOpen(false)}
        onApply={handleFilterApply}
      />
    )}
     <div className="flex justify-end mb-4">
  <LogOutIcon
    onClick={handleLogout}
    className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#11860F]"
  />
</div>

        

 
    <div className="flex items-center justify-between mb-4">
  <h1 className="text-2xl font-bold">
    Dashboard
  </h1>

   <button
          className="bg-green-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
          // onClick={onOpenFilter}
          onClick={() => setFilterOpen(true)}

        >
          Filter
        </button>

        
               
                

</div>




      {/* ===== SUMMARY CARDS ===== */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-6">

          <div className="p-6 border rounded-md shadow-sm bg-white">
            <div className="flex justify-between">
              <p className="font-bold text-xl">Total</p>
             
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-2xl font-bold">
                {summary.totalApplications}
              </p>
              <img src={box} className="w-10 h-10" alt="" />
            </div>
          </div>

          

          <div className="p-6 border rounded-md shadow-sm bg-white">
            <div className="flex justify-between">
              <p className="font-bold text-xl">Approved</p>
              {/* <img src={dropdown} className="w-4 h-4" alt="" /> */}
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-2xl font-bold">
                {summary.totalApproved}
              </p>
              <img src={checkBox} className="w-10 h-10" alt="" />
            </div>
          </div>

          <div className="p-6 border rounded-md shadow-sm bg-white">  
            <div className="flex justify-between">
              <p className="font-bold text-xl">Rejected</p>
              {/* <img src={dropdown} className="w-4 h-4" alt="" /> */}
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-2xl font-bold">
                {summary.totalRejected}
              </p>
              <img src={close} className="w-10 h-10" alt="" />
            </div>
          </div>

          <div className="p-6 border rounded-md shadow-sm bg-white">
            <div className="flex justify-between">
              <p className="font-bold text-xl">Pending</p>
              {/* <img src={dropdown} className="w-4 h-4" alt="" /> */}
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-2xl font-bold">
                {summary.totalPending}
              </p>
              <img src={load} className="w-8 h-8" alt="" />
            </div>
          </div>

{/* Today Approved */}
          <div className="p-6 border rounded-md shadow-sm bg-white">
            <div className="flex justify-between">
              <p className="font-bold text-xl">Today Approved</p>
              {/* <img src={dropdown} className="w-4 h-4" alt="" /> */}
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-2xl font-bold">
                {summary.todayApproved}
              </p>
              <img src={mark} className="w-8 h-8" alt="" />
            </div>
          </div>

          {/* Today Count  */}
          <div className="p-6 border rounded-md shadow-sm bg-white">
            <div className="flex justify-between">
              <p className="font-bold text-xl">Today Count</p>
              {/* <img src={dropdown} className="w-4 h-4" alt="" /> */}
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-2xl font-bold">
                {summary.todayCount}
              </p>
              <img src={plus} className="w-8 h-8" alt="" />
            </div>
          </div>

          {/* Today Pending */}
          <div className="p-6 border rounded-md shadow-sm bg-white">
            <div className="flex justify-between">
              <p className="font-bold text-xl">Today Pending</p>
              {/* <img src={dropdown} className="w-4 h-4" alt="" /> */}
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-2xl font-bold">
                {summary.todayPending}
              </p>
              <img src={pending} className="w-8 h-8" alt="" />
            </div>
          </div>

          {/* Today Rejected */}
          <div className="p-6 border rounded-md shadow-sm bg-white">
            <div className="flex justify-between">
              <p className="font-bold text-xl">Today Rejected</p>
              {/* <img src={dropdown} className="w-4 h-4" alt="" /> */}
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

{loading ? (
  <div className="py-10 text-center flex justify-center items-center gap-2 text-gray-600">
    <span className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-green-600 rounded-full"></span>
    <p className="font-medium">Loading applications…</p>
  </div>
) : filteredApps.length === 0 ? (
  <p className="py-10 text-center text-gray-500">No applications found.</p>
) : (
  <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 border-b text-gray-700">
        <tr>
          {["ID", "Date", "Name", "Status", "LGA"].map((text) => (
            <th
              key={text}
              className="py-3 px-4 text-left text-[15px] font-semibold tracking-wide"
            >
              {text}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {filteredApps.map((app) => (
          <tr
            key={app._id}
            className="border-b hover:bg-gray-50 transition-colors text-gray-700"
          >
            {/* ID */}
            <td className="py-3 px-4 text-[15px] font-medium cursor-pointer ">
              {app._id?.slice(0, 8) || "N/A"}
            </td>

            {/* Date */}
            <td className="py-3 px-4 text-[15px]">
              {new Date(app.createdAt).toLocaleDateString()}
            </td>

            {/* Name */}
            <td className="py-3 px-4 text-[15px] font-semibold capitalize">
              {app.fullNames}
            </td>

            {/* Status */}
            <td className="py-3 px-4">
              <span
                className={`px-3 py-1 text-[12px] rounded-lg font-semibold capitalize ${
                  app.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : app.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {app.status}
              </span>
            </td>

            {/* LGA */}
            <td className="py-3 px-4 text-[15px] capitalize">
              {app.lga || "N/A"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


          {/* <div className="mt-4 flex gap-3 items-center">
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
</div> */}

    

    </div>

    
  );
};

export default AdminScreen;


