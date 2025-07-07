import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../../../generated/prisma';

export const AUTH_TYPE = 'authType';
export const AuthType = (type: UserRoles) => SetMetadata(AUTH_TYPE, type);
