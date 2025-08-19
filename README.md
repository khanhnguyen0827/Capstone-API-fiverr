<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Capstone API Fiverr

API backend cho ứng dụng Fiverr clone được xây dựng với NestJS và Prisma.

## Mô tả

Đây là một API backend hoàn chỉnh cho ứng dụng Fiverr clone, bao gồm các chức năng:
- Quản lý người dùng (User Management)
- Xác thực và phân quyền (Authentication & Authorization)
- Quản lý công việc (Job Management)
- Quản lý bình luận (Comment Management)
- Quản lý thuê công việc (Job Hiring Management)
- Phân loại công việc (Job Categories)

## Công nghệ sử dụng

- **Framework**: NestJS v11
- **Database**: MySQL với Prisma ORM
- **Authentication**: JWT với bcrypt
- **Validation**: class-validator
- **Language**: TypeScript

## Cấu trúc dự án

```
src/
├── modules/
│   ├── auth/           # Xác thực và phân quyền
│   ├── user/           # Quản lý người dùng
│   ├── cong-viec/      # Quản lý công việc
│   ├── binh-luan/      # Quản lý bình luận
│   ├── thue-cong-viec/ # Quản lý thuê công việc
│   ├── loai-cong-viec/ # Quản lý loại công việc
│   ├── chi-tiet-loai-cong-viec/ # Quản lý chi tiết loại công việc
│   └── prisma/         # Database service
├── app.module.ts        # Module chính
└── main.ts             # Entry point
```

## Cài đặt

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
Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Cập nhật các biến môi trường:
```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"

# Server Configuration
PORT=3000

# Environment
NODE_ENV=development
```

### 4. Cài đặt và migrate database
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database (nếu có)
npx prisma db seed
```

### 5. Chạy ứng dụng
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## API Endpoints

### Authentication
- `POST /auth/register` - Đăng ký người dùng mới
- `POST /auth/login` - Đăng nhập
- `GET /auth/profile` - Lấy thông tin profile (cần JWT token)

### Users
- `GET /users` - Lấy danh sách người dùng (có pagination và filters)
- `POST /users` - Tạo người dùng mới
- `GET /users/:id` - Lấy thông tin người dùng theo ID
- `PATCH /users/:id` - Cập nhật thông tin người dùng
- `DELETE /users/:id` - Xóa người dùng

### Công việc (Jobs)
- `GET /cong-viec` - Lấy danh sách công việc
- `POST /cong-viec` - Tạo công việc mới
- `GET /cong-viec/:id` - Lấy thông tin công việc theo ID
- `PATCH /cong-viec/:id` - Cập nhật công việc
- `DELETE /cong-viec/:id` - Xóa công việc
- `GET /cong-viec/category/:maChiTietLoai` - Lấy công việc theo danh mục
- `GET /cong-viec/user/:nguoiTao` - Lấy công việc theo người tạo

### Bình luận (Comments)
- `GET /binh-luan` - Lấy danh sách bình luận
- `POST /binh-luan` - Tạo bình luận mới
- `GET /binh-luan/:id` - Lấy thông tin bình luận theo ID
- `PATCH /binh-luan/:id` - Cập nhật bình luận
- `DELETE /binh-luan/:id` - Xóa bình luận
- `GET /binh-luan/cong-viec/:maCongViec` - Lấy bình luận theo công việc
- `GET /binh-luan/user/:maNguoiBinhLuan` - Lấy bình luận theo người dùng

### Thuê công việc (Job Hiring)
- `GET /thue-cong-viec` - Lấy danh sách thuê công việc
- `POST /thue-cong-viec` - Tạo thuê công việc mới
- `GET /thue-cong-viec/:id` - Lấy thông tin thuê công việc theo ID
- `PATCH /thue-cong-viec/:id` - Cập nhật thuê công việc
- `DELETE /thue-cong-viec/:id` - Xóa thuê công việc
- `PATCH /thue-cong-viec/:id/complete` - Hoàn thành công việc
- `GET /thue-cong-viec/cong-viec/:maCongViec` - Lấy thuê công việc theo công việc
- `GET /thue-cong-viec/user/:maNguoiThue` - Lấy thuê công việc theo người thuê

### Loại công việc (Job Categories)
- `GET /loai-cong-viec` - Lấy danh sách loại công việc
- `POST /loai-cong-viec` - Tạo loại công việc mới
- `GET /loai-cong-viec/:id` - Lấy thông tin loại công việc theo ID
- `PATCH /loai-cong-viec/:id` - Cập nhật loại công việc
- `DELETE /loai-cong-viec/:id` - Xóa loại công việc

### Chi tiết loại công việc (Job Subcategories)
- `GET /chi-tiet-loai-cong-viec` - Lấy danh sách chi tiết loại công việc
- `POST /chi-tiet-loai-cong-viec` - Tạo chi tiết loại công việc mới
- `GET /chi-tiet-loai-cong-viec/:id` - Lấy thông tin chi tiết loại công việc theo ID
- `PATCH /chi-tiet-loai-cong-viec/:id` - Cập nhật chi tiết loại công việc
- `DELETE /chi-tiet-loai-cong-viec/:id` - Xóa chi tiết loại công việc
- `GET /chi-tiet-loai-cong-viec/loai-cong-viec/:maLoaiCongViec` - Lấy chi tiết theo loại công việc

## Tính năng

### Pagination
Tất cả các endpoint GET danh sách đều hỗ trợ pagination:
```
GET /users?page=1&pageSize=10
```

### Filters
Hỗ trợ filters dưới dạng JSON:
```
GET /users?filters={"name":"John","role":"user"}
```

### Validation
Sử dụng class-validator để validate dữ liệu đầu vào

### Error Handling
Xử lý lỗi chuẩn với HTTP status codes phù hợp

### CORS
Đã bật CORS để hỗ trợ frontend

## Database Schema

Dự án sử dụng Prisma với các model chính:
- `NguoiDung` - Người dùng
- `CongViec` - Công việc
- `BinhLuan` - Bình luận
- `ThueCongViec` - Thuê công việc
- `LoaiCongViec` - Loại công việc
- `ChiTietLoaiCongViec` - Chi tiết loại công việc

## Development

### Scripts
```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Lint
npm run lint

# Test
npm run test
```

### Database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio
```

## License

MIT License
