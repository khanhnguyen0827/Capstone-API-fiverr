import { Module } from '@nestjs/common';
import { 
  LoggerMiddleware, 
  CorsMiddleware, 
  RateLimitMiddleware, 
  SecurityMiddleware, 
  ValidationMiddleware 
} from './index';

@Module({
  providers: [
    LoggerMiddleware,
    CorsMiddleware,
    RateLimitMiddleware,
    SecurityMiddleware,
    ValidationMiddleware,
  ],
  exports: [
    LoggerMiddleware,
    CorsMiddleware,
    RateLimitMiddleware,
    SecurityMiddleware,
    ValidationMiddleware,
  ],
})
export class MiddlewareModule {}
