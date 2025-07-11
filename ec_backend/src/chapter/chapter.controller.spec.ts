import { Test, TestingModule } from '@nestjs/testing';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import Chapter from '../entities/Chapter';
import { faker } from '@faker-js/faker/.';
import FormDataHandler from '../helper/functions/formDataHandler';
import GenerateChapterDTO from './dto/generateChapter.dto';
import { S3Service } from '../s3/s3.service';
import { Logger } from 'nestjs-pino';
import { FileService } from '../file/file.service';
import FormHandlerReturn from '../common/types/FormHandlerReturn';
import allowedTypes from '../helper/functions/allowedTypes';
import updateFormHandler from '../helper/functions/updateFormHandler';
import UpdateChapterDTO from './dto/updateChapter.dto';

jest.mock('../helper/functions/formDataHandler');
jest.mock('../helper/functions/templates/updateFormHandler');
jest.mock('../helper/functions/allowedTypes');

describe('ChapterController', () => {
  let chapterController: ChapterController;
  let chapterService: ChapterService;
  let s3Service: S3Service;
  let fileService: FileService;
  let logger: Logger;
  let chapter: Chapter;
  let chapters: Chapter[];
  let uploadedFile: Express.Multer.File;
  let metadata: string;
  let returnedData: FormHandlerReturn;
  let thumbnail: Return;

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
        {
          provide: S3Service,
          useValue: {},
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: FileService,
          useValue: {
            generateFile: jest.fn(),
          },
        },
      ],
    }).compile();

    chapterController = module.get<ChapterController>(ChapterController);
    chapterService = module.get<ChapterService>(ChapterService);
    s3Service = module.get<S3Service>(S3Service);
    fileService = module.get<FileService>(FileService);
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
    uploadedFile = {
      fieldname: 'file',
      originalname: 'test.jpeg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
      buffer: Buffer.from('dummy content'),
      stream: null,
      destination: '',
      filename: '',
      path: '',
    };
    metadata = 'mock-data';
    returnedData = {
      data: chapter,
      fileUrl: chapter.fileId,
    };
    thumbnail = {
      message: httpMessages_EN.file.generateFile.status_200,
      data: {
        id: chapter.fileId,
        name: uploadedFile.originalname,
        type: 'IMAGE',
        url: faker.internet.url(),
        size: uploadedFile.size,
      },
    };
  });

  it('should be defined', () => {
    expect(chapterController).toBeDefined();
  });

  describe('generateChapter()', () => {
    it('should generate a chapter', async () => {
      (allowedTypes as jest.Mock).mockReturnValue(undefined);
      (FormDataHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(thumbnail);
      (chapterService.generateChapter as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.chapter.generateChapter.status_200,
        data: chapter,
      });

      const result: Return = await chapterController.generateChapter(
        uploadedFile,
        metadata,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.chapter.generateChapter.status_200,
        data: chapter,
      });
      expect(allowedTypes).toHaveBeenCalledWith(uploadedFile);
      expect(FormDataHandler).toHaveBeenCalledWith(
        GenerateChapterDTO,
        uploadedFile,
        metadata,
        s3Service,
        logger,
        'images/chapter',
      );
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: uploadedFile.originalname,
        type: 'IMAGE',
        size: uploadedFile.size,
        url: returnedData.fileUrl,
      });
      expect(chapterService.generateChapter).toHaveBeenCalledWith(chapter);
    });

    it('should throw ConflictException', async () => {
      (allowedTypes as jest.Mock).mockReturnValue(undefined);
      (FormDataHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(thumbnail);
      (chapterService.generateChapter as jest.Mock).mockRejectedValue(
        new ConflictException(
          httpMessages_EN.chapter.throwIfChapterExists.status_409,
        ),
      );

      await expect(
        chapterController.generateChapter(uploadedFile, metadata),
      ).rejects.toThrow(ConflictException);
      expect(allowedTypes).toHaveBeenCalledWith(uploadedFile);
      expect(FormDataHandler).toHaveBeenCalledWith(
        GenerateChapterDTO,
        uploadedFile,
        metadata,
        s3Service,
        logger,
        'images/chapter',
      );
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: uploadedFile.originalname,
        type: 'IMAGE',
        size: uploadedFile.size,
        url: returnedData.fileUrl,
      });
      expect(chapterService.generateChapter).toHaveBeenCalledWith(chapter);
    });

    it('should throw BadRequestException due to wrong file type', async () => {
      (allowedTypes as jest.Mock).mockImplementation(() => {
        throw new BadRequestException(httpMessages_EN.helper.status_4004);
      });

      await expect(
        chapterController.generateChapter(uploadedFile, metadata),
      ).rejects.toThrow(BadRequestException);
      expect(allowedTypes).toHaveBeenCalledWith(uploadedFile);
    });

    it('should throw InternalErrorException', async () => {
      (allowedTypes as jest.Mock).mockReturnValue(undefined);
      (FormDataHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(thumbnail);
      (chapterService.generateChapter as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        chapterController.generateChapter(uploadedFile, metadata),
      ).rejects.toThrow(InternalServerErrorException);
      expect(allowedTypes).toHaveBeenCalledWith(uploadedFile);
      expect(FormDataHandler).toHaveBeenCalledWith(
        GenerateChapterDTO,
        uploadedFile,
        metadata,
        s3Service,
        logger,
        'images/chapter',
      );
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: uploadedFile.originalname,
        type: 'IMAGE',
        size: uploadedFile.size,
        url: returnedData.fileUrl,
      });
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
    it('should update a chapter', async () => {
      (allowedTypes as jest.Mock).mockReturnValue(undefined);
      (updateFormHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(thumbnail);
      (chapterService.updateChapter as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.chapter.updateChapter.status_200,
        data: chapter,
      });

      const result: Return = await chapterController.updateChapter(
        uploadedFile,
        chapter.id,
        metadata,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.chapter.updateChapter.status_200,
        data: chapter,
      });
      expect(allowedTypes).toHaveBeenCalledWith(uploadedFile);
      expect(updateFormHandler).toHaveBeenCalledWith(
        s3Service,
        logger,
        'images/chapter',
        UpdateChapterDTO,
        uploadedFile,
        metadata,
      );
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: uploadedFile.originalname,
        type: 'IMAGE',
        size: uploadedFile.size,
        url: returnedData.fileUrl,
      });
      expect(chapterService.updateChapter).toHaveBeenCalledWith(chapter.id, {
        ...returnedData.data,
        fileId: thumbnail.data.id,
      });
    });

    it('should throw NotFoundException', async () => {
      (allowedTypes as jest.Mock).mockReturnValue(undefined);
      (updateFormHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(thumbnail);
      (chapterService.updateChapter as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.chapter.updateChapter.status_404),
      );

      await expect(
        chapterController.updateChapter(uploadedFile, chapter.id, metadata),
      ).rejects.toThrow(NotFoundException);
      expect(allowedTypes).toHaveBeenCalledWith(uploadedFile);
      expect(updateFormHandler).toHaveBeenCalledWith(
        s3Service,
        logger,
        'images/chapter',
        UpdateChapterDTO,
        uploadedFile,
        metadata,
      );
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: uploadedFile.originalname,
        type: 'IMAGE',
        size: uploadedFile.size,
        url: returnedData.fileUrl,
      });
      expect(chapterService.updateChapter).toHaveBeenCalledWith(chapter.id, {
        ...returnedData.data,
        fileId: thumbnail.data.id,
      });
    });

    it('should throw BadRequestException', async () => {
      (allowedTypes as jest.Mock).mockImplementation(() => {
        throw new BadRequestException(httpMessages_EN.helper.status_4004);
      });

      await expect(
        chapterController.updateChapter(uploadedFile, chapter.id, metadata),
      ).rejects.toThrow(BadRequestException);
      expect(allowedTypes).toHaveBeenCalledWith(uploadedFile);
    });

    it('should throw InternalErrorException', async () => {
      (allowedTypes as jest.Mock).mockReturnValue(undefined);
      (updateFormHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(thumbnail);
      (chapterService.updateChapter as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        chapterController.updateChapter(uploadedFile, chapter.id, metadata),
      ).rejects.toThrow(InternalServerErrorException);
      expect(allowedTypes).toHaveBeenCalledWith(uploadedFile);
      expect(updateFormHandler).toHaveBeenCalledWith(
        s3Service,
        logger,
        'images/chapter',
        UpdateChapterDTO,
        uploadedFile,
        metadata,
      );
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: uploadedFile.originalname,
        type: 'IMAGE',
        size: uploadedFile.size,
        url: returnedData.fileUrl,
      });
      expect(chapterService.updateChapter).toHaveBeenCalledWith(chapter.id, {
        ...returnedData.data,
        fileId: thumbnail.data.id,
      });
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
