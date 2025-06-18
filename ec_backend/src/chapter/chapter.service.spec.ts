import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ChapterService } from './chapter.service';
import Chapter from '../common/types/Chapter';
import { faker } from '@faker-js/faker/.';

describe('ChapterService', () => {
  let chapterService: ChapterService;
  let prismaService: PrismaService;
  let logger: Logger;
  let chapter: Chapter;
  let chapters: Chapter[];
  let emptyChapters: Chapter[];
  let error: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChapterService,
        {
          provide: PrismaService,
          useValue: {
            chapter: {
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

    chapterService = module.get<ChapterService>(ChapterService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
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
    emptyChapters = [];
    error = {
      code: 'P2025',
    };
  });

  it('should be defined', () => {
    expect(chapterService).toBeDefined();
  });

  describe('generateChapter()', () => {
    it('should generate a new chapter', async () => {
      jest
        .spyOn(chapterService, 'throwIfChapterExists')
        .mockResolvedValue(undefined);
      (prismaService.chapter.create as jest.Mock).mockResolvedValue(chapter);

      const result: Return = await chapterService.generateChapter(chapter);

      expect(result).toMatchObject({
        message: httpMessages_EN.chapter.generateChapter.status_200,
        data: chapter,
      });
      expect(chapterService.throwIfChapterExists).toHaveBeenCalledWith(chapter);
      expect(prismaService.chapter.create).toHaveBeenCalledWith({
        data: chapter,
      });
    });

    it('should throw ConflictException', async () => {
      jest
        .spyOn(chapterService, 'throwIfChapterExists')
        .mockRejectedValue(
          new ConflictException(
            httpMessages_EN.chapter.throwIfChapterExists.status_409,
          ),
        );

      await expect(chapterService.generateChapter(chapter)).rejects.toThrow(
        ConflictException,
      );

      expect(chapterService.throwIfChapterExists).toHaveBeenCalledWith(chapter);
    });

    it('should throw InternalErrorException', async () => {
      jest
        .spyOn(chapterService, 'throwIfChapterExists')
        .mockResolvedValue(undefined);
      (prismaService.chapter.create as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(chapterService.generateChapter(chapter)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(chapterService.throwIfChapterExists).toHaveBeenCalledWith(chapter);
      expect(prismaService.chapter.create).toHaveBeenCalledWith({
        data: chapter,
      });
    });
  });

  describe('fetchChapters()', () => {
    it('should fetch chapters', async () => {
      (prismaService.chapter.findMany as jest.Mock).mockResolvedValue(chapters);

      const result: Return = await chapterService.fetchChapters();

      expect(result).toMatchObject({
        message: httpMessages_EN.chapter.fetchChapters.status_200,
        data: chapters,
      });
      expect(prismaService.chapter.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (prismaService.chapter.findMany as jest.Mock).mockResolvedValue(
        emptyChapters,
      );

      await expect(chapterService.fetchChapters()).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.chapter.findMany).toHaveBeenCalled();
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.chapter.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(chapterService.fetchChapters()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.chapter.findMany).toHaveBeenCalled();
    });
  });

  describe('fetchChapterById()', () => {
    it('should fetch a chapter', async () => {
      (prismaService.chapter.findFirstOrThrow as jest.Mock).mockResolvedValue(
        chapter,
      );

      const result: Return = await chapterService.fetchChapterById(chapter.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.chapter.fetchChapterById.status_200,
        data: chapter,
      });
      expect(prismaService.chapter.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: chapter.id,
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.chapter.findFirstOrThrow as jest.Mock).mockRejectedValue(
        error,
      );

      await expect(chapterService.fetchChapterById(chapter.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.chapter.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: chapter.id,
        },
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.chapter.findFirstOrThrow as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(chapterService.fetchChapterById(chapter.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.chapter.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: chapter.id,
        },
      });
    });
  });

  describe('updateChapter()', () => {
    it('should fetch a chapter', async () => {
      (prismaService.chapter.update as jest.Mock).mockResolvedValue(chapter);

      const result: Return = await chapterService.updateChapter(
        chapter.id,
        chapter,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.chapter.updateChapter.status_200,
        data: chapter,
      });
      expect(prismaService.chapter.update).toHaveBeenCalledWith({
        where: {
          id: chapter.id,
        },
        data: chapter,
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.chapter.update as jest.Mock).mockRejectedValue(error);

      await expect(
        chapterService.updateChapter(chapter.id, chapter),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.chapter.update).toHaveBeenCalledWith({
        where: {
          id: chapter.id,
        },
        data: chapter,
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.chapter.update as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        chapterService.updateChapter(chapter.id, chapter),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prismaService.chapter.update).toHaveBeenCalledWith({
        where: {
          id: chapter.id,
        },
        data: chapter,
      });
    });
  });

  describe('deleteChapter()', () => {
    it('should fetch a chapter', async () => {
      (prismaService.chapter.delete as jest.Mock).mockResolvedValue(chapter);

      const result: Return = await chapterService.deleteChapter(chapter.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.chapter.deleteChapter.status_200,
        data: chapter,
      });
      expect(prismaService.chapter.delete).toHaveBeenCalledWith({
        where: {
          id: chapter.id,
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.chapter.delete as jest.Mock).mockRejectedValue(error);

      await expect(chapterService.deleteChapter(chapter.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.chapter.delete).toHaveBeenCalledWith({
        where: {
          id: chapter.id,
        },
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.chapter.delete as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(chapterService.deleteChapter(chapter.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.chapter.delete).toHaveBeenCalledWith({
        where: {
          id: chapter.id,
        },
      });
    });
  });
});
