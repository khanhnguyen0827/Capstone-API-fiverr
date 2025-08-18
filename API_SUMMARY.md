# Tóm Tắt API - Capstone Fiverr Platform

## Tổng Quan
Dự án đã được hiệu chỉnh và viết lại hoàn toàn với cấu trúc API nhất quán, sử dụng BaseController để chuẩn hóa response format và Swagger documentation đầy đủ.

## Các Module API

### 1. Authentication (`/auth`)
- **POST** `/auth/login` - Đăng nhập
- **POST** `/auth/register` - Đăng ký tài khoản
- **POST** `/auth/refresh` - Làm mới token
- **POST** `/auth/logout` - Đăng xuất

### 2. Users (`/users`)
- **GET** `/users` - Lấy danh sách người dùng (phân trang)
- **GET** `/users/:id` - Lấy thông tin người dùng theo ID
- **POST** `/users` - Tạo người dùng mới (admin only)
- **PUT** `/users/:id` - Cập nhật thông tin người dùng
- **DELETE** `/users/:id` - Xóa người dùng (admin only)
- **GET** `/users/profile/me` - Lấy profile cá nhân

### 3. Jobs (`/jobs`)
- **GET** `/jobs` - Lấy danh sách công việc (phân trang, tìm kiếm)
- **GET** `/jobs/:id` - Lấy thông tin công việc theo ID
- **POST** `/jobs` - Tạo công việc mới
- **PUT** `/jobs/:id` - Cập nhật công việc
- **DELETE** `/jobs/:id` - Xóa công việc
- **GET** `/jobs/categories/list` - Lấy danh sách danh mục
- **POST** `/jobs/search` - Tìm kiếm công việc nâng cao

### 4. Comments (`/comments`)
- **GET** `/comments/:jobId` - Lấy bình luận của công việc
- **POST** `/comments` - Tạo bình luận mới
- **PUT** `/comments/:id` - Cập nhật bình luận
- **DELETE** `/comments/:id` - Xóa bình luận

### 5. Hiring (`/hiring`) - MỚI
- **GET** `/hiring` - Lấy danh sách công việc đã thuê
- **GET** `/hiring/freelancer` - Lấy danh sách công việc được thuê (freelancer)
- **POST** `/hiring` - Thuê công việc
- **PUT** `/hiring/:id/complete` - Đánh dấu hoàn thành
- **PUT** `/hiring/:id/cancel` - Hủy thuê công việc
- **GET** `/hiring/:id` - Lấy chi tiết công việc được thuê

### 6. Categories (`/categories`) - MỚI
- **GET** `/categories` - Lấy tất cả danh mục
- **GET** `/categories/main` - Lấy danh mục chính
- **GET** `/categories/main/:id` - Lấy chi tiết danh mục chính
- **POST** `/categories/main` - Tạo danh mục chính (admin only)
- **PUT** `/categories/main/:id` - Cập nhật danh mục chính (admin only)
- **DELETE** `/categories/main/:id` - Xóa danh mục chính (admin only)
- **POST** `/categories/sub` - Tạo danh mục con (admin only)
- **PUT** `/categories/sub/:id` - Cập nhật danh mục con (admin only)
- **DELETE** `/categories/sub/:id` - Xóa danh mục con (admin only)

## Đặc Điểm Kỹ Thuật

### Response Format Chuẩn
Tất cả API đều sử dụng BaseController với format response nhất quán:

```json
{
  "statusCode": 200,
  "message": "Thông báo thành công",
  "content": "Dữ liệu trả về",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "path": "/api/v1/endpoint",
  "method": "HTTP_METHOD"
}
```

### Phân Trang
Các API danh sách đều hỗ trợ phân trang với format:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "size": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Bảo Mật
- JWT Authentication cho các endpoint cần đăng nhập
- Role-based access control (admin/user)
- Validation đầy đủ với class-validator

### Swagger Documentation
- API documentation đầy đủ với examples
- Request/Response schemas chi tiết
- Error responses được mô tả rõ ràng

## Cải Tiến So Với Phiên Bản Cũ

1. **Cấu trúc nhất quán**: Tất cả controller đều extend BaseController
2. **Response format chuẩn**: Không còn response format khác nhau giữa các module
3. **Validation**: Sử dụng DTO với validation rules
4. **Error handling**: Xử lý lỗi nhất quán
5. **Documentation**: Swagger docs đầy đủ cho tất cả endpoints
6. **Module mới**: Thêm Hiring và Categories modules
7. **Phân trang**: Hỗ trợ phân trang cho tất cả danh sách
8. **Type safety**: TypeScript types đầy đủ

## Hướng Dẫn Sử Dụng

### Khởi động ứng dụng
```bash
# Cài đặt dependencies
npm install

# Tạo file môi trường
cp env.example .env

# Khởi động database
docker-compose up -d db

# Tạo Prisma client
npx prisma generate

# Đồng bộ database
npx prisma db push

# Khởi động ứng dụng
npm run start:dev
```

### Truy cập API
- **Base URL**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api-docs
- **API Version**: v1

### Authentication
1. Đăng ký tài khoản: `POST /auth/register`
2. Đăng nhập: `POST /auth/login`
3. Sử dụng JWT token trong header: `Authorization: Bearer <token>`

## Lưu Ý
- Tất cả API đều có validation đầy đủ
- Error responses được chuẩn hóa
- Logging và monitoring được tích hợp
- Rate limiting có thể được thêm vào trong tương lai
