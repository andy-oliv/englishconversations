import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import Video from '../entities/Video';
import generateMockVideo from '../helper/mocks/generateMockVideo';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FileService } from '../file/file.service';
import { S3Service } from '../s3/s3.service';
import { Logger } from 'nestjs-pino';
import FormDataHandler from '../helper/functions/formDataHandler';
import FormHandlerReturn from '../common/types/FormHandlerReturn';
import GenerateVideoDTO from './dto/generateVideo.dto';
import { faker } from '@faker-js/faker/.';
import updateFormHandler from '../helper/functions/templates/updateFormHandler';
import UpdateVideoDTO from './dto/updateVideo.dto';

jest.mock('../helper/functions/formDataHandler');
jest.mock('../helper/functions/templates/updateFormHandler');

describe('VideoController', () => {
  let videoController: VideoController;
  let videoService: VideoService;
  let fileService: FileService;
  let s3Service: S3Service;
  let logger: Logger;
  let video: Video;
  let videos: Video[];
  let metadata: string;
  let uploadedFile: Express.Multer.File;
  let returnedData: FormHandlerReturn;
  let thumbnail: Return;

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
        {
          provide: FileService,
          useValue: {
            generateFile: jest.fn(),
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
          },
        },
      ],
    }).compile();

    videoController = module.get<VideoController>(VideoController);
    videoService = module.get<VideoService>(VideoService);
    fileService = module.get<FileService>(FileService);
    s3Service = module.get<S3Service>(S3Service);
    logger = module.get<Logger>(Logger);
    video = generateMockVideo();
    videos = [generateMockVideo(), generateMockVideo()];
    metadata = 'mock-data';
    uploadedFile = {
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
    };
    thumbnail = {
      message: httpMessages_EN.file.generateFile.status_200,
      data: {
        id: video.thumbnailId,
        name: uploadedFile.originalname,
        type: 'IMAGE',
        url: faker.internet.url(),
        size: uploadedFile.size,
      },
    };
    returnedData = {
      data: video,
      fileUrl: thumbnail.data.url,
    };
  });

  it('should be defined', () => {
    expect(videoController).toBeDefined();
  });

  describe('generateVideo()', () => {
    it('should generate a video', async () => {
      (FormDataHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(thumbnail);
      (videoService.generateVideo as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.video.generateVideo.status_200,
        data: video,
      });

      const result: Return = await videoController.generateVideo(
        uploadedFile,
        metadata,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.video.generateVideo.status_200,
        data: video,
      });
      expect(videoService.generateVideo).toHaveBeenCalledWith({
        ...video,
        thumbnailId: thumbnail.data.id,
      });
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: uploadedFile.originalname,
        type: 'IMAGE',
        size: uploadedFile.size,
        url: returnedData.fileUrl,
      });
      expect(FormDataHandler).toHaveBeenCalledWith(
        GenerateVideoDTO,
        uploadedFile,
        metadata,
        s3Service,
        logger,
        'videos/thumbnails',
      );
    });

    it('should throw handleInternalErrorException', async () => {
      (videoService.generateVideo as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(videoService.generateVideo(video)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(videoService.generateVideo).toHaveBeenCalledWith({
        ...video,
        thumbnailId: thumbnail.data.id,
      });
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
      (updateFormHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(thumbnail);
      (videoService.updateVideo as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.video.updateVideo.status_200,
        data: video,
      });

      const result: Return = await videoController.updateVideo(
        video.id,
        uploadedFile,
        metadata,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.video.updateVideo.status_200,
        data: video,
      });
      expect(videoService.updateVideo).toHaveBeenCalledWith(video.id, {
        ...returnedData.data,
        thumbnailId: thumbnail.data.id,
      });
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: uploadedFile.originalname,
        type: 'IMAGE',
        size: uploadedFile.size,
        url: returnedData.fileUrl,
      });
      expect(updateFormHandler).toHaveBeenCalledWith(
        s3Service,
        logger,
        'videos/thumbnails',
        UpdateVideoDTO,
        uploadedFile,
        metadata,
      );
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
