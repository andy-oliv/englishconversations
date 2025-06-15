import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseService } from './exercise.service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Exercise from '../common/types/Exercise';
import generateMockExercise from '../helper/mocks/generateMockExercise';
import loggerMessages from '../helper/messages/loggerMessages';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('ExerciseService', () => {
  let exerciseService: ExerciseService;
  let prismaService: PrismaService;
  let logger: Logger;
  let exercises: Exercise[];
  let emptyExerciseList: Exercise[];
  let exercise: Exercise;
  let error: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExerciseService,
        {
          provide: PrismaService,
          useValue: {
            exercise: {
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

    exerciseService = module.get<ExerciseService>(ExerciseService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);

    exercises = [generateMockExercise(), generateMockExercise()];
    exercise = generateMockExercise();
    error = {
      code: 'P2025',
    };
    emptyExerciseList = [];
  });

  it('should be defined', () => {
    expect(exerciseService).toBeDefined();
  });

  describe('createExercise()', () => {
    it('should create a new exercise', async () => {
      jest
        .spyOn(exerciseService, 'throwIfExerciseExists')
        .mockResolvedValue(undefined);
      (prismaService.exercise.create as jest.Mock).mockResolvedValue(exercise);
      (logger.log as jest.Mock).mockResolvedValue(
        loggerMessages.exercise.createExercise.status_201,
      );

      const result: Return = await exerciseService.createExercise(exercise);

      expect(result).toMatchObject({
        message: httpMessages_EN.exercise.createExercise.status_201,
        data: exercise,
      });
      expect(exerciseService.throwIfExerciseExists).toHaveBeenCalledWith(
        exercise.type,
        exercise.description,
        exercise.level,
        exercise.difficulty,
      );
      expect(prismaService.exercise.create).toHaveBeenCalledWith({
        data: exercise,
      });
      expect(logger.log).toHaveBeenLastCalledWith({
        message: loggerMessages.exercise.createExercise.status_201,
        data: exercise,
      });
    });

    it('should return a ConflictException because the exercise already exists', async () => {
      jest
        .spyOn(exerciseService, 'throwIfExerciseExists')
        .mockRejectedValue(new ConflictException());

      await expect(exerciseService.createExercise(exercise)).rejects.toThrow(
        new ConflictException(),
      );

      expect(exerciseService.throwIfExerciseExists).toHaveBeenCalledWith(
        exercise.type,
        exercise.description,
        exercise.level,
        exercise.difficulty,
      );
    });

    it('should return an InternalServerErrorException when calling the throwIfExerciseExists() function', async () => {
      jest
        .spyOn(exerciseService, 'throwIfExerciseExists')
        .mockRejectedValue(new InternalServerErrorException());

      await expect(exerciseService.createExercise(exercise)).rejects.toThrow(
        new InternalServerErrorException(),
      );

      expect(exerciseService.throwIfExerciseExists).toHaveBeenCalledWith(
        exercise.type,
        exercise.description,
        exercise.level,
        exercise.difficulty,
      );
    });

    it('should throw an InternalServerErrorException when creating a new exercise', async () => {
      jest
        .spyOn(exerciseService, 'throwIfExerciseExists')
        .mockResolvedValue(undefined);
      (prismaService.exercise.create as jest.Mock).mockResolvedValue(exercise);
      (logger.log as jest.Mock).mockResolvedValue(
        loggerMessages.exercise.createExercise.status_201,
      );

      const result: Return = await exerciseService.createExercise(exercise);

      expect(result).toMatchObject({
        message: httpMessages_EN.exercise.createExercise.status_201,
        data: exercise,
      });
      expect(exerciseService.throwIfExerciseExists).toHaveBeenCalledWith(
        exercise.type,
        exercise.description,
        exercise.level,
        exercise.difficulty,
      );
      expect(prismaService.exercise.create).toHaveBeenCalledWith({
        data: exercise,
      });
      expect(logger.log).toHaveBeenLastCalledWith({
        message: loggerMessages.exercise.createExercise.status_201,
        data: exercise,
      });
    });
  });

  describe('fetchExercises()', () => {
    it('should fetch all exercises', async () => {
      (prismaService.exercise.findMany as jest.Mock).mockResolvedValue(
        exercises,
      );

      const result: Return = await exerciseService.fetchExercises();

      expect(result).toMatchObject({
        message: httpMessages_EN.exercise.fetchExercises.status_200,
        data: exercises,
      });

      expect(prismaService.exercise.findMany).toHaveBeenCalled();
    });

    it('should return a NotFoundException', async () => {
      (prismaService.exercise.findMany as jest.Mock).mockResolvedValue(
        emptyExerciseList,
      );

      await expect(exerciseService.fetchExercises()).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.exercise.fetchExercises.status_404,
        ),
      );

      expect(prismaService.exercise.findMany).toHaveBeenCalled();
    });

    it('should return an InternalServerErrorException', async () => {
      (prismaService.exercise.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(exerciseService.fetchExercises()).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(prismaService.exercise.findMany).toHaveBeenCalled();
    });
  });

  describe('fetchExerciseById()', () => {
    it('should fetch an exercise', async () => {
      (prismaService.exercise.findFirstOrThrow as jest.Mock).mockResolvedValue(
        exercise,
      );

      const result: Return = await exerciseService.fetchExerciseById(
        exercise.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.exercise.fetchExerciseById.status_200,
        data: exercise,
      });
      expect(prismaService.exercise.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: exercise.id,
        },
      });
    });

    it('should throw a NotFoundException', async () => {
      (prismaService.exercise.findFirstOrThrow as jest.Mock).mockRejectedValue(
        error,
      );

      await expect(
        exerciseService.fetchExerciseById(exercise.id),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.exercise.fetchExerciseById.status_404,
        ),
      );

      expect(prismaService.exercise.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: exercise.id,
        },
      });
    });

    it('should throw an InternalServerErrorException', async () => {
      (prismaService.exercise.findFirstOrThrow as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(
        exerciseService.fetchExerciseById(exercise.id),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(prismaService.exercise.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: exercise.id,
        },
      });
    });
  });

  describe('fetchExercisesByQuery()', () => {
    it('should throw exercises by query', async () => {
      (prismaService.exercise.findMany as jest.Mock).mockResolvedValue(
        exercises,
      );

      const result: Return = await exerciseService.fetchExercisesByQuery(
        exercise.level,
        exercise.difficulty,
        exercise.quizId,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.exercise.fetchExercisesByQuery.status_200,
        data: exercises,
      });
      expect(prismaService.exercise.findMany).toHaveBeenCalled();
    });

    it('should throw a NotFoundException', async () => {
      (prismaService.exercise.findMany as jest.Mock).mockResolvedValue(
        emptyExerciseList,
      );

      await expect(
        exerciseService.fetchExercisesByQuery(
          exercise.level,
          exercise.difficulty,
          exercise.quizId,
        ),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.exercise.fetchExercisesByQuery.status_404,
        ),
      );
      expect(prismaService.exercise.findMany).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException', async () => {
      (prismaService.exercise.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(
        exerciseService.fetchExercisesByQuery(
          exercise.level,
          exercise.difficulty,
          exercise.quizId,
        ),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );
      expect(prismaService.exercise.findMany).toHaveBeenCalled();
    });
  });

  describe('updateExercise()', () => {
    it('should update an exercise register', async () => {
      (prismaService.exercise.update as jest.Mock).mockResolvedValue(exercise);

      const result: Return = await exerciseService.updateExercise(
        exercise.id,
        exercise,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.exercise.updateExercise.status_200,
        data: exercise,
      });
      expect(prismaService.exercise.update).toHaveBeenCalledWith({
        where: {
          id: exercise.id,
        },
        data: exercise,
      });
    });

    it('should throw a NotFoundException', async () => {
      (prismaService.exercise.update as jest.Mock).mockRejectedValue(error);

      await expect(
        exerciseService.updateExercise(exercise.id, exercise),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.exercise.updateExercise.status_404,
        ),
      );
      expect(prismaService.exercise.update).toHaveBeenCalledWith({
        where: {
          id: exercise.id,
        },
        data: exercise,
      });
    });

    it('should throw an InternalServerErrorException', async () => {
      (prismaService.exercise.update as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(
        exerciseService.updateExercise(exercise.id, exercise),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );
      expect(prismaService.exercise.update).toHaveBeenCalledWith({
        where: {
          id: exercise.id,
        },
        data: exercise,
      });
    });
  });
  describe('deleteExercise()', () => {
    it('should delete an exercise register', async () => {
      (prismaService.exercise.delete as jest.Mock).mockResolvedValue(exercise);

      const result: Return = await exerciseService.deleteExercise(exercise.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.exercise.deleteExercise.status_200,
        data: exercise,
      });
      expect(prismaService.exercise.delete).toHaveBeenCalledWith({
        where: {
          id: exercise.id,
        },
      });
    });

    it('should throw a NotFoundException', async () => {
      (prismaService.exercise.delete as jest.Mock).mockRejectedValue(error);

      await expect(exerciseService.deleteExercise(exercise.id)).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.exercise.deleteExercise.status_404,
        ),
      );
      expect(prismaService.exercise.delete).toHaveBeenCalledWith({
        where: {
          id: exercise.id,
        },
      });
    });

    it('should throw an InternalServerErrorException', async () => {
      (prismaService.exercise.delete as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(exerciseService.deleteExercise(exercise.id)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );
      expect(prismaService.exercise.delete).toHaveBeenCalledWith({
        where: {
          id: exercise.id,
        },
      });
    });
  });
});
