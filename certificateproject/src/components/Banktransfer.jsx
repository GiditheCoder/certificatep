import React, { useEffect, useState } from "react";
import { ArrowLeft, Clock3, Landmark } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getExpiryTimestamp = (value) => {
  if (typeof value !== "string" || !value.trim()) return null;

  const normalized = value.trim().replace(/\s+/g, " ");
  const dateTimeMatch = normalized.match(
    /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/
  );
  const timeMatch = normalized.match(/^(\d{2}):(\d{2}):(\d{2})$/);

  let expiry;
  if (dateTimeMatch) {
    const [, year, month, day, hour, minute, second] = dateTimeMatch;
    expiry = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    );
  } else if (timeMatch) {
    const [, hour, minute, second] = timeMatch;
    const now = new Date();
    expiry = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      Number(hour),
      Number(minute),
      Number(second)
    );
  } else {
    expiry = new Date(normalized);
  }

  return Number.isNaN(expiry.getTime()) ? null : expiry.getTime();
};

const formatCountdown = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [hours, minutes, remainingSeconds]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
};

const Banktransfer = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const transferDetails = state?.transferDetails;
  const isVerificationRequest = state?.flow === "certificate-verification";
  const expiryTimestamp = getExpiryTimestamp(transferDetails?.expiryDateTime);
  const [secondsRemaining, setSecondsRemaining] = useState(() =>
    expiryTimestamp === null
      ? null
      : Math.max(0, Math.floor((expiryTimestamp - Date.now()) / 1000))
  );
  const [checkingPayment, setCheckingPayment] = useState(false);

  useEffect(() => {
    if (expiryTimestamp === null) {
      setSecondsRemaining(null);
      return undefined;
    }

    const updateCountdown = () => {
      setSecondsRemaining(
        Math.max(0, Math.floor((expiryTimestamp - Date.now()) / 1000))
      );
    };

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(intervalId);
  }, [expiryTimestamp]);

  const handlePaymentConfirmation = async () => {
    const sourceId = transferDetails?.sourceId ?? transferDetails?.applicationId;
    if (!sourceId) {
      toast.error("The application reference is missing. Please return and try again.");
      return;
    }

    setCheckingPayment(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://certapp-aae046f75d3f.herokuapp.com/api/v1/partner/transaction/${encodeURIComponent(sourceId)}`,
        {
          params: { source: isVerificationRequest ? "certificate" : "application" },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const transaction = response.data?.data ?? response.data;
      const status = String(
        transaction?.status ??
          transaction?.transactionStatus ??
          transaction?.paymentStatus ??
          ""
      ).toLowerCase();
      const message = response.data?.message ?? "";
      const isCompleted =
        ["completed", "successful", "success", "paid"].includes(status) ||
        /transaction\s+completed|payment\s+successful/i.test(message);

      if (isCompleted) {
        toast.success(message || "Your payment has been confirmed.");
      } else {
        toast.error("Transfer not complete.");
      }
    } catch (error) {
      const message = error.response?.data?.message;
      toast.error(
        error.response?.status === 404 ||
          (message &&
            /transaction\s+not\s+completed|payment\s+not\s+completed/i.test(message))
          ? "Transfer not complete."
          : message || "We couldn’t check your payment status. Please try again."
      );
    } finally {
      setCheckingPayment(false);
    }
  };

  if (
    !transferDetails?.accountName ||
    !transferDetails?.accountNumber
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <section className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
          <h1 className="mb-3 text-2xl font-bold text-gray-900">
            Bank transfer details unavailable
          </h1>
          <p className="mb-6 text-gray-600">
            Submit your application using bank transfer to generate an account.
          </p>
          <button
            type="button"
            onClick={() => navigate("/application")}
            className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-green-800"
          >
            <ArrowLeft size={18} />
            Return to application
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <section className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-lg sm:p-10">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-4 text-green-700">
            <Landmark size={32} aria-hidden="true" />
          </div>
        </div>
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          Complete your bank transfer
        </h1>
        <p className="mb-8 text-center text-gray-600">
          {isVerificationRequest
            ? "Transfer to the temporary account below to receive your verification code."
            : "Transfer to the temporary account below to complete your application."}
        </p>

        <dl className="space-y-5 rounded-xl border border-green-200 bg-green-50 p-5 text-sm text-green-950 sm:p-6">
          {transferDetails.applicationId && (
            <div>
              <dt className="mb-1 text-gray-600">Application reference</dt>
              <dd className="break-all font-semibold">
                {transferDetails.applicationId}
              </dd>
            </div>
          )}
          <div>
            <dt className="mb-1 text-gray-600">Account name</dt>
            <dd className="break-words font-semibold">
              {transferDetails.accountName}
            </dd>
          </div>
          <div>
            <dt className="mb-1 text-gray-600">Account number</dt>
            <dd className="select-all text-2xl font-bold tracking-wide">
              {transferDetails.accountNumber}
            </dd>
          </div>
          {transferDetails.expiryDateTime && (
            <div className="flex items-start gap-2 border-t border-green-200 pt-4">
              <Clock3
                size={18}
                className="mt-0.5 shrink-0 text-green-700"
                aria-hidden="true"
              />
              <div>
                <dt className="text-gray-600">Account expires</dt>
                <dd className="font-semibold">
                  {transferDetails.expiryDateTime}
                </dd>
              </div>
            </div>
          )}
          {secondsRemaining !== null && (
            <div className="border-t border-green-200 pt-4 text-center">
              <dt className="mb-1 text-gray-600">Time remaining</dt>
              <dd
                role="timer"
                aria-label={
                  secondsRemaining > 0
                    ? `${formatCountdown(secondsRemaining)} remaining`
                    : "Account expired"
                }
                className={`font-mono text-3xl font-bold ${
                  secondsRemaining > 0 ? "text-green-800" : "text-red-700"
                }`}
              >
                {secondsRemaining > 0
                  ? formatCountdown(secondsRemaining)
                  : "Expired"}
              </dd>
            </div>
          )}
        </dl>

        <p className="mt-5 text-center text-sm text-gray-600">
          {secondsRemaining === 0
            ? "This temporary account has expired."
            : isVerificationRequest
              ? "Your verification code will be sent to your email after your transfer is confirmed. Complete the transfer before the account expires."
              : "Complete your transfer before the account expires."}
        </p>
        <div className="mt-8">
          <h2 className="mb-4 text-center text-lg font-semibold text-gray-900">
            Have you made your transfer?
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handlePaymentConfirmation}
              disabled={checkingPayment}
              className="w-full rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkingPayment ? "Checking payment..." : "Yes, I have"}
            </button>
            <button
              type="button"
              onClick={() =>
                toast.info(
                  "Please complete the transfer using the account details above. You can confirm it after the transfer is made."
                )
              }
              className="w-full rounded-lg border border-green-700 px-5 py-3 font-semibold text-green-800 transition-colors hover:bg-green-50"
            >
              No, I haven’t
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mt-5 w-full rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-green-800"
        >
          Go to Dashboard
        </button>
        <ToastContainer position="top-center" theme="colored" />
      </section>
    </main>
  );
};

export default Banktransfer;
