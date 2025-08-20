

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '../../../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Database disconnected successfully');
    } catch (error) {
      this.logger.error('Failed to disconnect from database', error);
    }
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'test') {
      try {
        // For MySQL, we'll use a different approach
        const tables = await this.$queryRaw<Array<{ TABLE_NAME: string }>>`
          SELECT TABLE_NAME 
          FROM information_schema.TABLES 
          WHERE TABLE_SCHEMA = DATABASE()
        `;

        const tableNames = tables
          .map(({ TABLE_NAME }) => TABLE_NAME)
          .filter((name) => name !== '_prisma_migrations');

        for (const tableName of tableNames) {
          await this.$executeRawUnsafe(`TRUNCATE TABLE \`${tableName}\``);
        }
        
        this.logger.log('Test database cleaned successfully');
      } catch (error) {
        this.logger.error('Error cleaning test database', error);
      }
    }
  }
}
