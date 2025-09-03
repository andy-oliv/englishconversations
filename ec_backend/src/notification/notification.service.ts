import { Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { PrismaService } from '../prisma/prisma.service';
import Notification from '../entities/Notification';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import UpdateNotificationDTO from './dto/updateNotification.dto';
import * as dayjs from 'dayjs';
import { UserNotification } from '../../generated/prisma';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async generateNotification(data: Notification): Promise<Return> {
    try {
      const newNotification: Notification =
        await this.prismaService.notification.create({
          data,
        });

      return {
        message: httpMessages_EN.notification.generateNotification.status_200,
        data: newNotification,
      };
    } catch (error) {
      handleInternalErrorException(
        'notificationService',
        'generateNotification',
        loggerMessages.notification.generateNotification.status_500,
        this.logger,
        error,
      );
    }
  }

  async createAndSendNotificationViaApp(
    data: Notification,
    userId: string,
  ): Promise<Return> {
    try {
      const notification: Notification =
        await this.prismaService.notification.create({
          data,
        });

      const newNotification: UserNotification =
        await this.prismaService.userNotification.create({
          data: {
            notificationId: notification.id,
            userId,
            deliveredAt: dayjs().toDate(),
            deliveredViaApp: true,
          },
          include: {
            notification: {
              select: {
                title: true,
                actionUrl: true,
                content: true,
              },
            },
          },
        });

      this.notificationGateway.server
        .to(userId)
        .emit('privateNotification', newNotification);

      return {
        message: httpMessages_EN.notification.generateNotification.status_200,
        data: newNotification,
      };
    } catch (error) {
      handleInternalErrorException(
        'notificationService',
        'createAndSendNotificationViaApp',
        loggerMessages.notification.generateNotification.status_500,
        this.logger,
        error,
      );
    }
  }

  async createAndSendBatchNotificationsViaApp(
    data: Notification,
    userIds: string[],
  ): Promise<{ message: string }> {
    try {
      const notification: Notification =
        await this.prismaService.notification.create({
          data,
        });

      const userNotifications = userIds.map((userId) => ({
        notificationId: notification.id,
        userId,
        deliveredAt: dayjs().toDate(),
        deliveredViaApp: true,
      }));

      await this.prismaService.userNotification.createMany({
        data: userNotifications,
        skipDuplicates: true,
      });

      const notifications: UserNotification[] =
        await this.prismaService.userNotification.findMany({
          where: {
            userId: {
              in: userIds.map((userId) => userId),
            },
            notificationId: notification.id,
          },
          include: {
            notification: {
              select: {
                title: true,
                actionUrl: true,
                content: true,
              },
            },
          },
        });

      notifications.forEach((notification) => {
        this.notificationGateway.server
          .to(notification.userId)
          .emit('privateNotification', notification);
      });

      return {
        message: httpMessages_EN.notification.generateNotification.status_200,
      };
    } catch (error) {
      handleInternalErrorException(
        'notificationService',
        'createAndSendBatchNotificationsViaApp',
        loggerMessages.notification.generateNotification.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchNotifications(): Promise<Return> {
    try {
      const notifications: Notification[] =
        await this.prismaService.notification.findMany();

      if (notifications.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.notification.fetchNotifications.status_404,
        );
      }

      return {
        message: httpMessages_EN.notification.fetchNotifications.status_200,
        data: notifications,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'notificationService',
        'fetchNotifications',
        loggerMessages.notification.fetchNotifications.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchNotificationById(id: number): Promise<Return> {
    try {
      const notification: Notification =
        await this.prismaService.notification.findFirstOrThrow({
          where: {
            id,
          },
        });

      return {
        message: httpMessages_EN.notification.fetchNotificationById.status_200,
        data: notification,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.notification.fetchNotificationById.status_404,
        );
      }

      handleInternalErrorException(
        'notificationService',
        'fetchNotificationById',
        loggerMessages.notification.fetchNotificationById.status_500,
        this.logger,
        error,
      );
    }
  }

  async updateNotification(
    id: number,
    updatedData: UpdateNotificationDTO,
  ): Promise<Return> {
    let date: Date;
    if (updatedData.expirationDate) {
      date = new Date(updatedData.expirationDate);
    }

    try {
      const notification: Notification =
        await this.prismaService.notification.update({
          where: {
            id,
          },
          data: {
            type: updatedData.type,
            title: updatedData.title,
            content: updatedData.content,
            actionUrl: updatedData.actionUrl,
            expirationDate: date,
          },
        });

      return {
        message: httpMessages_EN.notification.updateNotification.status_200,
        data: notification,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.notification.updateNotification.status_404,
        );
      }

      handleInternalErrorException(
        'notificationService',
        'updateNotification',
        loggerMessages.notification.updateNotification.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteNotification(id: number): Promise<Return> {
    try {
      const notification: Notification =
        await this.prismaService.notification.delete({
          where: {
            id,
          },
        });

      return {
        message: httpMessages_EN.notification.deleteNotification.status_200,
        data: notification,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.notification.deleteNotification.status_404,
        );
      }

      handleInternalErrorException(
        'notificationService',
        'deleteNotification',
        loggerMessages.notification.deleteNotification.status_500,
        this.logger,
        error,
      );
    }
  }
}
