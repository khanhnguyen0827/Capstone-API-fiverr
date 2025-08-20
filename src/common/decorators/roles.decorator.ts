import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// Predefined roles
export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  FREELANCER: 'FREELANCER',
  CLIENT: 'CLIENT',
} as const;
