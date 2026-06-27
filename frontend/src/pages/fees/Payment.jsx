import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { getFees, getPaymentHistory, payFee } from "../../services/feeService";

const formatCardNumber = (value) =>
  value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();

const METHOD_OPTIONS = [
  { value: "card", label: "Thẻ ngân hàng", icon: "💳" },
  { value: "transfer", label: "Chuyển khoản", icon: "🏦" },
  { value: "cash", label: "Tiền mặt", icon: "💵" },
];

const METHOD_LABELS = { card: "Thẻ", transfer: "Chuyển khoản", cash: "Tiền mặt" };

function generateQRCodeUrl(data) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
}

function randomBankInfo() {
  const banks = [
    { name: "Vietcombank", number: "0421001234567" },
    { name: "Techcombank", number: "19035123456789" },
    { name: "BIDV", number: "22010012345678" },
    { name: "MB Bank", number: "0987654321" },
    { name: "ACB", number: "123456789" },
  ];
  return banks[Math.floor(Math.random() * banks.length)];
}

export default function Payment() {
  const location = useLocation();
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedFee, setSelectedFee] = useState(location.state?.fee || null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bankInfo = useMemo(() => randomBankInfo(), []);

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

  const validateCardForm = () => {
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
    return true;
  };

  const validateForm = () => {
    if (!selectedFee) {
      setErrorMessage("Vui lòng chọn một hóa đơn để thanh toán.");
      return false;
    }
    if (paymentMethod === "card" && !validateCardForm()) {
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
      await payFee(selectedFee.id, { method: paymentMethod });

      const methodLabel = METHOD_LABELS[paymentMethod] || paymentMethod;
      setSuccessMessage(
        `Yêu cầu thanh toán ${selectedFee.fee_code || selectedFee.id} bằng phương thức ${methodLabel} đã được gửi. Vui lòng chờ quản trị viên xác nhận.`
      );
      setSelectedFee(null);
      setCardHolder("");
      setCardNumber("");
      setExpiry("");
      setCvc("");
      setPaymentMethod("card");
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

  const qrData = useMemo(() => selectedFee
    ? `Ngân hàng: ${bankInfo.name}\nSTK: ${bankInfo.number}\nNội dung: Thanh toan ${selectedFee.fee_code || selectedFee.id} - ${selectedFee.name}\nSo tien: ${Number(selectedFee.amount || 0).toLocaleString("vi-VN")} VND`
    : "", [selectedFee, bankInfo]);
  const qrUrl = useMemo(() => generateQRCodeUrl(qrData), [qrData]);

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
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
            {METHOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPaymentMethod(opt.value)}
                style={{
                  flex: 1,
                  minWidth: "140px",
                  padding: "14px 18px",
                  borderRadius: "14px",
                  border: `2px solid ${paymentMethod === opt.value ? "#2563eb" : "#e2e8f0"}`,
                  background: paymentMethod === opt.value ? "#eff6ff" : "#fff",
                  cursor: "pointer",
                  textAlign: "center",
                  fontWeight: paymentMethod === opt.value ? 700 : 500,
                  color: paymentMethod === opt.value ? "#1e40af" : "#64748b",
                  transition: "all 0.15s",
                  fontSize: "0.95rem",
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>{opt.icon}</div>
                {opt.label}
              </button>
            ))}
          </div>

          {paymentMethod === "card" && (
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
            </div>
          )}

          {paymentMethod === "transfer" && (
            <div className="page-card" style={{ marginBottom: "24px", padding: "26px", textAlign: "center" }}>
              <h3>Thông tin chuyển khoản</h3>
              <p style={{ color: "#64748b", marginBottom: "16px" }}>
                Vui lòng quét mã QR bên dưới để thực hiện chuyển khoản
              </p>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                <img
                  src={qrUrl}
                  alt="Mã QR thanh toán"
                  style={{ width: "200px", height: "200px", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "16px", textAlign: "left", width: "100%", maxWidth: "360px" }}>
                  <div style={{ marginBottom: "8px" }}>
                    <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Ngân hàng:</span>
                    <div style={{ fontWeight: 600, color: "#0f172a" }}>{bankInfo.name}</div>
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Số tài khoản:</span>
                    <div style={{ fontWeight: 600, color: "#0f172a" }}>{bankInfo.number}</div>
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Số tiền:</span>
                    <div style={{ fontWeight: 700, color: "#2563eb", fontSize: "1.1rem" }}>
                      {selectedFee ? Number(selectedFee.amount || 0).toLocaleString("vi-VN") : 0}đ
                    </div>
                  </div>
                  <div>
                    <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Nội dung:</span>
                    <div style={{ fontWeight: 600, color: "#0f172a", wordBreak: "break-all" }}>
                      Thanh toan {selectedFee.fee_code || selectedFee.id} - {selectedFee?.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "cash" && (
            <div className="page-card" style={{ marginBottom: "24px", padding: "26px", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>💵</div>
              <h3>Thanh toán tiền mặt</h3>
              <p style={{ color: "#64748b", marginTop: "8px", lineHeight: 1.6 }}>
                Vui lòng đến quầy lễ tân tại sảnh chờ để thanh toán trực tiếp.<br />
                Mang theo mã hóa đơn{" "}
                <strong>{selectedFee.fee_code || selectedFee.id}</strong> để nhân viên hỗ trợ nhanh chóng.
              </p>
            </div>
          )}

          <div className="action-group" style={{ justifyContent: "flex-end" }}>
            <button className="primary-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Xác nhận thanh toán"}
            </button>
          </div>
        </form>
      )}

      <div className="page-actions" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <div style={{ marginBottom: "24px" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: 6, display: "block" }}>Hóa đơn đang chọn</label>
          <div className={`summary-card ${selectedFee ? "" : ""}`} style={{ background: selectedFee ? "#eff6ff" : "#f8fafc", borderColor: selectedFee ? "#bfdbfe" : "#f1f5f9" }}>
            <div style={{ fontWeight: 600, color: "#0f172a" }}>
              {selectedFee
                ? `${selectedFee.fee_code || selectedFee.id} - ${selectedFee.name}`
                : "Chưa có hóa đơn được chọn"}
            </div>
            {selectedFee && (
              <>
                <div style={{ color: "#2563eb", fontSize: "1.1rem", fontWeight: 700, marginTop: 4 }}>
                  {Number(selectedFee.amount || 0).toLocaleString("vi-VN")}đ
                </div>
                <div style={{ color: "#64748b", fontSize: "0.82rem", marginTop: 2 }}>
                  Hạn nộp: {new Date(selectedFee.due_date).toLocaleDateString("vi-VN")}
                </div>
              </>
            )}
            {!selectedFee && (
              <div style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: 4 }}>Vui lòng chọn hóa đơn ở danh sách phía dưới.</div>
            )}
          </div>
        </div>

        <div className="page-card" style={{ padding: "22px", marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "18px", fontSize: "1rem", fontWeight: 700 }}>Chọn hóa đơn cần thanh toán</h3>
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
