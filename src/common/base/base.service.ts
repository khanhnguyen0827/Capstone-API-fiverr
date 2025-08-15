import { Logger } from '@nestjs/common';
import { PAGINATION_CONFIG } from '../../constant/app.constant';

export abstract class BaseService {
  protected readonly logger: Logger;

  constructor(serviceName: string) {
    this.logger = new Logger(serviceName);
  }

  protected validatePagination(page?: number, size?: number) {
    const validPage = Math.max(1, page || PAGINATION_CONFIG.defaultPage);
    const validSize = Math.min(
      Math.max(1, size || PAGINATION_CONFIG.defaultSize),
      PAGINATION_CONFIG.maxSize
    );

    return {
      page: validPage,
      size: validSize,
      skip: (validPage - 1) * validSize,
    };
  }

  protected createPaginationInfo(
    page: number,
    size: number,
    total: number
  ) {
    return {
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
      hasNext: page < Math.ceil(total / size),
      hasPrev: page > 1,
    };
  }

  protected logOperation(operation: string, details?: any) {
    this.logger.log(`${operation} - ${JSON.stringify(details || {})}`);
  }

  protected logError(operation: string, error: any) {
    this.logger.error(`${operation} failed: ${error.message}`, error.stack);
  }
}
