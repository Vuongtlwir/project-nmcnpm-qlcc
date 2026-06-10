import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/css/user.css";
import Footer from "../components/Footer";

export default function UserLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="user-layout" data-theme="light">
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
          <button type="button" className="action-button" onClick={handleLogout}>
            Đăng xuất
          </button>
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
        <NavLink to="/chat" className={({ isActive }) => isActive ? "active" : ""}>
          Chat với quản trị viên
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
