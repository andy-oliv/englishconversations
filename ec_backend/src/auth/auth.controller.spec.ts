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
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;
  let user: User;
  let loginData: { email: string; password: string };
  let mockResponse: any;
  let tokens: GeneratedTokens;
  let refreshCookieExpiration: number;
  let accessCookieExpiration: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            logout: jest.fn(),
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
    it('should register a user and log them in', async () => {
      (userService.registerUser as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.user.registerUser.status_201,
        data: user,
      });
      jest
        .spyOn(authController, 'login')
        .mockResolvedValue({ message: httpMessages_EN.auth.login.status_200 });

      const result: { message: string } = await authController.register(
        user,
        mockResponse,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.auth.login.status_200,
      });
      expect(userService.registerUser).toHaveBeenCalledWith(user);
      expect(authController.login).toHaveBeenCalledWith(
        {
          email: user.email,
          password: user.password,
        },
        mockResponse,
      );
    });

    it('should register a user and log them in', async () => {
      (userService.registerUser as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(authController.register(user, mockResponse)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(userService.registerUser).toHaveBeenCalledWith(user);
    });
  });
});
