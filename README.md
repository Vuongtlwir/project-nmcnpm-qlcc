# Eternis City - Hệ thống Quản lý Chung cư

Hệ thống quản lý chung cư toàn diện, hỗ trợ quản lý cư dân, căn hộ, phí dịch vụ, hóa đơn, phản ánh, thông báo và chat trực tuyến giữa ban quản lý và cư dân.

---

## Tính năng chính

### Quản lý cư dân
- Thêm, sửa, xóa cư dân
- Tìm kiếm, lọc theo mã căn hộ, họ tên, số CCCD
- Liên kết tài khoản người dùng

### Quản lý căn hộ
- Thêm, sửa, xóa thông tin căn hộ
- Quản lý loại căn hộ, diện tích, số phòng
- Đếm số lượng xe gắn máy, xe đạp, ô tô

### Quản lý phí & Hóa đơn
- Tạo hóa đơn riêng cho từng căn hộ
- Các loại phí: quản lý, gửi xe (ô tô/xe máy/xe đạp), đóng góp, phát sinh
- Chọn tháng tạo hóa đơn
- Lọc hóa đơn theo căn hộ
- Thanh toán hóa đơn (đã đóng / chưa đóng)

### Phản ánh & Xử lý
- Gửi phản ánh từ cư dân (cơ sở vật chất, an toàn, vệ sinh, âm thanh)
- Theo dõi trạng thái: chờ xử lý, đang xử lý, hoàn thành, từ chối
- Ban quản lý cập nhật trạng thái và phản hồi

### Chat trực tuyến
- Chat giữa admin và từng cư dân
- Badge đỏ thông báo tin nhắn chưa đọc
- Tự động gửi tin nhắn chào khi mở hội thoại lần đầu

### Dashboard & Thống kê
- Tổng quan số liệu: số căn hộ, cư dân, phí thu, phản ánh
- Biểu đồ thống kê

### Phân quyền
- **Admin**: toàn quyền quản lý hệ thống
- **User (Cư dân)**: xem thông tin căn hộ, hóa đơn, gửi phản ánh, chat

---

## Kiến trúc hệ thống

```
┌──────────────┐     ┌──────────────┐     ┌──────────┐
│  React SPA   │────▶│  Express API │────▶│  MySQL   │
│  (Vite)      │     │  (REST)      │     │          │
└──────────────┘     └──────────────┘     └──────────┘
      │                     │
  localhost:5173       localhost:3000
```

- **Frontend**: React 18 + Vite, quản lý state bằng Context API
- **Backend**: Node.js + Express, kiến trúc MVC (Controller-Service-Repository)
- **Database**: MySQL với charset utf8mb4
- **Authentication**: JWT (JSON Web Token)

---

## Cấu trúc thư mục

```
Eternis-City-QLCC/
├── backend/
│   ├── src/
│   │   ├── config/          # Cấu hình database, jwt
│   │   ├── controllers/     # Xử lý request HTTP
│   │   ├── middlewares/      # Auth, error handling
│   │   ├── repositories/    # Truy vấn database
│   │   ├── routes/          # Định tuyến API
│   │   ├── services/        # Logic nghiệp vụ
│   │   ├── validations/     # Validate dữ liệu đầu vào
│   │   └── utils/           # Hàm tiện ích
│   ├── scripts/             # Script seed database
│   ├── .env.example         # Mẫu cấu hình môi trường
│   ├── package.json
│   └── server.js            # Entry point
├── frontend/
│   ├── public/
│   │   └── avt/             # Ảnh nền login
│   ├── src/
│   │   ├── assets/          # CSS, ảnh
│   │   ├── components/      # Component dùng chung
│   │   ├── context/         # Context API (Auth)
│   │   ├── hooks/           # Custom hooks
│   │   ├── layouts/         # Giao diện layout
│   │   ├── pages/           # Các trang
│   │   │   ├── admin/       # Trang admin
│   │   │   ├── apartments/  # Quản lý căn hộ
│   │   │   ├── auth/        # Đăng nhập
│   │   │   ├── complaints/  # Phản ánh
│   │   │   ├── dashboard/   # Dashboard
│   │   │   ├── fees/        # Phí & hóa đơn
│   │   │   ├── notifications/# Thông báo
│   │   │   ├── residents/   # Quản lý cư dân
│   │   │   ├── statistics/  # Thống kê
│   │   │   └── user/        # Trang cư dân
│   │   ├── routes/          # Cấu hình router
│   │   └── services/        # Gọi API
│   ├── .env                 # Cấu hình frontend
│   ├── vite.config.js
│   └── package.json
├── database/
│   ├── schema.sql           # Tạo cấu trúc bảng
│   └── seed.sql             # Dữ liệu mẫu
├── start.bat                # Chạy dự án (Windows)
└── README.md
```

---

## Cài đặt và chạy

### Yêu cầu
- **Node.js** >= 18
- **MySQL** >= 8.0
- **npm** (đi kèm Node.js)

### Cách 1: Chạy bằng start.bat (Windows)

```cmd
./start.bat
```

Script tự động:
1. Kiểm tra Node.js và MySQL
2. Cài đặt dependencies (`npm install`)
3. Tạo file `.env` từ `.env.example` (nếu chưa có)
4. Import database (schema + dữ liệu mẫu)
5. Khởi động backend (`localhost:3000`) và frontend (`localhost:5173`)

> Nếu MySQL dùng mật khẩu khác `root`, đặt biến trước khi chạy:
> ```cmd
> set MYSQL_PASSWORD=matkhau_cua_ban
> ./start.bat
> ```

### Cách 2: Thủ công

**1. Clone và cài đặt**

```bash
git clone <url-repo>
cd project-nmcnpm-qlcc
```

**2. Cấu hình backend**

```bash
cd backend
copy .env.example .env        # Windows
# cp .env.example .env        # Linux/Mac
```

Sửa file `.env`:
- `DB_PASSWORD` — mật khẩu MySQL của bạn
- `JWT_SECRET` — khóa bí mật cho JWT (tự đặt)

**3. Cài đặt dependencies**

```bash
cd backend && npm install
cd ..
cd frontend && npm install
```

**4. Import database**

```bash
cd database
mysql --default-character-set=utf8mb4 -u root -p qlcc_db < seed.sql
mysql --default-character-set=utf8mb4 -u root -p qlcc_db < seed.sql
```

**5. Chạy**

```bash
cd backend && npm run dev     # Cổng 3000
cd frontend && npm run dev    # Cổng 5173
```

### Tài khoản mặc định

| Vai trò | Tên đăng nhập | Mật khẩu |
|---------|---------------|----------|
| Admin   | `admin`       | `123456` |
| Cư dân  | `user1`       | `123456` |
| Cư dân  | `user2`       | `123456` |

---
