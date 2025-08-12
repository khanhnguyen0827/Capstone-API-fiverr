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
    .setTitle('Fiverr API')
    .setDescription(`
# Fiverr API Documentation

## Overview
API cho nền tảng freelance tương tự Fiverr, cung cấp các chức năng quản lý người dùng, công việc, bình luận và xác thực.

## Authentication
API sử dụng JWT Bearer token để xác thực. Để sử dụng các endpoint được bảo vệ:

1. Đăng ký tài khoản mới qua \`POST /api/auth/signup\`
2. Đăng nhập để lấy JWT token qua \`POST /api/auth/signin\`
3. Sử dụng token trong header: \`Authorization: Bearer <token>\`

## Features
- **User Management**: Đăng ký, đăng nhập, quản lý profile
- **Job Management**: Tạo, cập nhật, xóa, tìm kiếm công việc
- **Category Management**: Quản lý danh mục công việc
- **Comment System**: Hệ thống bình luận cho công việc
- **Advanced Search**: Tìm kiếm nâng cao với nhiều tiêu chí

## Rate Limiting
API có giới hạn tốc độ để đảm bảo hiệu suất và bảo mật.

## Support
Nếu có vấn đề, vui lòng liên hệ support team.
    `)
    .setVersion('1.0.0')
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
    .addTag('Authentication', 'Xác thực người dùng')
    .addTag('Users Management', 'Quản lý người dùng')
    .addTag('Jobs Management', 'Quản lý công việc')
    .addTag('Comments', 'Quản lý bình luận')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Cấu hình Swagger UI theo chuẩn Fiverr
  SwaggerModule.setup(process.env.SWAGGER_PATH || 'api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
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
    customCss: `
      .swagger-ui .topbar { 
        display: none 
      }
      
      .swagger-ui .info .title { 
        color: #1dbf73; 
        font-size: 36px; 
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
        text-transform: uppercase;
        letter-spacing: 2px;
      }
      
      .swagger-ui .info .description { 
        font-size: 16px; 
        line-height: 1.6; 
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        border-left: 4px solid #1dbf73;
        margin: 20px 0;
      }
      
      .swagger-ui .info .description h1 {
        color: #1dbf73;
        font-size: 24px;
        margin-bottom: 15px;
      }
      
      .swagger-ui .info .description h2 {
        color: #2c3e50;
        font-size: 20px;
        margin-bottom: 10px;
      }
      
      .swagger-ui .info .description h3 {
        color: #34495e;
        font-size: 18px;
        margin-bottom: 8px;
      }
      
      .swagger-ui .info .description code {
        background: #e9ecef;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
      }
      
      .swagger-ui .scheme-container { 
        background: linear-gradient(135deg, #1dbf73, #19a463); 
        color: white;
        padding: 20px; 
        border-radius: 12px; 
        margin: 20px 0;
        box-shadow: 0 4px 15px rgba(29, 191, 115, 0.3);
      }
      
      .swagger-ui .scheme-container .scheme-title {
        color: white !important;
        font-weight: bold;
        font-size: 18px;
      }
      
      .swagger-ui .opblock.opblock-post .opblock-summary-method {
        background: #1dbf73;
        border-radius: 6px;
      }
      
      .swagger-ui .opblock.opblock-get .opblock-summary-method {
        background: #61affe;
        border-radius: 6px;
      }
      
      .swagger-ui .opblock.opblock-put .opblock-summary-method {
        background: #fca130;
        border-radius: 6px;
      }
      
      .swagger-ui .opblock.opblock-delete .opblock-summary-method {
        background: #f93e3e;
        border-radius: 6px;
      }
      
      .swagger-ui .opblock {
        border-radius: 8px;
        margin: 10px 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      
      .swagger-ui .opblock.opblock-post {
        border-color: #1dbf73;
      }
      
      .swagger-ui .opblock.opblock-get {
        border-color: #61affe;
      }
      
      .swagger-ui .opblock.opblock-put {
        border-color: #fca130;
      }
      
      .swagger-ui .opblock.opblock-delete {
        border-color: #f93e3e;
      }
      
      .swagger-ui .btn.execute {
        background: #1dbf73;
        border-color: #1dbf73;
        border-radius: 6px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .swagger-ui .btn.execute:hover {
        background: #19a463;
        border-color: #19a463;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(29, 191, 115, 0.4);
      }
      
      .swagger-ui .btn.execute:active {
        transform: translateY(0);
      }
      
      .swagger-ui .auth-wrapper {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 12px;
        border: 2px solid #e9ecef;
        margin: 20px 0;
        }
      
      .swagger-ui .auth-container {
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        padding: 25px;
        border-radius: 12px;
        border: 2px solid #1dbf73;
        margin: 20px 0;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      }
      
      .swagger-ui .auth-container h4 {
        color: #1dbf73;
        margin-bottom: 20px;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .swagger-ui .auth-container input {
        border: 2px solid #ddd;
        border-radius: 8px;
        padding: 12px 16px;
        width: 100%;
        margin-bottom: 15px;
        font-size: 14px;
        transition: all 0.3s ease;
      }
      
      .swagger-ui .auth-container input:focus {
        border-color: #1dbf73;
        box-shadow: 0 0 0 3px rgba(29, 191, 115, 0.1);
        outline: none;
      }
      
      .swagger-ui .auth-container button {
        background: linear-gradient(135deg, #1dbf73, #19a463);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 12px 24px;
        cursor: pointer;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all 0.3s ease;
        width: 100%;
      }
      
      .swagger-ui .auth-container button:hover {
        background: linear-gradient(135deg, #19a463, #158f5a);
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(29, 191, 115, 0.4);
      }
      
      .swagger-ui .auth-container button:active {
        transform: translateY(0);
      }
      
      .swagger-ui .opblock-summary-description {
        color: #666;
        font-style: italic;
      }
      
      .swagger-ui .opblock-summary-path {
        font-weight: bold;
        color: #2c3e50;
      }
      
      .swagger-ui .opblock-summary-operation-id {
        color: #7f8c8d;
        font-size: 12px;
      }
      
      .swagger-ui .responses-table {
        border-radius: 8px;
        overflow: hidden;
      }
      
      .swagger-ui .responses-table th {
        background: #1dbf73;
        color: white;
        font-weight: bold;
      }
      
      .swagger-ui .responses-table td {
        padding: 12px;
      }
      
      .swagger-ui .model {
        border-radius: 8px;
        border: 2px solid #e9ecef;
      }
      
      .swagger-ui .model-title {
        background: #1dbf73;
        color: white;
        padding: 15px;
        border-radius: 8px 8px 0 0;
        font-weight: bold;
      }
      
      .swagger-ui .model-box {
        padding: 20px;
      }
      
      .swagger-ui .parameters-container {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 20px;
        margin: 15px 0;
      }
      
      .swagger-ui .parameters-container h4 {
        color: #1dbf73;
        margin-bottom: 15px;
        font-weight: bold;
      }
      
      .swagger-ui .parameter__name {
        font-weight: bold;
        color: #2c3e50;
      }
      
      .swagger-ui .parameter__type {
        color: #7f8c8d;
        font-style: italic;
      }
      
      .swagger-ui .parameter__required {
        background: #e74c3c;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: bold;
      }
      
      .swagger-ui .parameter__deprecated {
        background: #f39c12;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: bold;
      }
      
      .swagger-ui .response-col_status {
        font-weight: bold;
      }
      
      .swagger-ui .response-col_status.response-200 {
        color: #27ae60;
      }
      
      .swagger-ui .response-col_status.response-201 {
        color: #27ae60;
      }
      
      .swagger-ui .response-col_status.response-400 {
        color: #e74c3c;
      }
      
      .swagger-ui .response-col_status.response-401 {
        color: #f39c12;
      }
      
      .swagger-ui .response-col_status.response-403 {
        color: #e67e22;
      }
      
      .swagger-ui .response-col_status.response-404 {
        color: #e74c3c;
      }
      
      .swagger-ui .response-col_status.response-500 {
        color: #c0392b;
      }
      
      .swagger-ui .response-col_description {
        color: #666;
      }
      
      .swagger-ui .response-col_links {
        color: #3498db;
        }
      
      .swagger-ui .response-col_links a {
        color: #3498db;
        text-decoration: none;
      }
      
      .swagger-ui .response-col_links a:hover {
        text-decoration: underline;
      }
      
      .swagger-ui .scheme-container .scheme-title {
        color: white !important;
        font-weight: bold;
        font-size: 18px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .swagger-ui .scheme-container .scheme-title::before {
        content: "🔐 ";
        margin-right: 10px;
      }
      
      .swagger-ui .info .title::before {
        content: "🚀 ";
        margin-right: 15px;
      }
      
      .swagger-ui .opblock.opblock-post .opblock-summary-method::before {
        content: "➕ ";
        margin-right: 5px;
      }
      
      .swagger-ui .opblock.opblock-get .opblock-summary-method::before {
        content: "📖 ";
        margin-right: 5px;
      }
      
      .swagger-ui .opblock.opblock-put .opblock-summary-method::before {
        content: "✏️ ";
        margin-right: 5px;
      }
      
      .swagger-ui .opblock.opblock-delete .opblock-summary-method::before {
        content: "🗑️ ";
        margin-right: 5px;
      }
    `,
    customSiteTitle: 'Fiverr API Documentation',
    customfavIcon: '/favicon.ico',
  });

  const port = process.env.PORT || 3000;
  
  try {
    await app.listen(port);
    console.log(`
🚀 Ứng dụng đang chạy trên: http://localhost:${port}
📚 API Documentation: http://localhost:${port}/api-docs
🔍 Health Check: http://localhost:${port}/health
🌍 Environment: ${process.env.NODE_ENV || 'development'}
    `);
  } catch (error) {
    console.error('❌ Failed to start application:', error.message);
    process.exit(1);
  }
}

bootstrap();