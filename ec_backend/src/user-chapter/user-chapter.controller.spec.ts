import { Test, TestingModule } from '@nestjs/testing';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserChapterController } from './user-chapter.controller';
import { UserChapterService } from './user-chapter.service';
import UserChapter from '../entities/userChapter';
import generateMockUserChapter from '../helper/mocks/generateMockUserChapter';
import generateMockUser from '../helper/mocks/generateMockUser';

describe('UserChapterController', () => {
  let userChapterController: UserChapterController;
  let userChapterService: UserChapterService;
  let progress: UserChapter;
  let progresses: UserChapter[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserChapterController],
      providers: [
        {
          provide: UserChapterService,
          useValue: {
            generateUserChapter: jest.fn(),
            fetchUserChapters: jest.fn(),
            fetchUserChapterById: jest.fn(),
            updateUserChapter: jest.fn(),
            deleteUserChapter: jest.fn(),
          },
        },
      ],
    }).compile();

    userChapterController = module.get<UserChapterController>(
      UserChapterController,
    );
    userChapterService = module.get<UserChapterService>(UserChapterService);
    progress = generateMockUserChapter();
    progresses = [generateMockUserChapter(), generateMockUserChapter()];
  });

  it('should be defined', () => {
    expect(userChapterController).toBeDefined();
  });

  describe('generateUserChapter()', () => {
    it('should generate a userChapter', async () => {
      (userChapterService.generateUserChapter as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.userChapter.generateUserChapter.status_200,
        data: progress,
      });

      const result: Return =
        await userChapterController.generateUserChapter(progress);

      expect(result).toMatchObject({
        message: httpMessages_EN.userChapter.generateUserChapter.status_200,
        data: progress,
      });
      expect(userChapterService.generateUserChapter).toHaveBeenCalledWith(
        progress,
      );
    });

    it('should throw ConflictException', async () => {
      (userChapterService.generateUserChapter as jest.Mock).mockRejectedValue(
        new ConflictException(
          httpMessages_EN.userChapter.throwIfChapterExists.status_409,
        ),
      );

      await expect(
        userChapterService.generateUserChapter(progress),
      ).rejects.toThrow(ConflictException);

      expect(userChapterService.generateUserChapter).toHaveBeenCalledWith(
        progress,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (userChapterService.generateUserChapter as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userChapterService.generateUserChapter(progress),
      ).rejects.toThrow(InternalServerErrorException);

      expect(userChapterService.generateUserChapter).toHaveBeenCalledWith(
        progress,
      );
    });
  });

  describe('fetchUserChapters()', () => {
    it('should fetch userChapters', async () => {
      (userChapterService.fetchUserChapters as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.userChapter.fetchUserChapters.status_200,
        data: progress,
      });

      const result: Return = await userChapterController.fetchUserChapters();

      expect(result).toMatchObject({
        message: httpMessages_EN.userChapter.fetchUserChapters.status_200,
        data: progress,
      });
      expect(userChapterService.fetchUserChapters).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (userChapterService.fetchUserChapters as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.userChapter.fetchUserChapters.status_404,
        ),
      );

      await expect(userChapterService.fetchUserChapters()).rejects.toThrow(
        NotFoundException,
      );

      expect(userChapterService.fetchUserChapters).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException', async () => {
      (userChapterService.fetchUserChapters as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(userChapterService.fetchUserChapters()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(userChapterService.fetchUserChapters).toHaveBeenCalled();
    });
  });

  describe('fetchUserChapterById()', () => {
    it('should fetch userChapter', async () => {
      (userChapterService.fetchUserChapterById as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.userChapter.fetchUserChapterById.status_200,
        data: progress,
      });

      const result: Return = await userChapterController.fetchUserChapterById(
        progress.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.userChapter.fetchUserChapterById.status_200,
        data: progress,
      });
      expect(userChapterService.fetchUserChapterById).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (userChapterService.fetchUserChapterById as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.userChapter.fetchUserChapterById.status_404,
        ),
      );

      await expect(
        userChapterService.fetchUserChapterById(progress.id),
      ).rejects.toThrow(NotFoundException);

      expect(userChapterService.fetchUserChapterById).toHaveBeenCalledWith(
        progress.id,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (userChapterService.fetchUserChapterById as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userChapterService.fetchUserChapterById(progress.id),
      ).rejects.toThrow(InternalServerErrorException);

      expect(userChapterService.fetchUserChapterById).toHaveBeenCalledWith(
        progress.id,
      );
    });
  });

  describe('updateUserChapter()', () => {
    it('should update userChapter', async () => {
      (userChapterService.updateUserChapter as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.userChapter.updateUserChapter.status_200,
        data: progress,
      });

      const result: Return = await userChapterController.updateUserChapter(
        progress.id,
        progress,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.userChapter.updateUserChapter.status_200,
        data: progress,
      });
      expect(userChapterService.updateUserChapter).toHaveBeenCalledWith(
        progress.id,
        progress,
      );
    });

    it('should throw NotFoundException', async () => {
      (userChapterService.updateUserChapter as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.userChapter.updateUserChapter.status_404,
        ),
      );

      await expect(
        userChapterService.updateUserChapter(progress.id, progress),
      ).rejects.toThrow(NotFoundException);

      expect(userChapterService.updateUserChapter).toHaveBeenCalledWith(
        progress.id,
        progress,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (userChapterService.updateUserChapter as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userChapterService.updateUserChapter(progress.id, progress),
      ).rejects.toThrow(InternalServerErrorException);

      expect(userChapterService.updateUserChapter).toHaveBeenCalledWith(
        progress.id,
        progress,
      );
    });
  });

  describe('deleteUserChapter()', () => {
    it('should fetch userChapter', async () => {
      (userChapterService.deleteUserChapter as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.userChapter.deleteUserChapter.status_200,
        data: progress,
      });

      const result: Return = await userChapterController.deleteUserChapter(
        progress.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.userChapter.deleteUserChapter.status_200,
        data: progress,
      });
      expect(userChapterService.deleteUserChapter).toHaveBeenCalledWith(
        progress.id,
      );
    });

    it('should throw NotFoundException', async () => {
      (userChapterService.deleteUserChapter as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.userChapter.deleteUserChapter.status_404,
        ),
      );

      await expect(
        userChapterService.deleteUserChapter(progress.id),
      ).rejects.toThrow(NotFoundException);

      expect(userChapterService.deleteUserChapter).toHaveBeenCalledWith(
        progress.id,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (userChapterService.deleteUserChapter as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userChapterService.deleteUserChapter(progress.id),
      ).rejects.toThrow(InternalServerErrorException);

      expect(userChapterService.deleteUserChapter).toHaveBeenCalledWith(
        progress.id,
      );
    });
  });
});
