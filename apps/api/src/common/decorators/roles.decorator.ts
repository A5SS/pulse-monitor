import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@pulse-monitor/shared';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

