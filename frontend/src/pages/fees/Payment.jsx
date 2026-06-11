import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getFees, getPaymentHistory, payFee } from "../../services/feeService";

const formatCardNumber = (value) =>
  value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();

export default function Payment() {
  const location = useLocation();
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedFee, setSelectedFee] = useState(location.state?.fee || null);
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadFees();
  }, []);

  const loadFees = async () => {
    const [feeData, paymentData] = await Promise.all([
      getFees(),
      getPaymentHistory(),
    ]);
    setFees(feeData || []);
    setPayments(paymentData || []);
  };

  const availableFees = fees.filter((fee) => {
    const payment = payments.find((p) => p.fee_id === fee.id);
    return !payment || payment.status !== "paid";
  });

  const validateForm = () => {
    if (!selectedFee) {
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
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await payFee(selectedFee.id, { method: "card" });

      setSuccessMessage(
        `Yêu cầu thanh toán ${selectedFee.fee_code || selectedFee.id} đã được gửi. Vui lòng chờ quản trị viên xác nhận.`
      );
      setSelectedFee(null);
      setCardHolder("");
      setCardNumber("");
      setExpiry("");
      setCvc("");
      loadFees();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Thanh toán thất bại. Vui lòng thử lại sau."
      );
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

      {selectedFee && (
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
              {selectedFee
                ? `${selectedFee.fee_code || selectedFee.id} - ${selectedFee.name}`
                : "Chưa có hóa đơn được chọn"}
            </p>
            <p style={{ color: "#6b7280", margin: "8px 0 0" }}>
              {selectedFee
                ? `Số tiền: ${Number(selectedFee.amount || 0).toLocaleString("vi-VN")}đ`
                : "Vui lòng chọn hóa đơn ở danh sách phía dưới."}
            </p>
            <p style={{ color: "#6b7280", margin: "4px 0 0" }}>
              {selectedFee
                ? `Hạn nộp: ${new Date(selectedFee.due_date).toLocaleDateString("vi-VN")}`
                : ""}
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
                  <th>Chọn</th>
                </tr>
              </thead>
              <tbody>
                {availableFees.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                      Không có hóa đơn nào cần thanh toán.
                    </td>
                  </tr>
                ) : (
                  availableFees.map((fee) => (
                    <tr key={fee.id}>
                      <td>{fee.fee_code || fee.id}</td>
                      <td>{fee.name}</td>
                      <td>{new Date(fee.due_date).toLocaleDateString("vi-VN")}</td>
                      <td>{Number(fee.amount || 0).toLocaleString("vi-VN")}đ</td>
                      <td>
                        <button
                          type="button"
                          className="secondary-btn"
                          onClick={() => setSelectedFee(fee)}
                        >
                          Chọn
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
