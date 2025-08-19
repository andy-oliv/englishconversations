import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import VideoProgress from '../entities/VideoProgress';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import UpdateVideoProgressDTO from './dto/updateVideoProgress';

@Injectable()
export class VideoProgressService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async throwIfProgressExists(userId: string, videoId: string): Promise<void> {
    try {
      const progressExists: VideoProgress =
        await this.prismaService.videoProgress.findFirst({
          where: {
            AND: [{ userId }, { videoId }],
          },
        });

      if (progressExists) {
        throw new ConflictException(
          httpMessages_EN.videoProgress.throwIfProgressExists.status_409,
        );
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      handleInternalErrorException(
        'videoProgressService',
        'throwIfProgressExists',
        loggerMessages.videoProgress.throwIfProgressExists.status_500,
        this.logger,
        error,
      );
    }
  }

  async generateVideoProgress(
    userId: string,
    videoId: string,
    userContentId: number,
  ): Promise<Return> {
    await this.throwIfProgressExists(userId, videoId);

    try {
      const videoProgress: VideoProgress =
        await this.prismaService.videoProgress.create({
          data: {
            userId,
            videoId,
            userContentId,
          },
        });
      return {
        message: httpMessages_EN.videoProgress.generateVideoProgress.status_201,
        data: videoProgress,
      };
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException(
          httpMessages_EN.videoProgress.generateVideoProgress.status_400,
        );
      }

      handleInternalErrorException(
        'videoProgressService',
        'generateVideoProgress',
        loggerMessages.videoProgress.generateVideoProgress.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchVideoProgresses(): Promise<Return> {
    try {
      const videoProgresses: VideoProgress[] =
        await this.prismaService.videoProgress.findMany();

      if (videoProgresses.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.videoProgress.fetchVideoProgresses.status_404,
        );
      }

      return {
        message: httpMessages_EN.videoProgress.fetchVideoProgresses.status_200,
        data: videoProgresses,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'videoProgressService',
        'fetchVideoProgresses',
        loggerMessages.videoProgress.fetchVideoProgresses.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchVideoProgressById(id: number): Promise<Return> {
    try {
      const videoProgress: VideoProgress =
        await this.prismaService.videoProgress.findUniqueOrThrow({
          where: {
            id,
          },
        });
      return {
        message:
          httpMessages_EN.videoProgress.fetchVideoProgressById.status_200,
        data: videoProgress,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.videoProgress.fetchVideoProgressById.status_404,
        );
      }

      handleInternalErrorException(
        'videoProgressService',
        'fetchVideoProgressById',
        loggerMessages.videoProgress.fetchVideoProgressById.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchVideoProgressesByUser(id: string): Promise<Return> {
    try {
      const videoProgresses: VideoProgress[] =
        await this.prismaService.videoProgress.findMany({
          where: {
            userId: id,
          },
        });

      if (videoProgresses.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.videoProgress.fetchVideoProgressesByUser.status_404,
        );
      }
      return {
        message:
          httpMessages_EN.videoProgress.fetchVideoProgressesByUser.status_200,
        data: videoProgresses,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'videoProgressService',
        'fetchVideoProgressesByUser',
        loggerMessages.videoProgress.fetchVideoProgressesByUser.status_500,
        this.logger,
        error,
      );
    }
  }

  async updateProgress(
    id: number,
    userId: string,
    data: UpdateVideoProgressDTO,
  ): Promise<Return> {
    try {
      const updatedProgress: VideoProgress =
        await this.prismaService.videoProgress.update({
          where: {
            id,
            userId,
          },
          data,
        });
      return {
        message: httpMessages_EN.videoProgress.updateProgress.status_200,
        data: updatedProgress,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.videoProgress.updateProgress.status_404,
        );
      }

      handleInternalErrorException(
        'videoProgressService',
        'updateProgress',
        loggerMessages.videoProgress.updateProgress.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteProgress(id: number): Promise<Return> {
    try {
      const deletedProgress: VideoProgress =
        await this.prismaService.videoProgress.delete({
          where: {
            id,
          },
        });
      return {
        message: httpMessages_EN.videoProgress.deleteProgress.status_200,
        data: deletedProgress,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.videoProgress.deleteProgress.status_404,
        );
      }

      handleInternalErrorException(
        'videoProgressService',
        'deleteProgress',
        loggerMessages.videoProgress.deleteProgress.status_500,
        this.logger,
        error,
      );
    }
  }
}
