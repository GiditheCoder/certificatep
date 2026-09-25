import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle2, CircleAlert, LoaderCircle, ShieldCheck } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const baseURL = "https://certapp-aae046f75d3f.herokuapp.com";

const CertValidation = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [certificate, setCertificate] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hash = searchParams.get("hash");

    if (!hash) {
      setStatus("error");
      setMessage("No certificate hash was provided.");
      return;
    }

    const validateCertificate = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/v1/certificate/verify-hash/${encodeURIComponent(hash)}`
        );
        const data = response.data?.data ?? response.data;
        const verifiedCertificate = data?.certificate ?? data;

        setCertificate(verifiedCertificate);
        setStatus("success");
      } catch (error) {
        console.error("Certificate validation failed:", error.response?.data || error.message);
        setStatus("error");
        setMessage(error.response?.data?.message || "This certificate could not be verified.");
      }
    };

    validateCertificate();
  }, [searchParams]);

  const application = certificate?.application ?? certificate;

  return (
    <main className="min-h-screen bg-[#edf3ef] flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          {status === "loading" && <LoaderCircle className="h-8 w-8 animate-spin text-green-700" />}
          {status === "success" && <CheckCircle2 className="h-8 w-8 text-green-700" />}
          {status === "error" && <CircleAlert className="h-8 w-8 text-red-600" />}
        </div>

        {status === "loading" && (
          <>
            <h1 className="text-2xl font-bold text-gray-900">Verifying certificate</h1>
            <p className="mt-2 text-gray-600">Please wait while we confirm this certificate.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mb-3 flex items-center justify-center gap-2 text-green-700">
              <ShieldCheck className="h-5 w-5" />
              <span className="font-semibold">Certificate verified</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Valid Certificate</h1>
            <p className="mt-3 text-gray-600">
              This certificate has been successfully verified by Ogun State Government.
            </p>
            {application?.fullNames && (
              <p className="mt-5 border-t border-gray-200 pt-4 font-semibold text-gray-900">
                {application.fullNames}
              </p>
            )}
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-gray-900">Verification failed</h1>
            <p className="mt-3 text-gray-600">{message}</p>
          </>
        )}
      </section>
    </main>
  );
};

export default CertValidation;
