import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-50 p-6">
      <h1 className="text-3xl font-bold text-red-700 mb-3">
        Payment Cancelled ❌
      </h1>
      <p className="text-gray-700 mb-6">
        You cancelled the payment. No amount was deducted.
      </p>

      <button
        onClick={() => navigate("/dashboard-v2")}
        className="bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-black"
      >
        Back to Dashboard
      </button>
    </div>
  );
}