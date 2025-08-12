import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as SwaggerModels from './common/swagger/models';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix - chỉ set một lần
  app.setGlobalPrefix('api');

  // Serve static assets for Swagger customization
  app.useStaticAssets(join(process.cwd(), 'public'));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE || 'Capstone Fiverr API')
    .setDescription(process.env.SWAGGER_DESCRIPTION || 'API cho nền tảng freelance tương tự Fiverr')
    .setVersion(process.env.SWAGGER_VERSION || '1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Nhập JWT token để xác thực. Format: Bearer <token>',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'Xác thực người dùng - Đăng ký, đăng nhập, quản lý token')
    .addTag('Users', 'Quản lý người dùng - CRUD, hồ sơ, phân quyền')
    .addTag('Jobs', 'Quản lý công việc - Đăng tin, tìm kiếm, danh mục, đánh giá')
    .addTag('Comments', 'Hệ thống bình luận - Đánh giá, nhận xét, tương tác')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: Object.values(SwaggerModels) as any,
  });

  // Cấu hình Swagger UI tinh gọn + hỗ trợ Dark/Light
  SwaggerModule.setup(process.env.SWAGGER_PATH || 'api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      docExpansion: 'none',
      defaultModelsExpandDepth: -1,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: process.env.SWAGGER_TITLE || 'Capstone Fiverr API',
    customCssUrl: '/swagger.css',
    customJs: ['/swagger.js'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`
🚀 Ứng dụng đang chạy trên: http://localhost:${port}
📚 API Documentation: http://localhost:${port}/api-docs
🔍 Health Check: http://localhost:${port}/health
🌍 Environment: ${process.env.NODE_ENV || 'development'}
  `);
}

bootstrap();