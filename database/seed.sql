USE qlcc_db;

-- Clear tables first to ensure clean seed
DELETE FROM service_bookings;
DELETE FROM services;
DELETE FROM messages;
DELETE FROM notifications;
DELETE FROM complaints;
DELETE FROM payments;
DELETE FROM fees;
DELETE FROM residents;
DELETE FROM apartments;
DELETE FROM users;

-- Reset Auto-increments
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE apartments AUTO_INCREMENT = 34;
ALTER TABLE residents AUTO_INCREMENT = 30;
ALTER TABLE fees AUTO_INCREMENT = 1;
ALTER TABLE payments AUTO_INCREMENT = 1;
ALTER TABLE complaints AUTO_INCREMENT = 1;
ALTER TABLE notifications AUTO_INCREMENT = 1;
ALTER TABLE services AUTO_INCREMENT = 1;
ALTER TABLE service_bookings AUTO_INCREMENT = 1;
ALTER TABLE messages AUTO_INCREMENT = 1;

-- Seed Users
-- Password for all users: '123456' (bcrypt hash: $2a$10$AbYD1tDuaiAFhYOEjoePWuJJQ2rfXF2ZLr6q1i39/bwaQDWvmw9Bm)
INSERT INTO users (id, username, email, password, role, full_name, phone, is_active) VALUES
(1, 'admin', 'admin@gmail.com', '$2a$10$AbYD1tDuaiAFhYOEjoePWuJJQ2rfXF2ZLr6q1i39/bwaQDWvmw9Bm', 'admin', 'Nguyễn Quang Huy', '0912345678', 1),
(2, 'user1', 'user1@gmail.com', '$2a$10$AbYD1tDuaiAFhYOEjoePWuJJQ2rfXF2ZLr6q1i39/bwaQDWvmw9Bm', 'user', 'Trần Lê Vương', '0987654321', 1),
(3, 'user2', 'user2@gmail.com', '$2a$10$AbYD1tDuaiAFhYOEjoePWuJJQ2rfXF2ZLr6q1i39/bwaQDWvmw9Bm', 'user', 'Phạm Việt Cường', '0901234567', 1);

