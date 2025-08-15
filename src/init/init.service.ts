import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';
import { ENV, USER_ROLES } from '../common/constant/app.constant';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InitService implements OnModuleInit {
  private readonly logger = new Logger(InitService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    if (ENV.NODE_ENV === 'development') {
      await this.initializeDevelopmentData();
    }
    
    await this.initializeDatabase();
    this.logger.log('✅ Project initialization completed');
  }

  private async initializeDatabase() {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;
      this.logger.log('✅ Database connection successful');

      // Check if tables exist
      const tables = await this.prisma.$queryRaw<Array<{ table_name: string }>>`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'capstone_fiverr'
      `;

      if (tables.length === 0) {
        this.logger.warn('⚠️  No tables found. Please run database migrations first.');
        return;
      }

      this.logger.log(`📊 Found ${tables.length} tables in database`);
    } catch (error) {
      this.logger.error('❌ Database initialization failed:', error.message);
      throw error;
    }
  }

  private async initializeDevelopmentData() {
    try {
      // Check if admin user exists
      const adminExists = await this.prisma.nguoiDung.findFirst({
        where: { role: USER_ROLES.ADMIN }
      });

      if (!adminExists) {
        await this.createDefaultAdmin();
        this.logger.log('👑 Default admin user created');
      }

      // Check if job types exist
      const jobTypesCount = await this.prisma.loaiCongViec.count();
      if (jobTypesCount === 0) {
        await this.createDefaultJobTypes();
        this.logger.log('💼 Default job types created');
      }

      // Check if job categories exist
      const jobCategoriesCount = await this.prisma.chiTietLoaiCongViec.count();
      if (jobCategoriesCount === 0) {
        await this.createDefaultJobCategories();
        this.logger.log('📂 Default job categories created');
      }

    } catch (error) {
      this.logger.error('❌ Development data initialization failed:', error.message);
    }
  }

  private async createDefaultAdmin() {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await this.prisma.nguoiDung.create({
      data: {
        name: 'Administrator',
        email: 'admin@capstone.com',
        pass_word: hashedPassword,
        role: USER_ROLES.ADMIN,
        phone: '0123456789',
        birth_day: '1990-01-01',
        gender: 'Nam',
        skill: 'System Administration, Project Management',
        certification: 'AWS Certified Solutions Architect, PMP',
      },
    });
  }

  private async createDefaultJobTypes() {
    const jobTypes = [
      { ten_loai_cong_viec: 'Công nghệ thông tin' },
      { ten_loai_cong_viec: 'Thiết kế đồ họa' },
      { ten_loai_cong_viec: 'Marketing' },
      { ten_loai_cong_viec: 'Viết lách' },
      { ten_loai_cong_viec: 'Dịch thuật' },
      { ten_loai_cong_viec: 'Âm nhạc & Audio' },
      { ten_loai_cong_viec: 'Video & Animation' },
      { ten_loai_cong_viec: 'Kinh doanh' },
    ];

    for (const jobType of jobTypes) {
      await this.prisma.loaiCongViec.create({ data: jobType });
    }
  }

  private async createDefaultJobCategories() {
    // Get job types first
    const itJobType = await this.prisma.loaiCongViec.findFirst({
      where: { ten_loai_cong_viec: 'Công nghệ thông tin' }
    });

    const designJobType = await this.prisma.loaiCongViec.findFirst({
      where: { ten_loai_cong_viec: 'Thiết kế đồ họa' }
    });

    if (itJobType) {
      const itCategories = [
        { ten_chi_tiet: 'Lập trình Web', ma_loai_cong_viec: itJobType.id },
        { ten_chi_tiet: 'Lập trình Mobile', ma_loai_cong_viec: itJobType.id },
        { ten_chi_tiet: 'Lập trình Desktop', ma_loai_cong_viec: itJobType.id },
        { ten_chi_tiet: 'Database', ma_loai_cong_viec: itJobType.id },
        { ten_chi_tiet: 'DevOps', ma_loai_cong_viec: itJobType.id },
      ];

      for (const category of itCategories) {
        await this.prisma.chiTietLoaiCongViec.create({ data: category });
      }
    }

    if (designJobType) {
      const designCategories = [
        { ten_chi_tiet: 'Logo Design', ma_loai_cong_viec: designJobType.id },
        { ten_chi_tiet: 'UI/UX Design', ma_loai_cong_viec: designJobType.id },
        { ten_chi_tiet: 'Banner Design', ma_loai_cong_viec: designJobType.id },
        { ten_chi_tiet: 'Illustration', ma_loai_cong_viec: designJobType.id },
        { ten_chi_tiet: '3D Design', ma_loai_cong_viec: designJobType.id },
      ];

      for (const category of designCategories) {
        await this.prisma.chiTietLoaiCongViec.create({ data: category });
      }
    }
  }

  async getSystemStatus() {
    try {
      const userCount = await this.prisma.nguoiDung.count();
      const jobCount = await this.prisma.congViec.count();
      const jobTypeCount = await this.prisma.loaiCongViec.count();
      const categoryCount = await this.prisma.chiTietLoaiCongViec.count();

      return {
        status: 'healthy',
        database: 'connected',
        users: userCount,
        jobs: jobCount,
        jobTypes: jobTypeCount,
        categories: categoryCount,
        environment: ENV.NODE_ENV,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
