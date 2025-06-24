import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import UserChapter from '../entities/userChapter';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import loggerMessages from '../helper/messages/loggerMessages';
import UpdateUserChapterDTO from './dto/updateUserChapter.dto';

@Injectable()
export class UserChapterService {
  private readonly includedProgress = {
    user: {
      select: {
        id: true,
        name: true,
      },
    },
    chapter: {
      select: {
        id: true,
        name: true,
        description: true,
      },
    },
  };

  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async throwIfUserChapterExists(
    userId: string,
    chapterId: string,
  ): Promise<void> {
    try {
      const progressExists: UserChapter =
        await this.prismaService.userChapter.findFirst({
          where: {
            AND: [{ userId }, { chapterId }],
          },
        });

      if (progressExists) {
        throw new ConflictException(
          httpMessages_EN.userChapter.throwIfChapterExists.status_409,
        );
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      handleInternalErrorException(
        'userChapter',
        'throwIfUserChapterExists',
        loggerMessages.userChapter.throwIfUserChapterExists.status_500,
        this.logger,
        error,
      );
    }
  }

  async generateUserChapter(data: UserChapter): Promise<Return> {
    await this.throwIfUserChapterExists(data.userId, data.chapterId);

    try {
      const progress: UserChapter = await this.prismaService.userChapter.create(
        {
          data,
        },
      );

      return {
        message: httpMessages_EN.userChapter.generateUserChapter.status_200,
        data: progress,
      };
    } catch (error) {
      if (error.code === 'P2003') {
        throw new NotFoundException(
          httpMessages_EN.userChapter.generateUserChapter.status_404,
        );
      }

      handleInternalErrorException(
        'userChapterService',
        'generateUserChapter',
        loggerMessages.userChapter.generateUserChapter.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchUserChapters(): Promise<Return> {
    try {
      const progresses: UserChapter[] =
        await this.prismaService.userChapter.findMany();

      if (progresses.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.userChapter.fetchUserChapters.status_404,
        );
      }

      return {
        message: httpMessages_EN.userChapter.fetchUserChapters.status_200,
        data: progresses,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'userChapterService',
        'fetchUserChapters',
        loggerMessages.userChapter.fetchUserChapters.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchUserChapterById(id: string): Promise<Return> {
    try {
      const progress: UserChapter =
        await this.prismaService.userChapter.findFirstOrThrow({
          where: {
            id,
          },
          include: this.includedProgress,
        });

      return {
        message: httpMessages_EN.userChapter.fetchUserChapterById.status_200,
        data: progress,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.userChapter.fetchUserChapterById.status_404,
        );
      }

      handleInternalErrorException(
        'userChapterService',
        'fetchUserChapterById',
        loggerMessages.userChapter.fetchUserChapterById.status_500,
        this.logger,
        error,
      );
    }
  }

  async updateUserChapter(
    id: string,
    updatedData: UpdateUserChapterDTO,
  ): Promise<Return> {
    try {
      const updatedProgress: UserChapter =
        await this.prismaService.userChapter.update({
          where: {
            id,
          },
          data: updatedData,
        });

      return {
        message: httpMessages_EN.userChapter.updateUserChapter.status_200,
        data: updatedProgress,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.userChapter.updateUserChapter.status_404,
        );
      }

      handleInternalErrorException(
        'userChapterService',
        'updateUserChapter',
        loggerMessages.userChapter.updateUserChapter.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteUserChapter(id: string): Promise<Return> {
    try {
      const progress: UserChapter = await this.prismaService.userChapter.delete(
        {
          where: {
            id,
          },
        },
      );

      return {
        message: httpMessages_EN.userChapter.deleteUserChapter.status_200,
        data: progress,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.userChapter.deleteUserChapter.status_404,
        );
      }

      handleInternalErrorException(
        'userChapterService',
        'deleteUserChapter',
        loggerMessages.userChapter.deleteUserChapter.status_500,
        this.logger,
        error,
      );
    }
  }
}
