

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { toast , ToastContainer } from "react-toastify";
// import { useNavigate, useLocation } from "react-router-dom";
// import CloseLogo from "../images/close.png";

// const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com/api/v1";

// const Signatures = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const selectedLGA = location.state?.lga;
//   const [loading, setLoading] = useState(false);

//   const chairmanInputRef = useRef(null);
//   const secretaryInputRef = useRef(null);

//   const [signatureData, setSignatureData] = useState({
//     chairmanName: "",
//     secretaryName: "",
//     chairmanSignature: "",
//     secretarySignature: "",
//   });

//   const [previews, setPreviews] = useState({
//     chairmanSignature: "",
//     secretarySignature: "",
//   });

//   const [recordExists, setRecordExists] = useState(false); // NEW

//   const token = localStorage.getItem("token");

//   // Fetch existing data
//   useEffect(() => {
//     if (!selectedLGA) return;

//     const fetchSignatory = async () => {
//       try {
//         const res = await axios.get(`${baseURL}/signatory/${selectedLGA}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = res?.data?.data;
//         console.log("Fetched signatory data:", data);

//         if (data) {
//           setRecordExists(true); // record exists
//           setSignatureData({
//             chairmanName: data.chairmanName,
//             secretaryName: data.secretaryName,
//             chairmanSignature: "",
//             secretarySignature: "",
//           });

//           setPreviews({
//             chairmanSignature: data.chairmanSignature || "",
//             secretarySignature: data.secretarySignature || "",
//           });
//         }
//       } catch (err) {
//         setRecordExists(false); // No record found
//       }
//     };

//     fetchSignatory();
//   }, [selectedLGA]);

//   // Input text change
//   const handleSignatureChange = (e) => {
//     setSignatureData({ ...signatureData, [e.target.name]: e.target.value });
//   };

//   // File upload
//   const handleFileChange = (e, field) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setSignatureData((prev) => ({ ...prev, [field]: file }));
//     setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
//   };

//   // Build formData helper
//   const buildFormData = () => {
//     const formData = new FormData();
//     formData.append("lga", selectedLGA);
//     formData.append("chairmanName", signatureData.chairmanName);
//     formData.append("secretaryName", signatureData.secretaryName);

//     if (signatureData.chairmanSignature instanceof File) {
//       formData.append("chairmanSignature", signatureData.chairmanSignature);
//     }
//     if (signatureData.secretarySignature instanceof File) {
//       formData.append("secretarySignature", signatureData.secretarySignature);
//     }

//     return formData;
//   };

//   // CREATE (POST)
//   const handleCreate = async () => {
//     try {
//       setLoading(true);
//       await axios.post(`${baseURL}/signatory`, buildFormData(), {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("Signatory created successfully!");
//       setRecordExists(true);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to create");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // UPDATE (PUT)
//   const handleUpdate = async () => {
//     try {
//       setLoading(true);
//       await axios.put(`${baseURL}/signatory`, buildFormData(), {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("Signatory updated successfully!");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to update");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // DELETE
//   const handleDelete = async () => {
//     if (!selectedLGA) return toast.error("No LGA selected.");

//     try {
//       await axios.delete(`${baseURL}/signatory/${selectedLGA}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success("Signatory deleted successfully!");

//       setRecordExists(false);

//       setSignatureData({
//         chairmanName: "",
//         secretaryName: "",
//         chairmanSignature: "",
//         secretarySignature: "",
//       });

//       setPreviews({ chairmanSignature: "", secretarySignature: "" });

//       if (chairmanInputRef.current) chairmanInputRef.current.value = "";
//       if (secretaryInputRef.current) secretaryInputRef.current.value = "";
//     } catch (err) {
//       toast.error("Failed to delete");
//     }
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">
//         LGA Signatories – <span className="text-green-700">{selectedLGA}</span>
//       </h2>

//       <form className="bg-white p-6 rounded-lg shadow-lg space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="font-medium">Chairman Name</label>
//             <input
//               type="text"
//               name="chairmanName"
//               value={signatureData.chairmanName}
//               onChange={handleSignatureChange}
//               className="border p-3 w-full rounded mt-1"
//               placeholder="Enter chairman name"
//             />
//           </div>

//           <div>
//             <label className="font-medium">Secretary Name</label>
//             <input
//               type="text"
//               name="secretaryName"
//               value={signatureData.secretaryName}
//               onChange={handleSignatureChange}
//               className="border p-3 w-full rounded mt-1"
//               placeholder="Enter secretary name"
//             />
//           </div>
//         </div>

//         {/* Signature Uploads */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Chairman */}
//           <div>
//             <label className="font-medium">Chairman Signature</label>
//             <input
//               ref={chairmanInputRef}
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleFileChange(e, "chairmanSignature")}
//               className="mt-1"
//             />

//             {previews.chairmanSignature && (
//               <div className="relative mt-3 w-fit">
//                 <img
//                   src={previews.chairmanSignature}
//                   className="h-24 rounded border shadow"
//                 />

