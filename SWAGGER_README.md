# 📚 Swagger Documentation - Capstone Fiverr API

## 🌟 Tổng quan

Swagger documentation đã được xây dựng hoàn chỉnh cho tất cả các API endpoints với:

- **Mô tả chi tiết** cho từng API
- **Request/Response examples** với dữ liệu mẫu
- **Validation schemas** cho tất cả DTOs
- **Authentication** với JWT Bearer token
- **Error responses** với HTTP status codes
- **Interactive testing** trực tiếp trên Swagger UI

## 🚀 Truy cập Swagger

Sau khi chạy ứng dụng, truy cập Swagger UI tại:

```
http://localhost:3000/api-docs
```

## 📋 Các API Groups

### 1. 🔐 Authentication
- **POST** `/api/auth/signup` - Đăng ký người dùng mới
- **POST** `/api/auth/signin` - Đăng nhập người dùng

### 2. 👥 Users Management
- **GET** `/api/users` - Lấy danh sách người dùng (có pagination)
- **GET** `/api/users/:id` - Lấy thông tin người dùng theo ID
- **POST** `/api/users` - Tạo người dùng mới
- **PUT** `/api/users/:id` - Cập nhật thông tin người dùng (cần auth)
- **DELETE** `/api/users/:id` - Xóa người dùng (cần auth)
- **GET** `/api/users/profile/me` - Lấy profile user hiện tại (cần auth)

### 3. 💼 Jobs Management
- **GET** `/api/jobs` - Lấy danh sách công việc (có search, filter, pagination)
- **GET** `/api/jobs/:id` - Lấy thông tin công việc theo ID
- **POST** `/api/jobs` - Tạo công việc mới (cần auth)
- **PUT** `/api/jobs/:id` - Cập nhật công việc (cần auth)
- **DELETE** `/api/jobs/:id` - Xóa công việc (cần auth)
- **GET** `/api/jobs/categories/list` - Lấy danh mục công việc

## 🔑 Authentication

### JWT Bearer Token
Để sử dụng các API được bảo vệ:

1. **Đăng nhập** qua `/api/auth/signin` để lấy JWT token
2. **Copy token** từ response
3. **Click vào nút "Authorize"** trên Swagger UI
4. **Nhập token** theo format: `Bearer <your-token>`
5. **Click "Authorize"** để lưu token

### Format Token
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

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

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Dữ liệu đầu vào không hợp lệ",
  "content": null,
  "dateTime": "2024-01-20T10:30:00.000Z"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Chưa đăng nhập hoặc token không hợp lệ",
  "content": null,
  "dateTime": "2024-01-20T10:30:00.000Z"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Không có quyền truy cập",
  "content": null,
  "dateTime": "2024-01-20T10:30:00.000Z"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Tài nguyên không tồn tại",
  "content": null,
  "dateTime": "2024-01-20T10:30:00.000Z"
}
```

## 🧪 Testing với Swagger

### 1. Test Authentication
1. Mở endpoint `/api/auth/signup`
2. Click "Try it out"
3. Nhập dữ liệu mẫu:
   ```json
   {
     "email": "test@example.com",
     "pass_word": "password123",
     "name": "Test User",
     "role": "freelancer"
   }
   ```
4. Click "Execute"
5. Copy JWT token từ response

### 2. Test Protected Endpoints
1. Authorize với JWT token
2. Mở endpoint `/api/users/profile/me`
3. Click "Try it out"
4. Click "Execute"
5. Xem response với thông tin user

### 3. Test CRUD Operations
1. **Create**: Test POST endpoints với dữ liệu mẫu
2. **Read**: Test GET endpoints để lấy dữ liệu
3. **Update**: Test PUT endpoints với dữ liệu cập nhật
4. **Delete**: Test DELETE endpoints (cẩn thận!)

## 🎨 Swagger UI Features

### Custom Styling
- Giao diện đẹp với theme tùy chỉnh
- Syntax highlighting cho code examples
- Responsive design cho mobile

### Interactive Features
- **Try it out**: Test API trực tiếp
- **Request/Response examples**: Dữ liệu mẫu
- **Schema validation**: Kiểm tra dữ liệu đầu vào
- **Authentication**: JWT token management
- **Filter & Search**: Tìm kiếm API endpoints

## 🔧 Troubleshooting

### Lỗi "Cannot read property 'swagger'"
- Kiểm tra `@nestjs/swagger` đã được cài đặt
- Restart ứng dụng sau khi cài đặt dependencies

### Lỗi "JWT token invalid"
- Token đã hết hạn (mặc định 1 ngày)
- Format token không đúng (phải có "Bearer ")
- Token không hợp lệ

### Lỗi "CORS"
- Kiểm tra CORS configuration trong main.ts
- Đảm bảo frontend domain được cho phép

## 📝 Best Practices

### 1. API Testing
- Luôn test với dữ liệu mẫu trước
- Kiểm tra validation errors
- Test cả success và error cases

### 2. Authentication
- Sử dụng JWT token cho protected endpoints
- Test với các role khác nhau
- Kiểm tra permission errors

### 3. Data Validation
- Sử dụng DTOs với validation decorators
- Test với dữ liệu không hợp lệ
- Kiểm tra error messages

## 🚀 Deployment

### Production
- Disable Swagger UI trong production
- Sử dụng environment variables
- Secure JWT secret

### Development
- Enable Swagger UI
- Detailed error messages
- Full API documentation

## 📚 Tài liệu tham khảo

- [NestJS Swagger](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI Specification](https://swagger.io/specification/)
- [JWT Authentication](https://jwt.io/)
- [Prisma Documentation](https://www.prisma.io/docs/)

## 🤝 Đóng góp

Để cải thiện Swagger documentation:

1. Cập nhật DTOs với `@ApiProperty` decorators
2. Thêm `@ApiOperation` cho controllers
3. Cập nhật response schemas
4. Thêm examples và descriptions
5. Test tất cả endpoints

---

**Happy API Testing! 🎉**
