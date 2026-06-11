import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/admin": "Dashboard",
  "/admin/bills": "Quản lý hóa đơn",
  "/admin/residents": "Danh sách cư dân",
  "/admin/residents/add": "Thêm cư dân",
  "/admin/apartments": "Quản lý căn hộ",
  "/admin/apartments/add": "Thêm căn hộ",
  "/admin/requests": "Quản lý yêu cầu",
  "/admin/notifications": "Bảng tin tòa nhà",
  "/admin/chat": "Chat với cư dân",
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const pageTitle = Object.entries(pageTitles).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] || "Dashboard";

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-breadcrumb">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>/</span>
          <span>{pageTitle}</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Tìm kiếm..." />
        </div>

        <div className="user-badge">
          <div className="user-avatar">
            {user?.username?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.username || "Admin"}</span>
            <span className="user-role">{user?.role || "Administrator"}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={logout}>
          Đăng xuất
        </button>
      </div>
    </nav>
  );
}
