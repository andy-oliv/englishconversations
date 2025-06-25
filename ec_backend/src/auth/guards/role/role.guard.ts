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
import generateExceptionMessage from '../../../helper/functions/generateExceptionMessage';

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

    this.logger.warn({
      message: generateExceptionMessage(
        'roleGuard',
        'canActivate',
        loggerMessages.authRole.status_403,
      ),
      data: {
        id: request.user.id,
        name: request.user.name,
        email: request.user.email,
      },
    });

    throw new ForbiddenException(httpMessages_EN.authRole.status_403);
  }
}
