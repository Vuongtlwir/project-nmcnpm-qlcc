import { NavLink, Outlet } from "react-router-dom";
import "../assets/css/user.css";
import Footer from "../components/Footer";

export default function UserLayout({ children }) {
  return (
    <div className="user-layout">
      <header className="user-header">
        <div className="brand-block">
          <div className="brand-badge">USER</div>
          <div>
            <h1>Apartment Manager</h1>
            <p>Giao diện cư dân chuyên nghiệp, trực quan và dễ sử dụng.</p>
          </div>
        </div>

        <div className="header-actions">
          <a href="#" className="action-link">Thông báo</a>
          <a href="#" className="action-button">Hỗ trợ</a>
        </div>
      </header>

      <div className="user-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
          Trang chủ
        </NavLink>
        <NavLink to="/fees" className={({ isActive }) => isActive ? "active" : ""}>
          Hóa đơn
        </NavLink>
        <NavLink to="/complaints" className={({ isActive }) => isActive ? "active" : ""}>
          Phản ánh
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
          Hồ sơ
        </NavLink>
      </div>

      <main className="user-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
