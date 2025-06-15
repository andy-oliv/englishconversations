import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import Exercise from '../common/types/Exercise';
import CreateExerciseDTO from './dto/CreateExercise.dto';
import loggerMessages from '../helper/messages/loggerMessages';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import { CEFRLevels, Difficulty, ExerciseTypes } from '../../generated/prisma';
import generateExceptionMessage from '../helper/functions/generateExceptionMessage';
import ExceptionMessage from '../common/types/ExceptionMessage';
import UpdateExerciseDTO from './dto/UpdateExercise.dto';

@Injectable()
export class ExerciseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

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
          generateExceptionMessage(
            httpMessages_EN.exercise.fetchExerciseById.status_404,
          ),
        );
      }

      handleInternalErrorException(
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
          generateExceptionMessage(
            httpMessages_EN.exercise.fetchExerciseById.status_404,
          ),
        );
      }

      handleInternalErrorException(
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
      const errorMessage: ExceptionMessage = generateExceptionMessage(
        loggerMessages.exercise.throwIfExerciseExists.status_409,
      );

      this.logger.warn({
        message: errorMessage,
        data: exerciseExists,
      });

      throw new ConflictException(errorMessage);
    }
  }

  async createExercise(exerciseData: CreateExerciseDTO): Promise<Return> {
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
        message: loggerMessages.exercise.createExercise.status_201,
        data: newExercise,
      });

      return {
        message: httpMessages_EN.exercise.createExercise.status_201,
        data: newExercise,
      };
    } catch (error) {
      handleInternalErrorException(
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
          generateExceptionMessage(
            httpMessages_EN.exercise.fetchExercises.status_404,
          ),
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
        });

      return {
        message: httpMessages_EN.exercise.fetchExerciseById.status_200,
        data: exercise,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          generateExceptionMessage(
            httpMessages_EN.exercise.fetchExerciseById.status_404,
          ),
        );
      }

      handleInternalErrorException(
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
          generateExceptionMessage(
            httpMessages_EN.exercise.fetchExercisesByQuery.status_404,
          ),
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
          generateExceptionMessage(
            httpMessages_EN.exercise.updateExercise.status_404,
          ),
        );
      }
      handleInternalErrorException(
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

      this.logger.warn({
        message: generateExceptionMessage(
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
          generateExceptionMessage(
            httpMessages_EN.exercise.deleteExercise.status_404,
          ),
        );
      }
      handleInternalErrorException(
        loggerMessages.exercise.deleteExercise.status_500,
        this.logger,
        error,
      );
    }
  }
}
