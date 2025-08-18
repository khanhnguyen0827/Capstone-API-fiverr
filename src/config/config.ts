import { 
  ENV, 
  DATABASE_CONFIG, 
  JWT_CONFIG, 
  SECURITY_CONFIG, 
  PAGINATION_CONFIG,
  RATING_CONFIG,
  API_CONFIG,
  RESPONSE_MESSAGES,
  VALIDATION_MESSAGES,
  isProduction,
  isDevelopment,
  isTest
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
   * Get API configuration
   */
  static get api() {
    return API_CONFIG;
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
   * Check if running in production mode
   */
  static get isProduction() {
    return isProduction;
  }

  /**
   * Check if running in development mode
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
   * Get all configuration as a single object
   */
  static getAll() {
    return {
      env: this.env,
      database: this.database,
      jwt: this.jwt,
      security: this.security,
      pagination: this.pagination,
      rating: this.rating,
      api: this.api,
      messages: this.messages,
      validation: this.validation,
      isProduction: this.isProduction,
      isDevelopment: this.isDevelopment,
      isTest: this.isTest,
    };
  }

  /**
   * Validate required environment variables
   */
  static validateEnv() {
    const required = ['DATABASE_URL', 'JWT_SECRET'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.warn(`⚠️  Missing required environment variables: ${missing.join(', ')}`);
      return false;
    }
    
    return true;
  }
}
