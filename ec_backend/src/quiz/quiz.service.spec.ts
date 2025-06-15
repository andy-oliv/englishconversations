import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import loggerMessages from '../helper/messages/loggerMessages';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import Quiz from '../common/types/Quiz';
import generateMockQuiz from '../helper/mocks/generateMockQuiz';

describe('quizService', () => {
  let quizService: QuizService;
  let prismaService: PrismaService;
  let logger: Logger;
  let quizzes: Quiz[];
  let emptyQuizList: Quiz[];
  let quiz: Quiz;
  let error: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizService,
        {
          provide: PrismaService,
          useValue: {
            quiz: {
              create: jest.fn(),
              findFirst: jest.fn(),
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
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    quizService = module.get<QuizService>(QuizService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);

    quizzes = [generateMockQuiz(), generateMockQuiz()];
    quiz = generateMockQuiz();
    error = {
      code: 'P2025',
    };
    emptyQuizList = [];
  });

  it('should be defined', () => {
    expect(quizService).toBeDefined();
  });

  describe('createQuiz()', () => {
    it('should create a new quiz', async () => {
      jest.spyOn(quizService, 'throwIfQuizExists').mockResolvedValue(undefined);
      (prismaService.quiz.create as jest.Mock).mockResolvedValue(quiz);
      (logger.log as jest.Mock).mockResolvedValue(
        loggerMessages.quiz.createQuiz.status_201,
      );

      const result: Return = await quizService.createQuiz(quiz);

      expect(result).toMatchObject({
        message: httpMessages_EN.quiz.createQuiz.status_201,
        data: quiz,
      });
      expect(quizService.throwIfQuizExists).toHaveBeenCalledWith(
        quiz.title,
        quiz.description,
      );
      expect(prismaService.quiz.create).toHaveBeenCalledWith({
        data: quiz,
      });
      expect(logger.log).toHaveBeenLastCalledWith({
        message: loggerMessages.quiz.createQuiz.status_201,
        data: quiz,
      });
    });

    it('should return a ConflictException because the quiz already exists', async () => {
      jest
        .spyOn(quizService, 'throwIfQuizExists')
        .mockRejectedValue(new ConflictException());

      await expect(quizService.createQuiz(quiz)).rejects.toThrow(
        new ConflictException(),
      );

      expect(quizService.throwIfQuizExists).toHaveBeenCalledWith(
        quiz.title,
        quiz.description,
      );
    });

    it('should return an InternalServerErrorException when calling the throwIfQuizExists() function', async () => {
      jest
        .spyOn(quizService, 'throwIfQuizExists')
        .mockRejectedValue(new InternalServerErrorException());

      await expect(quizService.createQuiz(quiz)).rejects.toThrow(
        new InternalServerErrorException(),
      );

      expect(quizService.throwIfQuizExists).toHaveBeenCalledWith(
        quiz.title,
        quiz.description,
      );
    });

    it('should throw an InternalServerErrorException when creating a new quiz', async () => {
      jest.spyOn(quizService, 'throwIfQuizExists').mockResolvedValue(undefined);
      (prismaService.quiz.create as jest.Mock).mockResolvedValue(quiz);
      (logger.log as jest.Mock).mockResolvedValue(
        loggerMessages.quiz.createQuiz.status_201,
      );

      const result: Return = await quizService.createQuiz(quiz);

      expect(result).toMatchObject({
        message: httpMessages_EN.quiz.createQuiz.status_201,
        data: quiz,
      });
      expect(quizService.throwIfQuizExists).toHaveBeenCalledWith(
        quiz.title,
        quiz.description,
      );
      expect(prismaService.quiz.create).toHaveBeenCalledWith({
        data: quiz,
      });
      expect(logger.log).toHaveBeenLastCalledWith({
        message: loggerMessages.quiz.createQuiz.status_201,
        data: quiz,
      });
    });
  });

  describe('fetchQuizzes()', () => {
    it('should fetch all quizzes', async () => {
      (prismaService.quiz.findMany as jest.Mock).mockResolvedValue(quizzes);

      const result: Return = await quizService.fetchQuizzes();

      expect(result).toMatchObject({
        message: httpMessages_EN.quiz.fetchQuizzes.status_200,
        data: quizzes,
      });

      expect(prismaService.quiz.findMany).toHaveBeenCalled();
    });

    it('should return a NotFoundException', async () => {
      (prismaService.quiz.findMany as jest.Mock).mockResolvedValue(
        emptyQuizList,
      );

      await expect(quizService.fetchQuizzes()).rejects.toThrow(
        new NotFoundException(httpMessages_EN.quiz.fetchQuizzes.status_404),
      );

      expect(prismaService.quiz.findMany).toHaveBeenCalled();
    });

    it('should return an InternalServerErrorException', async () => {
      (prismaService.quiz.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(quizService.fetchQuizzes()).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(prismaService.quiz.findMany).toHaveBeenCalled();
    });
  });

  describe('fetchQuizById()', () => {
    it('should fetch a quiz', async () => {
      (prismaService.quiz.findFirstOrThrow as jest.Mock).mockResolvedValue(
        quiz,
      );

      const result: Return = await quizService.fetchQuizById(quiz.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.quiz.fetchQuizById.status_200,
        data: quiz,
      });
      expect(prismaService.quiz.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: quiz.id,
        },
      });
    });

    it('should throw a NotFoundException', async () => {
      (prismaService.quiz.findFirstOrThrow as jest.Mock).mockRejectedValue(
        error,
      );

      await expect(quizService.fetchQuizById(quiz.id)).rejects.toThrow(
        new NotFoundException(httpMessages_EN.quiz.fetchQuizById.status_404),
      );

      expect(prismaService.quiz.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: quiz.id,
        },
      });
    });

    it('should throw an InternalServerErrorException', async () => {
      (prismaService.quiz.findFirstOrThrow as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(quizService.fetchQuizById(quiz.id)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(prismaService.quiz.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: quiz.id,
        },
      });
    });
  });

  describe('fetchQuizzesByQuery()', () => {
    it('should fetch quizzes by query', async () => {
      (prismaService.quiz.findMany as jest.Mock).mockResolvedValue(quizzes);

      const result: Return = await quizService.fetchQuizzesByQuery(
        quiz.level,
        quiz.difficulty,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.quiz.fetchQuizzesByQuery.status_200,
        data: quizzes,
      });
      expect(prismaService.quiz.findMany).toHaveBeenCalled();
    });

    it('should throw a NotFoundException', async () => {
      (prismaService.quiz.findMany as jest.Mock).mockResolvedValue(
        emptyQuizList,
      );

      await expect(
        quizService.fetchQuizzesByQuery(quiz.level, quiz.difficulty),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.quiz.fetchQuizzesByQuery.status_404,
        ),
      );
      expect(prismaService.quiz.findMany).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException', async () => {
      (prismaService.quiz.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(
        quizService.fetchQuizzesByQuery(quiz.level, quiz.difficulty),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );
      expect(prismaService.quiz.findMany).toHaveBeenCalled();
    });
  });

  describe('updateQuiz()', () => {
    it('should update a quiz register', async () => {
      (prismaService.quiz.update as jest.Mock).mockResolvedValue(quiz);

      const result: Return = await quizService.updateQuiz(quiz.id, quiz);

      expect(result).toMatchObject({
        message: httpMessages_EN.quiz.updateQuiz.status_200,
        data: quiz,
      });
      expect(prismaService.quiz.update).toHaveBeenCalledWith({
        where: {
          id: quiz.id,
        },
        data: quiz,
      });
    });

    it('should throw a NotFoundException', async () => {
      (prismaService.quiz.update as jest.Mock).mockRejectedValue(error);

      await expect(quizService.updateQuiz(quiz.id, quiz)).rejects.toThrow(
        new NotFoundException(httpMessages_EN.quiz.updateQuiz.status_404),
      );
      expect(prismaService.quiz.update).toHaveBeenCalledWith({
        where: {
          id: quiz.id,
        },
        data: quiz,
      });
    });

    it('should throw an InternalServerErrorException', async () => {
      (prismaService.quiz.update as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(quizService.updateQuiz(quiz.id, quiz)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );
      expect(prismaService.quiz.update).toHaveBeenCalledWith({
        where: {
          id: quiz.id,
        },
        data: quiz,
      });
    });
  });
  describe('deleteQuiz()', () => {
    it('should delete a quiz register', async () => {
      (prismaService.quiz.delete as jest.Mock).mockResolvedValue(quiz);

      const result: Return = await quizService.deleteQuiz(quiz.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.quiz.deleteQuiz.status_200,
        data: quiz,
      });
      expect(prismaService.quiz.delete).toHaveBeenCalledWith({
        where: {
          id: quiz.id,
        },
      });
    });

    it('should throw a NotFoundException', async () => {
      (prismaService.quiz.delete as jest.Mock).mockRejectedValue(error);

      await expect(quizService.deleteQuiz(quiz.id)).rejects.toThrow(
        new NotFoundException(httpMessages_EN.quiz.deleteQuiz.status_404),
      );
      expect(prismaService.quiz.delete).toHaveBeenCalledWith({
        where: {
          id: quiz.id,
        },
      });
    });

    it('should throw an InternalServerErrorException', async () => {
      (prismaService.quiz.delete as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(quizService.deleteQuiz(quiz.id)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );
      expect(prismaService.quiz.delete).toHaveBeenCalledWith({
        where: {
          id: quiz.id,
        },
      });
    });
  });
});
