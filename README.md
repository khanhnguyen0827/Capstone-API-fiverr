# 🚀 Capstone API Fiverr

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
</p>

API backend hiện đại cho ứng dụng Fiverr - Quản lý công việc freelance được xây dựng với **NestJS v11**, **Prisma ORM** và **MySQL**.

## ✨ Tính năng chính

- 🔐 **Xác thực & Phân quyền**: JWT-based authentication với role-based access control
- 👥 **Quản lý người dùng**: CRUD operations với validation và phân quyền
- 💼 **Quản lý công việc**: Tạo, cập nhật, xóa và tìm kiếm công việc
- 💬 **Quản lý bình luận**: Hệ thống bình luận và đánh giá sao
- 📋 **Quản lý thuê công việc**: Theo dõi trạng thái và tiến độ công việc
- 🏷️ **Phân loại công việc**: Hệ thống phân loại đa cấp (loại công việc > chi tiết loại)
- 📚 **API Documentation**: Swagger/OpenAPI với Bearer token authentication
- 📊 **Logging & Monitoring**: Comprehensive logging và error handling
- 🛡️ **Security**: CORS, validation, rate limiting, và error handling
- 🐳 **Docker Support**: Containerization với Docker Compose

## 🛠️ Công nghệ sử dụng

### Core Framework
- **NestJS**: v11.0.1 - Progressive Node.js framework
- **TypeScript**: v5.7.3 - Type-safe JavaScript
- **Node.js**: ES2023 support

### Database & ORM
- **MySQL**: v8.0 - Relational database
- **Prisma**: v6.10.1 - Modern database toolkit

### Authentication & Security
- **JWT**: JSON Web Tokens
- **bcrypt**: Password hashing
- **Passport**: Authentication strategies
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing

### Validation & Documentation
- **class-validator**: Input validation
- **class-transformer**: Object transformation
- **Swagger/OpenAPI**: API documentation

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Testing framework

## 📋 Yêu cầu hệ thống

- **Node.js**: 18.x hoặc cao hơn
- **MySQL**: 8.0+
- **npm**: 8.x hoặc cao hơn
- **Docker**: (tùy chọn, để chạy với Docker)

## 🚀 Cài đặt và chạy

### 1. Clone repository
```bash
git clone <repository-url>
cd Capstone-API-fiverr
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình môi trường
```bash
# Copy file môi trường
cp env.example .env

# Chỉnh sửa các biến môi trường trong .env
DATABASE_URL="mysql://root:123456@localhost:3307/capstone_fiverr"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=3000
```

### 4. Cài đặt và migrate database
```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# (Tùy chọn) Seed dữ liệu mẫu
npm run db:seed
```

### 5. Chạy ứng dụng
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 🐳 Chạy với Docker

### Sử dụng Docker Compose
```bash
# Build và chạy tất cả services
docker-compose up --build

# Chạy ở background
docker-compose up -d

# Dừng services
docker-compose down
```

### Chạy từng service riêng biệt
```bash
# Chỉ chạy database
docker-compose up DB

# Chỉ chạy backend
docker-compose up BE
```

## 🌐 API Endpoints

### Base URL: `http://localhost:3000/api/v1`

### 📚 Documentation
- **Swagger UI**: `http://localhost:3000/docs`
- **API Spec**: `http://localhost:3000/docs-json`

### 🔐 Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Đăng ký người dùng mới | ❌ |
| `POST` | `/auth/login` | Đăng nhập | ❌ |
| `GET` | `/auth/profile` | Lấy thông tin profile | ✅ |
| `POST` | `/auth/logout` | Đăng xuất | ✅ |

### 👥 Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/users` | Lấy danh sách người dùng | ✅ |
| `GET` | `/users/:id` | Lấy thông tin người dùng | ✅ |
| `POST` | `/users` | Tạo người dùng mới | ✅ |
| `PATCH` | `/users/:id` | Cập nhật thông tin | ✅ |
| `DELETE` | `/users/:id` | Xóa người dùng | ✅ |

### 💼 Jobs (Công việc)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/cong-viec` | Lấy danh sách công việc | ❌ |
| `GET` | `/cong-viec/:id` | Lấy chi tiết công việc | ❌ |
| `POST` | `/cong-viec` | Tạo công việc mới | ✅ |
| `PATCH` | `/cong-viec/:id` | Cập nhật công việc | ✅ |
| `DELETE` | `/cong-viec/:id` | Xóa công việc | ✅ |

