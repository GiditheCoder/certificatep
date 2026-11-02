import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseURL = "https://certapp-aae046f75d3f.herokuapp.com";

const getDetailEntries = (details) => {
  if (!details) return [];

  if (typeof details === "string") {
    try {
      details = JSON.parse(details);
    } catch {
      return [["Details", details]];
    }
  }

  if (typeof details !== "object") return [["Details", details]];

  return Object.entries(details).map(([key, value]) => [
    key,
    typeof value === "object" && value !== null
      ? JSON.stringify(value)
      : String(value ?? "—"),
  ]);
};

const requestAuditLogs = async (token, filters) => {
  const params = new URLSearchParams({
    page: String(filters.page),
    limit: String(filters.limit),
  });

  if (filters.adminId) params.set("adminId", filters.adminId);
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);

  const response = await axios.get(
    `${baseURL}/api/v1/admin/audit-logs?${params.toString()}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data.data;
};

const AuditLogs = () => {
  const token = localStorage.getItem("token");
  const admin = JSON.parse(localStorage.getItem("user") || "null");
  const isSuperAdmin = admin?.role === "super_admin";
  const [adminId, setAdminId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [limit, setLimit] = useState(20);
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [accessError, setAccessError] = useState("");

  useEffect(() => {
    if (!token) {
      setAccessError("You must be logged in as a super admin to view audit logs.");
      return;
    }

    if (!isSuperAdmin) {
      setAccessError("Only super admins can view audit logs.");
      return;
    }

    let active = true;
    setLoading(true);
    requestAuditLogs(token, { page: 1, limit: 20 })
      .then((result) => {
        if (!active) return;
        setLogs(result.data || []);
        setTotal(result.total || 0);
        setPage(result.page || 1);
        setLimit(result.limit || 20);
      })
      .catch((error) => {
        if (!active) return;
        const message =
          error.response?.data?.message || "Failed to load audit logs.";
        setAccessError(message);
        toast.error(message, {
          position: "top-center",
          autoClose: 4000,
          theme: "colored",
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isSuperAdmin, token]);

  const loadLogs = async (requestedPage) => {
    if (!token || !isSuperAdmin) return;

    setLoading(true);
    setAccessError("");
    try {
      const result = await requestAuditLogs(token, {
        adminId: adminId.trim(),
        startDate,
        endDate,
        page: requestedPage,
        limit,
      });
      setLogs(result.data || []);
      setTotal(result.total || 0);
      setPage(result.page || 1);
      setLimit(result.limit || 20);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load audit logs.";
      setAccessError(message);
      toast.error(message, {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date) => {
    if (!date) return { date: "—", time: "" };
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return { date, time: "" };
    return {
      date: parsedDate.toLocaleDateString(),
      time: parsedDate.toLocaleTimeString(),
    };
  };

  const pageCount = Math.max(1, Math.ceil(total / limit));

  return (
    <section className="min-w-0 w-full space-y-5">
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

      <header>
        <h1 className="text-2xl font-bold text-gray-800">Admin Audit Logs</h1>
        <p className="mt-1 text-sm text-gray-600">
          Review admin activity, newest first.
        </p>
      </header>

      {accessError && (
        <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {accessError}
        </p>
      )}

      {isSuperAdmin && (
        <>
          <form
            className="grid gap-3 rounded-lg bg-white p-4 shadow sm:grid-cols-2 lg:grid-cols-5"
            onSubmit={(event) => {
              event.preventDefault();
              loadLogs(1);
            }}
          >
            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              Admin ID
              <input
                value={adminId}
                onChange={(event) => setAdminId(event.target.value)}
                className="rounded border border-gray-300 px-3 py-2"
                placeholder="Filter by admin ID"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              Start date
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="rounded border border-gray-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              End date
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="rounded border border-gray-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              Rows per page
              <select
                value={limit}
                onChange={(event) => setLimit(Number(event.target.value))}
                className="rounded border border-gray-300 px-3 py-2"
              >
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="self-end rounded bg-[#11860F] px-4 py-2 font-semibold text-white hover:bg-[#0c670b] disabled:opacity-60"
            >
              Apply filters
            </button>
          </form>

          <div className="max-w-full overflow-x-auto rounded-lg bg-white shadow">
            <table className="w-full min-w-[900px] table-fixed divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="w-[14%] break-words px-3 py-3 font-semibold">Date</th>
                  <th className="w-[18%] break-words px-3 py-3 font-semibold">Admin</th>
                  <th className="w-[10%] break-words px-3 py-3 font-semibold">Action</th>
                  <th className="w-[12%] break-words px-3 py-3 font-semibold">Target</th>
                  <th className="w-[20%] break-words px-3 py-3 font-semibold">Details</th>
                  <th className="w-[10%] break-words px-3 py-3 font-semibold">IP</th>
                  <th className="w-[16%] break-words px-3 py-3 font-semibold">User agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => {
                  const detailEntries = getDetailEntries(log.details);
                  const createdAt = formatDateTime(log.createdAt);
                  return (
                  <tr key={log._id} className="align-top text-gray-700">
                    <td className="whitespace-nowrap px-3 py-3">
                      <div>{createdAt.date}</div>
                      {createdAt.time && <div>{createdAt.time}</div>}
                    </td>
                    <td className="break-words px-3 py-3">
                      <div className="font-medium">
                        {[log.admin?.firstName, log.admin?.lastName]
                          .filter(Boolean)
                          .join(" ") || "—"}
                      </div>
                      <div>{log.admin?.email || "—"}</div>
                      <div className="text-xs text-gray-500">
                        {[log.admin?.role, log.admin?.lga]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    </td>
                    <td className="break-words px-3 py-3">
                      {log.action || "—"}
                    </td>
                    <td className="break-words px-3 py-3">
                      {log.targetType && (
                        <div className="font-medium">{log.targetType}</div>
                      )}
                      {log.targetId || "—"}
                    </td>
                    <td className="break-words px-3 py-3">
                      {detailEntries.length > 0 ? (
                        <dl className="space-y-1">
                          {detailEntries.map(([key, value]) => (
                            <div key={key} className="break-all">
                              <dt className="inline font-semibold">{key}: </dt>
                              <dd className="inline">{value}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : (
                        <span className="text-gray-500">
                          No details recorded for this action
                        </span>
                      )}
                    </td>
                    <td className="break-all px-3 py-3">
                      {log.ip || "—"}
                    </td>
                    <td className="break-all px-3 py-3">
                      {log.userAgent || "—"}
                    </td>
                  </tr>
                  );
                })}
                {!loading && logs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No audit logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {loading && (
              <p className="p-4 text-center text-sm text-gray-500">
                Loading audit logs...
              </p>
            )}
          </div>

          <footer className="flex items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              {total} total · Page {page} of {pageCount}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => loadLogs(page - 1)}
                disabled={loading || page <= 1}
                className="rounded border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => loadLogs(page + 1)}
                disabled={loading || page >= pageCount}
                className="rounded border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuditLogs;
