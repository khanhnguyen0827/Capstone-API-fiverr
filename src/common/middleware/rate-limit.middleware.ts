import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SECURITY_CONFIG, RESPONSE_MESSAGES } from '../constant/app.constant';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RateLimitMiddleware.name);
  private store: RateLimitStore = {};

  use(req: Request, res: Response, next: NextFunction) {
    const clientId = this.getClientId(req);
    const now = Date.now();
    const windowMs = SECURITY_CONFIG.rateLimit.windowMs;
    const limit = SECURITY_CONFIG.rateLimit.limit;

    // Clean up expired entries
    this.cleanupExpiredEntries(now);

    // Get or create client record
    if (!this.store[clientId]) {
      this.store[clientId] = {
        count: 0,
        resetTime: now + windowMs,
      };
    }

    const client = this.store[clientId];

    // Check if window has expired
    if (now > client.resetTime) {
      client.count = 0;
      client.resetTime = now + windowMs;
    }

    // Check rate limit
    if (client.count >= limit) {
      this.logger.warn(`Rate limit exceeded for client: ${clientId}`);
      
      res.status(429).json({
        statusCode: 429,
        message: RESPONSE_MESSAGES.RATE_LIMIT_EXCEEDED,
        error: 'Too Many Requests',
        retryAfter: Math.ceil((client.resetTime - now) / 1000),
      });
      return;
    }

    // Increment counter
    client.count++;

    // Add rate limit headers
    res.header('X-RateLimit-Limit', limit.toString());
    res.header('X-RateLimit-Remaining', (limit - client.count).toString());
    res.header('X-RateLimit-Reset', new Date(client.resetTime).toISOString());

    next();
  }

  private getClientId(req: Request): string {
    // Use IP address as client identifier
    // In production, you might want to use a more sophisticated method
    return req.ip || req.connection.remoteAddress || 'unknown';
  }

  private cleanupExpiredEntries(now: number): void {
    Object.keys(this.store).forEach(key => {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    });
  }
}
