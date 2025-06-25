import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import RequestWithUser from '../../../common/types/RequestWithUser';
import { AuthService } from '../../auth.service';
import User from '../../../entities/User';
import httpMessages_EN from '../../../helper/messages/httpMessages.en';
import loggerMessages from '../../../helper/messages/loggerMessages';
import { Logger } from 'nestjs-pino';
import generateExceptionMessage from '../../../helper/functions/generateExceptionMessage';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';

@Injectable()
export class EmailValidationGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: RequestWithUser = context
      .switchToHttp()
      .getRequest<RequestWithUser>();

    const user: User = await this.authService.fetchUser(request.user.id);

    if (user.isEmailVerified) {
      return true;
    }
    this.logger.warn({
      message: generateExceptionMessage(
        'emailValidationGuard',
        'canActivate',
        loggerMessages.emailValidationGuard.status_401,
      ),
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
    throw new UnauthorizedException(
      httpMessages_EN.emailValidationGuard.status_401,
    );
  }
}
