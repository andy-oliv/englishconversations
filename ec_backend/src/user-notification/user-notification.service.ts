import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import UserNotification from '../common/types/UserNotification';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import loggerMessages from '../helper/messages/loggerMessages';
import generateUserNotificationDTO from './dto/generateUserNotification.dto';

@Injectable()
export class UserNotificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async generateUserNotification(
    data: generateUserNotificationDTO,
  ): Promise<Return> {
    try {
      const newNotification: UserNotification =
        await this.prismaService.userNotification.create({
          data: {
            userId: data.userId,
            notificationId: data.notificationId,
            deliveredAt: new Date(),
          },
        });

      return {
        message:
          httpMessages_EN.userNotification.generateUserNotification.status_200,
        data: newNotification,
      };
    } catch (error) {
      if (error.code === 'P2003') {
        throw new NotFoundException(
          httpMessages_EN.userNotification.generateUserNotification.status_404,
        );
      }

      handleInternalErrorException(
        'userNotificationService',
        'generateUserNotification',
        loggerMessages.userNotification.generateUserNotification.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchUserNotifications(userId: string): Promise<Return> {
    try {
      const userNotifications: UserNotification[] =
        await this.prismaService.userNotification.findMany({
          where: {
            userId,
          },
          include: {
            notification: {
              select: {
                id: true,
                type: true,
                title: true,
                content: true,
                actionUrl: true,
              },
            },
          },
        });

      if (userNotifications.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.userNotification.fetchUserNotifications.status_404,
        );
      }

      return {
        message:
          httpMessages_EN.userNotification.fetchUserNotifications.status_200,
        data: userNotifications,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'userNotificationService',
        'fetchUserNotifications',
        loggerMessages.userNotification.fetchUserNotifications.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteUserNotification(id: string): Promise<Return> {
    try {
      const userNotification: UserNotification =
        await this.prismaService.userNotification.delete({
          where: {
            id,
          },
        });

      return {
        message:
          httpMessages_EN.userNotification.deleteUserNotification.status_200,
        data: userNotification,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.userNotification.deleteUserNotification.status_404,
        );
      }

      handleInternalErrorException(
        'userNotificationService',
        'deleteUserNotification',
        loggerMessages.userNotification.deleteUserNotification.status_500,
        this.logger,
        error,
      );
    }
  }
}
