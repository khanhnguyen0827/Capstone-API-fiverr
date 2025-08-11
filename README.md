# Capstone API Fiverr

API backend cho nền tảng freelance tương tự Fiverr, được xây dựng với **NestJS**, **Prisma ORM** và **MySQL**.

## 🚀 Tính năng chính

- ✅ **Authentication**: Đăng ký, đăng nhập với JWT
- ✅ **User Management**: CRUD người dùng với role-based access
- ✅ **Job Management**: Quản lý công việc, danh mục
- ✅ **Database**: MySQL với Prisma ORM
- ✅ **API Documentation**: Swagger UI
- ✅ **Validation**: Class-validator với DTOs
- ✅ **Security**: JWT authentication, password hashing

## 🏗️ Cấu trúc Database

Database được thiết kế theo mô hình ERD với 6 bảng chính:

### 1. **LoaiCongViec** (Job Type)
- Quản lý các loại công việc chính (IT, Design, Marketing, etc.)

### 2. **ChiTietLoaiCongViec** (Job Type Detail)
- Quản lý chi tiết từng loại công việc
- Liên kết với LoaiCongViec

### 3. **NguoiDung** (User)
- Quản lý thông tin người dùng
- Hỗ trợ 2 role: freelancer và client

### 4. **CongViec** (Job)
- Quản lý các công việc được đăng
- Liên kết với người tạo và loại công việc

### 5. **ThueCongViec** (Job Rental)
- Quản lý việc thuê công việc
- Theo dõi trạng thái hoàn thành

### 6. **BinhLuan** (Comment)
- Quản lý bình luận và đánh giá
- Hỗ trợ rating bằng sao

## 📁 Cấu trúc dự án

```
src/
├── common/
│   └── prisma/
│       └── prisma.service.ts      # Prisma service
├── modules/
│   ├── auth/                      # Authentication module
│   │   ├── auth.controller.ts     # Auth endpoints
│   │   ├── auth.service.ts        # Auth business logic
│   │   ├── auth.module.ts         # Auth module config
│   │   ├── jwt.strategy.ts        # JWT strategy
│   │   ├── jwt-auth.guard.ts      # JWT guard
│   │   └── dto/
│   │       └── auth.dto.ts        # Auth DTOs
│   ├── users/                     # Users module
│   │   ├── users.controller.ts    # User endpoints
│   │   ├── users.service.ts       # User business logic
│   │   ├── users.module.ts        # User module config
│   │   └── dto/
│   │       └── users.dto.ts       # User DTOs
│   └── jobs/                      # Jobs module
│       ├── jobs.controller.ts     # Job endpoints
│       ├── jobs.service.ts        # Job business logic
│       ├── jobs.module.ts         # Job module config
│       └── dto/
│           └── jobs.dto.ts        # Job DTOs
├── app.module.ts                  # Root module
├── main.ts                        # Application entry point
└── prisma/
    └── schema.prisma              # Database schema
```

## 🛠️ Cài đặt

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
npm run start:dev

# Production mode
npm run start:prod
```

## 📚 API Endpoints

### 🔐 Authentication
- `POST /api/auth/signup` - Đăng ký người dùng mới
- `POST /api/auth/signin` - Đăng nhập

### 👥 Users
- `GET /api/users` - Lấy danh sách người dùng (có pagination)
- `GET /api/users/:id` - Lấy thông tin người dùng theo ID
- `POST /api/users` - Tạo người dùng mới
- `PUT /api/users/:id` - Cập nhật thông tin người dùng (cần auth)
- `DELETE /api/users/:id` - Xóa người dùng (cần auth)
- `GET /api/users/profile/me` - Lấy thông tin profile của user hiện tại (cần auth)

### 💼 Jobs
- `GET /api/jobs` - Lấy danh sách công việc (có pagination, search, filter)
- `GET /api/jobs/:id` - Lấy thông tin công việc theo ID
- `POST /api/jobs` - Tạo công việc mới (cần auth)
- `PUT /api/jobs/:id` - Cập nhật công việc (cần auth)
- `DELETE /api/jobs/:id` - Xóa công việc (cần auth)
- `GET /api/jobs/categories/list` - Lấy danh sách danh mục công việc

## 🔧 Scripts có sẵn

- `npm run start:dev`: Chạy ứng dụng với nodemon (development)
- `npm run start`: Chạy ứng dụng production
- `npm run build`: Build ứng dụng
- `npm run db:generate`: Tạo Prisma client
- `npm run db:push`: Đồng bộ schema với database
- `npm run db:migrate`: Tạo và chạy migration
- `npm run db:studio`: Mở Prisma Studio để xem database

## 🌐 Truy cập ứng dụng

- **API Server**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/api/health

## 🔒 Bảo mật

- **JWT Authentication**: Sử dụng Bearer token
- **Password Hashing**: Bcrypt với salt rounds
- **Role-based Access**: Kiểm soát quyền truy cập
- **Input Validation**: Class-validator với DTOs

## 📊 Response Format

Tất cả API responses đều theo format chuẩn:

```json
{
  "statusCode": 200,
  "message": "Thông báo thành công",
  "content": "Dữ liệu trả về",
  "dateTime": "2024-01-20T10:30:00.000Z"
}
```

## 🚨 Error Handling

Errors được xử lý với HTTP status codes phù hợp:

- `400 Bad Request`: Dữ liệu đầu vào không hợp lệ
- `401 Unauthorized`: Chưa đăng nhập hoặc token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Tài nguyên không tồn tại
- `500 Internal Server Error`: Lỗi server

## 🔍 Database Connection

Database sử dụng MySQL với thông tin kết nối:
- **Host**: localhost
- **Port**: 3307
- **User**: root
- **Password**: 123456
- **Database**: capstone_fiverr

## 📝 Lưu ý

- Đảm bảo MySQL server đang chạy trên port 3307
- Tạo database `capstone_fiverr` trước khi chạy ứng dụng
- Cập nhật thông tin kết nối database trong file `.env` nếu cần
- Sử dụng Bearer token trong header `Authorization` cho các API cần auth

## 🆘 Troubleshooting

### Lỗi kết nối database
- Kiểm tra MySQL server có đang chạy không
- Kiểm tra port 3307 có đúng không
- Kiểm tra username/password MySQL

### Lỗi Prisma
```bash
# Reset Prisma
npx prisma migrate reset
npx prisma generate
npx prisma db push
```

### Lỗi port đã sử dụng
Thay đổi port trong file `.env`:
```env
PORT=3001
```
