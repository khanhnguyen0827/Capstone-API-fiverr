import { Module } from '@nestjs/common';
import { ThueCongViecService } from './thue-cong-viec.service';
import { ThueCongViecController } from './thue-cong-viec.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ThueCongViecController],
  providers: [ThueCongViecService],
  exports: [ThueCongViecService],
})
export class ThueCongViecModule {}
