# 🧪 API Testing Guide

Hướng dẫn test và kiểm tra tất cả API endpoints trong dự án Capstone Fiverr.

## 📋 Danh sách API Endpoints

### 🔐 Authentication
- `POST /api/auth/signup` - Đăng ký người dùng mới
- `POST /api/auth/signin` - Đăng nhập
- `POST /api/auth/refresh-token` - Làm mới JWT token

### 👥 Users Management
- `GET /api/users` - Lấy danh sách người dùng
- `GET /api/users/:id` - Lấy thông tin người dùng theo ID
- `POST /api/users` - Tạo người dùng mới
- `PUT /api/users/:id` - Cập nhật thông tin người dùng
- `DELETE /api/users/:id` - Xóa người dùng
- `GET /api/users/profile/me` - Lấy profile cá nhân

### 💼 Jobs Management
- `GET /api/jobs` - Lấy danh sách công việc
- `GET /api/jobs/:id` - Lấy thông tin công việc theo ID
- `POST /api/jobs` - Tạo công việc mới
- `PUT /api/jobs/:id` - Cập nhật công việc
- `DELETE /api/jobs/:id` - Xóa công việc
- `GET /api/jobs/categories/list` - Lấy danh mục công việc
- `POST /api/jobs/search` - Tìm kiếm công việc nâng cao

### 💬 Comments
- `GET /api/comments/:jobId` - Lấy bình luận của công việc
- `POST /api/comments` - Tạo bình luận mới
- `PUT /api/comments/:id` - Cập nhật bình luận
- `DELETE /api/comments/:id` - Xóa bình luận

### 🔍 System
- `GET /health` - Health check endpoint
- `GET /` - API root endpoint
- `GET /api-docs` - Swagger documentation

## 🚀 Cách Test API

### 1. Sử dụng PowerShell Script (Khuyến nghị)

```powershell
# Chạy script test tự động
.\test-api.ps1

# Hoặc chạy từng test riêng lẻ
. .\test-api.ps1
Test-HealthCheck
Test-APIRoot
Test-UserRegistration
```

### 2. Sử dụng Node.js Script

```bash
# Chạy script test
node test-api.js
```

### 3. Sử dụng Swagger UI

1. Khởi động ứng dụng: `npm run start:dev`
2. Mở trình duyệt: `http://localhost:3000/api-docs`
3. Test các endpoint trực tiếp từ giao diện Swagger

### 4. Sử dụng Postman/Insomnia

Import các endpoint sau vào Postman:

#### Collection: Fiverr API
- **Base URL**: `http://localhost:3000/api`

#### Authentication
- `POST /auth/signup`
- `POST /auth/signin`

#### Users
- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`
- `GET /users/profile/me`

#### Jobs
- `GET /jobs`
- `GET /jobs/:id`
- `POST /jobs`
- `PUT /jobs/:id`
- `DELETE /jobs/:id`
- `GET /jobs/categories/list`
- `POST /jobs/search`

#### Comments
- `GET /comments/:jobId`
- `POST /comments`
- `PUT /comments/:id`
- `DELETE /comments/:id`

## 🔧 Setup Test Environment

### 1. Cài đặt dependencies

```bash
npm install
npm install axios  # Cho Node.js test script
```

### 2. Cấu hình database

```bash
# Tạo file .env từ env.example
cp env.example .env

# Cập nhật thông tin database trong .env
DATABASE_URL="mysql://root:123456@localhost:3307/capstone_fiverr"
```

### 3. Khởi tạo database

```bash
# Tạo database từ file SQL
mysql -u root -p < database.sql

# Hoặc sử dụng Prisma
npm run db:generate
npm run db:push
```

### 4. Khởi động ứng dụng

```bash
# Development mode
npm run start:dev

