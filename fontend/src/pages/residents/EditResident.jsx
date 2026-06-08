import { useNavigate, useParams } from "react-router-dom";

const residents = [
  { id: "R-001", name: "Nguyễn Văn A", unit: "A-101", phone: "0905 123 456", email: "a@example.com", status: "Đang thuê" },
  { id: "R-002", name: "Trần Thị B", unit: "B-302", phone: "0916 234 567", email: "b@example.com", status: "Trống" },
];

export default function EditResident() {
  const { id } = useParams();
  const navigate = useNavigate();

  const resident = residents.find((item) => item.id === id) || residents[0];

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Chỉnh sửa cư dân</h2>
        <p>Điền thông tin cập nhật và lưu lại để quản lý cư dân chính xác hơn.</p>
      </div>

      <div className="page-card" style={{ marginTop: "18px", padding: "22px" }}>
        <div className="search-field">
          <label>Tên cư dân</label>
          <input type="text" defaultValue={resident.name} />
        </div>
        <div className="search-field">
          <label>Căn hộ</label>
          <input type="text" defaultValue={resident.unit} />
        </div>
        <div className="search-field">
          <label>Số điện thoại</label>
          <input type="text" defaultValue={resident.phone} />
        </div>
        <div className="search-field">
          <label>Email</label>
          <input type="email" defaultValue={resident.email} />
        </div>
        <div className="search-field">
          <label>Trạng thái</label>
          <input type="text" defaultValue={resident.status} />
        </div>

        <div className="page-actions" style={{ justifyContent: "flex-end" }}>
          <button className="secondary-btn" type="button" onClick={() => navigate("/admin/residents")}>Hủy</button>
          <button className="primary-btn" type="button">Lưu thay đổi</button>
        </div>
      </div>
    </section>
  );
}