-- Seed Apartments
INSERT INTO apartments (id, code, floor, building, area, num_rooms, motorbikes, bicycles, cars, electricity_reading, water_reading, last_electricity_reading, last_water_reading, status, owner_name, owner_phone) VALUES
(1, 'A-101', 1, 'Tòa A', 75.5, 2, 1, 1, 0, 120, 18, 120, 18, 'occupied', 'Trần Lê Vương', '0987654321'),
(2, 'A-102', 1, 'Tòa A', 75.5, 2, 2, 1, 1, 95, 22, 95, 22, 'occupied', 'Phạm Việt Cường', '0901234567'),
(3, 'A-201', 2, 'Tòa A', 110.0, 3, 1, 0, 1, 200, 35, 200, 35, 'occupied', 'Lê Hoàng Long', '0933445566'),
(4, 'A-202', 2, 'Tòa A', 50.0, 1, 0, 0, 0, 0, 0, 0, 0, 'empty', NULL, NULL),
(5, 'A-301', 3, 'Tòa A', 90.0, 2, 1, 1, 0, 0, 0, 0, 0, 'maintenance', NULL, NULL),
(6, 'A-302', 3, 'Tòa A', 90.0, 2, 2, 0, 1, 150, 28, 150, 28, 'occupied', 'Nguyễn Thị Hoa', '0944556677'),
(7, 'B-101', 1, 'Tòa B', 75.5, 2, 1, 1, 0, 80, 15, 80, 15, 'occupied', 'Nguyễn Việt Cường', '0987659321'),
(8, 'B-102', 1, 'Tòa B', 75.5, 2, 2, 1, 1, 110, 20, 110, 20, 'occupied', 'Khổng Quốc Anh', '0901789567'),
(9, 'B-201', 2, 'Tòa B', 110.0, 3, 1, 0, 1, 180, 32, 180, 32, 'occupied', 'Phan Long Giang', '0934915566'),
(10, 'B-202', 2, 'Tòa B', 50.0, 1, 0, 0, 0, 0, 0, 0, 0, 'empty', NULL, NULL),
(11, 'B-301', 3, 'Tòa B', 90.0, 2, 1, 1, 0, 0, 0, 0, 0, 'maintenance', NULL, NULL),
(12, 'B-302', 3, 'Tòa B', 90.0, 2, 0, 1, 1, 130, 25, 130, 25, 'occupied', 'Phạm Lê Anh', '0944128677'),
(13, 'A-103', 1, 'Tòa A', 75.5, 2, 1, 0, 0, 0, 0, 0, 0, 'occupied', 'Nguyễn Văn An', '0911111111'),
(14, 'A-203', 2, 'Tòa A', 75.5, 2, 1, 1, 0, 0, 0, 0, 0, 'occupied', 'Trần Thị Mai', '0922222222'),
(15, 'A-303', 3, 'Tòa A', 90.0, 2, 1, 0, 0, 0, 0, 0, 0, 'occupied', 'Lê Văn Tuấn', '0933333333'),
(16, 'A-401', 4, 'Tòa A', 110.0, 3, 2, 0, 1, 0, 0, 0, 0, 'occupied', 'Phạm Thị Lan', '0944444444'),
(17, 'A-402', 4, 'Tòa A', 75.5, 2, 0, 1, 0, 0, 0, 0, 0, 'occupied', 'Hoàng Văn Hùng', '0955555555'),
(18, 'A-403', 4, 'Tòa A', 50.0, 1, 0, 0, 0, 0, 0, 0, 0, 'occupied', 'Vũ Thị Hồng', '0966666666'),
(19, 'A-501', 5, 'Tòa A', 110.0, 3, 1, 0, 1, 0, 0, 0, 0, 'occupied', 'Đặng Văn Khoa', '0977777777'),
(20, 'A-502', 5, 'Tòa A', 90.0, 2, 2, 0, 0, 0, 0, 0, 0, 'occupied', 'Bùi Thị Ngọc', '0988888888'),
(21, 'A-503', 5, 'Tòa A', 75.5, 2, 1, 0, 0, 0, 0, 0, 0, 'occupied', 'Ngô Văn Phúc', '0999999999'),
(22, 'B-103', 1, 'Tòa B', 75.5, 2, 1, 1, 0, 0, 0, 0, 0, 'occupied', 'Dương Thị Hạnh', '0901111111'),
(23, 'B-203', 2, 'Tòa B', 75.5, 2, 1, 0, 0, 0, 0, 0, 0, 'occupied', 'Lý Văn Tài', '0902222222'),
(24, 'B-303', 3, 'Tòa B', 90.0, 2, 2, 0, 0, 0, 0, 0, 0, 'occupied', 'Trịnh Thị Thu', '0903333333'),
(25, 'B-401', 4, 'Tòa B', 110.0, 3, 1, 0, 1, 0, 0, 0, 0, 'occupied', 'Mai Văn Đức', '0904444444'),
(26, 'B-402', 4, 'Tòa B', 75.5, 2, 0, 1, 0, 0, 0, 0, 0, 'occupied', 'Tô Thị Hương', '0905555555'),
(27, 'B-403', 4, 'Tòa B', 75.5, 2, 0, 0, 0, 0, 0, 0, 0, 'occupied', 'Hà Văn Bình', '0906666666'),
(28, 'B-501', 5, 'Tòa B', 90.0, 2, 1, 0, 0, 0, 0, 0, 0, 'occupied', 'Lương Thị Phương', '0907777777'),
(29, 'B-502', 5, 'Tòa B', 90.0, 2, 2, 0, 0, 0, 0, 0, 0, 'occupied', 'Đỗ Văn Sang', '0908888888'),
(30, 'B-503', 5, 'Tòa B', 75.5, 2, 1, 1, 0, 0, 0, 0, 0, 'occupied', 'Võ Thị Yến', '0909999999'),
(31, 'C-101', 1, 'Tòa C', 75.5, 2, 1, 0, 0, 0, 0, 0, 0, 'occupied', 'Phùng Văn Lợi', '0910000001'),
(32, 'C-102', 1, 'Tòa C', 75.5, 2, 1, 1, 0, 0, 0, 0, 0, 'occupied', 'Lại Thị Hà', '0910000002'),
(33, 'C-103', 1, 'Tòa C', 50.0, 1, 0, 0, 0, 0, 0, 0, 0, 'occupied', 'Tạ Văn Nghĩa', '0910000003');

