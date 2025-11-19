import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import CloseLogo from "../images/close.png";
import MenuLogo from "../images/menu.png";
import StateLogo from "../images/StateLogo.png";

const baseURL = "https://lgacertificate-011d407b356b.herokuapp.com/api/v1";

const Signatures = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedLGA = location.state?.lga;
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
  const Admin = JSON.parse(localStorage.getItem("user") || "{}");

  const handlenavigateScreen = () => {
   navigate('/officialscreen')
  }

  const token = localStorage.getItem("token");

  const Spinner = () => (
    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
  );

  useEffect(() => {
    if (!selectedLGA) return;

    const fetchSignatory = async () => {
      try {
        const res = await axios.get(`${baseURL}/signatory/${selectedLGA}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res?.data?.data;

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
      } catch {
        setRecordExists(false);
      }
    };

    fetchSignatory();
  }, [selectedLGA]);

  const handleSignatureChange = (e) => {
    setSignatureData({ ...signatureData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSignatureData((prev) => ({ ...prev, [field]: file }));
    setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
  };

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("lga", selectedLGA);
    formData.append("chairmanName", signatureData.chairmanName);
    formData.append("secretaryName", signatureData.secretaryName);

    if (signatureData.chairmanSignature instanceof File)
      formData.append("chairmanSignature", signatureData.chairmanSignature);

    if (signatureData.secretarySignature instanceof File)
      formData.append("secretarySignature", signatureData.secretarySignature);

    return formData;
  };

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
    } catch {
      toast.error("Failed to delete");
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

      {/* PAGE TITLE */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        LGA Signatories – <span className="text-green-700">{selectedLGA}</span>
      </h2>

      {/* FORM */}
      <form className="bg-white p-6 rounded-lg shadow-lg space-y-6">

        {/* TEXT INPUTS */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">

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

        {/* SIGNATURE UPLOADS */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">

          {/* Chairman Signature */}
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
                  alt="Chairman Signature"
                />

                <img
                  src={CloseLogo}
                  className="w-6 h-6 absolute -top-2 -right-2 cursor-pointer bg-white rounded-full shadow p-1"
                  onClick={() => {
                    setPreviews((p) => ({ ...p, chairmanSignature: "" }));
                    setSignatureData((p) => ({ ...p, chairmanSignature: "" }));
                    if (chairmanInputRef.current)
                      chairmanInputRef.current.value = "";
                  }}
                />
              </div>
            )}
          </div>

          {/* Secretary Signature */}
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
                  alt="Secretary Signature"
                />

                <img
                  src={CloseLogo}
                  className="w-6 h-6 absolute -top-2 -right-2 cursor-pointer bg-white rounded-full shadow p-1"
                  onClick={() => {
                    setPreviews((p) => ({ ...p, secretarySignature: "" }));
                    setSignatureData((p) => ({ ...p, secretarySignature: "" }));
                    if (secretaryInputRef.current)
                      secretaryInputRef.current.value = "";
                  }}
                />
              </div>
            )}
          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">

          {/* CREATE */}
          <button
            type="button"
            disabled={loading || recordExists}
            onClick={handleCreate}
            className={`${
              recordExists
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
            } text-white px-5 py-2 rounded font-semibold shadow flex items-center justify-center w-full sm:w-auto`}
          >
            {loading ? <><Spinner /> Saving...</> : "Save (Create)"}
          </button>

          {/* UPDATE */}
          <button
            type="button"
            disabled={!recordExists}
            onClick={() =>
              navigate("/update-signatory", { state: { lga: selectedLGA } })
            }
            className={`${
              !recordExists
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-800 hover:bg-green-900"
            } text-white px-5 py-2 rounded font-semibold shadow w-full sm:w-auto`}
          >
            Update
          </button>

          {/* DELETE */}
          <button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-5 py-2 rounded font-semibold shadow flex items-center justify-center w-full sm:w-auto"
          >
            {loading ? <><Spinner /> Deleting...</> : "Delete"}
          </button>

        </div>
          <button
        onClick={handlenavigateScreen}
          className="mt-2  mb-1 text-gray-500 font-medium hover:text-[#11860F] text-sm"
        >
          ← Go Back
        </button>
      </form>
      

      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </div>
  );
};

export default Signatures;


