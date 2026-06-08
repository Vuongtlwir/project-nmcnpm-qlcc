import { useNavigate, useState } from "react";

export default function CreateFee() {
  const [owner, setOwner] = useState("");
  const [type, setType] = useState("Phí dịch vụ");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/admin/bills");
  };

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Tạo hóa đơn mới</h2>
        <p>Nhập thông tin hóa đơn để gửi tới cư dân hoặc quản lý nội bộ.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: "18px" }}>
        <div className="search-field">
          <label htmlFor="owner">Tên hộ gia đình</label>
          <input
            id="owner"
            type="text"
            placeholder="Nguyễn Văn A"
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
          />
        </div>
        <div className="search-field">
          <label htmlFor="type">Loại phí</label>
          <select id="type" value={type} onChange={(event) => setType(event.target.value)}>
            <option>Phí dịch vụ</option>
            <option>Tiền điện</option>
            <option>Tiền nước</option>
            <option>Phí gửi xe</option>
          </select>
        </div>
        <div className="search-field">
          <label htmlFor="amount">Số tiền</label>
          <input
            id="amount"
            type="text"
            placeholder="1.250.000"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>
        <div className="search-field">
          <label htmlFor="due-date">Hạn nộp</label>
          <input
            id="due-date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>

        <div className="page-actions" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="secondary-btn" onClick={() => navigate("/admin/bills")}>Hủy</button>
          <button type="submit" className="primary-btn">Tạo hóa đơn</button>
        </div>
      </form>
    </section>
  );
}
