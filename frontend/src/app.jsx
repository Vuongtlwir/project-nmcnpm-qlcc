import { useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import UserHome from "./pages/user/UserHome";
import FeeList from "./pages/fees/FeeList";
import Payment from "./pages/fees/Payment";
import PaymentHistory from "./pages/fees/PaymentHistory";
import ComplaintList from "./pages/complaints/ComplaintList";
import ComplainDetail from "./pages/complaints/ComplainDetail";
import ResidentDetail from "./pages/residents/ResidentDetail";
import ResidentList from "./pages/residents/ResidentList";
import AddResident from "./pages/residents/AddResident";
import EditResident from "./pages/residents/EditResident";
import ApartmentsList from "./pages/apartments/ApartmentsList";
import AddApartments from "./pages/apartments/AddApartments";
import ApartmentDetail from "./pages/apartments/ApartmentDetail";
import ResidencyList from "./pages/residency/ResidencyList";
import Dashboard from "./pages/dashboard/Dashboard";
import AdminFeeManagement from "./pages/admin/AdminFeeManagement";
import AdminChat from "./pages/admin/AdminChat";
import AdminRequestManagement from "./pages/admin/AdminRequestManagement";
import NotificationList from "./pages/notifications/NotificationList";
import UserChat from "./pages/user/UserChat";
import UserServices from "./pages/user/UserServices";
import AdminServiceManagement from "./pages/admin/AdminServiceManagement";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

function App() {
  const { user } = useAuth();

  const RequireAuth = useMemo(
    () => ({ children }) => {
      if (!user) {
        return <Navigate to="/login" replace />;
      }
      if (user.role === "admin") {
        return <Navigate to="/admin" replace />;
      }
      return children;
    },
    [user]
  );

  const RequireAdmin = useMemo(
    () => ({ children }) => {
      if (!user || user.role !== "admin") {
        return <Navigate to="/login" replace />;
      }
      return children;
    },
    [user]
  );

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        <Route index element={<Dashboard />} />
        <Route path="bills" element={<AdminFeeManagement />} />
        <Route path="residents" element={<ResidentList />} />
        <Route path="residents/add" element={<AddResident />} />
        <Route path="residents/edit/:id" element={<EditResident />} />
        <Route path="residents/detail/:id" element={<ResidentDetail />} />
        <Route path="apartments" element={<ApartmentsList />} />
        <Route path="apartments/add" element={<AddApartments />} />
        <Route path="apartments/:id" element={<ApartmentDetail />} />
        <Route path="residency" element={<ResidencyList />} />
        <Route path="requests" element={<AdminRequestManagement />} />
        <Route path="notifications" element={<NotificationList />} />
        <Route path="services" element={<AdminServiceManagement />} />
        <Route path="chat" element={<AdminChat />} />
      </Route>

      <Route path="/" element={<RequireAuth><UserLayout /></RequireAuth>}>
        <Route index element={<UserHome />} />
        <Route path="fees" element={<FeeList />} />
        <Route path="payments" element={<Payment />} />
        <Route path="payment-history" element={<PaymentHistory />} />
        <Route path="services" element={<UserServices />} />
        <Route path="complaints" element={<ComplaintList />} />
        <Route path="complaints/:id" element={<ComplainDetail />} />
        <Route path="profile" element={<ResidentDetail />} />
        <Route path="chat" element={<UserChat />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
