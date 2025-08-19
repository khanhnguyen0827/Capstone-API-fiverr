import { Module } from '@nestjs/common';
import { ChiTietLoaiCongViecService } from './chi-tiet-loai-cong-viec.service';
import { ChiTietLoaiCongViecController } from './chi-tiet-loai-cong-viec.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ChiTietLoaiCongViecController],
  providers: [ChiTietLoaiCongViecService],
  exports: [ChiTietLoaiCongViecService],
})
export class ChiTietLoaiCongViecModule {}
