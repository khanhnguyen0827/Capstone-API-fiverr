import { Module } from '@nestjs/common';
import { HiringController } from './hiring.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HiringController],
  providers: [],
  exports: [],
})
export class HiringModule {}
