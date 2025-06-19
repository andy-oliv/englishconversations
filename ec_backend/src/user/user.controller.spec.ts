import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import User from '../common/types/User';
import generateMockUser from '../helper/mocks/generateMockUser';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import Return from '../common/types/Return';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let user: User;
  let users: User[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            registerUser: jest.fn(),
            fetchUsers: jest.fn(),
            fetchUserById: jest.fn(),
            fetchUserByEmail: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    user = generateMockUser();
    users = [generateMockUser(), generateMockUser()];
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('registerUser()', () => {
    it('should register a new user', async () => {
      (userService.registerUser as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.user.registerUser.status_201,
        data: user,
      });

      const result: Return = await userController.registerUser(user);

      expect(result).toMatchObject({
        message: httpMessages_EN.user.registerUser.status_201,
        data: user,
      });
      expect(userService.registerUser).toHaveBeenCalledWith(user);
    });

    it('should throw ConflictException', async () => {
      (userService.registerUser as jest.Mock).mockRejectedValue(
        new ConflictException(
          httpMessages_EN.user.validateUserAvailability.status_409,
        ),
      );

      await expect(userController.registerUser(user)).rejects.toThrow(
        ConflictException,
      );
      expect(userService.registerUser).toHaveBeenCalledWith(user);
    });

    it('should throw InternalServerErrorException', async () => {
      (userService.registerUser as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(userController.registerUser(user)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(userService.registerUser).toHaveBeenCalledWith(user);
    });
  });

  describe('fetchUsers()', () => {
    it('should fetch users', async () => {
      (userService.fetchUsers as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.user.fetchUsers.status_200,
        data: users,
      });

      const result: Return = await userController.fetchUsers();

      expect(result).toMatchObject({
        message: httpMessages_EN.user.fetchUsers.status_200,
        data: users,
      });
      expect(userService.fetchUsers).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (userService.fetchUsers as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.user.fetchUsers.status_404),
      );

      await expect(userController.fetchUsers()).rejects.toThrow(
        NotFoundException,
      );
      expect(userService.fetchUsers).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException', async () => {
      (userService.fetchUsers as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(userController.fetchUsers()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(userService.fetchUsers).toHaveBeenCalled();
    });
  });

  describe('fetchUserById()', () => {
    it('should fetch user', async () => {
      (userService.fetchUserById as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.user.fetchUserById.status_200,
        data: user,
      });

      const result: Return = await userController.fetchUserById(user.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.user.fetchUserById.status_200,
        data: user,
      });
      expect(userService.fetchUserById).toHaveBeenCalledWith(user.id);
    });

    it('should throw NotFoundException', async () => {
      (userService.fetchUserById as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.user.fetchUserById.status_404),
      );

      await expect(userController.fetchUserById(user.id)).rejects.toThrow(
        NotFoundException,
      );
      expect(userService.fetchUserById).toHaveBeenCalledWith(user.id);
    });

    it('should throw InternalServerErrorException', async () => {
      (userService.fetchUserById as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(userController.fetchUserById(user.id)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(userService.fetchUserById).toHaveBeenCalledWith(user.id);
    });
  });

  describe('fetchUserByEmail()', () => {
    it('should fetch user', async () => {
      (userService.fetchUserByEmail as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.user.fetchUserByEmail.status_200,
        data: user,
      });

      const result: Return = await userController.fetchUserByEmail({
        email: user.email,
      });

      expect(result).toMatchObject({
        message: httpMessages_EN.user.fetchUserByEmail.status_200,
        data: user,
      });
      expect(userService.fetchUserByEmail).toHaveBeenCalledWith(user.email);
    });

    it('should throw NotFoundException', async () => {
      (userService.fetchUserByEmail as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.user.fetchUserByEmail.status_404),
      );

      await expect(
        userController.fetchUserByEmail({
          email: user.email,
        }),
      ).rejects.toThrow(NotFoundException);
      expect(userService.fetchUserByEmail).toHaveBeenCalledWith(user.email);
    });

    it('should throw InternalServerErrorException', async () => {
      (userService.fetchUserByEmail as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userController.fetchUserByEmail({
          email: user.email,
        }),
      ).rejects.toThrow(InternalServerErrorException);
      expect(userService.fetchUserByEmail).toHaveBeenCalledWith(user.email);
    });
  });

  describe('updateUser()', () => {
    it('should fetch user', async () => {
      (userService.updateUser as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.user.updateUser.status_200,
        data: user,
      });

      const result: Return = await userController.updateUser(user.id, user);

      expect(result).toMatchObject({
        message: httpMessages_EN.user.updateUser.status_200,
        data: user,
      });
      expect(userService.updateUser).toHaveBeenCalledWith(user.id, user);
    });

    it('should throw NotFoundException', async () => {
      (userService.updateUser as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.user.updateUser.status_404),
      );

      await expect(userController.updateUser(user.id, user)).rejects.toThrow(
        NotFoundException,
      );
      expect(userService.updateUser).toHaveBeenCalledWith(user.id, user);
    });

    it('should throw InternalServerErrorException', async () => {
      (userService.updateUser as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(userController.updateUser(user.id, user)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(userService.updateUser).toHaveBeenCalledWith(user.id, user);
    });
  });

  describe('deleteUser()', () => {
    it('should fetch user', async () => {
      (userService.deleteUser as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.user.deleteUser.status_200,
        data: user,
      });

      const result: Return = await userController.deleteUser(user.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.user.deleteUser.status_200,
        data: user,
      });
      expect(userService.deleteUser).toHaveBeenCalledWith(user.id);
    });

    it('should throw NotFoundException', async () => {
      (userService.deleteUser as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.user.deleteUser.status_404),
      );

      await expect(userController.deleteUser(user.id)).rejects.toThrow(
        NotFoundException,
      );
      expect(userService.deleteUser).toHaveBeenCalledWith(user.id);
    });

    it('should throw InternalServerErrorException', async () => {
      (userService.deleteUser as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(userController.deleteUser(user.id)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(userService.deleteUser).toHaveBeenCalledWith(user.id);
    });
  });
});
