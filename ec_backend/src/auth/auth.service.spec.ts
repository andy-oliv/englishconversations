import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import User from '../entities/User';
import generateMockUser from '../helper/mocks/generateMockUser';
import Payload from '../common/types/Payload';
import { PrismaService } from '../prisma/prisma.service';
import GeneratedTokens from '../common/types/GeneratedTokens';
import { faker } from '@faker-js/faker/.';
import { Logger } from 'nestjs-pino';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import * as dayjs from 'dayjs';
import generateEmailConfirmationTemplate from '../helper/functions/templates/generateEmailConfirmation';
import ResendObject from '../common/types/ResendObject';
import generateWelcomeEmail from '../helper/functions/templates/generateWelcomeEmail';
import * as bcrypt from 'bcrypt';
import Return from '../common/types/Return';
import { randomBytes } from 'crypto';
import generateResetTemplate from '../helper/functions/templates/generatePasswordReset';

jest.mock('../helper/functions/templates/generateEmailConfirmation');
jest.mock('../helper/functions/templates/generateWelcomeEmail');
jest.mock('bcrypt');
jest.mock('../helper/functions/templates/generateResetEmail');
jest.mock('crypto');

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let logger: Logger;
  let jwtService: JwtService;
  let configService: ConfigService;
  let emailService: EmailService;
  let user: User;
  let payload: Payload;
  let tokens: GeneratedTokens;
  let hashedPassword: string;
  let token: string;
  let mockExpirationDate: string;
  let template: ResendObject;
  let error: any;
  let P2002: any;
  let mockResponse: any;
  let mockRequest: any;
  let saltRounds: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            decode: jest.fn(),
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    emailService = module.get<EmailService>(EmailService);

    user = generateMockUser();
    payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    tokens = {
      accessToken: faker.internet.jwt(),
      refreshToken: faker.internet.jwt(),
    };
    hashedPassword = faker.internet.password();
    token = faker.internet.jwt();
    mockExpirationDate = faker.date.anytime().toString();
    template = {
      from: 'mock',
      to: ['mock'],
      subject: 'mock',
      html: 'mock',
    };
    error = {
      code: 'P2025',
    };
    P2002 = {
      code: 'P2002',
    };
    mockResponse = {
      clearCookie: jest.fn(),
    };
    mockRequest = {
      user: {
        id: user.id,
      },
    };
    saltRounds = faker.number.int();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login()', () => {
    it('should log a user in', async () => {
      jest.spyOn(authService, 'loginDataVerification').mockResolvedValue(user);
      jest.spyOn(authService, 'handlePayload').mockResolvedValue(tokens);

      const result: GeneratedTokens = await authService.login(
        user.email,
        user.password,
      );

      expect(result).toMatchObject(tokens);
      expect(authService.loginDataVerification).toHaveBeenCalledWith(
        user.email,
        user.password,
      );
      expect(authService.handlePayload).toHaveBeenCalledWith(payload, user);
    });

    it('should throw InternalServerErrorException', async () => {
      jest
        .spyOn(authService, 'loginDataVerification')
        .mockRejectedValue(
          new InternalServerErrorException(httpMessages_EN.general.status_500),
        );

      await expect(
        authService.login(user.email, user.password),
      ).rejects.toThrow(InternalServerErrorException);

      expect(authService.loginDataVerification).toHaveBeenCalledWith(
        user.email,
        user.password,
      );
    });
  });

  describe('generateEmailConfirmation()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });
    it('should send an email to validate the user email account', async () => {
      const date: Date = new Date();
      jest.setSystemTime(date);
      const expirationDate: string = dayjs(date)
        .add(30, 'minute')
        .toISOString();
      let updatedUser: User = { ...user };
      updatedUser.emailVerificationToken = faker.internet.jwt();
      updatedUser.emailTokenExpires = new Date(expirationDate);

      (jwtService.signAsync as jest.Mock).mockResolvedValue(token);
      (configService.get as jest.Mock)
        .mockReturnValueOnce('mock-issuer')
        .mockReturnValueOnce('mock-expiration');
      (prismaService.user.update as jest.Mock).mockResolvedValue(updatedUser);
      (generateEmailConfirmationTemplate as jest.Mock).mockReturnValue(
        template,
      );
      (emailService.sendEmail as jest.Mock).mockResolvedValue(undefined);

      const result: { message: string } =
        await authService.generateEmailConfirmationToken(
          user.id,
          user.name,
          user.email,
          user.role,
        );

      expect(result).toMatchObject({
        message: httpMessages_EN.auth.generateEmailConfirmationToken.status_200,
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
        issuer: 'mock-issuer',
        expiresIn: 'mock-expiration',
      });
      expect(configService.get).toHaveBeenCalledTimes(2);
      expect(configService.get).toHaveBeenCalledWith('JWT_ISSUER');
      expect(configService.get).toHaveBeenCalledWith(
        'CONFIRMATION_TOKEN_EXPIRATION',
      );
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          email: user.email,
        },
        data: {
          emailVerificationToken: token,
          emailTokenExpires: expirationDate,
        },
      });
      expect(generateEmailConfirmationTemplate).toHaveBeenCalledWith(
        user.name,
        user.email,
        token,
        configService,
      );
      expect(emailService.sendEmail).toHaveBeenCalledWith(template);
    });

    it('should throw InternalServerErrorException', async () => {
      const date: Date = new Date();
      jest.setSystemTime(date);
      const expirationDate: string = dayjs(date)
        .add(30, 'minute')
        .toISOString();
      let updatedUser: User = { ...user };
      updatedUser.emailVerificationToken = faker.internet.jwt();
      updatedUser.emailTokenExpires = new Date(expirationDate);

      (jwtService.signAsync as jest.Mock).mockResolvedValue(token);
      (configService.get as jest.Mock)
        .mockReturnValueOnce('mock-issuer')
        .mockReturnValueOnce('mock-expiration');
      (prismaService.user.update as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        authService.generateEmailConfirmationToken(
          user.id,
          user.name,
          user.email,
          user.role,
        ),
      ).rejects.toThrow(InternalServerErrorException);

      expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
        issuer: 'mock-issuer',
        expiresIn: 'mock-expiration',
      });
      expect(configService.get).toHaveBeenCalledTimes(2);
      expect(configService.get).toHaveBeenCalledWith('JWT_ISSUER');
      expect(configService.get).toHaveBeenCalledWith(
        'CONFIRMATION_TOKEN_EXPIRATION',
      );
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          email: user.email,
        },
        data: {
          emailVerificationToken: token,
          emailTokenExpires: expirationDate,
        },
      });
    });
  });

  describe('emailConfirmed()', () => {
    it('should confirm an email', async () => {
      let updatedUser: User = { ...user };
      updatedUser.emailVerificationToken = faker.internet.jwt();
      updatedUser.isEmailVerified = true;

      (jwtService.verifyAsync as jest.Mock).mockResolvedValue(payload);
      (prismaService.user.update as jest.Mock).mockResolvedValue(updatedUser);
      jest.spyOn(authService, 'handlePayload').mockResolvedValue(tokens);
      (generateWelcomeEmail as jest.Mock).mockReturnValue(template);
      (emailService.sendEmail as jest.Mock).mockResolvedValue(undefined);

      const result: GeneratedTokens = await authService.emailConfirmed(token);

      expect(result).toMatchObject(tokens);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          id: payload.id,
        },
        data: {
          isEmailVerified: true,
        },
      });
      expect(authService.handlePayload).toHaveBeenCalledWith(
        {
          id: payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role,
        },
        updatedUser,
      );
      expect(generateWelcomeEmail).toHaveBeenCalledWith(
        user.name,
        user.email,
        configService,
      );
      expect(emailService.sendEmail).toHaveBeenCalledWith(template);
    });

    it('should throw BadRequestException', async () => {
      let updatedUser: User = { ...user };
      updatedUser.emailVerificationToken = faker.internet.jwt();
      updatedUser.isEmailVerified = true;

      (jwtService.verifyAsync as jest.Mock).mockResolvedValue(payload);
      (prismaService.user.update as jest.Mock).mockRejectedValue(error);

      await expect(authService.emailConfirmed(token)).rejects.toThrow(
        BadRequestException,
      );

      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          id: payload.id,
        },
        data: {
          isEmailVerified: true,
        },
      });
    });

    it('should throw InternalServerErrorException', async () => {
      let updatedUser: User = { ...user };
      updatedUser.emailVerificationToken = faker.internet.jwt();
      updatedUser.isEmailVerified = true;

      (jwtService.verifyAsync as jest.Mock).mockResolvedValue(payload);
      (prismaService.user.update as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(authService.emailConfirmed(token)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          id: payload.id,
        },
        data: {
          isEmailVerified: true,
        },
      });
    });
  });

  describe('logout()', () => {
    it('should log a user out', async () => {
      (mockResponse.clearCookie as jest.Mock)
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(null);

      const result: { message: string } =
        await authService.logout(mockResponse);

      expect(result).toMatchObject({
        message: httpMessages_EN.auth.logout.status_200,
      });
      expect(mockResponse.clearCookie).toHaveBeenCalledTimes(2);
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('ec_accessToken');
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('ec_refreshToken');
    });
  });

  describe('updatePassword()', () => {
    it('should update a password', async () => {
      jest.spyOn(authService, 'verifyToken').mockResolvedValue(undefined);
      jest.spyOn(authService, 'getSaltRounds').mockReturnValue(saltRounds);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (prismaService.user.update as jest.Mock).mockResolvedValue(user);

      const result: Return = await authService.updatePassword(
        user.email,
        user.password,
        token,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.auth.updatePassword.status_200,
        data: user,
      });
      expect(authService.verifyToken).toHaveBeenCalledWith(token, user.email);
      expect(authService.getSaltRounds).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(user.password, saltRounds);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          email: user.email,
        },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          resetPasswordExpires: null,
        },
      });
    });

    it('should throw BadRequestException', async () => {
      jest.spyOn(authService, 'verifyToken').mockResolvedValue(undefined);
      jest.spyOn(authService, 'getSaltRounds').mockReturnValue(saltRounds);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (prismaService.user.update as jest.Mock).mockRejectedValue(error);

      await expect(
        authService.updatePassword(user.email, user.password, token),
      ).rejects.toThrow(BadRequestException);

      expect(authService.verifyToken).toHaveBeenCalledWith(token, user.email);
      expect(authService.getSaltRounds).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(user.password, saltRounds);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          email: user.email,
        },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          resetPasswordExpires: null,
        },
      });
    });

    it('should throw InternalServerErrorException', async () => {
      jest.spyOn(authService, 'verifyToken').mockResolvedValue(undefined);
      jest.spyOn(authService, 'getSaltRounds').mockReturnValue(saltRounds);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (prismaService.user.update as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        authService.updatePassword(user.email, user.password, token),
      ).rejects.toThrow(InternalServerErrorException);

      expect(authService.verifyToken).toHaveBeenCalledWith(token, user.email);
      expect(authService.getSaltRounds).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(user.password, saltRounds);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          email: user.email,
        },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          resetPasswordExpires: null,
        },
      });
    });
  });

  describe('updateEmail()', () => {
    it('should update the email', async () => {
      (prismaService.user.update as jest.Mock).mockResolvedValue(user);

      const result: Return = await authService.updateEmail(
        mockRequest,
        user.email,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.auth.updateEmail.status_200,
        data: user,
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          id: mockRequest.user.id,
        },
        data: {
          email: user.email,
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.user.update as jest.Mock).mockRejectedValue(error);

      await expect(
        authService.updateEmail(mockRequest, user.email),
      ).rejects.toThrow(NotFoundException);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          id: mockRequest.user.id,
        },
        data: {
          email: user.email,
        },
      });
    });

    it('should throw BadRequestException', async () => {
      (prismaService.user.update as jest.Mock).mockRejectedValue(P2002);

      await expect(
        authService.updateEmail(mockRequest, user.email),
      ).rejects.toThrow(BadRequestException);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          id: mockRequest.user.id,
        },
        data: {
          email: user.email,
        },
      });
    });
  });

  describe('generateResetToken()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });
    it('should generate a token', async () => {
      const date: Date = new Date();
      jest.setSystemTime(date);
      const expirationDate: Date = dayjs(date).add(30, 'minute').toDate();

      (randomBytes as jest.Mock).mockReturnValue(token);
      (prismaService.user.update as jest.Mock).mockResolvedValue(user);
      (generateResetTemplate as jest.Mock).mockReturnValue(template);
      (emailService.sendEmail as jest.Mock).mockResolvedValue(undefined);

      const result: { message: string } = await authService.generateResetToken(
        user.email,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.auth.generateResetToken.status_200,
      });
      expect(randomBytes).toHaveBeenCalledWith(32);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          email: user.email,
        },
        data: {
          passwordResetToken: token,
          resetPasswordExpires: expirationDate,
        },
      });
      expect(generateResetTemplate).toHaveBeenCalledWith(
        user.email,
        token,
        configService,
      );
      expect(emailService.sendEmail).toHaveBeenCalledWith(template);
    });

    it('should throw InternalServerErrorException', async () => {
      const date: Date = new Date();
      jest.setSystemTime(date);
      const expirationDate: Date = dayjs(date).add(30, 'minute').toDate();

      (randomBytes as jest.Mock).mockReturnValue(token);
      (prismaService.user.update as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(authService.generateResetToken(user.email)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(randomBytes).toHaveBeenCalledWith(32);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          email: user.email,
        },
        data: {
          passwordResetToken: token,
          resetPasswordExpires: expirationDate,
        },
      });
    });
  });
});
