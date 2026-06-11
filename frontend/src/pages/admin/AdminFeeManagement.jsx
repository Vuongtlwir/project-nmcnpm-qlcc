import { useEffect, useState } from "react";
import { getFees, getPaymentHistory, confirmPayment } from "../../services/feeService";
import api from "../../services/api";

export default function AdminFeeManagement() {
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [feeData, paymentData] = await Promise.all([
        getFees(),
        getPaymentHistory(),
      ]);
      setBills(feeData || []);
      setPayments(paymentData || []);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    }
  };

  const handleConfirmPayment = async (paymentId) => {
    try {
      await confirmPayment(paymentId);
      alert("Xác nhận thanh toán thành công");
      loadData();
    } catch (err) {
      alert("Xác nhận thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleRemindResident = async (bill) => {
    try {
      await api.post("/notifications", {
        title: "Nhắc nhở thanh toán hóa đơn",
        content: `Hóa đơn mã ${bill.fee_code || bill.id} với số tiền ${Number(bill.amount || 0).toLocaleString("vi-VN")}đ đến hạn thanh toán vào ${new Date(bill.due_date).toLocaleDateString("vi-VN")}. Vui lòng thanh toán đúng hạn.`,
        type: "Nhắc nhở thanh toán",
        sort_order: 1
      });
      alert(`Đã gửi nhắc nhở cho cư dân về hóa đơn mã ${bill.fee_code || bill.id}.`);
    } catch (err) {
      alert("Gửi nhắc nhở thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const pendingPayments = payments.filter((p) => p.status === "pending");
  const paidPayments = payments.filter((p) => p.status === "paid");
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Quản lý hóa đơn</h2>
        <p>Theo dõi trạng thái thanh toán và xác nhận từ cư dân.</p>
      </div>

      {pendingPayments.length > 0 && (
        <div className="page-card" style={{ marginTop: "24px", border: "2px solid #f59e0b" }}>
          <div className="page-card-header">
            <h3>Chờ xác nhận thanh toán ({pendingPayments.length})</h3>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Mã thanh toán</th>
                  <th>Hóa đơn</th>
                  <th>Cư dân</th>
                  <th>Căn hộ</th>
                  <th>Số tiền</th>
                  <th>Ngày thanh toán</th>
                  <th>Phương thức</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td><strong>{payment.payment_code}</strong></td>
                    <td>{payment.fee_name || payment.fee_code || payment.fee_id}</td>
                    <td>{payment.resident_name || "N/A"}</td>
                    <td>{payment.apartment_code || "N/A"}</td>
                    <td>{Number(payment.amount || 0).toLocaleString("vi-VN")}đ</td>
                    <td>{formatDate(payment.payment_date)}</td>
                    <td>{payment.method === "card" ? "Thẻ" : payment.method === "transfer" ? "Chuyển khoản" : "Tiền mặt"}</td>
                    <td>
                      <button
                        className="primary-btn"
                        onClick={() => handleConfirmPayment(payment.id)}
                        style={{ fontSize: "12px", padding: "6px 12px" }}
                      >
                        Xác nhận
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="page-card" style={{ marginTop: "24px" }}>
        <div className="page-card-header">
          <h3>Danh sách hóa đơn</h3>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên hóa đơn</th>
                <th>Căn hộ</th>
                <th>Số tiền</th>
                <th>Hạn thanh toán</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {bills.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-row">
                    Chưa có hóa đơn nào.
                  </td>
                </tr>
              ) : (
                bills.map((bill) => {
                  const relatedPayments = payments.filter((p) => p.fee_id === bill.id);
                  const paidAmount = relatedPayments
                    .filter((p) => p.status === "paid")
                    .reduce((sum, p) => sum + Number(p.amount), 0);
                  const isPaid = paidAmount >= Number(bill.amount);
                  return (
                    <tr key={bill.id}>
                      <td><strong>{bill.fee_code || bill.id}</strong></td>
                      <td>{bill.name}</td>
                      <td>{bill.apartment_code || "Tất cả"}</td>
                      <td>{Number(bill.amount || 0).toLocaleString("vi-VN")}đ</td>
                      <td>{formatDate(bill.due_date)}</td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            backgroundColor: isPaid ? "#10b981" : "#ef4444",
                            color: "#fff",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                        </span>
                      </td>
                      <td>
                        {!isPaid && (
                          <button
                            className="secondary-btn"
                            onClick={() => handleRemindResident(bill)}
                            style={{ fontSize: "12px", padding: "6px 12px" }}
                          >
                            Nhắc nhở
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {paidPayments.length > 0 && (
        <div className="page-card" style={{ marginTop: "24px" }}>
          <div className="page-card-header">
            <h3>Lịch sử thanh toán ({paidPayments.length})</h3>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Mã thanh toán</th>
                  <th>Hóa đơn</th>
                  <th>Cư dân</th>
                  <th>Căn hộ</th>
                  <th>Số tiền</th>
                  <th>Ngày thanh toán</th>
                  <th>Phương thức</th>
                </tr>
              </thead>
              <tbody>
                {paidPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td><strong>{payment.payment_code}</strong></td>
                    <td>{payment.fee_name || payment.fee_code || payment.fee_id}</td>
                    <td>{payment.resident_name || "N/A"}</td>
                    <td>{payment.apartment_code || "N/A"}</td>
                    <td>{Number(payment.amount || 0).toLocaleString("vi-VN")}đ</td>
                    <td>{formatDate(payment.payment_date)}</td>
                    <td>{payment.method === "card" ? "Thẻ" : payment.method === "transfer" ? "Chuyển khoản" : "Tiền mặt"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