### 💬 Comments (Bình luận)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/binh-luan` | Lấy danh sách bình luận | ❌ |
| `POST` | `/binh-luan` | Tạo bình luận mới | ✅ |
| `PATCH` | `/binh-luan/:id` | Cập nhật bình luận | ✅ |
| `DELETE` | `/binh-luan/:id` | Xóa bình luận | ✅ |

### 📋 Job Categories
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/loai-cong-viec` | Lấy danh sách loại công việc | ❌ |
| `GET` | `/chi-tiet-loai-cong-viec` | Lấy chi tiết loại công việc | ❌ |

### 🔄 Job Hires
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/thue-cong-viec` | Lấy danh sách thuê công việc | ✅ |
| `POST` | `/thue-cong-viec` | Thuê công việc | ✅ |
| `PATCH` | `/thue-cong-viec/:id` | Cập nhật trạng thái | ✅ |

## 🔐 Authentication

### JWT Token
API sử dụng JWT Bearer token để xác thực. Thêm header:
```
Authorization: Bearer <your-jwt-token>
```

### Roles & Permissions
- **ADMIN**: Quyền truy cập tất cả
- **USER**: Quyền cơ bản
- **FREELANCER**: Người cung cấp dịch vụ
- **CLIENT**: Người thuê dịch vụ

## 📊 Database Schema

### Users Table
- Thông tin cá nhân: họ tên, email, phone, birth_day, gender
- Thông tin chuyên môn: skill, certification
- Phân quyền: role, is_active
- Audit: created_at, updated_at, deleted_at

### Jobs Table
- Thông tin công việc: tên, mô tả, giá tiền
- Đánh giá: sao_cong_viec, danh_gia
- Trạng thái: trang_thai (AVAILABLE, IN_PROGRESS, COMPLETED)
- Liên kết: ma_chi_tiet_loai, nguoi_tao

### Comments Table
- Nội dung bình luận và đánh giá sao
- Liên kết với công việc và người bình luận

### Job Categories
- Hệ thống phân loại 2 cấp: Loại công việc > Chi tiết loại

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Test in watch mode
npm run test:watch
```

## 📝 Scripts

```bash
# Development
npm run start:dev          # Chạy với watch mode
npm run start:debug        # Chạy với debug mode

# Production
npm run build              # Build ứng dụng
npm run start:prod        # Chạy production

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # Open Prisma Studio
npm run db:seed           # Seed dữ liệu mẫu
npm run db:push           # Push schema to database

# Code quality
npm run lint              # Lint code
npm run format            # Format code với Prettier
```

## 🏗️ Project Structure

```
src/
├── common/                 # Shared utilities
│   ├── constants/         # Application constants
│   ├── decorators/        # Custom decorators
│   ├── dto/              # Base DTOs
│   ├── filters/           # Exception filters
│   ├── guards/            # Authentication guards
│   ├── interceptors/      # Response interceptors
│   ├── middleware/        # Custom middleware
│   └── strategies/        # Passport strategies
├── modules/               # Feature modules
│   ├── auth/             # Authentication module
│   ├── user/             # User management
│   ├── cong-viec/        # Job management
│   ├── binh-luan/        # Comment management
│   ├── thue-cong-viec/   # Job hiring
│   ├── loai-cong-viec/   # Job categories
│   ├── chi-tiet-loai-cong-viec/ # Job subcategories
│   └── prisma/           # Database service
├── app.module.ts          # Root module
└── main.ts               # Application entry point
```

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL="mysql://user:password@host:port/database"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1d"

# Server
PORT=3000
NODE_ENV="development"

# Security
BCRYPT_SALT_ROUNDS=10
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start:prod
```

### Docker Deployment
```bash
docker build -t capstone-api-fiverr .
docker run -p 3000:3000 capstone-api-fiverr
```

### Environment Variables
Đảm bảo cấu hình đúng các biến môi trường cho production:
- `NODE_ENV=production`
- `DATABASE_URL` (production database)
- `JWT_SECRET` (strong secret key)
- `ALLOWED_ORIGINS` (production domains)

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License

Dự án này được cấp phép theo [MIT License](LICENSE).

## 🆘 Support

- 📧 Email: support@example.com
- 📖 Documentation: [API Docs](http://localhost:3000/docs)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

**Made with ❤️ using NestJS**
