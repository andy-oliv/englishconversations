import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from './video.service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Video from '../common/types/Video';
import generateMockVideo from '../helper/mocks/generateMockVideo';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('VideoService', () => {
  let videoService: VideoService;
  let prismaService: PrismaService;
  let logger: Logger;
  let video: Video;
  let videos: Video[];
  let emptyVideos: Video[];
  let error: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoService,
        {
          provide: PrismaService,
          useValue: {
            video: {
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

    videoService = module.get<VideoService>(VideoService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
    video = generateMockVideo();
    videos = [generateMockVideo(), generateMockVideo()];
    emptyVideos = [];
    error = {
      code: 'P2025',
    };
  });

  it('should be defined', () => {
    expect(videoService).toBeDefined();
  });

  describe('generateVideo()', () => {
    it('should generate a new video', async () => {
      (prismaService.video.create as jest.Mock).mockResolvedValue(video);

      const result: Return = await videoService.generateVideo(video);

      expect(result).toMatchObject({
        message: httpMessages_EN.video.generateVideo.status_200,
        data: video,
      });
      expect(prismaService.video.create).toHaveBeenCalledWith({
        data: video,
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.video.create as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(videoService.generateVideo(video)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.video.create).toHaveBeenCalledWith({
        data: video,
      });
    });
  });

  describe('fetchVideos()', () => {
    it('should fetch videos', async () => {
      (prismaService.video.findMany as jest.Mock).mockResolvedValue(videos);

      const result: Return = await videoService.fetchVideos();

      expect(result).toMatchObject({
        message: httpMessages_EN.video.fetchVideos.status_200,
        data: videos,
      });
      expect(prismaService.video.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (prismaService.video.findMany as jest.Mock).mockResolvedValue(
        emptyVideos,
      );

      await expect(videoService.fetchVideos()).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.video.findMany).toHaveBeenCalled();
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.video.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(videoService.fetchVideos()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.video.findMany).toHaveBeenCalled();
    });
  });

  describe('fetchVideoById()', () => {
    it('should fetch a video', async () => {
      (prismaService.video.findFirstOrThrow as jest.Mock).mockResolvedValue(
        video,
      );

      const result: Return = await videoService.fetchVideoById(video.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.video.fetchVideoById.status_200,
        data: video,
      });
      expect(prismaService.video.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: video.id,
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.video.findFirstOrThrow as jest.Mock).mockRejectedValue(
        error,
      );

      await expect(videoService.fetchVideoById(video.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.video.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: video.id,
        },
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.video.findFirstOrThrow as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(videoService.fetchVideoById(video.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.video.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: video.id,
        },
      });
    });
  });

  describe('updateVideo()', () => {
    it('should fetch a video', async () => {
      (prismaService.video.update as jest.Mock).mockResolvedValue(video);

      const result: Return = await videoService.updateVideo(video.id, video);

      expect(result).toMatchObject({
        message: httpMessages_EN.video.updateVideo.status_200,
        data: video,
      });
      expect(prismaService.video.update).toHaveBeenCalledWith({
        where: {
          id: video.id,
        },
        data: video,
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.video.update as jest.Mock).mockRejectedValue(error);

      await expect(videoService.updateVideo(video.id, video)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.video.update).toHaveBeenCalledWith({
        where: {
          id: video.id,
        },
        data: video,
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.video.update as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(videoService.updateVideo(video.id, video)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.video.update).toHaveBeenCalledWith({
        where: {
          id: video.id,
        },
        data: video,
      });
    });
  });

  describe('deleteVideo()', () => {
    it('should fetch a video', async () => {
      (prismaService.video.delete as jest.Mock).mockResolvedValue(video);

      const result: Return = await videoService.deleteVideo(video.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.video.deleteVideo.status_200,
        data: video,
      });
      expect(prismaService.video.delete).toHaveBeenCalledWith({
        where: {
          id: video.id,
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.video.delete as jest.Mock).mockRejectedValue(error);

      await expect(videoService.deleteVideo(video.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.video.delete).toHaveBeenCalledWith({
        where: {
          id: video.id,
        },
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.video.delete as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(videoService.deleteVideo(video.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.video.delete).toHaveBeenCalledWith({
        where: {
          id: video.id,
        },
      });
    });
  });
});
