import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';
import Exercise from '../common/types/Exercise';
import { CEFRLevels, Difficulty } from '../../generated/prisma';
import generateMockExercise from '../helper/mocks/generateMockExercise';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import Return from '../common/types/Return';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('ExerciseController', () => {
  let exerciseController: ExerciseController;
  let exerciseService: ExerciseService;
  let exercise: Exercise;
  let exerciseList: Exercise[];
  let query: { level: CEFRLevels; difficulty: Difficulty; quizId: string };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExerciseController],
      providers: [
        {
          provide: ExerciseService,
          useValue: {
            createExercise: jest.fn(),
            fetchExercises: jest.fn(),
            fetchExercisesByQuery: jest.fn(),
            fetchExerciseById: jest.fn(),
            updateExercise: jest.fn(),
            deleteExercise: jest.fn(),
          },
        },
      ],
    }).compile();

    exerciseController = module.get<ExerciseController>(ExerciseController);
    exerciseService = module.get<ExerciseService>(ExerciseService);

    exercise = generateMockExercise();
    exerciseList = [generateMockExercise(), generateMockExercise()];
    query = {
      level: exercise.level,
      difficulty: exercise.difficulty,
      quizId: exercise.quizId,
    };
  });

  it('should be defined', () => {
    expect(exerciseController).toBeDefined();
  });

  describe('createExercise()', () => {
    it('should create an Exercise', async () => {
      (exerciseService.createExercise as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.exercise.createExercise.status_201,
        data: exercise,
      });

      const result: Return = await exerciseController.createExercise(exercise);

      expect(result).toMatchObject({
        message: httpMessages_EN.exercise.createExercise.status_201,
        data: exercise,
      });
      expect(exerciseService.createExercise).toHaveBeenCalledWith(exercise);
    });

    it('should throw a ConflictException', async () => {
      (exerciseService.createExercise as jest.Mock).mockRejectedValue(
        new ConflictException(
          httpMessages_EN.exercise.createExercise.status_409,
        ),
      );

      await expect(exerciseController.createExercise(exercise)).rejects.toThrow(
        new ConflictException(
          httpMessages_EN.exercise.createExercise.status_409,
        ),
      );
      expect(exerciseService.createExercise).toHaveBeenCalledWith(exercise);
    });

    it('should throw an InternalServerErrorException', async () => {
      (exerciseService.createExercise as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(exerciseController.createExercise(exercise)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );
      expect(exerciseService.createExercise).toHaveBeenCalledWith(exercise);
    });
  });

  describe('fetchExercisesByQuery()', () => {
    it('should fetch all exercises based on the query', async () => {
      (exerciseService.fetchExercisesByQuery as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.exercise.fetchExercisesByQuery.status_200,
        data: exerciseList,
      });

      const result: Return =
        await exerciseController.fetchExercisesByQuery(query);

      expect(result).toMatchObject({
        message: httpMessages_EN.exercise.fetchExercisesByQuery.status_200,
        data: exerciseList,
      });

      expect(exerciseService.fetchExercisesByQuery).toHaveBeenCalledWith(
        query.level,
        query.difficulty,
        query.quizId,
      );
    });

    it('should throw a NotFoundException', async () => {
      (exerciseService.fetchExercisesByQuery as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.exercise.fetchExercisesByQuery.status_404,
        ),
      );

      await expect(
        exerciseController.fetchExercisesByQuery(query),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.exercise.fetchExercisesByQuery.status_404,
        ),
      );

      expect(exerciseService.fetchExercisesByQuery).toHaveBeenCalledWith(
        query.level,
        query.difficulty,
        query.quizId,
      );
    });

    it('should throw an InternalServerErrorException', async () => {
      (exerciseService.fetchExercisesByQuery as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        exerciseController.fetchExercisesByQuery(query),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(exerciseService.fetchExercisesByQuery).toHaveBeenCalledWith(
        query.level,
        query.difficulty,
        query.quizId,
      );
    });
  });

  describe('fetchExerciseById()', () => {
    it('should fetch an exercise', async () => {
      (exerciseService.fetchExerciseById as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.exercise.fetchExerciseById.status_200,
        data: exercise,
      });

      const result: Return = await exerciseController.fetchExerciseById(
        exercise.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.exercise.fetchExerciseById.status_200,
        data: exercise,
      });

      expect(exerciseService.fetchExerciseById).toHaveBeenCalledWith(
        exercise.id,
      );
    });

    it('should throw a NotFoundException', async () => {
      (exerciseService.fetchExerciseById as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.exercise.fetchExerciseById.status_404,
        ),
      );

      await expect(
        exerciseController.fetchExerciseById(exercise.id),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.exercise.fetchExerciseById.status_404,
        ),
      );

      expect(exerciseService.fetchExerciseById).toHaveBeenCalledWith(
        exercise.id,
      );
    });

    it('should throw an InternalServerErrorException', async () => {
      (exerciseService.fetchExerciseById as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        exerciseController.fetchExerciseById(exercise.id),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(exerciseService.fetchExerciseById).toHaveBeenCalledWith(
        exercise.id,
      );
    });
  });

  describe('fetchExercises()', () => {
    it('should fetch all exercises', async () => {
      (exerciseService.fetchExercises as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.exercise.fetchExercises.status_200,
        data: exerciseList,
      });

      const result: Return = await exerciseController.fetchExercises();

      expect(result).toMatchObject({
        message: httpMessages_EN.exercise.fetchExercises.status_200,
        data: exerciseList,
      });

      expect(exerciseService.fetchExercises).toHaveBeenCalled();
    });

    it('should throw a NotFoundException', async () => {
      (exerciseService.fetchExercises as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.exercise.fetchExercises.status_404,
        ),
      );

      await expect(exerciseController.fetchExercises()).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.exercise.fetchExercises.status_404,
        ),
      );

      expect(exerciseService.fetchExercises).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException', async () => {
      (exerciseService.fetchExercises as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(exerciseController.fetchExercises()).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(exerciseService.fetchExercises).toHaveBeenCalled();
    });
  });

  describe('updateExercise()', () => {
    it('should update an exercise create', async () => {
      (exerciseService.updateExercise as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.exercise.updateExercise.status_200,
        data: exercise,
      });

      const result: Return = await exerciseController.updateExercise(
        exercise.id,
        exercise,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.exercise.updateExercise.status_200,
        data: exercise,
      });

      expect(exerciseService.updateExercise).toHaveBeenCalledWith(
        exercise.id,
        exercise,
      );
    });

    it('should throw a NotFoundException', async () => {
      (exerciseService.updateExercise as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.exercise.updateExercise.status_404,
        ),
      );

      await expect(
        exerciseController.updateExercise(exercise.id, exercise),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.exercise.updateExercise.status_404,
        ),
      );

      expect(exerciseService.updateExercise).toHaveBeenCalledWith(
        exercise.id,
        exercise,
      );
    });

    it('should throw an InternalServerErrorException', async () => {
      (exerciseService.updateExercise as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        exerciseController.updateExercise(exercise.id, exercise),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(exerciseService.updateExercise).toHaveBeenCalledWith(
        exercise.id,
        exercise,
      );
    });
  });

  describe('deleteExercise()', () => {
    it('should delete an exercise', async () => {
      (exerciseService.deleteExercise as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.exercise.deleteExercise.status_200,
        data: exercise,
      });

      const result: Return = await exerciseController.deleteExercise(
        exercise.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.exercise.deleteExercise.status_200,
        data: exercise,
      });

      expect(exerciseService.deleteExercise).toHaveBeenCalledWith(exercise.id);
    });

    it('should throw a NotFoundException', async () => {
      (exerciseService.deleteExercise as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.exercise.deleteExercise.status_404,
        ),
      );

      await expect(
        exerciseController.deleteExercise(exercise.id),
      ).rejects.toThrow(
        new NotFoundException(
          httpMessages_EN.exercise.deleteExercise.status_404,
        ),
      );

      expect(exerciseService.deleteExercise).toHaveBeenCalledWith(exercise.id);
    });

    it('should throw an InternalServerErrorException', async () => {
      (exerciseService.deleteExercise as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        exerciseController.deleteExercise(exercise.id),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(exerciseService.deleteExercise).toHaveBeenCalledWith(exercise.id);
    });
  });
});
