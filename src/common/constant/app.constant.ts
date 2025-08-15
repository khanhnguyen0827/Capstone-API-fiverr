import "dotenv/config";

// Environment variables
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/capstone_fiverr',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  API_RATE_LIMIT: parseInt(process.env.API_RATE_LIMIT || '100', 10),
  API_RATE_LIMIT_WINDOW: parseInt(process.env.API_RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  SWAGGER_ENABLED: process.env.SWAGGER_ENABLED === 'true' || process.env.NODE_ENV !== 'production',
} as const;

// Application constants
export const APP_NAME = 'Capstone Fiverr API';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'API cho nền tảng Fiverr-like với NestJS và Prisma';

// Database constants
export const DATABASE_NAME = 'capstone_fiverr';
export const DATABASE_CONFIG = {
  url: ENV.DATABASE_URL,
  name: DATABASE_NAME,
  pool: {
    min: parseInt(process.env.DB_POOL_MIN || '2', 10),
    max: parseInt(process.env.DB_POOL_MAX || '10', 10),
  },
  timeout: parseInt(process.env.DB_TIMEOUT || '30000', 10), // 30 seconds
} as const;

// JWT constants
export const JWT_CONFIG = {
  secret: ENV.JWT_SECRET,
  expiresIn: ENV.JWT_EXPIRES_IN,
  refreshSecret: ENV.JWT_REFRESH_SECRET,
  refreshExpiresIn: ENV.JWT_REFRESH_EXPIRES_IN,
  algorithm: 'HS256' as const,
} as const;

// Security constants
export const SECURITY_CONFIG = {
  bcryptRounds: ENV.BCRYPT_ROUNDS,
  corsOrigin: ENV.CORS_ORIGIN,
  rateLimit: {
    limit: ENV.API_RATE_LIMIT,
    windowMs: ENV.API_RATE_LIMIT_WINDOW,
  },
} as const;

// Pagination constants
export const PAGINATION_CONFIG = {
  defaultPage: parseInt(process.env.DEFAULT_PAGE || '1', 10),
  defaultSize: parseInt(process.env.DEFAULT_SIZE || '10', 10),
  maxSize: parseInt(process.env.MAX_SIZE || '100', 10),
} as const;

// User roles
export const USER_ROLES = {
  USER: 'user',
  FREELANCER: 'freelancer',
  CLIENT: 'client',
  ADMIN: 'admin'
} as const;

// Gender options
export const GENDER_OPTIONS = ['Nam', 'Nữ', 'Khác'] as const;

// Rating constants
export const RATING_CONFIG = {
  min: parseInt(process.env.MIN_RATING || '1', 10),
  max: parseInt(process.env.MAX_RATING || '5', 10),
} as const;

// File upload constants
export const FILE_UPLOAD_CONFIG = {
  maxSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  allowedImageTypes: (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(','),
  uploadPath: process.env.UPLOAD_PATH || 'uploads',
} as const;

// API endpoints
export const API_CONFIG = {
  prefix: process.env.API_PREFIX || 'api',
  version: process.env.API_VERSION || 'v1',
  globalPrefix: `${process.env.API_PREFIX || 'api'}/${process.env.API_VERSION || 'v1'}`,
} as const;

// Swagger constants
export const SWAGGER_CONFIG = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  version: APP_VERSION,
  path: process.env.SWAGGER_PATH || 'api-docs',
  enabled: ENV.SWAGGER_ENABLED,
} as const;

// Response messages
export const RESPONSE_MESSAGES = {
  SUCCESS: 'Thành công',
  CREATED: 'Tạo thành công',
  UPDATED: 'Cập nhật thành công',
  DELETED: 'Xóa thành công',
  NOT_FOUND: 'Không tìm thấy',
  UNAUTHORIZED: 'Chưa đăng nhập',
  FORBIDDEN: 'Không có quyền truy cập',
  BAD_REQUEST: 'Dữ liệu không hợp lệ',
  INTERNAL_ERROR: 'Lỗi hệ thống',
  VALIDATION_ERROR: 'Lỗi validation',
  RATE_LIMIT_EXCEEDED: 'Quá giới hạn request',
} as const;

// Validation messages
export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email không được để trống',
  EMAIL_INVALID: 'Email không hợp lệ',
  PASSWORD_REQUIRED: 'Mật khẩu không được để trống',
  PASSWORD_MIN_LENGTH: 'Mật khẩu phải có ít nhất 6 ký tự',
  NAME_REQUIRED: 'Tên không được để trống',
  PHONE_INVALID: 'Số điện thoại không hợp lệ',
  RATING_RANGE: `Số sao phải từ ${RATING_CONFIG.min}-${RATING_CONFIG.max}`,
  FILE_SIZE_EXCEEDED: `Kích thước file không được vượt quá ${FILE_UPLOAD_CONFIG.maxSize / 1024 / 1024}MB`,
  FILE_TYPE_NOT_ALLOWED: 'Loại file không được hỗ trợ',
} as const;

// Logging constants
export const LOG_CONFIG = {
  level: ENV.LOG_LEVEL,
  format: process.env.LOG_FORMAT || 'json',
  timestamp: process.env.LOG_TIMESTAMP === 'true',
} as const;

// Cache constants
export const CACHE_CONFIG = {
  ttl: parseInt(process.env.CACHE_TTL || '300', 10), // 5 minutes
  max: parseInt(process.env.CACHE_MAX || '100', 10),
} as const;

// Export environment check helper
export const isProduction = ENV.NODE_ENV === 'production';
export const isDevelopment = ENV.NODE_ENV === 'development';
export const isTest = ENV.NODE_ENV === 'test';

// Export configuration validation
export const validateConfig = () => {
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Missing required environment variables: ${missingVars.join(', ')}`);
    console.warn('Using default values. Please check your .env file.');
  }
  
  return {
    isValid: missingVars.length === 0,
    missing: missingVars,
  };
};
