import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import { JwtService } from '@nestjs/jwt';
import User from '../entities/User';
import * as bcrypt from 'bcrypt';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import Payload from '../common/types/Payload';
import GeneratedTokens from '../common/types/GeneratedTokens';
import { ConfigService } from '@nestjs/config';
import { response, Response } from 'express';
import * as dayjs from 'dayjs';
import Return from '../common/types/Return';
import { randomBytes } from 'crypto';
import generateExceptionMessage from '../helper/functions/generateExceptionMessage';
import { EmailService } from '../email/email.service';
import ResendObject from '../common/types/ResendObject';
import generateEmailConfirmationTemplate from '../helper/functions/templates/generateEmailConfirmation';
import { UserRoles } from '../../generated/prisma';
import generateWelcomeEmail from '../helper/functions/templates/generateWelcomeEmail';
import generatePasswordResetEmailTemplate from '../helper/functions/templates/generatePasswordReset';
import generateEmailResetTemplate from '../helper/functions/templates/generateEmailReset';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async emailConfirmed(token: string): Promise<GeneratedTokens> {
    try {
      const payload: Payload = await this.jwtService.verifyAsync(token);
      const user: User = await this.prismaService.user.update({
        where: {
          id: payload.id,
        },
        data: {
          emailVerificationToken: null,
          emailTokenExpires: null,
          isEmailVerified: true,
        },
      });
      const tokens: GeneratedTokens = await this.handlePayload(
        {
          id: payload.id,
          name: payload.name,
          email: payload.email,
          avatarUrl: payload.avatarUrl,
          role: payload.role,
        },
        user,
      );

      const template: ResendObject = generateWelcomeEmail(
        user.name,
        user.email,
        this.configService,
      );
      this.emailService.sendEmail(template);

      return tokens;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(
          httpMessages_EN.auth.emailConfirmed.status_400,
        );
      }

      handleInternalErrorException(
        'authService',
        'emailConfirmed',
        loggerMessages.auth.emailConfirmed.status_500,
        this.logger,
        error,
      );
    }
  }

  async generateEmailConfirmationToken(
    id: string,
    name: string,
    email: string,
    avatarUrl: string,
    role: UserRoles,
  ): Promise<{ message: string }> {
    try {
      const payload: Payload = {
        id,
        name,
        email,
        avatarUrl,
        role,
      };

      const expirationDate: string = dayjs().add(30, 'minute').toISOString();

      const token: string = await this.jwtService.signAsync(payload, {
        issuer: this.configService.get<string>('JWT_ISSUER'),
        expiresIn: this.configService.get<string>(
          'CONFIRMATION_TOKEN_EXPIRATION',
        ),
      });

      await this.prismaService.user.update({
        where: {
          email,
        },
        data: {
          emailVerificationToken: token,
          emailTokenExpires: expirationDate,
        },
      });
      const template: ResendObject = generateEmailConfirmationTemplate(
        name,
        email,
        token,
        this.configService,
      );
      await this.emailService.sendEmail(template);

      return {
        message: httpMessages_EN.auth.generateEmailConfirmationToken.status_200,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.log({
          message: generateExceptionMessage(
            'authService',
            'generateEmailConfirmationToken',
            loggerMessages.auth.generateEmailConfirmationToken.status_404,
          ),
          data: {
            email,
          },
        });
        //intentionally returning 200 to avoid exposing an email
        return {
          message:
            httpMessages_EN.auth.generateEmailConfirmationToken.status_200,
        };
      }

      handleInternalErrorException(
        'authService',
        'generateEmailConfirmationToken',
        loggerMessages.auth.generateEmailConfirmationToken.status_500,
        this.logger,
        error,
      );
    }
  }

  async validateEmailJwt(token: string): Promise<string> {
    try {
      const payload: { currentEmail: string; updatedEmail: string } =
        await this.jwtService.verifyAsync(token, {
          issuer: this.configService.get<string>('JWT_ISSUER'),
        });

      const user: User = await this.prismaService.user.findFirstOrThrow({
        where: {
          email: payload.currentEmail,
        },
      });

      const validToken = await bcrypt.compare(
        token,
        user.emailVerificationToken,
      );

      if (!validToken) {
        throw new BadRequestException(
          httpMessages_EN.auth.validateEmailJwt.status_400,
        );
      }

      return payload.updatedEmail;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.auth.validateEmailJwt.status_404,
        );
      }

      if (
        error.message === 'jwt expired' ||
        error.message === 'invalid token'
      ) {
        throw new BadRequestException(
          httpMessages_EN.auth.validateEmailJwt.status_400,
        );
      }

      handleInternalErrorException(
        'authService',
        'validateEmailJwt',
        loggerMessages.auth.validateEmailJwt.status_500,
        this.logger,
        error,
      );
    }
  }

  async generateEmailJwt(
    currentEmail: string,
    updatedEmail: string,
  ): Promise<{ jwt: string; hash: string }> {
    try {
      const payload = {
        currentEmail,
        updatedEmail,
      };

      const token: string = await this.jwtService.signAsync(payload, {
        issuer: this.configService.get<string>('JWT_ISSUER'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
      });

      const saltRounds = Number(this.configService.get<string>('SALT_ROUNDS'));

      const hash: string = await bcrypt.hash(
        token,
        isNaN(saltRounds) ? 12 : saltRounds,
      );

      return { jwt: token, hash };
    } catch (error) {
      handleInternalErrorException(
        'authService',
        'generateEmailJwt',
        loggerMessages.auth.generateEmailJwt.status_500,
        this.logger,
        error,
      );
    }
  }

  async checkEmailExists(email: string): Promise<void> {
    try {
      const emailInUse: User = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });

      if (emailInUse) {
        throw new ConflictException(
          httpMessages_EN.auth.checkEmailExists.status_409,
        );
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      handleInternalErrorException(
        'authService',
        'checkEmailExists',
        loggerMessages.auth.checkEmailExists.status_500,
        this.logger,
        error,
      );
    }
  }

  async generateEmailResetToken(
    currentEmail: string,
    updatedEmail: string,
  ): Promise<{ message: string }> {
    try {
      await this.checkEmailExists(updatedEmail);
      const token: { jwt: string; hash: string } = await this.generateEmailJwt(
        currentEmail,
        updatedEmail,
      );

      await this.prismaService.user.update({
        where: {
          email: currentEmail,
        },
        data: {
          emailVerificationToken: token.hash,
          emailTokenExpires: dayjs().add(30, 'minutes').toDate(),
        },
      });
      const template: ResendObject = generateEmailResetTemplate(
        updatedEmail,
        token.jwt,
        this.configService,
      );
      await this.emailService.sendEmail(template);

      return {
        message: httpMessages_EN.auth.generateEmailResetToken.status_200,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      if (error.code === 'P2025') {
        this.logger.log({
          message: generateExceptionMessage(
            'authService',
            'generateEmailResetToken',
            loggerMessages.auth.generateEmailResetToken.status_404,
          ),
          data: {
            email: currentEmail,
          },
        });
        throw new NotFoundException(
          httpMessages_EN.auth.generateEmailResetToken.status_404,
        );
      }

      handleInternalErrorException(
        'authService',
        'generateEmailResetToken',
        loggerMessages.auth.generateEmailResetToken.status_500,
        this.logger,
        error,
      );
    }
  }

  async generatePasswordResetToken(
    email: string,
  ): Promise<{ message: string }> {
    try {
      const token: string = randomBytes(32).toString('hex');
      const expirationDate: Date = dayjs().add(30, 'minute').toDate();
      await this.prismaService.user.update({
        where: {
          email,
        },
        data: {
          passwordResetToken: token,
          resetPasswordExpires: expirationDate,
        },
      });
      const template: ResendObject = generatePasswordResetEmailTemplate(
        email,
        token,
        this.configService,
      );
      await this.emailService.sendEmail(template);

      return {
        message: httpMessages_EN.auth.generatePasswordResetToken.status_200,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.log({
          message: generateExceptionMessage(
            'authService',
            'generatePasswordResetToken',
            loggerMessages.auth.generatePasswordResetToken.status_404,
          ),
          data: {
            email,
          },
        });
        //intentionally returning 200 to avoid exposing an email
        return {
          message: httpMessages_EN.auth.generatePasswordResetToken.status_200,
        };
      }

      handleInternalErrorException(
        'authService',
        'generatePasswordResetToken',
        loggerMessages.auth.generatePasswordResetToken.status_500,
        this.logger,
        error,
      );
    }
  }

  getSaltRounds(): number {
    const saltRounds: number = Number(
      this.configService.get<string>('SALT_ROUNDS'),
    );
    if (!saltRounds || isNaN(saltRounds)) {
      this.logger.error(loggerMessages.auth.getSaltRounds.checkEnv);
      throw new InternalServerErrorException(
        httpMessages_EN.general.status_500,
      );
    }

    return saltRounds;
  }

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

  async adminVerification(
    email: string,
    password: string,
    ipAddress: string,
  ): Promise<User> {
    try {
      const user: User = await this.prismaService.user.findFirstOrThrow({
        where: {
          AND: [{ email }, { role: 'ADMIN' }],
        },
      });
      await this.verifyPassword(password, user.password);

      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn({
          message: generateExceptionMessage(
            'authService',
            'adminVerification',
            loggerMessages.auth.adminVerification.status_400,
          ),
          data: {
            email,
            ipAddress,
          },
        });

        throw new BadRequestException(
          httpMessages_EN.auth.adminVerification.status_400,
        );
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      handleInternalErrorException(
        'authService',
        'adminVerification',
        loggerMessages.auth.adminVerification.status_500,
        this.logger,
        error,
      );
    }
  }

  async loginDataVerification(email: string, password: string): Promise<User> {
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
    const saltRounds: number = this.getSaltRounds();

    const hashedToken: string = await bcrypt.hash(refreshToken, saltRounds);
    try {
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          refreshToken: hashedToken,
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

  async updateLastLogin(user: User): Promise<void> {
    try {
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          lastLogin: new Date(),
        },
      });
    } catch (error) {
      handleInternalErrorException(
        'authService',
        'updateLastLogin',
        loggerMessages.auth.updateLastLogin.status_500,
        this.logger,
        error,
      );
    }
  }

  async generateAdminAccessToken(payload: Payload): Promise<string> {
    try {
      const accessToken: string = await this.jwtService.signAsync(payload, {
        issuer: this.configService.get<string>('JWT_ADMIN_ISSUER'),
        expiresIn: this.configService.get<string>(
          'ADMIN_ACCESS_TOKEN_EXPIRATION',
        ),
      });

      return accessToken;
    } catch (error) {
      handleInternalErrorException(
        'authService',
        'generateAdminAccessToken',
        loggerMessages.auth.generateAdminAccessToken.status_500,
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

  async validateAdminAccessToken(token: string): Promise<Payload> {
    try {
      const data: Payload = await this.jwtService.verifyAsync(token);
      await this.fetchUser(data.id);

      const payload: Payload = {
        id: data.id,
        name: data.name,
        role: data.role,
        avatarUrl: data.avatarUrl,
        email: data.email,
      };

      return payload;
    } catch (error) {
      if (
        error.name === 'TokenExpiredError' ||
        error.name === 'JsonWebTokenError'
      ) {
        throw new UnauthorizedException(
          httpMessages_EN.auth.validateAdminAccessToken.status_401,
        );
      }

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      handleInternalErrorException(
        'authService',
        'validateAdminAccessToken',
        loggerMessages.auth.validateAccessToken.status_500,
        this.logger,
        error,
      );
    }
  }

  async validateAccessToken(token: string): Promise<Payload> {
    try {
      const data: Payload = await this.jwtService.verifyAsync(token);
      await this.fetchUser(data.id);

      const payload: Payload = {
        id: data.id,
        name: data.name,
        role: data.role,
        avatarUrl: data.avatarUrl,
        email: data.email,
      };

      return payload;
    } catch (error) {
      if (
        error.name === 'TokenExpiredError' ||
        error.name === 'JsonWebTokenError'
      ) {
        throw new UnauthorizedException(
          httpMessages_EN.auth.validateAccessToken.status_401,
        );
      }

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
    try {
      const data: Payload = await this.jwtService.verifyAsync(token);
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
        avatarUrl: data.avatarUrl,
        email: data.email,
      };

      return payload;
    } catch (error) {
      if (
        error.name === 'TokenExpiredError' ||
        error.name === 'JsonWebTokenError'
      ) {
        throw new UnauthorizedException(
          httpMessages_EN.auth.validateRefreshToken.status_401,
        );
      }
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

  async handleAdminPayload(payload: Payload, user: User): Promise<string> {
    const accessToken = await this.generateAdminAccessToken(payload);
    await this.updateLastLogin(user);
    await this.prismaService.loginLog.create({
      data: {
        userId: user.id,
        loggedAt: dayjs().toDate(),
      },
    });
    return accessToken;
  }

  async handlePayload(payload: Payload, user: User): Promise<GeneratedTokens> {
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);
    await this.addRefreshTokenToDatabase(refreshToken, user);
    await this.updateLastLogin(user);
    await this.prismaService.loginLog.create({
      data: {
        userId: user.id,
        loggedAt: dayjs().toDate(),
      },
    });

    return { accessToken, refreshToken };
  }

  async verifyEmailToken(token: string, email: string): Promise<void> {
    try {
      const user: User = await this.prismaService.user.findFirstOrThrow({
        where: {
          AND: [{ email: email }, { emailVerificationToken: token }],
        },
      });

      const currentDate: dayjs.Dayjs = dayjs();
      const tokenExpirationDate: dayjs.Dayjs = dayjs(user.emailTokenExpires);

      if (currentDate.isAfter(tokenExpirationDate)) {
        throw new BadRequestException(
          httpMessages_EN.auth.verifyToken.status_400,
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error.code === 'P2025') {
        this.logger.log({
          message: generateExceptionMessage(
            'authService',
            'verifyEmailToken',
            loggerMessages.auth.verifyToken.status_404,
          ),
          data: {
            email,
            token,
          },
        });
        throw new BadRequestException(
          httpMessages_EN.auth.verifyToken.status_400,
        );
      }

      handleInternalErrorException(
        'authService',
        'verifyEmailToken',
        loggerMessages.auth.verifyToken.status_500,
        this.logger,
        error,
      );
    }
  }

  async verifyToken(token: string, email: string): Promise<void> {
    try {
      const user: User = await this.prismaService.user.findFirstOrThrow({
        where: {
          AND: [{ email: email }, { passwordResetToken: token }],
        },
      });

      const currentDate: dayjs.Dayjs = dayjs();
      const tokenExpirationDate: dayjs.Dayjs = dayjs(user.resetPasswordExpires);

      if (currentDate.isAfter(tokenExpirationDate)) {
        throw new BadRequestException(
          httpMessages_EN.auth.verifyToken.status_400,
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error.code === 'P2025') {
        this.logger.log({
          message: generateExceptionMessage(
            'authService',
            'verifyToken',
            loggerMessages.auth.verifyToken.status_404,
          ),
          data: {
            email,
            token,
          },
        });
        throw new BadRequestException(
          httpMessages_EN.auth.verifyToken.status_400,
        );
      }

      handleInternalErrorException(
        'authService',
        'verifyToken',
        loggerMessages.auth.verifyToken.status_500,
        this.logger,
        error,
      );
    }
  }

  async adminLogin(
    email: string,
    password: string,
    ipAddress: string,
  ): Promise<string> {
    const user = await this.adminVerification(email, password, ipAddress);

    try {
      const payload: Payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
      };

      const token: string = await this.handleAdminPayload(payload, user);

      return token;
    } catch (error) {
      handleInternalErrorException(
        'authService',
        'adminLogin',
        loggerMessages.auth.login.status_500,
        this.logger,
        error,
      );
    }
  }

  async login(email: string, password: string): Promise<GeneratedTokens> {
    const user = await this.loginDataVerification(email, password);

    try {
      const payload: Payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
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
      response.clearCookie('ec_admin_access');

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

  async updateEmail(
    email: string,
    token: string,
    response: Response,
  ): Promise<Return> {
    const updatedEmail: string = await this.validateEmailJwt(token);

    try {
      const updatedUser: User = await this.prismaService.user.update({
        where: {
          email: email,
        },
        data: {
          email: updatedEmail,
          emailVerificationToken: null,
          emailTokenExpires: null,
        },
      });

      response.clearCookie('ec_accessToken');
      response.clearCookie('ec_refreshToken');
      response.clearCookie('ec_admin_access');

      return {
        message: httpMessages_EN.auth.updateEmail.status_200,
        data: updatedUser,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.auth.updateEmail.status_404,
        );
      }

      handleInternalErrorException(
        'authService',
        'updateEmail',
        loggerMessages.auth.updateEmail.status_500,
        this.logger,
        error,
      );
    }
  }

  async updatePassword(
    email: string,
    updatedPassword: string,
    token: string,
    response: Response,
  ): Promise<Return> {
    await this.verifyToken(token, email);

    const saltRounds: number = this.getSaltRounds();

    const hashedPassword: string = await bcrypt.hash(
      updatedPassword,
      saltRounds,
    );

    try {
      const updatedUser: User = await this.prismaService.user.update({
        where: {
          email,
        },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          resetPasswordExpires: null,
        },
      });

      response.clearCookie('ec_accessToken');
      response.clearCookie('ec_refreshToken');
      response.clearCookie('ec_admin_access');
      return {
        message: httpMessages_EN.auth.updatePassword.status_200,
        data: updatedUser,
      };
    } catch (error) {
      //purposely throwing a BadRequestException to avoid exposing that the user was not found
      if (error.code === 'P2025') {
        this.logger.log({
          message: generateExceptionMessage(
            'authService',
            'updatePassword',
            loggerMessages.auth.updatePassword.status_404,
          ),
          data: {
            email,
          },
        });

        throw new BadRequestException(
          httpMessages_EN.auth.updatePassword.status_400,
        );
      }

      handleInternalErrorException(
        'authService',
        'updatePassword',
        loggerMessages.auth.updatePassword.status_500,
        this.logger,
        error,
      );
    }
  }
}
