import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await api.post("/auth/forgot-password", { email });
      setMessage(response.data?.message || "Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu sẽ được gửi.");
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="login-container">
        <div className="login-header">
          <h1>Quên Mật Khẩu</h1>
          <p>Nhập email để nhận liên kết đặt lại mật khẩu</p>
        </div>

        {message && (
          <div
            style={{
              background: "#dcfce7",
              color: "#166534",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Gửi yêu cầu
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <Link to="/login" style={{ color: "#3b82f6", textDecoration: "none" }}>
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
