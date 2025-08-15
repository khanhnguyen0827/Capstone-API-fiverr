import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { InitModule } from '../../init/init.module';

@Module({
  imports: [InitModule],
  controllers: [HealthController],
})
export class HealthModule {}
