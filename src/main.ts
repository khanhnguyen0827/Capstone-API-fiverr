import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('🚀 Fiverr API - Professional Freelance Platform')
    .setDescription(`
      <div style="text-align: center; margin: 20px 0;">
        <h2 style="color: #2c3e50; margin-bottom: 15px;">🌟 API Documentation for Fiverr-like Platform</h2>
        <p style="color: #5a6c7d; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Complete REST API for managing users, jobs, comments, and authentication in a professional freelance marketplace.
        </p>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 10px; margin: 15px 0;">
          <strong>🔐 JWT Authentication Required</strong> - Use Bearer token for protected endpoints
        </div>
        <div style="display: flex; justify-content: center; gap: 20px; margin: 20px 0; flex-wrap: wrap;">
          <span style="background: #27ae60; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px;">✅ Users Management</span>
          <span style="background: #3498db; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px;">💼 Jobs Management</span>
          <span style="background: #e74c3c; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px;">💬 Comments System</span>
          <span style="background: #f39c12; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px;">🔑 Authentication</span>
        </div>
      </div>
    `)
    .setVersion('2.0.0')
    .addServer('http://localhost:3000', 'Development Server')
    .addServer('https://api.fiverr.com', 'Production Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: '🔐 Enter your JWT token for authentication. Format: Bearer <your-token>',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('🔐 Authentication', 'User registration, login, token management, and security features')
    .addTag('👥 Users Management', 'Complete user CRUD operations, profile management, and permissions')
    .addTag('💼 Jobs Management', 'Job posting, searching, categories, ratings, and marketplace features')
    .addTag('💬 Comments & Reviews', 'Comment system, user reviews, ratings, and interaction features')
    .addTag('📊 Analytics', 'Platform statistics, user analytics, and performance metrics')
    .addTag('🔧 System', 'Health checks, system status, and maintenance endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Cấu hình Swagger UI với giao diện đẹp và chuyên nghiệp
  SwaggerModule.setup(process.env.SWAGGER_PATH || 'api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      displayOperationId: false,
      tryItOutEnabled: true,
      requestInterceptor: (req) => {
        // Tự động thêm Bearer token nếu có
        const token = localStorage.getItem('swagger_token');
        if (token) {
          req.headers.Authorization = `Bearer ${token}`;
        }
        return req;
      }
    },
    customSiteTitle: 'Fiverr API Documentation',
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
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