-- Seed Residents
INSERT INTO residents (id, resident_code, apartment_id, user_id, full_name, date_of_birth, gender, id_card, phone, email, relation, status, move_in_date, move_out_date) VALUES
(1, 'CD-000001', 1, 2, 'Trần Lê Vương', '1995-05-15', 'male', '123456789', '0987654321', 'user1@qlcc.com', 'owner', 'active', '2025-01-10', NULL),
(2, 'CD-000002', 2, 3, 'Phạm Việt Cường', '1992-12-01', 'male', '234567890', '0901234567', 'user2@qlcc.com', 'owner', 'active', '2025-02-15', NULL),
(3, 'CD-000003', 3, NULL, 'Lê Hoàng Long', '1988-06-25', 'male', '345678901', '0933445566', 'long.le@gmail.com', 'owner', 'active', '2024-05-20', NULL),
(4, 'CD-000004', 6, NULL, 'Nguyễn Thị Hoa', '1980-04-30', 'female', '456789012', '0944556677', 'hoa.nguyen@gmail.com', 'owner', 'active', '2024-12-01', NULL),
(5, 'CD-000005', 7, NULL, 'Nguyễn Việt Cường', '1995-05-15', 'male', '123456790', '0987659321', 'cuongle@gmail.com', 'owner', 'active', '2025-01-10', NULL),
(6, 'CD-000006', 8, NULL, 'Khổng Quốc Anh', '1992-12-01', 'male', '234567891', '0901789567', 'anhquoc@gmail.com', 'owner', 'active', '2025-02-15', NULL),
(7, 'CD-000007', 9, NULL, 'Phan Long Giang', '1988-06-25', 'male', '345678902', '0934915566', 'long.le@gmail.com', 'owner', 'active', '2024-05-20', NULL),
(8, 'CD-000008', 12, NULL, 'Phạm Lê Anh', '1980-04-30', 'female', '456789013', '0944128677', 'hoa.nguyen@gmail.com', 'owner', 'active', '2024-12-01', NULL),
(9, 'CD-000009', 13, NULL, 'Nguyễn Văn An', '1990-03-10', 'male', '123456801', '0911111111', 'an.nguyen@email.com', 'owner', 'active', '2025-06-01', NULL),
(10, 'CD-000010', 14, NULL, 'Trần Thị Mai', '1987-07-22', 'female', '123456802', '0922222222', 'mai.tran@email.com', 'owner', 'active', '2025-06-01', NULL),
(11, 'CD-000011', 15, NULL, 'Lê Văn Tuấn', '1993-11-05', 'male', '123456803', '0933333333', 'tuan.le@email.com', 'owner', 'active', '2025-06-05', NULL),
(12, 'CD-000012', 16, NULL, 'Phạm Thị Lan', '1985-09-18', 'female', '123456804', '0944444444', 'lan.pham@email.com', 'owner', 'active', '2025-06-10', NULL),
(13, 'CD-000013', 17, NULL, 'Hoàng Văn Hùng', '1991-04-02', 'male', '123456805', '0955555555', 'hung.hoang@email.com', 'owner', 'active', '2025-06-10', NULL),
(14, 'CD-000014', 18, NULL, 'Vũ Thị Hồng', '1994-08-15', 'female', '123456806', '0966666666', 'hong.vu@email.com', 'owner', 'active', '2025-06-12', NULL),
(15, 'CD-000015', 19, NULL, 'Đặng Văn Khoa', '1986-12-30', 'male', '123456807', '0977777777', 'khoa.dang@email.com', 'owner', 'active', '2025-06-15', NULL),
(16, 'CD-000016', 20, NULL, 'Bùi Thị Ngọc', '1992-05-20', 'female', '123456808', '0988888888', 'ngoc.bui@email.com', 'owner', 'active', '2025-06-15', NULL),
(17, 'CD-000017', 21, NULL, 'Ngô Văn Phúc', '1989-01-12', 'male', '123456809', '0999999999', 'phuc.ngo@email.com', 'owner', 'active', '2025-06-18', NULL),
(18, 'CD-000018', 22, NULL, 'Dương Thị Hạnh', '1995-06-28', 'female', '123456810', '0901111111', 'hanh.duong@email.com', 'owner', 'active', '2025-06-20', NULL),
(19, 'CD-000019', 23, NULL, 'Lý Văn Tài', '1988-10-14', 'male', '123456811', '0902222222', 'tai.ly@email.com', 'owner', 'active', '2025-06-20', NULL),
(20, 'CD-000020', 24, NULL, 'Trịnh Thị Thu', '1993-02-25', 'female', '123456812', '0903333333', 'thu.trinh@email.com', 'owner', 'active', '2025-06-22', NULL),
(21, 'CD-000021', 25, NULL, 'Mai Văn Đức', '1987-07-07', 'male', '123456813', '0904444444', 'duc.mai@email.com', 'owner', 'active', '2025-06-25', NULL),
(22, 'CD-000022', 26, NULL, 'Tô Thị Hương', '1991-09-19', 'female', '123456814', '0905555555', 'huong.to@email.com', 'owner', 'active', '2025-06-25', NULL),
(23, 'CD-000023', 27, NULL, 'Hà Văn Bình', '1986-04-04', 'male', '123456815', '0906666666', 'binh.ha@email.com', 'owner', 'active', '2025-07-01', NULL),
(24, 'CD-000024', 28, NULL, 'Lương Thị Phương', '1994-11-11', 'female', '123456816', '0907777777', 'phuong.luong@email.com', 'owner', 'active', '2025-07-01', NULL),
(25, 'CD-000025', 29, NULL, 'Đỗ Văn Sang', '1990-08-08', 'male', '123456817', '0908888888', 'sang.do@email.com', 'owner', 'active', '2025-07-02', NULL),
(26, 'CD-000026', 30, NULL, 'Võ Thị Yến', '1992-12-12', 'female', '123456818', '0909999999', 'yen.vo@email.com', 'owner', 'active', '2025-07-02', NULL),
(27, 'CD-000027', 31, NULL, 'Phùng Văn Lợi', '1985-03-03', 'male', '123456819', '0910000001', 'loi.phung@email.com', 'owner', 'active', '2025-07-05', NULL),
(28, 'CD-000028', 32, NULL, 'Lại Thị Hà', '1993-10-10', 'female', '123456820', '0910000002', 'ha.lai@email.com', 'owner', 'active', '2025-07-05', NULL),
(29, 'CD-000029', 33, NULL, 'Tạ Văn Nghĩa', '1988-06-06', 'male', '123456821', '0910000003', 'nghia.ta@email.com', 'owner', 'active', '2025-07-10', NULL);

