import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menuItems = [
    { name: "Trang chủ", path: "/admin" },
    { name: "Danh sách cư dân", path: "/admin/residents" },
    { name: "Quản lý căn hộ", path: "/admin/apartments" },
    { name: "Quản lý yêu cầu", path: "/admin/requests" },
    { name: "Bảng tin tòa nhà", path: "/admin/notifications" },
    { name: "Quản lý hóa đơn", path: "/admin/bills" },
    { name: "Chat với cư dân", path: "/admin/chat" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div>
          <h2>NM</h2>
          <p>Apartment Admin</p>
        </div>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <span>Version 1.0</span>
        <small>Hệ thống quản lý NM</small>
      </div>
    </aside>
  );
}
