
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ENV } from '../constant/app.constant';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, ip, headers } = req;
    const userAgent = headers['user-agent'] || 'Unknown';

    // Log request
    this.logger.log(
      `📥 ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`
    );

    // Override res.end to log response
    const originalEnd = res.end;
    const self = this; // Capture this context
    res.end = function(chunk?: any, encoding?: any): Response {
      const endTime = Date.now();
      const duration = endTime - startTime;
      const { statusCode } = res;

      // Log response
      const logLevel = statusCode >= 400 ? 'error' : 'log';
      const emoji = statusCode >= 400 ? '❌' : '✅';
      
      self.logger[logLevel](
        `${emoji} ${method} ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms`
      );

      // Call original end and return response
      return originalEnd.call(this, chunk, encoding);
    };

    next();
  }
}