-- Seed Fees
INSERT INTO fees (id, fee_code, name, type, amount, description, apartment_id, due_date, status) VALUES
(1, 'KT-000001', 'Phí quản lý tháng 05/2026', 'mandatory', 500000.00, 'Phí quản lý vận hành chung cư tháng 5', NULL, '2026-05-31', 'active'),
(2, 'KT-000002', 'Phí gửi xe máy tháng 05/2026', 'mandatory', 100000.00, 'Phí trông giữ xe máy hàng tháng', NULL, '2026-05-31', 'active'),
(3, 'KT-000003', 'Phí đóng góp quỹ khuyến học', 'voluntary', 200000.00, 'Quỹ khuyến học cho các cháu học sinh trong chung cư', NULL, '2026-06-15', 'active'),
(4, 'KT-000004', 'Phí vệ sinh hành lang tòa B', 'mandatory', 150000.00, 'Chi phí vệ sinh tăng cường riêng tòa B', 3, '2026-05-31', 'active'),
(5, 'KT-000005', 'Phí sửa chữa thang máy tòa A', 'mandatory', 300000.00, 'Phí bảo trì thang máy tòa A', 1, '2026-04-30', 'closed');

-- Seed Payments
INSERT INTO payments (id, payment_code, fee_id, resident_id, amount, payment_date, method, note, status) VALUES
(1, 'TT-000001', 1, 1, 500000.00, '2026-05-10', 'transfer', 'Căn A-101 nộp tiền quản lý', 'paid'),
(2, 'TT-000002', 2, 1, 100000.00, '2026-05-10', 'transfer', 'Căn A-101 nộp tiền xe máy', 'paid'),
(3, 'TT-000003', 1, 3, 500000.00, '2026-05-12', 'transfer', 'Căn A-102 nộp tiền quản lý', 'paid'),
(4, 'TT-000004', 2, 3, 100000.00, '2026-05-12', 'transfer', 'Căn A-102 nộp tiền xe máy', 'paid'),
(5, 'TT-000005', 5, 1, 300000.00, '2026-04-20', 'cash', 'Căn A-101 đóng phí thang máy', 'paid'),
(6, 'TT-000006', 1, 5, 500000.00, '2026-05-25', 'transfer', 'Căn A-201 nộp phí quản lý', 'paid'),
(7, 'TT-000007', 4, 5, 150000.00, '2026-05-25', 'transfer', 'Căn A-201 nộp phí hành lang', 'paid'),
(8, 'TT-000008', 3, 1, 200000.00, '2026-05-28', 'card', 'Ủng hộ quỹ khuyến học', 'paid'),
(9, 'TT-000009', 1, 7, 500000.00, '2026-05-29', 'transfer', 'Căn A-302 nộp phí quản lý', 'paid'),
(10, 'TT-000010', 2, 7, 100000.00, '2026-05-29', 'transfer', 'Căn A-302 nộp phí xe máy', 'paid');

