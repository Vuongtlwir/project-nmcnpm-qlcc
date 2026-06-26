import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getResidentById, updateResident } from "../../services/residentService";
import { getApartments } from "../../services/apartmentService";

export default function EditResident() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resident, setResident] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("male");
  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [relation, setRelation] = useState("tenant");
  const [apartmentId, setApartmentId] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [motorbikes, setMotorbikes] = useState(0);
  const [bicycles, setBicycles] = useState(0);
  const [cars, setCars] = useState(0);
  const [motorbikePlates, setMotorbikePlates] = useState("");
  const [carPlates, setCarPlates] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getResidentById(id);
        if (data) {
          setResident(data);
          setName(data.full_name || "");
          setDateOfBirth(data.date_of_birth || "");
          setGender(data.gender || "male");
          setNationalId(data.id_card || "");
          setPhone(data.phone || "");
          setEmail(data.email || "");
          setRelation(data.relation || "tenant");
          setApartmentId(data.apartment_id?.toString() || "");
          setMoveInDate(data.move_in_date || "");
          setMotorbikes(data.motorbikes ?? 0);
          setBicycles(data.bicycles ?? 0);
          setCars(data.cars ?? 0);
          if (data.vehicle_plates) {
            try {
              const plates = JSON.parse(data.vehicle_plates);
              setMotorbikePlates((plates.motorbikes || []).join(", "));
              setCarPlates((plates.cars || []).join(", "));
            } catch { /* ignore */ }
          }
        }
      } catch (err) {
        setError("Không thể tải dữ liệu cư dân.");
      }
    };

    const loadApartments = async () => {
      try {
        const list = await getApartments();
        setApartments(list || []);
      } catch (err) {
        console.error("Lỗi khi tải danh sách căn hộ:", err);
      }
    };

    loadData();
    loadApartments();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!name.trim() || !apartmentId || !dateOfBirth || !nationalId.trim() || !phone.trim() || !email.trim() || !moveInDate) {
      setError("Vui lòng nhập đầy đủ thông tin cư dân.");
      return;
    }

    const payload = {
      full_name: name.trim(),
      apartment_id: Number(apartmentId),
      date_of_birth: dateOfBirth,
      gender,
      id_card: nationalId.trim(),
      phone: phone.trim(),
      email: email.trim(),
      relation,
      move_in_date: moveInDate,
      motorbikes: Number(motorbikes) || 0,
      bicycles: Number(bicycles) || 0,
      cars: Number(cars) || 0,
      vehicle_plates: JSON.stringify({
        motorbikes: motorbikePlates.split(",").map(s => s.trim()).filter(Boolean),
        cars: carPlates.split(",").map(s => s.trim()).filter(Boolean),
      }),
    };

    try {
      setLoading(true);
      await updateResident(id, payload);
      setSuccessMessage("Cập nhật cư dân thành công.");
      setTimeout(() => navigate("/admin/residents/detail/" + id), 600);
    } catch (err) {
      const apiMessage = err?.response?.data?.message || err?.message || "Lỗi khi cập nhật cư dân";
      setError(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  const currentApartment = apartments.find((item) => item.id?.toString() === apartmentId);
  const apartmentOptions = resident
    ? [...new Map(
        [...(currentApartment ? [currentApartment] : []), ...apartments]
          .map((item) => [item.id?.toString(), item])
      ).values()]
    : apartments;

  return (
    <section className="page-card">
      <div className="page-card-header">
        <h2>Chỉnh sửa cư dân</h2>
        <p>Điền thông tin cập nhật và lưu lại để quản lý cư dân chính xác hơn.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: "18px" }}>
        <div className="form-grid">
          <div className="form-card">
            <h3>Thông tin cá nhân</h3>
            <div className="search-field">
              <label htmlFor="name">Họ và tên</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="search-field">
              <label htmlFor="dateOfBirth">Ngày sinh</label>
              <input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(event) => setDateOfBirth(event.target.value)}
              />
            </div>
            <div className="search-field">
              <label htmlFor="gender">Giới tính</label>
              <select
                id="gender"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div className="search-field">
              <label htmlFor="nationalId">Số CMND/CCCD</label>
              <input
                id="nationalId"
                type="text"
                value={nationalId}
                onChange={(event) => setNationalId(event.target.value)}
              />
            </div>
          </div>

          <div className="form-card">
            <h3>Thông tin liên hệ & căn hộ</h3>
            <div className="search-field">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                id="phone"
                type="text"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>
            <div className="search-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="search-field">
              <label htmlFor="apartment">Chọn căn hộ</label>
              <select
                id="apartment"
                value={apartmentId}
                onChange={(event) => setApartmentId(event.target.value)}
              >
                <option value="">Chọn căn hộ</option>
                {apartmentOptions.map((apartment) => (
                  <option key={apartment.id} value={apartment.id}>
                    {apartment.code} - {apartment.building} {apartment.area ? `(${apartment.area} m²)` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="search-field">
              <label htmlFor="relation">Mối quan hệ</label>
              <select
                id="relation"
                value={relation}
                onChange={(event) => setRelation(event.target.value)}
              >
                <option value="owner">Chủ sở hữu</option>
                <option value="tenant">Người thuê</option>
              </select>
            </div>
            <div className="search-field">
              <label htmlFor="moveInDate">Ngày chuyển vào</label>
              <input
                id="moveInDate"
                type="date"
                value={moveInDate}
                onChange={(event) => setMoveInDate(event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-card">
          <h3>Phương tiện</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div className="search-field">
              <label htmlFor="motorbikes">Xe máy</label>
              <input id="motorbikes" type="number" min="0" value={motorbikes} onChange={(e) => setMotorbikes(e.target.value)} placeholder="0" />
            </div>
            <div className="search-field">
              <label htmlFor="bicycles">Xe đạp</label>
              <input id="bicycles" type="number" min="0" value={bicycles} onChange={(e) => setBicycles(e.target.value)} placeholder="0" />
            </div>
            <div className="search-field">
              <label htmlFor="cars">Ô tô</label>
              <input id="cars" type="number" min="0" value={cars} onChange={(e) => setCars(e.target.value)} placeholder="0" />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="search-field">
              <label htmlFor="motorbikePlates">Biển số xe máy</label>
              <input id="motorbikePlates" type="text" value={motorbikePlates} onChange={(e) => setMotorbikePlates(e.target.value)} placeholder="29F1-12345, 30B-67890" />
            </div>
            <div className="search-field">
              <label htmlFor="carPlates">Biển số ô tô</label>
              <input id="carPlates" type="text" value={carPlates} onChange={(e) => setCarPlates(e.target.value)} placeholder="30A-99999" />
            </div>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <div className="page-actions" style={{ justifyContent: "space-between", gap: "16px" }}>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/admin/residents")}
          >
            Hủy
          </button>
          <button
            type="button"
            className="primary-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </section>
  );
}
