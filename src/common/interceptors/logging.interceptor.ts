import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, ip } = request;
    const userAgent = request.headers['user-agent'] || 'Unknown';
    const startTime = Date.now();

    this.logger.log(
      `🚀 ${method} ${url} - ${ip} - ${userAgent}`,
    );

    return next.handle().pipe(
      tap((data) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        this.logger.log(
          `✅ ${method} ${url} - ${response.statusCode} - ${duration}ms`,
        );
      }),
      catchError((error) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        this.logger.error(
          `❌ ${method} ${url} - ${error.status || 500} - ${duration}ms - ${error.message}`,
        );
        
        throw error;
      }),
    );
  }
}
