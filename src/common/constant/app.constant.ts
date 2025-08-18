import "dotenv/config";

// Environment variables
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'mysql://root:123456@localhost:3307/capstone_fiverr',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
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
} as const;

// Pagination constants
export const PAGINATION_CONFIG = {
  defaultPage: 1,
  defaultSize: 10,
  maxSize: 100,
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
  min: 1,
  max: 5,
} as const;

// API endpoints
export const API_CONFIG = {
  prefix: 'api',
  version: 'v1',
  globalPrefix: 'api/v1',
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
  BAD_REQUEST: 'Dữ liệu không hợp lệ',
} as const;

// Export environment check helper
export const isProduction = ENV.NODE_ENV === 'production';
export const isDevelopment = ENV.NODE_ENV === 'development';
export const isTest = ENV.NODE_ENV === 'test';
