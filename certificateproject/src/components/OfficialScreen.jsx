import React, { useEffect, useState } from "react";
import { Search, LogOutIcon, Check, X, Clock } from "lucide-react";
import StateLogo from "../images/StateLogo.png";
import checkBox from "../images/checkbox.png";
import box from "../images/boxadmin.png";
import close from "../images/closemark.png";
import dropdown from "../images/Dropdown.png";
import MenuLogo from "../images/menu.png";
import CloseLogo from "../images/close.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com";

const OfficialScreen = () => {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const navigate = useNavigate();
  const Admin = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [pendingRes, approvedRes, rejectedRes] = await axios.all([
          axios.get(`${baseURL}/api/v1/admin/applications/pending`, config),
          axios.get(`${baseURL}/api/v1/admin/applications/approved`, config),
          axios.get(`${baseURL}/api/v1/admin/applications/rejected`, config),
        ]);

        const normalize = (res) =>
          res?.data?.data?.applications ??
          res?.data?.data?.approvedApplications ??
          res?.data?.data ??
          res?.data?.applications ??
          res?.data ??
          [];

        setPending(normalize(pendingRes));
        setApproved(normalize(approvedRes));
        setRejected(normalize(rejectedRes));
      } catch (error) {
        console.error("❌ Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/official");
  };

  const allApplications = [
    ...pending.map((item) => ({ ...item, status: "Pending" })),
    ...approved.map((item) => ({ ...item, status: "Approved" })),
    ...rejected.map((item) => ({ ...item, status: "Rejected" })),
  ];

  const getDisplayName = (item) =>
    item.name ||
    item.fullNames ||
    `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
    "Unknown";

  const filteredData = allApplications.filter((item) => {
    const displayName = getDisplayName(item);
    const matchesFilter = filter === "All" || item.status === filter;
    const matchesSearch = displayName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // ✅ Date Filtering (month & year)
    const itemDate = item.approvedAt || item.createdAt || item.updatedAt;
    const dateObj = itemDate ? new Date(itemDate) : null;
    const matchesMonthYear =
      !filterMonth ||
      !filterYear ||
      (dateObj &&
        dateObj.getMonth() + 1 === parseInt(filterMonth) &&
        dateObj.getFullYear() === parseInt(filterYear));

    return matchesFilter && matchesSearch && matchesMonthYear;
  });

  const total = allApplications.length;
  const approvedCount = approved.length;
  const rejectedCount = rejected.length;

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-gray-900 relative">
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
            <p className="font-semibold">{`${Admin?.firstName || ""} ${Admin?.lastName || ""}`}</p>
            <p className="text-gray-400 font-medium text-xs">{Admin?.position}</p>
          </div>
          <LogOutIcon onClick={handleLogout} className="cursor-pointer hover:text-red-500 transition" />
        </div>

        {/* Mobile Menu */}
        <div className="sm:hidden">
          <img
            src={MenuLogo}
            alt="Menu"
            className="w-6 h-6 cursor-pointer"
            onClick={() => setMenuOpen(true)}
          />
        </div>
      </header>

      {/* Mobile Menu Popup */}
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
              <p className="font-semibold">{`${Admin?.firstName || ""} ${Admin?.lastName || ""}`}</p>
              <p className="text-gray-400 font-medium text-xs">{Admin?.position}</p>
            </div>
            <LogOutIcon
              onClick={handleLogout}
              className="cursor-pointer hover:text-red-500 transition"
            />
          </div>
        </div>
      )}

      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">Approval Dashboard</h1>
      <p className="mb-6 font-medium text-gray-600">Review and manage applications</p>

      {/* Summary Cards */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="flex-1 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-black font-bold text-xl sm:text-2xl">Total Applications</p>
            <img src={dropdown} alt="" className="w-4 h-4" />
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-xl sm:text-2xl font-bold">{total}</p>
            <img src={box} alt="" className="w-10 h-10" />
          </div>
        </div>

        <div className="flex-1 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-black font-bold text-xl sm:text-2xl">Approved</p>
            <img src={dropdown} alt="" className="w-4 h-4" />
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-xl sm:text-2xl font-bold">{approvedCount}</p>
            <img src={checkBox} alt="" className="w-10 h-10" />
          </div>
        </div>

        <div className="flex-1 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-black font-bold text-xl sm:text-2xl">Rejected</p>
            <img src={dropdown} alt="" className="w-4 h-4" />
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-xl sm:text-2xl font-bold">{rejectedCount}</p>
            <img src={close} alt="" className="w-10 h-10" />
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex justify-between items-center mb-4 relative flex-wrap gap-2">
        <div className="relative flex-1 min-w-[150px]">
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-400 font-medium rounded-md px-10 py-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        <button
          className="flex items-center justify-center border border-gray-600 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-200"
          onClick={() => setShowFilter(true)}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L14 14.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 018 17v-2.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          <span className="hidden sm:inline ml-1">Filters</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="flex font-semibold space-x-4 mb-4 border-b border-gray-300 min-w-max">
          {["All", "Pending", "Approved", "Rejected"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 -mb-px border-b-2 whitespace-nowrap ${
                filter === tab
                  ? "border-green-600 font-semibold text-green-600"
                  : "border-transparent text-gray-600"
              }`}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Applications */}
      {loading ? (
        <p className="text-center py-10 text-gray-900 animate-pulse">Loading applications...</p>
      ) : filteredData.length === 0 ? (
        <p className="text-center py-10 font-medium text-gray-400">No data currently.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-md shadow-sm divide-y divide-gray-200">
          {filteredData.map((item, id) => (
            <div
              key={id}
              className="flex items-center p-4 space-x-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                if (item.status === "Pending") {
                  navigate("/approveapplications", { state: { application: item } });
                }
                if (item.status === "Approved") {
                  navigate("/certificate", {
                    state: {
                      name: `${item.fullNames}`,
                      image: item.passport,
                      address: item.currentAddress,
                      nativeTown: item.nativeTown,
                      approvedDate: new Date(item.updatedAt).toLocaleDateString(),
                      certificateId: item._id,
                      lga: item.lga,
                    },
                  });
                }
              }}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                {item.passport ? (
                  <img
                    src={
                      item.passport.startsWith("http")
                        ? item.passport
                        : `${baseURL}/${item.passport}`
                    }
                    alt="Applicant Passport"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
                  />
                ) : (
                  <span className="text-xs text-gray-400">No Image</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{item.fullNames || "Unknown"}</p>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full flex items-center space-x-1 ${
                  item.status === "Approved"
                    ? "bg-green-200 text-green-700 font-medium"
                    : item.status === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.status === "Approved" && <Check className="w-3 h-3" />}
                {item.status === "Rejected" && <X className="w-3 h-3" />}
                {item.status === "Pending" && <Clock className="w-3 h-3" />}
                <span>{item.status}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Filter Popup */}
      {showFilter && (
  <div className="absolute right-0 top-20 z-50">
    <div className="relative bg-white p-6 rounded-lg w-[90%] sm:w-80 shadow-xl border border-gray-200">
      {/* Close Button */}
      <button
        onClick={() => setShowFilter(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition"
      >
        <X className="w-5 h-5" />
      </button>

      <h2 className="text-lg font-semibold mb-4 text-gray-800">Filter by Date</h2>

      <div className="flex flex-col space-y-3">
        {/* Month Selector */}
        <label className="text-sm font-medium text-gray-600">Month</label>
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        {/* Year Input */}
        <label className="text-sm font-medium text-gray-600">Year</label>
        <input
          type="number"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          placeholder="e.g. 2025"
          className="border rounded-md px-3 py-2"
        />

        {/* Buttons */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={() => {
              setFilterMonth("");
              setFilterYear("");
              setShowFilter(false);
            }}
          >
            Reset
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            onClick={() => setShowFilter(false)}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default OfficialScreen;
