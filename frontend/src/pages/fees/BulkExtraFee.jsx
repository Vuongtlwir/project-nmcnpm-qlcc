import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApartments } from "../../services/apartmentService";
import { createFee } from "../../services/feeService";

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default function BulkExtraFee() {
  const navigate = useNavigate();
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [description, setDescription] = useState("");

  const [yearNum, monthNum] = month.split("-").map(Number);
  const monthLabel = `tháng ${monthNum}/${yearNum}`;

  const handleSubmit = async () => {
    if (!label.trim()) return window.alert("Vui lòng nhập tên phí.");
    if (!amount || Number(amount) <= 0) return window.alert("Vui lòng nhập số tiền hợp lệ.");
    if (!window.confirm(`Tạo phí "${label.trim()}" ${formatMoney(amount)} cho TẤT CẢ căn hộ?`)) return;

    setSubmitting(true);
    setResult(null);

    try {
      const allApts = await getApartments();
      const dueDate = new Date(Date.UTC(yearNum, monthNum, 0));
      const dueDateStr = dueDate.toISOString().split("T")[0];
      const feeAmount = Number(amount);

      const success = [];
      const failed = [];

      for (const apt of allApts) {
        try {
          await createFee({
            name: `${label.trim()} ${monthLabel}`,
            type: "mandatory",
            amount: feeAmount,
            apartment_id: apt.id,
            due_date: dueDateStr,
            description: description.trim() || `Phí phát sinh cho căn hộ ${apt.code}`,
          });
          success.push(apt.code);
        } catch (err) {
          failed.push({ code: apt.code, reason: err?.response?.data?.message || err.message });
        }
      }

      setResult({ success, failed, total: allApts.length });
    } catch (err) {
      window.alert("Lỗi tải danh sách căn hộ: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Tạo phí phát sinh cho tất cả căn hộ</h2>
        <p>Nhập thông tin phí và áp dụng cho toàn bộ căn hộ trong tòa nhà.</p>
      </div>

      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 16, maxWidth: 500 }}>
        <div className="search-field">
          <label>Tháng áp dụng</label>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
        </div>

        <div className="search-field">
          <label>Tên phí</label>
          <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="VD: Phí vệ sinh, Phí bảo trì..." style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
        </div>

        <div className="search-field">
          <label>Số tiền (VNĐ)</label>
          <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="VD: 50000" style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
          {amount > 0 && <span style={{ fontSize: "0.78rem", color: "#2563eb" }}>{formatMoney(amount)}</span>}
        </div>

        <div className="search-field">
          <label>Mô tả (không bắt buộc)</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ghi chú thêm về khoản phí..." rows={3} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db", resize: "vertical", fontFamily: "inherit" }} />
        </div>

        {result && (
          <div style={{ padding: 12, borderRadius: 8, background: result.failed.length === 0 ? "#dcfce7" : "#fef3c7", fontSize: "0.85rem" }}>
            <strong>Kết quả:</strong> Đã tạo {result.success.length}/{result.total} căn hộ
            {result.failed.length > 0 && (
              <> — Thất bại {result.failed.length} căn: {result.failed.map(f => `${f.code}: ${f.reason}`).join("; ")}</>
            )}
          </div>
        )}

        <div className="page-actions" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="secondary-btn" onClick={() => navigate("/admin/bills")}>Hủy</button>
          <button type="button" className="primary-btn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Đang tạo..." : `Tạo phí cho tất cả căn hộ`}
          </button>
        </div>
      </div>
    </section>
  );
}
