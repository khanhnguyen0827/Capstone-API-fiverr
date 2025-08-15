import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { VALIDATION_MESSAGES } from '../constant/app.constant';

@Injectable()
export class ValidationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ValidationMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    // Validate request method
    if (!this.isValidMethod(req.method)) {
      this.logger.warn(`Invalid HTTP method: ${req.method} for ${req.originalUrl}`);
      return res.status(405).json({
        statusCode: 405,
        message: 'Method Not Allowed',
        error: `HTTP method ${req.method} is not allowed`,
      });
    }

    // Validate content type for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      if (!this.isValidContentType(req.headers['content-type'])) {
        this.logger.warn(`Invalid content type: ${req.headers['content-type']} for ${req.originalUrl}`);
        return res.status(400).json({
          statusCode: 400,
          message: VALIDATION_MESSAGES.BAD_REQUEST,
          error: 'Invalid content type. Expected application/json',
        });
      }
    }

    // Validate request size (basic check)
    const contentLength = parseInt(req.headers['content-length'] || '0');
    if (contentLength > 10 * 1024 * 1024) { // 10MB limit
      this.logger.warn(`Request too large: ${contentLength} bytes for ${req.originalUrl}`);
      return res.status(413).json({
        statusCode: 413,
        message: 'Payload Too Large',
        error: 'Request body is too large',
      });
    }

    // Validate URL length
    if (req.originalUrl.length > 2048) {
      this.logger.warn(`URL too long: ${req.originalUrl.length} characters`);
      return res.status(414).json({
        statusCode: 414,
        message: 'URI Too Long',
        error: 'Request URL is too long',
      });
    }

    next();
  }

  private isValidMethod(method: string): boolean {
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
    return validMethods.includes(method.toUpperCase());
  }

  private isValidContentType(contentType?: string): boolean {
    if (!contentType) return false;
    
    const validTypes = [
      'application/json',
      'application/x-www-form-urlencoded',
      'multipart/form-data',
      'text/plain',
    ];
    
    return validTypes.some(type => contentType.includes(type));
  }
}
