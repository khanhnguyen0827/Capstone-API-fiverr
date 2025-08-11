# Capstone API Fiverr

API backend cho nền tảng freelance tương tự Fiverr, được xây dựng với Node.js, Express và Prisma ORM.

## Cấu trúc Database

Database được thiết kế theo mô hình ERD với 6 bảng chính:

### 1. LoaiCongViec (Job Type)
- Quản lý các loại công việc chính (IT, Design, Marketing, etc.)

### 2. ChiTietLoaiCongViec (Job Type Detail)
- Quản lý chi tiết từng loại công việc
- Liên kết với LoaiCongViec

### 3. NguoiDung (User)
- Quản lý thông tin người dùng
- Hỗ trợ 2 role: freelancer và client

### 4. CongViec (Job)
- Quản lý các công việc được đăng
- Liên kết với người tạo và loại công việc

### 5. ThueCongViec (Job Rental)
- Quản lý việc thuê công việc
- Theo dõi trạng thái hoàn thành

### 6. BinhLuan (Comment)
- Quản lý bình luận và đánh giá
- Hỗ trợ rating bằng sao

## Cài đặt

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình Database
Tạo file `.env` với nội dung:
```env
DATABASE_URL="mysql://root:123456@localhost:3307/capstone_fiverr"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=3000
```

### 3. Tạo Database
Chạy file SQL để tạo database:
```bash
mysql -u root -p < database.sql
```

### 4. Khởi tạo Prisma
```bash
# Tạo Prisma client
npm run db:generate

# Đồng bộ schema với database
npm run db:push

# Hoặc tạo migration
npm run db:migrate
```

### 5. Khởi chạy ứng dụng
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Scripts có sẵn

- `npm run dev`: Chạy ứng dụng với nodemon (development)
- `npm start`: Chạy ứng dụng production
- `npm run db:generate`: Tạo Prisma client
- `npm run db:push`: Đồng bộ schema với database
- `npm run db:migrate`: Tạo và chạy migration
- `npm run db:studio`: Mở Prisma Studio để xem database

## Cấu trúc thư mục

```
├── config/
│   └── database.js          # Cấu hình kết nối database
├── prisma/
│   └── schema.prisma        # Schema Prisma
├── database.sql             # File SQL tạo database
├── package.json             # Dependencies và scripts
└── README.md               # Hướng dẫn sử dụng
```

## Kết nối Database

Database sử dụng MySQL với thông tin kết nối:
- Host: localhost
- Port: 3307
- User: root
- Password: 123456
- Database: capstone_fiverr

## Tính năng

- ✅ Quản lý người dùng (đăng ký, đăng nhập)
- ✅ Quản lý công việc (đăng, sửa, xóa)
- ✅ Thuê công việc
- ✅ Bình luận và đánh giá
- ✅ Phân loại công việc
- ✅ Tìm kiếm và lọc công việc
- ✅ JWT Authentication
- ✅ RESTful API

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

### Users
- `GET /api/users` - Lấy danh sách người dùng
- `GET /api/users/:id` - Lấy thông tin người dùng
- `PUT /api/users/:id` - Cập nhật thông tin người dùng

### Jobs
- `GET /api/jobs` - Lấy danh sách công việc
- `POST /api/jobs` - Tạo công việc mới
- `GET /api/jobs/:id` - Lấy thông tin công việc
- `PUT /api/jobs/:id` - Cập nhật công việc
- `DELETE /api/jobs/:id` - Xóa công việc

### Job Rentals
- `POST /api/rentals` - Thuê công việc
- `GET /api/rentals` - Lấy danh sách thuê
- `PUT /api/rentals/:id` - Cập nhật trạng thái

### Comments
- `GET /api/comments/:jobId` - Lấy bình luận của công việc
- `POST /api/comments` - Thêm bình luận
- `PUT /api/comments/:id` - Sửa bình luận
- `DELETE /api/comments/:id` - Xóa bình luận

## Lưu ý

- Đảm bảo MySQL server đang chạy trên port 3307
- Tạo database `capstone_fiverr` trước khi chạy ứng dụng
- Cập nhật thông tin kết nối database trong file `.env` nếu cần
