const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mysql://root:123456@localhost:3307/capstone_fiverr"
    }
  }
});

// Test kết nối database
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Kết nối database thành công!');
  } catch (error) {
    console.error('❌ Lỗi kết nối database:', error);
  }
}

// Đóng kết nối database
async function closeConnection() {
  await prisma.$disconnect();
}

module.exports = {
  prisma,
  testConnection,
  closeConnection
};
