export { ResponseInterceptor } from './response.interceptor';
export { ErrorInterceptor } from './error.interceptor';

// Export interceptor array for easy configuration
export const INTERCEPTOR_ORDER = [
  'error',
  'response',
] as const;

export type InterceptorOrder = typeof INTERCEPTOR_ORDER[number];
