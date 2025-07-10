import { Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { PrismaService } from '../prisma/prisma.service';
import Return from '../common/types/Return';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import LoginLog from '../entities/LoginLog';
import * as dayjs from 'dayjs';

@Injectable()
export class LoginLogService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async generateLog(userId: string): Promise<void> {
    try {
      await this.prismaService.loginLog.create({
        data: {
          userId,
          loggedAt: dayjs().toDate(),
        },
      });
    } catch (error) {
      handleInternalErrorException(
        'loginLogService',
        'generateLog',
        loggerMessages.loginLog.generateLog.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchLogs(): Promise<Return> {
    try {
      const logs: Partial<LoginLog>[] =
        await this.prismaService.loginLog.findMany({
          select: {
            loggedAt: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            loggedAt: 'desc',
          },
        });

      if (logs.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.loginLog.fetchLogs.status_404,
        );
      }
      return {
        message: httpMessages_EN.loginLog.fetchLogs.status_200,
        data: logs,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'loginLogService',
        'fetchLogs',
        loggerMessages.loginLog.fetchLogs.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchTodayLogs(): Promise<Return> {
    try {
      const logs: Partial<LoginLog>[] =
        await this.prismaService.loginLog.findMany({
          where: {
            loggedAt: {
              gte: dayjs().startOf('day').toDate(),
              lt: dayjs().endOf('day').toDate(),
            },
          },
          select: {
            loggedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: {
            user: {
              name: 'desc',
            },
          },
        });

      if (logs.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.loginLog.fetchTodayLogs.status_404,
        );
      }
      return {
        message: httpMessages_EN.loginLog.fetchTodayLogs.status_200,
        data: logs,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'loginLogService',
        'fetchDailyLogs',
        loggerMessages.loginLog.fetchTodayLogs.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchMonthlyLogs(): Promise<Return> {
    try {
      const logs: Partial<LoginLog>[] =
        await this.prismaService.loginLog.findMany({
          where: {
            loggedAt: {
              gte: dayjs().startOf('month').toDate(),
              lt: dayjs().add(1, 'month').startOf('month').toDate(),
            },
          },
          select: {
            loggedAt: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            user: {
              name: 'desc',
            },
          },
        });

      if (logs.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.loginLog.fetchMonthlyLogs.status_404,
        );
      }
      return {
        message: httpMessages_EN.loginLog.fetchMonthlyLogs.status_200,
        data: logs,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'loginLogService',
        'fetchMonthlyLogs',
        loggerMessages.loginLog.fetchMonthlyLogs.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchUserLogs(userId: string): Promise<Return> {
    try {
      const logs: Partial<LoginLog>[] =
        await this.prismaService.loginLog.findMany({
          where: {
            userId,
          },
          select: {
            id: true,
            loggedAt: true,
          },
          orderBy: {
            loggedAt: 'desc',
          },
        });

      if (logs.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.loginLog.fetchUserLogs.status_404,
        );
      }

      return {
        message: httpMessages_EN.loginLog.fetchUserLogs.status_200,
        data: logs,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'loginLogService',
        'fetchUserLogs',
        loggerMessages.loginLog.fetchUserLogs.status_500,
        this.logger,
        error,
      );
    }
  }
}
