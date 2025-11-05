import React from "react";
import { useLocation, useParams } from "react-router-dom";

const CertificateConfirmation = () => {
  const { ref } = useParams();
  const { state } = useLocation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg">
        <h1 className="text-2xl font-bold text-green-600 mb-4">✅ Certificate Verified</h1>
        <p className="text-gray-700 text-lg mb-2">
          {state?.message ||
            "This is to certify that this certificate is from the Ogun State Local Government."}
        </p>
        <p className="text-gray-500 mt-4">
          <strong>Reference ID:</strong> {ref}
        </p>
      </div>
    </div>
  );
};

export default CertificateConfirmation;
