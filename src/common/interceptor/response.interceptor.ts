import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGES } from '../constant/app.constant';

export interface Response<T> {
  statusCode: number;
  message: string;
  content: T;
  timestamp: string;
  path: string;
  method: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    
    const { method, url } = request;
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map(data => {
        // If data already has the expected format, return as is
        if (data && typeof data === 'object' && 'statusCode' in data) {
          return {
            ...data,
            timestamp: new Date().toISOString(),
            path: url,
            method: method.toUpperCase(),
          };
        }

        // Format the response
        let message: string = RESPONSE_MESSAGES.SUCCESS;
        let content = data;

        // Determine message based on HTTP method and status
        if (method === 'POST' && statusCode === 201) {
          message = RESPONSE_MESSAGES.CREATED;
        } else if (method === 'PUT' && statusCode === 200) {
          message = RESPONSE_MESSAGES.UPDATED;
        } else if (method === 'DELETE' && statusCode === 200) {
          message = RESPONSE_MESSAGES.DELETED;
        }

        // Handle special cases
        if (data && typeof data === 'object' && 'message' in data) {
          message = data.message as string;
          content = data.content || data.data || data;
        }

        return {
          statusCode,
          message,
          content,
          timestamp: new Date().toISOString(),
          path: url,
          method: method.toUpperCase(),
        };
      }),
    );
  }
}
