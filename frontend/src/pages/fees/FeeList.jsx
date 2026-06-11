import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFees, getPaymentHistory } from "../../services/feeService";

const STATUS_MAP = {
  paid: { label: "Đã thanh toán", className: "status-paid" },
  pending: { label: "Chờ xác nhận", className: "status-pending" },
  cancelled: { label: "Đã hủy", className: "status-overdue" },
};

export default function FeeList() {
  const [search, setSearch] = useState("");
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [feeData, paymentData] = await Promise.all([
      getFees(),
      getPaymentHistory(),
    ]);
    setFees(feeData || []);
    setPayments(paymentData || []);
  };

  const getFeeStatus = (feeId) => {
    const payment = payments.find((p) => p.fee_id === feeId);
    return payment ? payment.status : null;
  };

  const filteredFees = fees.filter((fee) => {
    if (!search) return true;
    const keyword = search.toLowerCase();
    return (
      (fee.fee_code || "").toLowerCase().includes(keyword) ||
      (fee.name || "").toLowerCase().includes(keyword)
    );
  });

  const totalCount = filteredFees.length;
  const paidCount = filteredFees.filter((f) => getFeeStatus(f.id) === "paid").length;
  const pendingCount = filteredFees.filter((f) => getFeeStatus(f.id) === "pending").length;
  const unpaidCount = filteredFees.filter((f) => !getFeeStatus(f.id)).length;
  const paidPercent = totalCount ? Math.round((paidCount / totalCount) * 100) : 0;
  const unpaidPercent = totalCount ? Math.round(((unpaidCount + pendingCount) / totalCount) * 100) : 0;

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
            <p style={{ fontSize: "1.9rem", fontWeight: 700, margin: "10px 0 0" }}>{unpaidCount + pendingCount}</p>
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
                {unpaidCount + pendingCount} hóa đơn chưa đóng
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
            {filteredFees.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  Không có hóa đơn nào.
                </td>
              </tr>
            ) : (
              filteredFees.map((fee) => {
                const status = getFeeStatus(fee.id);
                const statusInfo = STATUS_MAP[status] || { label: "Chưa thanh toán", className: "status-pending" };
                return (
                  <tr key={fee.id}>
                    <td>{fee.fee_code || fee.id}</td>
                    <td>{fee.name}</td>
                    <td>{fee.due_date ? new Date(fee.due_date).toLocaleDateString("vi-VN") : "N/A"}</td>
                    <td>{Number(fee.amount || 0).toLocaleString("vi-VN")}đ</td>
                    <td>
                      <span className={`status-pill ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td>
                      {status !== "paid" ? (
                        <Link
                          to="/payments"
                          state={{ fee }}
                          className="secondary-btn"
                        >
                          {status === "pending" ? "Chờ xác nhận" : "Thanh toán"}
                        </Link>
                      ) : (
                        <span className="status-pill status-paid">Đã thanh toán</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
