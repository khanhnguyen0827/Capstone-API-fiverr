import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global pipes
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    errorHttpStatusCode: 422,
  }));

  // CORS
  app.enableCors();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Capstone Fiverr API')
    .setDescription('API cho nền tảng Fiverr-like với NestJS và Prisma')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Authentication', 'Xác thực người dùng')
    .addTag('Users', 'Quản lý người dùng')
    .addTag('Jobs', 'Quản lý công việc')
    .addTag('Comments', 'Quản lý bình luận')
    .addTag('Hiring', 'Quản lý thuê công việc')
    .addTag('Categories', 'Quản lý danh mục công việc')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: { 
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });

  const PORT = process.env.PORT || 3000;
  const logger = new Logger('Bootstrap');
  
  await app.listen(PORT, () => {
    logger.log(`🚀 Server running on port ${PORT}`);
    logger.log(`📚 API Base URL: http://localhost:${PORT}/api/v1`);
    logger.log(`📖 Swagger documentation: http://localhost:${PORT}/api-docs`);
  });
}

bootstrap();



