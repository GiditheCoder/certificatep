import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import CloseLogo from "../images/close.png";
import MenuLogo from "../images/menu.png";
import StateLogo from "../images/StateLogo.png";

const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com/api/v1";

const UpdateSignatory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedLGA = location.state?.lga;
  const token = localStorage.getItem("token");

  const chairmanRef = useRef();
  const secretaryRef = useRef();

   const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
   const Admin = JSON.parse(localStorage.getItem("user") || "{}");

  const [data, setData] = useState({
    chairmanName: "",
    secretaryName: "",
    chairmanSignature: "",
    secretarySignature: "",
  });

  const [previews, setPreviews] = useState({
    chairmanSignature: "",
    secretarySignature: "",
  });

   const handleSignaturesScreen = () => {
   navigate('/signatures')
  }

  // Fetch existing data
  useEffect(() => {
    if (!selectedLGA) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseURL}/signatory/${selectedLGA}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const d = res.data.data;

        setData({
          chairmanName: d.chairmanName,
          secretaryName: d.secretaryName,
          chairmanSignature: "",
          secretarySignature: "",
        });

        setPreviews({
          chairmanSignature: d.chairmanSignature || "",
          secretarySignature: d.secretarySignature || "",
        });
      } catch (err) {
        toast.error("Failed to load signatory record");
      }
    };

    fetchData();
  }, [selectedLGA]);

  // Handle text input change
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setData((prev) => ({ ...prev, [field]: file }));
    setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
  };

  // Build formData
  const buildFormData = () => {
    const fd = new FormData();

    fd.append("lga", selectedLGA);
    fd.append("chairmanName", data.chairmanName);
    fd.append("secretaryName", data.secretaryName);

    if (data.chairmanSignature instanceof File)
      fd.append("chairmanSignature", data.chairmanSignature);

    if (data.secretarySignature instanceof File)
      fd.append("secretarySignature", data.secretarySignature);

    return fd;
  };

  const handleUpdate = async () => {
    if (!selectedLGA) {
      toast.error("LGA is missing!");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      
      // Explicitly append lga first
      formData.append("lga", selectedLGA);
      formData.append("chairmanName", data.chairmanName || "");
      formData.append("secretaryName", data.secretaryName || "");

      if (data.chairmanSignature instanceof File) {
        formData.append("chairmanSignature", data.chairmanSignature);
      }

      if (data.secretarySignature instanceof File) {
        formData.append("secretarySignature", data.secretarySignature);
      }

      console.log("Sending update with LGA:", selectedLGA);
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // Try with explicit Content-Type header removal (let axios set it)
      await axios({
        method: 'put',
        url: `${baseURL}/signatory`,
        data: formData,
        headers: { 
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - let axios handle it
        },
      });

      toast.success("Signatory updated!");
      setTimeout(() => navigate(-1), 1000);
    } catch (err) {
      console.error("Update error details:", err.response);
      console.error("Update error data:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-10 py-6 font-sans text-gray-900 relative">

    {/* HEADER */}
      <header className="flex justify-between items-center border-b border-gray-200 pb-3 mb-6">
        
        <div className="flex items-center space-x-2">
          <img src={StateLogo} alt="State Logo" className="w-8 h-8 rounded-full" />
          <span className="text-base sm:text-lg font-semibold text-gray-700">
            Ogun State Government
          </span>
        </div>

        {/* Desktop User */}
        <div className="hidden sm:flex items-center space-x-3 text-sm">
          <div className="text-right">
            <p className="font-semibold">{`${Admin?.firstName || ""} ${Admin?.lastName || ""}`}</p>
            <p className="text-gray-400 font-medium text-xs">{Admin?.position}</p>
          </div>
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

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="sm:hidden absolute top-16 right-4 bg-white shadow-lg border rounded-md p-4 z-50 w-64 max-w-[90vw]">
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold">User Info</p>
            <img
              src={CloseLogo}
              alt="Close"
              className="w-5 h-5 cursor-pointer"
              onClick={() => setMenuOpen(false)}
            />
          </div>

          <div className="text-sm">
            <p className="font-semibold">{`${Admin?.firstName || ""} ${Admin?.lastName || ""}`}</p>
            <p className="text-gray-400 font-medium text-xs">{Admin?.position}</p>
          </div>
        </div>
      )}









      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Update Signatory – <span className="text-green-700">{selectedLGA}</span>
      </h2>

      <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">

        {/* LGA FIELD */}
        <div>
          <label className="font-medium">LGA</label>
          <input
            type="text"
            value={selectedLGA}
            readOnly
            className="border p-3 w-full rounded mt-1 bg-gray-100"
          />
        </div>

        {/* Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-medium">Chairman Name</label>
            <input
              type="text"
              name="chairmanName"
              value={data.chairmanName}
              onChange={handleChange}
              className="border p-3 w-full rounded mt-1"
              placeholder="Enter chairman name"
            />
          </div>

          <div>
            <label className="font-medium">Secretary Name</label>
            <input
              type="text"
              name="secretaryName"
              value={data.secretaryName}
              onChange={handleChange}
              className="border p-3 w-full rounded mt-1"
              placeholder="Enter secretary name"
            />
          </div>
        </div>

        {/* FILE UPLOADS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chairman Signature */}
          <div>
            <label className="font-medium">Chairman Signature</label>
            <input
              ref={chairmanRef}
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
                  alt="Chairman signature preview"
                />

                <img
                  src={CloseLogo}
                  alt="Remove"
                  onClick={() => {
                    setPreviews((p) => ({ ...p, chairmanSignature: "" }));
                    setData((p) => ({ ...p, chairmanSignature: "" }));
                    if (chairmanRef.current) chairmanRef.current.value = "";
                  }}
                  className="w-6 h-6 absolute -top-2 -right-2 cursor-pointer bg-white rounded-full shadow p-1"
                />
              </div>
            )}
          </div>

          {/* Secretary Signature */}
          <div>
            <label className="font-medium">Secretary Signature</label>
            <input
              ref={secretaryRef}
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
                  alt="Secretary signature preview"
                />

                <img
                  src={CloseLogo}
                  alt="Remove"
                  onClick={() => {
                    setPreviews((p) => ({ ...p, secretarySignature: "" }));
                    setData((p) => ({ ...p, secretarySignature: "" }));
                    if (secretaryRef.current) secretaryRef.current.value = "";
                  }}
                  className="w-6 h-6 absolute -top-2 -right-2 cursor-pointer bg-white rounded-full shadow p-1"
                />
              </div>
            )}
          </div>
        </div>

        {/* UPDATE BUTTON */}
        <div>
          <button
            type="button"
            disabled={loading}
            onClick={handleUpdate}
            className="bg-green-800 hover:bg-green-900 disabled:bg-gray-400 text-white px-5 py-2 rounded font-semibold shadow min-w-[130px]"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>

           <button
          onClick={handleSignaturesScreen}
          className="mt-2  mb-1 text-gray-500 font-medium hover:text-[#11860F] text-sm"
        >
          ← Go Back
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default UpdateSignatory;