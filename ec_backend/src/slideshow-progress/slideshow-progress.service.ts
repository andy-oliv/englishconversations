import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import GenerateProgressDTO from './dto/generateProgress.dto';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import { SlideshowProgress } from '../../generated/prisma';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import Return from '../common/types/Return';
import loggerMessages from '../helper/messages/loggerMessages';
import UpdateProgressDTO from './dto/updateProgress.dto';

@Injectable()
export class SlideshowProgressService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async generateProgress(data: GenerateProgressDTO): Promise<Return> {
    try {
      const newProgress: SlideshowProgress =
        await this.prismaService.slideshowProgress.create({
          data,
        });

      return {
        message: httpMessages_EN.slideshowProgress.generateProgress.status_200,
        data: newProgress,
      };
    } catch (error) {
      handleInternalErrorException(
        'SlideshowProgressService',
        'generateProgress',
        loggerMessages.slideshowProgress.generateProgress.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchProgresses(): Promise<Return> {
    try {
      const progresses: SlideshowProgress[] =
        await this.prismaService.slideshowProgress.findMany();

      if (progresses.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.slideshowProgress.fetchProgresses.status_404,
        );
      }

      return {
        message: httpMessages_EN.slideshowProgress.fetchProgresses.status_200,
        data: progresses,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'SlideshowProgressService',
        'fetchProgresses',
        loggerMessages.slideshowProgress.fetchProgresses.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchProgressById(progressId: string): Promise<Return> {
    try {
      const progress: SlideshowProgress =
        await this.prismaService.slideshowProgress.findFirstOrThrow({
          where: {
            id: progressId,
          },
          include: {
            slideshow: {
              select: {
                id: true,
                title: true,
                slides: {
                  select: {
                    id: true,
                    type: true,
                    title: true,
                    description: true,
                    url: true,
                    order: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

      return {
        message: httpMessages_EN.slideshowProgress.fetchProgressById.status_200,
        data: progress,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.slideshowProgress.fetchProgressById.status_404,
        );
      }

      handleInternalErrorException(
        'SlideshowProgressService',
        'fetchProgressById',
        loggerMessages.slideshowProgress.fetchProgressById.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchProgressesByUser(userId: string): Promise<Return> {
    try {
      const progresses: SlideshowProgress[] =
        await this.prismaService.slideshowProgress.findMany({
          where: {
            userId,
          },
          include: {
            slideshow: {
              select: {
                id: true,
                title: true,
                slides: {
                  select: {
                    id: true,
                    type: true,
                    title: true,
                    description: true,
                    url: true,
                    order: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

      if (progresses.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.slideshowProgress.fetchProgressesByUser.status_404,
        );
      }
      return {
        message:
          httpMessages_EN.slideshowProgress.fetchProgressesByUser.status_200,
        data: progresses,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'SlideshowProgressService',
        'fetchProgressesByUser',
        loggerMessages.slideshowProgress.fetchProgressesByUser.status_500,
        this.logger,
        error,
      );
    }
  }

  async updateProgress(
    progressId: string,
    updatedData: UpdateProgressDTO,
  ): Promise<Return> {
    try {
      const deletedProgress: SlideshowProgress =
        await this.prismaService.slideshowProgress.update({
          where: {
            id: progressId,
          },
          data: updatedData,
        });

      return {
        message: httpMessages_EN.slideshowProgress.updateProgress.status_200,
        data: deletedProgress,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.slideshowProgress.updateProgress.status_404,
        );
      }

      handleInternalErrorException(
        'SlideshowProgressService',
        'updateProgress',
        loggerMessages.slideshowProgress.updateProgress.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteProgress(progressId: string): Promise<Return> {
    try {
      const deletedProgress: SlideshowProgress =
        await this.prismaService.slideshowProgress.delete({
          where: {
            id: progressId,
          },
        });

      return {
        message: httpMessages_EN.slideshowProgress.deleteProgress.status_200,
        data: deletedProgress,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.slideshowProgress.deleteProgress.status_404,
        );
      }

      handleInternalErrorException(
        'SlideshowProgressService',
        'deleteProgress',
        loggerMessages.slideshowProgress.deleteProgress.status_500,
        this.logger,
        error,
      );
    }
  }
}
