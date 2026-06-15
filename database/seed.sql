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
ALTER TABLE apartments AUTO_INCREMENT = 1;
ALTER TABLE residents AUTO_INCREMENT = 1;
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
INSERT INTO apartments (id, code, floor, building, area, num_rooms, motorbikes, bicycles, cars, status, owner_name, owner_phone) VALUES
(1, 'A-101', 1, 'Tòa A', 75.5, 2, 1, 1, 0, 'occupied', 'Trần Lê Vương', '0987654321'),
(2, 'A-102', 1, 'Tòa A', 75.5, 2, 2, 1, 1, 'occupied', 'Phạm Việt Cường', '0901234567'),
(3, 'A-201', 2, 'Tòa A', 110.0, 3, 1, 0, 1, 'occupied', 'Lê Hoàng Long', '0933445566'),
(4, 'A-202', 2, 'Tòa A', 50.0, 1, 0, 0, 0, 'empty', NULL, NULL),
(5, 'A-301', 3, 'Tòa A', 90.0, 2, 1, 1, 0, 'maintenance', NULL, NULL),
(6, 'A-302', 3, 'Tòa A', 90.0, 2, 2, 0, 1, 'occupied', 'Nguyễn Thị Hoa', '0944556677'),
(7, 'B-101', 1, 'Tòa B', 75.5, 2, 1, 1, 0, 'occupied', 'Nguyễn Việt Cường', '0987659321'),
(8, 'B-102', 1, 'Tòa B', 75.5, 2, 2, 1, 1, 'occupied', 'Khổng Quốc Anh', '0901789567'),
(9, 'B-201', 2, 'Tòa B', 110.0, 3, 1, 0, 1, 'occupied', 'Phan Long Giang', '0934915566'),
(10, 'B-202', 2, 'Tòa B', 50.0, 1, 0, 0, 0, 'empty', NULL, NULL),
(11, 'B-301', 3, 'Tòa B', 90.0, 2, 1, 1, 0, 'maintenance', NULL, NULL),
(12, 'B-302', 3, 'Tòa B', 90.0, 2, 2, 0, 1, 'occupied', 'Phạm Lê Anh', '0944128677');

-- Seed Residents
INSERT INTO residents (id, resident_code, apartment_id, user_id, full_name, date_of_birth, gender, id_card, phone, email, relation, status, move_in_date, move_out_date) VALUES
(1, 'CD-000001', 1, 2, 'Trần Lê Vương', '1995-05-15', 'male', '123456789', '0987654321', 'user1@qlcc.com', 'owner', 'active', '2025-01-10', NULL),
(2, 'CD-000002', 2, 3, 'Phạm Việt Cường', '1992-12-01', 'male', '234567890', '0901234567', 'user2@qlcc.com', 'owner', 'active', '2025-02-15', NULL),
(3, 'CD-000003', 3, NULL, 'Lê Hoàng Long', '1988-06-25', 'male', '345678901', '0933445566', 'long.le@gmail.com', 'owner', 'active', '2024-05-20', NULL),
(4, 'CD-000004', 6, NULL, 'Nguyễn Thị Hoa', '1980-04-30', 'female', '456789012', '0944556677', 'hoa.nguyen@gmail.com', 'owner', 'active', '2024-12-01', NULL),
(5, 'CD-000005', 7, NULL, 'Nguyễn Việt Cường', '1995-05-15', 'male', '123456790', '0987659321', 'cuongle@gmail.com', 'owner', 'active', '2025-01-10', NULL),
(6, 'CD-000006', 8, NULL, 'Khổng Quốc Anh', '1992-12-01', 'male', '234567891', '0901789567', 'anhquoc@gmail.com', 'owner', 'active', '2025-02-15', NULL),
(7, 'CD-000007', 9, NULL, 'Phan Long Giang', '1988-06-25', 'male', '345678902', '0934915566', 'long.le@gmail.com', 'owner', 'active', '2024-05-20', NULL),
(8, 'CD-000008', 12, NULL, 'Phạm Lê Anh', '1980-04-30', 'female', '456789013', '0944128677', 'hoa.nguyen@gmail.com', 'owner', 'active', '2024-12-01', NULL);

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

-- Seed Services
INSERT INTO services (id, name, description, price, unit, is_active) VALUES
(1, 'Thang máy chở đồ chuyển nhà', 'Dịch vụ đặt lịch sử dụng thang máy chuyên dụng để vận chuyển đồ đạc khi chuyển nhà, chuyển đồ cồng kềnh.', 0, 'lượt', 1),
(2, 'Sân BBQ tầng thượng', 'Đặt lịch sử dụng khu vực BBQ trên sân thượng với đầy đủ bàn ghế, bếp nướng. Tối đa 20 người.', 300000, 'buổi', 1),
(3, 'Phòng sinh hoạt cộng đồng', 'Đặt phòng sinh hoạt cộng đồng cho các sự kiện, tiệc sinh nhật, họp nhóm. Sức chứa 30 người.', 200000, 'buổi', 1),
(4, 'Dịch vụ vệ sinh căn hộ', 'Dịch vụ vệ sinh định kỳ hoặc theo yêu cầu cho căn hộ, bao gồm lau dọn, hút bụi, vệ sinh nhà bếp và nhà vệ sinh.', 150000, 'lượt', 1),
(5, 'Gửi xe khách qua đêm', 'Đăng ký chỗ gửi xe cho khách đến thăm qua đêm tại khu vực tầng hầm.', 50000, 'đêm', 1),
(6, 'Cho thuê xe đẩy', 'Dịch vụ cho thuê xe đẩy hàng phục vụ việc vận chuyển hàng hóa từ sảnh vào căn hộ.', 20000, 'giờ', 1);
