import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import Exercise from '../entities/Exercise';
import CreateExerciseDTO from './dto/CreateExercise.dto';
import loggerMessages from '../helper/messages/loggerMessages';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import { CEFRLevels, Difficulty, ExerciseTypes } from '../../generated/prisma';
import generateExceptionMessage from '../helper/functions/generateExceptionMessage';
import UpdateExerciseDTO from './dto/UpdateExercise.dto';
import { FileService } from '../file/file.service';

@Injectable()
export class ExerciseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly fileService: FileService,
  ) {}

  /*Ideally, this method should be part of QuizService. However, to avoid a circular dependency,
  since QuizModule already imports ExerciseModule, we define a local version here.*/
  async throwIfNotQuiz(quizId: string): Promise<void> {
    try {
      await this.prismaService.quiz.findFirstOrThrow({
        where: {
          id: quizId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.exercise.throwIfNotQuiz.status_404,
        );
      }

      handleInternalErrorException(
        'exerciseService',
        'throwIfNotQuiz',
        loggerMessages.exercise.throwIfNotQuiz.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchExercise(exerciseId: number): Promise<Exercise> {
    try {
      const exercise: Exercise =
        await this.prismaService.exercise.findUniqueOrThrow({
          where: {
            id: exerciseId,
          },
        });

      return exercise;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.exercise.fetchExerciseById.status_404,
        );
      }

      handleInternalErrorException(
        'exerciseService',
        'fetchExercise',
        loggerMessages.exercise.fetchExerciseById.status_500,
        this.logger,
        error,
      );
    }
  }

  async throwIfNotExercise(exerciseId: number): Promise<void> {
    try {
      await this.prismaService.exercise.findUniqueOrThrow({
        where: {
          id: exerciseId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.exercise.fetchExerciseById.status_404,
        );
      }

      handleInternalErrorException(
        'exerciseService',
        'throwIfNotExercise',
        loggerMessages.exercise.fetchExerciseById.status_500,
        this.logger,
        error,
      );
    }
  }

  async throwIfExerciseExists(
    type: ExerciseTypes,
    description: string,
    level: CEFRLevels,
    difficulty: Difficulty,
  ): Promise<void> {
    const exerciseExists: Exercise =
      await this.prismaService.exercise.findFirst({
        where: {
          AND: [{ type, description, level, difficulty }],
        },
      });

    if (exerciseExists) {
      this.logger.log({
        message: generateExceptionMessage(
          'exerciseService',
          'throwIfExerciseExists',
          loggerMessages.exercise.throwIfExerciseExists.status_409,
        ),
        data: exerciseExists,
      });

      throw new ConflictException(
        httpMessages_EN.exercise.throwIfExerciseExists.status_409,
      );
    }
  }

  async createExercise(exerciseData: CreateExerciseDTO): Promise<Return> {
    if (exerciseData.quizId) {
      await this.throwIfNotQuiz(exerciseData.quizId);
    }

    await this.throwIfExerciseExists(
      exerciseData.type,
      exerciseData.description,
      exerciseData.level,
      exerciseData.difficulty,
    );

    try {
      const newExercise: Exercise = await this.prismaService.exercise.create({
        data: exerciseData,
      });

      this.logger.log({
        message: generateExceptionMessage(
          'exerciseService',
          'createExercise',
          loggerMessages.exercise.createExercise.status_201,
        ),
        data: newExercise,
      });

      return {
        message: httpMessages_EN.exercise.createExercise.status_201,
        data: newExercise,
      };
    } catch (error) {
      handleInternalErrorException(
        'exerciseService',
        'createExercise',
        loggerMessages.exercise.createExercise.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchExercises(): Promise<Return> {
    try {
      const exerciseList: Exercise[] =
        await this.prismaService.exercise.findMany();

      if (exerciseList.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.exercise.fetchExercises.status_404,
        );
      }

      return {
        message: httpMessages_EN.exercise.fetchExercises.status_200,
        data: exerciseList,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'exerciseService',
        'fetchExercises',
        loggerMessages.exercise.fetchExercises.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchExerciseById(id: number): Promise<Return> {
    try {
      const exercise: Exercise =
        await this.prismaService.exercise.findFirstOrThrow({
          where: {
            id,
          },
          include: {
            quiz: {
              select: {
                id: true,
                title: true,
                description: true,
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
            file: {
              select: {
                id: true,
                type: true,
                name: true,
                size: true,
                url: true,
              },
            },
          },
        });

      return {
        message: httpMessages_EN.exercise.fetchExerciseById.status_200,
        data: exercise,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.exercise.fetchExerciseById.status_404,
        );
      }

      handleInternalErrorException(
        'exerciseService',
        'fetchExerciseById',
        loggerMessages.exercise.fetchExerciseById.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchExercisesByQuery(
    level: CEFRLevels,
    difficulty: Difficulty,
    quizId: string,
  ): Promise<Return> {
    try {
      const exercises: Exercise[] = await this.prismaService.exercise.findMany({
        where: {
          OR: [{ level }, { difficulty }, { quizId }],
        },
      });

      if (exercises.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.exercise.fetchExercisesByQuery.status_404,
        );
      }

      return {
        message: httpMessages_EN.exercise.fetchExercisesByQuery.status_200,
        data: exercises,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'exerciseService',
        'fetchExercisesByQuery',
        loggerMessages.exercise.fetchExercisesByQuery.status_500,
        this.logger,
        error,
      );
    }
  }

  async updateExercise(
    id: number,
    exerciseData: UpdateExerciseDTO,
  ): Promise<Return> {
    try {
      const updatedExercise: Exercise =
        await this.prismaService.exercise.update({
          where: {
            id,
          },
          data: exerciseData,
        });

      this.logger.log({
        message: generateExceptionMessage(
          'exerciseService',
          'updateExercise',
          loggerMessages.exercise.updateExercise.status_200,
        ),
        data: updatedExercise,
      });

      return {
        message: httpMessages_EN.exercise.updateExercise.status_200,
        data: updatedExercise,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.exercise.updateExercise.status_404,
        );
      }
      handleInternalErrorException(
        'exerciseService',
        'updateExercise',
        loggerMessages.exercise.updateExercise.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteExercise(id: number): Promise<Return> {
    try {
      const deletedExercise: Exercise =
        await this.prismaService.exercise.delete({
          where: {
            id,
          },
        });

      this.logger.log({
        message: generateExceptionMessage(
          'exerciseService',
          'deleteExercise',
          loggerMessages.exercise.deleteExercise.status_200,
        ),
        data: deletedExercise,
      });

      return {
        message: httpMessages_EN.exercise.deleteExercise.status_200,
        data: deletedExercise,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.exercise.deleteExercise.status_404,
        );
      }
      handleInternalErrorException(
        'exerciseService',
        'deleteExercise',
        loggerMessages.exercise.deleteExercise.status_500,
        this.logger,
        error,
      );
    }
  }
}
