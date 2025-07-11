import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import { AnsweredExerciseService } from './answered-exercise.service';
import AnsweredExercise from '../entities/AnsweredExercise';
import generateMockAnsweredExercise from '../helper/mocks/generateMockAnsweredExercise';
import Exercise from '../entities/Exercise';
import generateMockExercise from '../helper/mocks/generateMockExercise';
import { ExerciseService } from '../exercise/exercise.service';
import { faker } from '@faker-js/faker/.';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AnsweredQuizService } from '../answered-quiz/answered-quiz.service';
import { UserService } from '../user/user.service';

describe('AnsweredExerciseService', () => {
  let answeredExerciseService: AnsweredExerciseService;
  let answeredQuizService: AnsweredQuizService;
  let userService: UserService;
  let exerciseService: ExerciseService;
  let prismaService: PrismaService;
  let logger: Logger;
  let answers: AnsweredExercise[];
  let emptyAnswerList: AnsweredExercise[];
  let answer: AnsweredExercise;
  let error: any;
  let answerValidation: { exercise: Exercise; alreadyAnswered: boolean };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnsweredExerciseService,
        {
          provide: UserService,
          useValue: {
            throwIfNotUser: jest.fn(),
          },
        },
        {
          provide: AnsweredQuizService,
          useValue: {
            throwIfNotQuiz: jest.fn(),
          },
        },
        {
          provide: ExerciseService,
          useValue: {
            fetchExercise: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            answeredExercise: {
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

    answeredExerciseService = module.get<AnsweredExerciseService>(
      AnsweredExerciseService,
    );
    userService = module.get<UserService>(UserService);
    answeredQuizService = module.get<AnsweredQuizService>(AnsweredQuizService);
    exerciseService = module.get<ExerciseService>(ExerciseService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);

    answers = [generateMockAnsweredExercise(), generateMockAnsweredExercise()];
    answer = generateMockAnsweredExercise();
    error = {
      code: 'P2025',
    };
    emptyAnswerList = [];
    answerValidation = {
      exercise: generateMockExercise(),
      alreadyAnswered: faker.datatype.boolean(),
    };
  });

  it('should be defined', () => {
    expect(answeredExerciseService).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveAnswer()', () => {
    it('should save a new answer', async () => {
      jest
        .spyOn(answeredExerciseService, 'validateAnswer')
        .mockResolvedValue(answerValidation);
      (prismaService.answeredExercise.create as jest.Mock).mockResolvedValue(
        answer,
      );

      const result: Return = await answeredExerciseService.saveAnswer(answer);

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredExercise.saveAnswer.status_201,
        data: answer,
      });
      expect(answeredExerciseService.validateAnswer).toHaveBeenCalledWith(
        answer.userId,
        answer.answeredQuizId,
        answer.exerciseId,
      );
      expect(prismaService.answeredExercise.create).toHaveBeenCalledWith({
        data: {
          exerciseId: answer.exerciseId,
          userId: answer.userId,
          answeredQuizId: answer.answeredQuizId,
          isRetry: answerValidation.alreadyAnswered,
          selectedAnswers: answer.selectedAnswers,
          textAnswer: answer.textAnswer,
          fileId: answer.fileId,
          isCorrectAnswer: false,
          feedback: answer.feedback,
          elapsedTime: answer.elapsedTime,
        },
      });
    });

    it('should throw an InternalServerErrorException while validating the answer', async () => {
      jest
        .spyOn(answeredExerciseService, 'validateAnswer')
        .mockRejectedValue(
          new InternalServerErrorException(httpMessages_EN.general.status_500),
        );

      await expect(answeredExerciseService.saveAnswer(answer)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(answeredExerciseService.validateAnswer).toHaveBeenCalledWith(
        answer.userId,
        answer.answeredQuizId,
        answer.exerciseId,
      );
    });

    it('should throw an InternalServerErrorException while saving the answer', async () => {
      jest
        .spyOn(answeredExerciseService, 'validateAnswer')
        .mockResolvedValue(answerValidation);
      (prismaService.answeredExercise.create as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(answeredExerciseService.saveAnswer(answer)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(answeredExerciseService.validateAnswer).toHaveBeenCalledWith(
        answer.userId,
        answer.answeredQuizId,
        answer.exerciseId,
      );
      expect(prismaService.answeredExercise.create).toHaveBeenCalledWith({
        data: {
          exerciseId: answer.exerciseId,
          userId: answer.userId,
          answeredQuizId: answer.answeredQuizId,
          isRetry: answerValidation.alreadyAnswered,
          selectedAnswers: answer.selectedAnswers,
          textAnswer: answer.textAnswer,
          fileId: answer.fileId,
          isCorrectAnswer: false,
          feedback: answer.feedback,
          elapsedTime: answer.elapsedTime,
        },
      });
    });
  });

  describe('fetchAnswers()', () => {
    it('should fetch all the answers', async () => {
      (prismaService.answeredExercise.findMany as jest.Mock).mockResolvedValue(
        answers,
      );

      const result: Return = await answeredExerciseService.fetchAnswers();

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredExercise.fetchAnswers.status_200,
        data: answers,
      });
      expect(prismaService.answeredExercise.findMany).toHaveBeenCalled();
    });

    it('should throw a NotFoundException for not finding answers to show', async () => {
      (prismaService.answeredExercise.findMany as jest.Mock).mockResolvedValue(
        emptyAnswerList,
      );

      await expect(answeredExerciseService.fetchAnswers()).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.answeredExercise.fetchAnswers.status_404,
        ),
      );

      expect(prismaService.answeredExercise.findMany).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException while fetching the answers', async () => {
      (prismaService.answeredExercise.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(answeredExerciseService.fetchAnswers()).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(prismaService.answeredExercise.findMany).toHaveBeenCalled();
    });
  });

  describe('fetchAnswerById()', () => {
    it('should fetch an answer', async () => {
      (
        prismaService.answeredExercise.findFirstOrThrow as jest.Mock
      ).mockResolvedValue(answer);

      const result: Return = await answeredExerciseService.fetchAnswerById(
        answer.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredExercise.fetchAnswerById.status_200,
        data: answer,
      });
      expect(
        prismaService.answeredExercise.findFirstOrThrow,
      ).toHaveBeenCalledWith({
        where: {
          id: answer.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          exercise: {
            select: {
              id: true,
              type: true,
              description: true,
            },
          },
        },
      });
    });

    it('should throw a NotFoundException for not finding the answer', async () => {
      (
        prismaService.answeredExercise.findFirstOrThrow as jest.Mock
      ).mockRejectedValue(error);

      await expect(
        answeredExerciseService.fetchAnswerById(answer.id),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.answeredExercise.fetchAnswerById.status_404,
        ),
      );
      expect(
        prismaService.answeredExercise.findFirstOrThrow,
      ).toHaveBeenCalledWith({
        where: {
          id: answer.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          exercise: {
            select: {
              id: true,
              type: true,
              description: true,
            },
          },
        },
      });
    });
  });

  describe('fetchAnswerByQuery', () => {
    it('should fetch answers', async () => {
      (prismaService.answeredExercise.findMany as jest.Mock).mockResolvedValue(
        answers,
      );

      const result: Return = await answeredExerciseService.fetchAnswerByQuery(
        answer.userId,
        answer.exerciseId,
        answer.answeredQuizId,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredExercise.fetchAnswerByQuery.status_200,
        data: answers,
      });
      expect(prismaService.answeredExercise.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { userId: answer.userId },
            { exerciseId: answer.exerciseId },
            { answeredQuizId: answer.answeredQuizId },
          ],
        },
      });
    });

    it('should throw a NotFoundException', async () => {
      (prismaService.answeredExercise.findMany as jest.Mock).mockResolvedValue(
        emptyAnswerList,
      );

      await expect(
        answeredExerciseService.fetchAnswerByQuery(
          answer.userId,
          answer.exerciseId,
          answer.answeredQuizId,
        ),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.answeredExercise.fetchAnswerByQuery.status_404,
        ),
      );

      expect(prismaService.answeredExercise.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { userId: answer.userId },
            { exerciseId: answer.exerciseId },
            { answeredQuizId: answer.answeredQuizId },
          ],
        },
      });
    });

    it('should throw an InternalServerErrorException', async () => {
      (prismaService.answeredExercise.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        answeredExerciseService.fetchAnswerByQuery(
          answer.userId,
          answer.exerciseId,
          answer.answeredQuizId,
        ),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(prismaService.answeredExercise.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { userId: answer.userId },
            { exerciseId: answer.exerciseId },
            { answeredQuizId: answer.answeredQuizId },
          ],
        },
      });
    });
  });
  describe('addFeedback()', () => {
    it('should addFeedback an answer', async () => {
      (prismaService.answeredExercise.update as jest.Mock).mockResolvedValue(
        answer,
      );

      const result: Return = await answeredExerciseService.addFeedback(
        answer.id,
        answer.feedback,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredExercise.addFeedback.status_200,
        data: answer,
      });
      expect(prismaService.answeredExercise.update).toHaveBeenCalledWith({
        where: {
          id: answer.id,
        },
        data: {
          feedback: answer.feedback,
        },
      });
    });

    it('should throw a NotFoundException', async () => {
      (prismaService.answeredExercise.update as jest.Mock).mockRejectedValue(
        error,
      );

      await expect(
        answeredExerciseService.addFeedback(answer.id, answer.feedback),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.answeredExercise.addFeedback.status_404,
        ),
      );
      expect(prismaService.answeredExercise.update).toHaveBeenCalledWith({
        where: {
          id: answer.id,
        },
        data: {
          feedback: answer.feedback,
        },
      });
    });

    it('should throw an InternalServerErrorException', async () => {
      (prismaService.answeredExercise.update as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        answeredExerciseService.addFeedback(answer.id, answer.feedback),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );
      expect(prismaService.answeredExercise.update).toHaveBeenCalledWith({
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
      (prismaService.answeredExercise.delete as jest.Mock).mockResolvedValue(
        answer,
      );

      const result: Return = await answeredExerciseService.deleteAnswer(
        answer.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredExercise.deleteAnswer.status_200,
        data: answer,
      });
      expect(prismaService.answeredExercise.delete).toHaveBeenCalledWith({
        where: {
          id: answer.id,
        },
      });
    });

    it('should throw a NotFoundException', async () => {
      (prismaService.answeredExercise.delete as jest.Mock).mockRejectedValue(
        error,
      );

      await expect(
        answeredExerciseService.deleteAnswer(answer.id),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.answeredExercise.deleteAnswer.status_404,
        ),
      );
      expect(prismaService.answeredExercise.delete).toHaveBeenCalledWith({
        where: {
          id: answer.id,
        },
      });
    });
  });

  it('should throw an InternalServerErrorException', async () => {
    (prismaService.answeredExercise.delete as jest.Mock).mockRejectedValue(
      new InternalServerErrorException(httpMessages_EN.general.status_500),
    );

    await expect(
      answeredExerciseService.deleteAnswer(answer.id),
    ).rejects.toThrow(
      new InternalServerErrorException(httpMessages_EN.general.status_500),
    );
    expect(prismaService.answeredExercise.delete).toHaveBeenCalledWith({
      where: {
        id: answer.id,
      },
    });
  });
});
