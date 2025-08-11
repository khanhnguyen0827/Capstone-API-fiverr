import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './modules/article/article.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TokenModule } from './modules/token/token.module';
import { ProtectStrategyStep2 } from './modules/auth/protect/protect.strategy';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { TotpModule } from './modules/totp/totp.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ArticleModule,
    PrismaModule,
    UserModule,
    AuthModule,
    TokenModule,
    TotpModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProtectStrategyStep2],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
