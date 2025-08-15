import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RESPONSE_MESSAGES } from '../constant/app.constant';

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  method: string;
  details?: any;
}

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const { method, url } = request;

    return next.handle().pipe(
      catchError(error => {
        // Log the error
        this.logger.error(
          `Error in ${method} ${url}: ${error.message}`,
          error.stack,
        );

        // Format error response
        const errorResponse: ErrorResponse = {
          statusCode: error.status || 500,
          message: error.message || RESPONSE_MESSAGES.INTERNAL_ERROR,
          error: error.error || 'Internal Server Error',
          timestamp: new Date().toISOString(),
          path: url,
          method: method.toUpperCase(),
        };

        // Add validation errors if available
        if (error.response && Array.isArray(error.response.message)) {
          errorResponse.details = error.response.message;
          errorResponse.message = RESPONSE_MESSAGES.VALIDATION_ERROR;
        }

        // Add additional error details for development
        if (process.env.NODE_ENV === 'development') {
          errorResponse.details = {
            stack: error.stack,
            name: error.name,
            code: error.code,
          };
        }

        return throwError(() => ({
          ...error,
          response: errorResponse,
        }));
      }),
    );
  }
}
