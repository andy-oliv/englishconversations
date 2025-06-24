import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import AnsweredQuiz from '../entities/AnsweredQuiz';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import { QuizService } from '../quiz/quiz.service';
import { StudentService } from '../student/student.service';

@Injectable()
export class AnsweredQuizService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly quizService: QuizService,
    private readonly studentService: StudentService,
  ) {}

  async checkIsRetry(quizId: string, studentId: string): Promise<boolean> {
    try {
      const answerExists: AnsweredQuiz =
        await this.prismaService.answeredQuiz.findFirst({
          where: {
            AND: [{ quizId }, { studentId }],
          },
        });

      if (answerExists) {
        return true;
      }

      return false;
    } catch (error) {
      handleInternalErrorException(
        'answeredQuizService',
        'checkIsRetry',
        loggerMessages.answeredQuiz.checkIsRetry.status_500,
        this.logger,
        error,
      );
    }
  }

  async answerValidation(quizId: string, studentId: string): Promise<boolean> {
    await this.quizService.throwIfNotQuiz(quizId);
    await this.studentService.throwIfNotStudent(studentId);
    const retry: boolean = await this.checkIsRetry(quizId, studentId);

    return retry;
  }

  async saveAnswer(data: AnsweredQuiz): Promise<Return> {
    const retry: boolean = await this.answerValidation(
      data.quizId,
      data.studentId,
    );

    try {
      const answer: AnsweredQuiz = await this.prismaService.answeredQuiz.create(
        {
          data: {
            quizId: data.quizId,
            studentId: data.studentId,
            score: data.score,
            feedback: data.feedback,
            elapsedTime: data.elapsedTime,
            isRetry: retry,
          },
        },
      );

      return {
        message: httpMessages_EN.answeredQuiz.saveAnswer.status_201,
        data: answer,
      };
    } catch (error) {
      handleInternalErrorException(
        'answeredQuizService',
        'saveAnswer',
        loggerMessages.answeredQuiz.saveAnswer.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchAnswers(): Promise<Return> {
    try {
      const answers: AnsweredQuiz[] =
        await this.prismaService.answeredQuiz.findMany();

      if (answers.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.answeredQuiz.fetchAnswers.status_404,
        );
      }

      return {
        message: httpMessages_EN.answeredQuiz.fetchAnswers.status_200,
        data: answers,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'answeredQuizService',
        'fetchAnswers',
        loggerMessages.answeredQuiz.fetchAnswers.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchAnswerById(id: string): Promise<Return> {
    try {
      const answer: AnsweredQuiz =
        await this.prismaService.answeredQuiz.findFirstOrThrow({
          where: {
            id,
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
                fileId: true,
                isCorrectAnswer: true,
                feedback: true,
              },
            },
          },
        });

      return {
        message: httpMessages_EN.answeredQuiz.fetchAnswerById.status_200,
        data: answer,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.answeredQuiz.fetchAnswerById.status_404,
        );
      }

      handleInternalErrorException(
        'answeredQuizService',
        'fetchAnswerById',
        loggerMessages.answeredQuiz.fetchAnswerById.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchAnswersByQuery(
    quizId: string,
    studentId: string,
  ): Promise<Return> {
    try {
      const answers: AnsweredQuiz[] =
        await this.prismaService.answeredQuiz.findMany({
          where: {
            AND: [{ quizId }, { studentId }],
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

      if (answers.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.answeredQuiz.fetchAnswersByQuery.status_404,
        );
      }

      return {
        message: httpMessages_EN.answeredQuiz.fetchAnswersByQuery.status_200,
        data: answers,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'answeredQuizService',
        'fetchAnswersByQuery',
        loggerMessages.answeredQuiz.fetchAnswersByQuery.status_500,
        this.logger,
        error,
      );
    }
  }

  async addFeedback(id: string, feedback: string): Promise<Return> {
    try {
      const updatedAnswer: AnsweredQuiz =
        await this.prismaService.answeredQuiz.update({
          where: {
            id,
          },
          data: {
            feedback,
          },
        });

      return {
        message: httpMessages_EN.answeredQuiz.addFeedback.status_200,
        data: updatedAnswer,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.answeredQuiz.addFeedback.status_404,
        );
      }

      handleInternalErrorException(
        'answeredQuizService',
        'addFeedback',
        loggerMessages.answeredQuiz.addFeedback.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteAnswer(id: string): Promise<Return> {
    try {
      const deletedAnswer: AnsweredQuiz =
        await this.prismaService.answeredQuiz.delete({
          where: {
            id,
          },
        });

      return {
        message: httpMessages_EN.answeredQuiz.deleteAnswer.status_200,
        data: deletedAnswer,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.answeredQuiz.deleteAnswer.status_404,
        );
      }

      handleInternalErrorException(
        'answeredQuizService',
        'deleteAnswer',
        loggerMessages.answeredQuiz.deleteAnswer.status_500,
        this.logger,
        error,
      );
    }
  }
}
