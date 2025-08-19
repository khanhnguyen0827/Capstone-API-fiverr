import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { CongViecModule } from './modules/cong-viec/cong-viec.module';
import { BinhLuanModule } from './modules/binh-luan/binh-luan.module';
import { ThueCongViecModule } from './modules/thue-cong-viec/thue-cong-viec.module';
import { LoaiCongViecModule } from './modules/loai-cong-viec/loai-cong-viec.module';
import { ChiTietLoaiCongViecModule } from './modules/chi-tiet-loai-cong-viec/chi-tiet-loai-cong-viec.module';

@Module({
  imports: [
    ConfigModule.forRoot(), 
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
export class AppModule {}
