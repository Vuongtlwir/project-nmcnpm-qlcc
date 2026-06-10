import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

export default function FeeList() {
  const [search, setSearch] = useState("");

  const invoices = [
    { id: "HD-001", description: "Phí vệ sinh tháng 6", dueDate: "10/06/2026", amount: "1.250.000đ", status: "Chưa thanh toán" },
    { id: "HD-002", description: "Tiền điện tháng 5", dueDate: "05/06/2026", amount: "850.000đ", status: "Đã thanh toán" },
    { id: "HD-003", description: "Tiền nước tháng 5", dueDate: "12/06/2026", amount: "420.000đ", status: "Chưa thanh toán" },
    { id: "HD-004", description: "Phí internet", dueDate: "15/06/2026", amount: "250.000đ", status: "Quá hạn" },
  ];

  const filteredInvoices = useMemo(
    () => invoices.filter((item) => {
      const keyword = search.toLowerCase();
      return item.id.toLowerCase().includes(keyword) || item.description.toLowerCase().includes(keyword);
    }),
    [search]
  );

  const paidCount = invoices.filter((item) => item.status === "Đã thanh toán").length;
  const unpaidCount = invoices.filter((item) => item.status === "Chưa thanh toán").length;
  const overdueCount = invoices.filter((item) => item.status === "Quá hạn").length;
  const totalCount = invoices.length;
  const paidPercent = totalCount ? Math.round((paidCount / totalCount) * 100) : 0;
  const unpaidPercent = totalCount ? Math.round(((unpaidCount + overdueCount) / totalCount) * 100) : 0;

  const getStatusClass = (status) => {
    if (status === "Đã thanh toán") return "status-paid";
    if (status === "Chưa thanh toán") return "status-pending";
    return "status-overdue";
  };

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Hóa đơn của bạn</h2>
        <p>Xem chi tiết phí định kỳ, trạng thái thanh toán và lịch sử nhanh chóng.</p>
      </div>

      <div className="page-actions">
        <div className="search-field">
          <label htmlFor="invoice-search">Tìm kiếm hóa đơn</label>
          <input
            id="invoice-search"
            type="text"
            placeholder="Mã hóa đơn hoặc nội dung..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="action-group">
          <Link to="/payments" className="primary-btn">Thanh toán ngay</Link>
          <Link to="/payment-history" className="secondary-btn">Lịch sử thanh toán</Link>
        </div>
      </div>

      <div className="page-card" style={{ marginTop: "24px", padding: "22px", border: "1px solid #e5e7eb", background: "#fff" }}>
        <h3>Thống kê thu phí</h3>
        <div style={{ display: "grid", gap: "18px", marginTop: "18px", gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          <div style={{ padding: "18px", borderRadius: "18px", background: "#f8fafc" }}>
            <h4>Tổng hóa đơn</h4>
            <p style={{ fontSize: "1.9rem", fontWeight: 700, margin: "10px 0 0" }}>{totalCount}</p>
          </div>
          <div style={{ padding: "18px", borderRadius: "18px", background: "#dcfce7" }}>
            <h4>Đã đóng</h4>
            <p style={{ fontSize: "1.9rem", fontWeight: 700, margin: "10px 0 0" }}>{paidCount}</p>
          </div>
          <div style={{ padding: "18px", borderRadius: "18px", background: "#fef3c7" }}>
            <h4>Chưa đóng</h4>
            <p style={{ fontSize: "1.9rem", fontWeight: 700, margin: "10px 0 0" }}>{unpaidCount + overdueCount}</p>
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <h4>Biểu đồ thanh toán</h4>
          <div style={{ display: "grid", gap: "18px", gridTemplateColumns: "1fr 1fr", marginTop: "14px" }}>
            <div style={{ padding: "18px", borderRadius: "18px", background: "#f8fafc" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, marginBottom: "12px" }}>
                <span>Đã đóng</span>
                <span>{paidPercent}%</span>
              </div>
              <div style={{ height: "14px", borderRadius: "999px", background: "#d1fae5", overflow: "hidden" }}>
                <div style={{ width: `${paidPercent}%`, height: "100%", background: "#16a34a" }} />
              </div>
              <p style={{ marginTop: "12px", color: "#4b5563" }}>
                {paidCount} hóa đơn đã đóng
              </p>
            </div>
            <div style={{ padding: "18px", borderRadius: "18px", background: "#fef3c7" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, marginBottom: "12px" }}>
                <span>Chưa đóng</span>
                <span>{unpaidPercent}%</span>
              </div>
              <div style={{ height: "14px", borderRadius: "999px", background: "#fde68a", overflow: "hidden" }}>
                <div style={{ width: `${unpaidPercent}%`, height: "100%", background: "#b45309" }} />
              </div>
              <p style={{ marginTop: "12px", color: "#4b5563" }}>
                {unpaidCount + overdueCount} hóa đơn chưa đóng
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã hóa đơn</th>
              <th>Nội dung</th>
              <th>Hạn nộp</th>
              <th>Số tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.description}</td>
                <td>{invoice.dueDate}</td>
                <td>{invoice.amount}</td>
                <td>
                  <span className={`status-pill ${getStatusClass(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td>
                  {invoice.status !== "Đã thanh toán" ? (
                    <Link
                      to="/payments"
                      state={{ invoice }}
                      className="secondary-btn"
                    >
                      Thanh toán
                    </Link>
                  ) : (
                    <span className="status-pill status-paid">Đã thanh toán</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
