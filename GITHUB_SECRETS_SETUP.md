# 🔑 GitHub Secrets Setup Guide

## **Tổng quan**

Hướng dẫn chi tiết cách setup GitHub Secrets để CI/CD pipeline hoạt động với tài khoản Docker Hub `khanh2nq`.

## **🚀 Bước 1: Tạo Docker Hub Access Token**

### **1.1 Đăng nhập Docker Hub**
- Truy cập: https://hub.docker.com/
- Đăng nhập với tài khoản: `khanh2nq`

### **1.2 Tạo Access Token**
1. Vào **Account Settings** → **Security**
2. Click **New Access Token**
3. Đặt tên: `github-actions-fiverr-api`
4. Chọn quyền: **Read & Write**
5. Click **Generate**
6. **Copy token** (sẽ không hiển thị lại)

## **🔧 Bước 2: Setup GitHub Secrets**

### **2.1 Truy cập Repository Settings**
1. Vào repository GitHub của bạn
2. Click **Settings** tab
3. Chọn **Secrets and variables** → **Actions**

### **2.2 Thêm Docker Hub Secrets**

#### **DOCKER_USERNAME**
- **Name**: `DOCKER_USERNAME`
- **Value**: `khanh2nq`
- **Description**: Docker Hub username

#### **DOCKER_PASSWORD**
- **Name**: `DOCKER_PASSWORD`
- **Value**: `your_docker_hub_access_token`
- **Description**: Docker Hub access token

### **2.3 Thêm Database Secrets**

#### **DATABASE_URL**
- **Name**: `DATABASE_URL`
- **Value**: `mysql://username:password@host:port/database`
- **Description**: Production database connection string

### **2.4 Thêm JWT Secrets**

#### **JWT_SECRET**
- **Name**: `JWT_SECRET`
- **Value**: `your-super-secret-jwt-key-2024`
- **Description**: Secret key for JWT token generation

#### **JWT_EXPIRES_IN**
- **Name**: `JWT_EXPIRES_IN`
- **Value**: `1d`
- **Description**: JWT token expiration time

### **2.5 Thêm CORS Secrets**

#### **CORS_ORIGIN**
- **Name**: `CORS_ORIGIN`
- **Value**: `http://localhost:3000,http://localhost:3001`
- **Description**: Allowed CORS origins

### **2.6 Thêm Swagger Secrets**

#### **SWAGGER_TITLE**
- **Name**: `SWAGGER_TITLE`
- **Value**: `Capstone Fiverr API`
- **Description**: API documentation title

#### **SWAGGER_DESCRIPTION**
- **Name**: `SWAGGER_DESCRIPTION`
- **Value**: `API cho nền tảng freelance tương tự Fiverr`
- **Description**: API documentation description

#### **SWAGGER_VERSION**
- **Name**: `SWAGGER_VERSION`
- **Value**: `1.0.0`
- **Description**: API version

## **📋 Danh sách đầy đủ GitHub Secrets**

| Secret Name | Value | Required | Description |
|-------------|-------|----------|-------------|
| `DOCKER_USERNAME` | `khanh2nq` | ✅ | Docker Hub username |
| `DOCKER_PASSWORD` | `your_token` | ✅ | Docker Hub access token |
| `DATABASE_URL` | `mysql://...` | ✅ | Production database URL |
| `JWT_SECRET` | `your_secret` | ✅ | JWT signing secret |
| `JWT_EXPIRES_IN` | `1d` | ✅ | JWT expiration time |
| `CORS_ORIGIN` | `http://...` | ✅ | Allowed CORS origins |
| `SWAGGER_TITLE` | `Capstone Fiverr API` | ✅ | API title |
| `SWAGGER_DESCRIPTION` | `API cho...` | ✅ | API description |
| `SWAGGER_VERSION` | `1.0.0` | ✅ | API version |

## **🔍 Bước 3: Kiểm tra Secrets**

### **3.1 Verify Secrets**
- Tất cả secrets phải có status **Active**
- Không có secrets nào bị **Outdated**

### **3.2 Test CI/CD**
```bash
git add .
git commit -m "test: verify CI/CD secrets"
git push origin main
```

## **⚠️ Lưu ý quan trọng**

### **Bảo mật:**
- **KHÔNG** commit secrets vào code
- **KHÔNG** chia sẻ access tokens
- **KHÔNG** sử dụng secrets cũ

### **Docker Hub:**
- Token phải có quyền **Read & Write**
- Token phải được tạo từ tài khoản `khanh2nq`
- Token có thể expire, cần tạo mới khi cần

### **Database:**
- Sử dụng production database credentials
- Đảm bảo database accessible từ GitHub Actions
- Test connection string trước khi setup

## **🚨 Troubleshooting**

### **Lỗi thường gặp:**

1. **"Docker login failed"**
   - Kiểm tra `DOCKER_USERNAME` = `khanh2nq`
   - Kiểm tra `DOCKER_PASSWORD` có đúng không
   - Token có quyền push không

2. **"Secrets not found"**
   - Kiểm tra tên secrets có đúng không
   - Secrets có được setup trong repository không
   - Repository có quyền truy cập secrets không

3. **"Database connection failed"**
   - Kiểm tra `DATABASE_URL` format
   - Database có accessible không
   - Credentials có đúng không

## **📞 Hỗ trợ**

Nếu gặp vấn đề:
1. Kiểm tra GitHub Actions logs
2. Verify tất cả secrets đã setup
3. Test Docker Hub login locally
4. Kiểm tra database connectivity

## **🔗 Links hữu ích**

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Docker Hub Access Tokens](https://docs.docker.com/docker-hub/access-tokens/)
- [GitHub Actions Security](https://docs.github.com/en/actions/security-guides/)
