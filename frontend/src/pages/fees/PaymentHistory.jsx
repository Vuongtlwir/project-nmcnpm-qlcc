import { useEffect, useState } from "react";
import { getPaymentHistory } from "../../services/feeService";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getPaymentHistory();
    setPayments(data || []);
  };

  const methodLabels = {
    card: "Thẻ",
    transfer: "Chuyển khoản",
    cash: "Tiền mặt",
  };

  const statusLabels = {
    paid: "Thành công",
    pending: "Chờ xác nhận",
    cancelled: "Đã hủy",
  };

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Lịch sử thanh toán</h2>
        <p>Xem lại các giao dịch đã hoàn tất và theo dõi biên lai của bạn.</p>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã giao dịch</th>
              <th>Hóa đơn</th>
              <th>Ngày</th>
              <th>Số tiền</th>
              <th>Phương thức</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  Chưa có giao dịch nào.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.payment_code}</td>
                  <td>{payment.fee_name || payment.fee_code || payment.fee_id}</td>
                  <td>{payment.payment_date ? new Date(payment.payment_date).toLocaleDateString("vi-VN") : "N/A"}</td>
                  <td>{Number(payment.amount || 0).toLocaleString("vi-VN")}đ</td>
                  <td>{methodLabels[payment.method] || payment.method}</td>
                  <td>
                    <span className={`status-pill ${payment.status === "paid" ? "status-paid" : "status-pending"}`}>
                      {statusLabels[payment.status] || payment.status}
                    </span>
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
