# 🗄️ Database Schema Documentation

## 📋 Tổng quan

Database của dự án Capstone API Fiverr được thiết kế để hỗ trợ một nền tảng freelance hoàn chỉnh với các tính năng:

- **Quản lý người dùng** với phân quyền role-based
- **Hệ thống công việc** với phân loại đa cấp
- **Quản lý thuê công việc** với tracking trạng thái
- **Hệ thống bình luận và đánh giá**
- **Quản lý file upload**
- **Hệ thống thông báo**

## 🏗️ Cấu trúc Database

### 1. **Users Table** - Quản lý người dùng
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ho_ten VARCHAR(255) NOT NULL,           -- Họ tên người dùng
    email VARCHAR(255) UNIQUE NOT NULL,     -- Email (unique)
    pass_word VARCHAR(255) NOT NULL,        -- Mật khẩu (hashed)
    phone VARCHAR(20),                      -- Số điện thoại
    birth_day VARCHAR(20),                  -- Ngày sinh
    gender VARCHAR(10),                     -- Giới tính
    role VARCHAR(50) DEFAULT 'USER',        -- Vai trò: ADMIN, USER, FREELANCER, CLIENT
    skill TEXT,                             -- Kỹ năng
    certification TEXT,                      -- Chứng chỉ
    anh_dai_dien VARCHAR(500),              -- Ảnh đại diện
    is_active BOOLEAN DEFAULT TRUE,         -- Trạng thái hoạt động
    is_deleted BOOLEAN DEFAULT FALSE,       -- Soft delete
    deleted_by INT DEFAULT 0,               -- Người xóa
    deleted_at TIMESTAMP NULL,              -- Thời gian xóa
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Indexes:**
- `idx_users_email` - Tối ưu tìm kiếm theo email
- `idx_users_role` - Tối ưu tìm kiếm theo role
- `idx_users_is_active` - Tối ưu filter active users
- `idx_users_is_deleted` - Tối ưu soft delete

