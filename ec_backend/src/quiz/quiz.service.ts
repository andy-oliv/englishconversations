import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import Quiz from '../entities/Quiz';
import generateExceptionMessage from '../helper/functions/generateExceptionMessage';
import loggerMessages from '../helper/messages/loggerMessages';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import { CEFRLevels, Difficulty } from '../../generated/prisma';
import UpdateQuizDTO from './dto/updateQuiz.dto';
import { ExerciseService } from '../exercise/exercise.service';
import Exercise from '../entities/Exercise';
import { FileService } from '../file/file.service';

@Injectable()
export class QuizService {
  private includeExercises = {
    exercises: {
      select: {
        id: true,
        type: true,
        description: true,
      },
    },
    file: {
      select: {
        id: true,
        name: true,
        type: true,
        size: true,
        url: true,
      },
    },
    tags: {
      select: {
        tag: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    },
  };

  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly exerciseService: ExerciseService,
    private readonly fileService: FileService,
  ) {}

  async validateAddition(quizId: string, exerciseId: number): Promise<void> {
    await this.throwIfNotQuiz(quizId);
    await this.exerciseService.throwIfNotExercise(exerciseId);
    await this.throwIfExerciseAdded(quizId, exerciseId);
  }

  async validateRemoval(quizId: string, exerciseId: number): Promise<void> {
    await this.throwIfNotQuiz(quizId);
    await this.exerciseService.throwIfNotExercise(exerciseId);
    await this.throwIfExerciseNotAdded(quizId, exerciseId);
  }

  async fetchQuizWithExercises(id: string): Promise<Quiz> {
    try {
      const quiz: Quiz = await this.prismaService.quiz.findFirstOrThrow({
        where: {
          id,
        },
        include: this.includeExercises,
      });

      return quiz;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.quiz.fetchQuizWithExercises.status_404,
        );
      }

      handleInternalErrorException(
        'quizService',
        'fetchQuizWithExercises',
        loggerMessages.quiz.fetchQuizWithExercises.status_500,
        this.logger,
        error,
      );
    }
  }

  async throwIfExerciseAdded(
    quizId: string,
    exerciseId: number,
  ): Promise<void> {
    try {
      const check: Exercise = await this.prismaService.exercise.findFirst({
        where: {
          id: exerciseId,
        },
      });

      if (check.quizId === quizId) {
        throw new ConflictException(
          httpMessages_EN.quiz.throwIfExerciseAdded.status_4092,
        );
      } else if (check.quizId !== quizId && check.quizId !== null) {
        throw new ConflictException(
          httpMessages_EN.quiz.throwIfExerciseAdded.status_409,
        );
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      handleInternalErrorException(
        'quizService',
        'throwIfExerciseAdded',
        loggerMessages.quiz.throwIfExerciseAdded.status_500,
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
          httpMessages_EN.quiz.throwIfExerciseNotAdded.status_404,
        );
      }

      handleInternalErrorException(
        'quizService',
        'throwIfExerciseNotAdded',
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
          httpMessages_EN.quiz.fetchQuizById.status_404,
        );
      }

      handleInternalErrorException(
        'quizService',
        'throwIfNotQuiz',
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
            'quizService',
            'throwIfQuizExists',
            loggerMessages.quiz.throwIfQuizExists.status_409,
          ),
          data: quizExists,
        });

        throw new ConflictException(
          httpMessages_EN.quiz.throwIfQuizExists.status_409,
        );
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      handleInternalErrorException(
        'quizService',
        'throwIfQuizExists',
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
        'quizService',
        'createQuiz',
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
          httpMessages_EN.quiz.fetchQuizzes.status_404,
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
        'quizService',
        'fetchQuizzes',
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
        include: this.includeExercises,
      });

      return {
        message: httpMessages_EN.quiz.fetchQuizById.status_200,
        data: quiz,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.quiz.fetchQuizById.status_404,
        );
      }

      handleInternalErrorException(
        'quizService',
        'fetchQuizById',
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
          httpMessages_EN.quiz.fetchQuizzesByQuery.status_404,
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
        'quizService',
        'fetchQuizzesByQuery',
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
          'quizService',
          'updateQuiz',
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
        throw new NotFoundException(httpMessages_EN.quiz.updateQuiz.status_404);
      }

      handleInternalErrorException(
        'quizService',
        'updateQuiz',
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

      if (deletedQuiz.fileId) {
        await this.fileService.deleteFile(deletedQuiz.fileId);
      }

      this.logger.log({
        message: generateExceptionMessage(
          'quizService',
          'deleteQuiz',
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
        throw new NotFoundException(httpMessages_EN.quiz.deleteQuiz.status_404);
      }

      handleInternalErrorException(
        'quizService',
        'deleteQuiz',
        loggerMessages.quiz.deleteQuiz.status_500,
        this.logger,
        error,
      );
    }
  }

  async addExercise(quizId: string, exerciseId: number): Promise<Return> {
    await this.validateAddition(quizId, exerciseId);

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
      handleInternalErrorException(
        'quizService',
        'addExercise',
        loggerMessages.quiz.addExercise.status_500,
        this.logger,
        error,
      );
    }
  }

  async removeExercise(quizId: string, exerciseId: number): Promise<Return> {
    await this.validateRemoval(quizId, exerciseId);

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

      this.logger.log({
        message: loggerMessages.quiz.removeExercise.status_200,
        data: updatedQuiz,
      });

      return {
        message: httpMessages_EN.quiz.removeExercise.status_200,
        data: updatedQuiz,
      };
    } catch (error) {
      handleInternalErrorException(
        'quizService',
        'removeExercise',
        loggerMessages.quiz.removeExercise.status_500,
        this.logger,
        error,
      );
    }
  }
}
