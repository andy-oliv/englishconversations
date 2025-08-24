import { Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { PrismaService } from '../prisma/prisma.service';
import Return from '../common/types/Return';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import ChapterProgress from '../entities/ChapterProgress';
import UnitProgress from '../entities/UnitProgress';
import Progress from '../common/types/Progress';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import CurrentChapter from 'src/common/types/CurrentChapter';
import UserChapter from 'src/entities/userChapter';
import CurrentChapterProgress from 'src/entities/CurrentChapterProgress';

@Injectable()
export class UserProgressService {
  constructor(
    private readonly logger: Logger,
    private readonly prismaService: PrismaService,
  ) {}

  async fetchProgress(userId: string): Promise<Return> {
    try {
      const totalChapters: number = await this.prismaService.chapter.count();
      const totalUnits: number = await this.prismaService.unit.count();
      const totalTests: number = await this.prismaService.quiz.count({
        where: {
          isTest: true,
        },
      });
      const totalCompletedChapters: number =
        await this.prismaService.userChapter.count({
          where: {
            AND: [{ userId }, { status: 'COMPLETED' }],
          },
        });
      const totalCompletedUnits: number =
        await this.prismaService.userUnit.count({
          where: {
            AND: [{ userId }, { status: 'COMPLETED' }],
          },
        });
      const totalCompletedTests: number =
        await this.prismaService.answeredQuiz.count({
          where: {
            AND: [{ userId }, { quiz: { isTest: true } }],
          },
        });
      const chapterProgress: ChapterProgress[] =
        await this.prismaService.userChapter.findMany({
          where: {
            userId,
          },
          select: {
            id: true,
            status: true,
            progress: true,
            chapter: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        });
      const unitProgress: UnitProgress[] =
        await this.prismaService.userUnit.findMany({
          where: {
            userId,
          },
          select: {
            id: true,
            status: true,
            progress: true,
            unit: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        });
      const currentChapter: CurrentChapter =
        await this.prismaService.userChapter.findFirst({
          where: {
            AND: [{ userId }, { status: 'IN_PROGRESS' }],
          },
          orderBy: {
            updatedAt: 'desc',
          },
          take: 1,
          select: {
            chapter: {
              select: {
                name: true,
                description: true,
                imageUrl: true,
              },
            },
          },
        });

      const data: Progress = {
        currentChapter,
        totalChapters,
        totalUnits,
        totalTests,
        totalCompletedChapters,
        totalCompletedUnits,
        totalCompletedTests,
        chapterProgress,
        unitProgress,
      };
      return {
        message: httpMessages_EN.userProgress.fetchProgress.status_200,
        data,
      };
    } catch (error) {
      handleInternalErrorException(
        'UserProgressService',
        'fetchProgress',
        loggerMessages.userProgress.fetchProgress.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchCurrentChapterProgress(userId: string): Promise<Return> {
    try {
      const currentChapter: UserChapter =
        await this.prismaService.userChapter.findFirstOrThrow({
          where: {
            AND: [{ userId }, { status: 'IN_PROGRESS' }],
          },
        });

      const units = await this.prismaService.unit.findMany({
        where: {
          chapterId: currentChapter.chapterId,
        },
        orderBy: {
          order: 'asc',
        },
        include: {
          unitProgress: {
            where: {
              userId,
            },
            select: {
              id: true,
              progress: true,
              status: true,
            },
          },
          contents: {
            orderBy: {
              order: 'asc',
            },
            select: {
              id: true,
              contentType: true,
              order: true,
              quiz: {
                select: {
                  id: true,
                  isTest: true,
                  title: true,
                  description: true,
                },
              },
              video: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                },
              },
              slideshow: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                },
              },
              contentProgress: {
                where: {
                  userId,
                },
                select: {
                  id: true,
                  contentId: true,
                  progress: true,
                  status: true,
                  isFavorite: true,
                  notes: true,
                },
              },
            },
          },
        },
      });

      if (units.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.userProgress.fetchCurrentChapterProgress.status_4042,
        );
      }

      const normalizedUnits: CurrentChapterProgress[] = units.map((unit) => ({
        ...unit,
        unitProgress: unit.unitProgress[0] ?? null,
        contents: unit.contents.map((content) => ({
          ...content,
          contentProgress: content.contentProgress[0] ?? null,
        })),
      }));

      return {
        message:
          httpMessages_EN.userProgress.fetchCurrentChapterProgress.status_200,
        data: {
          ...currentChapter,
          units: normalizedUnits,
        },
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.userProgress.fetchCurrentChapterProgress.status_404,
        );
      }

      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'UserProgressService',
        'fetchCurrentChapterProgress',
        loggerMessages.userProgress.fetchCurrentChapterProgress.status_500,
        this.logger,
        error,
      );
    }
  }
}
