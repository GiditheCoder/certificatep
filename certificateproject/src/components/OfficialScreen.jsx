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
import QRCode from "react-qr-code";

const certificateHash = "abc123xyz";

function CertificateQR() {
  return (
    <div style={{ background: "white", padding: "12px" }}>
      <QRCode value={certificateHash} size={180} />
    </div>
  );
}

const baseURL = "https://certapp-aae046f75d3f.herokuapp.com";

const OfficialScreen = () => {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [certificatesLoading, setCertificatesLoading] = useState(true);
  const [certificatesError, setCertificatesError] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [activeList, setActiveList] = useState("applications");
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [certificateSearch, setCertificateSearch] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [revocationReason, setRevocationReason] = useState("");
  const [revocationError, setRevocationError] = useState("");
  const [revokingCertificate, setRevokingCertificate] = useState(false);
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
          axios.get(baseURL + "/api/v1/admin/applications/pending", config),
          axios.get(baseURL + "/api/v1/admin/applications/approved", config),
          axios.get(baseURL + "/api/v1/admin/applications/rejected", config),
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
      } catch {
        setFetchError("Unable to load applications. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setCertificatesLoading(true);
        setCertificatesError("");
        const token = localStorage.getItem("token");
        const response = await axios.get(baseURL + "/api/v1/certificates/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list =
          response?.data?.data?.certificates ??
          response?.data?.certificates ??
          response?.data?.data?.data ??
          response?.data?.data ??
          response?.data;

        if (!Array.isArray(list)) {
          throw new Error("Unexpected certificates response format.");
        }

        setCertificates(
          list.map((certificate) => ({
            ...(certificate.application || {}),
            ...certificate,
          }))
        );
      } catch (error) {
        console.error("Failed to load certificates:", error);
        setCertificatesError(
          error.response?.data?.message || error.message || "Unable to load certificates."
        );
      } finally {
        setCertificatesLoading(false);
      }
    };

    fetchCertificates();
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
    [item.firstName || "", item.lastName || ""].join(" ").trim() ||
    "Unknown";

  const filteredData = allApplications.filter((item) => {
    const displayName = getDisplayName(item);
    const matchesFilter = filter === "All" || item.status === filter;
    const matchesSearch = displayName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

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

  const filteredCertificates = certificates.filter((certificate) =>
    (certificate.fullNames || certificate.name || "")
      .toLowerCase()
      .includes(certificateSearch.toLowerCase())
  );

  const handleRevokeCertificate = async (event) => {
    event.preventDefault();
    const reason = revocationReason.trim();
    const certificateId = selectedCertificate?._id || selectedCertificate?.id;

    if (!certificateId) {
      setRevocationError("Certificate ID is missing.");
      return;
    }

    if (!reason) {
      setRevocationError("Enter a reason for revoking this certificate.");
      return;
    }

    try {
      setRevokingCertificate(true);
      setRevocationError("");
      const token = localStorage.getItem("token");
      if (!token) {
        setRevocationError("Authentication token not found. Please log in again.");
        return;
      }

      await axios.put(
        baseURL + "/api/v1/certificate/revoke/" + encodeURIComponent(certificateId),
        { revocationReason: reason },
        { headers: { Authorization: "Bearer " + token } }
      );
      setCertificates((currentCertificates) =>
        currentCertificates.map((certificate) =>
          (certificate._id || certificate.id) === certificateId
            ? { ...certificate, isRevoked: true, revocationReason: reason }
            : certificate
        )
      );
      setSelectedCertificate(null);
      setRevocationReason("");
    } catch (error) {
      console.error("Failed to revoke certificate:", error);
      setRevocationError(
        error.response?.data?.message || "Unable to revoke certificate. Please try again."
      );
    } finally {
      setRevokingCertificate(false);
    }
  };

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

        <div className="hidden sm:flex items-center space-x-3 text-sm">
          <div className="text-right">
            <p className="font-semibold">
              {Admin?.firstName || ""} {Admin?.lastName || ""}
            </p>
            <p className="text-gray-400 font-medium text-xs">{Admin?.position}</p>
          </div>
          <LogOutIcon onClick={handleLogout} className="cursor-pointer hover:text-red-500 transition" />
        </div>

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
              <p className="font-semibold">
                {Admin?.firstName || ""} {Admin?.lastName || ""}
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

      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">Approval Dashboard</h1>
      <p className="mb-6 font-medium text-gray-600">Review and manage applications</p>
      {fetchError && <p role="alert" className="mb-4 text-red-600">{fetchError}</p>}



 <button
  onClick={() => navigate("/signatures", { state: { lga: Admin?.lga } })}
  className="mb-6 px-4 py-2 bg-green-700 text-white font-semibold rounded-md shadow hover:bg-green-800 transition"
>
  Signatures
</button>

      <div className="mb-6 flex gap-3 border-b border-gray-200">
        {[
          { id: "applications", label: "Applications" },
          { id: "certificates", label: "Certificates" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveList(tab.id)}
            className={[
              "border-b-2 px-4 py-2 font-semibold",
              activeList === tab.id
                ? "border-green-600 text-green-700"
                : "border-transparent text-gray-600",
            ].join(" ")}
          >
            {tab.label}
            {tab.id === "certificates" && <> ({certificates.length})</>}
          </button>
        ))}
      </div>

      {activeList === "applications" ? (
        <>
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
              className={[
                "py-2 px-4 -mb-px border-b-2 whitespace-nowrap",
                filter === tab
                  ? "border-green-600 font-semibold text-green-600"
                  : "border-transparent text-gray-600",
              ].join(" ")}
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
              className={[
                "flex items-center p-4 space-x-4 hover:bg-gray-50",
                item.status === "Pending" ? "cursor-pointer" : "",
              ].join(" ")}
              onClick={
                item.status === "Pending"
                  ? () => navigate("/approveapplications", { state: { application: item } })
                  : undefined
              }
            >
              <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                {item.passport ? (
                  <img
                    src={
                      item.passport.startsWith("http")
                        ? item.passport
                        : baseURL + "/" + item.passport
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
                className={[
                  "text-xs px-3 py-1 rounded-full flex items-center space-x-1",
                  item.status === "Approved"
                    ? "bg-green-200 text-green-700 font-medium"
                    : item.status === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700",
                ].join(" ")}
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
        </>
      ) : (
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Issued Certificates</h2>
            <div className="relative min-w-[200px] flex-1 sm:max-w-sm">
              <input
                type="search"
                placeholder="Search certificates"
                className="w-full rounded-md border border-gray-400 px-4 py-2"
                value={certificateSearch}
                onChange={(event) => setCertificateSearch(event.target.value)}
              />
            </div>
          </div>

          {certificatesLoading ? (
            <p className="py-10 text-center text-gray-600 animate-pulse">Loading certificates...</p>
          ) : certificatesError ? (
            <p role="alert" className="py-10 text-center text-red-600">{certificatesError}</p>
          ) : filteredCertificates.length === 0 ? (
            <p className="py-10 text-center font-medium text-gray-400">
              {certificates.length ? "No matching certificates." : "No certificates found."}
            </p>
          ) : (
            <div className="divide-y divide-gray-200 rounded-md border border-gray-200 bg-white shadow-sm">
              {filteredCertificates.map((certificate) => {
                const certificateId = certificate._id || certificate.id;
                const certificateLga =
                  certificate.stateOfOrigin?.trim().toLowerCase() === "ogun"
                    ? certificate.lga
                    : certificate.lgaOfResident || certificate.lga;
                return (
                  <button
                    key={certificateId || certificate.certificateRef}
                    type="button"
                    disabled={!certificateId || certificate.isRevoked}
                    onClick={() => {
                      setSelectedCertificate(certificate);
                      setRevocationReason("");
                      setRevocationError("");
                    }}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-gray-50 disabled:cursor-default disabled:hover:bg-white"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">
                        {certificate.fullNames || certificate.name || "Unknown"}
                      </span>
                      <span className="mt-1 block truncate text-sm text-gray-500">
                        {certificateLga || "LGA unavailable"}
                        {certificate.stateOfOrigin && <> · {certificate.stateOfOrigin}</>}
                      </span>
                    </span>
                    <span className="shrink-0 text-right text-xs text-gray-500">
                      {certificate.isRevoked ? (
                        <span className="mb-1 block font-semibold text-red-600">Revoked</span>
                      ) : null}
                      {certificate.updatedAt || certificate.createdAt
                        ? new Date(certificate.updatedAt || certificate.createdAt).toLocaleDateString()
                        : "Date unavailable"}
                      <span className={[
                        "mt-1 block",
                        certificate.isRevoked ? "text-gray-400" : "text-red-700",
                      ].join(" ")}>
                        {certificate.isRevoked ? "Certificate revoked" : "Revoke certificate"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {selectedCertificate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !revokingCertificate) {
              setSelectedCertificate(null);
            }
          }}
        >
          <form
            onSubmit={handleRevokeCertificate}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="revoke-certificate-title"
          >
            <h2 id="revoke-certificate-title" className="text-xl font-bold text-gray-900">
              Revoke certificate
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Revoke the certificate for{" "}
              <span className="font-semibold">
                {selectedCertificate.fullNames || selectedCertificate.name || "this applicant"}
              </span>
              . Add the reason for revocation below.
            </p>
            <label htmlFor="revocation-reason" className="mt-5 block text-sm font-semibold text-gray-700">
              Revocation reason
            </label>
            <textarea
              id="revocation-reason"
              required
              rows={4}
              value={revocationReason}
              onChange={(event) => setRevocationReason(event.target.value)}
              placeholder="Explain why this certificate is being revoked"
              className="mt-2 w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
              disabled={revokingCertificate}
            />
            {revocationError && (
              <p role="alert" className="mt-2 text-sm text-red-600">{revocationError}</p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedCertificate(null)}
                disabled={revokingCertificate}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={revokingCertificate || !revocationReason.trim()}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {revokingCertificate ? "Revoking..." : "Revoke certificate"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Popup */}
      {showFilter && activeList === "applications" && (
        <div className="absolute right-0 top-20 z-50">
          <div className="relative bg-white p-6 rounded-lg w-[90%] sm:w-80 shadow-xl border border-gray-200">
            <button
              onClick={() => setShowFilter(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-4 text-gray-800">Filter by Date</h2>

            <div className="flex flex-col space-y-3">
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

              <label className="text-sm font-medium text-gray-600">Year</label>
              <input
                type="number"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                placeholder="e.g. 2025"
                className="border rounded-md px-3 py-2"
              />

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
