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
- 🏷️ **Phân loại công việc**: Hệ thống phân loại đa cấp
- 📚 **API Documentation**: Swagger/OpenAPI với Bearer token authentication
- 🛡️ **Security**: CORS, validation, rate limiting, và error handling
- 🐳 **Docker Support**: Containerization với Docker Compose

## 🛠️ Công nghệ sử dụng

- **NestJS v11.0.1** - Progressive Node.js framework
- **TypeScript v5.7.3** - Type-safe JavaScript
- **MySQL v8.0** - Relational database
- **Prisma v6.10.1** - Modern database toolkit
- **JWT** - Authentication
- **Swagger/OpenAPI** - API documentation

## 📋 Yêu cầu hệ thống

- **Node.js**: 18.x hoặc cao hơn
- **MySQL**: 8.0+
- **npm**: 8.x hoặc cao hơn
- **Docker**: (tùy chọn)

## 🚀 Cài đặt và chạy

### 1. Clone và cài đặt
```bash
git clone <repository-url>
cd Capstone-API-fiverr
npm install
```

### 2. Cấu hình môi trường
```bash
cp env.example .env
# Chỉnh sửa DATABASE_URL, JWT_SECRET, PORT trong .env
```

### 3. Database setup
```bash
npm run prisma:generate
npm run prisma:push
npm run db:seed  # Tùy chọn
```

### 4. Chạy ứng dụng
```bash
npm run start:dev    # Development
npm run build        # Production build
npm run start:prod   # Production
```

## 🐳 Docker

```bash
# Tất cả services
docker-compose up --build

# Chỉ database
docker-compose up DB

# Chỉ backend
docker-compose up BE
```

## 🌐 API Endpoints

### Base URL: `http://localhost:3000/api/v1`

- **Swagger UI**: `http://localhost:3000/api-docs`
- **API Spec**: `http://localhost:3000/docs-json`

### 🔐 Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Đăng ký | ❌ |
| `POST` | `/auth/login` | Đăng nhập | ❌ |
| `GET` | `/auth/profile` | Profile | ✅ |
| `POST` | `/auth/logout` | Đăng xuất | ✅ |

### 👥 Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/users` | Danh sách | ✅ |
| `GET` | `/users/:id` | Chi tiết | ✅ |
| `POST` | `/users` | Tạo mới | ✅ |
| `PATCH` | `/users/:id` | Cập nhật | ✅ |
| `DELETE` | `/users/:id` | Xóa | ✅ |

### 💼 Jobs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/cong-viec` | Danh sách | ❌ |
| `GET` | `/cong-viec/:id` | Chi tiết | ❌ |
| `POST` | `/cong-viec` | Tạo mới | ✅ |
| `PATCH` | `/cong-viec/:id` | Cập nhật | ✅ |
| `DELETE` | `/cong-viec/:id` | Xóa | ✅ |

### 💬 Comments
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/binh-luan` | Danh sách | ❌ |
| `POST` | `/binh-luan` | Tạo mới | ✅ |
| `PATCH` | `/binh-luan/:id` | Cập nhật | ✅ |
| `DELETE` | `/binh-luan/:id` | Xóa | ✅ |

### 📋 Categories & Hires
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/loai-cong-viec` | Loại công việc | ❌ |
| `GET` | `/chi-tiet-loai-cong-viec` | Chi tiết loại | ❌ |
| `GET` | `/thue-cong-viec` | Danh sách thuê | ✅ |
| `POST` | `/thue-cong-viec` | Thuê công việc | ✅ |
| `PATCH` | `/thue-cong-viec/:id` | Cập nhật trạng thái | ✅ |

## 🔐 Authentication

### JWT Token
```
Authorization: Bearer <your-jwt-token>
```

### Roles
- **ADMIN**: Quyền truy cập tất cả
- **USER**: Quyền cơ bản
- **FREELANCER**: Người cung cấp dịch vụ
- **CLIENT**: Người thuê dịch vụ

## 📊 Database Schema

### Core Tables
- **Users**: Thông tin cá nhân, chuyên môn, phân quyền
- **Jobs**: Thông tin công việc, đánh giá, trạng thái
- **Comments**: Bình luận và đánh giá sao
- **Categories**: Hệ thống phân loại 2 cấp

## 🧪 Testing

```bash
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage
npm run test:watch    # Watch mode
```

## 📝 Scripts

```bash
# Development
npm run start:dev          # Watch mode
npm run start:debug        # Debug mode

# Production
npm run build              # Build
npm run start:prod        # Production

# Database
npm run prisma:generate    # Generate client
npm run prisma:push       # Push schema
npm run prisma:studio     # Prisma Studio
npm run db:seed           # Seed data

# Code quality
npm run lint              # Lint
npm run format            # Format
```

## 🏗️ Project Structure

```
src/
├── modules/               # Feature modules
│   ├── auth/             # Authentication
│   ├── users/            # User management
│   ├── jobs/             # Job management
│   ├── comments/         # Comment management
│   ├── hiring/           # Job hiring
│   ├── categories/       # Job categories
│   └── prisma/           # Database service
├── app.module.ts          # Root module
└── main.ts               # Entry point
```

## 🔧 Environment Variables

```bash
DATABASE_URL="mysql://user:password@host:port/database"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1d"
PORT=3000
NODE_ENV="development"
BCRYPT_SALT_ROUNDS=10
```

## 🚀 Deployment

### Production
```bash
npm run build
npm run start:prod
```

### Docker
```bash
docker build -t capstone-api-fiverr .
docker run -p 3000:3000 capstone-api-fiverr
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License

Dự án này được cấp phép theo [MIT License](LICENSE).

---

**Made with ❤️ using NestJS**
