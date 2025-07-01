import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import User from '../entities/User';
import generateMockUser from '../helper/mocks/generateMockUser';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import Return from '../common/types/Return';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import FormHandlerReturn from '../common/types/FormHandlerReturn';
import FormDataHandler from '../helper/functions/formDataHandler';
import { S3Service } from '../s3/s3.service';
import { Logger } from 'nestjs-pino';
import RegisterUserDTO from './dto/registerUser.dto';
import updateFormHandler from '../helper/functions/templates/updateFormHandler';
import UpdateUserDTO from './dto/updateUser.dto';

jest.mock('../helper/functions/formDataHandler');
jest.mock('../helper/functions/templates/updateFormHandler');

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let s3Service: S3Service;
  let logger: Logger;
  let user: User;
  let users: User[];
  let file: Express.Multer.File;
  let validatedUser: FormHandlerReturn;
  let metadata: string;

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
        {
          provide: S3Service,
          useValue: {},
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    s3Service = module.get<S3Service>(S3Service);
    logger = module.get<Logger>(Logger);
    user = generateMockUser();
    users = [generateMockUser(), generateMockUser()];
    file = {
      fieldname: 'file',
      originalname: 'test.jpeg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
      buffer: Buffer.from('dummy content'),
      stream: null,
      destination: '',
      filename: '',
      path: '',
    };
    validatedUser = {
      data: user,
      fileUrl: user.avatarUrl,
    };
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('registerUser()', () => {
    it('should register a new user', async () => {
      (FormDataHandler as jest.Mock).mockResolvedValue(validatedUser);
      (userService.registerUser as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.user.registerUser.status_201,
        data: user,
      });

      const result: Return = await userController.registerUser(file, metadata);

      expect(result).toMatchObject({
        message: httpMessages_EN.user.registerUser.status_201,
        data: user,
      });
      expect(userService.registerUser).toHaveBeenCalledWith(user);
      expect(FormDataHandler).toHaveBeenCalledWith(
        RegisterUserDTO,
        file,
        metadata,
        s3Service,
        logger,
        'images/userAvatars',
      );
    });

    it('should throw BadRequestException due to wrong file type', async () => {
      await expect(
        userController.registerUser(
          {
            fieldname: 'file',
            originalname: 'test.pdf',
            encoding: '7bit',
            mimetype: 'application/pdf',
            size: 1024,
            buffer: Buffer.from('dummy content'),
            stream: null,
            destination: '',
            filename: '',
            path: '',
          },
          metadata,
        ),
      ).rejects.toThrow(BadRequestException);
    });
    it('should throw ConflictException', async () => {
      (FormDataHandler as jest.Mock).mockResolvedValue(validatedUser);
      (userService.registerUser as jest.Mock).mockRejectedValue(
        new ConflictException(
          httpMessages_EN.user.validateUserAvailability.status_409,
        ),
      );

      await expect(userController.registerUser(file, metadata)).rejects.toThrow(
        ConflictException,
      );
      expect(userService.registerUser).toHaveBeenCalledWith(user);
      expect(FormDataHandler).toHaveBeenCalledWith(
        RegisterUserDTO,
        file,
        metadata,
        s3Service,
        logger,
        'images/userAvatars',
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (FormDataHandler as jest.Mock).mockResolvedValue(validatedUser);
      (userService.registerUser as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(userController.registerUser(file, metadata)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(userService.registerUser).toHaveBeenCalledWith(user);
      expect(FormDataHandler).toHaveBeenCalledWith(
        RegisterUserDTO,
        file,
        metadata,
        s3Service,
        logger,
        'images/userAvatars',
      );
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
    it('should update a user', async () => {
      (updateFormHandler as jest.Mock).mockResolvedValue(validatedUser);
      (userService.updateUser as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.user.updateUser.status_200,
        data: user,
      });

      const result: Return = await userController.updateUser(
        user.id,
        file,
        metadata,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.user.updateUser.status_200,
        data: user,
      });
      expect(userService.updateUser).toHaveBeenCalledWith(user.id, user);
      expect(updateFormHandler).toHaveBeenCalledWith(
        s3Service,
        logger,
        'images/userAvatars',
        UpdateUserDTO,
        file,
        metadata,
      );
    });

    it('should throw BadRequestException due to wrong file type', async () => {
      await expect(
        userController.updateUser(
          user.id,
          {
            fieldname: 'file',
            originalname: 'test.pdf',
            encoding: '7bit',
            mimetype: 'application/pdf',
            size: 1024,
            buffer: Buffer.from('dummy content'),
            stream: null,
            destination: '',
            filename: '',
            path: '',
          },
          metadata,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException', async () => {
      (updateFormHandler as jest.Mock).mockResolvedValue(validatedUser);
      (userService.updateUser as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.user.updateUser.status_404),
      );

      await expect(
        userController.updateUser(user.id, file, metadata),
      ).rejects.toThrow(NotFoundException);
      expect(userService.updateUser).toHaveBeenCalledWith(user.id, user);
      expect(updateFormHandler).toHaveBeenCalledWith(
        s3Service,
        logger,
        'images/userAvatars',
        UpdateUserDTO,
        file,
        metadata,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (updateFormHandler as jest.Mock).mockResolvedValue(validatedUser);
      (userService.updateUser as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userController.updateUser(user.id, file, metadata),
      ).rejects.toThrow(InternalServerErrorException);
      expect(userService.updateUser).toHaveBeenCalledWith(user.id, user);
      expect(updateFormHandler).toHaveBeenCalledWith(
        s3Service,
        logger,
        'images/userAvatars',
        UpdateUserDTO,
        file,
        metadata,
      );
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
