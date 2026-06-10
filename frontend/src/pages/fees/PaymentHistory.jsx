export default function PaymentHistory() {
  const paymentHistory = [
    { id: "PT-2026-05-10", amount: "850.000đ", date: "10/05/2026", method: "Thẻ ngân hàng", status: "Thành công" },
    { id: "PT-2026-04-10", amount: "1.250.000đ", date: "10/04/2026", method: "Internet Banking", status: "Thành công" },
    { id: "PT-2026-03-10", amount: "420.000đ", date: "10/03/2026", method: "Ví điện tử", status: "Thành công" },
  ];

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
              <th>Ngày</th>
              <th>Số tiền</th>
              <th>Phương thức</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.date}</td>
                <td>{payment.amount}</td>
                <td>{payment.method}</td>
                <td>
                  <span className="status-pill status-paid">{payment.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