//                 <img
//                   src={CloseLogo}
//                   alt="Remove"
//                   onClick={() => {
//                     setPreviews((p) => ({ ...p, chairmanSignature: "" }));
//                     setSignatureData((p) => ({ ...p, chairmanSignature: "" }));
//                     if (chairmanInputRef.current)
//                       chairmanInputRef.current.value = "";
//                   }}
//                   className="w-6 h-6 absolute -top-2 -right-2 cursor-pointer bg-white rounded-full shadow p-1"
//                 />
//               </div>
//             )}
//           </div>

//           {/* Secretary */}
//           <div>
//             <label className="font-medium">Secretary Signature</label>
//             <input
//               ref={secretaryInputRef}
//               type="file"
//               accept="image/*"
//               onChange={(e) => handleFileChange(e, "secretarySignature")}
//               className="mt-1"
//             />

//             {previews.secretarySignature && (
//               <div className="relative mt-3 w-fit">
//                 <img
//                   src={previews.secretarySignature}
//                   className="h-24 rounded border shadow"
//                 />

//                 <img
//                   src={CloseLogo}
//                   alt="Remove"
//                   onClick={() => {
//                     setPreviews((p) => ({ ...p, secretarySignature: "" }));
//                     setSignatureData((p) => ({ ...p, secretarySignature: "" }));
//                     if (secretaryInputRef.current)
//                       secretaryInputRef.current.value = "";
//                   }}
//                   className="w-6 h-6 absolute -top-2 -right-2 cursor-pointer bg-white rounded-full shadow p-1"
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex gap-4 pt-4">

//           {/* SAVE (CREATE) */}
//           <button
//             type="button"
//             disabled={loading || recordExists}
//             onClick={handleCreate}
//             className={`${recordExists
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-green-700 hover:bg-green-800"} text-white px-5 py-2 rounded font-semibold shadow`}
//           >
//             Save (Create)
//           </button>

//           {/* UPDATE */}
//           <button
//             type="button"
//             disabled={loading || !recordExists}
//             onClick={handleUpdate}
//             className={`${!recordExists
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-green-700 hover:bg-green-800"} text-white px-5  py-2 rounded font-semibold shadow`}
//           >
//             Update
//           </button>

//           {/* DELETE */}
//           <button
//             type="button"
//             onClick={handleDelete}
//             className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded font-semibold shadow"
//           >
//             Delete
//           </button>
//         </div>
//       </form>
//        <ToastContainer
//               position="top-center"
//               autoClose={3000}
//               hideProgressBar={false}
//               closeOnClick
//               pauseOnHover
//               draggable
//               theme="colored"
//             />
//     </div>
//   );
// };

// export default Signatures;


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast , ToastContainer } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import CloseLogo from "../images/close.png";

const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com/api/v1";

