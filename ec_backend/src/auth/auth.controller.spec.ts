import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import User from '../entities/User';
import generateMockUser from '../helper/mocks/generateMockUser';
import GeneratedTokens from '../common/types/GeneratedTokens';
import { faker } from '@faker-js/faker/.';
import { UserService } from '../user/user.service';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import Return from '../common/types/Return';
import RequestWithUser from '../common/types/RequestWithUser';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;
  let user: User;
  let loginData: { email: string; password: string };
  let mockResponse: any;
  let mockRequest: RequestWithUser;
  let tokens: GeneratedTokens;
  let refreshCookieExpiration: number;
  let accessCookieExpiration: number;
  let emailToken: string;
  let mockToken: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            logout: jest.fn(),
            generateEmailConfirmationToken: jest.fn(),
            emailConfirmed: jest.fn(),
            updatePassword: jest.fn(),
            updateEmail: jest.fn(),
            generateResetToken: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            registerUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    user = generateMockUser();
    loginData = {
      email: user.email,
      password: user.password,
    };
    tokens = {
      accessToken: faker.internet.jwt(),
      refreshToken: faker.internet.jwt(),
    };
    refreshCookieExpiration = 1000 * 60 * 60 * 24 * 30;
    accessCookieExpiration = 1000 * 60 * 30;
    mockResponse = {
      cookie: jest.fn(),
    };
    emailToken = faker.internet.jwt();
    mockToken = faker.internet.jwt();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login()', () => {
    it('should log user in', async () => {
      (authService.login as jest.Mock).mockResolvedValue(tokens);
      const result: { message: string } = await authController.login(
        loginData,
        mockResponse,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.auth.login.status_200,
      });
      expect(authService.login).toHaveBeenCalledWith(
        loginData.email,
        loginData.password,
      );
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'ec_refreshToken',
        tokens.refreshToken,
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: refreshCookieExpiration,
        }),
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'ec_accessToken',
        tokens.accessToken,
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: accessCookieExpiration,
        }),
      );
    });

    it('should throw ConflictException', async () => {
      (authService.login as jest.Mock).mockRejectedValue(
        new ConflictException(
          httpMessages_EN.user.validateUserAvailability.status_409,
        ),
      );

      await expect(
        authController.login(loginData, mockResponse),
      ).rejects.toThrow(ConflictException);

      expect(authService.login).toHaveBeenCalledWith(
        loginData.email,
        loginData.password,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (authService.login as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        authController.login(loginData, mockResponse),
      ).rejects.toThrow(InternalServerErrorException);

      expect(authService.login).toHaveBeenCalledWith(
        loginData.email,
        loginData.password,
      );
    });
  });

  describe('logout()', () => {
    it('should log a user out', async () => {
      (authService.logout as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.auth.logout.status_200,
      });

      const result: { message: string } =
        await authController.logout(mockResponse);

      expect(result).toMatchObject({
        message: httpMessages_EN.auth.logout.status_200,
      });
      expect(authService.logout).toHaveBeenCalledWith(mockResponse);
    });

    it('should throw InternalServerErrorException', async () => {
      (authService.logout as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(authController.logout(mockResponse)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(authService.logout).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('register()', () => {
    it('should register a user and send confirmation email', async () => {
      (userService.registerUser as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.user.registerUser.status_201,
        data: user,
      });
      (
        authService.generateEmailConfirmationToken as jest.Mock
      ).mockResolvedValue({
        message: httpMessages_EN.auth.generateEmailConfirmationToken.status_200,
      });

      const result: { message: string } = await authController.register(
        user,
        mockResponse,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.auth.generateEmailConfirmationToken.status_200,
      });
      expect(userService.registerUser).toHaveBeenCalledWith(user);
      expect(authService.generateEmailConfirmationToken).toHaveBeenCalledWith(
        user.id,
        user.name,
        user.email,
        user.role,
      );
    });

    it('should throw ConflictException', async () => {
      (userService.registerUser as jest.Mock).mockRejectedValue(
        new ConflictException(
          httpMessages_EN.user.validateUserAvailability.status_409,
        ),
      );

      await expect(authController.register(user, mockResponse)).rejects.toThrow(
        ConflictException,
      );
      expect(userService.registerUser).toHaveBeenCalledWith(user);
    });

    it('should throw InternalServerErrorException', async () => {
      (userService.registerUser as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(authController.register(user, mockResponse)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(userService.registerUser).toHaveBeenCalledWith(user);
    });
  });

  describe('emailConfirmed()', () => {
    it('should validate a token sent by email to validate the user email', async () => {
      (authService.emailConfirmed as jest.Mock).mockResolvedValue(tokens);

      const result: { message: string } = await authController.emailConfirmed(
        { token: emailToken },
        mockResponse,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.auth.login.status_200,
      });
      expect(authService.emailConfirmed).toHaveBeenCalledWith(emailToken);
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'ec_refreshToken',
        tokens.refreshToken,
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: refreshCookieExpiration,
        }),
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'ec_accessToken',
        tokens.accessToken,
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: accessCookieExpiration,
        }),
      );
    });

    it('should throw BadRequestException', async () => {
      (authService.emailConfirmed as jest.Mock).mockRejectedValue(
        new BadRequestException(httpMessages_EN.auth.emailConfirmed.status_400),
      );

      await expect(
        authController.emailConfirmed({ token: emailToken }, mockResponse),
      ).rejects.toThrow(BadRequestException);

      expect(authService.emailConfirmed).toHaveBeenCalledWith(emailToken);
    });

    it('should throw InternalServerErrorException', async () => {
      (authService.emailConfirmed as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        authController.emailConfirmed({ token: emailToken }, mockResponse),
      ).rejects.toThrow(InternalServerErrorException);

      expect(authService.emailConfirmed).toHaveBeenCalledWith(emailToken);
    });
  });

  describe('updatePassword()', () => {
    it('should update a password', async () => {
      (authService.updatePassword as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.auth.updatePassword.status_200,
        data: user,
      });

      const result: Return = await authController.updatePassword(
        {
          token: mockToken,
        },
        user,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.auth.updatePassword.status_200,
        data: user,
      });
      expect(authService.updatePassword).toHaveBeenCalledWith(
        user.email,
        user.password,
        mockToken,
      );
    });

    it('should throw BadRequestException', async () => {
      (authService.updatePassword as jest.Mock).mockRejectedValue(
        new BadRequestException(httpMessages_EN.auth.updatePassword.status_400),
      );

      await expect(
        authController.updatePassword(
          {
            token: mockToken,
          },
          user,
        ),
      ).rejects.toThrow(BadRequestException);

      expect(authService.updatePassword).toHaveBeenCalledWith(
        user.email,
        user.password,
        mockToken,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (authService.updatePassword as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        authController.updatePassword(
          {
            token: mockToken,
          },
          user,
        ),
      ).rejects.toThrow(InternalServerErrorException);

      expect(authService.updatePassword).toHaveBeenCalledWith(
        user.email,
        user.password,
        mockToken,
      );
    });
  });

  describe('updateEmail()', () => {
    it('should update an email', async () => {
      (authService.updateEmail as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.auth.updateEmail.status_200,
        data: user,
      });

      const result: Return = await authController.updateEmail(
        mockRequest,
        user,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.auth.updateEmail.status_200,
        data: user,
      });
      expect(authService.updateEmail).toHaveBeenCalledWith(
        mockRequest,
        user.email,
      );
    });

    it('should throw BadRequestException', async () => {
      (authService.updateEmail as jest.Mock).mockRejectedValue(
        new BadRequestException(httpMessages_EN.auth.updateEmail.status_400),
      );

      await expect(
        authController.updateEmail(mockRequest, user),
      ).rejects.toThrow(BadRequestException);

      expect(authService.updateEmail).toHaveBeenCalledWith(
        mockRequest,
        user.email,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (authService.updateEmail as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        authController.updateEmail(mockRequest, user),
      ).rejects.toThrow(InternalServerErrorException);

      expect(authService.updateEmail).toHaveBeenCalledWith(
        mockRequest,
        user.email,
      );
    });
  });

  describe('GenerateResetToken()', () => {
    it('should generate password resetToken', async () => {
      (authService.generateResetToken as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.auth.generateResetToken.status_200,
      });

      const result: { message: string } =
        await authController.generateResetToken(user);

      expect(result).toMatchObject({
        message: httpMessages_EN.auth.generateResetToken.status_200,
      });
      expect(authService.generateResetToken).toHaveBeenCalledWith(user.email);
    });

    it('should throw InternalServerErrorException', async () => {
      (authService.generateResetToken as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(authController.generateResetToken(user)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(authService.generateResetToken).toHaveBeenCalledWith(user.email);
    });
  });
});
