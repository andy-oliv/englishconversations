import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRoles } from '../../../../generated/prisma';
import RequestWithUser from '../../../common/types/RequestWithUser';
import httpMessages_EN from '../../../helper/messages/httpMessages.en';
import { Logger } from 'nestjs-pino';
import loggerMessages from '../../../helper/messages/loggerMessages';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly logger: Logger) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: RequestWithUser = context
      .switchToHttp()
      .getRequest<RequestWithUser>();
    const role: UserRoles = request.user.role;

    if (role === 'ADMIN') {
      return true;
    }

    this.logger.warn(loggerMessages.authRole.status_403);

    throw new ForbiddenException(httpMessages_EN.authRole.status_403);
  }
}
