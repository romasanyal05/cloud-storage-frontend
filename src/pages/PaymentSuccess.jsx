import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-3">
        Payment Successful ✅
      </h1>
      <p className="text-gray-700 mb-6">
        Thank you! Your one-time payment is completed.
      </p>

      <button
        onClick={() => navigate("/dashboard-v2")}
        className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
      >
        Go to Dashboard
      </button>
    </div>
  );
}