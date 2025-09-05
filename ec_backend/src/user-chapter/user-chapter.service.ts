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
import Chapter from 'src/entities/Chapter';
import { CEFRLevels, Status, Unit, UserContent } from '@prisma/client';
import UserUnit from 'src/entities/UserUnit';
import * as dayjs from 'dayjs';
import { UserProgressService } from 'src/user-progress/user-progress.service';
import Content from '../entities/Content';

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
    private readonly userProgressService: UserProgressService,
  ) {}

  async syncUserLanguageLevel(
    userId: string,
    nextChapterName: string,
  ): Promise<void> {
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          languageLevel: CEFRLevels[nextChapterName],
        },
      });
    } catch (error) {
      handleInternalErrorException(
        'UserChapterService',
        'syncUserLanguageLevel',
        loggerMessages.userChapter.syncUserLanguageLevel.status_500,
        this.logger,
        error,
      );
    }
  }

  //this function was created in order to avoid circular dependencies between userChapter and userUnit
  async unlockFirstUnit(userId: string, nextChapterId: string): Promise<void> {
    try {
      const nextChapterFirstUnit: Unit =
        await this.prismaService.unit.findFirst({
          where: {
            chapterId: nextChapterId,
          },
          orderBy: { order: 'asc' },
        });

      if (nextChapterFirstUnit) {
        const firstUnitProgress: UserUnit =
          await this.prismaService.userUnit.findFirst({
            where: {
              unitId: nextChapterFirstUnit.id,
              userId,
            },
          });

        if (firstUnitProgress.status === Status.LOCKED) {
          await this.prismaService.userUnit.update({
            where: {
              id: firstUnitProgress.id,
            },
            data: {
              status: Status.IN_PROGRESS,
            },
          });

          //unlocking the first content from the unit
          const firstContent: Content =
            await this.prismaService.content.findFirst({
              where: {
                unitId: nextChapterFirstUnit.id,
              },
              orderBy: { order: 'asc' },
            });

          const firstContentProgress: UserContent =
            await this.prismaService.userContent.findFirst({
              where: {
                contentId: firstContent.id,
                userId,
              },
            });

          await this.prismaService.userContent.update({
            where: {
              id: firstContentProgress.id,
            },
            data: {
              status: Status.IN_PROGRESS,
            },
          });
        }
      }
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.userChapter.unlockFirstUnit.status_404,
        );
      }

      handleInternalErrorException(
        'UserChapterService',
        'unlockFirstUnit',
        loggerMessages.userChapter.unlockFirstUnit.status_500,
        this.logger,
        error,
      );
    }
  }

  async unlockNextChapter(
    userId: string,
    currentChapterId: string,
  ): Promise<void> {
    try {
      const currentChapter: Chapter =
        await this.prismaService.chapter.findUniqueOrThrow({
          where: {
            id: currentChapterId,
          },
        });

      const currentChapterProgress: UserChapter =
        await this.prismaService.userChapter.findFirst({
          where: {
            userId,
            chapterId: currentChapterId,
          },
        });

      if (currentChapterProgress.status === Status.IN_PROGRESS) {
        await this.prismaService.userChapter.update({
          where: {
            id: currentChapterProgress.id,
          },
          data: {
            status: Status.COMPLETED,
            completedAt: dayjs().toISOString(),
          },
        });
      }

      const nextChapter: Chapter = await this.prismaService.chapter.findFirst({
        where: { order: { gt: currentChapter.order } },
        orderBy: { order: 'asc' },
      });

      if (nextChapter) {
        const userNextChapterProgress: UserChapter =
          await this.prismaService.userChapter.findFirstOrThrow({
            where: {
              chapterId: nextChapter.id,
              userId,
            },
          });

        if (userNextChapterProgress.status === Status.LOCKED) {
          await this.prismaService.userChapter.update({
            where: {
              id: userNextChapterProgress.id,
            },
            data: {
              status: Status.IN_PROGRESS,
            },
          });

          await this.unlockFirstUnit(userId, nextChapter.id);
          await this.syncUserLanguageLevel(userId, nextChapter.name);
        }
      }
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.userChapter.unlockNextChapter.status_404,
        );
      }

      handleInternalErrorException(
        'UserChapterService',
        'unlockNextChapter',
        loggerMessages.userChapter.unlockNextChapter.status_500,
        this.logger,
        error,
      );
    }
  }

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

  async fetchUserChaptersByUser(userId: string): Promise<Return> {
    try {
      const progresses: UserChapter[] =
        await this.prismaService.userChapter.findMany({
          where: {
            userId: userId,
          },
          include: this.includedProgress,
        });

      if (progresses.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.userChapter.fetchUserChaptersByUser.status_404,
        );
      }

      return {
        message: httpMessages_EN.userChapter.fetchUserChaptersByUser.status_200,
        data: progresses,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'userChapterService',
        'fetchUserChaptersByUser',
        loggerMessages.userChapter.fetchUserChaptersByUser.status_500,
        this.logger,
        error,
      );
    }
  }

  async updateUserChapter(
    id: string,
    userId: string,
    updatedData: UpdateUserChapterDTO,
  ): Promise<Return> {
    try {
      const updatedProgress: UserChapter =
        await this.prismaService.userChapter.update({
          where: {
            id,
            userId,
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

  async completeChapter(id: string, userId: string): Promise<Return> {
    try {
      const updatedProgress: UserChapter =
        await this.prismaService.userChapter.update({
          where: {
            id,
            userId,
          },
          data: {
            status: Status.COMPLETED,
            progress: 1,
            completedAt: dayjs().toISOString(),
          },
        });

      await this.unlockNextChapter(userId, updatedProgress.chapterId);

      return await this.userProgressService.fetchCurrentChapterProgress(userId);
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
