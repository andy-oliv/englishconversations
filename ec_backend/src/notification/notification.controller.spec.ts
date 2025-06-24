import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import Notification from '../entities/Notification';
import generateMockNotification from '../helper/mocks/generateMockNotification';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('NotificationController', () => {
  let notificationController: NotificationController;
  let notificationService: NotificationService;
  let notification: Notification;
  let notifications: Notification[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: {
            generateNotification: jest.fn(),
            fetchNotifications: jest.fn(),
            fetchNotificationById: jest.fn(),
            updateNotification: jest.fn(),
            deleteNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    notificationController = module.get<NotificationController>(
      NotificationController,
    );
    notificationService = module.get<NotificationService>(NotificationService);
    (notification = generateMockNotification()),
      (notifications = [
        generateMockNotification(),
        generateMockNotification(),
      ]);
  });

  it('should be defined', () => {
    expect(notificationController).toBeDefined();
  });

  describe('generateNotification()', () => {
    it('should generate a notification', async () => {
      (notificationService.generateNotification as jest.Mock).mockResolvedValue(
        {
          message: httpMessages_EN.notification.generateNotification.status_200,
          data: notification,
        },
      );

      const result: Return =
        await notificationController.generateNotification(notification);

      expect(result).toMatchObject({
        message: httpMessages_EN.notification.generateNotification.status_200,
        data: notification,
      });
    });

    it('should throw InternalServerErrorException', async () => {
      (notificationService.generateNotification as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        notificationController.generateNotification(notification),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('fetchNotifications()', () => {
    it('should fetch all notifications', async () => {
      (notificationService.fetchNotifications as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.notification.fetchNotifications.status_200,
        data: notifications,
      });

      const result: Return = await notificationController.fetchNotifications();

      expect(result).toMatchObject({
        message: httpMessages_EN.notification.fetchNotifications.status_200,
        data: notifications,
      });
      expect(notificationService.fetchNotifications).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (notificationService.fetchNotifications as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.notification.fetchNotifications.status_404,
        ),
      );

      await expect(notificationController.fetchNotifications()).rejects.toThrow(
        NotFoundException,
      );
      expect(notificationService.fetchNotifications).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException', async () => {
      (notificationService.fetchNotifications as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(notificationController.fetchNotifications()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(notificationService.fetchNotifications).toHaveBeenCalled();
    });
  });

  describe('fetchNotificationById()', () => {
    it('should fetch a notification', async () => {
      (
        notificationService.fetchNotificationById as jest.Mock
      ).mockResolvedValue({
        message: httpMessages_EN.notification.fetchNotificationById.status_200,
        data: notification,
      });

      const result: Return = await notificationController.fetchNotificationById(
        notification.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.notification.fetchNotificationById.status_200,
        data: notification,
      });
      expect(notificationService.fetchNotificationById).toHaveBeenCalledWith(
        notification.id,
      );
    });

    it('should throw NotFoundException', async () => {
      (
        notificationService.fetchNotificationById as jest.Mock
      ).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.notification.fetchNotificationById.status_404,
        ),
      );

      await expect(
        notificationController.fetchNotificationById(notification.id),
      ).rejects.toThrow(NotFoundException);

      expect(notificationService.fetchNotificationById).toHaveBeenCalledWith(
        notification.id,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (
        notificationService.fetchNotificationById as jest.Mock
      ).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        notificationController.fetchNotificationById(notification.id),
      ).rejects.toThrow(InternalServerErrorException);

      expect(notificationService.fetchNotificationById).toHaveBeenCalledWith(
        notification.id,
      );
    });
  });

  describe('updateNotification()', () => {
    it('should fetch a notification', async () => {
      (notificationService.updateNotification as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.notification.updateNotification.status_200,
        data: notification,
      });

      const result: Return = await notificationController.updateNotification(
        notification.id,
        notification,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.notification.updateNotification.status_200,
        data: notification,
      });
      expect(notificationService.updateNotification).toHaveBeenCalledWith(
        notification.id,
        notification,
      );
    });

    it('should throw NotFoundException', async () => {
      (notificationService.updateNotification as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.notification.updateNotification.status_404,
        ),
      );

      await expect(
        notificationController.updateNotification(
          notification.id,
          notification,
        ),
      ).rejects.toThrow(NotFoundException);

      expect(notificationService.updateNotification).toHaveBeenCalledWith(
        notification.id,
        notification,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (notificationService.updateNotification as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        notificationController.updateNotification(
          notification.id,
          notification,
        ),
      ).rejects.toThrow(InternalServerErrorException);

      expect(notificationService.updateNotification).toHaveBeenCalledWith(
        notification.id,
        notification,
      );
    });
  });

  describe('deleteNotification()', () => {
    it('should fetch a notification', async () => {
      (notificationService.deleteNotification as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.notification.deleteNotification.status_200,
        data: notification,
      });

      const result: Return = await notificationController.deleteNotification(
        notification.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.notification.deleteNotification.status_200,
        data: notification,
      });
      expect(notificationService.deleteNotification).toHaveBeenCalledWith(
        notification.id,
      );
    });

    it('should throw NotFoundException', async () => {
      (notificationService.deleteNotification as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.notification.deleteNotification.status_404,
        ),
      );

      await expect(
        notificationController.deleteNotification(notification.id),
      ).rejects.toThrow(NotFoundException);

      expect(notificationService.deleteNotification).toHaveBeenCalledWith(
        notification.id,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (notificationService.deleteNotification as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        notificationController.deleteNotification(notification.id),
      ).rejects.toThrow(InternalServerErrorException);

      expect(notificationService.deleteNotification).toHaveBeenCalledWith(
        notification.id,
      );
    });
  });
});
