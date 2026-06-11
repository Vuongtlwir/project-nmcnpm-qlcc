import { useEffect, useState } from "react";
import Chart from "../../components/Chart";
import { loadResidents } from "../../services/residentService";

export default function Statistics() {
  const [totalResidents, setTotalResidents] = useState(0);

  useEffect(() => {
    setTotalResidents(loadResidents().length);
  }, []);

  const stats = [
    { title: "Tổng cư dân", value: totalResidents },
    { title: "Căn hộ trống", value: 27 },
    { title: "Hóa đơn chưa thanh toán", value: 16 },
    { title: "Yêu cầu xử lý", value: 8 },
  ];

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Thống kê quản trị</h2>
        <p>Nhìn nhanh dữ liệu vận hành Eternis City và các chỉ số quan trọng trong hệ thống.</p>
      </div>

      <div className="summary-grid" style={{ marginTop: "20px" }}>
        {stats.map((item) => (
          <Chart key={item.title} title={item.title} value={item.value} />
        ))}
      </div>

      <div className="page-card" style={{ marginTop: "24px", padding: "22px" }}>
        <h3>Thông tin vận hành</h3>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Mục</th>
                <th>Giá trị</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tỷ lệ lấp đầy</td>
                <td>86%</td>
              </tr>
              <tr>
                <td>Hoạt động mới trong tháng</td>
                <td>54</td>
              </tr>
              <tr>
                <td>Pin tòa nhà</td>
                <td>Ổn định</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