# Hoặc production mode
npm run start:prod
```

## 📊 Test Cases

### ✅ Test Cases Cơ bản

1. **Health Check**
   - Endpoint: `GET /health`
   - Expected: Status 200, response có uptime và environment

2. **API Root**
   - Endpoint: `GET /`
   - Expected: Status 200, response "Hello World!"

3. **User Registration**
   - Endpoint: `POST /api/auth/signup`
   - Expected: Status 201, tạo user mới hoặc 409 nếu email đã tồn tại

4. **User Login**
   - Endpoint: `POST /api/auth/signin`
   - Expected: Status 200, nhận được JWT token

5. **Public Endpoints**
   - `GET /api/users` - Status 200, danh sách users
   - `GET /api/jobs` - Status 200, danh sách jobs
   - `GET /api/jobs/categories/list` - Status 200, danh sách categories

6. **Protected Endpoints**
   - `GET /api/users/profile/me` - Status 200 với valid token
   - `POST /api/jobs` - Status 201 với valid token

7. **Swagger Documentation**
   - Endpoint: `GET /api-docs`
   - Expected: Status 200, hiển thị Swagger UI

### 🔒 Test Cases Bảo mật

1. **Unauthorized Access**
   - Test các protected endpoints không có token
   - Expected: Status 401 Unauthorized

2. **Invalid Token**
   - Test với token không hợp lệ
   - Expected: Status 401 Unauthorized

3. **Token Expiration**
   - Test với token đã hết hạn
   - Expected: Status 401 Unauthorized

### 📝 Test Cases Validation

1. **Required Fields**
   - Test tạo user/job thiếu required fields
   - Expected: Status 400 Bad Request

2. **Invalid Data Types**
   - Test với email không hợp lệ, số âm cho giá tiền
   - Expected: Status 400 Bad Request

3. **Data Constraints**
   - Test với dữ liệu vượt quá giới hạn (string quá dài)
   - Expected: Status 400 Bad Request

## 🐛 Troubleshooting

### Lỗi thường gặp

1. **Database Connection Failed**
   ```
   ❌ Database connection failed: Can't reach database server
   ```
   - Kiểm tra MySQL server có đang chạy không
   - Kiểm tra port 3307 có đúng không
   - Kiểm tra database "capstone_fiverr" có tồn tại không

2. **Port Already in Use**
   ```
   ❌ Failed to start application: listen EADDRINUSE: address already in use
   ```
   - Thay đổi port trong file .env: `PORT=3001`
   - Hoặc kill process đang sử dụng port 3000

3. **Prisma Client Not Generated**
   ```
   ❌ PrismaClient is not generated
   ```
   - Chạy: `npm run db:generate`

4. **Validation Errors**
   ```
   ❌ Validation failed: email must be an email
   ```
   - Kiểm tra dữ liệu đầu vào có đúng format không
   - Kiểm tra DTO validation rules

### Debug Mode

```bash
# Chạy với debug mode
npm run start:debug

# Chạy test với debug
npm run test:debug
```

## 📈 Performance Testing

### Load Testing với Artillery

```bash
# Cài đặt Artillery
npm install -g artillery

# Chạy load test
artillery run load-test.yml
```

### Load Test Configuration (load-test.yml)

```yaml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Ramp up load"
    - duration: 120
      arrivalRate: 10
      name: "Sustained load"
    - duration: 60
      arrivalRate: 0
      name: "Ramp down"

scenarios:
  - name: "API Health Check"
    weight: 30
    flow:
      - get:
          url: "/health"
  
  - name: "Get Users"
    weight: 40
    flow:
      - get:
          url: "/api/users"
  
  - name: "Get Jobs"
    weight: 30
    flow:
      - get:
          url: "/api/jobs"
```

## 🎯 Best Practices

1. **Test Order**: Luôn test public endpoints trước, sau đó mới test protected endpoints
2. **Cleanup**: Xóa test data sau khi test xong
3. **Isolation**: Mỗi test case phải độc lập, không phụ thuộc vào test case khác
4. **Error Handling**: Test cả success cases và error cases
5. **Performance**: Test response time và throughput
6. **Security**: Test authentication và authorization

## 📞 Support

Nếu gặp vấn đề khi test:

1. Kiểm tra logs của ứng dụng
2. Kiểm tra database connection
3. Kiểm tra environment variables
4. Kiểm tra port conflicts
5. Tạo issue trên GitHub với thông tin chi tiết

---

**Happy Testing! 🚀**
