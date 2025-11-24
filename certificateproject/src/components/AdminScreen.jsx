import React, { useEffect, useState } from "react";
import { Search, LogOutIcon } from "lucide-react";
import StateLogo from "../images/StateLogo.png";
import dropdown from "../images/Dropdown.png";
import checkBox from "../images/checkbox.png";
import box from "../images/boxadmin.png";
import close from "../images/closemark.png";
import load from "../images/load.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com";

const AdminScreen = () => {
  const [summary, setSummary] = useState(null);

  // 👇 fetched applications
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();
  const Admin = JSON.parse(localStorage.getItem("user"));

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // ======================================================
  // 🔥 FETCH SUMMARY
  // ======================================================
  const fetchSummary = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/api/v1/admin/summary/application`,
        config
      );
      console.log("🔥 Summary response:", res.data?.data);

      const summaryData = res.data?.data?.summary;
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

  // ======================================================
  // SEARCH FILTER (client-side)
  // ======================================================
  // const filteredApps = applications.filter((app) =>
  //   app.fullNames.toLowerCase().includes(search.toLowerCase())
  // );

  const filteredApps = applications.filter((app) => {
  const name = app.fullNames || "";
  return name.toLowerCase().includes(search.toLowerCase());
});


 

  return (
    <div className="min-h-screen p-6 bg-white relative font-sans">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-gray-200 pb-3 mb-6">
        <div className="flex items-center space-x-2">
          <img src={StateLogo} className="w-8 h-8 rounded-full" alt="" />
          <span className="font-semibold text-gray-700 text-lg">
            Ogun State Government — Admin
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="font-semibold">{Admin?.fullName}</p>
            <p className="text-xs text-gray-500">System Administrator</p>
          </div>
       
        </div>
      </header>

      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600 font-medium mb-4">
        System-wide view of all certificate applications
      </p>

      {/* ===== SUMMARY CARDS ===== */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

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

        </div>
      )}

      {/* Search + Date Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center mb-4">
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
    </div>
  );
};

export default AdminScreen;

