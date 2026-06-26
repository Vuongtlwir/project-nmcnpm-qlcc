import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStatisticsOverview, getApartmentStatus, getRevenueByMonth, getFeeCollection } from "../../services/statisticsService";
import { getResidents } from "../../services/residentService";
import { getComplaints } from "../../services/complaintService";
import { DonutChart, BarChart } from "../../components/Chart";

const monthLabels = {
  "01": "T1", "02": "T2", "03": "T3", "04": "T4", "05": "T5", "06": "T6",
  "07": "T7", "08": "T8", "09": "T9", "10": "T10", "11": "T11", "12": "T12",
};

const complaintTypeColor = {
  pending: "#f59e0b",
  resolved: "#16a34a",
  rejected: "#ef4444",
};

const complaintTypeLabel = {
  pending: "Chờ xử lý",
  resolved: "Đã giải quyết",
  rejected: "Đã từ chối",
};

const statIcons = {
  residents: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  ),
  apartments: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="6" x2="9" y2="6.01" />
      <line x1="15" y1="6" x2="15" y2="6.01" />
      <line x1="9" y1="10" x2="9" y2="10.01" />
      <line x1="15" y1="10" x2="15" y2="10.01" />
    </svg>
  ),
  revenue: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  complaints: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [aptStatus, setAptStatus] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [feeCollection, setFeeCollection] = useState(null);
  const [recentResidents, setRecentResidents] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ov, apt, rev, fc, res, complaints] = await Promise.all([
        getStatisticsOverview(),
        getApartmentStatus(),
        getRevenueByMonth(),
        getFeeCollection(),
        getResidents({ limit: 20 }),
        getComplaints(),
      ]);
      setOverview(ov);
      setAptStatus(apt);
      setRevenueData(rev || []);
      setFeeCollection(fc);

      setRecentResidents(res || []);

      setRecentComplaints((complaints || []).slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="page-card">
        <p style={{ color: "#64748b", padding: 20 }}>Đang tải dữ liệu...</p>
      </section>
    );
  }

  const aptDonut = [
    { label: "Đang sử dụng", value: aptStatus?.occupied || 0, color: "#2563eb" },
    { label: "Còn trống", value: aptStatus?.empty || 0, color: "#f59e0b" },
    { label: "Bảo trì", value: aptStatus?.maintenance || 0, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  const barData = revenueData.map((r) => {
    const m = r.month ? r.month.split("-")[1] : "";
    return {
      label: monthLabels[m] || m || r.month,
      value: r.revenue,
      color: "#3b82f6",
    };
  });

  const totalRevenue = revenueData.reduce((s, r) => s + (r.revenue || 0), 0);

  const statCards = [
    { icon: statIcons.residents, bg: "#eff6ff", color: "#2563eb", label: "Cư dân", value: overview?.totalResidents ?? 0, suffix: "người" },
    { icon: statIcons.apartments, bg: "#ecfdf5", color: "#10b981", label: "Căn hộ", value: overview?.totalApartments ?? 0, suffix: "căn" },
    { icon: statIcons.revenue, bg: "#fffbeb", color: "#f59e0b", label: "Doanh thu", value: (totalRevenue || 0).toLocaleString("vi-VN") + "đ", suffix: "" },
    { icon: statIcons.complaints, bg: "#fef2f2", color: "#ef4444", label: "Phản ánh chờ", value: overview?.pendingComplaints ?? 0, suffix: "yêu cầu" },
  ];

  const fcPaid = feeCollection?.paid ?? 0;
  const fcPending = feeCollection?.pending ?? 0;
  const fcUnpaid = feeCollection?.unpaid ?? 0;

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em" }}>
          Tổng quan
        </h2>
        <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "0.88rem" }}>
          Báo cáo thống kê tòa nhà
        </p>
      </div>

      <div className="stat-grid">
        {statCards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="stat-card-icon" style={{ background: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-card-body">
              <div className="stat-card-label">{card.label}</div>
              <div className="stat-card-value" style={{ color: card.color }}>{card.value}</div>
              {card.suffix && <div className="stat-card-change">{card.suffix}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Trạng thái căn hộ</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <DonutChart data={aptDonut} />
            <div style={{ display: "flex", gap: 20, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
              {aptDonut.map((d) => (
                <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color }} />
                  <span style={{ fontSize: "0.82rem", color: "#475569" }}>{d.label}: <strong>{d.value}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Doanh thu theo tháng</h3>
          </div>
          {barData.length === 0 ? (
            <div style={{ color: "#94a3b8", textAlign: "center", padding: 20 }}>Chưa có dữ liệu doanh thu</div>
          ) : (
            <BarChart data={barData} height={200} />
          )}
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: 24 }}>
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Tỷ lệ thu phí</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <DonutChart
              data={[
                { label: "Đã thanh toán", value: fcPaid || 0, color: "#16a34a" },
                { label: "Chờ xác nhận", value: fcPending || 0, color: "#f59e0b" },
                { label: "Chưa nộp", value: fcUnpaid || 0, color: "#ef4444" },
              ].filter((d) => d.value > 0)}
              size={160}
              thickness={24}
              centerText="Tổng thu"
            />
            <div style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap", justifyContent: "center" }}>
              {(() => {
                const total = (fcPaid || 0) + (fcPending || 0) + (fcUnpaid || 0);
                const segments = [
                  { label: "Đã thanh toán", value: fcPaid, color: "#16a34a" },
                  { label: "Chờ xác nhận", value: fcPending, color: "#f59e0b" },
                  { label: "Chưa nộp", value: fcUnpaid, color: "#ef4444" },
                ];
                return segments.filter(s => s.value > 0).map(s => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color }} />
                    <span style={{ fontSize: "0.82rem", color: "#475569" }}>
                      {s.label}: <strong>{total > 0 ? Math.round((s.value / total) * 100) : 0}%</strong>
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Cư dân mới nhất</h3>
          </div>
          {recentResidents.length === 0 ? (
            <div style={{ color: "#94a3b8", textAlign: "center", padding: 20 }}>Chưa có cư dân</div>
          ) : (
            <div className="table-responsive">
              <table className="data-table" style={{ fontSize: "0.82rem" }}>
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Căn hộ</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {recentResidents.map((r) => (
                    <tr key={r.id}>
                      <td>{r.full_name || r.linked_username || "N/A"}</td>
                      <td>{r.apartment_code || "—"}</td>
                      <td>{r.created_at ? new Date(r.created_at).toLocaleDateString("vi-VN") : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ marginTop: 12, textAlign: "right" }}>
            <Link to="/admin/residents" className="primary-btn" style={{ fontSize: "0.8rem", padding: "0.35rem 0.7rem" }}>
              Xem tất cả
            </Link>
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: 24 }}>
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Căn hộ chưa đóng phí</h3>
          </div>
          {(() => {
            const unpaid = (recentResidents || []).filter(r => r.fee_status === 'unpaid');
            if (unpaid.length === 0) {
              return <div style={{ color: "#94a3b8", textAlign: "center", padding: 20 }}>Tất cả căn hộ đã đóng phí</div>;
            }
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {unpaid.map(r => (
                  <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{r.full_name || r.linked_username || "N/A"}</div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{r.apartment_code || "—"}</div>
                    </div>
                    <Link to={`/admin/residents/detail/${r.id}`} className="secondary-btn" style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}>
                      Chi tiết
                    </Link>
                  </div>
                ))}
              </div>
            );
          })()}
          <div style={{ marginTop: 12, textAlign: "right" }}>
            <Link to="/admin/residents" className="primary-btn" style={{ fontSize: "0.8rem", padding: "0.35rem 0.7rem" }}>
              Xem tất cả
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Phản ánh gần đây</h3>
          </div>
          {recentComplaints.length === 0 ? (
            <div style={{ color: "#94a3b8", textAlign: "center", padding: 20 }}>Chưa có phản ánh nào</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recentComplaints.map((c) => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{c.type || "—"}</div>
                  </div>
                  <span style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: 999,
                    color: "#fff",
                    background: complaintTypeColor[c.status] || "#94a3b8",
                    whiteSpace: "nowrap",
                    marginLeft: 8,
                  }}>
                    {complaintTypeLabel[c.status] || c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: 12, textAlign: "right" }}>
            <Link to="/admin/requests" className="primary-btn" style={{ fontSize: "0.8rem", padding: "0.35rem 0.7rem" }}>
              Xem tất cả
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
