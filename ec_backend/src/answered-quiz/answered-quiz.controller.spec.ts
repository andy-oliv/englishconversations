import { Test, TestingModule } from '@nestjs/testing';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import Return from '../common/types/Return';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AnsweredQuizController } from './answered-quiz.controller';
import { AnsweredQuizService } from './answered-quiz.service';
import AnsweredQuiz from '../common/types/AnsweredQuiz';
import generateMockAnsweredQuiz from '../helper/mocks/generateMocAnsweredQuiz';

describe('answeredQuiz', () => {
  let answeredQuizController: AnsweredQuizController;
  let answeredQuizService: AnsweredQuizService;
  let answer: AnsweredQuiz;
  let answerList: AnsweredQuiz[];
  let query: { quizId: string; studentId: string };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnsweredQuizController],
      providers: [
        {
          provide: AnsweredQuizService,
          useValue: {
            addFeedback: jest.fn(),
            saveAnswer: jest.fn(),
            fetchAnswers: jest.fn(),
            fetchAnswersByQuery: jest.fn(),
            fetchAnswerById: jest.fn(),
            deleteAnswer: jest.fn(),
          },
        },
      ],
    }).compile();

    answeredQuizController = module.get<AnsweredQuizController>(
      AnsweredQuizController,
    );
    answeredQuizService = module.get<AnsweredQuizService>(AnsweredQuizService);

    answer = generateMockAnsweredQuiz();
    answerList = [generateMockAnsweredQuiz(), generateMockAnsweredQuiz()];
    query = {
      quizId: answer.quizId,
      studentId: answer.studentId,
    };
  });

  it('should be defined', () => {
    expect(answeredQuizController).toBeDefined();
  });

  describe('saveAnswer()', () => {
    it('should save an Exercise', async () => {
      (answeredQuizService.saveAnswer as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.answeredQuiz.saveAnswer.status_201,
        data: answer,
      });

      const result: Return = await answeredQuizController.saveAnswer(answer);

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredQuiz.saveAnswer.status_201,
        data: answer,
      });
      expect(answeredQuizService.saveAnswer).toHaveBeenCalledWith(answer);
    });

    it('should throw an InternalServerErrorException', async () => {
      (answeredQuizService.saveAnswer as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(answeredQuizController.saveAnswer(answer)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );
      expect(answeredQuizService.saveAnswer).toHaveBeenCalledWith(answer);
    });
  });

  describe('fetchAnswersByQuery()', () => {
    it('should fetch all answers based on the query', async () => {
      (answeredQuizService.fetchAnswersByQuery as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.answeredQuiz.fetchAnswersByQuery.status_200,
        data: answerList,
      });

      const result: Return = await answeredQuizController.fetchAnswersByQuery(
        answer.quizId,
        answer.studentId,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredQuiz.fetchAnswersByQuery.status_200,
        data: answerList,
      });

      expect(answeredQuizService.fetchAnswersByQuery).toHaveBeenCalledWith(
        query.quizId,
        query.studentId,
      );
    });

    it('should throw a NotFoundException', async () => {
      (answeredQuizService.fetchAnswersByQuery as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.answeredQuiz.fetchAnswersByQuery.status_404,
        ),
      );

      await expect(
        answeredQuizController.fetchAnswersByQuery(
          answer.quizId,
          answer.studentId,
        ),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.answeredQuiz.fetchAnswersByQuery.status_404,
        ),
      );

      expect(answeredQuizService.fetchAnswersByQuery).toHaveBeenCalledWith(
        query.quizId,
        query.studentId,
      );
    });

    it('should throw an InternalServerErrorException', async () => {
      (answeredQuizService.fetchAnswersByQuery as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        answeredQuizController.fetchAnswersByQuery(
          answer.quizId,
          answer.studentId,
        ),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(answeredQuizService.fetchAnswersByQuery).toHaveBeenCalledWith(
        query.quizId,
        query.studentId,
      );
    });
  });

  describe('fetchAnswerById()', () => {
    it('should fetch an answer', async () => {
      (answeredQuizService.fetchAnswerById as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.answeredQuiz.fetchAnswerById.status_200,
        data: answer,
      });

      const result: Return = await answeredQuizController.fetchAnswerById(
        answer.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredQuiz.fetchAnswerById.status_200,
        data: answer,
      });

      expect(answeredQuizService.fetchAnswerById).toHaveBeenCalledWith(
        answer.id,
      );
    });

    it('should throw a NotFoundException', async () => {
      (answeredQuizService.fetchAnswerById as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.answeredQuiz.fetchAnswerById.status_404,
        ),
      );

      await expect(
        answeredQuizController.fetchAnswerById(answer.id),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.answeredQuiz.fetchAnswerById.status_404,
        ),
      );

      expect(answeredQuizService.fetchAnswerById).toHaveBeenCalledWith(
        answer.id,
      );
    });

    it('should throw an InternalServerErrorException', async () => {
      (answeredQuizService.fetchAnswerById as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        answeredQuizController.fetchAnswerById(answer.id),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(answeredQuizService.fetchAnswerById).toHaveBeenCalledWith(
        answer.id,
      );
    });
  });

  describe('fetchAnswers()', () => {
    it('should fetch all answers', async () => {
      (answeredQuizService.fetchAnswers as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.answeredQuiz.fetchAnswers.status_200,
        data: answerList,
      });

      const result: Return = await answeredQuizController.fetchAnswers();

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredQuiz.fetchAnswers.status_200,
        data: answerList,
      });

      expect(answeredQuizService.fetchAnswers).toHaveBeenCalled();
    });

    it('should throw a NotFoundException', async () => {
      (answeredQuizService.fetchAnswers as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.answeredQuiz.fetchAnswers.status_404,
        ),
      );

      await expect(answeredQuizController.fetchAnswers()).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.answeredQuiz.fetchAnswers.status_404,
        ),
      );

      expect(answeredQuizService.fetchAnswers).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException', async () => {
      (answeredQuizService.fetchAnswers as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(answeredQuizController.fetchAnswers()).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(answeredQuizService.fetchAnswers).toHaveBeenCalled();
    });
  });

  describe('addFeedback()', () => {
    it('should add feedback to an answer', async () => {
      (answeredQuizService.addFeedback as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.answeredQuiz.addFeedback.status_200,
        data: answer,
      });

      const result: Return = await answeredQuizController.addFeedback(
        answer.id,
        { feedback: answer.feedback },
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredQuiz.addFeedback.status_200,
        data: answer,
      });

      expect(answeredQuizService.addFeedback).toHaveBeenCalledWith(
        answer.id,
        answer.feedback,
      );
    });

    it('should throw a NotFoundException', async () => {
      (answeredQuizService.addFeedback as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.answeredQuiz.addFeedback.status_404,
        ),
      );

      await expect(
        answeredQuizController.addFeedback(answer.id, {
          feedback: answer.feedback,
        }),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.answeredQuiz.addFeedback.status_404,
        ),
      );

      expect(answeredQuizService.addFeedback).toHaveBeenCalledWith(
        answer.id,
        answer.feedback,
      );
    });

    it('should throw an InternalServerErrorException', async () => {
      (answeredQuizService.addFeedback as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        answeredQuizController.addFeedback(answer.id, {
          feedback: answer.feedback,
        }),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(answeredQuizService.addFeedback).toHaveBeenCalledWith(
        answer.id,
        answer.feedback,
      );
    });
  });

  describe('deleteAnswer()', () => {
    it('should delete an answer', async () => {
      (answeredQuizService.deleteAnswer as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.answeredQuiz.deleteAnswer.status_200,
        data: answer,
      });

      const result: Return = await answeredQuizController.deleteAnswer(
        answer.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.answeredQuiz.deleteAnswer.status_200,
        data: answer,
      });

      expect(answeredQuizService.deleteAnswer).toHaveBeenCalledWith(answer.id);
    });

    it('should throw a NotFoundException', async () => {
      (answeredQuizService.deleteAnswer as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.answeredQuiz.deleteAnswer.status_404,
        ),
      );

      await expect(
        answeredQuizController.deleteAnswer(answer.id),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.answeredQuiz.deleteAnswer.status_404,
        ),
      );

      expect(answeredQuizService.deleteAnswer).toHaveBeenCalledWith(answer.id);
    });

    it('should throw an InternalServerErrorException', async () => {
      (answeredQuizService.deleteAnswer as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        answeredQuizController.deleteAnswer(answer.id),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(answeredQuizService.deleteAnswer).toHaveBeenCalledWith(answer.id);
    });
  });
});
