# 🔧 CD Workflow Troubleshooting Guide

## **🚨 Vấn đề: CD workflow không thể pull image từ Docker Hub**

### **Nguyên nhân có thể:**

1. **CI workflow chưa hoàn thành thành công**
2. **Image chưa được push lên Docker Hub**
3. **Docker Hub credentials sai**
4. **Image name hoặc tag không đúng**
5. **Network issues**
6. **Self-hosted runner `api_fiverr` không hoạt động**

## **🔍 Debug Steps**

### **Bước 1: Kiểm tra Self-hosted Runner**
```bash
# Vào GitHub → Settings → Actions → Runners
# Kiểm tra runner "api_fiverr" có status "Idle" không
# Verify tags: self-hosted, Linux, X64, api_fiverr
```

### **Bước 2: Kiểm tra CI Workflow**
```bash
# Vào GitHub → Actions tab
# Kiểm tra CI workflow có thành công không
# Verify image đã được push lên Docker Hub
```

### **Bước 3: Kiểm tra Docker Hub**
```bash
# Truy cập: https://hub.docker.com/r/khanh2nq/img-be_api_fiverr
# Kiểm tra image có tồn tại không
# Verify tag với commit SHA
```

### **Bước 4: Kiểm tra GitHub Secrets**
```bash
# Vào repository → Settings → Secrets and variables → Actions
# Verify các secrets:
# - DOCKER_USERNAME = khanh2nq
# - DOCKER_PASSWORD = your_token
```

### **Bước 5: Test Docker Hub login locally**
```bash
docker login -u khanh2nq -p your_token
docker search khanh2nq/img-be_api_fiverr
```

## **🚀 Debug Workflow đã được cải thiện**

### **Debug Steps được thêm vào CD workflow:**

1. **Debug - Show workflow context**
   - Hiển thị GitHub SHA, workflow name, repository
   - Giúp verify context đúng
   - Hiển thị runner name: `api_fiverr (self-hosted)`

2. **Debug - Check Docker Hub images**
   - Tìm kiếm images trong Docker Hub
   - Verify repository tồn tại

3. **Debug - List local images**
   - Kiểm tra images local
   - Verify cleanup thành công

4. **Debug - Verify pulled image**
   - Kiểm tra image đã pull
   - Inspect image details

## **🔧 Sửa lỗi thường gặp**

### **Lỗi 1: "Image not found"**
```bash
# Nguyên nhân: Image chưa được push hoặc tag sai
# Giải pháp: 
# 1. Kiểm tra CI workflow thành công
# 2. Verify image name và tag
# 3. Check Docker Hub repository
```

### **Lỗi 2: "Authentication failed"**
```bash
# Nguyên nhân: Docker Hub credentials sai
# Giải pháp:
# 1. Kiểm tra DOCKER_USERNAME = khanh2nq
# 2. Verify DOCKER_PASSWORD token
# 3. Test login locally
```

### **Lỗi 3: "Workflow not triggered"**
```bash
# Nguyên nhân: Trigger conditions sai
# Giải pháp:
# 1. Verify workflow names: 'CI' → 'CD'
# 2. Kiểm tra branch: 'main'
# 3. Verify CI workflow completed
```

### **Lỗi 4: "Self-hosted runner not available"**
```bash
# Nguyên nhân: Runner api_fiverr không hoạt động
# Giải pháp:
# 1. Kiểm tra runner status (phải là "Idle")
# 2. Verify runner tags và connectivity
# 3. Check runner logs và network
# 4. Restart runner nếu cần
```

## **📋 Checklist Debug**

### **Trước khi chạy CD:**
- [ ] Self-hosted runner `api_fiverr` có status "Idle"
- [ ] CI workflow đã hoàn thành thành công
- [ ] Image đã được push lên Docker Hub
- [ ] GitHub Secrets đã setup đúng
- [ ] Workflow names đúng: `CI` → `CD`

### **Trong CD workflow:**
- [ ] Docker Hub login thành công
- [ ] Image search thành công
- [ ] Image pull thành công
- [ ] Container deployment thành công
- [ ] Health check passed

## **🚨 Emergency Fixes**

### **Fix 1: Check runner status**
```bash
# Vào GitHub → Settings → Actions → Runners
# Kiểm tra runner "api_fiverr" status
# Nếu không "Idle", restart runner
```

### **Fix 2: Manual image pull**
```bash
# Nếu CD workflow fail, pull image manually
docker login -u khanh2nq -p your_token
docker pull khanh2nq/img-be_api_fiverr:latest
docker tag khanh2nq/img-be_api_fiverr:latest khanh2nq/img-be_api_fiverr:latest
docker compose up -d
```

### **Fix 3: Re-run CI workflow**
```bash
# Nếu image không tồn tại, re-run CI
# Vào GitHub → Actions → CI → Re-run workflow
```

### **Fix 4: Check Docker Hub repository**
```bash
# Verify repository tồn tại
# https://hub.docker.com/r/khanh2nq/img-be_api_fiverr
```

## **📊 Monitoring**

### **GitHub Actions Logs:**
- Vào tab Actions
- Click vào CD workflow
- Xem logs của từng step
- Tìm error messages

### **Self-hosted Runner:**
- Vào Settings → Actions → Runners
- Kiểm tra runner `api_fiverr` status
- Verify tags và connectivity

### **Docker Hub:**
- Kiểm tra repository
- Verify images và tags
- Check access permissions

### **Local Docker:**
```bash
docker images | grep khanh2nq
docker ps | grep api_fiverr
docker logs con-be_api_fiverr
```

## **🔗 Links hữu ích**

- [GitHub Actions Troubleshooting](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows)
- [Self-hosted Runners](https://docs.github.com/en/actions/hosting-your-own-runners)
- [Docker Hub Troubleshooting](https://docs.docker.com/docker-hub/)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## **📞 Hỗ trợ**

Nếu vẫn gặp vấn đề:
1. Kiểm tra logs của từng step
2. Verify Docker Hub repository
3. Test Docker commands locally
4. Check GitHub Secrets setup
5. Verify workflow trigger conditions
6. **Check self-hosted runner `api_fiverr` status**

## **🏃‍♂️ Self-hosted Runner: api_fiverr**

### **Specifications:**
- **Type**: Self-hosted
- **OS**: Linux
- **Architecture**: X64
- **Tags**: `self-hosted`, `Linux`, `X64`, `api_fiverr`
- **Status**: Idle (ready for jobs)

### **Troubleshooting:**
- **Status không "Idle"**: Restart runner
- **Tags missing**: Re-configure runner
- **Connectivity issues**: Check network và firewall
- **Resource issues**: Check CPU, memory, disk space

**CD workflow đã được cải thiện với debug steps và self-hosted runner api_fiverr để dễ dàng identify và fix issues!** 🚀
