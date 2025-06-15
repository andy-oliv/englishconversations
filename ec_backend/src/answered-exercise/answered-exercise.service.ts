import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import AnsweredExercise from '../common/types/AnsweredExercise';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import { StudentService } from '../student/student.service';
import { ExerciseService } from '../exercise/exercise.service';
import { QuizService } from '../quiz/quiz.service';
import Exercise from '../common/types/Exercise';
import { isEqual } from 'lodash';
import generateExceptionMessage from '../helper/functions/generateExceptionMessage';

@Injectable()
export class AnsweredExerciseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly studentService: StudentService,
    private readonly exerciseService: ExerciseService,
    private readonly quizService: QuizService,
  ) {}

  async checkIfAnswered(
    exerciseId: number,
    studentId: string,
  ): Promise<boolean> {
    try {
      const answerExists: AnsweredExercise =
        await this.prismaService.answeredExercise.findFirst({
          where: {
            AND: [{ exerciseId }, { studentId }],
          },
        });

      if (answerExists) {
        return true;
      }
      return false;
    } catch (error) {
      handleInternalErrorException(
        loggerMessages.answeredExercise.checkIfAnswered.status_500,
        this.logger,
        error,
      );
    }
  }

  async saveAnswer(data: AnsweredExercise): Promise<Return> {
    await this.studentService.throwIfNotStudent(data.studentId);

    if (data.quizId) {
      await this.quizService.throwIfNotQuiz(data.quizId);
    }

    const exercise: Exercise = await this.exerciseService.fetchExercise(
      data.exerciseId,
    );
    const alreadyAnswered: boolean = await this.checkIfAnswered(
      data.exerciseId,
      data.studentId,
    );

    try {
      const exerciseAnswer: AnsweredExercise =
        await this.prismaService.answeredExercise.create({
          data: {
            exerciseId: data.exerciseId,
            studentId: data.studentId,
            quizId: data.quizId,
            isRetry: alreadyAnswered,
            selectedAnswers: data.selectedAnswers,
            textAnswer: data.textAnswer,
            audioUrl: data.audioUrl,
            isCorrectAnswer: isEqual(
              exercise.correctAnswer,
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
          generateExceptionMessage(
            httpMessages_EN.answeredExercise.fetchAnswers.status_404,
          ),
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
        });

      return {
        message: httpMessages_EN.answeredExercise.fetchAnswerById.status_200,
        data: answer,
      };
    } catch (error) {
      if ((error.code = 'P2025')) {
        throw new NotFoundException(
          generateExceptionMessage(
            httpMessages_EN.answeredExercise.fetchAnswerById.status_404,
          ),
        );
      }
      handleInternalErrorException(
        loggerMessages.answeredExercise.fetchAnswerById.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchAnswerByQuery(
    studentId: string,
    exerciseId: number,
    quizId: string,
  ): Promise<Return> {
    try {
      const answerList: AnsweredExercise[] =
        await this.prismaService.answeredExercise.findMany({
          where: {
            OR: [{ studentId }, { exerciseId }, { quizId }],
          },
        });

      if (answerList.length === 0) {
        throw new NotFoundException(
          generateExceptionMessage(
            httpMessages_EN.answeredExercise.fetchAnswerByQuery.status_404,
          ),
        );
      }

      return {
        message: httpMessages_EN.answeredExercise.fetchAnswerByQuery.status_200,
        data: answerList,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        loggerMessages.answeredExercise.fetchAnswerByQuery.status_500,
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
          generateExceptionMessage(
            httpMessages_EN.answeredExercise.deleteAnswer.status_404,
          ),
        );
      }

      handleInternalErrorException(
        loggerMessages.answeredExercise.deleteAnswer.status_500,
        this.logger,
        error,
      );
    }
  }
}
