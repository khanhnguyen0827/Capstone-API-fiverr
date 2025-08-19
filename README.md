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

API backend cho ứng dụng Fiverr - Quản lý công việc freelance được xây dựng với NestJS v10, Prisma ORM và MySQL.

## 🚀 Tính năng

- **Xác thực & Phân quyền**: JWT-based authentication với refresh token
- **Quản lý người dùng**: CRUD operations với validation
- **Quản lý công việc**: Tạo, cập nhật, xóa và tìm kiếm công việc
- **Quản lý bình luận**: Hệ thống bình luận và đánh giá
- **Quản lý thuê công việc**: Theo dõi trạng thái công việc
- **Phân loại công việc**: Hệ thống phân loại đa cấp
- **API Documentation**: Swagger/OpenAPI với Bearer token authentication
- **Logging & Monitoring**: Comprehensive logging và error handling
- **Security**: CORS, validation, và error handling

## 🛠️ Công nghệ sử dụng

- **Framework**: NestJS v10
- **Database**: MySQL với Prisma ORM
- **Authentication**: JWT với bcrypt
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

## 📋 Yêu cầu hệ thống

- Node.js 18+ 
- MySQL 8.0+
- npm hoặc yarn

## 🔧 Cài đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd Capstone-API-fiverr
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Cấu hình môi trường**
```bash
cp env.example .env
# Chỉnh sửa .env với thông tin database và JWT secret
```

4. **Cài đặt và migrate database**
```bash
npx prisma generate
npx prisma db push
```

5. **Chạy ứng dụng**
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 🌐 API Endpoints

### Base URL: `http://localhost:3000/api/v1`

### Authentication
- `POST /auth/register` - Đăng ký người dùng mới
- `POST /auth/login` - Đăng nhập
- `POST /auth/refresh` - Làm mới JWT token
- `GET /auth/profile` - Lấy thông tin profile (cần JWT)
- `POST /auth/logout` - Đăng xuất

### Users
- `GET /users` - Lấy danh sách người dùng (với pagination, filters, search)
- `GET /users/:id` - Lấy thông tin người dùng theo ID
- `POST /users` - Tạo người dùng mới
- `PATCH /users/:id` - Cập nhật thông tin người dùng
- `DELETE /users/:id` - Xóa người dùng

### Công việc
- `GET /cong-viec` - Lấy danh sách công việc (với pagination, filters, search, sort)
- `GET /cong-viec/:id` - Lấy thông tin công việc theo ID
- `POST /cong-viec` - Tạo công việc mới
- `PATCH /cong-viec/:id` - Cập nhật công việc
- `DELETE /cong-viec/:id` - Xóa công việc
- `GET /cong-viec/category/:maChiTietLoai` - Lấy công việc theo danh mục
- `GET /cong-viec/user/:nguoiTao` - Lấy công việc theo người tạo

### Bình luận
- `GET /binh-luan` - Lấy danh sách bình luận (với pagination, filters)
- `GET /binh-luan/:id` - Lấy thông tin bình luận theo ID
- `POST /binh-luan` - Tạo bình luận mới
- `PATCH /binh-luan/:id` - Cập nhật bình luận
- `DELETE /binh-luan/:id` - Xóa bình luận
- `GET /binh-luan/cong-viec/:maCongViec` - Lấy bình luận theo công việc
- `GET /binh-luan/user/:maNguoiBinhLuan` - Lấy bình luận theo người bình luận

### Thuê công việc
- `GET /thue-cong-viec` - Lấy danh sách thuê công việc (với pagination, filters)
- `GET /thue-cong-viec/:id` - Lấy thông tin thuê công việc theo ID
- `POST /thue-cong-viec` - Tạo thuê công việc mới
- `PATCH /thue-cong-viec/:id` - Cập nhật thuê công việc
- `PATCH /thue-cong-viec/:id/complete` - Hoàn thành công việc
- `DELETE /thue-cong-viec/:id` - Xóa thuê công việc
- `GET /thue-cong-viec/cong-viec/:maCongViec` - Lấy thuê công việc theo công việc
- `GET /thue-cong-viec/user/:maNguoiThue` - Lấy thuê công việc theo người thuê

