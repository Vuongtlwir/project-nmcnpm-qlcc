import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menuItems = [
    { name: "Bảng điều khiển", path: "/admin" },
    { name: "Khách hàng", path: "/admin/residents" },
    { name: "Căn hộ", path: "/admin/apartments" },
    { name: "Thu phí", path: "/admin/bills" },
    { name: "Hợp đồng", path: "/admin/contracts" },
    { name: "Thống kê", path: "/admin/statistics" },
    { name: "Thông báo", path: "/admin/notifications" },
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
