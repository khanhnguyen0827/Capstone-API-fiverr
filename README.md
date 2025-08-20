# 🚀 Capstone Fiverr API

API backend cho nền tảng Fiverr-like được xây dựng với **NestJS v10**, **Prisma ORM** và **MySQL**.

## 📋 Mô tả

Đây là một hệ thống quản lý công việc freelancer hoàn chỉnh, bao gồm:
- 👥 Quản lý người dùng (freelancer & client)
- 💼 Đăng tin và tìm kiếm công việc
- 🏷️ Phân loại công việc theo danh mục
- 💬 Hệ thống bình luận và đánh giá
- 🤝 Quy trình thuê và hoàn thành công việc
- 🔐 Xác thực JWT và phân quyền

## 🛠️ Công nghệ sử dụng

- **Framework**: NestJS v10
- **Database**: MySQL 8.0
- **ORM**: Prisma v6.14.0
- **Authentication**: JWT + Passport
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI
- **Container**: Docker & Docker Compose

## 📁 Cấu trúc project

```
src/
├── modules/
│   ├── auth/           # Xác thực & phân quyền
│   ├── users/          # Quản lý người dùng
│   ├── categories/     # Quản lý danh mục công việc
│   ├── jobs/           # Quản lý công việc
│   ├── comments/       # Quản lý bình luận
│   ├── hiring/         # Quản lý thuê công việc
│   └── prisma/         # Database service
├── main.ts             # Entry point
└── app.module.ts       # Root module
```

## 🚀 Cài đặt & Khởi chạy

### 1. Yêu cầu hệ thống
- Node.js v18+ 
- MySQL 8.0+
- Docker & Docker Compose (khuyến nghị)

### 2. Clone project
```bash
git clone <repository-url>
cd Capstone-API-fiverr
```

### 3. Cài đặt dependencies
```bash
npm install
```

### 4. Cấu hình môi trường
Tạo file `.env` với nội dung:
```env
# Database Configuration
DATABASE_URL="mysql://root:123456@localhost:3308/capstone_fiverr"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN="http://localhost:3000"

# Database Timezone
TZ="Asia/Ho_Chi_Minh"
```

### 5. Khởi động database
```bash
# Sử dụng Docker (khuyến nghị)
docker-compose up -d DB

# Hoặc kết nối trực tiếp MySQL
mysql -u root -p < database.sql
```

### 6. Generate Prisma client
```bash
npx prisma generate
```

### 7. Khởi động ứng dụng
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 🐳 Sử dụng Docker

### Khởi động toàn bộ hệ thống
```bash
docker-compose up -d
```

### Chỉ khởi động database
```bash
docker-compose up -d DB
```

### Xem logs
```bash
docker-compose logs -f
```

## 📚 API Documentation

Sau khi khởi động, truy cập Swagger UI tại:
```
http://localhost:3000/api-docs
```

### Base URL
```
http://localhost:3000/api/v1
```

## 🔐 API Endpoints

### Authentication
- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `POST /auth/refresh` - Làm mới token
- `GET /auth/profile` - Lấy profile

### Users
- `GET /users` - Lấy danh sách người dùng
- `GET /users/profile` - Lấy profile người dùng
- `GET /users/:id` - Lấy thông tin người dùng theo ID
- `POST /users` - Tạo người dùng mới
- `PUT /users/:id` - Cập nhật thông tin người dùng
- `DELETE /users/:id` - Xóa người dùng

### Categories
- `GET /categories` - Lấy danh mục chính
- `GET /categories/sub` - Lấy danh mục con
- `GET /categories/:id` - Lấy chi tiết danh mục
- `POST /categories` - Tạo danh mục chính
- `POST /categories/sub` - Tạo danh mục con
- `PUT /categories/:id` - Cập nhật danh mục chính
- `PUT /categories/sub/:id` - Cập nhật danh mục con
- `DELETE /categories/:id` - Xóa danh mục chính
- `DELETE /categories/sub/:id` - Xóa danh mục con

### Jobs
- `GET /jobs` - Lấy danh sách công việc (có search, pagination)
- `GET /jobs/user/:userId` - Lấy công việc theo người dùng
- `GET /jobs/category/:categoryId` - Lấy công việc theo danh mục
- `GET /jobs/:id` - Lấy chi tiết công việc
- `POST /jobs` - Tạo công việc mới
- `PUT /jobs/:id` - Cập nhật công việc
- `DELETE /jobs/:id` - Xóa công việc

### Comments
- `GET /comments/job/:jobId` - Lấy bình luận theo công việc
- `POST /comments` - Tạo bình luận mới
- `PUT /comments/:id` - Cập nhật bình luận
- `DELETE /comments/:id` - Xóa bình luận

### Hiring
- `GET /hiring/hired` - Lấy công việc đã thuê (cho client)
- `GET /hiring/freelancer` - Lấy công việc được thuê (cho freelancer)
- `POST /hiring` - Thuê công việc
- `PUT /hiring/:id/complete` - Đánh dấu hoàn thành
- `PUT /hiring/:id/cancel` - Hủy thuê công việc
- `GET /hiring/:id` - Lấy chi tiết công việc được thuê

## 🗄️ Database Schema

### Bảng chính
- **NguoiDung** - Thông tin người dùng
- **LoaiCongViec** - Danh mục công việc chính
- **ChiTietLoaiCongViec** - Danh mục công việc chi tiết
- **CongViec** - Thông tin công việc
- **ThueCongViec** - Quản lý thuê công việc
- **BinhLuan** - Hệ thống bình luận

## 🔧 Scripts có sẵn

```bash
# Development
npm run start:dev      # Khởi động với watch mode
npm run start:debug    # Khởi động với debug mode

# Production
npm run build          # Build project
npm run start:prod     # Khởi động production

# Testing
npm run test           # Chạy unit tests
npm run test:e2e       # Chạy end-to-end tests
npm run test:cov       # Chạy tests với coverage

# Code quality
npm run lint           # Kiểm tra code style
npm run format         # Format code với Prettier
```

## 🚨 Troubleshooting

### Lỗi thường gặp

1. **Port 3000 đã được sử dụng**
   ```bash
   # Kiểm tra process đang sử dụng port
   netstat -ano | findstr :3000
   
   # Dừng process
   taskkill /f /pid <PID>
   ```

2. **Database connection failed**
   ```bash
   # Kiểm tra MySQL service
   docker ps | grep mysql
   
   # Restart database
   docker-compose restart DB
   ```

3. **Prisma client not generated**
   ```bash
   npx prisma generate
   ```

4. **Dependencies not found**
   ```bash
   npm install
   ```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | - |
| `JWT_SECRET` | Secret key cho JWT | - |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `CORS_ORIGIN` | CORS origin | `http://localhost:3000` |
| `TZ` | Timezone | `Asia/Ho_Chi_Minh` |

## 🤝 Contributing

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

