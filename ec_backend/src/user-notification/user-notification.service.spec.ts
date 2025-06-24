import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserNotificationService } from './user-notification.service';
import UserNotification from '../entities/UserNotification';
import generateMockUserNotification from '../helper/mocks/generateMockUserNotification';
import dayjs, { Dayjs } from 'dayjs';

jest.mock('dayjs');

describe('UserNotificationService', () => {
  let userNotificationService: UserNotificationService;
  let prismaService: PrismaService;
  let logger: Logger;
  let notification: UserNotification;
  let notifications: UserNotification[];
  let emptyNotification: UserNotification[];
  let error: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserNotificationService,
        {
          provide: PrismaService,
          useValue: {
            userNotification: {
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

    userNotificationService = module.get<UserNotificationService>(
      UserNotificationService,
    );
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
    notification = generateMockUserNotification();
    notifications = [
      generateMockUserNotification(),
      generateMockUserNotification(),
    ];
    emptyNotification = [];
    error = {
      code: 'P2025',
    };
  });

  it('should be defined', () => {
    expect(userNotificationService).toBeDefined();
  });

  describe('generateUserNotification()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });
    it('should generate a new notification', async () => {
      jest.setSystemTime(new Date());
      (prismaService.userNotification.create as jest.Mock).mockResolvedValue(
        notification,
      );

      const result: Return =
        await userNotificationService.generateUserNotification(notification);

      expect(result).toMatchObject({
        message:
          httpMessages_EN.userNotification.generateUserNotification.status_200,
        data: notification,
      });
      expect(prismaService.userNotification.create).toHaveBeenCalledWith({
        data: {
          userId: notification.userId,
          notificationId: notification.notificationId,
          deliveredAt: new Date(),
        },
      });
    });

    it('should throw InternalErrorException', async () => {
      jest.setSystemTime(new Date());
      (prismaService.userNotification.create as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userNotificationService.generateUserNotification(notification),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaService.userNotification.create).toHaveBeenCalledWith({
        data: {
          userId: notification.userId,
          notificationId: notification.notificationId,
          deliveredAt: new Date(),
        },
      });
    });
  });

  describe('fetchUserNotifications()', () => {
    it('should fetch notifications', async () => {
      (prismaService.userNotification.findMany as jest.Mock).mockResolvedValue(
        notifications,
      );

      const result: Return =
        await userNotificationService.fetchUserNotifications(
          notification.userId,
        );

      expect(result).toMatchObject({
        message:
          httpMessages_EN.userNotification.fetchUserNotifications.status_200,
        data: notifications,
      });
      expect(prismaService.userNotification.findMany).toHaveBeenCalledWith({
        where: {
          userId: notification.userId,
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
    });

    it('should throw NotFoundException', async () => {
      (prismaService.userNotification.findMany as jest.Mock).mockResolvedValue(
        emptyNotification,
      );

      await expect(
        userNotificationService.fetchUserNotifications(notification.userId),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.userNotification.findMany).toHaveBeenCalledWith({
        where: {
          userId: notification.userId,
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
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.userNotification.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userNotificationService.fetchUserNotifications(notification.userId),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaService.userNotification.findMany).toHaveBeenCalledWith({
        where: {
          userId: notification.userId,
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
    });
  });

  describe('deleteUserNotification()', () => {
    it('should fetch a notification', async () => {
      (prismaService.userNotification.delete as jest.Mock).mockResolvedValue(
        notification,
      );

      const result: Return =
        await userNotificationService.deleteUserNotification(notification.id);

      expect(result).toMatchObject({
        message:
          httpMessages_EN.userNotification.deleteUserNotification.status_200,
        data: notification,
      });
      expect(prismaService.userNotification.delete).toHaveBeenCalledWith({
        where: {
          id: notification.id,
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.userNotification.delete as jest.Mock).mockRejectedValue(
        error,
      );

      await expect(
        userNotificationService.deleteUserNotification(notification.id),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.userNotification.delete).toHaveBeenCalledWith({
        where: {
          id: notification.id,
        },
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.userNotification.delete as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userNotificationService.deleteUserNotification(notification.id),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaService.userNotification.delete).toHaveBeenCalledWith({
        where: {
          id: notification.id,
        },
      });
    });
  });
});
