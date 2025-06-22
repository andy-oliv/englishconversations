import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import { JwtService } from '@nestjs/jwt';
import User from '../common/types/User';
import * as bcrypt from 'bcrypt';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import Payload from '../common/types/Payload';
import GeneratedTokens from '../common/types/GeneratedTokens';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async fetchUser(id: string): Promise<User> {
    try {
      const user: User = await this.prismaService.user.findUniqueOrThrow({
        where: {
          id,
        },
      });

      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new UnauthorizedException(
          httpMessages_EN.auth.fetchUser.status_401,
        );
      }

      handleInternalErrorException(
        'authService',
        'fetchUser',
        loggerMessages.auth.fetchUser.status_500,
        this.logger,
        error,
      );
    }
  }

  async loginDataVerification(email: string, password: string) {
    try {
      const user: User = await this.prismaService.user.findUniqueOrThrow({
        where: {
          email,
        },
      });
      await this.verifyPassword(password, user.password);

      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(
          httpMessages_EN.auth.loginDataVerification.status_400,
        );
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      handleInternalErrorException(
        'authService',
        'loginDataVerification',
        loggerMessages.auth.loginDataVerification.status_500,
        this.logger,
        error,
      );
    }
  }

  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    try {
      const passwordIsValid = await bcrypt.compare(password, hashedPassword);

      if (!passwordIsValid) {
        throw new BadRequestException(
          httpMessages_EN.auth.verifyPassword.status_400,
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      handleInternalErrorException(
        'authService',
        'verifyPassword',
        loggerMessages.auth.verifyPassword.status_500,
        this.logger,
        error,
      );
    }
  }

  async addRefreshTokenToDatabase(refreshToken: string, user: User) {
    const saltRounds: number = Number(
      this.configService.get<string>('SALT_ROUNDS'),
    );
    if (!saltRounds || isNaN(saltRounds)) {
      this.logger.error(loggerMessages.auth.addRefreshTokenToDatabase.checkEnv);
      throw new InternalServerErrorException(
        httpMessages_EN.general.status_500,
      );
    }

    const hashedToken: string = await bcrypt.hash(refreshToken, saltRounds);
    try {
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          refreshToken: hashedToken,
          lastLogin: new Date(),
        },
      });
    } catch (error) {
      handleInternalErrorException(
        'authService',
        'addRefreshTokenToDatabase',
        loggerMessages.auth.addRefreshTokenToDatabase.status_500,
        this.logger,
        error,
      );
    }
  }

  async generateAccessToken(payload: Payload): Promise<string> {
    try {
      const accessToken: string = await this.jwtService.signAsync(payload, {
        issuer: this.configService.get<string>('JWT_ISSUER'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
      });

      return accessToken;
    } catch (error) {
      handleInternalErrorException(
        'authService',
        'generateAccessToken',
        loggerMessages.auth.generateAccessToken.status_500,
        this.logger,
        error,
      );
    }
  }

  async generateRefreshToken(payload: Payload): Promise<string> {
    try {
      const refreshToken: string = await this.jwtService.signAsync(payload, {
        issuer: this.configService.get<string>('JWT_ISSUER'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
      });

      return refreshToken;
    } catch (error) {
      handleInternalErrorException(
        'authService',
        'generateRefreshToken',
        loggerMessages.auth.generateRefreshToken.status_500,
        this.logger,
        error,
      );
    }
  }

  async validateAccessToken(token: string): Promise<Payload> {
    const validatedToken = await this.jwtService.verifyAsync(token);
    if (!validatedToken) {
      throw new UnauthorizedException(
        httpMessages_EN.auth.validateAccessToken.status_401,
      );
    }

    try {
      const data: Payload = await this.jwtService.decode(token);
      await this.fetchUser(data.id);

      const payload: Payload = {
        id: data.id,
        name: data.name,
        role: data.role,
        email: data.email,
      };

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      handleInternalErrorException(
        'authService',
        'validateAccessToken',
        loggerMessages.auth.validateAccessToken.status_500,
        this.logger,
        error,
      );
    }
  }

  async validateRefreshToken(token: string): Promise<Payload> {
    const validatedToken = await this.jwtService.verifyAsync(token);
    if (!validatedToken) {
      throw new UnauthorizedException(
        httpMessages_EN.auth.validateRefreshToken.status_401,
      );
    }
    try {
      const data: Payload = await this.jwtService.decode(token);
      const user: User = await this.fetchUser(data.id);
      const isValid: boolean = await bcrypt.compare(token, user.refreshToken);

      if (!isValid) {
        throw new UnauthorizedException(
          httpMessages_EN.auth.validateRefreshToken.status_401,
        );
      }

      const payload: Payload = {
        id: data.id,
        name: data.name,
        role: data.role,
        email: data.email,
      };

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      handleInternalErrorException(
        'authService',
        'validateRefreshToken',
        loggerMessages.auth.validateRefreshToken.status_500,
        this.logger,
        error,
      );
    }
  }

  async handlePayload(payload: Payload, user: User): Promise<GeneratedTokens> {
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);
    await this.addRefreshTokenToDatabase(refreshToken, user);

    return { accessToken, refreshToken };
  }

  async login(email: string, password: string): Promise<GeneratedTokens> {
    const user = await this.loginDataVerification(email, password);

    try {
      const payload: Payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const tokens: GeneratedTokens = await this.handlePayload(payload, user);

      return tokens;
    } catch (error) {
      handleInternalErrorException(
        'authService',
        'login',
        loggerMessages.auth.login.status_500,
        this.logger,
        error,
      );
    }
  }

  async logout(response: Response): Promise<{ message: string }> {
    try {
      response.clearCookie('ec_accessToken');
      response.clearCookie('ec_refreshToken');

      return { message: httpMessages_EN.auth.logout.status_200 };
    } catch (error) {
      handleInternalErrorException(
        'authService',
        'logout',
        loggerMessages.auth.logout.status_500,
        this.logger,
        error,
      );
    }
  }
}
