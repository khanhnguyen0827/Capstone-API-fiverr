import { Module } from '@nestjs/common';
import { CongViecService } from './cong-viec.service';
import { CongViecController } from './cong-viec.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CongViecController],
  providers: [CongViecService],
  exports: [CongViecService],
})
export class CongViecModule {}
