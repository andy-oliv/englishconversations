import { Test, TestingModule } from '@nestjs/testing';
import { VideoProgressService } from './video-progress.service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import VideoProgress from '../entities/VideoProgress';
import generateMockVideoProgress from '../helper/mocks/generateMockVideoProgress';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('VideoProgressService', () => {
  let videoProgressService: VideoProgressService;
  let prismaService: PrismaService;
  let logger: Logger;
  let videoProgress: VideoProgress;
  let videoProgresses: VideoProgress[];
  let emptyVideoProgress: VideoProgress[];
  let p2025: any;
  let p2003: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoProgressService,
        {
          provide: PrismaService,
          useValue: {
            videoProgress: {
              create: jest.fn(),
              delete: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              findFirstOrThrow: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn,
            error: jest.fn,
          },
        },
      ],
    }).compile();

    videoProgressService =
      module.get<VideoProgressService>(VideoProgressService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
    videoProgress = generateMockVideoProgress();
    videoProgresses = [
      generateMockVideoProgress(),
      generateMockVideoProgress(),
    ];
    emptyVideoProgress = [];
    p2025 = {
      code: 'P2025',
    };
    p2003 = {
      code: 'P2003',
    };
  });

  it('should be defined', () => {
    expect(videoProgressService).toBeDefined();
  });

  describe('generateVideoProgress()', () => {
    it('should generate a progress connection', async () => {
      jest
        .spyOn(videoProgressService, 'throwIfProgressExists')
        .mockResolvedValue(undefined);
      (prismaService.videoProgress.create as jest.Mock).mockResolvedValue(
        videoProgress,
      );

      const result: Return = await videoProgressService.generateVideoProgress(
        videoProgress.userId,
        videoProgress.videoId,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.videoProgress.generateVideoProgress.status_201,
        data: videoProgress,
      });
      expect(videoProgressService.throwIfProgressExists).toHaveBeenCalledWith(
        videoProgress.userId,
        videoProgress.videoId,
      );
      expect(prismaService.videoProgress.create).toHaveBeenCalledWith({
        data: {
          userId: videoProgress.userId,
          videoId: videoProgress.videoId,
        },
      });
    });

    it('should throw ConflictException', async () => {
      jest
        .spyOn(videoProgressService, 'throwIfProgressExists')
        .mockRejectedValue(
          new ConflictException(
            httpMessages_EN.videoProgress.throwIfProgressExists.status_409,
          ),
        );

      await expect(
        videoProgressService.generateVideoProgress(
          videoProgress.userId,
          videoProgress.videoId,
        ),
      ).rejects.toThrow(ConflictException);

      expect(videoProgressService.throwIfProgressExists).toHaveBeenCalledWith(
        videoProgress.userId,
        videoProgress.videoId,
      );
    });

    it('should throw BadRequestException', async () => {
      jest
        .spyOn(videoProgressService, 'throwIfProgressExists')
        .mockResolvedValue(undefined);
      (prismaService.videoProgress.create as jest.Mock).mockRejectedValue(
        p2003,
      );

      await expect(
        videoProgressService.generateVideoProgress(
          videoProgress.userId,
          videoProgress.videoId,
        ),
      ).rejects.toThrow(BadRequestException);

      expect(videoProgressService.throwIfProgressExists).toHaveBeenCalledWith(
        videoProgress.userId,
        videoProgress.videoId,
      );
      expect(prismaService.videoProgress.create).toHaveBeenCalledWith({
        data: {
          userId: videoProgress.userId,
          videoId: videoProgress.videoId,
        },
      });
    });

    it('should throw InternalServerErrorException', async () => {
      jest
        .spyOn(videoProgressService, 'throwIfProgressExists')
        .mockResolvedValue(undefined);
      (prismaService.videoProgress.create as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        videoProgressService.generateVideoProgress(
          videoProgress.userId,
          videoProgress.videoId,
        ),
      ).rejects.toThrow(InternalServerErrorException);

      expect(videoProgressService.throwIfProgressExists).toHaveBeenCalledWith(
        videoProgress.userId,
        videoProgress.videoId,
      );
      expect(prismaService.videoProgress.create).toHaveBeenCalledWith({
        data: {
          userId: videoProgress.userId,
          videoId: videoProgress.videoId,
        },
      });
    });
  });

  describe('fetchVideoprogresses()', () => {
    it('should fetch progress connections', async () => {
      (prismaService.videoProgress.findMany as jest.Mock).mockResolvedValue(
        videoProgresses,
      );

      const result: Return = await videoProgressService.fetchVideoProgresses();

      expect(result).toMatchObject({
        message: httpMessages_EN.videoProgress.fetchVideoProgresses.status_200,
        data: videoProgresses,
      });
      expect(prismaService.videoProgress.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (prismaService.videoProgress.findMany as jest.Mock).mockResolvedValue(
        emptyVideoProgress,
      );

      await expect(videoProgressService.fetchVideoProgresses()).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.videoProgress.findMany).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException', async () => {
      (prismaService.videoProgress.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(videoProgressService.fetchVideoProgresses()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.videoProgress.findMany).toHaveBeenCalled();
    });
  });

  describe('fetchVideoProgressById()', () => {
    it('should fetch progress connection', async () => {
      (
        prismaService.videoProgress.findUniqueOrThrow as jest.Mock
      ).mockResolvedValue(videoProgress);

      const result: Return = await videoProgressService.fetchVideoProgressById(
        videoProgress.id,
      );

      expect(result).toMatchObject({
        message:
          httpMessages_EN.videoProgress.fetchVideoProgressById.status_200,
        data: videoProgress,
      });
      expect(
        prismaService.videoProgress.findUniqueOrThrow,
      ).toHaveBeenCalledWith({
        where: {
          id: videoProgress.id,
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (
        prismaService.videoProgress.findUniqueOrThrow as jest.Mock
      ).mockRejectedValue(p2025);

      await expect(
        videoProgressService.fetchVideoProgressById(videoProgress.id),
      ).rejects.toThrow(NotFoundException);

      expect(
        prismaService.videoProgress.findUniqueOrThrow,
      ).toHaveBeenCalledWith({
        where: {
          id: videoProgress.id,
        },
      });
    });

    it('should throw InternalServerErrorException', async () => {
      (
        prismaService.videoProgress.findUniqueOrThrow as jest.Mock
      ).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        videoProgressService.fetchVideoProgressById(videoProgress.id),
      ).rejects.toThrow(InternalServerErrorException);

      expect(
        prismaService.videoProgress.findUniqueOrThrow,
      ).toHaveBeenCalledWith({
        where: {
          id: videoProgress.id,
        },
      });
    });
  });

  describe('fetchProgressesByUser()', () => {
    it('should fetch progress connections', async () => {
      (prismaService.videoProgress.findMany as jest.Mock).mockResolvedValue(
        videoProgresses,
      );

      const result: Return =
        await videoProgressService.fetchVideoProgressesByUser(
          videoProgress.userId,
        );

      expect(result).toMatchObject({
        message:
          httpMessages_EN.videoProgress.fetchVideoProgressesByUser.status_200,
        data: videoProgresses,
      });
      expect(prismaService.videoProgress.findMany).toHaveBeenCalledWith({
        where: {
          userId: videoProgress.userId,
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.videoProgress.findMany as jest.Mock).mockResolvedValue(
        emptyVideoProgress,
      );

      await expect(
        videoProgressService.fetchVideoProgressesByUser(videoProgress.userId),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.videoProgress.findMany).toHaveBeenCalledWith({
        where: {
          userId: videoProgress.userId,
        },
      });
    });

    it('should throw InternalServerErrorException', async () => {
      (prismaService.videoProgress.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        videoProgressService.fetchVideoProgressesByUser(videoProgress.userId),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaService.videoProgress.findMany).toHaveBeenCalledWith({
        where: {
          userId: videoProgress.userId,
        },
      });
    });
  });

  describe('updateProgress()', () => {
    it('should delete progress connection', async () => {
      (prismaService.videoProgress.update as jest.Mock).mockResolvedValue(
        videoProgress,
      );

      const result: Return = await videoProgressService.updateProgress(
        videoProgress.id,
        videoProgress,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.videoProgress.updateProgress.status_200,
        data: videoProgress,
      });
      expect(prismaService.videoProgress.update).toHaveBeenCalledWith({
        where: {
          id: videoProgress.id,
        },
        data: videoProgress,
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.videoProgress.update as jest.Mock).mockRejectedValue(
        p2025,
      );

      await expect(
        videoProgressService.updateProgress(videoProgress.id, videoProgress),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.videoProgress.update).toHaveBeenCalledWith({
        where: {
          id: videoProgress.id,
        },
        data: videoProgress,
      });
    });

    it('should throw InternalServerErrorException', async () => {
      (prismaService.videoProgress.update as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        videoProgressService.updateProgress(videoProgress.id, videoProgress),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaService.videoProgress.update).toHaveBeenCalledWith({
        where: {
          id: videoProgress.id,
        },
        data: videoProgress,
      });
    });
  });

  describe('deleteProgress()', () => {
    it('should delete progress connection', async () => {
      (prismaService.videoProgress.delete as jest.Mock).mockResolvedValue(
        videoProgress,
      );

      const result: Return = await videoProgressService.deleteProgress(
        videoProgress.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.videoProgress.deleteProgress.status_200,
        data: videoProgress,
      });
      expect(prismaService.videoProgress.delete).toHaveBeenCalledWith({
        where: {
          id: videoProgress.id,
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.videoProgress.delete as jest.Mock).mockRejectedValue(
        p2025,
      );

      await expect(
        videoProgressService.deleteProgress(videoProgress.id),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.videoProgress.delete).toHaveBeenCalledWith({
        where: {
          id: videoProgress.id,
        },
      });
    });

    it('should throw InternalServerErrorException', async () => {
      (prismaService.videoProgress.delete as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        videoProgressService.deleteProgress(videoProgress.id),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaService.videoProgress.delete).toHaveBeenCalledWith({
        where: {
          id: videoProgress.id,
        },
      });
    });
  });
});
