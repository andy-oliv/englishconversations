import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import loggerMessages from '../../../helper/messages/loggerMessages';
import httpMessages_EN from '../../../helper/messages/httpMessages.en';
import Cookies from '../../../common/types/cookies';
import getCookies from '../../../helper/functions/getCookies';
import { AuthService } from '../../auth.service';
import Payload from '../../../common/types/Payload';
import AuthSocket from '../../../common/types/AuthSocket';

@Injectable()
export class WebsocketGuard implements CanActivate {
  constructor(
    private readonly logger: Logger,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: AuthSocket = context.switchToWs().getClient<AuthSocket>();
    const cookieHeader = client.handshake.headers.cookie;

    if (!cookieHeader) {
      this.logger.log(loggerMessages.authGuard.userWithoutCredentials);
      throw new UnauthorizedException(httpMessages_EN.authGuard.status_401);
    }

    const cookies: Cookies = getCookies(cookieHeader);

    if (cookies.ec_admin_access) {
      const payload: Payload = await this.authService.validateAdminAccessToken(
        cookies.ec_admin_access,
      );

      client.user = payload;

      this.logger.log(loggerMessages.authGuard.userHasAdminToken);

      return true;
    }

    if (cookies.ec_accessToken) {
      const payload: Payload = await this.authService.validateAccessToken(
        cookies.ec_accessToken,
      );

      client.user = payload;

      this.logger.log(loggerMessages.authGuard.userHasAccessToken);

      return true;
    }

    if (cookies.ec_refreshToken) {
      this.logger.log(loggerMessages.authGuard.userHasRefreshToken);

      client.emit('refresh_required');
      throw new UnauthorizedException('Access token expired');
    }

    this.logger.log(loggerMessages.authGuard.userWithoutCredentials);
    throw new UnauthorizedException(httpMessages_EN.authGuard.status_401);
  }
}
