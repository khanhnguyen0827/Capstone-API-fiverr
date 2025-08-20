-- Tạo database
CREATE DATABASE IF NOT EXISTS capstone_fiverr;
USE capstone_fiverr;

-- Bảng Users (Người dùng)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ho_ten VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    pass_word VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    birth_day VARCHAR(20),
    gender VARCHAR(10),
    role VARCHAR(50) DEFAULT 'USER',
    skill TEXT,
    certification TEXT,
    anh_dai_dien VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_by INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng LoaiCongViec (Loại công việc)
CREATE TABLE loai_cong_viec (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten_loai_cong_viec VARCHAR(255) NOT NULL,
    hinh_anh VARCHAR(500),
    mo_ta TEXT,
    thu_tu INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_by INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng ChiTietLoaiCongViec (Chi tiết loại công việc)
CREATE TABLE chi_tiet_loai_cong_viec (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten_chi_tiet VARCHAR(255) NOT NULL,
    hinh_anh VARCHAR(500),
    mo_ta TEXT,
    thu_tu INT DEFAULT 0,
    ma_loai_cong_viec INT,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_by INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_loai_cong_viec) REFERENCES loai_cong_viec(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Bảng CongViec (Công việc)
CREATE TABLE cong_viec (
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
    trang_thai VARCHAR(50) DEFAULT 'AVAILABLE',
    so_luong_da_thue INT DEFAULT 0,
    so_luong_da_hoan_thanh INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_by INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_chi_tiet_loai) REFERENCES chi_tiet_loai_cong_viec(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (nguoi_tao) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Bảng ThueCongViec (Thuê công việc)
CREATE TABLE thue_cong_viec (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_cong_viec INT,
    ma_nguoi_thue INT,
    ma_nguoi_lam INT,
    ngay_thue DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_bat_dau DATETIME NULL,
    ngay_hoan_thanh DATETIME NULL,
    hoan_thanh BOOLEAN DEFAULT FALSE,
    trang_thai VARCHAR(50) DEFAULT 'PENDING',
    ghi_chu TEXT,
    danh_gia INT DEFAULT 0,
    noi_dung_danh_gia TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_by INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_cong_viec) REFERENCES cong_viec(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (ma_nguoi_thue) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (ma_nguoi_lam) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Bảng BinhLuan (Bình luận)
CREATE TABLE binh_luan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_cong_viec INT,
    ma_nguoi_binh_luan INT,
    ma_thue_cong_viec INT,
    ngay_binh_luan DATETIME DEFAULT CURRENT_TIMESTAMP,
    noi_dung TEXT NOT NULL,
    sao_binh_luan INT DEFAULT 0,
    loai_binh_luan VARCHAR(50) DEFAULT 'REVIEW',
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_by INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_cong_viec) REFERENCES cong_viec(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (ma_nguoi_binh_luan) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (ma_thue_cong_viec) REFERENCES thue_cong_viec(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Bảng FileUpload (Quản lý file)
CREATE TABLE file_upload (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten_file VARCHAR(255) NOT NULL,
    duong_dan VARCHAR(500) NOT NULL,
    loai_file VARCHAR(100),
    kich_thuoc INT,
    ma_nguoi_tao INT,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_by INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_nguoi_tao) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Bảng ThongBao (Thông báo)
CREATE TABLE thong_bao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tieu_de VARCHAR(255) NOT NULL,
    noi_dung TEXT NOT NULL,
    loai_thong_bao VARCHAR(100),
    ma_nguoi_nhan INT,
    da_doc BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_by INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_nguoi_nhan) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Thêm dữ liệu mẫu cho LoaiCongViec
INSERT INTO loai_cong_viec (ten_loai_cong_viec, hinh_anh, mo_ta, thu_tu) VALUES 
('Công nghệ thông tin', 'tech.jpg', 'Các dịch vụ liên quan đến công nghệ thông tin', 1),
('Thiết kế đồ họa', 'design.jpg', 'Dịch vụ thiết kế đồ họa và hình ảnh', 2),
('Marketing', 'marketing.jpg', 'Dịch vụ marketing và quảng cáo', 3),
('Viết lách', 'writing.jpg', 'Dịch vụ viết nội dung và copywriting', 4),
('Dịch thuật', 'translation.jpg', 'Dịch vụ dịch thuật đa ngôn ngữ', 5),
('Âm nhạc', 'music.jpg', 'Dịch vụ âm nhạc và âm thanh', 6);

-- Thêm dữ liệu mẫu cho ChiTietLoaiCongViec
INSERT INTO chi_tiet_loai_cong_viec (ten_chi_tiet, hinh_anh, mo_ta, thu_tu, ma_loai_cong_viec) VALUES 
('Lập trình web', 'web-dev.jpg', 'Phát triển website và ứng dụng web', 1, 1),
('Lập trình mobile', 'mobile-dev.jpg', 'Phát triển ứng dụng di động', 2, 1),
('Thiết kế logo', 'logo-design.jpg', 'Thiết kế logo và nhận diện thương hiệu', 1, 2),
('Thiết kế website', 'web-design.jpg', 'Thiết kế giao diện website', 2, 2),
('SEO', 'seo.jpg', 'Tối ưu hóa công cụ tìm kiếm', 1, 3),
('Quảng cáo Facebook', 'fb-ads.jpg', 'Quảng cáo trên mạng xã hội', 2, 3),
('Viết bài SEO', 'seo-writing.jpg', 'Viết nội dung tối ưu SEO', 1, 4),
('Viết nội dung', 'content-writing.jpg', 'Viết nội dung marketing', 2, 4),
('Dịch tiếng Anh', 'english-trans.jpg', 'Dịch thuật tiếng Anh', 1, 5),
('Dịch tiếng Nhật', 'japanese-trans.jpg', 'Dịch thuật tiếng Nhật', 2, 5),
('Sáng tác nhạc', 'music-composition.jpg', 'Sáng tác và sản xuất âm nhạc', 1, 6),
('Thu âm', 'recording.jpg', 'Dịch vụ thu âm và xử lý âm thanh', 2, 6);

-- Thêm dữ liệu mẫu cho Users
INSERT INTO users (ho_ten, email, pass_word, phone, birth_day, gender, role, skill, certification) VALUES 
('Administrator', 'admin@example.com', '$2b$10$hashedpassword1', '0123456789', '1990-01-01', 'male', 'ADMIN', 'System Administration', 'AWS Certified'),
('Nguyễn Văn A', 'nguyenvana@email.com', '$2b$10$hashedpassword2', '0123456781', '1990-01-01', 'male', 'FREELANCER', 'Lập trình web, React, Node.js', 'AWS Certified Developer'),
('Trần Thị B', 'tranthib@email.com', '$2b$10$hashedpassword3', '0987654321', '1992-05-15', 'female', 'CLIENT', 'Marketing, SEO', 'Google Ads Certified'),
('Lê Văn C', 'levanc@email.com', '$2b$10$hashedpassword4', '0123456780', '1988-12-20', 'male', 'FREELANCER', 'Thiết kế đồ họa, Photoshop, Illustrator', 'Adobe Certified Expert'),
('Phạm Thị D', 'phamthid@email.com', '$2b$10$hashedpassword5', '0987654320', '1995-08-10', 'female', 'CLIENT', 'Viết lách, Nội dung', 'Content Marketing Certified');

-- Thêm dữ liệu mẫu cho CongViec
INSERT INTO cong_viec (ten_cong_viec, danh_gia, gia_tien, hinh_anh, mo_ta, mo_ta_ngan, sao_cong_viec, ma_chi_tiet_loai, nguoi_tao, trang_thai) VALUES 
('Thiết kế website bán hàng', 5, 5000000, 'website-design.jpg', 'Thiết kế website bán hàng chuyên nghiệp với giao diện đẹp và responsive', 'Website bán hàng responsive', 5, 4, 2, 'AVAILABLE'),
('Lập trình ứng dụng mobile', 4, 8000000, 'mobile-app.jpg', 'Phát triển ứng dụng mobile cho iOS và Android', 'App mobile iOS/Android', 4, 2, 2, 'AVAILABLE'),
('Thiết kế logo công ty', 5, 2000000, 'logo-design.jpg', 'Thiết kế logo độc đáo và chuyên nghiệp cho công ty', 'Logo công ty chuyên nghiệp', 5, 3, 4, 'AVAILABLE'),
('Viết bài SEO cho website', 4, 1500000, 'seo-writing.jpg', 'Viết nội dung SEO tối ưu cho website', 'Nội dung SEO tối ưu', 4, 7, 5, 'AVAILABLE');

-- Thêm dữ liệu mẫu cho ThueCongViec
INSERT INTO thue_cong_viec (ma_cong_viec, ma_nguoi_thue, ma_nguoi_lam, ngay_thue, trang_thai, hoan_thanh) VALUES 
(1, 3, 2, '2024-01-15 10:00:00', 'ACCEPTED', FALSE),
(2, 5, 2, '2024-01-16 14:30:00', 'IN_PROGRESS', FALSE),
(3, 3, 4, '2024-01-17 09:15:00', 'COMPLETED', TRUE),
(4, 2, 5, '2024-01-18 16:45:00', 'PENDING', FALSE);

-- Thêm dữ liệu mẫu cho BinhLuan
INSERT INTO binh_luan (ma_cong_viec, ma_nguoi_binh_luan, ma_thue_cong_viec, ngay_binh_luan, noi_dung, sao_binh_luan, loai_binh_luan) VALUES 
(1, 3, 1, '2024-01-15 11:00:00', 'Dự án rất tốt, giao diện đẹp!', 5, 'REVIEW'),
(1, 5, 1, '2024-01-15 12:00:00', 'Tôi rất hài lòng với kết quả', 5, 'REVIEW'),
(2, 5, 2, '2024-01-16 15:00:00', 'Ứng dụng hoạt động mượt mà', 4, 'REVIEW'),
(3, 3, 3, '2024-01-17 10:00:00', 'Logo đẹp và chuyên nghiệp', 5, 'REVIEW'),
(4, 2, 4, '2024-01-18 17:00:00', 'Nội dung SEO rất chất lượng', 4, 'REVIEW');

-- Thêm dữ liệu mẫu cho ThongBao
INSERT INTO thong_bao (tieu_de, noi_dung, loai_thong_bao, ma_nguoi_nhan, da_doc) VALUES 
('Chào mừng bạn đến với Fiverr', 'Chào mừng bạn đến với nền tảng freelance hàng đầu', 'SYSTEM', 2, FALSE),
('Công việc mới được đăng', 'Có công việc mới phù hợp với kỹ năng của bạn', 'JOB', 2, FALSE),
('Đơn hàng được chấp nhận', 'Đơn hàng của bạn đã được khách hàng chấp nhận', 'HIRE', 2, FALSE);

-- Tạo indexes để tối ưu hiệu suất
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_is_deleted ON users(is_deleted);

CREATE INDEX idx_loai_cong_viec_is_deleted ON loai_cong_viec(is_deleted);
CREATE INDEX idx_loai_cong_viec_thu_tu ON loai_cong_viec(thu_tu);

CREATE INDEX idx_chi_tiet_loai_cong_viec_ma_loai ON chi_tiet_loai_cong_viec(ma_loai_cong_viec);
CREATE INDEX idx_chi_tiet_loai_cong_viec_is_deleted ON chi_tiet_loai_cong_viec(is_deleted);
CREATE INDEX idx_chi_tiet_loai_cong_viec_thu_tu ON chi_tiet_loai_cong_viec(thu_tu);

CREATE INDEX idx_cong_viec_ma_chi_tiet_loai ON cong_viec(ma_chi_tiet_loai);
CREATE INDEX idx_cong_viec_nguoi_tao ON cong_viec(nguoi_tao);
CREATE INDEX idx_cong_viec_trang_thai ON cong_viec(trang_thai);
CREATE INDEX idx_cong_viec_is_deleted ON cong_viec(is_deleted);
CREATE INDEX idx_cong_viec_gia_tien ON cong_viec(gia_tien);
CREATE INDEX idx_cong_viec_sao_cong_viec ON cong_viec(sao_cong_viec);

CREATE INDEX idx_thue_cong_viec_ma_cong_viec ON thue_cong_viec(ma_cong_viec);
CREATE INDEX idx_thue_cong_viec_ma_nguoi_thue ON thue_cong_viec(ma_nguoi_thue);
CREATE INDEX idx_thue_cong_viec_ma_nguoi_lam ON thue_cong_viec(ma_nguoi_lam);
CREATE INDEX idx_thue_cong_viec_trang_thai ON thue_cong_viec(trang_thai);
CREATE INDEX idx_thue_cong_viec_is_deleted ON thue_cong_viec(is_deleted);
CREATE INDEX idx_thue_cong_viec_ngay_thue ON thue_cong_viec(ngay_thue);

CREATE INDEX idx_binh_luan_ma_cong_viec ON binh_luan(ma_cong_viec);
CREATE INDEX idx_binh_luan_ma_nguoi_binh_luan ON binh_luan(ma_nguoi_binh_luan);
CREATE INDEX idx_binh_luan_ma_thue_cong_viec ON binh_luan(ma_thue_cong_viec);
CREATE INDEX idx_binh_luan_is_deleted ON binh_luan(is_deleted);
CREATE INDEX idx_binh_luan_ngay_binh_luan ON binh_luan(ngay_binh_luan);
CREATE INDEX idx_binh_luan_loai_binh_luan ON binh_luan(loai_binh_luan);

CREATE INDEX idx_file_upload_ma_nguoi_tao ON file_upload(ma_nguoi_tao);
CREATE INDEX idx_file_upload_loai_file ON file_upload(loai_file);
CREATE INDEX idx_file_upload_is_deleted ON file_upload(is_deleted);

CREATE INDEX idx_thong_bao_ma_nguoi_nhan ON thong_bao(ma_nguoi_nhan);
CREATE INDEX idx_thong_bao_loai_thong_bao ON thong_bao(loai_thong_bao);
CREATE INDEX idx_thong_bao_da_doc ON thong_bao(da_doc);
CREATE INDEX idx_thong_bao_is_deleted ON thong_bao(is_deleted);
