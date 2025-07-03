import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UnitService } from './unit.service';
import Unit from '../entities/Unit';
import generateMockUnit from '../helper/mocks/generateMockUnit';
import { FileService } from '../file/file.service';

describe('UnitService', () => {
  let unitService: UnitService;
  let prismaService: PrismaService;
  let fileService: FileService;
  let logger: Logger;
  let unit: Unit;
  let units: Unit[];
  let emptyUnits: Unit[];
  let errorP2025: any;
  let errorP2003: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitService,
        {
          provide: PrismaService,
          useValue: {
            unit: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
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
        {
          provide: FileService,
          useValue: {
            deleteFile: jest.fn(),
          },
        },
      ],
    }).compile();

    unitService = module.get<UnitService>(UnitService);
    prismaService = module.get<PrismaService>(PrismaService);
    fileService = module.get<FileService>(FileService);
    logger = module.get<Logger>(Logger);
    unit = generateMockUnit();
    units = [generateMockUnit(), generateMockUnit()];
    emptyUnits = [];
    errorP2025 = {
      code: 'P2025',
    };
    errorP2003 = {
      code: 'P2003',
    };
  });

  it('should be defined', () => {
    expect(unitService).toBeDefined();
  });

  describe('createUnit()', () => {
    it('should create a new unit', async () => {
      (prismaService.unit.create as jest.Mock).mockResolvedValue(unit);

      const result: Return = await unitService.createUnit(unit);

      expect(result).toMatchObject({
        message: httpMessages_EN.unit.createUnit.status_200,
        data: unit,
      });
      expect(prismaService.unit.create).toHaveBeenCalledWith({
        data: unit,
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.unit.create as jest.Mock).mockRejectedValue(errorP2003);

      await expect(unitService.createUnit(unit)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.unit.create).toHaveBeenCalledWith({
        data: unit,
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.unit.create as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(unitService.createUnit(unit)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.unit.create).toHaveBeenCalledWith({
        data: unit,
      });
    });
  });

  describe('fetchUnits()', () => {
    it('should fetch units', async () => {
      (prismaService.unit.findMany as jest.Mock).mockResolvedValue(units);

      const result: Return = await unitService.fetchUnits();

      expect(result).toMatchObject({
        message: httpMessages_EN.unit.fetchUnits.status_200,
        data: units,
      });
      expect(prismaService.unit.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (prismaService.unit.findMany as jest.Mock).mockResolvedValue(emptyUnits);

      await expect(unitService.fetchUnits()).rejects.toThrow(NotFoundException);

      expect(prismaService.unit.findMany).toHaveBeenCalled();
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.unit.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(unitService.fetchUnits()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.unit.findMany).toHaveBeenCalled();
    });
  });

  describe('fetchUnitById()', () => {
    it('should fetch a unit', async () => {
      (prismaService.unit.findUniqueOrThrow as jest.Mock).mockResolvedValue(
        unit,
      );

      const result: Return = await unitService.fetchUnitById(unit.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.unit.fetchUnitById.status_200,
        data: unit,
      });
      expect(prismaService.unit.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: unit.id,
        },
        include: {
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          chapter: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
          videos: {
            select: {
              id: true,
              title: true,
              description: true,
              duration: true,
            },
          },
          quizzes: {
            select: {
              id: true,
              title: true,
              description: true,
              difficulty: true,
              isTest: true,
            },
          },
          file: {
            select: {
              id: true,
              name: true,
              type: true,
              size: true,
              url: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.unit.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        errorP2025,
      );

      await expect(unitService.fetchUnitById(unit.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.unit.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: unit.id,
        },
        include: {
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          chapter: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
          videos: {
            select: {
              id: true,
              title: true,
              description: true,
              duration: true,
            },
          },
          quizzes: {
            select: {
              id: true,
              title: true,
              description: true,
              difficulty: true,
              isTest: true,
            },
          },
          file: {
            select: {
              id: true,
              name: true,
              type: true,
              size: true,
              url: true,
            },
          },
        },
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.unit.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(unitService.fetchUnitById(unit.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.unit.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: unit.id,
        },
        include: {
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          chapter: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
          videos: {
            select: {
              id: true,
              title: true,
              description: true,
              duration: true,
            },
          },
          quizzes: {
            select: {
              id: true,
              title: true,
              description: true,
              difficulty: true,
              isTest: true,
            },
          },
          file: {
            select: {
              id: true,
              name: true,
              type: true,
              size: true,
              url: true,
            },
          },
        },
      });
    });
  });

  describe('updateUnit()', () => {
    it('should fetch a unit', async () => {
      (prismaService.unit.update as jest.Mock).mockResolvedValue(unit);

      const result: Return = await unitService.updateUnit(unit.id, unit);

      expect(result).toMatchObject({
        message: httpMessages_EN.unit.updateUnit.status_200,
        data: unit,
      });
      expect(prismaService.unit.update).toHaveBeenCalledWith({
        where: {
          id: unit.id,
        },
        data: unit,
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.unit.update as jest.Mock).mockRejectedValue(errorP2025);

      await expect(unitService.updateUnit(unit.id, unit)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.unit.update).toHaveBeenCalledWith({
        where: {
          id: unit.id,
        },
        data: unit,
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.unit.update as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(unitService.updateUnit(unit.id, unit)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.unit.update).toHaveBeenCalledWith({
        where: {
          id: unit.id,
        },
        data: unit,
      });
    });
  });

  describe('deleteUnit()', () => {
    it('should fetch a unit', async () => {
      (prismaService.unit.delete as jest.Mock).mockResolvedValue(unit);

      const result: Return = await unitService.deleteUnit(unit.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.unit.deleteUnit.status_200,
        data: unit,
      });
      expect(prismaService.unit.delete).toHaveBeenCalledWith({
        where: {
          id: unit.id,
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.unit.delete as jest.Mock).mockRejectedValue(errorP2025);

      await expect(unitService.deleteUnit(unit.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.unit.delete).toHaveBeenCalledWith({
        where: {
          id: unit.id,
        },
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.unit.delete as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(unitService.deleteUnit(unit.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.unit.delete).toHaveBeenCalledWith({
        where: {
          id: unit.id,
        },
      });
    });
  });
});
