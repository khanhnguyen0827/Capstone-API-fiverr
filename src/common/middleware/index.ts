export { LoggerMiddleware } from './logger.middleware';
export { CorsMiddleware } from './cors.middleware';
export { RateLimitMiddleware } from './rate-limit.middleware';
export { SecurityMiddleware } from './security.middleware';
export { ValidationMiddleware } from './validation.middleware';

// Export middleware array for easy configuration
export const MIDDLEWARE_ORDER = [
  'security',
  'cors',
  'rateLimit',
  'validation',
  'logger',
] as const;

export type MiddlewareOrder = typeof MIDDLEWARE_ORDER[number];
