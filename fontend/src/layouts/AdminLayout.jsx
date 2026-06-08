import "../assets/css/admin.css";
import "../assets/css/user.css";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-main">
        <Navbar />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
