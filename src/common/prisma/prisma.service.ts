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
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Kết nối database thành công!');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
