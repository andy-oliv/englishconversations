import { Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import Return from 'src/common/types/Return';
import Content from 'src/entities/Content';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateContentDTO from './dto/CreateContent.dto';
import handleInternalErrorException from 'src/helper/functions/handleErrorException';
import loggerMessages from 'src/helper/messages/loggerMessages';
import httpMessages_EN from 'src/helper/messages/httpMessages.en';

@Injectable()
export class ContentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async createContent(contentData: CreateContentDTO): Promise<Return> {
    if (!contentData.order) {
      const contentNumber: number = await this.prismaService.content.count({
        where: {
          unitId: contentData.unitId,
        },
      });
      contentData.order = contentNumber + 1;
    }

    try {
      const content: Content = await this.prismaService.content.create({
        data: contentData as Content,
      });
      return {
        message: httpMessages_EN.content.createContent.status_201,
        data: content,
      };
    } catch (error) {
      handleInternalErrorException(
        'contentService',
        'createContent',
        loggerMessages.content.createContent.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchContents(): Promise<Return> {
    try {
      const contents: Content[] = await this.prismaService.content.findMany();

      if (contents.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.content.fetchContents.status_404,
        );
      }

      return {
        message: httpMessages_EN.content.fetchContents.status_200,
        data: contents,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'contentService',
        'fetchContents',
        loggerMessages.content.fetchContents.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchContentsByUnit(unitId: number): Promise<Return> {
    try {
      const contents: Content[] = await this.prismaService.content.findMany({
        where: {
          unitId,
        },
        orderBy: {
          order: 'asc',
        },
      });

      if (contents.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.content.fetchContentsByUnit.status_404,
        );
      }

      return {
        message: httpMessages_EN.content.fetchContentsByUnit.status_200,
        data: contents,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'contentService',
        'fetchContentsByUnit',
        loggerMessages.content.fetchContentsByUnit.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteContent(id: number): Promise<Return> {
    try {
      const deletedContent: Content = await this.prismaService.content.delete({
        where: {
          id,
        },
      });

      this.logger.log(loggerMessages.content.deleteContent.status_200, {
        context: 'contentService',
        action: 'deleteContent',
        contentData: deletedContent,
      });

      return {
        message: httpMessages_EN.content.deleteContent.status_200,
        data: deletedContent,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.content.deleteContent.status_404,
        );
      }

      handleInternalErrorException(
        'contentService',
        'deleteContent',
        loggerMessages.content.deleteContent.status_500,
        this.logger,
        error,
      );
    }
  }
}
