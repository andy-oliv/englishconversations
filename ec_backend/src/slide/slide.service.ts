import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import GenerateSlideDTO from './dto/generateSlide.dto';
import Return from '../common/types/Return';
import Slide from '../entities/Slide';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import loggerMessages from '../helper/messages/loggerMessages';
import UpdateSlideDTO from './dto/updateSlide.dto';
import handleInternalErrorException from '../helper/functions/handleErrorException';

@Injectable()
export class SlideService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async generateSlide(data: GenerateSlideDTO): Promise<Return> {
    try {
      const newSlide: Slide = await this.prismaService.slide.create({
        data,
      });

      return {
        message: httpMessages_EN.slide.generateSlide.status_200,
        data: newSlide,
      };
    } catch (error) {
      handleInternalErrorException(
        'SlideService',
        'generateSlide',
        loggerMessages.slide.generateSlide.status_500,
        this.logger,
        error,
      );
    }
  }

  async updateSlide(
    slideId: string,
    updatedData: UpdateSlideDTO,
  ): Promise<Return> {
    try {
      const deletedProgress: Slide = await this.prismaService.slide.update({
        where: {
          id: slideId,
        },
        data: updatedData,
      });

      return {
        message: httpMessages_EN.slide.updateSlide.status_200,
        data: deletedProgress,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.slide.updateSlide.status_404,
        );
      }

      handleInternalErrorException(
        'SlideService',
        'updateSlide',
        loggerMessages.slide.updateSlide.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteSlide(slideId: string): Promise<Return> {
    try {
      const deletedProgress: Slide = await this.prismaService.slide.delete({
        where: {
          id: slideId,
        },
      });

      return {
        message: httpMessages_EN.slide.deleteSlide.status_200,
        data: deletedProgress,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.slide.deleteSlide.status_404,
        );
      }

      handleInternalErrorException(
        'SlideService',
        'deleteSlide',
        loggerMessages.slide.deleteSlide.status_500,
        this.logger,
        error,
      );
    }
  }
}