### Loại công việc
- `GET /loai-cong-viec` - Lấy danh sách loại công việc
- `GET /loai-cong-viec/:id` - Lấy thông tin loại công việc theo ID
- `POST /loai-cong-viec` - Tạo loại công việc mới
- `PATCH /loai-cong-viec/:id` - Cập nhật loại công việc
- `DELETE /loai-cong-viec/:id` - Xóa loại công việc

### Chi tiết loại công việc
- `GET /chi-tiet-loai-cong-viec` - Lấy danh sách chi tiết loại công việc
- `GET /chi-tiet-loai-cong-viec/:id` - Lấy thông tin chi tiết loại công việc theo ID
- `POST /chi-tiet-loai-cong-viec` - Tạo chi tiết loại công việc mới
- `PATCH /chi-tiet-loai-cong-viec/:id` - Cập nhật chi tiết loại công việc
- `DELETE /chi-tiet-loai-cong-viec/:id` - Xóa chi tiết loại công việc
- `GET /chi-tiet-loai-cong-viec/loai-cong-viec/:maLoaiCongViec` - Lấy chi tiết theo loại công việc

## 🔐 Authentication

API sử dụng JWT Bearer token authentication. Để truy cập các endpoint được bảo vệ:

1. Đăng nhập qua `/auth/login` để nhận access token
2. Thêm header: `Authorization: Bearer <your-token>`
3. Token có thời hạn 7 ngày
4. Sử dụng `/auth/refresh` để làm mới token

## 📊 Query Parameters

### Pagination
- `page`: Trang hiện tại (mặc định: 1)
- `pageSize`: Số lượng item mỗi trang (mặc định: 10, tối đa: 100)

### Filters
- `filters`: JSON string với các điều kiện lọc
- Ví dụ: `{"name":"John","role":"user"}`

### Search
- `search`: Tìm kiếm text trong các trường
- Hỗ trợ tìm kiếm không phân biệt hoa thường

### Sorting
- `sortBy`: Trường để sắp xếp
- `sortOrder`: Thứ tự sắp xếp (`asc` hoặc `desc`)

## 📝 Ví dụ sử dụng

### Đăng ký người dùng
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "pass_word": "password123",
    "phone": "0123456789",
    "role": "user"
  }'
```

### Tạo công việc
```bash
curl -X POST http://localhost:3000/api/v1/cong-viec \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "ten_cong_viec": "Web Developer",
    "gia_tien": 1000000,
    "mo_ta": "Cần developer web fullstack",
    "ma_chi_tiet_loai": 1,
    "nguoi_tao": 1
  }'
```

### Tìm kiếm công việc với filters
```bash
curl "http://localhost:3000/api/v1/cong-viec?page=1&pageSize=10&search=web&filters={\"gia_tien\":{\"gte\":500000}}&sortBy=gia_tien&sortOrder=desc"
```

## 🚨 Error Handling

API trả về error responses với format nhất quán:

```json
{
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/v1/users",
  "method": "POST",
  "message": "Email không hợp lệ",
  "error": "Bad Request"
}
```

## 📚 API Documentation

Swagger documentation có sẵn tại:
- Development: `http://localhost:3000/api-docs`
- Production: Không có sẵn (bảo mật)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🐳 Docker

```bash
# Build image
docker build -t capstone-api-fiverr .

# Run container
docker run -p 3000:3000 capstone-api-fiverr

# Docker Compose
docker-compose up -d
```

## 📁 Cấu trúc dự án

```
src/
├── common/                 # Shared utilities
│   ├── filters/           # Exception filters
│   └── interceptors/      # Request/Response interceptors
├── modules/               # Feature modules
│   ├── auth/             # Authentication
│   ├── user/             # User management
│   ├── cong-viec/        # Job management
│   ├── binh-luan/        # Comment management
│   ├── thue-cong-viec/   # Job hiring management
│   ├── loai-cong-viec/   # Job type management
│   ├── chi-tiet-loai-cong-viec/ # Job detail type
│   └── prisma/           # Database service
├── app.module.ts          # Root module
└── main.ts               # Application entry point
```

## 🔒 Security Features

- JWT authentication với refresh token
- Password hashing với bcrypt
- Input validation và sanitization
- CORS configuration
- Global exception handling
- Request logging và monitoring

## 📈 Performance

- Database connection pooling
- Query optimization với Prisma
- Response compression
- Efficient pagination
- Caching strategies

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

UNLICENSED - Private project

## 📞 Support

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trong repository.
