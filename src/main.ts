import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 3000;
  const logger = new Logger('Bootstrap');

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Capstone API Fiverr')
    .setDescription('API backend cho ứng dụng Fiverr clone')
    .setVersion('1.0')
    .addTag('auth', 'Xác thực và phân quyền')
    .addTag('users', 'Quản lý người dùng')
    .addTag('cong-viec', 'Quản lý công việc')
    .addTag('binh-luan', 'Quản lý bình luận')
    .addTag('thue-cong-viec', 'Quản lý thuê công việc')
    .addTag('loai-cong-viec', 'Quản lý loại công việc')
    .addTag('chi-tiet-loai-cong-viec', 'Quản lý chi tiết loại công việc')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(PORT, () => {
    logger.log(`Server is running on port ${PORT}`);
    logger.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
  });
}
bootstrap();
