# ========================================
# CAPSTONE FIVERR API
# ========================================

## 🌟 Tính năng chính

- **NestJS v10**: Framework hiện đại cho Node.js
- **Prisma ORM**: Database ORM với type safety
- **MySQL Database**: Hệ quản trị cơ sở dữ liệu
- **JWT Authentication**: Xác thực và phân quyền
- **Swagger Documentation**: API documentation tự động
- **Environment Configuration**: Quản lý biến môi trường
- **Constants Management**: Quản lý constants tập trung
- **Middleware System**: Hệ thống middleware mạnh mẽ
- **Response Interceptors**: Chuẩn hóa response format
- **Error Handling**: Xử lý lỗi tập trung
- **Health Checks**: Kiểm tra trạng thái hệ thống
- **Docker Support**: Containerization đầy đủ

## 🐳 Docker Support

Project hỗ trợ đầy đủ Docker với nhiều môi trường khác nhau:

### 🚀 Quick Start với Docker

```bash
# Khởi động development environment
docker-compose up -d

# Hoặc sử dụng script PowerShell
.\scripts\docker-utils.ps1 dev-up

# Xem logs
.\scripts\docker-utils.ps1 logs api

# Dừng tất cả containers
.\scripts\docker-utils.ps1 down
```

### 🏗️ Docker Files

- **`docker-compose.yml`**: Cấu hình chính cho development
- **`docker-compose.override.yml`**: Override cho development với hot reload
- **`docker-compose.prod.yml`**: Cấu hình production
- **`Dockerfile`**: Production build
- **`Dockerfile.dev`**: Development build với hot reload

### 🔧 Docker Commands

```bash
# Development
docker-compose up -d                    # Khởi động development
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d

# Production
docker-compose -f docker-compose.prod.yml up -d

# Build images
docker-compose build
docker-compose -f docker-compose.prod.yml build

# View logs
docker-compose logs -f api
docker-compose logs -f mysql

# Stop services
docker-compose down
```

### 🛠️ Docker Utilities Scripts

#### PowerShell (Windows)
```powershell
# Khởi động development
.\scripts\docker-utils.ps1 dev-up

# Khởi động production
.\scripts\docker-utils.ps1 prod-up

# Xem status
.\scripts\docker-utils.ps1 status

# Cleanup
.\scripts\docker-utils.ps1 cleanup

# Help
.\scripts\docker-utils.ps1 help
```

#### Bash (Linux/Mac)
```bash
# Khởi động development
./scripts/docker-utils.sh dev-up

# Khởi động production
./scripts/docker-utils.sh prod-up

# Xem status
./scripts/docker-utils.sh status

# Cleanup
./scripts/docker-utils.sh cleanup

# Help
./scripts/docker-utils.sh help
```

### 🌐 Services

| Service | Port | Description |
|---------|------|-------------|
| **API** | 3000 | NestJS Backend API |
| **MySQL** | 3307 | Database server |

### 🔒 Security Features

- **Non-root user**: Containers chạy với user `nestjs` (UID 1001)
- **Health checks**: Tự động kiểm tra trạng thái services
- **Resource limits**: Giới hạn CPU và memory cho production
- **Network isolation**: Services được tách biệt trong network riêng
- **Volume persistence**: Database data được lưu trữ bền vững

### 📊 Monitoring

```bash
# Xem container status
docker-compose ps

# Xem resource usage
docker stats

# Xem logs real-time
docker-compose logs -f

# Health check
curl http://localhost:3000/api/v1/health
```

## 🛠️ Cài đặt và Setup

### Yêu cầu hệ thống

- **Node.js**: v18+ (khuyến nghị v22)
- **npm**: v8+
- **Docker**: v20+
- **Docker Compose**: v2+

### Cài đặt dependencies

```bash
# Cài đặt dependencies
npm install

# Generate Prisma client
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

### Development mode (Local)
```bash
npm run start:dev
```

### Development mode (Docker)
```bash
docker-compose up -d
```

### Production mode (Local)
```bash
npm run build
npm run start:prod
```

### Production mode (Docker)
```bash
docker-compose -f docker-compose.prod.yml up -d
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
- **Security Headers**: Các header bảo mật tự động
- **Request Validation**: Kiểm tra và validate tất cả requests

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

## 🐳 Docker Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MYSQL_ROOT_PASSWORD` | `123456` | MySQL root password |
| `MYSQL_DATABASE` | `capstone_fiverr` | Database name |
| `MYSQL_USER` | `capstone_user` | Database user |
| `MYSQL_PASSWORD` | `capstone_pass` | Database password |

## 🤝 Contributing

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Project này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.
