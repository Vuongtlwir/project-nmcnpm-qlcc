import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useUnreadMessages from "../hooks/useUnreadMessages";
import "../assets/css/user.css";
import Footer from "../components/Footer";

export default function UserLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const unreadCount = useUnreadMessages();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.full_name
    ? user.full_name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : user?.username?.slice(0, 2).toUpperCase() || "U";

  const navItems = [
    { to: "/", label: "Trang chủ", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { to: "/services", label: "Dịch vụ", icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" },
    { to: "/fees", label: "Hóa đơn", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { to: "/complaints", label: "Phản ánh", icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { to: "/chat", label: "Tin nhắn", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
    { to: "/profile", label: "Hồ sơ", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];

  return (
    <div className="user-layout" data-theme="light">
      <header className="user-header">
        <div className="brand-block">
          <div className="brand-badge">EC</div>
          <div className="brand-text">
            <h1>Eternis City</h1>
            <p>Hệ thống quản lý </p>
          </div>
        </div>

        <div className="header-actions">
          <div className="header-user">
            <div className="header-user-avatar">{initials}</div>
            <span className="header-user-name">{user?.full_name || user?.username || "User"}</span>
          </div>
          <button type="button" className="logout-btn" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </header>

      <nav className="user-nav">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"} style={{ position: "relative" }}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
            {item.label}
            {item.to === "/chat" && unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  right: 2,
                  background: "#ef4444",
                  color: "white",
                  borderRadius: 999,
                  padding: "1px 6px",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  lineHeight: "16px",
                }}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <main className="user-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
