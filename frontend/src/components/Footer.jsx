export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Apartment Management System. All rights reserved.</p>
      <div className="footer-links">
        <a href="#">Chính sách bảo mật</a>
        <a href="#">Điều khoản sử dụng</a>
        <a href="#">Hỗ trợ</a>
      </div>
    </footer>
  );
}
