import { Module } from '@nestjs/common';
import { InitService } from './init.service';
import { PrismaModule } from '../modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [InitService],
  exports: [InitService],
})
export class InitModule {}
