import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../../../generated/prisma';

export const AUTH_TYPE = 'authType';
export const AuthType = (...types: UserRoles[]) =>
  SetMetadata(AUTH_TYPE, types);
