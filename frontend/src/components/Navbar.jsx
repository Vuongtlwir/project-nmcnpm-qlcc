import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <div className="brand-mark">NM</div>
          <div>
            <h2>NM Property Dashboard</h2>
            <p>Quản lý cư dân, phí, phản ánh và thống kê hiệu quả</p>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        <div className="user-badge">
          <div className="user-avatar">{user?.username?.[0]?.toUpperCase() || "A"}</div>
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
