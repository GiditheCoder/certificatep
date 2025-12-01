// import React, { useState } from "react";
// import OfficialSignUp from "./OfficialSignUp";
// import DownloadReport from "./DownloadReport";
// import AdminScreen from "./AdminScreen";
// import DashboardWithFilter from "./DashboardWithFilter";
// import { Menu, X } from "lucide-react";

// const AdminSpec = () => {
//   const [activeView, setActiveView] = useState("dashboard");
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const NavBtn = ({ view, label }) => (
//     <button
//       onClick={() => {
//         setActiveView(view);
//         setSidebarOpen(false);
//       }}
//       className={`p-2 font-semibold rounded hover:bg-green-200 ${
//         activeView === view && "bg-gray-100"
//       }`}
//     >
//       {label}
//     </button>
//   );

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* ===== MOBILE MENU BUTTON ===== */}
//       {/* <button
//         onClick={() => setSidebarOpen(true)}
//         className="md:hidden p-3 text-gray-700"
//       >
//         <Menu size={24} />
//       </button> */}

// <button
//   onClick={() => setSidebarOpen(true)}
//   className="md:hidden p-3 text-gray-700 absolute top-20 left-4"
// >
//   <Menu size={24} />
// </button>

//       {/* ===== DESKTOP SIDEBAR ===== */}
//       <aside className="bg-white shadow-lg w-64 hidden md:flex flex-col">
//         <div className="p-5 border-b text-xl font-bold text-center">
//           Admin Panel
//         </div>

//         <nav className="flex flex-col p-4 gap-3 text-sm">
//           <NavBtn view="dashboard" label="Dashboard" />
//           <NavBtn view="registerOfficial" label="Register Official" />
//           <NavBtn view="downloadReport" label="Download Report" />
//         </nav>
//       </aside>

//       {/* ===== MOBILE DRAWER (LEFT) ===== */}
// {sidebarOpen && (
//   <div className="fixed inset-0 z-[999] flex justify-start">
//     {/* overlay */}
//     <div
//       className="flex-1 "
//       onClick={() => setSidebarOpen(false)}
//     />

//     {/* drawer */}
//     <div className="w-64 bg-white shadow-lg h-full flex flex-col animate-slideInLeft">
//       <div className="p-5 border-b flex justify-between items-center">
//         <span className="font-bold">Admin Panel</span>
//         <X
//           onClick={() => setSidebarOpen(false)}
//           className="cursor-pointer"
//         />
//       </div>

//       <nav className="flex flex-col p-4 gap-3 text-sm">
//         <NavBtn view="dashboard" label="Dashboard" />
//         <NavBtn view="registerOfficial" label="Register Official" />
//         <NavBtn view="downloadReport" label="Download Report" />
//       </nav>
//     </div>
//   </div>
// )}



//       {/* ===== MAIN BODY ===== */}
//       <main className="flex-1 p-3 sm:p-6">
//         {activeView === "dashboard" && (
//           <AdminScreen
//             onOpenFilter={() => setActiveView("dashboardWithFilter")}
//           />
//         )}
//         {activeView === "dashboardWithFilter" && (
//           <DashboardWithFilter onBack={() => setActiveView("dashboard")} />
//         )}
//         {activeView === "registerOfficial" && <OfficialSignUp />}
//         {activeView === "downloadReport" && <DownloadReport />}
//       </main>
//     </div>
//   );
// };

// export default AdminSpec;


import React, { useState } from "react";
import OfficialSignUp from "./OfficialSignUp";
import DownloadReport from "./DownloadReport";
import AdminScreen from "./AdminScreen";
import DashboardWithFilter from "./DashboardWithFilter";
import { Menu, X } from "lucide-react";

const AdminSpec = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const NavBtn = ({ view, label }) => (
    <button
      onClick={() => {
        setActiveView(view);
        setSidebarOpen(false);
      }}
      className={`p-2 font-semibold rounded hover:bg-green-200 ${
        activeView === view && "bg-gray-100"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* ===== MOBILE MENU BUTTON ===== */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden p-3 text-gray-700 absolute top-4 left-4 z-50"
      >
        <Menu size={24} />
      </button>

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="bg-white shadow-lg w-64 hidden md:flex flex-col">
        <div className="p-5 border-b text-xl font-bold text-center">
          Admin Panel
        </div>

        <nav className="flex flex-col p-4 gap-3 text-sm">
          <NavBtn view="dashboard" label="Dashboard" />
          <NavBtn view="registerOfficial" label="Register Official" />
          <NavBtn view="downloadReport" label="Download Report" />
        </nav>
      </aside>

      {/* ===== MOBILE DRAWER (LEFT) ===== */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[999] flex justify-start">
          {/* overlay */}
          <div
            className="flex-1 "
            onClick={() => setSidebarOpen(false)}
          />

          {/* drawer */}
          <div className="w-64 bg-white shadow-lg h-full flex flex-col animate-slideInLeft">
            <div className="p-5 border-b flex justify-between items-center">
              <span className="font-bold">Admin Panel</span>
              <X
                onClick={() => setSidebarOpen(false)}
                className="cursor-pointer"
              />
            </div>

            <nav className="flex flex-col p-4 gap-3 text-sm">
              <NavBtn view="dashboard" label="Dashboard" />
              <NavBtn view="registerOfficial" label="Register Official" />
              <NavBtn view="downloadReport" label="Download Report" />
            </nav>
          </div>
        </div>
      )}

      {/* ===== MAIN BODY ===== */}
      <main className="flex-1 p-3 sm:p-6">
        {activeView === "dashboard" && (
          <AdminScreen
            onOpenFilter={() => setActiveView("dashboardWithFilter")}
          />
        )}
        {activeView === "dashboardWithFilter" && (
          <DashboardWithFilter onBack={() => setActiveView("dashboard")} />
        )}
        {activeView === "registerOfficial" && <OfficialSignUp />}
        {activeView === "downloadReport" && <DownloadReport />}
      </main>
    </div>
  );
};

export default AdminSpec;


