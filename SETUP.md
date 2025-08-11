# 🚀 Hướng dẫn cài đặt nhanh

## 1. Cài đặt dependencies
```bash
npm install
```

## 2. Tạo file .env
Tạo file `.env` trong thư mục gốc với nội dung:
```env
DATABASE_URL="mysql://root:123456@localhost:3307/capstone_fiverr"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=3000
```

## 3. Tạo database MySQL
```bash
# Đăng nhập MySQL
mysql -u root -p

# Tạo database
CREATE DATABASE capstone_fiverr;
USE capstone_fiverr;

# Chạy file SQL (từ terminal khác)
mysql -u root -p capstone_fiverr < database.sql
```

## 4. Khởi tạo Prisma
```bash
# Tạo Prisma client
npm run db:generate

# Đồng bộ schema
npm run db:push
```

## 5. Chạy ứng dụng
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 6. Kiểm tra
- Server: http://localhost:3000
- Health check: http://localhost:3000/health
- Database: MySQL trên port 3307

## 🔧 Troubleshooting

### Lỗi kết nối database
- Kiểm tra MySQL server có đang chạy không
- Kiểm tra port 3307 có đúng không
- Kiểm tra username/password MySQL

### Lỗi Prisma
```bash
# Reset Prisma
npx prisma migrate reset
npx prisma generate
npx prisma db push
```

### Lỗi port đã sử dụng
Thay đổi port trong file `.env`:
```env
PORT=3001
```
