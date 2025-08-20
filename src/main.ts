
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import * as helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') ?? 3000;
  const NODE_ENV = configService.get<string>('NODE_ENV') ?? 'development';
  const logger = new Logger('Bootstrap');

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // Enable CORS
  app.enableCors({
    origin: NODE_ENV === 'production' 
      ? configService.get<string>('ALLOWED_ORIGINS')?.split(',') || []
      : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    errorHttpStatusCode: 422,
  }));

  // Swagger configuration
  if (NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Capstone API Fiverr')
      .setDescription('API backend cho ứng dụng Fiverr - Quản lý công việc freelance')
      .setVersion('1.0.0')
      .addTag('auth', 'Xác thực và phân quyền')
      .addTag('users', 'Quản lý người dùng')
      .addTag('cong-viec', 'Quản lý công việc')
      .addTag('binh-luan', 'Quản lý bình luận')
      .addTag('thue-cong-viec', 'Quản lý thuê công việc')
      .addTag('loai-cong-viec', 'Quản lý loại công việc')
      .addTag('chi-tiet-loai-cong-viec', 'Quản lý chi tiết loại công việc')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addServer(`http://localhost:${PORT}`, 'Local environment')
      .addServer(`https://api.example.com`, 'Production environment')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
      },
      customSiteTitle: 'Capstone API Documentation',
    });
  }

  // Graceful shutdown
  const gracefulShutdown = async (signal: string) => {
    logger.log(`Received ${signal}, starting graceful shutdown...`);
    await app.close();
    logger.log('Application closed');
    process.exit(0);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  await app.listen(PORT, () => {
    logger.log(`🚀 Server is running on port ${PORT}`);
    logger.log(`🌍 Environment: ${NODE_ENV}`);
    if (NODE_ENV !== 'production') {
      logger.log(`📚 Swagger documentation available at http://localhost:${PORT}/docs`);
    }
    logger.log(`🌐 CORS enabled`);
    logger.log(`📊 API versioning enabled`);
    logger.log(`🚨 Global exception filter enabled`);
    logger.log(`📝 Response interceptor enabled`);
    logger.log(`🔒 Security middleware enabled`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
