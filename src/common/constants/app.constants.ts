export const APP_CONSTANTS = {
  // Database
  DATABASE: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },

  // JWT
  JWT: {
    DEFAULT_EXPIRES_IN: '1d',
    REFRESH_EXPIRES_IN: '7d',
  },

  // Roles
  ROLES: {
    ADMIN: 'ADMIN',
    USER: 'USER',
    FREELANCER: 'FREELANCER',
    CLIENT: 'CLIENT',
  },

  // Job Status
  JOB_STATUS: {
    AVAILABLE: 'AVAILABLE',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
  },

  // Hire Status
  HIRE_STATUS: {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
  },

  // File Upload
  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
    UPLOAD_PATH: 'uploads/',
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  // Validation
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 50,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    EMAIL_MAX_LENGTH: 255,
    PHONE_MAX_LENGTH: 20,
  },
} as const;
