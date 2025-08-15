import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { 
  SWAGGER_CONFIG, 
  API_CONFIG, 
  ENV,
  validateConfig
} from './common/constant/app.constant';
import { ResponseInterceptor, ErrorInterceptor } from './common/interceptor';

async function bootstrap() {
  // Validate configuration
  const configValidation = validateConfig();
  if (!configValidation.isValid) {
    console.warn('⚠️  Configuration validation failed. Some features may not work properly.');
  }

  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix(API_CONFIG.globalPrefix);

  // Global pipes
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    errorHttpStatusCode: 422,
  }));

  // Global interceptors
  app.useGlobalInterceptors(
    new ErrorInterceptor(),
    new ResponseInterceptor(),
  );

  // Swagger configuration (only if enabled)
  if (SWAGGER_CONFIG.enabled) {
    const config = new DocumentBuilder()
      .setTitle(SWAGGER_CONFIG.title)
      .setDescription(SWAGGER_CONFIG.description)
      .setVersion(SWAGGER_CONFIG.version)
      .addBearerAuth()
      .addTag('Authentication', 'Xác thực người dùng')
      .addTag('Users', 'Quản lý người dùng')
      .addTag('Jobs', 'Quản lý công việc')
      .addTag('Comments', 'Quản lý bình luận')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(SWAGGER_CONFIG.path, app, document, {
      swaggerOptions: { 
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
      },
    });
  }

  const PORT = ENV.PORT;
  const logger = new Logger('Bootstrap');
  
  await app.listen(PORT, () => {
    logger.log(`🚀 Server running on port ${PORT}`);
    logger.log(`🌍 Environment: ${ENV.NODE_ENV}`);
    logger.log(`📚 API Base URL: http://localhost:${PORT}/${API_CONFIG.globalPrefix}`);
    
    if (SWAGGER_CONFIG.enabled) {
      logger.log(`📖 Swagger documentation: http://localhost:${PORT}/${SWAGGER_CONFIG.path}`);
    }
    
    if (configValidation.isValid) {
      logger.log(`✅ Configuration validated successfully`);
    } else {
      logger.warn(`⚠️  Configuration issues detected: ${configValidation.missing.join(', ')}`);
    }
    
    logger.log(`🛡️  Security middleware enabled`);
    logger.log(`📊 Rate limiting: ${ENV.API_RATE_LIMIT} requests per ${ENV.API_RATE_LIMIT_WINDOW / 1000}s`);
    logger.log(`🔄 Response formatting enabled`);
    logger.log(`❌ Error handling enabled`);
  });
}

bootstrap();



