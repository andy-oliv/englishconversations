import { Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import Return from 'src/common/types/Return';
import Content from 'src/entities/Content';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateContentDTO from './dto/CreateContent.dto';
import handleInternalErrorException from 'src/helper/functions/handleErrorException';
import loggerMessages from 'src/helper/messages/loggerMessages';
import httpMessages_EN from 'src/helper/messages/httpMessages.en';
import User from 'src/entities/User';
import { Status } from '@prisma/client';

@Injectable()
export class ContentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  private async generateUserContent(
    contentId: number,
    unitId: number,
  ): Promise<void> {
    try {
      const users: Partial<User>[] = await this.prismaService.user.findMany({
        select: {
          id: true,
        },
      });

      const unit = await this.prismaService.unit.findUniqueOrThrow({
        where: {
          id: unitId,
        },
        include: {
          chapter: {
            select: {
              order: true,
            },
          },
        },
      });

      const progresses = users.map((user) =>
        unit.chapter.order === 1 && unit.order === 1
          ? { userId: user.id, contentId, status: Status.IN_PROGRESS }
          : { userId: user.id, contentId },
      );

      await this.prismaService.userContent.createMany({
        data: progresses,
        skipDuplicates: true,
      });
    } catch (error) {
      handleInternalErrorException(
        'ContentService',
        'generateUserContent',
        loggerMessages.content.generateUserContent.status_500,
        this.logger,
        error,
      );
    }
  }

  async createContent(contentData: CreateContentDTO): Promise<Return> {
    const contentNumber: number = await this.prismaService.content.count({
      where: {
        unitId: contentData.unitId,
      },
    });

    try {
      const content: Content = await this.prismaService.content.create({
        data: {
          unitId: contentData.unitId,
          contentType: contentData.contentType,
          videoId: contentData.videoId,
          slideshowId: contentData.slideshowId,
          quizId: contentData.quizId,
          order: contentNumber + 1,
        },
      });

      await this.generateUserContent(content.id, content.unitId);

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
