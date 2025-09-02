import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from 'nestjs-pino';
import Cookies from '../../../common/types/cookies';
import getCookies from '../../../helper/functions/getCookies';
import { AuthService } from '../../auth.service';
import Payload from '../../../common/types/Payload';
import loggerMessages from '../../../helper/messages/loggerMessages';
import httpMessages_EN from '../../../helper/messages/httpMessages.en';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';
import RequestWithUser from '../../../common/types/RequestWithUser';
import { AUTH_TYPE } from '../../../common/decorators/authType.decorator';
import { UserRoles } from '../../../../generated/prisma';
import * as cookie from 'cookie';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly logger: Logger,
    private readonly authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      AUTH_TYPE,
      [context.getHandler(), context.getClass()],
    );

    const request: RequestWithUser = context
      .switchToHttp()
      .getRequest<RequestWithUser>();
    const response: Response = context.switchToHttp().getResponse();

    if (!request.headers.cookie) {
      this.logger.log(loggerMessages.authGuard.userWithoutCredentials);
      throw new UnauthorizedException(httpMessages_EN.authGuard.status_401);
    }

    const cookies: Cookies = getCookies(request.headers.cookie);

    if (cookies.ec_admin_access && requiredRoles.includes('ADMIN')) {
      const adminCookie: Record<string, string> = cookie.parse(
        request.headers.cookie,
      );

      if (adminCookie) {
        const payload: Payload =
          await this.authService.validateAdminAccessToken(
            adminCookie.ec_admin_access,
          );

        request.user = payload;

        this.logger.log(loggerMessages.authGuard.userHasAdminToken);

        return true;
      }
    }

    if (cookies.ec_accessToken && requiredRoles.includes('STUDENT')) {
      const payload: Payload = await this.authService.validateAccessToken(
        cookies.ec_accessToken,
      );

      request.user = payload;

      this.logger.log(loggerMessages.authGuard.userHasAccessToken);

      return true;
    }

    if (cookies.ec_refreshToken && requiredRoles.includes('STUDENT')) {
      const payload: Payload = await this.authService.validateRefreshToken(
        cookies.ec_refreshToken,
      );
      const accessToken: string =
        await this.authService.generateAccessToken(payload);
      const accessCookieExpiration: number = 1000 * 60 * 30; //30 minutes

      response.cookie('ec_accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: accessCookieExpiration,
      });

      request.user = payload;

      this.logger.log(loggerMessages.authGuard.userHasRefreshToken);

      return true;
    }

    this.logger.log(loggerMessages.authGuard.userWithoutCredentials);
    throw new UnauthorizedException(httpMessages_EN.authGuard.status_401);
  }
}
