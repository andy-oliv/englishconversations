import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { PrismaService } from '../prisma/prisma.service';
import Return from '../common/types/Return';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import ChapterProgress from '../entities/ChapterProgress';
import UnitProgress from '../entities/UnitProgress';
import Progress from '../common/types/Progress';
import httpMessages_EN from '../helper/messages/httpMessages.en';

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
      const currentChapter = await this.prismaService.userChapter.findFirst({
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
              file: {
                select: {
                  url: true,
                },
              },
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
}
