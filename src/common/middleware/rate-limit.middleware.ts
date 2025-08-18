import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RESPONSE_MESSAGES } from '../constant/app.constant';

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
  
  // Rate limit configuration
  private readonly limit = 100; // requests per window
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes

  use(req: Request, res: Response, next: NextFunction) {
    const clientId = this.getClientId(req);
    const now = Date.now();

    // Clean up expired entries
    this.cleanupExpiredEntries(now);

    // Get or create client record
    if (!this.store[clientId]) {
      this.store[clientId] = {
        count: 0,
        resetTime: now + this.windowMs,
      };
    }

    const client = this.store[clientId];

    // Check if window has expired
    if (now > client.resetTime) {
      client.count = 0;
      client.resetTime = now + this.windowMs;
    }

    // Check rate limit
    if (client.count >= this.limit) {
      this.logger.warn(`Rate limit exceeded for client: ${clientId}`);
      
      res.status(429).json({
        statusCode: 429,
        message: 'Quá giới hạn request',
        error: 'Too Many Requests',
        retryAfter: Math.ceil((client.resetTime - now) / 1000),
      });
      return;
    }

    // Increment counter
    client.count++;

    // Add rate limit headers
    res.header('X-RateLimit-Limit', this.limit.toString());
    res.header('X-RateLimit-Remaining', (this.limit - client.count).toString());
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
