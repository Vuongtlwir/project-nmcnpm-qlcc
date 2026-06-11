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
    { to: "/", label: "Trang chủ" },
    { to: "/fees", label: "Hóa đơn" },
    { to: "/complaints", label: "Phản ánh" },
    { to: "/chat", label: "Tin nhắn" },
    { to: "/profile", label: "Hồ sơ" },
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
