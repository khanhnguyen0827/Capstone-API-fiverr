# 🚀 **API Overview - Capstone Fiverr**

## 📋 **Tổng quan hệ thống API**

Hệ thống API đã được hiệu chỉnh lại hoàn toàn với cấu trúc nhất quán, bảo mật cao và documentation đầy đủ.

---

## 🏗️ **Cấu trúc API**

### **Base URL**: `http://localhost:3000/api/v1`

### **Global Prefix**: `/api/v1`

---

## 🔐 **Authentication API**

### **Base Path**: `/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/login` | Đăng nhập | ❌ |
| `POST` | `/auth/register` | Đăng ký tài khoản | ❌ |
| `POST` | `/auth/refresh` | Làm mới token | ❌ |
| `POST` | `/auth/logout` | Đăng xuất | ❌ |

#### **Features:**
- ✅ JWT Authentication
- ✅ Refresh Token support
- ✅ Password hashing với bcrypt
- ✅ Email validation
- ✅ Role-based access control

---

## 👥 **Users API**

### **Base Path**: `/users`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/users` | Lấy danh sách người dùng | ❌ |
| `GET` | `/users/:id` | Lấy thông tin người dùng theo ID | ❌ |
| `POST` | `/users` | Tạo người dùng mới | ❌ |
| `PUT` | `/users/:id` | Cập nhật thông tin người dùng | ✅ |
| `DELETE` | `/users/:id` | Xóa người dùng | ✅ |
| `GET` | `/users/profile/me` | Lấy profile cá nhân | ✅ |

#### **Features:**
- ✅ Pagination support
- ✅ Role-based permissions
- ✅ Profile management
- ✅ CRUD operations
- ✅ Data validation

---

## 💼 **Jobs API**

### **Base Path**: `/jobs`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/jobs` | Lấy danh sách công việc | ❌ |
| `GET` | `/jobs/:id` | Lấy thông tin công việc theo ID | ❌ |
| `POST` | `/jobs` | Tạo công việc mới | ✅ |
| `PUT` | `/jobs/:id` | Cập nhật công việc | ✅ |
| `DELETE` | `/jobs/:id` | Xóa công việc | ✅ |
| `GET` | `/jobs/categories/list` | Lấy danh sách danh mục | ❌ |

#### **Features:**
- ✅ Advanced search & filtering
- ✅ Category management
- ✅ Pagination
- ✅ Image upload support
- ✅ Rating system

---

## 💬 **Comments API**

### **Base Path**: `/comments`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/comments` | Lấy danh sách bình luận | ❌ |
| `GET` | `/comments/:id` | Lấy bình luận theo ID | ❌ |
| `POST` | `/comments` | Tạo bình luận mới | ✅ |
| `PUT` | `/comments/:id` | Cập nhật bình luận | ✅ |
| `DELETE` | `/comments/:id` | Xóa bình luận | ✅ |

#### **Features:**
- ✅ Rating system (1-5 sao)
- ✅ Content validation
- ✅ User association
- ✅ Job linking

---

## 🏥 **Health Check API**

### **Base Path**: `/health`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/health` | Kiểm tra trạng thái hệ thống | ❌ |
| `GET` | `/health/ping` | Ping test | ❌ |
| `GET` | `/health/ready` | Kiểm tra sẵn sàng | ❌ |

#### **Features:**
- ✅ System status monitoring
- ✅ Database connection check
- ✅ Performance metrics
- ✅ Readiness probe

---

## 🛡️ **Security Features**

### **Middleware Stack:**
1. **SecurityMiddleware** - Security headers, CSP, HSTS
2. **CorsMiddleware** - CORS configuration
3. **RateLimitMiddleware** - Rate limiting (100 req/15min)
4. **ValidationMiddleware** - Request validation
5. **LoggerMiddleware** - Request/response logging

### **Authentication:**
- JWT Bearer token
- Role-based access control
- Token refresh mechanism
- Secure password hashing

### **Validation:**
- Input sanitization
- Request size limits
- Content type validation
- SQL injection prevention

---

## 📊 **Response Format**

### **Success Response:**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "content": { /* data */ },
  "timestamp": "2024-01-20T10:30:00.000Z",
  "path": "/api/v1/endpoint",
  "method": "GET",
  "pagination": { /* optional */ }
}
```

### **Error Response:**
```json
{
  "statusCode": 400,
  "message": "Lỗi validation",
  "error": "Bad Request",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "path": "/api/v1/endpoint",
  "method": "POST",
  "details": [ /* validation errors */ ]
}
```

---

## 🔧 **Configuration**

### **Environment Variables:**
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3000)
- `DATABASE_URL`: MySQL connection string
- `JWT_SECRET`: JWT signing secret
- `BCRYPT_ROUNDS`: Password hashing rounds
- `CORS_ORIGIN`: CORS allowed origins
- `API_RATE_LIMIT`: Rate limiting configuration

---

## 📚 **Documentation**

### **Swagger UI**: `http://localhost:3000/api-docs`

### **Features:**
- ✅ Interactive API documentation
- ✅ Request/response examples
- ✅ Authentication testing
- ✅ Schema validation
- ✅ Try-it-out functionality

---

## 🚀 **Getting Started**

### **1. Khởi động project:**
```bash
npm run start:dev
```

### **2. Truy cập API:**
- **Base URL**: http://localhost:3000/api/v1
- **Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/api/v1/health

### **3. Test Authentication:**
```bash
# Đăng ký
POST /api/v1/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "pass_word": "password123"
}

# Đăng nhập
POST /api/v1/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

---

## 📈 **Performance & Monitoring**

### **Logging:**
- Request/response logging
- Performance metrics
- Error tracking
- User activity monitoring

### **Rate Limiting:**
- 100 requests per 15 minutes per IP
- Configurable limits
- Rate limit headers

### **Caching:**
- Response caching
- Database query optimization
- Static asset caching

---

## 🔄 **API Versioning**

- **Current Version**: v1
- **Version Prefix**: `/api/v1`
- **Backward Compatibility**: Maintained
- **Migration Path**: Clear upgrade path

---

## 🎯 **Next Steps**

1. **Implement file upload** for job images
2. **Add email notifications** for job updates
3. **Implement real-time chat** between users
4. **Add payment integration** for job completion
5. **Implement advanced search** with filters
6. **Add analytics dashboard** for admins

---

## 📞 **Support**

- **Documentation**: Swagger UI
- **Health Check**: `/health` endpoints
- **Logs**: Console and file logging
- **Monitoring**: System status endpoints

---

*API được thiết kế theo RESTful principles với bảo mật cao và performance tối ưu.* 🚀
