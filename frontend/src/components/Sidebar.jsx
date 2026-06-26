import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import useUnreadResidents from "../hooks/useUnreadResidents";

const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  residents: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  apartments: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="6" x2="9" y2="6.01" />
      <line x1="15" y1="6" x2="15" y2="6.01" />
      <line x1="9" y1="10" x2="9" y2="10.01" />
      <line x1="15" y1="10" x2="15" y2="10.01" />
      <line x1="9" y1="14" x2="9" y2="14.01" />
      <line x1="15" y1="14" x2="15" y2="14.01" />
      <line x1="9" y1="18" x2="15" y2="18" />
    </svg>
  ),
  requests: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  services: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  notifications: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  bills: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
};

const menuItems = [
  { name: "Trang chủ", path: "/admin", icon: icons.dashboard },
  { name: "Cư dân", path: "/admin/residents", icon: icons.residents },
  { name: "Căn hộ", path: "/admin/apartments", icon: icons.apartments },
  { name: "Cư trú", path: "/admin/residency", icon: icons.residents },
  { name: "Yêu cầu", path: "/admin/requests", icon: icons.requests },
  { name: "Dịch vụ", path: "/admin/services", icon: icons.services },
  { name: "Bảng tin", path: "/admin/notifications", icon: icons.notifications },
  { name: "Hóa đơn", path: "/admin/bills", icon: icons.bills },
  { name: "Chat", path: "/admin/chat", icon: icons.chat },
];

export default function Sidebar() {
  const { total: unreadCount, residents: unreadResidents } = useUnreadResidents();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowDropdown(false), 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">EC</div>
          <div className="sidebar-logo-text">
            <h2>Eternis City </h2>
            <p>Admin</p>
          </div>
        </div>

        <div className="sidebar-label">Main Menu</div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                {item.icon}
                <span>{item.name}</span>
                {item.path === "/admin/chat" && unreadCount > 0 && (
                  <span
                    className="badge"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{ cursor: "pointer" }}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </NavLink>
              {item.path === "/admin/chat" && showDropdown && unreadResidents.length > 0 && (
                <div
                  ref={dropdownRef}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    position: "absolute",
                    left: "100%",
                    top: 0,
                    marginLeft: 8,
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    minWidth: 220,
                    zIndex: 1000,
                    padding: "8px 0",
                  }}
                >
                  <div style={{ padding: "6px 14px 10px", fontSize: "0.75rem", fontWeight: 600, color: "#64748b", borderBottom: "1px solid #f1f5f9", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Tin nhắn mới
                  </div>
                  {unreadResidents.map((r) => (
                    <NavLink
                      key={r.user_id}
                      to="/admin/chat"
                      state={{ focusUserId: r.user_id }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 14px",
                        textDecoration: "none",
                        color: "#0f172a",
                        fontSize: "0.85rem",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
                        color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: "0.7rem",
                        flexShrink: 0,
                      }}>
                        {(r.full_name || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.83rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {r.full_name || "Không tên"}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                          {r.apartment_code || ""} · {r.count} tin
                        </div>
                      </div>
                      <span style={{
                        background: "#ef4444", color: "#fff",
                        borderRadius: 999, padding: "1px 7px",
                        fontSize: "0.65rem", fontWeight: 700,
                        lineHeight: "1.5",
                      }}>
                        {r.count}
                      </span>
                    </NavLink>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <span className="sidebar-footer-dot" />
        <span>v1.0 · Hệ thống quản lý NM</span>
      </div>
    </aside>
  );
}
