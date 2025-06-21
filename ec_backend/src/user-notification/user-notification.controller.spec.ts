import { Test, TestingModule } from '@nestjs/testing';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserNotificationController } from './user-notification.controller';
import { UserNotificationService } from './user-notification.service';
import UserNotification from '../common/types/UserNotification';
import generateMockUserNotification from '../helper/mocks/generateMockUserNotification';

describe('NotificationController', () => {
  let userNotificationController: UserNotificationController;
  let userNotificationService: UserNotificationService;
  let userNotification: UserNotification;
  let userNotifications: UserNotification[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserNotificationController],
      providers: [
        {
          provide: UserNotificationService,
          useValue: {
            generateUserNotification: jest.fn(),
            fetchUserNotifications: jest.fn(),
            deleteUserNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    userNotificationController = module.get<UserNotificationController>(
      UserNotificationController,
    );
    userNotificationService = module.get<UserNotificationService>(
      UserNotificationService,
    );
    userNotification = generateMockUserNotification();
    userNotifications = [
      generateMockUserNotification(),
      generateMockUserNotification(),
    ];
  });

  it('should be defined', () => {
    expect(userNotificationController).toBeDefined();
  });

  describe('generateUserNotification()', () => {
    it('should generate a notification', async () => {
      (
        userNotificationService.generateUserNotification as jest.Mock
      ).mockResolvedValue({
        message:
          httpMessages_EN.userNotification.generateUserNotification.status_200,
        data: userNotification,
      });

      const result: Return =
        await userNotificationController.generateUserNotification(
          userNotification,
        );

      expect(result).toMatchObject({
        message:
          httpMessages_EN.userNotification.generateUserNotification.status_200,
        data: userNotification,
      });
    });

    it('should throw InternalServerErrorException', async () => {
      (
        userNotificationService.generateUserNotification as jest.Mock
      ).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userNotificationController.generateUserNotification(userNotification),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('fetchUserNotifications()', () => {
    it('should fetch all notifications', async () => {
      (
        userNotificationService.fetchUserNotifications as jest.Mock
      ).mockResolvedValue({
        message:
          httpMessages_EN.userNotification.fetchUserNotifications.status_200,
        data: userNotifications,
      });

      const result: Return =
        await userNotificationController.fetchUserNotifications(
          userNotification.userId,
        );

      expect(result).toMatchObject({
        message:
          httpMessages_EN.userNotification.fetchUserNotifications.status_200,
        data: userNotifications,
      });
      expect(
        userNotificationService.fetchUserNotifications,
      ).toHaveBeenCalledWith(userNotification.userId);
    });

    it('should throw NotFoundException', async () => {
      (
        userNotificationService.fetchUserNotifications as jest.Mock
      ).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.userNotification.fetchUserNotifications.status_404,
        ),
      );

      await expect(
        userNotificationController.fetchUserNotifications(
          userNotification.userId,
        ),
      ).rejects.toThrow(NotFoundException);
      expect(
        userNotificationService.fetchUserNotifications,
      ).toHaveBeenCalledWith(userNotification.userId);
    });

    it('should throw InternalServerErrorException', async () => {
      (
        userNotificationService.fetchUserNotifications as jest.Mock
      ).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userNotificationController.fetchUserNotifications(
          userNotification.userId,
        ),
      ).rejects.toThrow(InternalServerErrorException);
      expect(
        userNotificationService.fetchUserNotifications,
      ).toHaveBeenCalledWith(userNotification.userId);
    });
  });

  describe('deleteUserNotification()', () => {
    it('should fetch a notification', async () => {
      (
        userNotificationService.deleteUserNotification as jest.Mock
      ).mockResolvedValue({
        message:
          httpMessages_EN.userNotification.deleteUserNotification.status_200,
        data: userNotification,
      });

      const result: Return =
        await userNotificationController.deleteUserNotification(
          userNotification.id,
        );

      expect(result).toMatchObject({
        message:
          httpMessages_EN.userNotification.deleteUserNotification.status_200,
        data: userNotification,
      });
      expect(
        userNotificationService.deleteUserNotification,
      ).toHaveBeenCalledWith(userNotification.id);
    });

    it('should throw NotFoundException', async () => {
      (
        userNotificationService.deleteUserNotification as jest.Mock
      ).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.userNotification.deleteUserNotification.status_404,
        ),
      );

      await expect(
        userNotificationController.deleteUserNotification(userNotification.id),
      ).rejects.toThrow(NotFoundException);

      expect(
        userNotificationService.deleteUserNotification,
      ).toHaveBeenCalledWith(userNotification.id);
    });

    it('should throw InternalServerErrorException', async () => {
      (
        userNotificationService.deleteUserNotification as jest.Mock
      ).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userNotificationController.deleteUserNotification(userNotification.id),
      ).rejects.toThrow(InternalServerErrorException);

      expect(
        userNotificationService.deleteUserNotification,
      ).toHaveBeenCalledWith(userNotification.id);
    });
  });
});
