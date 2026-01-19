import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardV2 from "./pages/DashboardV2";
import Trash from "./pages/Trash";
import SharePage from "./pages/SharePage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard-v2" element={<DashboardV2 />} />
        <Route path="/trash" element={<Trash />} />
        {/* Token wala main route */}
        <Route path="/share/:token" element={<SharePage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
      </Routes>
    </BrowserRouter>
  );
}