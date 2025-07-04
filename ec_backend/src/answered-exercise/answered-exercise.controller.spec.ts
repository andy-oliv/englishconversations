import { Test, TestingModule } from '@nestjs/testing';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import Return from '../common/types/Return';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AnsweredExerciseController } from './answered-exercise.controller';
import { AnsweredExerciseService } from './answered-exercise.service';
import AnsweredExercise from '../entities/AnsweredExercise';
import generateMockAnsweredExercise from '../helper/mocks/generateMockAnsweredExercise';
import { Logger } from 'nestjs-pino';

describe('answeredExercise', () => {
  let answeredExerciseController: AnsweredExerciseController;
  let answeredExerciseService: AnsweredExerciseService;
  let logger: Logger;
  let answer: AnsweredExercise;
  let answerList: AnsweredExercise[];
  let query: { userId: string; exerciseId: number; answeredQuizId: string };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnsweredExerciseController],
      providers: [
        {
          provide: AnsweredExerciseService,
          useValue: {
            addFeedback: jest.fn(),
            saveAnswer: jest.fn(),
            fetchAnswers: jest.fn(),
            fetchAnswerByQuery: jest.fn(),
            fetchAnswerById: jest.fn(),
            deleteAnswer: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    answeredExerciseController = module.get<AnsweredExerciseController>(
      AnsweredExerciseController,
    );
    answeredExerciseService = module.get<AnsweredExerciseService>(
      AnsweredExerciseService,
    );

    answer = generateMockAnsweredExercise();
    answerList = [
      generateMockAnsweredExercise(),
      generateMockAnsweredExercise(),
    ];
    query = {
      userId: answer.userId,
      exerciseId: answer.exerciseId,
      answeredQuizId: answer.answeredQuizId,
    };
  });

  it('should be defined', () => {
    expect(answeredExerciseController).toBeDefined();
  });

  describe('saveAnswer()', () => {
    it('should save an Exercise', async () => {
      (answeredExerciseService.saveAnswer as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.answeredExercise.saveAnswer.status_201,
        data: answer,
      });

      const result: Return =
        await answeredExerciseController.saveAnswer(answer);

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredExercise.saveAnswer.status_201,
        data: answer,
      });
      expect(answeredExerciseService.saveAnswer).toHaveBeenCalledWith(answer);
    });

    it('should throw an InternalServerErrorException', async () => {
      (answeredExerciseService.saveAnswer as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        answeredExerciseController.saveAnswer(answer),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );
      expect(answeredExerciseService.saveAnswer).toHaveBeenCalledWith(answer);
    });
  });

  describe('fetchAnswerByQuery()', () => {
    it('should fetch all answers based on the query', async () => {
      (
        answeredExerciseService.fetchAnswerByQuery as jest.Mock
      ).mockResolvedValue({
        message: httpMessages_EN.answeredExercise.fetchAnswerByQuery.status_200,
        data: answerList,
      });

      const result: Return =
        await answeredExerciseController.fetchAnswerByQuery(query);

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredExercise.fetchAnswerByQuery.status_200,
        data: answerList,
      });

      expect(answeredExerciseService.fetchAnswerByQuery).toHaveBeenCalledWith(
        query.userId,
        query.exerciseId,
        query.answeredQuizId,
      );
    });

    it('should throw a NotFoundException', async () => {
      (
        answeredExerciseService.fetchAnswerByQuery as jest.Mock
      ).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.answeredExercise.fetchAnswerByQuery.status_404,
        ),
      );

      await expect(
        answeredExerciseController.fetchAnswerByQuery(query),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.answeredExercise.fetchAnswerByQuery.status_404,
        ),
      );

      expect(answeredExerciseService.fetchAnswerByQuery).toHaveBeenCalledWith(
        query.userId,
        query.exerciseId,
        query.answeredQuizId,
      );
    });

    it('should throw an InternalServerErrorException', async () => {
      (
        answeredExerciseService.fetchAnswerByQuery as jest.Mock
      ).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        answeredExerciseController.fetchAnswerByQuery(query),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(answeredExerciseService.fetchAnswerByQuery).toHaveBeenCalledWith(
        query.userId,
        query.exerciseId,
        query.answeredQuizId,
      );
    });
  });

  describe('fetchAnswerById()', () => {
    it('should fetch an answer', async () => {
      (answeredExerciseService.fetchAnswerById as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.answeredExercise.fetchAnswerById.status_200,
        data: answer,
      });

      const result: Return = await answeredExerciseController.fetchAnswerById(
        answer.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredExercise.fetchAnswerById.status_200,
        data: answer,
      });

      expect(answeredExerciseService.fetchAnswerById).toHaveBeenCalledWith(
        answer.id,
      );
    });

    it('should throw a NotFoundException', async () => {
      (answeredExerciseService.fetchAnswerById as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.answeredExercise.fetchAnswerById.status_404,
        ),
      );

      await expect(
        answeredExerciseController.fetchAnswerById(answer.id),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.answeredExercise.fetchAnswerById.status_404,
        ),
      );

      expect(answeredExerciseService.fetchAnswerById).toHaveBeenCalledWith(
        answer.id,
      );
    });

    it('should throw an InternalServerErrorException', async () => {
      (answeredExerciseService.fetchAnswerById as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        answeredExerciseController.fetchAnswerById(answer.id),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(answeredExerciseService.fetchAnswerById).toHaveBeenCalledWith(
        answer.id,
      );
    });
  });

  describe('fetchAnswers()', () => {
    it('should fetch all answers', async () => {
      (answeredExerciseService.fetchAnswers as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.answeredExercise.fetchAnswers.status_200,
        data: answerList,
      });

      const result: Return = await answeredExerciseController.fetchAnswers();

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredExercise.fetchAnswers.status_200,
        data: answerList,
      });

      expect(answeredExerciseService.fetchAnswers).toHaveBeenCalled();
    });

    it('should throw a NotFoundException', async () => {
      (answeredExerciseService.fetchAnswers as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.answeredExercise.fetchAnswers.status_404,
        ),
      );

      await expect(answeredExerciseController.fetchAnswers()).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.answeredExercise.fetchAnswers.status_404,
        ),
      );

      expect(answeredExerciseService.fetchAnswers).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException', async () => {
      (answeredExerciseService.fetchAnswers as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(answeredExerciseController.fetchAnswers()).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(answeredExerciseService.fetchAnswers).toHaveBeenCalled();
    });
  });

  describe('addFeedback()', () => {
    it('should add feedback to an answer', async () => {
      (answeredExerciseService.addFeedback as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.answeredExercise.addFeedback.status_200,
        data: answer,
      });

      const result: Return = await answeredExerciseController.addFeedback(
        answer.id,
        { feedback: answer.feedback },
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredExercise.addFeedback.status_200,
        data: answer,
      });

      expect(answeredExerciseService.addFeedback).toHaveBeenCalledWith(
        answer.id,
        answer.feedback,
      );
    });

    it('should throw a NotFoundException', async () => {
      (answeredExerciseService.addFeedback as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.answeredExercise.addFeedback.status_404,
        ),
      );

      await expect(
        answeredExerciseController.addFeedback(answer.id, {
          feedback: answer.feedback,
        }),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.answeredExercise.addFeedback.status_404,
        ),
      );

      expect(answeredExerciseService.addFeedback).toHaveBeenCalledWith(
        answer.id,
        answer.feedback,
      );
    });

    it('should throw an InternalServerErrorException', async () => {
      (answeredExerciseService.addFeedback as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        answeredExerciseController.addFeedback(answer.id, {
          feedback: answer.feedback,
        }),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(answeredExerciseService.addFeedback).toHaveBeenCalledWith(
        answer.id,
        answer.feedback,
      );
    });
  });

  describe('deleteAnswer()', () => {
    it('should delete an answer', async () => {
      (answeredExerciseService.deleteAnswer as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.answeredExercise.deleteAnswer.status_200,
        data: answer,
      });

      const result: Return = await answeredExerciseController.deleteAnswer(
        answer.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredExercise.deleteAnswer.status_200,
        data: answer,
      });

      expect(answeredExerciseService.deleteAnswer).toHaveBeenCalledWith(
        answer.id,
      );
    });

    it('should throw a NotFoundException', async () => {
      (answeredExerciseService.deleteAnswer as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.answeredExercise.deleteAnswer.status_404,
        ),
      );

      await expect(
        answeredExerciseController.deleteAnswer(answer.id),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.answeredExercise.deleteAnswer.status_404,
        ),
      );

      expect(answeredExerciseService.deleteAnswer).toHaveBeenCalledWith(
        answer.id,
      );
    });

    it('should throw an InternalServerErrorException', async () => {
      (answeredExerciseService.deleteAnswer as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        answeredExerciseController.deleteAnswer(answer.id),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(answeredExerciseService.deleteAnswer).toHaveBeenCalledWith(
        answer.id,
      );
    });
  });
});
