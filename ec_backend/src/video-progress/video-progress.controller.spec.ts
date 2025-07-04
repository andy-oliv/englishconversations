import { Test, TestingModule } from '@nestjs/testing';
import { VideoProgressController } from './video-progress.controller';
import VideoProgress from '../entities/VideoProgress';
import { faker } from '@faker-js/faker/.';
import { VideoProgressService } from './video-progress.service';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import generateMockVideoProgress from '../helper/mocks/generateMockVideoProgress';
import { Logger } from 'nestjs-pino';

describe('VideoProgressController', () => {
  let videoProgressController: VideoProgressController;
  let videoProgressService: VideoProgressService;
  let logger: Logger;
  let videoProgress: VideoProgress;
  let videoProgresses: VideoProgress[];
  let emptyVideoProgresses: VideoProgress[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoProgressController],
      providers: [
        {
          provide: VideoProgressService,
          useValue: {
            generateVideoProgress: jest.fn(),
            fetchVideoProgresses: jest.fn(),
            fetchVideoProgressById: jest.fn(),
            fetchVideoProgressesByUser: jest.fn(),
            updateProgress: jest.fn(),
            deleteProgress: jest.fn(),
          },
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

    videoProgressController = module.get<VideoProgressController>(
      VideoProgressController,
    );
    videoProgressService =
      module.get<VideoProgressService>(VideoProgressService);
    logger = module.get<Logger>(Logger);
    videoProgress = generateMockVideoProgress();
    videoProgresses = [
      generateMockVideoProgress(),
      generateMockVideoProgress(),
    ];
    emptyVideoProgresses = [];
  });

  it('should be defined', () => {
    expect(videoProgressController).toBeDefined();
  });

  describe('generateVideoProgress()', () => {
    it('should generate a progress connection', async () => {
      (
        videoProgressService.generateVideoProgress as jest.Mock
      ).mockResolvedValue({
        message: httpMessages_EN.videoProgress.generateVideoProgress.status_201,
        data: videoProgress,
      });

      const result: Return =
        await videoProgressController.generateVideoProgress(videoProgress);

      expect(result).toMatchObject({
        message: httpMessages_EN.videoProgress.generateVideoProgress.status_201,
        data: videoProgress,
      });
      expect(videoProgressService.generateVideoProgress).toHaveBeenCalledWith(
        videoProgress.userId,
        videoProgress.videoId,
      );
    });

    it('should throw BadRequestException', async () => {
      (
        videoProgressService.generateVideoProgress as jest.Mock
      ).mockRejectedValue(
        new BadRequestException(
          httpMessages_EN.videoProgress.generateVideoProgress.status_400,
        ),
      );

      await expect(
        videoProgressController.generateVideoProgress(videoProgress),
      ).rejects.toThrow(BadRequestException);

      expect(videoProgressService.generateVideoProgress).toHaveBeenCalledWith(
        videoProgress.userId,
        videoProgress.videoId,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (
        videoProgressService.generateVideoProgress as jest.Mock
      ).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        videoProgressController.generateVideoProgress(videoProgress),
      ).rejects.toThrow(InternalServerErrorException);

      expect(videoProgressService.generateVideoProgress).toHaveBeenCalledWith(
        videoProgress.userId,
        videoProgress.videoId,
      );
    });
  });

  describe('fetchProgresses()', () => {
    it('should fetch progress connections', async () => {
      (
        videoProgressService.fetchVideoProgresses as jest.Mock
      ).mockResolvedValue({
        message: httpMessages_EN.videoProgress.fetchVideoProgresses.status_200,
        data: videoProgresses,
      });

      const result: Return =
        await videoProgressController.fetchVideoProgresses();

      expect(result).toMatchObject({
        message: httpMessages_EN.videoProgress.fetchVideoProgresses.status_200,
        data: videoProgresses,
      });
      expect(videoProgressService.fetchVideoProgresses).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (
        videoProgressService.fetchVideoProgresses as jest.Mock
      ).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.videoProgress.fetchVideoProgresses.status_404,
        ),
      );

      await expect(
        videoProgressController.fetchVideoProgresses(),
      ).rejects.toThrow(NotFoundException);

      expect(videoProgressService.fetchVideoProgresses).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException', async () => {
      (
        videoProgressService.fetchVideoProgresses as jest.Mock
      ).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        videoProgressController.fetchVideoProgresses(),
      ).rejects.toThrow(InternalServerErrorException);

      expect(videoProgressService.fetchVideoProgresses).toHaveBeenCalled();
    });
  });

  describe('fetchProgressById()', () => {
    it('should fetch a progress connection', async () => {
      (
        videoProgressService.fetchVideoProgressById as jest.Mock
      ).mockResolvedValue({
        message:
          httpMessages_EN.videoProgress.fetchVideoProgressById.status_200,
        data: videoProgress,
      });

      const result: Return =
        await videoProgressController.fetchVideoProgressById(videoProgress.id);

      expect(result).toMatchObject({
        message:
          httpMessages_EN.videoProgress.fetchVideoProgressById.status_200,
        data: videoProgress,
      });
      expect(videoProgressService.fetchVideoProgressById).toHaveBeenCalledWith(
        videoProgress.id,
      );
    });

    it('should throw NotFoundException', async () => {
      (
        videoProgressService.fetchVideoProgressById as jest.Mock
      ).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.videoProgress.fetchVideoProgressById.status_404,
        ),
      );

      await expect(
        videoProgressController.fetchVideoProgressById(videoProgress.id),
      ).rejects.toThrow(NotFoundException);

      expect(videoProgressService.fetchVideoProgressById).toHaveBeenCalledWith(
        videoProgress.id,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (
        videoProgressService.fetchVideoProgressById as jest.Mock
      ).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        videoProgressController.fetchVideoProgressById(videoProgress.id),
      ).rejects.toThrow(InternalServerErrorException);

      expect(videoProgressService.fetchVideoProgressById).toHaveBeenCalledWith(
        videoProgress.id,
      );
    });
  });

  describe('fetchVideoProgressesByUser()', () => {
    it('should fetch progress connections', async () => {
      (
        videoProgressService.fetchVideoProgressesByUser as jest.Mock
      ).mockResolvedValue({
        message:
          httpMessages_EN.videoProgress.fetchVideoProgressesByUser.status_200,
        data: videoProgresses,
      });

      const result: Return =
        await videoProgressController.fetchVideoProgressesByUser(
          videoProgress.userId,
        );

      expect(result).toMatchObject({
        message:
          httpMessages_EN.videoProgress.fetchVideoProgressesByUser.status_200,
        data: videoProgresses,
      });
      expect(
        videoProgressService.fetchVideoProgressesByUser,
      ).toHaveBeenCalledWith(videoProgress.userId);
    });

    it('should throw NotFoundException', async () => {
      (
        videoProgressService.fetchVideoProgressesByUser as jest.Mock
      ).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.videoProgress.fetchVideoProgressesByUser.status_404,
        ),
      );

      await expect(
        videoProgressController.fetchVideoProgressesByUser(
          videoProgress.userId,
        ),
      ).rejects.toThrow(NotFoundException);

      expect(
        videoProgressService.fetchVideoProgressesByUser,
      ).toHaveBeenCalledWith(videoProgress.userId);
    });

    it('should throw InternalServerErrorException', async () => {
      (
        videoProgressService.fetchVideoProgressesByUser as jest.Mock
      ).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        videoProgressController.fetchVideoProgressesByUser(
          videoProgress.userId,
        ),
      ).rejects.toThrow(InternalServerErrorException);

      expect(
        videoProgressService.fetchVideoProgressesByUser,
      ).toHaveBeenCalledWith(videoProgress.userId);
    });
  });

  describe('updateProgress()', () => {
    it('should update a progress connection', async () => {
      (videoProgressService.updateProgress as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.videoProgress.updateProgress.status_200,
        data: videoProgress,
      });

      const result: Return = await videoProgressController.updateProgress(
        videoProgress.id,
        videoProgress.userId,
        videoProgress,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.videoProgress.updateProgress.status_200,
        data: videoProgress,
      });
      expect(videoProgressService.updateProgress).toHaveBeenCalledWith(
        videoProgress.id,
        videoProgress.userId,
        videoProgress,
      );
    });

    it('should throw NotFoundException', async () => {
      (videoProgressService.updateProgress as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.videoProgress.updateProgress.status_404,
        ),
      );

      await expect(
        videoProgressController.updateProgress(
          videoProgress.id,
          videoProgress.userId,
          videoProgress,
        ),
      ).rejects.toThrow(NotFoundException);

      expect(videoProgressService.updateProgress).toHaveBeenCalledWith(
        videoProgress.id,
        videoProgress.userId,
        videoProgress,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (videoProgressService.updateProgress as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        videoProgressController.updateProgress(
          videoProgress.id,
          videoProgress.userId,
          videoProgress,
        ),
      ).rejects.toThrow(InternalServerErrorException);

      expect(videoProgressService.updateProgress).toHaveBeenCalledWith(
        videoProgress.id,
        videoProgress.userId,
        videoProgress,
      );
    });
  });

  describe('deleteProgress()', () => {
    it('should delete a progress connection', async () => {
      (videoProgressService.deleteProgress as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.videoProgress.deleteProgress.status_200,
        data: videoProgress,
      });

      const result: Return = await videoProgressController.deleteProgress(
        videoProgress.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.videoProgress.deleteProgress.status_200,
        data: videoProgress,
      });
      expect(videoProgressService.deleteProgress).toHaveBeenCalledWith(
        videoProgress.id,
      );
    });

    it('should throw NotFoundException', async () => {
      (videoProgressService.deleteProgress as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.videoProgress.deleteProgress.status_404,
        ),
      );

      await expect(
        videoProgressController.deleteProgress(videoProgress.id),
      ).rejects.toThrow(NotFoundException);

      expect(videoProgressService.deleteProgress).toHaveBeenCalledWith(
        videoProgress.id,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (videoProgressService.deleteProgress as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        videoProgressController.deleteProgress(videoProgress.id),
      ).rejects.toThrow(InternalServerErrorException);

      expect(videoProgressService.deleteProgress).toHaveBeenCalledWith(
        videoProgress.id,
      );
    });
  });
});
