import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import Quiz from '../common/types/Quiz';
import generateExceptionMessage from '../helper/functions/generateExceptionMessage';
import loggerMessages from '../helper/messages/loggerMessages';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import { CEFRLevels, Difficulty } from '../../generated/prisma';
import UpdateQuizDTO from './dto/updateQuiz.dto';
import { ExerciseService } from '../exercise/exercise.service';

@Injectable()
export class QuizService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly exerciseService: ExerciseService,
  ) {}

  private quizWithExercises = {
    exercises: {
      select: {
        id: true,
        type: true,
        description: true,
      },
    },
  };

  async fetchQuizWithExercises(id: string): Promise<Quiz> {
    try {
      const quiz: Quiz = await this.prismaService.quiz.findFirstOrThrow({
        where: {
          id,
        },
        include: this.quizWithExercises,
      });

      return quiz;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          generateExceptionMessage(
            httpMessages_EN.quiz.fetchQuizWithExercises.status_404,
          ),
        );
      }

      handleInternalErrorException(
        loggerMessages.quiz.fetchQuizWithExercises.status_500,
        this.logger,
        error,
      );
    }
  }

  async throwIfExerciseNotAdded(
    quizId: string,
    exerciseId: number,
  ): Promise<void> {
    try {
      await this.prismaService.exercise.findFirstOrThrow({
        where: {
          AND: [{ id: exerciseId }, { quizId }],
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          generateExceptionMessage(
            httpMessages_EN.quiz.throwIfExerciseNotAdded.status_404,
          ),
        );
      }

      handleInternalErrorException(
        loggerMessages.quiz.throwIfExerciseNotAdded.status_500,
        this.logger,
        error,
      );
    }
  }

  async throwIfNotQuiz(quizId: string): Promise<void> {
    try {
      await this.prismaService.quiz.findUniqueOrThrow({
        where: {
          id: quizId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          generateExceptionMessage(
            httpMessages_EN.quiz.fetchQuizById.status_404,
          ),
        );
      }

      handleInternalErrorException(
        loggerMessages.quiz.fetchQuizById.status_500,
        this.logger,
        error,
      );
    }
  }

  async throwIfQuizExists(title: string, description: string) {
    try {
      const quizExists: Quiz = await this.prismaService.quiz.findFirst({
        where: {
          AND: [{ title }, { description }],
        },
      });

      if (quizExists) {
        this.logger.warn({
          message: generateExceptionMessage(
            loggerMessages.quiz.throwIfQuizExists.status_409,
          ),
          data: quizExists,
        });

        throw new ConflictException(
          generateExceptionMessage(
            httpMessages_EN.quiz.throwIfQuizExists.status_409,
          ),
        );
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      handleInternalErrorException(
        loggerMessages.quiz.throwIfQuizExists.status_500,
        this.logger,
        error,
      );
    }
  }

  async createQuiz(quizData: Quiz): Promise<Return> {
    await this.throwIfQuizExists(quizData.title, quizData.description);
    try {
      const quiz: Quiz = await this.prismaService.quiz.create({
        data: quizData,
      });

      this.logger.log({
        message: loggerMessages.quiz.createQuiz.status_201,
        data: quiz,
      });

      return {
        message: httpMessages_EN.quiz.createQuiz.status_201,
        data: quiz,
      };
    } catch (error) {
      handleInternalErrorException(
        loggerMessages.quiz.createQuiz.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchQuizzes(): Promise<Return> {
    try {
      const quizzes: Quiz[] = await this.prismaService.quiz.findMany();

      if (quizzes.length === 0) {
        throw new NotFoundException(
          generateExceptionMessage(
            httpMessages_EN.quiz.fetchQuizzes.status_404,
          ),
        );
      }

      return {
        message: httpMessages_EN.quiz.fetchQuizzes.status_200,
        data: quizzes,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        loggerMessages.quiz.fetchQuizzes.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchQuizById(id: string): Promise<Return> {
    try {
      const quiz: Quiz = await this.prismaService.quiz.findFirstOrThrow({
        where: {
          id,
        },
        include: this.quizWithExercises,
      });

      return {
        message: httpMessages_EN.quiz.fetchQuizById.status_200,
        data: quiz,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          generateExceptionMessage(
            httpMessages_EN.quiz.fetchQuizById.status_404,
          ),
        );
      }

      handleInternalErrorException(
        loggerMessages.quiz.fetchQuizById.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchQuizzesByQuery(
    level: CEFRLevels,
    difficulty: Difficulty,
  ): Promise<Return> {
    try {
      const quizzes: Quiz[] = await this.prismaService.quiz.findMany({
        where: {
          OR: [{ level }, { difficulty }],
        },
      });

      if (quizzes.length === 0) {
        throw new NotFoundException(
          generateExceptionMessage(
            httpMessages_EN.quiz.fetchQuizzesByQuery.status_404,
          ),
        );
      }

      return {
        message: httpMessages_EN.quiz.fetchQuizzesByQuery.status_200,
        data: quizzes,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        loggerMessages.quiz.fetchQuizzesByQuery.status_500,
        this.logger,
        error,
      );
    }
  }

  async updateQuiz(id: string, quizData: UpdateQuizDTO): Promise<Return> {
    try {
      const updatedQuiz: Quiz = await this.prismaService.quiz.update({
        where: {
          id,
        },
        data: quizData,
      });

      this.logger.log({
        message: generateExceptionMessage(
          loggerMessages.quiz.updateQuiz.status_200,
        ),
        data: updatedQuiz,
      });

      return {
        message: httpMessages_EN.quiz.updateQuiz.status_200,
        data: updatedQuiz,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          generateExceptionMessage(httpMessages_EN.quiz.updateQuiz.status_404),
        );
      }

      handleInternalErrorException(
        loggerMessages.quiz.updateQuiz.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteQuiz(id: string): Promise<Return> {
    try {
      const deletedQuiz: Quiz = await this.prismaService.quiz.delete({
        where: {
          id,
        },
      });

      this.logger.warn({
        message: generateExceptionMessage(
          loggerMessages.quiz.deleteQuiz.status_200,
        ),
        data: deletedQuiz,
      });

      return {
        message: httpMessages_EN.quiz.deleteQuiz.status_200,
        data: deletedQuiz,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          generateExceptionMessage(httpMessages_EN.quiz.deleteQuiz.status_404),
        );
      }

      handleInternalErrorException(
        loggerMessages.quiz.deleteQuiz.status_500,
        this.logger,
        error,
      );
    }
  }

  async addExercise(quizId: string, exerciseId: number): Promise<Return> {
    await this.throwIfNotQuiz(quizId);
    await this.exerciseService.throwIfNotExercise(exerciseId);

    try {
      await this.prismaService.exercise.update({
        where: {
          id: exerciseId,
        },
        data: {
          quizId,
        },
      });

      const updatedQuiz: Quiz = await this.fetchQuizWithExercises(quizId);

      this.logger.log({
        message: loggerMessages.quiz.addExercise.status_200,
        data: updatedQuiz,
      });

      return {
        message: httpMessages_EN.quiz.addExercise.status_200,
        data: updatedQuiz,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          generateExceptionMessage(httpMessages_EN.quiz.addExercise.status_409),
        );
      }

      handleInternalErrorException(
        loggerMessages.quiz.addExercise.status_500,
        this.logger,
        error,
      );
    }
  }

  async removeExercise(quizId: string, exerciseId: number): Promise<Return> {
    await this.throwIfNotQuiz(quizId);
    await this.exerciseService.throwIfNotExercise(exerciseId);
    await this.throwIfExerciseNotAdded(quizId, exerciseId);

    try {
      await this.prismaService.exercise.update({
        where: {
          id: exerciseId,
        },
        data: {
          quizId: null,
        },
      });

      const updatedQuiz: Quiz = await this.fetchQuizWithExercises(quizId);

      this.logger.warn({
        message: loggerMessages.quiz.removeExercise.status_200,
        data: updatedQuiz,
      });

      return {
        message: httpMessages_EN.quiz.removeExercise.status_200,
        data: updatedQuiz,
      };
    } catch (error) {
      handleInternalErrorException(
        loggerMessages.quiz.removeExercise.status_500,
        this.logger,
        error,
      );
    }
  }
}