-- Seed Complaints
INSERT INTO complaints (id, user_id, title, content, status, response) VALUES
(1, 2, 'Nước sinh hoạt bị đục', 'Nước sinh hoạt tại căn hộ A-101 có dấu hiệu bị đục màu vàng nhạt từ chiều ngày 03/06. Kính mong ban quản lý kiểm tra bể chứa.', 'pending', NULL),
(2, 3, 'Hàng xóm làm ồn ban đêm', 'Căn hộ tầng trên B-302 thường xuyên kéo ghế và gây tiếng động lớn sau 11h đêm, ảnh hưởng đến giấc ngủ của nhà tôi.', 'processing', 'Ban quản lý đã ghi nhận và đã gửi nhắc nhở tới chủ hộ C-302.'),
(3, 2, 'Thang máy tòa A bị rung lắc', 'Thang máy số 2 tòa A khi di chuyển từ tầng 5 xuống có tiếng động lạ và bị rung. Rất nguy hiểm.', 'resolved', 'Đã cử đội kỹ thuật đến bảo trì và thay thế cáp treo thang máy vào ngày 28/05. Hiện hoạt động bình thường.'),
(4, 3, 'Hỏng bóng đèn hành lang', 'Hành lang tầng 1 tòa A bóng đèn số 3 bị cháy, đề nghị thay thế.', 'rejected', 'Bóng đèn hành lang đã được đội kỹ thuật kiểm tra và thấy vẫn hoạt động bình thường, nguyên nhân do aptomat bị tắt.');

-- Seed Notifications
INSERT INTO notifications (id, user_id, sort_order, title, content, type, is_read) VALUES
(1, NULL, 1, 'Thông báo bảo trì hệ thống điện toàn tòa nhà', 'Ban quản lý sẽ tiến hành bảo trì hệ thống điện dự phòng vào Chủ Nhật tuần này từ 8h00 đến 11h00. Mong cư dân thông cảm.', 'Bảng tin chung cư', 0),
(2, NULL, 2, 'Thông báo nộp phí tháng 05/2026', 'Yêu cầu các hộ dân hoàn thành nghĩa vụ đóng các khoản phí quản lý, phí gửi xe tháng 5 trước ngày 31/05/2026.', 'Bảng tin chung cư', 0),
(3, 2, 3, 'Xác nhận đã thanh toán phí gửi xe', 'Giao dịch thanh toán phí gửi xe máy tháng 05/2026 của căn hộ A-101 đã thành công.', 'Bảng tin chung cư', 1),
(4, NULL, 4, 'Ngày hội thể thao cư dân 2026', 'Ban quản lý tổ chức ngày hội thể thao cho cư dân vào ngày 15/06 tại khu vực sân chơi chung cư.', 'Bảng tin chung cư', 0),
(5, 3, 5, 'Phản hồi khiếu nại của bạn', 'Yêu cầu xử lý bóng đèn hành lang đã bị từ chối do bóng đèn vẫn hoạt động tốt.', 'Bảng tin chung cư', 0);

