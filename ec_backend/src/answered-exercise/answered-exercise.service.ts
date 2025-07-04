import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import AnsweredExercise from '../entities/AnsweredExercise';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import { ExerciseService } from '../exercise/exercise.service';
import Exercise from '../entities/Exercise';
import { isEqual } from 'lodash';
import generateExceptionMessage from '../helper/functions/generateExceptionMessage';
import { UserService } from '../user/user.service';
import { AnsweredQuizService } from '../answered-quiz/answered-quiz.service';

@Injectable()
export class AnsweredExerciseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly userService: UserService,
    private readonly exerciseService: ExerciseService,
    private readonly answeredQuizService: AnsweredQuizService,
  ) {}

  async validateAnswer(
    userId: string,
    answeredQuizId: string,
    exerciseId: number,
  ): Promise<{ exercise: Exercise; alreadyAnswered: boolean }> {
    await this.userService.throwIfNotUser(userId);

    if (answeredQuizId) {
      await this.answeredQuizService.throwIfNotAnsweredQuiz(answeredQuizId);
    }

    const exercise: Exercise =
      await this.exerciseService.fetchExercise(exerciseId);
    const alreadyAnswered: boolean = await this.checkIfAnswered(
      exerciseId,
      userId,
    );

    return { exercise, alreadyAnswered };
  }

  async checkIfAnswered(exerciseId: number, userId: string): Promise<boolean> {
    try {
      const answerExists: AnsweredExercise =
        await this.prismaService.answeredExercise.findFirst({
          where: {
            AND: [{ exerciseId }, { userId }],
          },
        });

      if (answerExists) {
        return true;
      }
      return false;
    } catch (error) {
      handleInternalErrorException(
        'answeredExerciseService',
        'checkIfAnswered',
        loggerMessages.answeredExercise.checkIfAnswered.status_500,
        this.logger,
        error,
      );
    }
  }

  async saveAnswer(data: AnsweredExercise): Promise<Return> {
    const answerValidation: { exercise: Exercise; alreadyAnswered: boolean } =
      await this.validateAnswer(
        data.userId,
        data.answeredQuizId,
        data.exerciseId,
      );

    try {
      const exerciseAnswer: AnsweredExercise =
        await this.prismaService.answeredExercise.create({
          data: {
            exerciseId: data.exerciseId,
            userId: data.userId,
            answeredQuizId: data.answeredQuizId,
            isRetry: answerValidation.alreadyAnswered,
            selectedAnswers: data.selectedAnswers,
            textAnswer: data.textAnswer,
            fileId: data.fileId,
            isCorrectAnswer: isEqual(
              answerValidation.exercise.correctAnswer,
              data.selectedAnswers,
            ),
            feedback: data.feedback,
            elapsedTime: data.elapsedTime,
          },
        });

      return {
        message: httpMessages_EN.answeredExercise.saveAnswer.status_201,
        data: exerciseAnswer,
      };
    } catch (error) {
      handleInternalErrorException(
        'answeredExerciseService',
        'saveAnswer',
        loggerMessages.answeredExercise.saveAnswer.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchAnswers(): Promise<Return> {
    try {
      const answerList: AnsweredExercise[] =
        await this.prismaService.answeredExercise.findMany();

      if (answerList.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.answeredExercise.fetchAnswers.status_404,
        );
      }

      return {
        message: httpMessages_EN.answeredExercise.fetchAnswers.status_200,
        data: answerList,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'answeredExerciseService',
        'fetchAnswers',
        loggerMessages.answeredExercise.fetchAnswers.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchAnswerById(id: string): Promise<Return> {
    try {
      const answer: AnsweredExercise =
        await this.prismaService.answeredExercise.findFirstOrThrow({
          where: {
            id,
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

      return {
        message: httpMessages_EN.answeredExercise.fetchAnswerById.status_200,
        data: answer,
      };
    } catch (error) {
      if ((error.code = 'P2025')) {
        throw new NotFoundException(
          httpMessages_EN.answeredExercise.fetchAnswerById.status_404,
        );
      }
      handleInternalErrorException(
        'answeredExerciseService',
        'fetchAnswerById',
        loggerMessages.answeredExercise.fetchAnswerById.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchAnswersByUser(userId: string): Promise<Return> {
    try {
      const answerList: AnsweredExercise[] =
        await this.prismaService.answeredExercise.findMany({
          where: {
            userId,
          },
        });

      if (answerList.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.answeredExercise.fetchAnswersByUser.status_404,
        );
      }

      return {
        message: httpMessages_EN.answeredExercise.fetchAnswersByUser.status_200,
        data: answerList,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'answeredExerciseService',
        'fetchAnswersByUser',
        loggerMessages.answeredExercise.fetchAnswersByUser.status_500,
        this.logger,
        error,
      );
    }
  }

  async addFeedback(id: string, feedback: string): Promise<Return> {
    try {
      const updatedAnswer: AnsweredExercise =
        await this.prismaService.answeredExercise.update({
          where: {
            id,
          },
          data: {
            feedback,
          },
        });

      this.logger.log({
        message: generateExceptionMessage(
          'answeredExerciseService',
          'addfeedback',
          loggerMessages.answeredExercise.addFeedback.status_200,
        ),
        data: updatedAnswer,
      });

      return {
        message: httpMessages_EN.answeredExercise.addFeedback.status_200,
        data: updatedAnswer,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.answeredExercise.addFeedback.status_404,
        );
      }

      handleInternalErrorException(
        'answeredExerciseService',
        'addFeedback',
        loggerMessages.answeredExercise.addFeedback.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteAnswer(id: string): Promise<Return> {
    try {
      const deletedAnswer: AnsweredExercise =
        await this.prismaService.answeredExercise.delete({
          where: {
            id,
          },
        });

      this.logger.warn({
        message: generateExceptionMessage(
          'answeredExerciseService',
          'deleteAnswer',
          loggerMessages.answeredExercise.deleteAnswer.status_200,
        ),
        data: deletedAnswer,
      });

      return {
        message: httpMessages_EN.answeredExercise.deleteAnswer.status_200,
        data: deletedAnswer,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.answeredExercise.deleteAnswer.status_404,
        );
      }

      handleInternalErrorException(
        'answeredExerciseService',
        'deleteAnswer',
        loggerMessages.answeredExercise.deleteAnswer.status_500,
        this.logger,
        error,
      );
    }
  }
}
