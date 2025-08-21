-- Tạo database
CREATE DATABASE IF NOT EXISTS capstone_fiverr;
USE capstone_fiverr;

-- Bảng LoaiCongViec (Job Type)
CREATE TABLE LoaiCongViec (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten_loai_cong_viec VARCHAR(255) NOT NULL
);

-- Bảng ChiTietLoaiCongViec (Job Type Detail)
CREATE TABLE ChiTietLoaiCongViec (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten_chi_tiet VARCHAR(255) NOT NULL,
    hinh_anh VARCHAR(500),
    ma_loai_cong_viec INT,
    FOREIGN KEY (ma_loai_cong_viec) REFERENCES LoaiCongViec(id)
    
);
-- Bảng NguoiDung (User)
CREATE TABLE NguoiDung (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    pass_word VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    birth_day VARCHAR(20),
    gender VARCHAR(10),
    role VARCHAR(50) DEFAULT 'user',
    skill TEXT,
    certification TEXT
);

-- Bảng CongViec (Job/Task)
CREATE TABLE CongViec (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten_cong_viec VARCHAR(255) NOT NULL,
    danh_gia INT DEFAULT 0,
    gia_tien INT NOT NULL,
    hinh_anh VARCHAR(500),
    mo_ta TEXT,
    mo_ta_ngan VARCHAR(500),
    sao_cong_viec INT DEFAULT 0,
    ma_chi_tiet_loai INT,
    nguoi_tao INT,
    FOREIGN KEY (ma_chi_tiet_loai) REFERENCES ChiTietLoaiCongViec(id),
    FOREIGN KEY (nguoi_tao) REFERENCES NguoiDung(id)
);

-- Bảng ThueCongViec (Job Rental/Hiring)
CREATE TABLE ThueCongViec (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_cong_viec INT,
    ma_nguoi_thue INT,
    ngay_thue DATETIME DEFAULT CURRENT_TIMESTAMP,
    hoan_thanh BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (ma_cong_viec) REFERENCES CongViec(id),
    FOREIGN KEY (ma_nguoi_thue) REFERENCES NguoiDung(id)
);

-- Bảng BinhLuan (Comment)
CREATE TABLE BinhLuan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_cong_viec INT,
    ma_nguoi_binh_luan INT,
    ngay_binh_luan DATETIME DEFAULT CURRENT_TIMESTAMP,
    noi_dung TEXT NOT NULL,
    sao_binh_luan INT DEFAULT 0,
    FOREIGN KEY (ma_cong_viec) REFERENCES CongViec(id),
    FOREIGN KEY (ma_nguoi_binh_luan) REFERENCES NguoiDung(id)
);

-- Thêm dữ liệu mẫu cho LoaiCongViec
INSERT INTO LoaiCongViec (ten_loai_cong_viec) VALUES 
('Công nghệ thông tin'),
('Thiết kế đồ họa'),
('Marketing'),
('Viết lách'),
('Dịch thuật'),
('Âm nhạc');

-- Thêm dữ liệu mẫu cho ChiTietLoaiCongViec
INSERT INTO ChiTietLoaiCongViec (ten_chi_tiet, hinh_anh, ma_loai_cong_viec) VALUES 
('Lập trình web', 'web-dev.jpg', 1),
('Lập trình mobile', 'mobile-dev.jpg', 1),
('Thiết kế logo', 'logo-design.jpg', 2),
('Thiết kế website', 'web-design.jpg', 2),
('SEO', 'seo.jpg', 3),
('Quảng cáo Facebook', 'fb-ads.jpg', 3),
('Viết bài SEO', 'seo-writing.jpg', 4),
('Viết nội dung', 'content-writing.jpg', 4),
('Dịch tiếng Anh', 'english-trans.jpg', 5),
('Dịch tiếng Nhật', 'japanese-trans.jpg', 5),
('Sáng tác nhạc', 'music-composition.jpg', 6),
('Thu âm', 'recording.jpg', 6);

