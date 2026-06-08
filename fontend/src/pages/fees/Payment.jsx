import { useState } from "react";
import { useLocation } from "react-router-dom";
import { payFee } from "../../services/feeService";

const initialInvoices = [
  { id: "HD-001", description: "Phí vệ sinh tháng 6", dueDate: "10/06/2026", amount: "1.250.000đ", status: "Chưa thanh toán" },
  { id: "HD-002", description: "Tiền điện tháng 5", dueDate: "05/06/2026", amount: "850.000đ", status: "Đã thanh toán" },
  { id: "HD-003", description: "Tiền nước tháng 5", dueDate: "12/06/2026", amount: "420.000đ", status: "Chưa thanh toán" },
  { id: "HD-004", description: "Phí internet", dueDate: "15/06/2026", amount: "250.000đ", status: "Quá hạn" },
];

const formatCardNumber = (value) =>
  value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();

export default function Payment() {
  const location = useLocation();
  const [invoices, setInvoices] = useState(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState(location.state?.invoice || null);
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableInvoices = invoices.filter((item) => item.status !== "Đã thanh toán");

  const validateForm = () => {
    if (!selectedInvoice) {
      setErrorMessage("Vui lòng chọn một hóa đơn để thanh toán.");
      return false;
    }
    if (!cardHolder.trim()) {
      setErrorMessage("Tên chủ thẻ không được để trống.");
      return false;
    }
    const rawCardNumber = cardNumber.replace(/\s/g, "");
    if (!/^\d{16}$/.test(rawCardNumber)) {
      setErrorMessage("Số thẻ phải gồm 16 chữ số.");
      return false;
    }
    if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry)) {
      setErrorMessage("Hạn dùng phải theo định dạng MM/YY.");
      return false;
    }
    if (!/^\d{3,4}$/.test(cvc)) {
      setErrorMessage("CVC phải gồm 3 hoặc 4 chữ số.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const paymentData = {
        cardHolder,
        cardNumber: cardNumber.replace(/\s/g, ""),
        expiry,
        cvc,
      };

      await payFee(selectedInvoice.id, paymentData);

      setInvoices((prev) =>
        prev.map((item) =>
          item.id === selectedInvoice.id ? { ...item, status: "Đã thanh toán" } : item
        )
      );
      setSuccessMessage(`Thanh toán ${selectedInvoice.id} thành công. Cảm ơn bạn đã sử dụng dịch vụ.`);
      setSelectedInvoice(null);
      setCardHolder("");
      setCardNumber("");
      setExpiry("");
      setCvc("");
    } catch (error) {
      setErrorMessage("Thanh toán thất bại. Vui lòng thử lại sau.");
      console.error("Lỗi thanh toán hóa đơn:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Thanh toán hóa đơn</h2>
        <p>Hoàn tất giao dịch của bạn với thông tin thanh toán an toàn và đơn giản.</p>
      </div>

      {errorMessage && (
        <div style={{ marginBottom: "18px", padding: "16px", background: "#fee2e2", color: "#991b1b", borderRadius: "16px", border: "1px solid #fca5a5" }}>
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div style={{ marginBottom: "18px", padding: "16px", background: "#dcfce7", color: "#166534", borderRadius: "16px", border: "1px solid #86efac" }}>
          {successMessage}
        </div>
      )}

      {selectedInvoice && (
        <form onSubmit={handlePaymentSubmit}>
          <div className="page-card" style={{ marginBottom: "24px", padding: "26px" }}>
            <h3>Thông tin thẻ</h3>
            <div className="search-field">
              <label htmlFor="cardholder">Tên chủ thẻ</label>
              <input
                id="cardholder"
                type="text"
                placeholder="Nguyễn Văn A"
                value={cardHolder}
                onChange={(event) => setCardHolder(event.target.value)}
              />
            </div>

            <div className="search-field">
              <label htmlFor="card-number">Số thẻ</label>
              <input
                id="card-number"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
                maxLength={19}
              />
            </div>

            <div className="page-actions" style={{ marginTop: "8px" }}>
              <div className="search-field" style={{ minWidth: "160px" }}>
                <label htmlFor="expiry">Hạn dùng</label>
                <input
                  id="expiry"
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(event) => setExpiry(event.target.value)}
                  maxLength={5}
                />
              </div>

              <div className="search-field" style={{ minWidth: "160px" }}>
                <label htmlFor="cvc">CVC</label>
                <input
                  id="cvc"
                  type="text"
                  placeholder="123"
                  value={cvc}
                  onChange={(event) => setCvc(event.target.value.replace(/\D/g, ""))}
                  maxLength={4}
                />
              </div>
            </div>

            <div className="action-group" style={{ justifyContent: "flex-end", marginTop: "22px" }}>
              <button className="primary-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : "Xác nhận thanh toán"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="page-actions" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <div className="search-field" style={{ marginBottom: "24px" }}>
          <label>Hóa đơn đang chọn</label>
          <div style={{ padding: "18px", borderRadius: "18px", background: "#f8fafc", border: "1px solid #e5e7eb" }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              {selectedInvoice ? `${selectedInvoice.id} - ${selectedInvoice.description}` : "Chưa có hóa đơn được chọn"}
            </p>
            <p style={{ color: "#6b7280", margin: "8px 0 0" }}>
              {selectedInvoice ? `Số tiền: ${selectedInvoice.amount}` : "Vui lòng chọn hóa đơn ở danh sách phía dưới."}
            </p>
            <p style={{ color: "#6b7280", margin: "4px 0 0" }}>
              {selectedInvoice ? `Hạn nộp: ${selectedInvoice.dueDate}` : ""}
            </p>
          </div>
        </div>

        <div className="page-card" style={{ padding: "22px", marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "18px" }}>Chọn hóa đơn cần thanh toán</h3>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã hóa đơn</th>
                  <th>Nội dung</th>
                  <th>Hạn nộp</th>
                  <th>Số tiền</th>
                  <th>Trạng thái</th>
                  <th>Chọn</th>
                </tr>
              </thead>
              <tbody>
                {availableInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.id}</td>
                    <td>{invoice.description}</td>
                    <td>{invoice.dueDate}</td>
                    <td>{invoice.amount}</td>
                    <td>
                      <span className={`status-pill ${invoice.status === "Chưa thanh toán" ? "status-pending" : "status-overdue"}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => setSelectedInvoice(invoice)}
                      >
                        Chọn
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
