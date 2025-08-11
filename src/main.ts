import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE || 'Capstone Fiverr API')
    .setDescription(process.env.SWAGGER_DESCRIPTION || `
      # 🚀 Capstone Fiverr API Documentation
      
      API hoàn chỉnh cho nền tảng freelance tương tự Fiverr, được xây dựng với NestJS và Prisma.
      
      ## 📋 Tính năng chính
      - **Authentication**: Đăng ký, đăng nhập với JWT
      - **User Management**: CRUD người dùng với role-based access
      - **Job Management**: Quản lý công việc, danh mục, tìm kiếm nâng cao
      - **Comments**: Bình luận và đánh giá công việc
      - **Database**: MySQL với Prisma ORM
      
      ## 🔐 Authentication
      Sử dụng Bearer token trong header \`Authorization\`:
      \`\`\`
      Authorization: Bearer <your-jwt-token>
      \`\`\`
      
      ## 📊 Response Format
      Tất cả API responses đều theo format chuẩn:
      \`\`\`json
      {
        "statusCode": 200,
        "message": "Thông báo thành công",
        "content": "Dữ liệu trả về",
        "dateTime": "2024-01-20T10:30:00.000Z"
      }
      \`\`\`
      
      ## 🚨 Error Handling
      - \`400\`: Dữ liệu đầu vào không hợp lệ
      - \`401\`: Chưa đăng nhập hoặc token không hợp lệ
      - \`403\`: Không có quyền truy cập
      - \`404\`: Tài nguyên không tồn tại
      - \`500\`: Lỗi server
    `)
    .setVersion(process.env.SWAGGER_VERSION || '1.0.0')
    .setContact('Capstone Team', 'https://github.com/your-repo', 'team@capstone.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Nhập JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'Các API xác thực người dùng')
    .addTag('Users Management', 'Quản lý người dùng')
    .addTag('Jobs Management', 'Quản lý công việc và tìm kiếm')
    .addTag('Comments', 'Bình luận và đánh giá công việc')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Cấu hình Swagger UI
  SwaggerModule.setup(process.env.SWAGGER_PATH || 'api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai'
      }
    },
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #2c3e50; font-size: 36px; }
      .swagger-ui .info .description { font-size: 16px; line-height: 1.6; }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 20px; border-radius: 8px; }
    `,
    customSiteTitle: process.env.SWAGGER_TITLE || 'Capstone Fiverr API Documentation',
    customfavIcon: '/favicon.ico',
  });

  // Global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Ứng dụng đang chạy trên: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/${process.env.SWAGGER_PATH || 'api-docs'}`);
  console.log(`🔍 Health Check: http://localhost:${port}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();