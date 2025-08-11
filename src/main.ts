import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { ProtectGuardStep1 } from './modules/auth/protect/protect.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // API GỌI TỚI
  // 1. Middleware
  // 2. Guards
  // 3. Interceptors (before)
  // 4. Pipes
  // 5. ---------- Controller => Service ----------
  // 6. Interceptors (after)
  // 7. Filters (chạy cuối, nhưng chỉ chạy khi quăng execution)
  // FE NHẬN

  // GLOBAL
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalGuards(new ProtectGuardStep1(reflector));

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory, {
    swaggerOptions: { persistAuthorization: true },
  });

  const PORT = process.env.PORT ?? 3000;
  const logger = new Logger('Bootstrap');
  await app.listen(PORT, () => {
    logger.log(`Server running on port ${PORT}`);
  });
}
bootstrap();




// ákjdákjdhád

// áđâsd