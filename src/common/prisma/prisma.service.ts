import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'mysql://root:123456@localhost:3307/capstone_fiverr',
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      console.log('🔧 Please check:');
      console.log('   - MySQL server is running');
      console.log('   - Database "capstone_fiverr" exists');
      console.log('   - Connection details in .env file');
      console.log('   - Port 3307 is accessible');
      
      // Retry connection after 5 seconds
      setTimeout(async () => {
        try {
          await this.$connect();
          console.log('✅ Database reconnected successfully');
        } catch (retryError) {
          console.error('❌ Database reconnection failed:', retryError.message);
        }
      }, 5000);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      console.log('🔌 Database disconnected');
    } catch (error) {
      console.error('❌ Error disconnecting database:', error.message);
    }
  }
}
