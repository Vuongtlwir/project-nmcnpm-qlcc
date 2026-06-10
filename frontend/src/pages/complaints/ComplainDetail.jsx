import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

const complaints = [
  {
    id: "C-101",
    title: "Thang máy không hoạt động",
    type: "Kỹ thuật",
    date: "01/06/2026",
    details: "Thang máy tòa A chạy chập chờn, đôi khi dừng giữa tầng.",
    status: "Đang xử lý",
  },
  {
    id: "C-102",
    title: "Rò rỉ nước ở ban công",
    type: "Cơ sở vật chất",
    date: "25/05/2026",
    details: "Nước rỉ từ ban công tầng 8, cần kiểm tra ống thoát nước.",
    status: "Đã hoàn thành",
  },
];

export default function ComplainDetail() {
  const { id } = useParams();
  const complaint = useMemo(
    () => complaints.find((item) => item.id === id),
    [id]
  );

  if (!complaint) {
    return (
      <section className="page-card">
        <div className="page-card-header">
          <h2>Không tìm thấy phản ánh</h2>
          <p>Vui lòng kiểm tra lại mã phản ánh hoặc trở về trang danh sách.</p>
        </div>
        <Link to="/complaints" className="secondary-btn">Trở về</Link>
      </section>
    );
  }

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Chi tiết phản ánh</h2>
        <p>Xem nội dung, trạng thái và lịch sử xử lý của phản ánh.</p>
      </div>

      <div className="page-card" style={{ marginTop: "18px", padding: "22px" }}>
        <div className="summary-grid">
          <div className="summary-card">
            <span className="summary-label">Mã</span>
            <strong>{complaint.id}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Tiêu đề</span>
            <strong>{complaint.title}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Loại</span>
            <strong>{complaint.type}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Ngày</span>
            <strong>{complaint.date}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Trạng thái</span>
            <strong>{complaint.status}</strong>
          </div>
        </div>

        <div style={{ marginTop: "18px" }}>
          <p>{complaint.details}</p>
        </div>

        <div className="page-actions" style={{ justifyContent: "flex-end" }}>
          <Link to="/complaints" className="secondary-btn">Quay lại</Link>
        </div>
      </div>
    </section>
  );
}
