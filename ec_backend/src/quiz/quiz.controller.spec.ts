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

describe('quizController', () => {
  let quizController: QuizController;
  let quizService: QuizService;
  let quiz: Quiz;
  let quizList: Quiz[];
  let query: { level: CEFRLevels; difficulty: Difficulty };

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
      ],
    }).compile();

    quizController = module.get<QuizController>(QuizController);
    quizService = module.get<QuizService>(QuizService);

    quiz = generateMockQuiz();
    quizList = [generateMockQuiz(), generateMockQuiz()];
    query = {
      level: quiz.level,
      difficulty: quiz.difficulty,
    };
  });

  it('should be defined', () => {
    expect(quizController).toBeDefined();
  });

  describe('createQuiz()', () => {
    it('should create a quiz', async () => {
      (quizService.createQuiz as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.quiz.createQuiz.status_201,
        data: quiz,
      });

      const result: Return = await quizController.createQuiz(quiz);

      expect(result).toMatchObject({
        message: httpMessages_EN.quiz.createQuiz.status_201,
        data: quiz,
      });
      expect(quizService.createQuiz).toHaveBeenCalledWith(quiz);
    });

    it('should throw a ConflictException', async () => {
      (quizService.createQuiz as jest.Mock).mockRejectedValue(
        new ConflictException(
          httpMessages_EN.quiz.throwIfQuizExists.status_409,
        ),
      );

      await expect(quizController.createQuiz(quiz)).rejects.toThrow(
        new ConflictException(
          httpMessages_EN.quiz.throwIfQuizExists.status_409,
        ),
      );
      expect(quizService.createQuiz).toHaveBeenCalledWith(quiz);
    });

    it('should throw an InternalServerErrorException', async () => {
      (quizService.createQuiz as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(quizController.createQuiz(quiz)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );
      expect(quizService.createQuiz).toHaveBeenCalledWith(quiz);
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
      (quizService.updateQuiz as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.quiz.updateQuiz.status_200,
        data: quiz,
      });

      const result: Return = await quizController.updateQuiz(quiz.id, quiz);

      expect(result).toMatchObject({
        message: httpMessages_EN.quiz.updateQuiz.status_200,
        data: quiz,
      });

      expect(quizService.updateQuiz).toHaveBeenCalledWith(quiz.id, quiz);
    });

    it('should throw a NotFoundException', async () => {
      (quizService.updateQuiz as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.quiz.updateQuiz.status_404),
      );

      await expect(quizController.updateQuiz(quiz.id, quiz)).rejects.toThrow(
        new NotFoundException(httpMessages_EN.quiz.updateQuiz.status_404),
      );

      expect(quizService.updateQuiz).toHaveBeenCalledWith(quiz.id, quiz);
    });

    it('should throw an InternalServerErrorException', async () => {
      (quizService.updateQuiz as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(quizController.updateQuiz(quiz.id, quiz)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(quizService.updateQuiz).toHaveBeenCalledWith(quiz.id, quiz);
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
