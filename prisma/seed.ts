import { PrismaClient } from '../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.users.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      ho_ten: 'Administrator',
      pass_word: adminPassword,
      role: 'ADMIN',
      phone: '0123456789',
      skill: 'System Administration',
      certification: 'AWS Certified',
    },
  });

  // Create sample users
  const user1Password = await bcrypt.hash('user123', 10);
  const user1 = await prisma.users.upsert({
    where: { email: 'nguyenvana@email.com' },
    update: {},
    create: {
      email: 'nguyenvana@email.com',
      ho_ten: 'Nguyễn Văn A',
      pass_word: user1Password,
      role: 'FREELANCER',
      phone: '0123456781',
      skill: 'Lập trình web, React, Node.js',
      certification: 'AWS Certified Developer',
    },
  });

  const user2Password = await bcrypt.hash('user123', 10);
  const user2 = await prisma.users.upsert({
    where: { email: 'tranthib@email.com' },
    update: {},
    create: {
      email: 'tranthib@email.com',
      ho_ten: 'Trần Thị B',
      pass_word: user2Password,
      role: 'CLIENT',
      phone: '0987654321',
      skill: 'Marketing, SEO',
      certification: 'Google Ads Certified',
    },
  });

  // Create job categories
  const webDevCategory = await prisma.loaiCongViec.upsert({
    where: { id: 1 },
    update: {},
    create: {
      ten_loai_cong_viec: 'Công nghệ thông tin',
      hinh_anh: 'tech.jpg',
      mo_ta: 'Các dịch vụ liên quan đến công nghệ thông tin',
      thu_tu: 1,
    },
  });

  const designCategory = await prisma.loaiCongViec.upsert({
    where: { id: 2 },
    update: {},
    create: {
      ten_loai_cong_viec: 'Thiết kế đồ họa',
      hinh_anh: 'design.jpg',
      mo_ta: 'Dịch vụ thiết kế đồ họa và hình ảnh',
      thu_tu: 2,
    },
  });

  // Create job subcategories
  const reactSubcategory = await prisma.chiTietLoaiCongViec.upsert({
    where: { id: 1 },
    update: {},
    create: {
      ten_chi_tiet: 'Lập trình web',
      hinh_anh: 'web-dev.jpg',
      mo_ta: 'Phát triển website và ứng dụng web',
      thu_tu: 1,
      ma_loai_cong_viec: webDevCategory.id,
    },
  });

  const nodeSubcategory = await prisma.chiTietLoaiCongViec.upsert({
    where: { id: 2 },
    update: {},
    create: {
      ten_chi_tiet: 'Lập trình mobile',
      hinh_anh: 'mobile-dev.jpg',
      mo_ta: 'Phát triển ứng dụng di động',
      thu_tu: 2,
      ma_loai_cong_viec: webDevCategory.id,
    },
  });

  const logoSubcategory = await prisma.chiTietLoaiCongViec.upsert({
    where: { id: 3 },
    update: {},
    create: {
      ten_chi_tiet: 'Thiết kế logo',
      hinh_anh: 'logo-design.jpg',
      mo_ta: 'Thiết kế logo và nhận diện thương hiệu',
      thu_tu: 1,
      ma_loai_cong_viec: designCategory.id,
    },
  });

  // Create sample jobs
  const job1 = await prisma.congViec.upsert({
    where: { id: 1 },
    update: {},
    create: {
      ten_cong_viec: 'Thiết kế website bán hàng',
      danh_gia: 5,
      gia_tien: 5000000,
      hinh_anh: 'website-design.jpg',
      mo_ta: 'Thiết kế website bán hàng chuyên nghiệp với giao diện đẹp và responsive',
      mo_ta_ngan: 'Website bán hàng responsive',
      sao_cong_viec: 5,
      ma_chi_tiet_loai: reactSubcategory.id,
      nguoi_tao: user1.id,
      trang_thai: 'AVAILABLE',
      so_luong_da_thue: 0,
      so_luong_da_hoan_thanh: 0,
    },
  });

  const job2 = await prisma.congViec.upsert({
    where: { id: 2 },
    update: {},
    create: {
      ten_cong_viec: 'Lập trình ứng dụng mobile',
      danh_gia: 4,
      gia_tien: 8000000,
      hinh_anh: 'mobile-app.jpg',
      mo_ta: 'Phát triển ứng dụng mobile cho iOS và Android',
      mo_ta_ngan: 'App mobile iOS/Android',
      sao_cong_viec: 4,
      ma_chi_tiet_loai: nodeSubcategory.id,
      nguoi_tao: user1.id,
      trang_thai: 'AVAILABLE',
      so_luong_da_thue: 0,
      so_luong_da_hoan_thanh: 0,
    },
  });

  const job3 = await prisma.congViec.upsert({
    where: { id: 3 },
    update: {},
    create: {
      ten_cong_viec: 'Thiết kế logo công ty',
      danh_gia: 5,
      gia_tien: 2000000,
      hinh_anh: 'logo-design.jpg',
      mo_ta: 'Thiết kế logo độc đáo và chuyên nghiệp cho công ty',
      mo_ta_ngan: 'Logo công ty chuyên nghiệp',
      sao_cong_viec: 5,
      ma_chi_tiet_loai: logoSubcategory.id,
      nguoi_tao: user1.id,
      trang_thai: 'AVAILABLE',
      so_luong_da_thue: 0,
      so_luong_da_hoan_thanh: 0,
    },
  });

  // Create sample job hires
  const hire1 = await prisma.thueCongViec.upsert({
    where: { id: 1 },
    update: {},
    create: {
      ma_cong_viec: job1.id,
      ma_nguoi_thue: user2.id,
      ma_nguoi_lam: user1.id,
      trang_thai: 'ACCEPTED',
      hoan_thanh: false,
      ngay_thue: new Date('2024-01-15T10:00:00Z'),
    },
  });

  // Create sample comments
  const comment1 = await prisma.binhLuan.upsert({
    where: { id: 1 },
    update: {},
    create: {
      ma_cong_viec: job1.id,
      ma_nguoi_binh_luan: user2.id,
      ma_thue_cong_viec: hire1.id,
      noi_dung: 'Dự án rất tốt, giao diện đẹp!',
      sao_binh_luan: 5,
      loai_binh_luan: 'REVIEW',
    },
  });

  // Create sample notifications
  const notification1 = await prisma.thongBao.upsert({
    where: { id: 1 },
    update: {},
    create: {
      tieu_de: 'Chào mừng bạn đến với Fiverr',
      noi_dung: 'Chào mừng bạn đến với nền tảng freelance hàng đầu',
      loai_thong_bao: 'SYSTEM',
      ma_nguoi_nhan: user1.id,
      da_doc: false,
    },
  });

  console.log('✅ Database seeding completed successfully!');
  console.log(`👤 Created admin: ${admin.email}`);
  console.log(`👤 Created freelancer: ${user1.email}`);
  console.log(`👤 Created client: ${user2.email}`);
  console.log(`🏷️ Created category: ${webDevCategory.ten_loai_cong_viec}`);
  console.log(`💼 Created jobs: ${job1.ten_cong_viec}, ${job2.ten_cong_viec}, ${job3.ten_cong_viec}`);
  console.log(`📋 Created hire: ${hire1.id}`);
  console.log(`💬 Created comment: ${comment1.id}`);
  console.log(`🔔 Created notification: ${notification1.tieu_de}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
