import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import RequestWithUser from '../../../common/types/RequestWithUser';
import { Logger } from 'nestjs-pino';
import loggerMessages from '../../../helper/messages/loggerMessages';
import httpMessages_EN from '../../../helper/messages/httpMessages.en';

@Injectable()
export class SelfGuard implements CanActivate {
  constructor(private readonly logger: Logger) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: RequestWithUser = context
      .switchToHttp()
      .getRequest<RequestWithUser>();

    if (request.user.role === 'STUDENT') {
      //replacing userId params with the user's own id to prevent access to other users' information
      request.params.id = request.user.id;
      return true;
    }

    if (request.user.role === 'ADMIN') {
      return true;
    }

    this.logger.warn(loggerMessages.selfGuard.status_403);
    throw new ForbiddenException(httpMessages_EN.selfGuard.status_403);
  }
}
