import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { CommentsModule } from './modules/comments/comments.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { MiddlewareModule } from './common/middleware/middleware.module';
import { InitModule } from './init/init.module';
import { HealthModule } from './modules/health/health.module';
import { 
  SecurityMiddleware, 
  CorsMiddleware, 
  RateLimitMiddleware, 
  ValidationMiddleware, 
  LoggerMiddleware 
} from './common/middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MiddlewareModule,
    PrismaModule,
    InitModule,
    HealthModule,
    AuthModule,
    UsersModule,
    JobsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply middleware in order
    consumer
      .apply(SecurityMiddleware)
      .forRoutes('*')
      .apply(CorsMiddleware)
      .forRoutes('*')
      .apply(RateLimitMiddleware)
      .forRoutes('*')
      .apply(ValidationMiddleware)
      .forRoutes('*')
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
