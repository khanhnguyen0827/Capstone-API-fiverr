# 🚀 Capstone Fiverr API Reference

## 📋 Tổng quan

API đã được viết lại hoàn toàn theo chuẩn [Fiverr API](https://fiverrnew.cybersoft.edu.vn/swagger/index.html) với các tính năng chính:

- **Authentication**: JWT Bearer token
- **User Management**: CRUD người dùng với role-based access
- **Job Management**: Quản lý công việc, tìm kiếm nâng cao
- **Comments**: Bình luận và đánh giá
- **Swagger Documentation**: Đầy đủ với examples và validation

## 🔐 Authentication Endpoints

### POST `/api/auth/signup`
Đăng ký người dùng mới
```json
{
  "email": "user@example.com",
  "pass_word": "password123",
  "name": "Nguyễn Văn A",
  "role": "freelancer"
}
```

### POST `/api/auth/signin`
Đăng nhập và nhận JWT token
```json
{
  "email": "user@example.com",
  "pass_word": "password123"
}
```

## 👥 Users Management

### GET `/api/users`
Lấy danh sách người dùng (có pagination)
- Query params: `page`, `size`
- Response: Danh sách users với pagination

### GET `/api/users/:id`
Lấy thông tin người dùng theo ID
- Path param: `id` (number)
- Response: Thông tin chi tiết user

### POST `/api/users`
Tạo người dùng mới
- Body: `CreateUserDto`
- Response: User đã tạo

### PUT `/api/users/:id` 🔒
Cập nhật thông tin người dùng (cần auth)
- Path param: `id` (number)
- Body: `UpdateUserDto`
- Auth: JWT Bearer token

### DELETE `/api/users/:id` 🔒
Xóa người dùng (cần auth)
- Path param: `id` (number)
- Auth: JWT Bearer token

### GET `/api/users/profile/me` 🔒
Lấy profile của user hiện tại
- Auth: JWT Bearer token
- Response: Thông tin user đang đăng nhập

## 💼 Jobs Management

### GET `/api/jobs`
Lấy danh sách công việc
- Query params: `page`, `size`, `search`, `category`
- Response: Danh sách jobs với pagination

### POST `/api/jobs/search` ⭐ NEW
Tìm kiếm công việc nâng cao
- Body: `JobSearchDto` (keyword, categoryId, minPrice, maxPrice, rating)
- Query params: `page`, `size`
- Response: Kết quả tìm kiếm với pagination

### GET `/api/jobs/:id`
Lấy thông tin công việc theo ID
- Path param: `id` (number)
- Response: Thông tin chi tiết job

### POST `/api/jobs` 🔒
Tạo công việc mới (cần auth)
- Body: `CreateJobDto`
- Auth: JWT Bearer token
- Response: Job đã tạo

### PUT `/api/jobs/:id` 🔒
Cập nhật công việc (cần auth và quyền sở hữu)
- Path param: `id` (number)
- Body: `UpdateJobDto`
- Auth: JWT Bearer token

### DELETE `/api/jobs/:id` 🔒
Xóa công việc (cần auth và quyền sở hữu)
- Path param: `id` (number)
- Auth: JWT Bearer token

### GET `/api/jobs/categories/list`
Lấy danh sách danh mục công việc
- Response: Tất cả categories có sẵn

## 💬 Comments Management

### GET `/api/comments/:jobId`
Lấy bình luận của công việc
- Path param: `jobId` (number)
- Response: Danh sách comments

### POST `/api/comments` 🔒
Thêm bình luận mới (cần auth)
- Body: `CreateCommentDto`
- Auth: JWT Bearer token
- Response: Comment đã tạo

### PUT `/api/comments/:id` 🔒
Sửa bình luận (cần auth và quyền sở hữu)
- Path param: `id` (number)
- Body: `UpdateCommentDto`
- Auth: JWT Bearer token

### DELETE `/api/comments/:id` 🔒
Xóa bình luận (cần auth và quyền sở hữu)
- Path param: `id` (number)
- Auth: JWT Bearer token

## 🔍 Tìm kiếm nâng cao

### JobSearchDto
```json
{
  "keyword": "website",
  "categoryId": 4,
  "minPrice": 1000000,
  "maxPrice": 10000000,
  "rating": 4
}
```

**Tính năng:**
- Tìm kiếm theo từ khóa trong tên công việc
- Lọc theo danh mục
- Lọc theo khoảng giá (min-max)
- Lọc theo số sao đánh giá
- Phân trang kết quả

## 📊 Response Format

### Success Response
```json
{
  "statusCode": 200,
  "message": "Thông báo thành công",
  "content": "Dữ liệu trả về",
  "dateTime": "2024-01-20T10:30:00.000Z"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Thông báo lỗi",
  "content": null,
  "dateTime": "2024-01-20T10:30:00.000Z"
}
```

## 🔐 Authentication

### JWT Bearer Token
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Protected Endpoints
- Tất cả endpoints có 🔒 cần JWT token
- Token được lấy từ `/api/auth/signin`
- Token có thời hạn 1 ngày

## 🚨 HTTP Status Codes

- `200 OK`: Thành công
- `201 Created`: Tạo mới thành công
- `400 Bad Request`: Dữ liệu đầu vào không hợp lệ
- `401 Unauthorized`: Chưa đăng nhập hoặc token không hợp lệ
- `403 Forbidden`: Không có quyền truy cập
- `404 Not Found`: Tài nguyên không tồn tại
- `500 Internal Server Error`: Lỗi server

## 🧪 Testing

### 1. Swagger UI
Truy cập: `http://localhost:3000/api-docs`

### 2. Test Flow
1. **Đăng ký** user mới qua `/api/auth/signup`
2. **Đăng nhập** để lấy JWT token qua `/api/auth/signin`
3. **Authorize** với JWT token trên Swagger UI
4. **Test các endpoints** được bảo vệ

### 3. Test Data
```json
// User mẫu
{
  "email": "test@example.com",
  "pass_word": "password123",
  "name": "Test User",
  "role": "freelancer"
}

// Job mẫu
{
  "ten_cong_viec": "Thiết kế website",
  "gia_tien": 5000000,
  "mo_ta": "Thiết kế website chuyên nghiệp",
  "ma_chi_tiet_loai": 4
}

// Comment mẫu
{
  "ma_cong_viec": 1,
  "noi_dung": "Dự án rất tốt!",
  "sao_binh_luan": 5
}
```

## 🔧 Cài đặt và chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình database
```bash
# Tạo file .env
DATABASE_URL="mysql://root:123456@localhost:3307/capstone_fiverr"
JWT_SECRET="your-secret-key"
PORT=3000
```

### 3. Khởi tạo database
```bash
npm run db:generate
npm run db:push
```

### 4. Chạy ứng dụng
```bash
npm run start:dev
```

### 5. Truy cập API
- **Server**: http://localhost:3000
- **Swagger**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/api/health

## 📚 Tài liệu tham khảo

- [Fiverr API](https://fiverrnew.cybersoft.edu.vn/swagger/index.html)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [JWT Authentication](https://jwt.io/)

## 🆘 Troubleshooting

### Lỗi dependencies
```bash
npm install
npm run db:generate
```

### Lỗi database
```bash
npm run db:push
npm run db:studio
```

### Lỗi TypeScript
```bash
npm run build
npm run lint
```

---

**Happy Coding! 🎉**
