import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserUnitService } from './user-unit.service';
import UserUnit from '../common/types/UserUnit';
import generateMockUserUnit from '../helper/mocks/generateMockUserUnit';

describe('userUnitService', () => {
  let userUnitService: UserUnitService;
  let prismaService: PrismaService;
  let logger: Logger;
  let progress: UserUnit;
  let progresses: UserUnit[];
  let emptyProgresses: UserUnit[];
  let errorP2025: any;
  let errorP2003: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserUnitService,
        {
          provide: PrismaService,
          useValue: {
            userUnit: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirstOrThrow: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn,
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    userUnitService = module.get<UserUnitService>(UserUnitService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
    progress = generateMockUserUnit();
    progresses = [generateMockUserUnit(), generateMockUserUnit()];
    emptyProgresses = [];
    errorP2025 = {
      code: 'P2025',
    };
    errorP2003 = {
      code: 'P2003',
    };
  });

  it('should be defined', () => {
    expect(userUnitService).toBeDefined();
  });

  describe('generateUserUnit()', () => {
    it('should generate a new userUnit', async () => {
      jest
        .spyOn(userUnitService, 'throwIfUserUnitExists')
        .mockResolvedValue(undefined);
      (prismaService.userUnit.create as jest.Mock).mockResolvedValue(progress);

      const result: Return = await userUnitService.generateUserUnit(progress);

      expect(result).toMatchObject({
        message: httpMessages_EN.userUnit.generateUserUnit.status_200,
        data: progress,
      });
      expect(userUnitService.throwIfUserUnitExists).toHaveBeenCalledWith(
        progress.unitId,
        progress.userId,
      );
      expect(prismaService.userUnit.create).toHaveBeenCalledWith({
        data: progress,
      });
    });

    it('should throw NotFoundException', async () => {
      jest
        .spyOn(userUnitService, 'throwIfUserUnitExists')
        .mockResolvedValue(undefined);
      (prismaService.userUnit.create as jest.Mock).mockRejectedValue(
        errorP2003,
      );

      await expect(userUnitService.generateUserUnit(progress)).rejects.toThrow(
        NotFoundException,
      );

      expect(userUnitService.throwIfUserUnitExists).toHaveBeenCalledWith(
        progress.unitId,
        progress.userId,
      );
      expect(prismaService.userUnit.create).toHaveBeenCalledWith({
        data: progress,
      });
    });

    it('should throw InternalErrorException', async () => {
      jest
        .spyOn(userUnitService, 'throwIfUserUnitExists')
        .mockResolvedValue(undefined);
      (prismaService.userUnit.create as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(userUnitService.generateUserUnit(progress)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(userUnitService.throwIfUserUnitExists).toHaveBeenCalledWith(
        progress.unitId,
        progress.userId,
      );
      expect(prismaService.userUnit.create).toHaveBeenCalledWith({
        data: progress,
      });
    });
  });

  describe('fetchUserUnits()', () => {
    it('should fetch userUnits', async () => {
      (prismaService.userUnit.findMany as jest.Mock).mockResolvedValue(
        progresses,
      );

      const result: Return = await userUnitService.fetchUserUnits();

      expect(result).toMatchObject({
        message: httpMessages_EN.userUnit.fetchUserUnits.status_200,
        data: progresses,
      });
      expect(prismaService.userUnit.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (prismaService.userUnit.findMany as jest.Mock).mockResolvedValue(
        emptyProgresses,
      );

      await expect(userUnitService.fetchUserUnits()).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.userUnit.findMany).toHaveBeenCalled();
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.userUnit.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(userUnitService.fetchUserUnits()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.userUnit.findMany).toHaveBeenCalled();
    });
  });

  describe('fetchUserUnitById()', () => {
    it('should fetch a userUnit', async () => {
      (prismaService.userUnit.findUniqueOrThrow as jest.Mock).mockResolvedValue(
        progress,
      );

      const result: Return = await userUnitService.fetchUserUnitById(
        progress.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.userUnit.fetchUserUnitById.status_200,
        data: progress,
      });
      expect(prismaService.userUnit.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: progress.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          unit: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.userUnit.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        errorP2025,
      );

      await expect(
        userUnitService.fetchUserUnitById(progress.id),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.userUnit.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: progress.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          unit: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.userUnit.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userUnitService.fetchUserUnitById(progress.id),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaService.userUnit.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: progress.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          unit: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      });
    });
  });

  describe('fetchUserUnitsByQuery()', () => {
    it('should fetch units', async () => {
      (prismaService.userUnit.findMany as jest.Mock).mockResolvedValue(
        progresses,
      );

      const result: Return = await userUnitService.fetchUserUnitsByQuery(
        progress.userId,
        progress.unitId,
        progress.status,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.userUnit.fetchUserUnitsByQuery.status_200,
        data: progresses,
      });
      expect(prismaService.userUnit.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { userId: progress.userId },
            { unitId: progress.unitId },
            { status: progress.status },
          ],
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.userUnit.findMany as jest.Mock).mockResolvedValue(
        emptyProgresses,
      );

      await expect(
        userUnitService.fetchUserUnitsByQuery(
          progress.userId,
          progress.unitId,
          progress.status,
        ),
      ).rejects.toThrow(NotFoundException);
      expect(prismaService.userUnit.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { userId: progress.userId },
            { unitId: progress.unitId },
            { status: progress.status },
          ],
        },
      });
    });

    it('should fetch units', async () => {
      (prismaService.userUnit.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userUnitService.fetchUserUnitsByQuery(
          progress.userId,
          progress.unitId,
          progress.status,
        ),
      ).rejects.toThrow(InternalServerErrorException);
      expect(prismaService.userUnit.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { userId: progress.userId },
            { unitId: progress.unitId },
            { status: progress.status },
          ],
        },
      });
    });
  });

  describe('updateUserUnit()', () => {
    it('should fetch a userUnit', async () => {
      (prismaService.userUnit.update as jest.Mock).mockResolvedValue(progress);

      const result: Return = await userUnitService.updateUserUnit(
        progress.id,
        progress,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.userUnit.updateUserUnit.status_200,
        data: progress,
      });
      expect(prismaService.userUnit.update).toHaveBeenCalledWith({
        where: {
          id: progress.id,
        },
        data: progress,
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.userUnit.update as jest.Mock).mockRejectedValue(
        errorP2025,
      );

      await expect(
        userUnitService.updateUserUnit(progress.id, progress),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.userUnit.update).toHaveBeenCalledWith({
        where: {
          id: progress.id,
        },
        data: progress,
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.userUnit.update as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userUnitService.updateUserUnit(progress.id, progress),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaService.userUnit.update).toHaveBeenCalledWith({
        where: {
          id: progress.id,
        },
        data: progress,
      });
    });
  });

  describe('deleteUserUnit()', () => {
    it('should fetch a userUnit', async () => {
      (prismaService.userUnit.delete as jest.Mock).mockResolvedValue(progress);

      const result: Return = await userUnitService.deleteUserUnit(progress.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.userUnit.deleteUserUnit.status_200,
        data: progress,
      });
      expect(prismaService.userUnit.delete).toHaveBeenCalledWith({
        where: {
          id: progress.id,
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.userUnit.delete as jest.Mock).mockRejectedValue(
        errorP2025,
      );

      await expect(userUnitService.deleteUserUnit(progress.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.userUnit.delete).toHaveBeenCalledWith({
        where: {
          id: progress.id,
        },
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.userUnit.delete as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(userUnitService.deleteUserUnit(progress.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.userUnit.delete).toHaveBeenCalledWith({
        where: {
          id: progress.id,
        },
      });
    });
  });
});
