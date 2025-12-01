import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// const DashboardWithFilter = ({ onBack , onApply }) => {
//   const [lgas, setLgas] = useState([]);
//   const [selectedLga, setSelectedLga] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchOgunLgas = async () => {
//       try {
//         const res = await axios.get(
//           "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/lgas?state=Ogun"
//         );

//         const lgaArray = res.data?.data?.lgas;
//         if (res.data.success && Array.isArray(lgaArray)) {
//           setLgas(lgaArray);
//         } else {
//           toast.error("Failed to load Ogun LGAs");
//         }
//       } catch (error) {
//         toast.error("Could not fetch LGAs. Try again.");
//       }
//     };

//     fetchOgunLgas();
//   }, []);

// // const handleApply = async () => {
// //   if (!selectedLga) {
// //     toast.error("Select an LGA");
// //     return;
// //   }

// //   try {
// //     setLoading(true);

// //     const encoded = encodeURIComponent(selectedLga);
// //     const token = localStorage.getItem("token"); // wherever you stored it

// //     const res = await axios.get(
// //       `https://lgacertificate-011d407b356b.herokuapp.com/api/v1/admin/summary/application?lga=${encoded}`,
// //       {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       }
// //     );

// //     console.log("SUMMARY RESULT:", res.data);

// //     if (res.data.success) {
// //       toast.success("Summary data retrieved!");
// //     } else {
// //       toast.error("Unable to fetch summary data");
// //     }

// //   } catch (error) {
// //     toast.error(error.response?.data?.message || "Error while fetching summary");
// //     console.log(error);
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// const handleApply = async () => {
//   if (!selectedLga) {
//     toast.error("Select an LGA");
//     return;
//   }

//   try {
//     setLoading(true);

//     const encoded = encodeURIComponent(selectedLga);
//     const token = localStorage.getItem("token");

//     const res = await axios.get(
//       `https://lgacertificate-011d407b356b.herokuapp.com/api/v1/admin/summary/application?lga=${encoded}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     console.log("SUMMARY RESULT:", res.data);

//     if (res.data.success) {
//       toast.success("Summary data retrieved!");
//       onApply(res.data.data.summary); // <-- IMPORT
//       // ANT
//     }

//   } catch (error) {
//     toast.error(error.response?.data?.message || "Error while fetching summary");
//     console.log(error);
//   } finally {
//     setLoading(false);
//   }
// };



//   return (
//     <div className="relative p-4 ">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Filter</h1>
//         <button
//           className="border px-4 py-2 rounded hover:bg-gray-200"
//           onClick={onBack}
//         >
//           Back
//         </button>
//       </div>

//       {/* Filter Box */}
//       <div className="bg-white p-4 rounded shadow">
//         <label className="block font-medium mb-1 text-sm">
//           Local Government Area (LGA)
//         </label>

//         <select
//           className="border px-4 py-2 rounded w-full"
//           value={selectedLga}
//           onChange={e => setSelectedLga(e.target.value)}
//         >
//           <option value="">Select LGA</option>
//           {lgas.map((lga, idx) => (
//             <option key={idx} value={lga}>
//               {lga}
//             </option>
//           ))}
//         </select>

//         <button
//           onClick={handleApply}
//           className="mt-3 bg-green-700 text-white w-full py-2 rounded hover:bg-green-800"
//           disabled={loading}
//         >
//           {loading ? "Loading..." : "Apply Filter"}
//         </button>
//       </div>
//     </div>
//   );
// };

const DashboardWithFilter = ({ onBack, onApply }) => {
  const [lgas, setLgas] = useState([]);
  const [selectedLga, setSelectedLga] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOgunLgas = async () => {
      try {
        const res = await axios.get(
          "https://lgacertificate-011d407b356b.herokuapp.com/api/v1/lgas?state=Ogun"
        );

        const lgaArray = res.data?.data?.lgas;
        if (res.data.success && Array.isArray(lgaArray)) {
          setLgas(lgaArray);
        } else {
          toast.error("Failed to load Ogun LGAs");
        }
      } catch (error) {
        toast.error("Could not fetch LGAs. Try again.");
      }
    };
    fetchOgunLgas();
  }, []);

  const handleApply = async () => {
    if (!selectedLga) {
      toast.error("Select an LGA");
      return;
    }

    try {
      setLoading(true);

      const encoded = encodeURIComponent(selectedLga);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `https://lgacertificate-011d407b356b.herokuapp.com/api/v1/admin/summary/application?lga=${encoded}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success("Summary data retrieved!");
        onApply(res.data.data.summary);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error while fetching summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-transparent bg-opacity-50"
        onClick={onBack}
      ></div>

      {/* Side Modal */}
      <div className="relative ml-auto w-80 max-w-full h-full bg-white p-6 shadow-lg transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Filter</h1>
          <button
            className="border px-3 py-1 rounded hover:bg-gray-200"
            onClick={onBack}
          >
            Close
          </button>
        </div>

        {/* Filter Box */}
        <div>
          <label className="block font-medium mb-1 text-sm">
            Local Government Area (LGA)
          </label>
          <select
            className="border px-4 py-2 rounded w-full"
            value={selectedLga}
            onChange={(e) => setSelectedLga(e.target.value)}
          >
            <option value="">Select LGA</option>
            {lgas.map((lga, idx) => (
              <option key={idx} value={lga}>
                {lga}
              </option>
            ))}
          </select>

          <button
            onClick={handleApply}
            className="mt-3 bg-green-700 text-white w-full py-2 rounded hover:bg-green-800"
            disabled={loading}
          >
            {loading ? "Loading..." : "Apply Filter"}
          </button>
        </div>
      </div>
    </div>
  );
};


export default DashboardWithFilter;
