import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import { StudentService } from '../student/student.service';
import { QuizService } from '../quiz/quiz.service';
import { faker } from '@faker-js/faker/.';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AnsweredQuizService } from './answered-quiz.service';
import generateMockAnsweredQuiz from '../helper/mocks/generateMocAnsweredQuiz';
import AnsweredQuiz from '../common/types/AnsweredQuiz';

describe('answeredQuizService', () => {
  let answeredQuizService: AnsweredQuizService;
  let prismaService: PrismaService;
  let logger: Logger;
  let answers: AnsweredQuiz[];
  let emptyAnswerList: AnsweredQuiz[];
  let answer: AnsweredQuiz;
  let error: any;
  let answerValidation: boolean;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnsweredQuizService,
        {
          provide: StudentService,
          useValue: {
            throwIfNotStudent: jest.fn(),
          },
        },
        {
          provide: QuizService,
          useValue: {
            throwIfNotQuiz: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            answeredQuiz: {
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

    answeredQuizService = module.get<AnsweredQuizService>(AnsweredQuizService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);

    answers = [generateMockAnsweredQuiz(), generateMockAnsweredQuiz()];
    answer = generateMockAnsweredQuiz();
    error = {
      code: 'P2025',
    };
    emptyAnswerList = [];
    answerValidation = faker.datatype.boolean();
  });

  it('should be defined', () => {
    expect(answeredQuizService).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveAnswer()', () => {
    it('should save a new answer', async () => {
      jest
        .spyOn(answeredQuizService, 'answerValidation')
        .mockResolvedValue(answerValidation);
      (prismaService.answeredQuiz.create as jest.Mock).mockResolvedValue(
        answer,
      );

      const result: Return = await answeredQuizService.saveAnswer(answer);

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredQuiz.saveAnswer.status_201,
        data: answer,
      });
      expect(answeredQuizService.answerValidation).toHaveBeenCalledWith(
        answer.quizId,
        answer.studentId,
      );
      expect(prismaService.answeredQuiz.create).toHaveBeenCalledWith({
        data: {
          quizId: answer.quizId,
          studentId: answer.studentId,
          score: answer.score,
          feedback: answer.feedback,
          elapsedTime: answer.elapsedTime,
          isRetry: answerValidation,
        },
      });
    });

    it('should throw an InternalServerErrorException while validating the answer', async () => {
      jest
        .spyOn(answeredQuizService, 'answerValidation')
        .mockRejectedValue(
          new InternalServerErrorException(httpMessages_EN.general.status_500),
        );

      await expect(answeredQuizService.saveAnswer(answer)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(answeredQuizService.answerValidation).toHaveBeenCalledWith(
        answer.quizId,
        answer.studentId,
      );
    });

    it('should throw an InternalServerErrorException while saving the answer', async () => {
      jest
        .spyOn(answeredQuizService, 'answerValidation')
        .mockResolvedValue(answerValidation);
      (prismaService.answeredQuiz.create as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(answeredQuizService.saveAnswer(answer)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(answeredQuizService.answerValidation).toHaveBeenCalledWith(
        answer.quizId,
        answer.studentId,
      );
      expect(prismaService.answeredQuiz.create).toHaveBeenCalledWith({
        data: {
          quizId: answer.quizId,
          studentId: answer.studentId,
          score: answer.score,
          feedback: answer.feedback,
          elapsedTime: answer.elapsedTime,
          isRetry: answerValidation,
        },
      });
    });
  });

  describe('fetchAnswers()', () => {
    it('should fetch all the answers', async () => {
      (prismaService.answeredQuiz.findMany as jest.Mock).mockResolvedValue(
        answers,
      );

      const result: Return = await answeredQuizService.fetchAnswers();

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredQuiz.fetchAnswers.status_200,
        data: answers,
      });
      expect(prismaService.answeredQuiz.findMany).toHaveBeenCalled();
    });

    it('should throw a NotFoundException for not finding answers to show', async () => {
      (prismaService.answeredQuiz.findMany as jest.Mock).mockResolvedValue(
        emptyAnswerList,
      );

      await expect(answeredQuizService.fetchAnswers()).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.answeredQuiz.fetchAnswers.status_404,
        ),
      );

      expect(prismaService.answeredQuiz.findMany).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException while fetching the answers', async () => {
      (prismaService.answeredQuiz.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(answeredQuizService.fetchAnswers()).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(prismaService.answeredQuiz.findMany).toHaveBeenCalled();
    });
  });

  describe('fetchAnswerById()', () => {
    it('should fetch an answer', async () => {
      (
        prismaService.answeredQuiz.findFirstOrThrow as jest.Mock
      ).mockResolvedValue(answer);

      const result: Return = await answeredQuizService.fetchAnswerById(
        answer.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredQuiz.fetchAnswerById.status_200,
        data: answer,
      });
      expect(prismaService.answeredQuiz.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: answer.id,
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
            },
          },
          quiz: {
            select: {
              id: true,
              title: true,
              description: true,
            },
          },
          answers: {
            select: {
              id: true,
              isRetry: true,
              elapsedTime: true,
              textAnswer: true,
              selectedAnswers: true,
              audioUrl: true,
              isCorrectAnswer: true,
              feedback: true,
            },
          },
        },
      });
    });

    it('should throw a NotFoundException for not finding the answer', async () => {
      (
        prismaService.answeredQuiz.findFirstOrThrow as jest.Mock
      ).mockRejectedValue(error);

      await expect(
        answeredQuizService.fetchAnswerById(answer.id),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.answeredQuiz.fetchAnswerById.status_404,
        ),
      );
      expect(prismaService.answeredQuiz.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: answer.id,
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
            },
          },
          quiz: {
            select: {
              id: true,
              title: true,
              description: true,
            },
          },
          answers: {
            select: {
              id: true,
              isRetry: true,
              elapsedTime: true,
              textAnswer: true,
              selectedAnswers: true,
              audioUrl: true,
              isCorrectAnswer: true,
              feedback: true,
            },
          },
        },
      });
    });
  });

  describe('fetchAnswersByQuery', () => {
    it('should fetch answers', async () => {
      (prismaService.answeredQuiz.findMany as jest.Mock).mockResolvedValue(
        answers,
      );

      const result: Return = await answeredQuizService.fetchAnswersByQuery(
        answer.quizId,
        answer.studentId,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredQuiz.fetchAnswersByQuery.status_200,
        data: answers,
      });
      expect(prismaService.answeredQuiz.findMany).toHaveBeenCalledWith({
        where: {
          AND: [{ quizId: answer.quizId }, { studentId: answer.studentId }],
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });

    it('should throw a NotFoundException', async () => {
      (prismaService.answeredQuiz.findMany as jest.Mock).mockResolvedValue(
        emptyAnswerList,
      );

      await expect(
        answeredQuizService.fetchAnswersByQuery(
          answer.quizId,
          answer.studentId,
        ),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prismaService.answeredQuiz.findMany).toHaveBeenCalledWith({
        where: {
          AND: [{ quizId: answer.quizId }, { studentId: answer.studentId }],
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });

    it('should throw an InternalServerErrorException', async () => {
      (prismaService.answeredQuiz.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        answeredQuizService.fetchAnswersByQuery(
          answer.quizId,
          answer.studentId,
        ),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(prismaService.answeredQuiz.findMany).toHaveBeenCalledWith({
        where: {
          AND: [{ quizId: answer.quizId }, { studentId: answer.studentId }],
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });
  });
  describe('addFeedback()', () => {
    it('should addFeedback an answer', async () => {
      (prismaService.answeredQuiz.update as jest.Mock).mockResolvedValue(
        answer,
      );

      const result: Return = await answeredQuizService.addFeedback(
        answer.id,
        answer.feedback,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredQuiz.addFeedback.status_200,
        data: answer,
      });
      expect(prismaService.answeredQuiz.update).toHaveBeenCalledWith({
        where: {
          id: answer.id,
        },
        data: {
          feedback: answer.feedback,
        },
      });
    });

    it('should throw a NotFoundException', async () => {
      (prismaService.answeredQuiz.update as jest.Mock).mockRejectedValue(error);

      await expect(
        answeredQuizService.addFeedback(answer.id, answer.feedback),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.answeredQuiz.addFeedback.status_404,
        ),
      );
      expect(prismaService.answeredQuiz.update).toHaveBeenCalledWith({
        where: {
          id: answer.id,
        },
        data: {
          feedback: answer.feedback,
        },
      });
    });

    it('should throw an InternalServerErrorException', async () => {
      (prismaService.answeredQuiz.update as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        answeredQuizService.addFeedback(answer.id, answer.feedback),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );
      expect(prismaService.answeredQuiz.update).toHaveBeenCalledWith({
        where: {
          id: answer.id,
        },
        data: {
          feedback: answer.feedback,
        },
      });
    });
  });

  describe('deleteAnswer()', () => {
    it('should delete an answer', async () => {
      (prismaService.answeredQuiz.delete as jest.Mock).mockResolvedValue(
        answer,
      );

      const result: Return = await answeredQuizService.deleteAnswer(answer.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredQuiz.deleteAnswer.status_200,
        data: answer,
      });
      expect(prismaService.answeredQuiz.delete).toHaveBeenCalledWith({
        where: {
          id: answer.id,
        },
      });
    });

    it('should throw a NotFoundException', async () => {
      (prismaService.answeredQuiz.delete as jest.Mock).mockRejectedValue(error);

      await expect(answeredQuizService.deleteAnswer(answer.id)).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.answeredQuiz.deleteAnswer.status_404,
        ),
      );
      expect(prismaService.answeredQuiz.delete).toHaveBeenCalledWith({
        where: {
          id: answer.id,
        },
      });
    });
  });

  it('should throw an InternalServerErrorException', async () => {
    (prismaService.answeredQuiz.delete as jest.Mock).mockRejectedValue(
      new InternalServerErrorException(httpMessages_EN.general.status_500),
    );

    await expect(answeredQuizService.deleteAnswer(answer.id)).rejects.toThrow(
      new InternalServerErrorException(httpMessages_EN.general.status_500),
    );
    expect(prismaService.answeredQuiz.delete).toHaveBeenCalledWith({
      where: {
        id: answer.id,
      },
    });
  });
});
