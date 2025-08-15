import { 
  ENV, 
  DATABASE_CONFIG, 
  JWT_CONFIG, 
  SECURITY_CONFIG, 
  PAGINATION_CONFIG,
  RATING_CONFIG,
  FILE_UPLOAD_CONFIG,
  API_CONFIG,
  SWAGGER_CONFIG,
  RESPONSE_MESSAGES,
  VALIDATION_MESSAGES,
  LOG_CONFIG,
  CACHE_CONFIG,
  isProduction,
  isDevelopment,
  isTest,
  validateConfig
} from '../common/constant/app.constant';

/**
 * Configuration class that provides access to all application constants
 * and environment variables in a type-safe way
 */
export class AppConfig {
  /**
   * Get all environment variables
   */
  static get env() {
    return ENV;
  }

  /**
   * Get database configuration
   */
  static get database() {
    return DATABASE_CONFIG;
  }

  /**
   * Get JWT configuration
   */
  static get jwt() {
    return JWT_CONFIG;
  }

  /**
   * Get security configuration
   */
  static get security() {
    return SECURITY_CONFIG;
  }

  /**
   * Get pagination configuration
   */
  static get pagination() {
    return PAGINATION_CONFIG;
  }

  /**
   * Get rating configuration
   */
  static get rating() {
    return RATING_CONFIG;
  }

  /**
   * Get file upload configuration
   */
  static get fileUpload() {
    return FILE_UPLOAD_CONFIG;
  }

  /**
   * Get API configuration
   */
  static get api() {
    return API_CONFIG;
  }

  /**
   * Get Swagger configuration
   */
  static get swagger() {
    return SWAGGER_CONFIG;
  }

  /**
   * Get response messages
   */
  static get messages() {
    return RESPONSE_MESSAGES;
  }

  /**
   * Get validation messages
   */
  static get validation() {
    return VALIDATION_MESSAGES;
  }

  /**
   * Get logging configuration
   */
  static get logging() {
    return LOG_CONFIG;
  }

  /**
   * Get cache configuration
   */
  static get cache() {
    return CACHE_CONFIG;
  }

  /**
   * Check if running in production
   */
  static get isProduction() {
    return isProduction;
  }

  /**
   * Check if running in development
   */
  static get isDevelopment() {
    return isDevelopment;
  }

  /**
   * Check if running in test mode
   */
  static get isTest() {
    return isTest;
  }

  /**
   * Validate configuration
   */
  static validate() {
    return validateConfig();
  }

  /**
   * Get configuration summary
   */
  static getSummary() {
    return {
      environment: ENV.NODE_ENV,
      port: ENV.PORT,
      database: {
        name: DATABASE_CONFIG.name,
        pool: DATABASE_CONFIG.pool,
        timeout: DATABASE_CONFIG.timeout,
      },
      jwt: {
        expiresIn: JWT_CONFIG.expiresIn,
        algorithm: JWT_CONFIG.algorithm,
      },
      security: {
        bcryptRounds: SECURITY_CONFIG.bcryptRounds,
        corsOrigin: SECURITY_CONFIG.corsOrigin,
        rateLimit: SECURITY_CONFIG.rateLimit,
      },
      api: {
        prefix: API_CONFIG.prefix,
        version: API_CONFIG.version,
        globalPrefix: API_CONFIG.globalPrefix,
      },
      swagger: {
        enabled: SWAGGER_CONFIG.enabled,
        path: SWAGGER_CONFIG.path,
      },
      pagination: PAGINATION_CONFIG,
      rating: RATING_CONFIG,
      fileUpload: {
        maxSize: FILE_UPLOAD_CONFIG.maxSize,
        allowedTypes: FILE_UPLOAD_CONFIG.allowedImageTypes,
        uploadPath: FILE_UPLOAD_CONFIG.uploadPath,
      },
    };
  }

  /**
   * Get configuration for specific environment
   */
  static getEnvironmentConfig() {
    if (isProduction) {
      return {
        cors: { origin: false }, // Disable CORS in production
        swagger: false, // Disable Swagger in production
        logging: 'error',
        cache: { ttl: 600 }, // 10 minutes in production
      };
    }

    if (isDevelopment) {
      return {
        cors: { origin: '*' },
        swagger: true,
        logging: 'debug',
        cache: { ttl: 60 }, // 1 minute in development
      };
    }

    if (isTest) {
      return {
        cors: { origin: '*' },
        swagger: false,
        logging: 'warn',
        cache: { ttl: 0 }, // No cache in test
      };
    }

    return {};
  }
}

// Export default instance
export default AppConfig;
