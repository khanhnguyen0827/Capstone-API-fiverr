# 🚀 CI/CD Pipeline Documentation

## **Tổng quan**

Dự án Capstone Fiverr API sử dụng GitHub Actions với **self-hosted runner** `api_fiverr` để tự động hóa quy trình phát triển, testing, build và deploy với cách tiếp cận đơn giản và hiệu quả.

## **📋 Workflows**

### **1. CI - Build and Push Docker Image**
- **Trigger**: Push vào `main` branch
- **Runner**: `api_fiverr` (self-hosted)
- **Chức năng**: 
  - Login vào Docker Hub với tài khoản `khanh2nq`
  - Build Docker image với commit SHA
  - Push image lên Docker Hub
  - Verify image đã được push thành công
- **Output**: Docker image `khanh2nq/img-be_api_fiverr:{commit-sha}`
- **Approach**: Sử dụng `docker login`, `docker build`, `docker push` trực tiếp

### **2. Test and Quality Checks**
- **Trigger**: Push/Pull Request vào `main` hoặc `develop` branch
- **Runner**: `ubuntu-latest` (GitHub-hosted)
- **Chức năng**:
  - Chạy tests trên nhiều phiên bản Node.js (18.x, 20.x, 24.x)
  - Linting và code quality checks
  - Security audit
  - Test coverage

### **3. CD - Deploy to Production**
- **Trigger**: Sau khi CI workflow hoàn thành thành công
- **Runner**: `api_fiverr` (self-hosted)
- **Chức năng**:
  - Login vào Docker Hub
  - Pull image mới nhất theo commit SHA
  - Tag image thành `latest`
  - Deploy ứng dụng với docker-compose
  - Health check và monitoring
  - Deployment summary và verification
- **Approach**: Sử dụng `docker login`, `docker pull`, `docker tag`, `docker compose`

### **4. Database Migration**
- **Trigger**: Sau khi CI workflow hoàn thành thành công
- **Runner**: `ubuntu-latest` (GitHub-hosted)
- **Chức năng**: Chạy database migrations

## **🔑 GitHub Secrets cần thiết**

### **Docker Hub (khanh2nq):**
```bash
DOCKER_USERNAME=khanh2nq
DOCKER_PASSWORD=your_docker_hub_access_token
```

### **Database:**
```bash
DATABASE_URL=mysql://username:password@host:port/database
```

### **JWT:**
```bash
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

### **CORS:**
```bash
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### **Swagger:**
```bash
SWAGGER_TITLE=Capstone Fiverr API
SWAGGER_DESCRIPTION=API cho nền tảng freelance tương tự Fiverr
SWAGGER_VERSION=1.0.0
```

## **🚀 Cách sử dụng**

### **1. Setup GitHub Secrets:**
1. Vào repository → Settings → Secrets and variables → Actions
2. Thêm các secrets cần thiết:
   - `DOCKER_USERNAME`: `khanh2nq`
   - `DOCKER_PASSWORD`: Docker Hub access token của bạn

### **2. Push code để trigger CI:**
```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

### **3. Kiểm tra workflow:**
- Vào tab Actions trên GitHub
- Xem logs và status của từng workflow

### **4. Manual trigger (nếu cần):**
- Vào tab Actions
- Chọn workflow cần chạy
- Click "Run workflow"

## **📊 Workflow Status**

- **✅ Success**: Tất cả steps hoàn thành thành công
- **❌ Failure**: Có lỗi xảy ra, cần kiểm tra logs
- **⏳ Running**: Workflow đang chạy
- **⏸️ Waiting**: Đang chờ điều kiện trigger

## **🔧 Troubleshooting**

### **Lỗi thường gặp:**

1. **Docker login failed:**
   - Kiểm tra `DOCKER_USERNAME=khanh2nq` và `DOCKER_PASSWORD`
   - Đảm bảo Docker Hub token có quyền push
   - Token phải được tạo từ tài khoản `khanh2nq`

2. **Build failed:**
   - Kiểm tra Dockerfile
   - Xem logs để tìm lỗi cụ thể
   - Verify self-hosted runner `api_fiverr` đang hoạt động

3. **Deploy failed:**
   - Kiểm tra server có sẵn sàng không
   - Kiểm tra ports và network
   - Verify Docker Hub login thành công
   - Check self-hosted runner status

4. **Tests failed:**
   - Chạy tests locally trước
   - Kiểm tra test coverage

5. **Self-hosted runner issues:**
   - Kiểm tra runner `api_fiverr` có status "Idle" không
   - Verify runner tags: `self-hosted`, `Linux`, `X64`, `api_fiverr`
   - Check runner logs và connectivity

## **📈 Monitoring**

### **Health Check Endpoints:**
- **Production**: `http://your-domain:3070/api/health`
- **Local**: `http://localhost:3070/api/health`

### **Logs:**
- **GitHub Actions**: Tab Actions → Workflow → Job → Step
- **Docker**: `docker logs container_name`
- **Application**: Application logs trong container
- **Self-hosted Runner**: Runner logs và status

## **🔄 Rollback**

Nếu cần rollback:
1. Dừng workflow đang chạy
2. Deploy lại version cũ
3. Kiểm tra logs để tìm nguyên nhân

## **📚 Tài liệu tham khảo**

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Self-hosted Runners](https://docs.github.com/en/actions/hosting-your-own-runners)
- [Docker Commands](https://docs.docker.com/engine/reference/commandline/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)

## **🐳 Docker Hub Repository**

- **Repository**: `khanh2nq/img-be_api_fiverr`
- **URL**: https://hub.docker.com/r/khanh2nq/img-be_api_fiverr
- **Tags**: `{commit-sha}`, `latest` (được tạo trong CD)
- **Pull Command**: `docker pull khanh2nq/img-be_api_fiverr:latest`

## **🆕 Cải tiến mới**

### **Self-hosted Runner:**
- ✅ **CI Workflow**: Sử dụng `api_fiverr` runner
- ✅ **CD Workflow**: Sử dụng `api_fiverr` runner
- ✅ **Benefits**: Faster builds, custom environment, cost-effective

### **CI Workflow:**
- ✅ Sử dụng `docker login`, `build`, `push` trực tiếp
- ✅ Đơn giản hóa, ít dependencies
- ✅ Build image với commit SHA để tracking
- ✅ Verify image đã được push thành công
- ✅ Logging chi tiết với emojis

### **CD Workflow:**
- ✅ Pull image theo commit SHA
- ✅ Tag thành `latest` cho production
- ✅ Health check và monitoring
- ✅ Cleanup và error handling
- ✅ Deployment summary với status
- ✅ Logging chi tiết cho từng bước
- ✅ Container status verification

## **🎯 Workflow Flow**

```
Push to main branch
       ↓
   CI Workflow (api_fiverr)
       ↓
Build & Push Image
       ↓
   CD Workflow (api_fiverr)
       ↓
Deploy to Production
       ↓
   Health Check
       ↓
   Success! 🎉
```

## **🏃‍♂️ Self-hosted Runner: api_fiverr**

### **Specifications:**
- **Type**: Self-hosted
- **OS**: Linux
- **Architecture**: X64
- **Tags**: `self-hosted`, `Linux`, `X64`, `api_fiverr`
- **Status**: Idle (ready for jobs)

### **Benefits:**
- **Speed**: Faster builds và deployments
- **Cost**: Không tính phí theo minute
- **Customization**: Full control over environment
- **Security**: Code không rời khỏi infrastructure
- **Dependencies**: Pre-installed tools và services
