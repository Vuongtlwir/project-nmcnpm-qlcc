# Session 26/06/2026

## Các thay đổi đã thực hiện

### 1. Dashboard Admin - Thêm 4 mục mới
- **Tỷ lệ thu phí** - biểu đồ tròn 3 phần: Đã thanh toán (xanh) / Chờ xác nhận (vàng) / Chưa nộp (đỏ), hiển thị %
- **Cư dân mới nhất** - table 5 dòng gần đây, link "Xem tất cả"
- **Căn hộ chưa đóng phí** - thay mục "Hóa đơn sắp đến hạn", liệt kê căn hộ có `fee_status='unpaid'`, kèm nút Chi tiết → `/admin/residents/detail/:id`
- **Phản ánh gần đây** - 5 phản ánh mới nhất với badge trạng thái
- Đã thêm `getFeeCollection()` vào `statisticsService.js`
- Đã thêm prop `centerText` vào `DonutChart` component

### 2. Route cư trú (`/admin/residency`)
- File: `frontend/src/pages/residency/ResidencyList.jsx`
- Thống kê: Tổng cư dân / Đang cư trú / Đã chuyển đi / Căn hộ có người ở
- Bộ lọc: Tìm kiếm + Trạng thái + Phân loại
- Bảng: STT, Họ tên (link detail), Căn hộ, Phân loại, Ngày vào ở, Ngày chuyển đi, Trạng thái (badge)
- Hành động: Chi tiết + Xem căn hộ

### 3. ResidentList - Cột Ngày tạo → Thu phí
- Backend: thêm `fee_status` computed column vào query `findAll` (residentRepository)
- Frontend: thay cột Ngày tạo = badge Đã nộp/Chưa nộp
- ResidentDetail: thêm dòng Ngày tạo trong thông tin cá nhân

### 4. ResidentDetail - Fix load fees
- Xóa bộ lọc `apartment_id` khỏi `getFees()` → load tất cả fees giống user route

### 5. DB Migration - Meter readings
- File: `database/migration_001_add_meter_readings.sql`
- Thêm 4 cột vào apartments: `electricity_reading`, `water_reading`, `last_electricity_reading`, `last_water_reading`
- Đã chạy migration thành công

### 6. Tạo hóa đơn - Route `/admin/bills/create`
- File: `frontend/src/pages/fees/CreateFee.jsx` (rebuild từ stub)
- Chọn cư dân → hiển thị căn hộ, số xe, chỉ số cũ
- Nhập chỉ số điện/nước mới → auto tính tiền
- Điện: 3.000đ/kWh, Nước: 8.500đ/m³
- Gửi xe: theo số lượng xe trong DB
- Internet: 250.000đ
- Phí phát sinh (thêm/xóa dòng)
- Tạo hàng loạt + cập nhật chỉ số cũ
- Đã xóa modal cũ trong ResidentList, thay bằng modal "Phí phát sinh" nhỏ

### 7. Nhập Excel hàng loạt - Route `/admin/bills/import`
- File: `frontend/src/pages/fees/BulkCreateFee.jsx`
- Upload file Excel (.xlsx)
- Cột: Mã căn hộ | Chỉ số điện tháng | Chỉ số nước tháng
- Preview: tra cứu căn hộ, tính tiền điện/nước/gửi xe/internet
- Tạo hóa đơn + cập nhật chỉ số cho tất cả cùng lúc
- File mẫu: `database/mau_nhap_so_dien_nuoc.xlsx`

### 8. AddApartments - Thêm fields
- Input: Xe máy, Xe đạp, Ô tô, Chỉ số điện ban đầu, Chỉ số nước ban đầu

### 9. ApartmentDetail - Hiển thị chỉ số
- Thêm 2 dòng: Chỉ số điện, Chỉ số nước

### 10. Dọn dẹp
- Xóa file `Cloudflare_WARP_2026.4.1390.0.msi` trong `pages/auth/`
- Đã drop DB cũ và chạy lại schema + seed

## Routes đã thêm
| Route | Component | Mô tả |
|-------|-----------|-------|
| `/admin/bills/create` | CreateFee | Tạo hóa đơn cho 1 căn hộ |
| `/admin/bills/import` | BulkCreateFee | Nhập Excel hàng loạt |
| `/admin/residency` | ResidencyList | Quản lý cư trú |

## Files đã sửa
- `backend/src/repositories/residentRepository.js` - fee_status
- `backend/src/repositories/apartmentRepository.js` - meter fields
- `backend/src/services/statisticsService.js` - unpaid
- `frontend/src/services/statisticsService.js` - getFeeCollection
- `frontend/src/components/Chart.jsx` - centerText prop
- `frontend/src/components/Sidebar.jsx` - Cư trú
- `frontend/src/app.jsx` - routes
- `frontend/src/pages/dashboard/Dashboard.jsx` - 4 mục mới
- `frontend/src/pages/residents/ResidentList.jsx` - Thu phí + Phí phát sinh
- `frontend/src/pages/residents/ResidentDetail.jsx` - load fees, ngày tạo
- `frontend/src/pages/fees/CreateFee.jsx` - rebuild
- `frontend/src/pages/fees/BulkCreateFee.jsx` - new
- `frontend/src/pages/residency/ResidencyList.jsx` - new
- `frontend/src/pages/admin/AdminFeeManagement.jsx` - create + import buttons
- `frontend/src/pages/apartments/AddApartments.jsx` - vehicles + meter fields
- `frontend/src/pages/apartments/ApartmentDetail.jsx` - meter readings
- `database/schema.sql` - meter columns
- `database/migration_001_add_meter_readings.sql`
- `database/mau_nhap_so_dien_nuoc.xlsx`

## Seed data - Chỉ số tháng 5 test case
- Đã thêm `last_electricity_reading`, `last_water_reading`, `electricity_reading`, `water_reading` vào seed.sql
- Các căn hộ occupied có chỉ số tháng 5:
  - A-101: điện 120, nước 18
  - A-102: điện 95, nước 22
  - A-201: điện 200, nước 35
  - A-302: điện 150, nước 28
  - B-101: điện 80, nước 15
  - B-102: điện 110, nước 20
  - B-201: điện 180, nước 32
  - B-302: điện 130, nước 25
- Căn hộ empty/maintenance: chỉ số = 0
- File mẫu Excel (`mau_nhap_so_dien_nuoc.xlsx`) đã cập nhật chỉ số tháng 6 cho 8 căn hộ (cao hơn tháng 5)
- Mẫu download trong BulkCreateFee cũng cập nhật 8 dòng dữ liệu test

## Giá điện/nước
- Điện: 3.000đ/kWh (hằng số `ELECTRICITY_PRICE` trong CreateFee.jsx và BulkCreateFee.jsx)
- Nước: 8.500đ/m³ (hằng số `WATER_PRICE`)
- Internet: 250.000đ/tháng (hằng số `INTERNET_FEE`)
- Gửi xe: xe máy 200.000đ, xe đạp 100.000đ, ô tô 1.000.000đ
