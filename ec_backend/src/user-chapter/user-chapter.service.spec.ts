import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserChapterService } from './user-chapter.service';
import UserChapter from '../common/types/userChapter';
import generateMockUserChapter from '../helper/mocks/generateMockUserChapter';

describe('UserChapterService', () => {
  let userChapterService: UserChapterService;
  let prismaService: PrismaService;
  let logger: Logger;
  let progress: UserChapter;
  let progresses: UserChapter[];
  let emptyProgresses: UserChapter[];
  let errorP2025: any;
  let errorP2003: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserChapterService,
        {
          provide: PrismaService,
          useValue: {
            userChapter: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirstOrThrow: jest.fn(),
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

    userChapterService = module.get<UserChapterService>(UserChapterService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
    progress = generateMockUserChapter();
    progresses = [generateMockUserChapter(), generateMockUserChapter()];
    emptyProgresses = [];
    errorP2025 = {
      code: 'P2025',
    };
    errorP2003 = {
      code: 'P2003',
    };
  });

  it('should be defined', () => {
    expect(userChapterService).toBeDefined();
  });

  describe('generateUserChapter()', () => {
    it('should generate a new userChapter', async () => {
      jest
        .spyOn(userChapterService, 'throwIfUserChapterExists')
        .mockResolvedValue(undefined);
      (prismaService.userChapter.create as jest.Mock).mockResolvedValue(
        progress,
      );

      const result: Return =
        await userChapterService.generateUserChapter(progress);

      expect(result).toMatchObject({
        message: httpMessages_EN.userChapter.generateUserChapter.status_200,
        data: progress,
      });
      expect(userChapterService.throwIfUserChapterExists).toHaveBeenCalledWith(
        progress.userId,
        progress.chapterId,
      );
      expect(prismaService.userChapter.create).toHaveBeenCalledWith({
        data: progress,
      });
    });

    it('should throw NotFoundException', async () => {
      jest
        .spyOn(userChapterService, 'throwIfUserChapterExists')
        .mockResolvedValue(undefined);
      (prismaService.userChapter.create as jest.Mock).mockRejectedValue(
        errorP2003,
      );

      await expect(
        userChapterService.generateUserChapter(progress),
      ).rejects.toThrow(NotFoundException);

      expect(userChapterService.throwIfUserChapterExists).toHaveBeenCalledWith(
        progress.userId,
        progress.chapterId,
      );
      expect(prismaService.userChapter.create).toHaveBeenCalledWith({
        data: progress,
      });
    });

    it('should throw InternalErrorException', async () => {
      jest
        .spyOn(userChapterService, 'throwIfUserChapterExists')
        .mockResolvedValue(undefined);
      (prismaService.userChapter.create as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userChapterService.generateUserChapter(progress),
      ).rejects.toThrow(InternalServerErrorException);

      expect(userChapterService.throwIfUserChapterExists).toHaveBeenCalledWith(
        progress.userId,
        progress.chapterId,
      );
      expect(prismaService.userChapter.create).toHaveBeenCalledWith({
        data: progress,
      });
    });
  });

  describe('fetchUserChapters()', () => {
    it('should fetch userChapters', async () => {
      (prismaService.userChapter.findMany as jest.Mock).mockResolvedValue(
        progresses,
      );

      const result: Return = await userChapterService.fetchUserChapters();

      expect(result).toMatchObject({
        message: httpMessages_EN.userChapter.fetchUserChapters.status_200,
        data: progresses,
      });
      expect(prismaService.userChapter.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (prismaService.userChapter.findMany as jest.Mock).mockResolvedValue(
        emptyProgresses,
      );

      await expect(userChapterService.fetchUserChapters()).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.userChapter.findMany).toHaveBeenCalled();
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.userChapter.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(userChapterService.fetchUserChapters()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.userChapter.findMany).toHaveBeenCalled();
    });
  });

  describe('fetchUserChapterById()', () => {
    it('should fetch a userChapter', async () => {
      (
        prismaService.userChapter.findFirstOrThrow as jest.Mock
      ).mockResolvedValue(progress);

      const result: Return = await userChapterService.fetchUserChapterById(
        progress.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.userChapter.fetchUserChapterById.status_200,
        data: progress,
      });
      expect(prismaService.userChapter.findFirstOrThrow).toHaveBeenCalledWith({
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
          chapter: {
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
      (
        prismaService.userChapter.findFirstOrThrow as jest.Mock
      ).mockRejectedValue(errorP2025);

      await expect(
        userChapterService.fetchUserChapterById(progress.id),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.userChapter.findFirstOrThrow).toHaveBeenCalledWith({
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
          chapter: {
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
      (
        prismaService.userChapter.findFirstOrThrow as jest.Mock
      ).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userChapterService.fetchUserChapterById(progress.id),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaService.userChapter.findFirstOrThrow).toHaveBeenCalledWith({
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
          chapter: {
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

  describe('updateUserChapter()', () => {
    it('should fetch a userChapter', async () => {
      (prismaService.userChapter.update as jest.Mock).mockResolvedValue(
        progress,
      );

      const result: Return = await userChapterService.updateUserChapter(
        progress.id,
        progress,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.userChapter.updateUserChapter.status_200,
        data: progress,
      });
      expect(prismaService.userChapter.update).toHaveBeenCalledWith({
        where: {
          id: progress.id,
        },
        data: progress,
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.userChapter.update as jest.Mock).mockRejectedValue(
        errorP2025,
      );

      await expect(
        userChapterService.updateUserChapter(progress.id, progress),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.userChapter.update).toHaveBeenCalledWith({
        where: {
          id: progress.id,
        },
        data: progress,
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.userChapter.update as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userChapterService.updateUserChapter(progress.id, progress),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaService.userChapter.update).toHaveBeenCalledWith({
        where: {
          id: progress.id,
        },
        data: progress,
      });
    });
  });

  describe('deleteUserChapter()', () => {
    it('should fetch a userChapter', async () => {
      (prismaService.userChapter.delete as jest.Mock).mockResolvedValue(
        progress,
      );

      const result: Return = await userChapterService.deleteUserChapter(
        progress.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.userChapter.deleteUserChapter.status_200,
        data: progress,
      });
      expect(prismaService.userChapter.delete).toHaveBeenCalledWith({
        where: {
          id: progress.id,
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.userChapter.delete as jest.Mock).mockRejectedValue(
        errorP2025,
      );

      await expect(
        userChapterService.deleteUserChapter(progress.id),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.userChapter.delete).toHaveBeenCalledWith({
        where: {
          id: progress.id,
        },
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.userChapter.delete as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userChapterService.deleteUserChapter(progress.id),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaService.userChapter.delete).toHaveBeenCalledWith({
        where: {
          id: progress.id,
        },
      });
    });
  });
});
