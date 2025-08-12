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
    .setDescription('API cho nền tảng freelance tương tự Fiverr')
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
    .addTag('Authentication', 'Xác thực người dùng - Đăng ký, đăng nhập, quản lý token')
    .addTag('Users Management', 'Quản lý người dùng - CRUD operations, profile, permissions')
    .addTag('Jobs Management', 'Quản lý công việc - Đăng tin, tìm kiếm, danh mục, đánh giá')
    .addTag('Comments', 'Hệ thống bình luận - Đánh giá, nhận xét, tương tác')
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
    customCss: `
      /* Reset và base styles */
      * { box-sizing: border-box; }
      
      /* Ẩn topbar mặc định */
      .swagger-ui .topbar { 
        display: none; 
      }
      
      /* Tiêu đề chính - thiết kế đẹp */
      .swagger-ui .info .title { 
        color: #2c3e50; 
        font-size: 42px; 
        font-weight: 700; 
        text-align: center;
        margin: 30px 0; 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      /* Mô tả API - thiết kế gọn gàng */
      .swagger-ui .info .description { 
        font-size: 16px; 
        line-height: 1.7; 
        color: #5a6c7d;
        margin: 25px 0; 
        text-align: center;
        font-weight: 400;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
      }
      
      /* Authorization section - thiết kế hiện đại */
      .swagger-ui .scheme-container { 
        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
        color: white;
        padding: 25px; 
        border-radius: 12px; 
        margin: 30px 0; 
        box-shadow: 0 8px 32px rgba(52, 152, 219, 0.3);
        border: none;
        text-align: center;
      }
      
      .swagger-ui .scheme-container .scheme-title {
        color: white !important;
        font-weight: 600; 
        font-size: 18px;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 15px;
      }
      
      /* Filter input - thiết kế đẹp */
      .swagger-ui .filter input {
        border: 2px solid #e1e8ed;
        border-radius: 25px;
        padding: 12px 20px;
        font-size: 14px;
        transition: all 0.3s ease;
        background: #f8f9fa;
        width: 100%;
        max-width: 400px;
        margin: 20px auto;
        display: block;
      }
      
      .swagger-ui .filter input:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        background: white;
      }
      
      /* Tags styling - thiết kế chuyên nghiệp */
      .swagger-ui .opblock-tag-section h3 {
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        color: white;
        padding: 20px 25px;
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        border-radius: 8px 8px 0 0;
        text-transform: none;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        position: relative;
        overflow: hidden;
      }
      
      .swagger-ui .opblock-tag-section h3::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
      }
      
      .swagger-ui .opblock-tag-section h3:hover::before {
        left: 100%;
      }
      
      /* Operation blocks - thiết kế hiện đại */
      .swagger-ui .opblock { 
        border-radius: 8px; 
        margin: 15px 0; 
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        border: none;
        background: white;
        transition: all 0.3s ease;
        overflow: hidden;
      }
      
      .swagger-ui .opblock:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0,0,0,0.12);
      }
      
      /* HTTP Method buttons - thiết kế đẹp */
      .swagger-ui .opblock.opblock-post .opblock-summary-method { 
        background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
        border-radius: 6px; 
        font-weight: 700;
        box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
        border: none;
        color: white;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        padding: 8px 12px;
        min-width: 60px;
      }
      
      .swagger-ui .opblock.opblock-get .opblock-summary-method { 
        background: linear-gradient(135deg, #3498db 0%, #5dade2 100%);
        border-radius: 6px; 
        font-weight: 700;
        box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
        border: none;
        color: white;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        padding: 8px 12px;
        min-width: 60px;
      }
      
      .swagger-ui .opblock.opblock-put .opblock-summary-method { 
        background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%);
        border-radius: 6px;
        font-weight: 700;
        box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
        border: none;
        color: white;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        padding: 8px 12px;
        min-width: 60px;
      }
      
      .swagger-ui .opblock.opblock-delete .opblock-summary-method { 
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        border-radius: 6px; 
        font-weight: 700;
        box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
        border: none;
        color: white;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        padding: 8px 12px;
        min-width: 60px;
      }
      
      /* Border colors cho operation blocks */
      .swagger-ui .opblock.opblock-post { border-left: 4px solid #27ae60; }
      .swagger-ui .opblock.opblock-get { border-left: 4px solid #3498db; }
      .swagger-ui .opblock.opblock-put { border-left: 4px solid #f39c12; }
      .swagger-ui .opblock.opblock-delete { border-left: 4px solid #e74c3c; }
      
      /* Execute button - thiết kế hiện đại */
      .swagger-ui .btn.execute { 
        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
        border: none;
        border-radius: 25px; 
        font-weight: 600; 
        padding: 10px 20px;
        color: white;
        font-size: 14px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .swagger-ui .btn.execute:hover { 
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
      }
      
      /* Try it out button - thiết kế đẹp */
      .swagger-ui .btn.try-out__btn {
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        border: none;
        border-radius: 20px;
        font-weight: 600;
        padding: 8px 16px;
        font-size: 13px;
        transition: all 0.3s ease;
        color: white;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
      }
      
      .swagger-ui .btn.try-out__btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(231, 76, 60, 0.4);
      }
      
      /* Operation summary - thiết kế gọn gàng */
      .swagger-ui .opblock-summary-description {
        color: #5a6c7d; 
        font-style: normal; 
        font-size: 15px;
        line-height: 1.6;
        font-weight: 500;
      }
      
      .swagger-ui .opblock-summary-path {
        font-weight: 700; 
        color: #2c3e50;
        font-size: 16px;
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;
        background: #f8f9fa;
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid #e1e8ed;
      }
      
      .swagger-ui .opblock-summary-operation-id {
        color: #3498db; 
        font-size: 12px;
        background: rgba(52, 152, 219, 0.1);
        padding: 4px 10px;
        border-radius: 15px;
        font-weight: 600;
        border: 1px solid rgba(52, 152, 219, 0.2);
      }
      
      /* Authorization lock icon - thiết kế đẹp */
      .swagger-ui .opblock-summary .authorization__btn {
        background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
        transition: all 0.3s ease;
      }
      
      .swagger-ui .opblock-summary .authorization__btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(243, 156, 18, 0.4);
      }
      
      /* Response tables - thiết kế full và rõ ràng */
      .swagger-ui .responses-table {
        border-radius: 8px;
        overflow: visible; 
        box-shadow: 0 3px 12px rgba(0,0,0,0.08);
        border: 2px solid #e1e8ed;
        margin: 20px 0;
        background: white;
        width: 100%;
        min-height: 80px;
      }
      
      .swagger-ui .responses-table th {
        background: #f8f9fa;
        color: #2c3e50; 
        font-weight: 600; 
        padding: 15px 18px;
        font-size: 14px;
        text-transform: none;
        letter-spacing: normal;
        border-bottom: 2px solid #e1e8ed;
      }
      
      .swagger-ui .responses-table td {
        padding: 15px 18px; 
        border-bottom: 1px solid #f1f3f4;
        font-size: 14px;
        color: #5a6c7d;
      }
      
      .swagger-ui .responses-table tr:hover {
        background: #f8f9fa;
      }
      
      /* Models - thiết kế đẹp */
      .swagger-ui .model {
        border-radius: 12px; 
        border: 2px solid #e1e8ed; 
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        overflow: hidden;
      }
      
      .swagger-ui .model-title {
        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
        color: white;
        padding: 20px; 
        font-weight: 600; 
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .swagger-ui .model-box {
        padding: 25px; 
        background: #f8f9fa;
      }
      
      /* Parameters container - thiết kế hiện đại */
      .swagger-ui .parameters-container {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
        border-radius: 12px; 
        padding: 25px; 
        margin: 20px 0; 
        border: 2px solid #e1e8ed;
        box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      }
      
      .swagger-ui .parameters-container h4 {
        color: #3498db; 
        margin-bottom: 20px; 
        font-weight: 600; 
        font-size: 18px;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      /* Parameter styling */
      .swagger-ui .parameter__name {
        font-weight: 600; 
        color: #2c3e50;
        font-size: 14px;
        background: #f8f9fa;
        padding: 6px 12px;
        border-radius: 6px;
        border: 1px solid #e1e8ed;
      }
      
      .swagger-ui .parameter__type {
        color: #3498db; 
        font-style: italic;
        font-size: 13px;
        font-weight: 500;
      }
      
      .swagger-ui .parameter__required {
        background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
        color: white;
        padding: 4px 12px; 
        border-radius: 20px; 
        font-size: 11px;
        font-weight: 600; 
        text-transform: uppercase;
        box-shadow: 0 2px 8px rgba(255, 65, 108, 0.3);
      }
      
      .swagger-ui .parameter__deprecated {
        background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
        color: white;
        padding: 4px 12px; 
        border-radius: 20px; 
        font-size: 11px;
        font-weight: 600; 
        text-transform: uppercase;
        box-shadow: 0 2px 8px rgba(255, 154, 158, 0.3);
      }
      
      /* Response status colors - thiết kế đẹp */
      .swagger-ui .response-col_status {
        font-weight: 600; 
        font-size: 14px;
        padding: 8px 16px;
        border-radius: 20px;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      
      .swagger-ui .response-col_status.response-200 {
        color: #27ae60;
        background: linear-gradient(135deg, #d5f4e6 0%, #abebc6 100%);
        border: 2px solid #27ae60;
      }
      
      .swagger-ui .response-col_status.response-201 {
        color: #27ae60;
        background: linear-gradient(135deg, #d5f4e6 0%, #abebc6 100%);
        border: 2px solid #27ae60;
      }
      
      .swagger-ui .response-col_status.response-400 {
        color: #e74c3c;
        background: linear-gradient(135deg, #fadbd8 0%, #f5b7b1 100%);
        border: 2px solid #e74c3c;
      }
      
      .swagger-ui .response-col_status.response-401 {
        color: #f39c12;
        background: linear-gradient(135deg, #fdeaa7 0%, #f8d7da 100%);
        border: 2px solid #f39c12;
      }
      
      .swagger-ui .response-col_status.response-403 {
        color: #e67e22;
        background: linear-gradient(135deg, #f8d7da 0%, #f5b7b1 100%);
        border: 2px solid #e67e22;
      }
      
      .swagger-ui .response-col_status.response-404 {
        color: #e74c3c;
        background: linear-gradient(135deg, #fadbd8 0%, #f5b7b1 100%);
        border: 2px solid #e74c3c;
      }
      
      .swagger-ui .response-col_status.response-500 {
        color: #c0392b;
        background: linear-gradient(135deg, #f5b7b1 0%, #fadbd8 100%);
        border: 2px solid #c0392b;
      }
      
      /* Response description và links - thiết kế tinh gọn */
      .swagger-ui .response-col_description {
        color: #2c3e50; 
        font-size: 12px;
        line-height: 1.4;
        font-weight: 400;
        background: #f8f9fa;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #e1e8ed;
        margin: 6px 0;
      }
      
      .swagger-ui .response-col_links {
        color: #3498db;
        font-size: 11px;
        font-weight: 400;
        background: #f8f9fa;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #e1e8ed;
        margin: 5px 0;
      }
      
      .swagger-ui .response-col_links a {
        color: #3498db;
        text-decoration: none;
        font-weight: 400;
        transition: color 0.3s ease;
        padding: 2px 5px;
        border-radius: 3px;
        background: rgba(52, 152, 219, 0.06);
      }
      
      .swagger-ui .response-col_links a:hover {
        color: #2980b9; 
        background: rgba(52, 152, 219, 0.12);
        text-decoration: none;
      }
      
      /* Response body - thiết kế cân đối */
      .swagger-ui .response-body {
        background: #f8f9fa;
        color: #2c3e50;
        padding: 15px;
        border-radius: 6px;
        margin: 12px 0;
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
        font-size: 12px;
        line-height: 1.5;
        border: 1px solid #e1e8ed;
        box-shadow: 0 1px 4px rgba(0,0,0,0.04);
      }
      
      /* Response headers - thiết kế cân đối */
      .swagger-ui .response-headers {
        background: #f8f9fa;
        color: #2c3e50;
        padding: 15px;
        border-radius: 6px;
        margin: 12px 0;
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
        font-size: 12px;
        border: 1px solid #e1e8ed;
        box-shadow: 0 1px 4px rgba(0,0,0,0.04);
      }
      
      /* Response status - thiết kế cân đối */
      .swagger-ui .response-col_status {
        background: #3498db;
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 13px;
        text-align: center;
        display: inline-block;
        margin-bottom: 12px;
        box-shadow: 0 2px 6px rgba(52, 152, 219, 0.2);
        border: none;
      }
      
      /* Hiện Responses summary - thiết kế full và rõ ràng */
      .swagger-ui .responses-inner {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        height: auto !important;
        overflow: visible !important;
        margin: 20px 0;
        padding: 25px;
        background: #ffffff;
        border-radius: 8px;
        border: 2px solid #e1e8ed;
        box-shadow: 0 3px 12px rgba(0,0,0,0.08);
        position: relative;
        min-height: 100px;
      }
      
      /* Hiện Responses table - thiết kế full và rõ ràng */
      .swagger-ui .responses-table {
        display: table !important;
        visibility: visible !important;
        opacity: 1 !important;
        height: auto !important;
        overflow: visible !important;
        border-radius: 8px;
        box-shadow: 0 3px 12px rgba(0,0,0,0.08);
        border: 2px solid #e1e8ed;
        margin: 20px 0;
        background: white;
        min-height: 80px;
        width: 100%;
      }
      
      /* Hiện Server Response details - thiết kế full và rõ ràng */
      .swagger-ui .response {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        height: auto !important;
        overflow: visible !important;
        margin: 20px 0;
        padding: 25px;
        background: #ffffff;
        border-radius: 8px;
        border: 2px solid #3498db;
        box-shadow: 0 3px 15px rgba(52, 152, 219, 0.15);
        position: relative;
        min-height: 120px;
        width: 100%;
      }
      
      /* Response header - thiết kế full và rõ ràng */
      .swagger-ui .response .response-col_status {
        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
        color: white;
        padding: 10px 20px;
        border-radius: 25px;
        font-weight: 700;
        font-size: 14px;
        text-align: center;
        display: inline-block;
        margin-bottom: 15px;
        box-shadow: 0 3px 12px rgba(52, 152, 219, 0.3);
        border: none;
        min-width: 80px;
      }
      
      /* Response content - thiết kế full và rõ ràng */
      .swagger-ui .response .response-col_description {
        background: #f8f9fa;
        padding: 18px;
        border-radius: 8px;
        border: 2px solid #e1e8ed;
        margin: 15px 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        color: #2c3e50;
        font-size: 14px;
        line-height: 1.6;
        min-height: 60px;
      }
      
      /* Response body content - thiết kế full và rõ ràng */
      .swagger-ui .response .response-body {
        background: #2c3e50;
        color: #ecf0f1;
        padding: 20px;
        border-radius: 8px;
        margin: 15px 0;
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
        font-size: 13px;
        line-height: 1.6;
        border: 2px solid #34495e;
        box-shadow: 0 3px 15px rgba(44, 62, 80, 0.2);
        position: relative;
        min-height: 80px;
      }
      
      /* Response headers content - thiết kế full và rõ ràng */
      .swagger-ui .response .response-headers {
        background: #34495e;
        color: #ecf0f1;
        padding: 20px;
        border-radius: 8px;
        margin: 15px 0;
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
        font-size: 13px;
        border: 2px solid #2c3e50;
        box-shadow: 0 3px 15px rgba(44, 62, 80, 0.2);
        min-height: 60px;
      }
      
      /* Response tabs - thiết kế tinh gọn */
      .swagger-ui .response .response-tabs {
        background: #f8f9fa;
        border-bottom: 1px solid #e1e8ed;
        margin-bottom: 12px;
        padding: 0;
      }
      
      .swagger-ui .response .response-tabs .tab-item {
        background: transparent;
        color: #5a6c7d;
        padding: 8px 16px;
        border: none;
        border-bottom: 2px solid transparent;
        margin-right: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 12px;
        font-weight: 400;
      }
      
      .swagger-ui .response .response-tabs .tab-item.active {
        color: #3498db;
        border-bottom-color: #3498db;
        background: #ffffff;
        font-weight: 500;
      }
      
      .swagger-ui .response .response-tabs .tab-item:hover {
        color: #3498db;
        background: #ffffff;
      }
      
      /* Curl command styling */
      .swagger-ui .curl-command {
        background: #2c3e50;
        color: #ecf0f1;
        padding: 15px;
        border-radius: 6px;
        margin: 15px 0;
        font-family: 'Courier New', monospace;
        font-size: 13px;
        position: relative;
      }
      
      .swagger-ui .curl-command .copy-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .swagger-ui .curl-command .copy-button:hover {
        background: #2980b9;
      }
      
      /* Request URL styling */
      .swagger-ui .request-url {
        background: #34495e;
        color: #ecf0f1;
        padding: 15px;
        border-radius: 6px;
        margin: 15px 0;
        font-family: 'Courier New', monospace;
        font-size: 13px;
      }
      
      /* Response body styling */
      .swagger-ui .response-body {
        background: #2c3e50;
        color: #ecf0f1;
        padding: 15px;
        border-radius: 6px;
        margin: 15px 0;
        font-family: 'Courier New', monospace;
        font-size: 13px;
        position: relative;
      }
      
      .swagger-ui .response-body .download-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #27ae60;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .swagger-ui .response-body .download-button:hover {
        background: #229954;
      }
      
      /* Response headers styling */
      .swagger-ui .response-headers {
        background: #34495e;
        color: #ecf0f1;
        padding: 15px;
        border-radius: 6px;
        margin: 15px 0;
        font-family: 'Courier New', monospace;
        font-size: 13px;
      }
      
      /* Request duration styling */
      .swagger-ui .request-duration {
        background: #34495e;
        color: #ecf0f1;
        padding: 15px;
        border-radius: 6px;
        margin: 15px 0;
        font-family: 'Courier New', monospace;
        font-size: 13px;
        text-align: center;
        font-weight: 600;
      }
      
      /* Responsive design */
      @media (max-width: 768px) {
        .swagger-ui .info .title {
          font-size: 32px;
          margin: 20px 0;
        }
        
        .swagger-ui .info .description {
          padding: 15px;
          font-size: 14px;
          margin: 15px 0;
        }
        
        .swagger-ui .scheme-container {
          padding: 20px;
          margin: 20px 0;
        }
        
        .swagger-ui .opblock {
          margin: 10px 0;
        }
        
        .swagger-ui .opblock-tag-section h3 {
          padding: 15px 20px;
        font-size: 18px;
        }
      }
      
      /* Custom scrollbar - thiết kế đẹp */
      ::-webkit-scrollbar {
        width: 10px;
      }
      
      ::-webkit-scrollbar-track {
        background: #f1f3f4;
        border-radius: 10px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
        border-radius: 10px;
        border: 2px solid #f1f3f4;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #2980b9 0%, #3498db 100%);
      }
      
      /* Loading states - thiết kế đẹp */
      .swagger-ui .loading-container {
        text-align: center;
        padding: 40px;
        color: #3498db;
        font-size: 18px;
        font-weight: 600;
      }
      
      /* Success messages - thiết kế đẹp */
      .swagger-ui .success-message {
        background: linear-gradient(135deg, #d5f4e6 0%, #abebc6 100%);
        color: #27ae60;
        padding: 15px 20px;
        border-radius: 12px;
        margin: 15px 0;
        border-left: 5px solid #27ae60;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(39, 174, 96, 0.2);
      }
      
      /* Error messages - thiết kế đẹp */
      .swagger-ui .error-message {
        background: linear-gradient(135deg, #fadbd8 0%, #f5b7b1 100%);
        color: #e74c3c;
        padding: 15px 20px;
        border-radius: 12px;
        margin: 15px 0;
        border-left: 5px solid #e74c3c;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(231, 76, 60, 0.2);
      }
    `,
          customSiteTitle: 'Fiverr API',
    customfavIcon: '/favicon.ico',
      customJs: `
        // Tự động hiện Responses table và làm full rõ ràng giao diện
        document.addEventListener('DOMContentLoaded', function() {
          // Hàm làm full và rõ ràng giao diện Responses
          function styleResponses() {
            // Làm full và rõ ràng Responses table
            const responsesTables = document.querySelectorAll('.responses-table');
            responsesTables.forEach(table => {
              table.style.borderRadius = '8px';
              table.style.boxShadow = '0 3px 12px rgba(0,0,0,0.08)';
              table.style.border = '2px solid #e1e8ed';
              table.style.margin = '20px 0';
              table.style.background = 'white';
              table.style.width = '100%';
              table.style.minHeight = '80px';
              table.style.overflow = 'visible';
            });
            
            // Làm full và rõ ràng Responses inner
            const responsesInner = document.querySelectorAll('.responses-inner');
            responsesInner.forEach(inner => {
              inner.style.visibility = 'visible';
              inner.style.opacity = '1';
              inner.style.height = 'auto';
              inner.style.overflow = 'visible';
              inner.style.margin = '20px 0';
              inner.style.padding = '25px';
              inner.style.background = '#ffffff';
              inner.style.borderRadius = '8px';
              inner.style.border = '2px solid #e1e8ed';
              inner.style.boxShadow = '0 3px 12px rgba(0,0,0,0.08)';
              inner.style.minHeight = '100px';
            });
            
            // Làm full và rõ ràng Server Response details
            const responses = document.querySelectorAll('.response');
            responses.forEach(response => {
              response.style.visibility = 'visible';
              response.style.opacity = '1';
              response.style.height = 'auto';
              response.style.overflow = 'visible';
              response.style.margin = '20px 0';
              response.style.padding = '25px';
              response.style.background = '#ffffff';
              response.style.borderRadius = '8px';
              response.style.border = '2px solid #3498db';
              response.style.boxShadow = '0 3px 15px rgba(52, 152, 219, 0.15)';
              response.style.minHeight = '120px';
              response.style.width = '100%';
            });
            
            // Làm tinh gọn Response status trong Server Response
            const responseStatusInResponse = document.querySelectorAll('.response .response-col_status');
            responseStatusInResponse.forEach(status => {
              status.style.background = '#3498db';
              status.style.color = 'white';
              status.style.padding = '6px 14px';
              status.style.borderRadius = '18px';
              status.style.fontWeight = '500';
              status.style.fontSize = '12px';
              status.style.textAlign = 'center';
              status.style.display = 'inline-block';
              status.style.marginBottom = '10px';
              status.style.boxShadow = '0 1px 3px rgba(52, 152, 219, 0.15)';
              status.style.border = 'none';
            });
            
            // Làm tinh gọn Response description trong Server Response
            const responseDescInResponse = document.querySelectorAll('.response .response-col_description');
            responseDescInResponse.forEach(desc => {
              desc.style.background = '#f8f9fa';
              desc.style.padding = '12px';
              desc.style.borderRadius = '5px';
              desc.style.border = '1px solid #e1e8ed';
              desc.style.margin = '10px 0';
              desc.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
              desc.style.color = '#2c3e50';
              desc.style.fontSize = '12px';
              desc.style.lineHeight = '1.4';
            });
            
            // Làm tinh gọn Response body trong Server Response
            const responseBodyInResponse = document.querySelectorAll('.response .response-body');
            responseBodyInResponse.forEach(body => {
              body.style.background = '#f8f9fa';
              body.style.color = '#2c3e50';
              body.style.padding = '12px';
              body.style.borderRadius = '5px';
              body.style.margin = '10px 0';
              body.style.fontFamily = "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace";
              body.style.fontSize = '11px';
              body.style.lineHeight = '1.4';
              body.style.border = '1px solid #e1e8ed';
              body.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
            });
            
            // Làm tinh gọn Response headers trong Server Response
            const responseHeadersInResponse = document.querySelectorAll('.response .response-headers');
            responseHeadersInResponse.forEach(headers => {
              headers.style.background = '#f8f9fa';
              headers.style.color = '#2c3e50';
              headers.style.padding = '12px';
              headers.style.borderRadius = '5px';
              headers.style.margin = '10px 0';
              headers.style.fontFamily = "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace";
              headers.style.fontSize = '11px';
              headers.style.border = '1px solid #e1e8ed';
              headers.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
            });
            
            // Làm tinh gọn Response tabs trong Server Response
            const responseTabs = document.querySelectorAll('.response .response-tabs');
            responseTabs.forEach(tabs => {
              tabs.style.background = '#f8f9fa';
              tabs.style.borderBottom = '1px solid #e1e8ed';
              tabs.style.marginBottom = '12px';
              tabs.style.padding = '0';
            });
            
            // Làm tinh gọn Tab items trong Server Response
            const tabItems = document.querySelectorAll('.response .response-tabs .tab-item');
            tabItems.forEach(tab => {
              tab.style.background = 'transparent';
              tab.style.color = '#5a6c7d';
              tab.style.padding = '8px 16px';
              tab.style.border = 'none';
              tab.style.borderBottom = '2px solid transparent';
              tab.style.marginRight = '4px';
              tab.style.cursor = 'pointer';
              tab.style.transition = 'all 0.3s ease';
              tab.style.fontSize = '12px';
              tab.style.fontWeight = '400';
            });
            
            // Làm tinh gọn Active tab trong Server Response
            const activeTabs = document.querySelectorAll('.response .response-tabs .tab-item.active');
            activeTabs.forEach(tab => {
              tab.style.color = '#3498db';
              tab.style.borderBottomColor = '#3498db';
              tab.style.background = '#ffffff';
              tab.style.fontWeight = '500';
            });
            
            // Làm tinh gọn Response status
            const responseStatus = document.querySelectorAll('.response-col_status');
            responseStatus.forEach(status => {
              status.style.background = '#3498db';
              status.style.color = 'white';
              status.style.padding = '6px 14px';
              status.style.borderRadius = '18px';
              status.style.fontWeight = '500';
              status.style.fontSize = '12px';
              status.style.textAlign = 'center';
              status.style.display = 'inline-block';
              status.style.marginBottom = '10px';
              status.style.boxShadow = '0 1px 3px rgba(52, 152, 219, 0.15)';
              status.style.border = 'none';
            });
            
            // Làm tinh gọn Response description
            const responseDesc = document.querySelectorAll('.response-col_description');
            responseDesc.forEach(desc => {
              desc.style.color = '#2c3e50';
              desc.style.fontWeight = '400';
              desc.style.background = '#f8f9fa';
              desc.style.padding = '10px';
              desc.style.borderRadius = '5px';
              desc.style.border = '1px solid #e1e8ed';
              desc.style.margin = '6px 0';
            });
            
            // Làm tinh gọn Response links
            const responseLinks = document.querySelectorAll('.response-col_links');
            responseLinks.forEach(link => {
              link.style.background = '#f8f9fa';
              link.style.padding = '8px';
              link.style.borderRadius = '4px';
              link.style.border = '1px solid #e1e8ed';
              link.style.margin = '5px 0';
            });
          }
          
          // Áp dụng styling mặc định
          styleResponses();
          
          // Theo dõi khi có response mới
          const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
              if (mutation.type === 'childList') {
                // Áp dụng styling cho elements mới
                setTimeout(() => {
                  styleResponses();
                }, 100);
              }
            });
          });
          
          // Bắt đầu theo dõi
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
          
          // Xử lý khi click Execute button
          document.addEventListener('click', function(e) {
            if (e.target.classList.contains('execute')) {
              // Áp dụng styling sau khi execute
              setTimeout(() => {
                styleResponses();
              }, 200);
            }
          });
        });
      `,
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