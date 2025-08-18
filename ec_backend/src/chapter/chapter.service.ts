import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Chapter from '../entities/Chapter';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import UpdateChapterDTO from './dto/updateChapter.dto';
import generateExceptionMessage from '../helper/functions/generateExceptionMessage';
import { S3Service } from '../s3/s3.service';
import { User } from '@prisma/client';

@Injectable()
export class ChapterService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly s3Service: S3Service,
  ) {}

  async generateUserChapterRelations(chapterId: string) {
    try {
      const users: { id: string }[] = await this.prismaService.user.findMany({
        select: { id: true },
      });

      const firstChapter: Chapter = await this.prismaService.chapter.findFirst({
        where: {
          order: 1,
        },
      });

      const progresses: { userId: string; chapterId: string }[] = users.map(
        (user) =>
          chapterId === firstChapter.id
            ? { userId: user.id, chapterId: chapterId, status: 'IN_PROGRESS' }
            : { userId: user.id, chapterId: chapterId },
      );

      await this.prismaService.userChapter.createMany({
        data: progresses,
        skipDuplicates: true,
      });
    } catch (error) {
      handleInternalErrorException(
        'ChapterService',
        'generateUserChapterRelations',
        loggerMessages.chapter.generateUserChapterRelations.status_500,
        this.logger,
        error,
      );
    }
  }

  async throwIfChapterExists(chapterData: Chapter): Promise<void> {
    try {
      const chapter: Chapter = await this.prismaService.chapter.findFirst({
        where: {
          AND: [
            { name: chapterData.name },
            { description: chapterData.description },
          ],
        },
      });

      if (chapter) {
        throw new ConflictException(
          httpMessages_EN.chapter.throwIfChapterExists.status_409,
        );
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      handleInternalErrorException(
        'chapterService',
        'throwIfChapterExists',
        loggerMessages.chapter.throwIfChapterExists.status_500,
        this.logger,
        error,
      );
    }
  }

  async generateChapter(data: Chapter): Promise<Return> {
    await this.throwIfChapterExists(data);
    const chapterNumber: number = await this.prismaService.chapter.count();
    data.order = chapterNumber + 1;

    try {
      const chapter: Chapter = await this.prismaService.chapter.create({
        data,
      });

      await this.generateUserChapterRelations(chapter.id);

      return {
        message: httpMessages_EN.chapter.generateChapter.status_200,
        data: chapter,
      };
    } catch (error) {
      handleInternalErrorException(
        'chapterService',
        'generateChapter',
        loggerMessages.chapter.generateChapter.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchChapters(): Promise<Return> {
    try {
      const chapters: Chapter[] = await this.prismaService.chapter.findMany({
        include: {
          units: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      });

      if (chapters.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.chapter.fetchChapters.status_404,
        );
      }

      return {
        message: httpMessages_EN.chapter.fetchChapters.status_200,
        data: chapters,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'chapterService',
        'fetchChapters',
        loggerMessages.chapter.fetchChapters.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchChapterById(id: string): Promise<Return> {
    try {
      const chapter: Chapter =
        await this.prismaService.chapter.findFirstOrThrow({
          where: {
            id,
          },
          include: {
            units: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        });

      return {
        message: httpMessages_EN.chapter.fetchChapterById.status_200,
        data: chapter,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.chapter.fetchChapterById.status_404,
        );
      }

      handleInternalErrorException(
        'chapterService',
        'fetchChapterById',
        loggerMessages.chapter.fetchChapterById.status_500,
        this.logger,
        error,
      );
    }
  }

  async updateChapter(
    id: string,
    updatedData: UpdateChapterDTO,
  ): Promise<Return> {
    try {
      const updatedchapter: Chapter = await this.prismaService.chapter.update({
        where: {
          id,
        },
        data: updatedData,
      });

      this.logger.log({
        message: generateExceptionMessage(
          'chapterService',
          'updateChapter',
          loggerMessages.chapter.updateChapter.status_200,
        ),
        data: updatedchapter,
      });

      return {
        message: httpMessages_EN.chapter.updateChapter.status_200,
        data: updatedchapter,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.chapter.updateChapter.status_404,
        );
      }

      handleInternalErrorException(
        'chapterService',
        'updateChapter',
        loggerMessages.chapter.updateChapter.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteChapter(id: string): Promise<Return> {
    try {
      const deletedchapter: Chapter = await this.prismaService.chapter.delete({
        where: {
          id,
        },
      });

      if (deletedchapter.imageUrl) {
        await this.s3Service.deleteFileFromS3(deletedchapter.imageUrl);
      }

      this.logger.log({
        message: generateExceptionMessage(
          'chapterService',
          'deleteChapter',
          loggerMessages.chapter.deleteChapter.status_200,
        ),
        data: deletedchapter,
      });

      return {
        message: httpMessages_EN.chapter.deleteChapter.status_200,
        data: deletedchapter,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.chapter.deleteChapter.status_404,
        );
      }

      handleInternalErrorException(
        'chapterService',
        'deleteChapter',
        loggerMessages.chapter.deleteChapter.status_500,
        this.logger,
        error,
      );
    }
  }
}
