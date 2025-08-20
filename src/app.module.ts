import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { CongViecModule } from './modules/cong-viec/cong-viec.module';
import { BinhLuanModule } from './modules/binh-luan/binh-luan.module';
import { ThueCongViecModule } from './modules/thue-cong-viec/thue-cong-viec.module';
import { LoaiCongViecModule } from './modules/loai-cong-viec/loai-cong-viec.module';
import { ChiTietLoaiCongViecModule } from './modules/chi-tiet-loai-cong-viec/chi-tiet-loai-cong-viec.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    TerminusModule,
    PrismaModule,
    AuthModule, 
    UserModule,
    CongViecModule,
    BinhLuanModule,
    ThueCongViecModule,
    LoaiCongViecModule,
    ChiTietLoaiCongViecModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
