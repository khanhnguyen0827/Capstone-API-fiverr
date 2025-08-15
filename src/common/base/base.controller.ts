import { HttpStatus } from '@nestjs/common';
import { RESPONSE_MESSAGES } from '../constant/app.constant';

export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  content: T;
  timestamp: string;
  path: string;
  method: string;
  pagination?: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

export abstract class BaseController {
  protected createSuccessResponse<T>(
    data: T,
    message: string = RESPONSE_MESSAGES.SUCCESS,
    statusCode: number = HttpStatus.OK,
    pagination?: any
  ): ApiResponse<T> {
    return {
      statusCode,
      message,
      content: data,
      timestamp: new Date().toISOString(),
      path: '', // Will be set by interceptor
      method: '', // Will be set by interceptor
      ...(pagination && { pagination }),
    };
  }

  protected createCreatedResponse<T>(
    data: T,
    message: string = RESPONSE_MESSAGES.CREATED
  ): ApiResponse<T> {
    return this.createSuccessResponse(data, message, HttpStatus.CREATED);
  }

  protected createUpdatedResponse<T>(
    data: T,
    message: string = RESPONSE_MESSAGES.UPDATED
  ): ApiResponse<T> {
    return this.createSuccessResponse(data, message, HttpStatus.OK);
  }

  protected createDeletedResponse(
    message: string = RESPONSE_MESSAGES.DELETED
  ): ApiResponse<{ message: string }> {
    return this.createSuccessResponse(
      { message },
      message,
      HttpStatus.OK
    );
  }

  protected createPaginatedResponse<T>(
    data: T[],
    pagination: {
      page: number;
      size: number;
      total: number;
      totalPages: number;
      hasNext?: boolean;
      hasPrev?: boolean;
    },
    message: string = RESPONSE_MESSAGES.SUCCESS
  ): ApiResponse<{ data: T[]; pagination: any }> {
    return this.createSuccessResponse(
      { data, pagination },
      message,
      HttpStatus.OK,
      pagination
    );
  }
}
