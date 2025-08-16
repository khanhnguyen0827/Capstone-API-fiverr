# 🚀 CI/CD Pipeline Documentation

## 📋 Tổng quan

Project này sử dụng **GitHub Actions** để tự động hóa quy trình CI/CD với các workflow sau:

## 🔄 Workflows

### 1. **CI - Build & Test** (`ci.yml`)
**Trigger:** Push/Pull Request vào `main` hoặc `develop`

**Jobs:**
- **Lint & Format Check**: Kiểm tra code style và formatting
- **Unit Tests**: Chạy unit tests và coverage
- **Build Check**: Kiểm tra build thành công
- **Security Scan**: Quét bảo mật với npm audit và Snyk
- **Docker Build Test**: Test Docker build

### 2. **CD - Deploy to Staging** (`cd-staging.yml`)
**Trigger:** Push vào `develop` branch

**Jobs:**
- **Deploy to Staging**: Deploy lên môi trường staging
- **Health Check**: Kiểm tra ứng dụng hoạt động
- **Notification**: Thông báo kết quả deployment

### 3. **CD - Deploy to Production** (`cd-production.yml`)
**Trigger:** 
- Push tag `v*` (semantic versioning)
- Release published
- Manual trigger với xác nhận

**Jobs:**
- **Deploy to Production**: Deploy lên production
- **Health Check**: Kiểm tra production
- **Smoke Tests**: Chạy test cơ bản
- **Notification**: Thông báo deployment

### 4. **Docker Registry** (`docker-registry.yml`)
**Trigger:** Push vào `main`, `develop` hoặc tag `v*`

**Jobs:**
- **Build and Push**: Build và push Docker image lên GitHub Container Registry
- **Image Verification**: Xác minh image được tạo thành công

### 5. **Security & Dependencies** (`security.yml`)
**Trigger:** 
- Daily schedule (2 AM UTC)
- Push/Pull Request

**Jobs:**
- **Dependency Scan**: Quét vulnerabilities trong dependencies
- **Snyk Scan**: Security scan với Snyk
- **Docker Security**: Quét bảo mật Docker image với Trivy
- **CodeQL Analysis**: Phân tích code với GitHub CodeQL

### 6. **Release** (`release.yml`)
**Trigger:** Push tag `v*`

**Jobs:**
- **Create Release**: Tạo GitHub release
- **Build Production Image**: Build production Docker image
- **Notify Release**: Thông báo release thành công

## 🌍 Environments

### **Staging Environment**
- **URL**: `https://staging-api.capstone-fiverr.com`
- **Branch**: `develop`
- **Protection**: Required reviews từ dev-team và qa-team
- **Required Checks**: CI, Security, Docker Registry

### **Production Environment**
- **URL**: `https://api.capstone-fiverr.com`
- **Branch**: `main` (via tags)
- **Protection**: Required reviews từ dev-team, qa-team, và devops-team
- **Required Checks**: CI, Security, Docker Registry, Staging Deployment
- **Additional**: Required signatures, linear history

## 🔐 Secrets Required

### **GitHub Secrets**
```bash
# Snyk Security Token
SNYK_TOKEN=your-snyk-token

# Docker Registry (optional - using GITHUB_TOKEN)
DOCKER_USERNAME=your-docker-username
DOCKER_PASSWORD=your-docker-password
```

### **Environment Variables**
```bash
# Staging
STAGING_API_URL=https://staging-api.capstone-fiverr.com
STAGING_DB_URL=mysql://user:pass@staging-db:3306/capstone_fiverr

# Production
PRODUCTION_API_URL=https://api.capstone-fiverr.com
PRODUCTION_DB_URL=mysql://user:pass@prod-db:3306/capstone_fiverr
```

## 🚀 Deployment Process

### **Development Flow**
```mermaid
graph LR
    A[Feature Branch] --> B[Pull Request]
    B --> C[CI Checks]
    C --> D[Merge to Develop]
    D --> E[Auto Deploy Staging]
    E --> F[QA Testing]
    F --> G[Release to Production]
```

### **Production Release**
```mermaid
graph LR
    A[Create Tag v1.0.0] --> B[Trigger Release Workflow]
    B --> C[Build Production Image]
    C --> D[Deploy to Production]
    D --> E[Health Checks]
    E --> F[Smoke Tests]
    F --> G[Release Complete]
```

## 📊 Monitoring & Notifications

### **Health Checks**
- **Staging**: `/api/v1/health`
- **Production**: `/api/v1/health`
- **Database**: Connection test
- **API**: Endpoint availability

### **Notifications**
- **Slack/Discord**: Deployment status
- **Email**: Release notifications
- **GitHub**: Release notes và changelog

## 🛠️ Manual Operations

### **Force Deploy to Staging**
```bash
# Via GitHub Actions UI
# 1. Go to Actions > CD - Deploy to Staging
# 2. Click "Run workflow"
# 3. Select branch and environment
```

### **Force Deploy to Production**
```bash
# Via GitHub Actions UI
# 1. Go to Actions > CD - Deploy to Production
# 2. Click "Run workflow"
# 3. Type "DEPLOY" to confirm
```

### **Rollback Production**
```bash
# 1. Identify previous stable version
# 2. Create rollback tag: v1.0.0-rollback
# 3. Trigger production deployment
# 4. Verify rollback success
```

## 🔍 Troubleshooting

### **Common Issues**

#### **CI Build Failed**
```bash
# Check logs
# 1. Go to Actions > CI - Build & Test
# 2. Check failed job logs
# 3. Fix issues locally
# 4. Push fixes
```

#### **Docker Build Failed**
```bash
# Check Dockerfile
# 1. Verify Dockerfile syntax
# 2. Check build context
# 3. Test locally: docker build .
```

#### **Deployment Failed**
```bash
# Check environment
# 1. Verify secrets are set
# 2. Check environment protection rules
# 3. Verify required status checks passed
```

### **Debug Commands**
```bash
# Local testing
npm run lint
npm run test
npm run build
docker build -t test .

# Check workflow status
gh run list --workflow="CI - Build & Test"
gh run view <run-id>
```

## 📈 Metrics & KPIs

### **Deployment Metrics**
- **Deployment Frequency**: Daily
- **Lead Time**: < 1 hour
- **MTTR**: < 30 minutes
- **Success Rate**: > 95%

### **Quality Metrics**
- **Test Coverage**: > 80%
- **Security Issues**: 0 critical
- **Build Time**: < 10 minutes
- **Image Size**: < 500MB

## 🔄 Continuous Improvement

### **Regular Reviews**
- **Weekly**: Review failed deployments
- **Monthly**: Update security policies
- **Quarterly**: Optimize build times
- **Annually**: Review entire pipeline

### **Feedback Loop**
- **Developer Feedback**: Pipeline usability
- **QA Feedback**: Staging environment
- **Ops Feedback**: Production stability
- **Security Feedback**: Vulnerability reports

## 📚 Resources

### **GitHub Actions**
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Actions](https://github.com/docker/build-push-action)
- [Security Actions](https://github.com/snyk/actions)

### **Best Practices**
- [CI/CD Best Practices](https://github.com/marketplace?type=actions)
- [Docker Security](https://docs.docker.com/engine/security/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Maintainer**: DevOps Team
