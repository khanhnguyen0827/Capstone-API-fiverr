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
- ✅ **Environment Configuration**: Quản lý biến môi trường với dotenv
- ✅ **Constants Management**: Hệ thống constants tập trung và type-safe

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
│   ├── constant/
│   │   └── app.constant.ts        # Application constants & env vars
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

### 2. Cấu hình Environment Variables

#### Tạo file `.env` từ template:
```bash
cp env.example .env
```

#### Cấu hình các biến môi trường chính:

**Application Environment:**
```env
NODE_ENV=development
PORT=3000
```

**Database Configuration:**
```env
DATABASE_URL=mysql://root:password@localhost:3306/capstone_fiverr
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_TIMEOUT=30000
```

**JWT Configuration:**
```env
JWT_SECRET=your-super-secret-jwt-key-2024
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-2024
JWT_REFRESH_EXPIRES_IN=7d
```

**Security Configuration:**
```env
BCRYPT_ROUNDS=10
CORS_ORIGIN=*
API_RATE_LIMIT=100
API_RATE_LIMIT_WINDOW=900000
```

**API Configuration:**
```env
API_PREFIX=api
API_VERSION=v1
SWAGGER_PATH=api-docs
SWAGGER_ENABLED=true
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

# Push schema to database
npm run db:push
```

## 🔧 Cấu hình Constants

Project sử dụng hệ thống constants tập trung trong `src/common/constant/app.constant.ts`:

### Environment Variables
```typescript
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'mysql://...',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  // ... more env vars
} as const;
```

### Configuration Objects
```typescript
export const JWT_CONFIG = {
  secret: ENV.JWT_SECRET,
  expiresIn: ENV.JWT_EXPIRES_IN,
  algorithm: 'HS256' as const,
} as const;

export const SECURITY_CONFIG = {
  bcryptRounds: ENV.BCRYPT_ROUNDS,
  corsOrigin: ENV.CORS_ORIGIN,
  // ... more security config
} as const;
```

### Validation Messages
```typescript
export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email không được để trống',
  PASSWORD_MIN_LENGTH: 'Mật khẩu phải có ít nhất 6 ký tự',
  // ... more validation messages
} as const;
```

## 🚀 Chạy ứng dụng

### Development mode
```bash
npm run start:dev
```

### Production mode
```bash
npm run build
npm run start:prod
```

## 📚 API Documentation

Sau khi khởi động ứng dụng, truy cập Swagger UI tại:
```
http://localhost:3000/api-docs
```

## 🔒 Security Features

- **JWT Authentication**: Xác thực người dùng với JWT tokens
- **Password Hashing**: Mật khẩu được hash với bcrypt
- **Role-based Access Control**: Phân quyền theo vai trò người dùng
- **CORS Configuration**: Cấu hình CORS linh hoạt
- **Rate Limiting**: Giới hạn số lượng request
- **Input Validation**: Validation tất cả input với class-validator

## 📝 Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Môi trường chạy ứng dụng |
| `PORT` | `3000` | Port mà ứng dụng lắng nghe |
| `DATABASE_URL` | `mysql://...` | URL kết nối database |
| `JWT_SECRET` | `your-secret-key` | Secret key cho JWT |
| `JWT_EXPIRES_IN` | `1d` | Thời gian hết hạn JWT |
| `BCRYPT_ROUNDS` | `10` | Số rounds hash password |
| `CORS_ORIGIN` | `*` | Origin cho CORS |
| `API_PREFIX` | `api` | Prefix cho API endpoints |
| `SWAGGER_ENABLED` | `true` | Bật/tắt Swagger UI |

## 🤝 Contributing

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Project này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.
