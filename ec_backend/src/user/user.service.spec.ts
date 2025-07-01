import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import User from '../entities/User';
import generateMockUser from '../helper/mocks/generateMockUser';
import { faker } from '@faker-js/faker/.';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { S3Service } from '../s3/s3.service';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;
  let s3Service: S3Service;
  let user: User;
  let users: User[];
  let emptyUserList: User[];
  let error: any;
  let hashedPassword: string;
  let logger: Logger;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              delete: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: S3Service,
          useValue: {
            deleteFileFromS3: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    s3Service = module.get<S3Service>(S3Service);
    user = generateMockUser();
    users = [generateMockUser(), generateMockUser()];
    emptyUserList = [];
    error = {
      code: 'P2025',
    };
    hashedPassword = faker.internet.password();
    logger = module.get<Logger>(Logger);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('registerUser()', () => {
    it('should register a user', async () => {
      jest
        .spyOn(userService, 'validateUserAvailability')
        .mockResolvedValue(undefined);
      jest.spyOn(userService, 'hashPassword').mockResolvedValue(hashedPassword);
      (prismaService.user.create as jest.Mock).mockResolvedValue(user);

      const result: Return = await userService.registerUser(user);

      expect(result).toMatchObject({
        message: httpMessages_EN.user.registerUser.status_201,
        data: user,
      });
      expect(userService.validateUserAvailability).toHaveBeenCalledWith(
        user.email,
      );
      expect(userService.hashPassword).toHaveBeenCalledWith(user.password);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          name: user.name,
          bio: user.bio,
          city: user.city,
          state: user.state,
          country: user.country,
          avatarUrl: user.avatarUrl,
          email: user.email,
          password: hashedPassword,
        },
      });
    });

    it('should throw ConflictException', async () => {
      jest
        .spyOn(userService, 'validateUserAvailability')
        .mockRejectedValue(
          new ConflictException(
            httpMessages_EN.user.validateUserAvailability.status_409,
          ),
        );

      await expect(userService.registerUser(user)).rejects.toThrow(
        ConflictException,
      );

      expect(userService.validateUserAvailability).toHaveBeenCalledWith(
        user.email,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      jest
        .spyOn(userService, 'validateUserAvailability')
        .mockResolvedValue(undefined);
      jest.spyOn(userService, 'hashPassword').mockResolvedValue(hashedPassword);
      (prismaService.user.create as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(userService.registerUser(user)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(userService.validateUserAvailability).toHaveBeenCalledWith(
        user.email,
      );
      expect(userService.hashPassword).toHaveBeenCalledWith(user.password);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          name: user.name,
          bio: user.bio,
          city: user.city,
          state: user.state,
          country: user.country,
          avatarUrl: user.avatarUrl,
          email: user.email,
          password: hashedPassword,
        },
      });
    });
  });

  describe('fetchUsers()', () => {
    it('should fetch users', async () => {
      (prismaService.user.findMany as jest.Mock).mockResolvedValue(users);

      const result: Return = await userService.fetchUsers();

      expect(result).toMatchObject({
        message: httpMessages_EN.user.fetchUsers.status_200,
        data: users,
      });
      expect(prismaService.user.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (prismaService.user.findMany as jest.Mock).mockResolvedValue(
        emptyUserList,
      );

      await expect(userService.fetchUsers()).rejects.toThrow(NotFoundException);

      expect(prismaService.user.findMany).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException', async () => {
      (prismaService.user.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(userService.fetchUsers()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(prismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('fetchUserById()', () => {
    it('should fetch user', async () => {
      (prismaService.user.findUniqueOrThrow as jest.Mock).mockResolvedValue(
        user,
      );

      const result: Return = await userService.fetchUserById(user.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.user.fetchUserById.status_200,
        data: user,
      });
      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
        include: {
          chapters: {
            select: {
              id: true,
              progress: true,
              status: true,
            },
          },
          units: {
            select: {
              id: true,
              progress: true,
              status: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.user.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        error,
      );

      await expect(userService.fetchUserById(user.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
        include: {
          chapters: {
            select: {
              id: true,
              progress: true,
              status: true,
            },
          },
          units: {
            select: {
              id: true,
              progress: true,
              status: true,
            },
          },
        },
      });
    });

    it('should throw InternalServerErrorException', async () => {
      (prismaService.user.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(userService.fetchUserById(user.id)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
        include: {
          chapters: {
            select: {
              id: true,
              progress: true,
              status: true,
            },
          },
          units: {
            select: {
              id: true,
              progress: true,
              status: true,
            },
          },
        },
      });
    });
  });

  describe('fetchUserByEmail()', () => {
    it('should fetch user', async () => {
      (prismaService.user.findUniqueOrThrow as jest.Mock).mockResolvedValue(
        user,
      );

      const result: Return = await userService.fetchUserByEmail(user.email);

      expect(result).toMatchObject({
        message: httpMessages_EN.user.fetchUserByEmail.status_200,
        data: user,
      });
      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          email: user.email,
        },
        include: {
          chapters: {
            select: {
              id: true,
              progress: true,
              status: true,
            },
          },
          units: {
            select: {
              id: true,
              progress: true,
              status: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.user.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        error,
      );

      await expect(userService.fetchUserByEmail(user.email)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          email: user.email,
        },
        include: {
          chapters: {
            select: {
              id: true,
              progress: true,
              status: true,
            },
          },
          units: {
            select: {
              id: true,
              progress: true,
              status: true,
            },
          },
        },
      });
    });

    it('should throw InternalServerErrorException', async () => {
      (prismaService.user.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(userService.fetchUserByEmail(user.email)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          email: user.email,
        },
        include: {
          chapters: {
            select: {
              id: true,
              progress: true,
              status: true,
            },
          },
          units: {
            select: {
              id: true,
              progress: true,
              status: true,
            },
          },
        },
      });
    });
  });

  describe('updateUser()', () => {
    it('should fetch user', async () => {
      (prismaService.user.update as jest.Mock).mockResolvedValue(user);

      const result: Return = await userService.updateUser(user.id, user);

      expect(result).toMatchObject({
        message: httpMessages_EN.user.updateUser.status_200,
        data: user,
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
        data: user,
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.user.update as jest.Mock).mockRejectedValue(error);

      await expect(userService.updateUser(user.id, user)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
        data: user,
      });
    });

    it('should throw InternalServerErrorException', async () => {
      (prismaService.user.update as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(userService.updateUser(user.id, user)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
        data: user,
      });
    });
  });

  describe('deleteUser()', () => {
    it('should fetch user', async () => {
      (prismaService.user.delete as jest.Mock).mockResolvedValue(user);
      (s3Service.deleteFileFromS3 as jest.Mock).mockResolvedValue(undefined);

      const result: Return = await userService.deleteUser(user.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.user.deleteUser.status_200,
        data: user,
      });
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
      });
      expect(s3Service.deleteFileFromS3).toHaveBeenCalledWith(user.avatarUrl);
    });

    it('should throw NotFoundException', async () => {
      (prismaService.user.delete as jest.Mock).mockRejectedValue(error);

      await expect(userService.deleteUser(user.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
      });
    });

    it('should throw InternalServerErrorException', async () => {
      (prismaService.user.delete as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(userService.deleteUser(user.id)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
      });
    });
  });
});
