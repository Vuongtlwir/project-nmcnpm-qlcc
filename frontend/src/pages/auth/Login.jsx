import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../assets/css/login.css";

export default function Login() {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!username.trim() || !password) {
      setError("Vui lòng nhập tên đăng nhập và mật khẩu");
      return;
    }

    try {
      setError("");
      await login({ username: username.trim(), password });
      // Navigation happens in AuthContext via useEffect
    } catch (err) {
      console.error("Login failed", err);
      setError(err?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
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
