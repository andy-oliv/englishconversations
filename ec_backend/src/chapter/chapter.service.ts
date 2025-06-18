import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Chapter from '../common/types/Chapter';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import UpdateChapterDTO from './dto/updateChapter.dto';
import generateExceptionMessage from '../helper/functions/generateExceptionMessage';

@Injectable()
export class ChapterService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

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

    try {
      const chapter: Chapter = await this.prismaService.chapter.create({
        data,
      });

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
      const chapters: Chapter[] = await this.prismaService.chapter.findMany();

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

      this.logger.warn({
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
