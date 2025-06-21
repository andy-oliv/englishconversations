import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import Notification from '../common/types/Notification';
import generateMockNotification from '../helper/mocks/generateMockNotification';
describe('NotificationService', () => {
  let notificationService: NotificationService;
  let prismaService: PrismaService;
  let logger: Logger;
  let notification: Notification;
  let notifications: Notification[];
  let emptyNotifications: Notification[];
  let errorP2025: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaService,
          useValue: {
            notification: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirstOrThrow: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn,
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    notificationService = module.get<NotificationService>(NotificationService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
    notification = generateMockNotification();
    notifications = [generateMockNotification(), generateMockNotification()];
    emptyNotifications = [];
    errorP2025 = {
      code: 'P2025',
    };
  });

  it('should be defined', () => {
    expect(notificationService).toBeDefined();
  });

  describe('generateNotification()', () => {
    it('should generate a new notification', async () => {
      (prismaService.notification.create as jest.Mock).mockResolvedValue(
        notification,
      );

      const result: Return =
        await notificationService.generateNotification(notification);

      expect(result).toMatchObject({
        message: httpMessages_EN.notification.generateNotification.status_200,
        data: notification,
      });
      expect(prismaService.notification.create).toHaveBeenCalledWith({
        data: notification,
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.notification.create as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        notificationService.generateNotification(notification),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaService.notification.create).toHaveBeenCalledWith({
        data: notification,
      });
    });
  });

  describe('fetchNotifications()', () => {
    it('should fetch notifications', async () => {
      (prismaService.notification.findMany as jest.Mock).mockResolvedValue(
        notifications,
      );

      const result: Return = await notificationService.fetchNotifications();

      expect(result).toMatchObject({
        message: httpMessages_EN.notification.fetchNotifications.status_200,
        data: notifications,
      });
      expect(prismaService.notification.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (prismaService.notification.findMany as jest.Mock).mockResolvedValue(
        emptyNotifications,
      );

      await expect(notificationService.fetchNotifications()).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.notification.findMany).toHaveBeenCalled();
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.notification.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(notificationService.fetchNotifications()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.notification.findMany).toHaveBeenCalled();
    });
  });

  describe('fetchNotificationById()', () => {
    it('should fetch a notification', async () => {
      (
        prismaService.notification.findFirstOrThrow as jest.Mock
      ).mockResolvedValue(notification);

      const result: Return = await notificationService.fetchNotificationById(
        notification.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.notification.fetchNotificationById.status_200,
        data: notification,
      });
      expect(prismaService.notification.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: notification.id,
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (
        prismaService.notification.findFirstOrThrow as jest.Mock
      ).mockRejectedValue(errorP2025);

      await expect(
        notificationService.fetchNotificationById(notification.id),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.notification.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: notification.id,
        },
      });
    });

    it('should throw InternalErrorException', async () => {
      (
        prismaService.notification.findFirstOrThrow as jest.Mock
      ).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        notificationService.fetchNotificationById(notification.id),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaService.notification.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: notification.id,
        },
      });
    });
  });

  describe('updateNotification()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });
    it('should update a notification', async () => {
      jest.setSystemTime(new Date());
      notification.expirationDate = new Date();
      (prismaService.notification.update as jest.Mock).mockResolvedValue(
        notification,
      );

      const result: Return = await notificationService.updateNotification(
        notification.id,
        notification,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.notification.updateNotification.status_200,
        data: notification,
      });
      expect(prismaService.notification.update).toHaveBeenCalledWith({
        where: {
          id: notification.id,
        },
        data: {
          type: notification.type,
          title: notification.title,
          content: notification.content,
          actionUrl: notification.actionUrl,
          expirationDate: new Date(),
        },
      });
    });

    it('should throw NotFoundException', async () => {
      jest.setSystemTime(new Date());
      notification.expirationDate = new Date();
      (prismaService.notification.update as jest.Mock).mockRejectedValue(
        errorP2025,
      );

      await expect(
        notificationService.updateNotification(notification.id, notification),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.notification.update).toHaveBeenCalledWith({
        where: {
          id: notification.id,
        },
        data: {
          type: notification.type,
          title: notification.title,
          content: notification.content,
          actionUrl: notification.actionUrl,
          expirationDate: new Date(),
        },
      });
    });

    it('should throw InternalErrorException', async () => {
      jest.setSystemTime(new Date());
      notification.expirationDate = new Date();
      (prismaService.notification.update as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        notificationService.updateNotification(notification.id, notification),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaService.notification.update).toHaveBeenCalledWith({
        where: {
          id: notification.id,
        },
        data: {
          type: notification.type,
          title: notification.title,
          content: notification.content,
          actionUrl: notification.actionUrl,
          expirationDate: new Date(),
        },
      });
    });
  });

  describe('deleteNotification()', () => {
    it('should fetch a notification', async () => {
      (prismaService.notification.delete as jest.Mock).mockResolvedValue(
        notification,
      );

      const result: Return = await notificationService.deleteNotification(
        notification.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.notification.deleteNotification.status_200,
        data: notification,
      });
      expect(prismaService.notification.delete).toHaveBeenCalledWith({
        where: {
          id: notification.id,
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.notification.delete as jest.Mock).mockRejectedValue(
        errorP2025,
      );

      await expect(
        notificationService.deleteNotification(notification.id),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.notification.delete).toHaveBeenCalledWith({
        where: {
          id: notification.id,
        },
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.notification.delete as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        notificationService.deleteNotification(notification.id),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaService.notification.delete).toHaveBeenCalledWith({
        where: {
          id: notification.id,
        },
      });
    });
  });
});