-- Thêm dữ liệu mẫu cho NguoiDung
INSERT INTO NguoiDung (name, email, pass_word, phone, birth_day, gender, role, skill, certification) VALUES 
('Nguyễn Văn A', 'nguyenvana@email.com', '$2b$10$hashedpassword1', '0123456789', '1990-01-01', 'Nam', 'freelancer', 'Lập trình web, React, Node.js', 'AWS Certified Developer'),
('Trần Thị B', 'tranthib@email.com', '$2b$10$hashedpassword2', '0987654321', '1992-05-15', 'Nữ', 'client', 'Marketing, SEO', 'Google Ads Certified'),
('Lê Văn C', 'levanc@email.com', '$2b$10$hashedpassword3', '0123456780', '1988-12-20', 'Nam', 'freelancer', 'Thiết kế đồ họa, Photoshop, Illustrator', 'Adobe Certified Expert'),
('Phạm Thị D', 'phamthid@email.com', '$2b$10$hashedpassword4', '0987654320', '1995-08-10', 'Nữ', 'client', 'Viết lách, Nội dung', 'Content Marketing Certified');

-- Thêm dữ liệu mẫu cho CongViec
INSERT INTO CongViec (ten_cong_viec, danh_gia, gia_tien, hinh_anh, mo_ta, mo_ta_ngan, sao_cong_viec, ma_chi_tiet_loai, nguoi_tao) VALUES 
('Thiết kế website bán hàng', 5, 5000000, 'website-design.jpg', 'Thiết kế website bán hàng chuyên nghiệp với giao diện đẹp và responsive', 'Website bán hàng responsive', 5, 4, 1),
('Lập trình ứng dụng mobile', 4, 8000000, 'mobile-app.jpg', 'Phát triển ứng dụng mobile cho iOS và Android', 'App mobile iOS/Android', 4, 2, 1),
('Thiết kế logo công ty', 5, 2000000, 'logo-design.jpg', 'Thiết kế logo độc đáo và chuyên nghiệp cho công ty', 'Logo công ty chuyên nghiệp', 5, 3, 3),
('Viết bài SEO cho website', 4, 1500000, 'seo-writing.jpg', 'Viết nội dung SEO tối ưu cho website', 'Nội dung SEO tối ưu', 4, 7, 4);

-- Thêm dữ liệu mẫu cho ThueCongViec
INSERT INTO ThueCongViec (ma_cong_viec, ma_nguoi_thue, ngay_thue, hoan_thanh) VALUES 
(1, 2, '2024-01-15 10:00:00', FALSE),
(2, 4, '2024-01-16 14:30:00', FALSE),
(3, 2, '2024-01-17 09:15:00', TRUE),
(4, 1, '2024-01-18 16:45:00', FALSE);

-- Thêm dữ liệu mẫu cho BinhLuan
INSERT INTO BinhLuan (ma_cong_viec, ma_nguoi_binh_luan, ngay_binh_luan, noi_dung, sao_binh_luan) VALUES 
(1, 2, '2024-01-15 11:00:00', 'Dự án rất tốt, giao diện đẹp!', 5),
(1, 4, '2024-01-15 12:00:00', 'Tôi rất hài lòng với kết quả', 5),
(2, 4, '2024-01-16 15:00:00', 'Ứng dụng hoạt động mượt mà', 4),
(3, 2, '2024-01-17 10:00:00', 'Logo đẹp và chuyên nghiệp', 5),
(4, 1, '2024-01-18 17:00:00', 'Nội dung SEO rất chất lượng', 4);

-- Tạo indexes để tối ưu hiệu suất
CREATE INDEX idx_congviec_nguoitao ON CongViec(nguoi_tao);
CREATE INDEX idx_congviec_chitietloai ON CongViec(ma_chi_tiet_loai);
CREATE INDEX idx_thuecongviec_congviec ON ThueCongViec(ma_cong_viec);
CREATE INDEX idx_thuecongviec_nguoithue ON ThueCongViec(ma_nguoi_thue);
CREATE INDEX idx_binhluan_congviec ON BinhLuan(ma_cong_viec);
CREATE INDEX idx_binhluan_nguoibinhluan ON BinhLuan(ma_nguoi_binh_luan);
CREATE INDEX idx_chitietloai_loaicongviec ON ChiTietLoaiCongViec(ma_loai_cong_viec);
CREATE INDEX idx_nguoidung_email ON NguoiDung(email);
