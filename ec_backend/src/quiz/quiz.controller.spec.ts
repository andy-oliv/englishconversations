import { Test, TestingModule } from '@nestjs/testing';
import { CEFRLevels, Difficulty } from '../../generated/prisma';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import Return from '../common/types/Return';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import Quiz from '../entities/Quiz';
import generateMockQuiz from '../helper/mocks/generateMockQuiz';
import allowedTypes from '../helper/functions/allowedTypes';
import FormDataHandler from '../helper/functions/formDataHandler';
import FormHandlerReturn from '../common/types/FormHandlerReturn';
import { FileService } from '../file/file.service';
import { S3Service } from '../s3/s3.service';
import { Logger } from 'nestjs-pino';
import { faker } from '@faker-js/faker/.';
import CreateQuizDTO from './dto/createQuiz.dto';
import updateFormHandler from '../helper/functions/templates/updateFormHandler';
import UpdateQuizDTO from './dto/updateQuiz.dto';

jest.mock('../helper/functions/allowedTypes');
jest.mock('../helper/functions/formDataHandler');
jest.mock('../helper/functions/templates/updateFormHandler');

describe('quizController', () => {
  let quizController: QuizController;
  let quizService: QuizService;
  let fileService: FileService;
  let s3Service: S3Service;
  let logger: Logger;
  let quiz: Quiz;
  let quizList: Quiz[];
  let query: { level: CEFRLevels; difficulty: Difficulty };
  let metadata: string;
  let uploadedFile: Express.Multer.File;
  let returnedData: FormHandlerReturn;
  let thumbnail: Return;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizController],
      providers: [
        {
          provide: QuizService,
          useValue: {
            throwIfQuizExists: jest.fn(),
            createQuiz: jest.fn(),
            fetchQuizzes: jest.fn(),
            fetchQuizzesByQuery: jest.fn(),
            fetchQuizById: jest.fn(),
            updateQuiz: jest.fn(),
            deleteQuiz: jest.fn(),
          },
        },
        {
          provide: FileService,
          useValue: {
            generateFile: jest.fn(),
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
          },
        },
      ],
    }).compile();

    quizController = module.get<QuizController>(QuizController);
    quizService = module.get<QuizService>(QuizService);
    fileService = module.get<FileService>(FileService);
    s3Service = module.get<S3Service>(S3Service);
    logger = module.get<Logger>(Logger);

    quiz = generateMockQuiz();
    quizList = [generateMockQuiz(), generateMockQuiz()];
    query = {
      level: quiz.level,
      difficulty: quiz.difficulty,
    };
    metadata = 'mock-data';
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
    thumbnail = {
      message: httpMessages_EN.file.generateFile.status_200,
      data: {
        id: quiz.fileId,
        name: uploadedFile.originalname,
        type: 'IMAGE',
        url: faker.internet.url(),
        size: uploadedFile.size,
      },
    };
    returnedData = {
      data: quiz,
      fileUrl: thumbnail.data.url,
    };
  });

  it('should be defined', () => {
    expect(quizController).toBeDefined();
  });

  describe('createQuiz()', () => {
    it('should create a quiz', async () => {
      (allowedTypes as jest.Mock).mockReturnValue(undefined);
      (FormDataHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(thumbnail);
      (quizService.createQuiz as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.quiz.createQuiz.status_201,
        data: quiz,
      });

      const result: Return = await quizController.createQuiz(
        uploadedFile,
        metadata,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.quiz.createQuiz.status_201,
        data: quiz,
      });
      expect(allowedTypes).toHaveBeenCalledWith(uploadedFile);
      expect(quizService.createQuiz).toHaveBeenCalledWith({
        ...quiz,
        fileId: thumbnail.data.id,
      });
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: uploadedFile.originalname,
        type: 'IMAGE',
        size: uploadedFile.size,
        url: returnedData.fileUrl,
      });
      expect(FormDataHandler).toHaveBeenCalledWith(
        CreateQuizDTO,
        uploadedFile,
        metadata,
        s3Service,
        logger,
        'images/quiz',
      );
    });

    it('should throw a ConflictException', async () => {
      (allowedTypes as jest.Mock).mockReturnValue(undefined);
      (FormDataHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(thumbnail);
      (quizService.createQuiz as jest.Mock).mockRejectedValue(
        new ConflictException(
          httpMessages_EN.quiz.throwIfQuizExists.status_409,
        ),
      );

      await expect(
        quizController.createQuiz(uploadedFile, metadata),
      ).rejects.toThrow(ConflictException);
      expect(allowedTypes).toHaveBeenCalledWith(uploadedFile);
      expect(quizService.createQuiz).toHaveBeenCalledWith({
        ...quiz,
        fileId: thumbnail.data.id,
      });
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: uploadedFile.originalname,
        type: 'IMAGE',
        size: uploadedFile.size,
        url: returnedData.fileUrl,
      });
      expect(FormDataHandler).toHaveBeenCalledWith(
        CreateQuizDTO,
        uploadedFile,
        metadata,
        s3Service,
        logger,
        'images/quiz',
      );
    });

    it('should throw an InternalServerErrorException', async () => {
      (allowedTypes as jest.Mock).mockReturnValue(undefined);
      (FormDataHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(thumbnail);
      (quizService.createQuiz as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        quizController.createQuiz(uploadedFile, metadata),
      ).rejects.toThrow(InternalServerErrorException);
      expect(allowedTypes).toHaveBeenCalledWith(uploadedFile);
      expect(quizService.createQuiz).toHaveBeenCalledWith({
        ...quiz,
        fileId: thumbnail.data.id,
      });
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: uploadedFile.originalname,
        type: 'IMAGE',
        size: uploadedFile.size,
        url: returnedData.fileUrl,
      });
      expect(FormDataHandler).toHaveBeenCalledWith(
        CreateQuizDTO,
        uploadedFile,
        metadata,
        s3Service,
        logger,
        'images/quiz',
      );
    });
  });

  describe('fetchQuizzesByQuery()', () => {
    it('should fetch all quizzes based on the query', async () => {
      (quizService.fetchQuizzesByQuery as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.quiz.fetchQuizzesByQuery.status_200,
        data: quizList,
      });

      const result: Return = await quizController.fetchQuizzesByQuery(query);

      expect(result).toMatchObject({
        message: httpMessages_EN.quiz.fetchQuizzesByQuery.status_200,
        data: quizList,
      });

      expect(quizService.fetchQuizzesByQuery).toHaveBeenCalledWith(
        query.level,
        query.difficulty,
      );
    });

    it('should throw a NotFoundException', async () => {
      (quizService.fetchQuizzesByQuery as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.quiz.fetchQuizzesByQuery.status_404,
        ),
      );

      await expect(quizController.fetchQuizzesByQuery(query)).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.quiz.fetchQuizzesByQuery.status_404,
        ),
      );

      expect(quizService.fetchQuizzesByQuery).toHaveBeenCalledWith(
        query.level,
        query.difficulty,
      );
    });

    it('should throw an InternalServerErrorException', async () => {
      (quizService.fetchQuizzesByQuery as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(quizController.fetchQuizzesByQuery(query)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(quizService.fetchQuizzesByQuery).toHaveBeenCalledWith(
        query.level,
        query.difficulty,
      );
    });
  });

  describe('fetchQuizById()', () => {
    it('should fetch an quiz', async () => {
      (quizService.fetchQuizById as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.quiz.fetchQuizById.status_200,
        data: quiz,
      });

      const result: Return = await quizController.fetchQuizById(quiz.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.quiz.fetchQuizById.status_200,
        data: quiz,
      });

      expect(quizService.fetchQuizById).toHaveBeenCalledWith(quiz.id);
    });

    it('should throw a NotFoundException', async () => {
      (quizService.fetchQuizById as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.quiz.fetchQuizById.status_404),
      );

      await expect(quizController.fetchQuizById(quiz.id)).rejects.toThrow(
        new NotFoundException(httpMessages_EN.quiz.fetchQuizById.status_404),
      );

      expect(quizService.fetchQuizById).toHaveBeenCalledWith(quiz.id);
    });

    it('should throw an InternalServerErrorException', async () => {
      (quizService.fetchQuizById as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(quizController.fetchQuizById(quiz.id)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(quizService.fetchQuizById).toHaveBeenCalledWith(quiz.id);
    });
  });

  describe('fetchQuizzes()', () => {
    it('should fetch all quizs', async () => {
      (quizService.fetchQuizzes as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.quiz.fetchQuizzes.status_200,
        data: quizList,
      });

      const result: Return = await quizController.fetchQuizzes();

      expect(result).toMatchObject({
        message: httpMessages_EN.quiz.fetchQuizzes.status_200,
        data: quizList,
      });

      expect(quizService.fetchQuizzes).toHaveBeenCalled();
    });

    it('should throw a NotFoundException', async () => {
      (quizService.fetchQuizzes as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.quiz.fetchQuizzes.status_404),
      );

      await expect(quizController.fetchQuizzes()).rejects.toThrow(
        new NotFoundException(httpMessages_EN.quiz.fetchQuizzes.status_404),
      );

      expect(quizService.fetchQuizzes).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException', async () => {
      (quizService.fetchQuizzes as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(quizController.fetchQuizzes()).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(quizService.fetchQuizzes).toHaveBeenCalled();
    });
  });

  describe('updateQuiz()', () => {
    it('should update an quiz create', async () => {
      (allowedTypes as jest.Mock).mockReturnValue(undefined);
      (updateFormHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(thumbnail);
      (quizService.updateQuiz as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.quiz.updateQuiz.status_200,
        data: quiz,
      });

      const result: Return = await quizController.updateQuiz(
        uploadedFile,
        quiz.id,
        metadata,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.quiz.updateQuiz.status_200,
        data: quiz,
      });
      expect(allowedTypes).toHaveBeenCalledWith(uploadedFile);
      expect(quizService.updateQuiz).toHaveBeenCalledWith(quiz.id, {
        ...quiz,
        fileId: thumbnail.data.id,
      });
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: uploadedFile.originalname,
        type: 'IMAGE',
        size: uploadedFile.size,
        url: returnedData.fileUrl,
      });
      expect(updateFormHandler).toHaveBeenCalledWith(
        s3Service,
        logger,
        'images/quiz',
        UpdateQuizDTO,
        uploadedFile,
        metadata,
      );
    });

    it('should throw a NotFoundException', async () => {
      (allowedTypes as jest.Mock).mockReturnValue(undefined);
      (updateFormHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(thumbnail);
      (quizService.updateQuiz as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.quiz.updateQuiz.status_404),
      );

      await expect(
        quizController.updateQuiz(uploadedFile, quiz.id, metadata),
      ).rejects.toThrow(NotFoundException);
      expect(allowedTypes).toHaveBeenCalledWith(uploadedFile);
      expect(quizService.updateQuiz).toHaveBeenCalledWith(quiz.id, {
        ...quiz,
        fileId: thumbnail.data.id,
      });
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: uploadedFile.originalname,
        type: 'IMAGE',
        size: uploadedFile.size,
        url: returnedData.fileUrl,
      });
      expect(updateFormHandler).toHaveBeenCalledWith(
        s3Service,
        logger,
        'images/quiz',
        UpdateQuizDTO,
        uploadedFile,
        metadata,
      );
    });

    it('should throw an InternalServerErrorException', async () => {
      (allowedTypes as jest.Mock).mockReturnValue(undefined);
      (updateFormHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(thumbnail);
      (quizService.updateQuiz as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        quizController.updateQuiz(uploadedFile, quiz.id, metadata),
      ).rejects.toThrow(InternalServerErrorException);
      expect(allowedTypes).toHaveBeenCalledWith(uploadedFile);
      expect(quizService.updateQuiz).toHaveBeenCalledWith(quiz.id, {
        ...quiz,
        fileId: thumbnail.data.id,
      });
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: uploadedFile.originalname,
        type: 'IMAGE',
        size: uploadedFile.size,
        url: returnedData.fileUrl,
      });
      expect(updateFormHandler).toHaveBeenCalledWith(
        s3Service,
        logger,
        'images/quiz',
        UpdateQuizDTO,
        uploadedFile,
        metadata,
      );
    });
  });

  describe('deleteQuiz()', () => {
    it('should delete an quiz', async () => {
      (quizService.deleteQuiz as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.quiz.deleteQuiz.status_200,
        data: quiz,
      });

      const result: Return = await quizController.deleteQuiz(quiz.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.quiz.deleteQuiz.status_200,
        data: quiz,
      });

      expect(quizService.deleteQuiz).toHaveBeenCalledWith(quiz.id);
    });

    it('should throw a NotFoundException', async () => {
      (quizService.deleteQuiz as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.quiz.deleteQuiz.status_404),
      );

      await expect(quizController.deleteQuiz(quiz.id)).rejects.toThrow(
        new NotFoundException(httpMessages_EN.quiz.deleteQuiz.status_404),
      );

      expect(quizService.deleteQuiz).toHaveBeenCalledWith(quiz.id);
    });

    it('should throw an InternalServerErrorException', async () => {
      (quizService.deleteQuiz as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(quizController.deleteQuiz(quiz.id)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(quizService.deleteQuiz).toHaveBeenCalledWith(quiz.id);
    });
  });
});
