import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import Video from '../entities/Video';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import generateExceptionMessage from '../helper/functions/generateExceptionMessage';
import UpdateVideoDTO from './dto/updateVideo.dto';
import { S3Service } from '../s3/s3.service';
import { FileService } from '../file/file.service';

@Injectable()
export class VideoService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly fileService: FileService,
  ) {}

  async generateVideo(data: Video): Promise<Return> {
    try {
      const video: Video = await this.prismaService.video.create({
        data,
      });

      return {
        message: httpMessages_EN.video.generateVideo.status_200,
        data: video,
      };
    } catch (error) {
      handleInternalErrorException(
        'videoService',
        'generateVideo',
        loggerMessages.video.generateVideo.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchVideos(): Promise<Return> {
    try {
      const videos: Video[] = await this.prismaService.video.findMany();

      if (videos.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.video.fetchVideos.status_404,
        );
      }

      return {
        message: httpMessages_EN.video.fetchVideos.status_200,
        data: videos,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'videoService',
        'fetchVideos',
        loggerMessages.video.fetchVideos.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchVideoById(id: string): Promise<Return> {
    try {
      const video: Video = await this.prismaService.video.findFirstOrThrow({
        where: {
          id,
        },
        include: {
          thumbnail: {
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

      return {
        message: httpMessages_EN.video.fetchVideoById.status_200,
        data: video,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.video.fetchVideoById.status_404,
        );
      }

      handleInternalErrorException(
        'videoService',
        'fetchVideoById',
        loggerMessages.video.fetchVideoById.status_500,
        this.logger,
        error,
      );
    }
  }

  async updateVideo(id: string, updatedData: UpdateVideoDTO): Promise<Return> {
    try {
      const updatedVideo: Video = await this.prismaService.video.update({
        where: {
          id,
        },
        data: updatedData,
      });

      this.logger.log({
        message: generateExceptionMessage(
          'videoService',
          'updateVideo',
          loggerMessages.video.updateVideo.status_200,
        ),
        data: updatedVideo,
      });

      return {
        message: httpMessages_EN.video.updateVideo.status_200,
        data: updatedVideo,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.video.updateVideo.status_404,
        );
      }

      handleInternalErrorException(
        'videoService',
        'updateVideo',
        loggerMessages.video.updateVideo.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteVideo(id: string): Promise<Return> {
    try {
      const deletedVideo: Video = await this.prismaService.video.delete({
        where: {
          id,
        },
      });

      await this.fileService.deleteFile(deletedVideo.thumbnailId);

      this.logger.log({
        message: generateExceptionMessage(
          'videoService',
          'deleteVideo',
          loggerMessages.video.deleteVideo.status_200,
        ),
        data: deletedVideo,
      });

      return {
        message: httpMessages_EN.video.deleteVideo.status_200,
        data: deletedVideo,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.video.deleteVideo.status_404,
        );
      }

      handleInternalErrorException(
        'videoService',
        'deleteVideo',
        loggerMessages.video.deleteVideo.status_500,
        this.logger,
        error,
      );
    }
  }
}
