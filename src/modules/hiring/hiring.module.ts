import { Module } from '@nestjs/common';
import { HiringController } from './hiring.controller';
import { HiringService } from './hiring.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HiringController],
  providers: [HiringService],
  exports: [HiringService],
})
export class HiringModule {}
