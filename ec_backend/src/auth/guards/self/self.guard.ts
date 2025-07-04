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
      if (
        request.params?.id !== undefined &&
        request.params?.id !== request.user.id
      ) {
        request.params.id = request.user.id;

        this.logger.warn({
          message: loggerMessages.selfGuard.warn,
          requestOrigin: {
            id: request.user.id,
            name: request.user.name,
            email: request.user.email,
            role: request.user.role,
          },
        });
      }

      if (
        request.params?.userId !== undefined &&
        request.params?.userId !== request.user.id
      ) {
        request.params.userId = request.user.id;

        this.logger.warn({
          message: loggerMessages.selfGuard.warn,
          requestOrigin: {
            id: request.user.id,
            name: request.user.name,
            email: request.user.email,
            role: request.user.role,
          },
        });
      }

      if (
        request.body?.userId !== undefined &&
        request.body?.userId !== request.user.id
      ) {
        request.body.userId = request.user.id;

        this.logger.warn({
          message: loggerMessages.selfGuard.warn,
          requestOrigin: {
            id: request.user.id,
            name: request.user.name,
            email: request.user.email,
            role: request.user.role,
          },
        });
      }

      if (
        request.query?.userId !== undefined &&
        request.query?.userId !== request.user.id
      ) {
        request.query.userId = request.user.id;

        this.logger.warn({
          message: loggerMessages.selfGuard.warn,
          requestOrigin: {
            id: request.user.id,
            name: request.user.name,
            email: request.user.email,
            role: request.user.role,
          },
        });
      }

      return true;
    }

    if (request.user.role === 'ADMIN') {
      return true;
    }

    this.logger.warn(loggerMessages.selfGuard.status_403);
    throw new ForbiddenException(httpMessages_EN.selfGuard.status_403);
  }
}
