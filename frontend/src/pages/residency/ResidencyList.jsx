import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getResidents } from "../../services/residentService";
import { getApartmentStatus } from "../../services/statisticsService";

const relationLabels = {
  owner: "Chủ hộ",
  tenant: "Người thuê",
  member: "Thành viên",
};

const statusLabels = {
  active: "Đang cư trú",
  moved_out: "Đã chuyển đi",
};

export default function ResidencyList() {
  const [loading, setLoading] = useState(true);
  const [residents, setResidents] = useState([]);
  const [aptStatus, setAptStatus] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRelation, setFilterRelation] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [res, apt] = await Promise.all([
        getResidents({ limit: 100 }),
        getApartmentStatus(),
      ]);
      setResidents(res || []);
      setAptStatus(apt);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeCount = residents.filter((r) => r.status === "active" || !r.status).length;
  const movedOutCount = residents.filter((r) => r.status === "moved_out").length;
  const occupiedApts = (aptStatus?.occupied || 0) + (aptStatus?.sold || 0);

  const filtered = useMemo(() => {
    return residents.filter((r) => {
      const keyword = search.toLowerCase();
      if (keyword) {
        const name = (r.full_name || "").toLowerCase();
        const apt = (r.apartment_code || "").toLowerCase();
        const phone = (r.phone || "").toLowerCase();
        if (!name.includes(keyword) && !apt.includes(keyword) && !phone.includes(keyword)) {
          return false;
        }
      }
      if (filterStatus !== "all") {
        const st = r.status || "active";
        if (st !== filterStatus) return false;
      }
      if (filterRelation !== "all") {
        if ((r.relation || "member") !== filterRelation) return false;
      }
      return true;
    });
  }, [residents, search, filterStatus, filterRelation]);

  if (loading) {
    return (
      <section className="page-card">
        <p style={{ color: "#64748b", padding: 20 }}>Đang tải dữ liệu...</p>
      </section>
    );
  }

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Quản lý cư trú</h2>
        <p>Thông tin cư trú của cư dân trong tòa nhà.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card-body">
            <div className="stat-card-label">Tổng cư dân</div>
            <div className="stat-card-value" style={{ color: "#0f172a" }}>{residents.length}</div>
            <div className="stat-card-change">người</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-body">
            <div className="stat-card-label">Đang cư trú</div>
            <div className="stat-card-value" style={{ color: "#16a34a" }}>{activeCount}</div>
            <div className="stat-card-change">người</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-body">
            <div className="stat-card-label">Đã chuyển đi</div>
            <div className="stat-card-value" style={{ color: "#ef4444" }}>{movedOutCount}</div>
            <div className="stat-card-change">người</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-body">
            <div className="stat-card-label">Căn hộ có người ở</div>
            <div className="stat-card-value" style={{ color: "#2563eb" }}>{occupiedApts}</div>
            <div className="stat-card-change">căn</div>
          </div>
        </div>
      </div>

      <div className="page-actions">
        <div className="search-field">
          <label htmlFor="residency-search">Tìm kiếm</label>
          <input
            id="residency-search"
            type="text"
            placeholder="Tên, căn hộ hoặc số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="page-actions-right" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div className="search-field" style={{ minWidth: 140 }}>
            <label>Trạng thái</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }}>
              <option value="all">Tất cả</option>
              <option value="active">Đang cư trú</option>
              <option value="moved_out">Đã chuyển đi</option>
            </select>
          </div>
          <div className="search-field" style={{ minWidth: 140 }}>
            <label>Phân loại</label>
            <select value={filterRelation} onChange={(e) => setFilterRelation(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }}>
              <option value="all">Tất cả</option>
              <option value="owner">Chủ hộ</option>
              <option value="tenant">Người thuê</option>
              <option value="member">Thành viên</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ tên</th>
              <th>Căn hộ</th>
              <th>Phân loại</th>
              <th>Ngày vào ở</th>
              <th>Ngày chuyển đi</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: 20 }}>Không có dữ liệu</td>
              </tr>
            ) : (
              filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td>
                    <Link to={`/admin/residents/detail/${r.id}`} style={{ fontWeight: 600, color: "#2563eb", textDecoration: "none" }}>
                      {r.full_name || r.linked_username || "N/A"}
                    </Link>
                  </td>
                  <td>{r.apartment_code || "—"}</td>
                  <td>{relationLabels[r.relation] || r.relation || "—"}</td>
                  <td>{r.move_in_date ? new Date(r.move_in_date).toLocaleDateString("vi-VN") : "—"}</td>
                  <td>{r.move_out_date ? new Date(r.move_out_date).toLocaleDateString("vi-VN") : "—"}</td>
                  <td>
                    <span className={`status-pill ${r.status === "moved_out" ? "status-overdue" : "status-paid"}`}>
                      {statusLabels[r.status] || "Đang cư trú"}
                    </span>
                  </td>
                  <td style={{ display: "flex", gap: "0.4rem" }}>
                    <Link to={`/admin/residents/detail/${r.id}`} className="secondary-btn" style={{ fontSize: "0.78rem", padding: "0.3rem 0.6rem" }}>
                      Chi tiết
                    </Link>
                    {r.apartment_id && (
                      <Link to={`/admin/apartments/${r.apartment_id}`} className="secondary-btn" style={{ fontSize: "0.78rem", padding: "0.3rem 0.6rem" }}>
                        Căn hộ
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