### 2. **LoaiCongViec Table** - Loại công việc chính
```sql
CREATE TABLE loai_cong_viec (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten_loai_cong_viec VARCHAR(255) NOT NULL,  -- Tên loại công việc
    hinh_anh VARCHAR(500),                     -- Hình ảnh đại diện
    mo_ta TEXT,                                -- Mô tả chi tiết
    thu_tu INT DEFAULT 0,                      -- Thứ tự hiển thị
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_by INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Ví dụ dữ liệu:**
- Công nghệ thông tin
- Thiết kế đồ họa
- Marketing
- Viết lách
- Dịch thuật
- Âm nhạc

### 3. **ChiTietLoaiCongViec Table** - Chi tiết loại công việc
```sql
CREATE TABLE chi_tiet_loai_cong_viec (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten_chi_tiet VARCHAR(255) NOT NULL,        -- Tên chi tiết
    hinh_anh VARCHAR(500),                     -- Hình ảnh
    mo_ta TEXT,                                -- Mô tả
    thu_tu INT DEFAULT 0,                      -- Thứ tự
    ma_loai_cong_viec INT,                     -- FK đến LoaiCongViec
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_by INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_loai_cong_viec) REFERENCES loai_cong_viec(id)
);
```

**Ví dụ dữ liệu:**
- **Công nghệ thông tin** → Lập trình web, Lập trình mobile
- **Thiết kế đồ họa** → Thiết kế logo, Thiết kế website
- **Marketing** → SEO, Quảng cáo Facebook

### 4. **CongViec Table** - Công việc được đăng
```sql
CREATE TABLE cong_viec (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten_cong_viec VARCHAR(255) NOT NULL,       -- Tên công việc
    danh_gia INT DEFAULT 0,                   -- Đánh giá (1-5)
    gia_tien INT NOT NULL,                    -- Giá tiền (VND)
    hinh_anh VARCHAR(500),                    -- Hình ảnh công việc
    mo_ta TEXT,                               -- Mô tả chi tiết
    mo_ta_ngan VARCHAR(500),                  -- Mô tả ngắn
    sao_cong_viec INT DEFAULT 0,              -- Số sao đánh giá
    ma_chi_tiet_loai INT,                     -- FK đến ChiTietLoaiCongViec
    nguoi_tao INT,                            -- FK đến Users (người tạo)
    trang_thai VARCHAR(50) DEFAULT 'AVAILABLE', -- Trạng thái: AVAILABLE, IN_PROGRESS, COMPLETED
    so_luong_da_thue INT DEFAULT 0,           -- Số lượng đã được thuê
    so_luong_da_hoan_thanh INT DEFAULT 0,     -- Số lượng đã hoàn thành
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_by INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_chi_tiet_loai) REFERENCES chi_tiet_loai_cong_viec(id),
    FOREIGN KEY (nguoi_tao) REFERENCES users(id)
);
```

**Indexes:**
- `idx_cong_viec_ma_chi_tiet_loai` - Tối ưu filter theo loại
- `idx_cong_viec_nguoi_tao` - Tối ưu tìm kiếm theo người tạo
- `idx_cong_viec_trang_thai` - Tối ưu filter theo trạng thái
- `idx_cong_viec_gia_tien` - Tối ưu sắp xếp theo giá
- `idx_cong_viec_sao_cong_viec` - Tối ưu sắp xếp theo đánh giá

### 5. **ThueCongViec Table** - Quản lý thuê công việc
```sql
CREATE TABLE thue_cong_viec (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_cong_viec INT,                         -- FK đến CongViec
    ma_nguoi_thue INT,                        -- FK đến Users (khách hàng)
    ma_nguoi_lam INT,                         -- FK đến Users (freelancer)
    ngay_thue DATETIME DEFAULT CURRENT_TIMESTAMP, -- Ngày thuê
    ngay_bat_dau DATETIME NULL,               -- Ngày bắt đầu làm việc
    ngay_hoan_thanh DATETIME NULL,            -- Ngày hoàn thành
    hoan_thanh BOOLEAN DEFAULT FALSE,         -- Trạng thái hoàn thành
    trang_thai VARCHAR(50) DEFAULT 'PENDING', -- Trạng thái: PENDING, ACCEPTED, IN_PROGRESS, COMPLETED
    ghi_chu TEXT,                             -- Ghi chú
    danh_gia INT DEFAULT 0,                   -- Đánh giá (1-5)
    noi_dung_danh_gia TEXT,                   -- Nội dung đánh giá
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_by INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_cong_viec) REFERENCES cong_viec(id),
    FOREIGN KEY (ma_nguoi_thue) REFERENCES users(id),
    FOREIGN KEY (ma_nguoi_lam) REFERENCES users(id)
);
```

**Relations:**
- `Client` - Người thuê công việc
- `Freelancer` - Người thực hiện công việc

**Indexes:**
- `idx_thue_cong_viec_ma_cong_viec` - Tối ưu tìm kiếm theo công việc
- `idx_thue_cong_viec_ma_nguoi_thue` - Tối ưu tìm kiếm theo khách hàng
- `idx_thue_cong_viec_ma_nguoi_lam` - Tối ưu tìm kiếm theo freelancer
- `idx_thue_cong_viec_trang_thai` - Tối ưu filter theo trạng thái
- `idx_thue_cong_viec_ngay_thue` - Tối ưu sắp xếp theo ngày

### 6. **BinhLuan Table** - Bình luận và đánh giá
```sql
CREATE TABLE binh_luan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_cong_viec INT,                         -- FK đến CongViec
    ma_nguoi_binh_luan INT,                   -- FK đến Users
    ma_thue_cong_viec INT,                    -- FK đến ThueCongViec
    ngay_binh_luan DATETIME DEFAULT CURRENT_TIMESTAMP,
    noi_dung TEXT NOT NULL,                   -- Nội dung bình luận
    sao_binh_luan INT DEFAULT 0,              -- Số sao đánh giá (1-5)
    loai_binh_luan VARCHAR(50) DEFAULT 'REVIEW', -- Loại: REVIEW, COMMENT
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_by INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_cong_viec) REFERENCES cong_viec(id),
    FOREIGN KEY (ma_nguoi_binh_luan) REFERENCES users(id),
    FOREIGN KEY (ma_thue_cong_viec) REFERENCES thue_cong_viec(id)
);
```

**Indexes:**
- `idx_binh_luan_ma_cong_viec` - Tối ưu tìm kiếm theo công việc
- `idx_binh_luan_ma_nguoi_binh_luan` - Tối ưu tìm kiếm theo người bình luận
- `idx_binh_luan_ma_thue_cong_viec` - Tối ưu tìm kiếm theo thuê công việc
- `idx_binh_luan_loai_binh_luan` - Tối ưu filter theo loại bình luận

### 7. **FileUpload Table** - Quản lý file upload
```sql
CREATE TABLE file_upload (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten_file VARCHAR(255) NOT NULL,           -- Tên file
    duong_dan VARCHAR(500) NOT NULL,          -- Đường dẫn file
    loai_file VARCHAR(100),                   -- Loại file: image, document, etc.
    kich_thuoc INT,                           -- Kích thước file (bytes)
    ma_nguoi_tao INT,                         -- FK đến Users
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_by INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_nguoi_tao) REFERENCES users(id)
);
```

### 8. **ThongBao Table** - Hệ thống thông báo
```sql
CREATE TABLE thong_bao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tieu_de VARCHAR(255) NOT NULL,            -- Tiêu đề thông báo
    noi_dung TEXT NOT NULL,                   -- Nội dung thông báo
    loai_thong_bao VARCHAR(100),              -- Loại: SYSTEM, JOB, HIRE, COMMENT
    ma_nguoi_nhan INT,                        -- FK đến Users
    da_doc BOOLEAN DEFAULT FALSE,             -- Trạng thái đã đọc
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_by INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_nguoi_nhan) REFERENCES users(id)
);
```

## 🔄 Workflow của hệ thống

### 1. **Quy trình đăng công việc:**
1. User (FREELANCER) tạo công việc mới
2. Công việc được phân loại theo ChiTietLoaiCongViec
3. Trạng thái: AVAILABLE

### 2. **Quy trình thuê công việc:**
1. User (CLIENT) thuê công việc
2. Trạng thái: PENDING
3. FREELANCER chấp nhận → ACCEPTED
4. Bắt đầu làm việc → IN_PROGRESS
5. Hoàn thành → COMPLETED

### 3. **Quy trình đánh giá:**
1. Sau khi hoàn thành, CLIENT đánh giá FREELANCER
2. Tạo bình luận với loai_binh_luan = 'REVIEW'
3. Cập nhật sao_cong_viec trong CongViec

## 🚀 Cài đặt và sử dụng

### 1. **Tạo database:**
```bash
# Sử dụng file database.sql
mysql -u root -p < database.sql

