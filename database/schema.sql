-- Create database if not exists
CREATE DATABASE IF NOT EXISTS qlcc_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE qlcc_db;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: apartments
CREATE TABLE IF NOT EXISTS apartments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE, -- e.g. A-101, B-204
    floor INT NOT NULL,
    building VARCHAR(50) NOT NULL,
    area FLOAT NOT NULL, -- in square meters
    num_rooms INT NOT NULL,
    motorbikes INT NOT NULL DEFAULT 0,
    bicycles INT NOT NULL DEFAULT 0,
    cars INT NOT NULL DEFAULT 0,
    status ENUM('empty', 'occupied', 'maintenance', 'sold') NOT NULL DEFAULT 'empty',
    owner_name VARCHAR(100) NULL,
    owner_phone VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: residents
CREATE TABLE IF NOT EXISTS residents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resident_code VARCHAR(20) NOT NULL UNIQUE, -- CD-XXXXXX
    apartment_id INT NOT NULL,
    user_id INT NULL,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    id_card VARCHAR(20) NOT NULL UNIQUE,
    phone VARCHAR(20) NULL,
    email VARCHAR(100) NULL,
    relation ENUM('owner', 'member', 'tenant') NOT NULL DEFAULT 'member',
    status ENUM('active', 'moved_out') NOT NULL DEFAULT 'active',
    move_in_date DATE NOT NULL,
    move_out_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: fees
CREATE TABLE IF NOT EXISTS fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fee_code VARCHAR(20) NOT NULL UNIQUE, -- KT-XXXXXX
    name VARCHAR(100) NOT NULL,
    type ENUM('mandatory', 'voluntary') NOT NULL,
    amount DECIMAL(12, 2) NOT NULL, -- Flat amount or rate per sqm (depending on type)
    description TEXT NULL,
    apartment_id INT NULL, -- NULL means the fee is charged to all apartments
    due_date DATE NOT NULL,
    status ENUM('active', 'closed') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: payments
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_code VARCHAR(20) NOT NULL UNIQUE, -- TT-XXXXXX
    fee_id INT NOT NULL,
    resident_id INT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    payment_date DATE NOT NULL,
    method ENUM('cash', 'transfer', 'card') NOT NULL DEFAULT 'transfer',
    note TEXT NULL,
    status ENUM('paid', 'pending', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fee_id) REFERENCES fees(id) ON DELETE CASCADE,
    FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: complaints
CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(100) NOT NULL DEFAULT 'Khác',
    content TEXT NOT NULL,
    status ENUM('pending', 'processing', 'resolved', 'rejected') NOT NULL DEFAULT 'pending',
    response TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL, -- NULL means send to all users
    sort_order INT NOT NULL DEFAULT 0,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
     type VARCHAR(100) NOT NULL DEFAULT 'Bảng tin chung cư',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: messages (chat)
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    sender ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    text TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_messages_user (user_id),
    INDEX idx_messages_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for search optimization
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_apartments_code ON apartments(code);
CREATE INDEX idx_residents_apartment_id ON residents(apartment_id);
CREATE INDEX idx_residents_user_id ON residents(user_id);
CREATE INDEX idx_residents_id_card ON residents(id_card);
CREATE INDEX idx_residents_full_name ON residents(full_name);
CREATE INDEX idx_residents_created_at ON residents(created_at);
CREATE INDEX idx_fees_due_date ON fees(due_date);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_complaints_status ON complaints(status);