const Signatures = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedLGA = location.state?.lga;
  const [loading, setLoading] = useState(false);

  const chairmanInputRef = useRef(null);
  const secretaryInputRef = useRef(null);

  const [signatureData, setSignatureData] = useState({
    chairmanName: "",
    secretaryName: "",
    chairmanSignature: "",
    secretarySignature: "",
  });

  const [previews, setPreviews] = useState({
    chairmanSignature: "",
    secretarySignature: "",
  });

  const [recordExists, setRecordExists] = useState(false);

  const token = localStorage.getItem("token");

  // 🔄 Spinner Component
  const Spinner = () => (
    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
  );

  // Fetch existing data
  useEffect(() => {
    if (!selectedLGA) return;

    const fetchSignatory = async () => {
      try {
        const res = await axios.get(`${baseURL}/signatory/${selectedLGA}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res?.data?.data;
        console.log("Fetched signatory data:", data);

        if (data) {
          setRecordExists(true);

          setSignatureData({
            chairmanName: data.chairmanName,
            secretaryName: data.secretaryName,
            chairmanSignature: "",
            secretarySignature: "",
          });

          setPreviews({
            chairmanSignature: data.chairmanSignature || "",
            secretarySignature: data.secretarySignature || "",
          });
        }
      } catch (err) {
        setRecordExists(false);
      }
    };

    fetchSignatory();
  }, [selectedLGA]);

  // Inputs
  const handleSignatureChange = (e) => {
    setSignatureData({ ...signatureData, [e.target.name]: e.target.value });
  };

  // File upload
  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSignatureData((prev) => ({ ...prev, [field]: file }));
    setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
  };

  // Build formData
  const buildFormData = () => {
    const formData = new FormData();
    formData.append("lga", selectedLGA);
    formData.append("chairmanName", signatureData.chairmanName);
    formData.append("secretaryName", signatureData.secretaryName);

    if (signatureData.chairmanSignature instanceof File) {
      formData.append("chairmanSignature", signatureData.chairmanSignature);
    }
    if (signatureData.secretarySignature instanceof File) {
      formData.append("secretarySignature", signatureData.secretarySignature);
    }

    return formData;
  };

  // CREATE
  const handleCreate = async () => {
    try {
      setLoading(true);
      await axios.post(`${baseURL}/signatory`, buildFormData(), {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Signatory created successfully!");
      setRecordExists(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  // UPDATE
 const handleUpdate = async () => {
  try {
    setLoading(true);
    await axios.put(
      `${baseURL}/signatory/${selectedLGA}`,
      buildFormData(),
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success("Signatory updated successfully!");
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to update");
  } finally {
    setLoading(false);
  }
};


  // DELETE
  const handleDelete = async () => {
    if (!selectedLGA) return toast.error("No LGA selected.");

    try {
      setLoading(true);

      await axios.delete(`${baseURL}/signatory/${selectedLGA}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Signatory deleted successfully!");

      setRecordExists(false);

      setSignatureData({
        chairmanName: "",
        secretaryName: "",
        chairmanSignature: "",
        secretarySignature: "",
      });

      setPreviews({ chairmanSignature: "", secretarySignature: "" });

      if (chairmanInputRef.current) chairmanInputRef.current.value = "";
      if (secretaryInputRef.current) secretaryInputRef.current.value = "";
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        LGA Signatories – <span className="text-green-700">{selectedLGA}</span>
      </h2>

      <form className="bg-white p-6 rounded-lg shadow-lg space-y-6">

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-medium">Chairman Name</label>
            <input
              type="text"
              name="chairmanName"
              value={signatureData.chairmanName}
              onChange={handleSignatureChange}
              className="border p-3 w-full rounded mt-1"
              placeholder="Enter chairman name"
            />
          </div>

          <div>
            <label className="font-medium">Secretary Name</label>
            <input
              type="text"
              name="secretaryName"
              value={signatureData.secretaryName}
              onChange={handleSignatureChange}
              className="border p-3 w-full rounded mt-1"
              placeholder="Enter secretary name"
            />
          </div>
        </div>

        {/* Signature Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chairman */}
          <div>
            <label className="font-medium">Chairman Signature</label>
            <input
              ref={chairmanInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "chairmanSignature")}
              className="mt-1"
            />

            {previews.chairmanSignature && (
              <div className="relative mt-3 w-fit">
                <img
                  src={previews.chairmanSignature}
                  className="h-24 rounded border shadow"
                />

                <img
                  src={CloseLogo}
                  alt="Remove"
                  onClick={() => {
                    setPreviews((p) => ({ ...p, chairmanSignature: "" }));
                    setSignatureData((p) => ({ ...p, chairmanSignature: "" }));
                    if (chairmanInputRef.current)
                      chairmanInputRef.current.value = "";
                  }}
                  className="w-6 h-6 absolute -top-2 -right-2 cursor-pointer bg-white rounded-full shadow p-1"
                />
              </div>
            )}
          </div>

          {/* Secretary */}
          <div>
            <label className="font-medium">Secretary Signature</label>
            <input
              ref={secretaryInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "secretarySignature")}
              className="mt-1"
            />

            {previews.secretarySignature && (
              <div className="relative mt-3 w-fit">
                <img
                  src={previews.secretarySignature}
                  className="h-24 rounded border shadow"
                />

                <img
                  src={CloseLogo}
                  alt="Remove"
                  onClick={() => {
                    setPreviews((p) => ({ ...p, secretarySignature: "" }));
                    setSignatureData((p) => ({ ...p, secretarySignature: "" }));
                    if (secretaryInputRef.current)
                      secretaryInputRef.current.value = "";
                  }}
                  className="w-6 h-6 absolute -top-2 -right-2 cursor-pointer bg-white rounded-full shadow p-1"
                />
              </div>
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 pt-4">

          {/* SAVE (CREATE) */}
          <button
            type="button"
            disabled={loading || recordExists}
            onClick={handleCreate}
            className={`${recordExists
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"} 
              text-white px-5 py-2 rounded font-semibold shadow flex items-center justify-center min-w-[130px]`}
          >
            {loading ? (
              <>
                <Spinner /> Saving...
              </>
            ) : (
              "Save (Create)"
            )}
          </button>

          {/* UPDATE */}
          <button
            type="button"
            disabled={loading || !recordExists}
            onClick={handleUpdate}
            className={`${!recordExists
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-800 hover:bg-green-900"} 
              text-white px-5 py-2 rounded font-semibold shadow flex items-center justify-center min-w-[130px]`}
          >
            {loading ? (
              <>
                <Spinner /> Updating...
              </>
            ) : (
              "Update"
            )}
          </button>

          {/* DELETE */}
          <button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-5 py-2 rounded font-semibold shadow flex items-center justify-center min-w-[130px]"
          >
            {loading ? (
              <>
                <Spinner /> Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>

        </div>
      </form>

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

export default Signatures;

