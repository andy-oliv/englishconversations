import { Test, TestingModule } from '@nestjs/testing';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import Chapter from '../common/types/Chapter';
import { faker } from '@faker-js/faker/.';

describe('ChapterController', () => {
  let chapterController: ChapterController;
  let chapterService: ChapterService;
  let chapter: Chapter;
  let chapters: Chapter[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChapterController],
      providers: [
        {
          provide: ChapterService,
          useValue: {
            generateChapter: jest.fn(),
            fetchChapters: jest.fn(),
            fetchChapterById: jest.fn(),
            updateChapter: jest.fn(),
            deleteChapter: jest.fn(),
          },
        },
      ],
    }).compile();

    chapterController = module.get<ChapterController>(ChapterController);
    chapterService = module.get<ChapterService>(ChapterService);
    chapter = {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      description: faker.person.bio(),
    };
    chapters = [
      {
        id: faker.string.uuid(),
        name: faker.person.firstName(),
        description: faker.person.bio(),
      },
      {
        id: faker.string.uuid(),
        name: faker.person.firstName(),
        description: faker.person.bio(),
      },
    ];
  });

  it('should be defined', () => {
    expect(chapterController).toBeDefined();
  });

  describe('generateChapter()', () => {
    it('should generate a chapter', async () => {
      (chapterService.generateChapter as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.chapter.generateChapter.status_200,
        data: chapter,
      });

      const result: Return = await chapterController.generateChapter(chapter);

      expect(result).toMatchObject({
        message: httpMessages_EN.chapter.generateChapter.status_200,
        data: chapter,
      });
      expect(chapterService.generateChapter).toHaveBeenCalledWith(chapter);
    });

    it('should throw ConflictException', async () => {
      (chapterService.generateChapter as jest.Mock).mockRejectedValue(
        new ConflictException(
          httpMessages_EN.chapter.throwIfChapterExists.status_409,
        ),
      );

      await expect(chapterService.generateChapter(chapter)).rejects.toThrow(
        ConflictException,
      );

      expect(chapterService.generateChapter).toHaveBeenCalledWith(chapter);
    });

    it('should throw InternalErrorException', async () => {
      (chapterService.generateChapter as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(chapterService.generateChapter(chapter)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(chapterService.generateChapter).toHaveBeenCalledWith(chapter);
    });
  });

  describe('fetchChapters()', () => {
    it('should fetch chapters', async () => {
      (chapterService.fetchChapters as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.chapter.fetchChapters.status_200,
        data: chapters,
      });

      const result: Return = await chapterController.fetchChapters();

      expect(result).toMatchObject({
        message: httpMessages_EN.chapter.fetchChapters.status_200,
        data: chapters,
      });
      expect(chapterService.fetchChapters).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (chapterService.fetchChapters as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.chapter.fetchChapters.status_404),
      );

      await expect(chapterService.fetchChapters()).rejects.toThrow(
        NotFoundException,
      );

      expect(chapterService.fetchChapters).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException', async () => {
      (chapterService.fetchChapters as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(chapterService.fetchChapters()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(chapterService.fetchChapters).toHaveBeenCalled();
    });
  });

  describe('fetchChapterById()', () => {
    it('should fetch chapter', async () => {
      (chapterService.fetchChapterById as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.chapter.fetchChapterById.status_200,
        data: chapter,
      });

      const result: Return = await chapterController.fetchChapterById(
        chapter.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.chapter.fetchChapterById.status_200,
        data: chapter,
      });
      expect(chapterService.fetchChapterById).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (chapterService.fetchChapterById as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.chapter.fetchChapterById.status_404,
        ),
      );

      await expect(chapterService.fetchChapterById(chapter.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(chapterService.fetchChapterById).toHaveBeenCalledWith(chapter.id);
    });

    it('should throw InternalServerErrorException', async () => {
      (chapterService.fetchChapterById as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(chapterService.fetchChapterById(chapter.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(chapterService.fetchChapterById).toHaveBeenCalledWith(chapter.id);
    });
  });

  describe('updateChapter()', () => {
    it('should update chapter', async () => {
      (chapterService.updateChapter as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.chapter.updateChapter.status_200,
        data: chapter,
      });

      const result: Return = await chapterController.updateChapter(
        chapter.id,
        chapter,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.chapter.updateChapter.status_200,
        data: chapter,
      });
      expect(chapterService.updateChapter).toHaveBeenCalledWith(
        chapter.id,
        chapter,
      );
    });

    it('should throw NotFoundException', async () => {
      (chapterService.updateChapter as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.chapter.updateChapter.status_404),
      );

      await expect(
        chapterService.updateChapter(chapter.id, chapter),
      ).rejects.toThrow(NotFoundException);

      expect(chapterService.updateChapter).toHaveBeenCalledWith(
        chapter.id,
        chapter,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (chapterService.updateChapter as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        chapterService.updateChapter(chapter.id, chapter),
      ).rejects.toThrow(InternalServerErrorException);

      expect(chapterService.updateChapter).toHaveBeenCalledWith(
        chapter.id,
        chapter,
      );
    });
  });

  describe('deleteChapter()', () => {
    it('should fetch chapter', async () => {
      (chapterService.deleteChapter as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.chapter.deleteChapter.status_200,
        data: chapter,
      });

      const result: Return = await chapterController.deleteChapter(chapter.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.chapter.deleteChapter.status_200,
        data: chapter,
      });
      expect(chapterService.deleteChapter).toHaveBeenCalledWith(chapter.id);
    });

    it('should throw NotFoundException', async () => {
      (chapterService.deleteChapter as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.chapter.deleteChapter.status_404),
      );

      await expect(chapterService.deleteChapter(chapter.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(chapterService.deleteChapter).toHaveBeenCalledWith(chapter.id);
    });

    it('should throw InternalServerErrorException', async () => {
      (chapterService.deleteChapter as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(chapterService.deleteChapter(chapter.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(chapterService.deleteChapter).toHaveBeenCalledWith(chapter.id);
    });
  });
});
