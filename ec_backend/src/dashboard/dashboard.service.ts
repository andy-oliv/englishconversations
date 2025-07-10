import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import User from '../entities/User';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import * as dayjs from 'dayjs';

@Injectable()
export class DashboardService {
  firstDay = dayjs().startOf('month');
  lastDay = dayjs(this.firstDay).endOf('month');

  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async fetchInfo(): Promise<Return> {
    try {
      const userProgresses: Partial<User>[] =
        await this.prismaService.user.findMany({
          select: {
            id: true,
            name: true,
            chapters: {
              select: {
                status: true,
              },
            },
          },
        });

      const latestLogins: Partial<User>[] =
        await this.prismaService.user.findMany({
          select: {
            id: true,
            name: true,
            lastLogin: true,
          },
          orderBy: {
            lastLogin: 'desc',
          },
        });

      const monthlyLoginsRaw = await this.prismaService.$queryRaw<
        { loginDate: string; logins: bigint }[]
      >`SELECT DATE(loggedAt) AS loginDate,
        COUNT(*) AS logins
      FROM loginLog
      WHERE loggedAt >= ${this.firstDay}
       AND loggedAt <= ${this.lastDay}
      GROUP BY DATE(loggedAt)
      ORDER BY loginDate;`;

      const monthlyLogins: { loginDate: string; logins: number }[] =
        monthlyLoginsRaw.map((entry) => ({
          loginDate: dayjs(entry.loginDate).add(1, 'day').format('DD/MM'),
          logins: Number(entry.logins), //avoid BigInt error
        }));

      const totalStudents: number = await this.prismaService.user.count({
        where: {
          role: 'STUDENT',
        },
      });

      const totalChapters: number = await this.prismaService.chapter.count();
      const totalUnits: number = await this.prismaService.unit.count();
      const totalVideos: number = await this.prismaService.video.count();
      const totalExercises: number = await this.prismaService.exercise.count();
      const notifications: Partial<Notification>[] =
        await this.prismaService.notification.findMany({
          take: 10,
          select: {
            id: true,
            title: true,
            content: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

      return {
        message: httpMessages_EN.dashboard.fetchInfo.status_200,
        data: {
          monthlyLogins,
          latestLogins,
          userProgresses,
          totalStudents,
          totalChapters,
          totalUnits,
          totalVideos,
          totalExercises,
          notifications,
        },
      };
    } catch (error) {
      handleInternalErrorException(
        'dashboardService',
        'fetchInfo',
        loggerMessages.dashboard.fetchInfo.status_500,
        this.logger,
        error,
      );
    }
  }
}
