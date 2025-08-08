import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import Slideshow from '../entities/Slideshow';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import GenerateSlideShowDTO from './dto/generateSlideshow.dto';

@Injectable()
export class SlideshowService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async generateSlideshow(
    slideshowData: GenerateSlideShowDTO,
  ): Promise<Return> {
    try {
      const newSlideshow: Slideshow = await this.prismaService.slideshow.create(
        {
          data: slideshowData,
        },
      );

      return {
        message: httpMessages_EN.slideshow.generateSlideshow.status_200,
        data: newSlideshow,
      };
    } catch (error) {
      handleInternalErrorException(
        'SlideshowService',
        'generateSlideshow',
        loggerMessages.slideshow.generateSlideshow.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchSlideshows(): Promise<Return> {
    try {
      const slideshows: Slideshow[] =
        await this.prismaService.slideshow.findMany();

      if (slideshows.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.slideshow.fetchSlideshows.status_404,
        );
      }

      return {
        message: httpMessages_EN.slideshow.fetchSlideshows.status_200,
        data: slideshows,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'SlideshowService',
        'fetchSlideshows',
        loggerMessages.slideshow.fetchSlideshows.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchSlideshowById(slideshowId: string): Promise<Return> {
    try {
      const slideshow: Slideshow =
        await this.prismaService.slideshow.findFirstOrThrow({
          where: {
            id: slideshowId,
          },
          include: {
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
        });

      return {
        message: httpMessages_EN.slideshow.fetchSlideshowById.status_200,
        data: slideshow,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.slideshow.fetchSlideshowById.status_404,
        );
      }

      handleInternalErrorException(
        'SlideshowService',
        'fetchSlideshowById',
        loggerMessages.slideshow.fetchSlideshowById.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteSlideshow(slideshowId: string): Promise<Return> {
    try {
      const deletedSlideshow: Slideshow =
        await this.prismaService.slideshow.delete({
          where: {
            id: slideshowId,
          },
        });

      return {
        message: httpMessages_EN.slideshow.deleteSlideshow.status_200,
        data: deletedSlideshow,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.slideshow.deleteSlideshow.status_404,
        );
      }

      handleInternalErrorException(
        'SlideshowService',
        'deleteSlideshow',
        loggerMessages.slideshow.deleteSlideshow.status_500,
        this.logger,
        error,
      );
    }
  }
}