-- Seed Vehicle Plates (JSON: {"motorbikes":["plate1",...],"cars":["plate1",...]})
UPDATE apartments SET vehicle_plates = '{"motorbikes":["29F1-12345"]}' WHERE code = 'A-101';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["29F1-67890","30B-24680"],"cars":["30A-99999"]}' WHERE code = 'A-102';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["30B-11111"],"cars":["30A-88888"]}' WHERE code = 'A-201';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["30C-33333","30C-44444"],"cars":["30A-77777"]}' WHERE code = 'A-302';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["29F1-55555"]}' WHERE code = 'B-101';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["30D-66666","30D-77777"],"cars":["29A-66666"]}' WHERE code = 'B-102';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["30E-88888"],"cars":["30A-55555"]}' WHERE code = 'B-201';
UPDATE apartments SET vehicle_plates = '{"cars":["30A-44444"]}' WHERE code = 'B-302';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["29F1-77777"]}' WHERE code = 'A-103';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["30G-11111"]}' WHERE code = 'A-203';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["30G-22222"]}' WHERE code = 'A-303';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["30G-33333","30G-44444"],"cars":["30A-33333"]}' WHERE code = 'A-401';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["30G-55555"],"cars":["30A-22222"]}' WHERE code = 'A-501';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["30G-66666","30G-77777"]}' WHERE code = 'A-502';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["30H-11111"]}' WHERE code = 'A-503';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["30H-22222"]}' WHERE code = 'B-103';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["30H-33333"]}' WHERE code = 'B-203';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["30H-44444","30H-55555"]}' WHERE code = 'B-303';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["30H-66666"],"cars":["30A-11111"]}' WHERE code = 'B-401';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["30I-11111"]}' WHERE code = 'B-501';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["30I-22222","30I-33333"]}' WHERE code = 'B-502';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["30I-44444"]}' WHERE code = 'B-503';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["30I-55555"]}' WHERE code = 'C-101';
UPDATE apartments SET vehicle_plates = '{"motorbikes":["30I-66666"]}' WHERE code = 'C-102';

-- Seed Services
INSERT INTO services (id, name, description, price, unit, is_active) VALUES
(1, 'Thang máy chở đồ chuyển nhà', 'Dịch vụ đặt lịch sử dụng thang máy chuyên dụng để vận chuyển đồ đạc khi chuyển nhà, chuyển đồ cồng kềnh.', 0, 'lượt', 1),
(2, 'Sân BBQ tầng thượng', 'Đặt lịch sử dụng khu vực BBQ trên sân thượng với đầy đủ bàn ghế, bếp nướng. Tối đa 20 người.', 300000, 'buổi', 1),
(3, 'Phòng sinh hoạt cộng đồng', 'Đặt phòng sinh hoạt cộng đồng cho các sự kiện, tiệc sinh nhật, họp nhóm. Sức chứa 30 người.', 200000, 'buổi', 1),
(4, 'Dịch vụ vệ sinh căn hộ', 'Dịch vụ vệ sinh định kỳ hoặc theo yêu cầu cho căn hộ, bao gồm lau dọn, hút bụi, vệ sinh nhà bếp và nhà vệ sinh.', 150000, 'lượt', 1),
(5, 'Gửi xe khách qua đêm', 'Đăng ký chỗ gửi xe cho khách đến thăm qua đêm tại khu vực tầng hầm.', 50000, 'đêm', 1),
(6, 'Cho thuê xe đẩy', 'Dịch vụ cho thuê xe đẩy hàng phục vụ việc vận chuyển hàng hóa từ sảnh vào căn hộ.', 20000, 'giờ', 1);
