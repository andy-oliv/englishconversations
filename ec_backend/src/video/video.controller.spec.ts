import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import Video from '../common/types/Video';
import generateMockVideo from '../helper/mocks/generateMockVideo';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('VideoController', () => {
  let videoController: VideoController;
  let videoService: VideoService;
  let video: Video;
  let videos: Video[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        {
          provide: VideoService,
          useValue: {
            generateVideo: jest.fn(),
            fetchVideos: jest.fn(),
            fetchVideoById: jest.fn(),
            updateVideo: jest.fn(),
            deleteVideo: jest.fn(),
          },
        },
      ],
    }).compile();

    videoController = module.get<VideoController>(VideoController);
    videoService = module.get<VideoService>(VideoService);
    video = generateMockVideo();
    videos = [generateMockVideo(), generateMockVideo()];
  });

  it('should be defined', () => {
    expect(videoController).toBeDefined();
  });

  describe('generateVideo()', () => {
    it('should generate a video', async () => {
      (videoService.generateVideo as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.video.generateVideo.status_200,
        data: video,
      });

      const result: Return = await videoController.generateVideo(video);

      expect(result).toMatchObject({
        message: httpMessages_EN.video.generateVideo.status_200,
        data: video,
      });
      expect(videoService.generateVideo).toHaveBeenCalledWith(video);
    });

    it('should throw handleInternalErrorException', async () => {
      (videoService.generateVideo as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(videoService.generateVideo(video)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(videoService.generateVideo).toHaveBeenCalledWith(video);
    });
  });

  describe('fetchVideos()', () => {
    it('should fetch videos', async () => {
      (videoService.fetchVideos as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.video.fetchVideos.status_200,
        data: videos,
      });

      const result: Return = await videoController.fetchVideos();

      expect(result).toMatchObject({
        message: httpMessages_EN.video.fetchVideos.status_200,
        data: videos,
      });
      expect(videoService.fetchVideos).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (videoService.fetchVideos as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.video.fetchVideos.status_404),
      );

      await expect(videoService.fetchVideos()).rejects.toThrow(
        NotFoundException,
      );

      expect(videoService.fetchVideos).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException', async () => {
      (videoService.fetchVideos as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(videoService.fetchVideos()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(videoService.fetchVideos).toHaveBeenCalled();
    });
  });

  describe('fetchVideoById()', () => {
    it('should fetch video', async () => {
      (videoService.fetchVideoById as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.video.fetchVideoById.status_200,
        data: video,
      });

      const result: Return = await videoController.fetchVideoById(video.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.video.fetchVideoById.status_200,
        data: video,
      });
      expect(videoService.fetchVideoById).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (videoService.fetchVideoById as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.video.fetchVideoById.status_404),
      );

      await expect(videoService.fetchVideoById(video.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(videoService.fetchVideoById).toHaveBeenCalledWith(video.id);
    });

    it('should throw InternalServerErrorException', async () => {
      (videoService.fetchVideoById as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(videoService.fetchVideoById(video.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(videoService.fetchVideoById).toHaveBeenCalledWith(video.id);
    });
  });

  describe('updateVideo()', () => {
    it('should update video', async () => {
      (videoService.updateVideo as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.video.updateVideo.status_200,
        data: video,
      });

      const result: Return = await videoController.updateVideo(video.id, video);

      expect(result).toMatchObject({
        message: httpMessages_EN.video.updateVideo.status_200,
        data: video,
      });
      expect(videoService.updateVideo).toHaveBeenCalledWith(video.id, video);
    });

    it('should throw NotFoundException', async () => {
      (videoService.updateVideo as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.video.updateVideo.status_404),
      );

      await expect(videoService.updateVideo(video.id, video)).rejects.toThrow(
        NotFoundException,
      );

      expect(videoService.updateVideo).toHaveBeenCalledWith(video.id, video);
    });

    it('should throw InternalServerErrorException', async () => {
      (videoService.updateVideo as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(videoService.updateVideo(video.id, video)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(videoService.updateVideo).toHaveBeenCalledWith(video.id, video);
    });
  });

  describe('deleteVideo()', () => {
    it('should fetch video', async () => {
      (videoService.deleteVideo as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.video.deleteVideo.status_200,
        data: video,
      });

      const result: Return = await videoController.deleteVideo(video.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.video.deleteVideo.status_200,
        data: video,
      });
      expect(videoService.deleteVideo).toHaveBeenCalledWith(video.id);
    });

    it('should throw NotFoundException', async () => {
      (videoService.deleteVideo as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.video.deleteVideo.status_404),
      );

      await expect(videoService.deleteVideo(video.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(videoService.deleteVideo).toHaveBeenCalledWith(video.id);
    });

    it('should throw InternalServerErrorException', async () => {
      (videoService.deleteVideo as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(videoService.deleteVideo(video.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(videoService.deleteVideo).toHaveBeenCalledWith(video.id);
    });
  });
});
