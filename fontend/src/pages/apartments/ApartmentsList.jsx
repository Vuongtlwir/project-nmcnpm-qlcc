import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

const apartments = [
  { id: "A-101", building: "Tòa A", owner: "Nguyễn Văn A", area: "78 m²", status: "Đã bán" },
  { id: "B-302", building: "Tòa B", owner: "Trần Thị B", area: "60 m²", status: "Trống" },
  { id: "C-205", building: "Tòa C", owner: "Lê Văn C", area: "95 m²", status: "Đã bán" },
];

const getStatusClass = (status) => {
  if (status === "Trống") return "status-pending";
  if (status === "Đã bán") return "status-paid";
  return "status-overdue";
};

export default function ApartmentsList() {
  const [search, setSearch] = useState("");

  const filteredApartments = useMemo(
    () =>
      apartments.filter((item) => {
        const keyword = search.toLowerCase();
        return (
          item.id.toLowerCase().includes(keyword) ||
          item.building.toLowerCase().includes(keyword) ||
          item.owner.toLowerCase().includes(keyword)
        );
      }),
    [search]
  );

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Quản lý căn hộ</h2>
        <p>Xem danh sách căn hộ, trạng thái và truy cập nhanh chi tiết mỗi căn.</p>
      </div>

      <div className="page-actions">
        <div className="search-field">
          <label htmlFor="apartment-search">Tìm căn hộ</label>
          <input
            id="apartment-search"
            type="text"
            placeholder="Mã căn hộ, tòa nhà hoặc chủ sở hữu..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="action-group">
          <Link to="/admin/apartments/add" className="primary-btn">
            Thêm căn hộ
          </Link>
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Mã căn hộ</th>
              <th>Tòa nhà</th>
              <th>Chủ sở hữu</th>
              <th>Diện tích</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredApartments.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.building}</td>
                <td>{item.owner}</td>
                <td>{item.area}</td>
                <td>
                  <span className={`status-pill ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <Link to={`/admin/apartments/${item.id}`} className="secondary-btn">
                    Xem chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
