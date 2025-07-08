import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import User from '../entities/User';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async fetchInfo(): Promise<Return> {
    try {
      const users: User[] = await this.prismaService.user.findMany({
        take: 6,
        orderBy: {
          lastLogin: 'desc',
        },
      });

      const students: number = await this.prismaService.user.count({
        where: {
          role: 'STUDENT',
        },
      });

      const units: number = await this.prismaService.unit.count();
      const videos: number = await this.prismaService.video.count();
      const exercises: number = await this.prismaService.exercise.count();

      return {
        message: httpMessages_EN.dashboard.fetchInfo.status_200,
        data: {
          users,
          students,
          videos,
          units,
          exercises,
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