# Hoặc sử dụng Prisma
npm run prisma:db:push
```

### 2. **Seed dữ liệu mẫu:**
```bash
npm run db:seed
```

### 3. **Generate Prisma Client:**
```bash
npm run prisma:generate
```

### 4. **Mở Prisma Studio:**
```bash
npm run prisma:studio
```

## 📊 Queries mẫu

### 1. **Lấy danh sách công việc với phân loại:**
```sql
SELECT 
    cv.*,
    ctl.ten_chi_tiet,
    lcv.ten_loai_cong_viec,
    u.ho_ten as nguoi_tao
FROM cong_viec cv
JOIN chi_tiet_loai_cong_viec ctl ON cv.ma_chi_tiet_loai = ctl.id
JOIN loai_cong_viec lcv ON ctl.ma_loai_cong_viec = lcv.id
JOIN users u ON cv.nguoi_tao = u.id
WHERE cv.is_deleted = FALSE
ORDER BY cv.created_at DESC;
```

### 2. **Lấy thống kê công việc theo freelancer:**
```sql
SELECT 
    u.ho_ten,
    COUNT(cv.id) as tong_cong_viec,
    AVG(cv.sao_cong_viec) as trung_binh_sao,
    SUM(cv.so_luong_da_hoan_thanh) as cong_viec_hoan_thanh
FROM users u
LEFT JOIN cong_viec cv ON u.id = cv.nguoi_tao
WHERE u.role = 'FREELANCER' AND u.is_deleted = FALSE
GROUP BY u.id;
```

### 3. **Lấy danh sách thuê công việc theo trạng thái:**
```sql
SELECT 
    tcv.*,
    cv.ten_cong_viec,
    cv.gia_tien,
    client.ho_ten as ten_khach_hang,
    freelancer.ho_ten as ten_freelancer
FROM thue_cong_viec tcv
JOIN cong_viec cv ON tcv.ma_cong_viec = cv.id
JOIN users client ON tcv.ma_nguoi_thue = client.id
JOIN users freelancer ON tcv.ma_nguoi_lam = freelancer.id
WHERE tcv.is_deleted = FALSE
ORDER BY tcv.ngay_thue DESC;
```

## 🔧 Maintenance

### 1. **Backup database:**
```bash
mysqldump -u root -p capstone_fiverr > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. **Restore database:**
```bash
mysql -u root -p capstone_fiverr < backup_file.sql
```

### 3. **Kiểm tra performance:**
```sql
-- Kiểm tra slow queries
SHOW PROCESSLIST;

-- Kiểm tra index usage
SHOW INDEX FROM table_name;
```

## 📝 Lưu ý quan trọng

1. **Soft Delete**: Tất cả các bảng đều sử dụng soft delete với trường `is_deleted`
2. **Audit Trail**: Mọi thay đổi đều được ghi lại với `created_at`, `updated_at`
3. **Foreign Keys**: Sử dụng `ON DELETE NO ACTION` để bảo vệ dữ liệu
4. **Indexes**: Đã tối ưu cho các truy vấn thường xuyên sử dụng
5. **Relations**: Sử dụng named relations để tránh conflict

## 🆘 Troubleshooting

### 1. **Lỗi foreign key constraint:**
- Kiểm tra dữ liệu trong bảng cha
- Đảm bảo ID tồn tại trước khi tạo relation

### 2. **Lỗi duplicate entry:**
- Kiểm tra unique constraints
- Sử dụng `ON DUPLICATE KEY UPDATE` nếu cần

### 3. **Performance issues:**
- Kiểm tra execution plan với `EXPLAIN`
- Tối ưu indexes cho queries chậm
- Sử dụng connection pooling
