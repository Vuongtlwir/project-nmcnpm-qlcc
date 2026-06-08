import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../assets/css/login.css";

const accounts = [
  {
    username: "user1",
    password: "user123",
    role: "resident",
    name: "Nguyễn Văn A",
  },
  {
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Admin Quản trị",
  },
];

export default function Login() {
  const [role, setRole] = useState("resident");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin" : "/", {
        replace: true,
      });
    }
  }, [user, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const account = accounts.find(
      (item) =>
        item.username === username.trim() &&
        item.password === password &&
        item.role === role
    );

    if (!account) {
      setError("Sai tên đăng nhập hoặc mật khẩu. Vui lòng thử lại.");
      return;
    }

    login(account);
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f7fb",
      }}
    >
      <div className="login-container">
        <div className="login-header">
          <h1>Apartment Manager</h1>
          <p>Hệ thống quản lý chung cư</p>
        </div>

        <div className="role-tabs">
          <button
            className={`role-tab-btn ${role === "resident" ? "active" : ""}`}
            type="button"
            onClick={() => {
              setRole("resident");
              setError("");
            }}
          >
            👤 Cư dân
          </button>

          <button
            className={`role-tab-btn ${role === "admin" ? "active" : ""}`}
            type="button"
            onClick={() => {
              setRole("admin");
              setError("");
            }}
          >
            🔑 Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Nhập tên đăng nhập"
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Nhập mật khẩu"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="checkbox-group">
            <label
              style={{
                margin: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <input type="checkbox" />
              <span style={{ marginLeft: "6px" }}>
                Ghi nhớ đăng nhập
              </span>
            </label>

            <Link to="/forgot-password" className="forgot-password">
              Quên mật khẩu?
            </Link>
          </div>

          <button className="login-btn" type="submit">
            Đăng nhập
          </button>
        </form>

      </div>
    </div>
  );
}
