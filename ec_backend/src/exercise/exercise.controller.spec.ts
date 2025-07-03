import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';
import Exercise from '../entities/Exercise';
import { CEFRLevels, Difficulty } from '../../generated/prisma';
import generateMockExercise from '../helper/mocks/generateMockExercise';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import Return from '../common/types/Return';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import FormHandlerReturn from '../common/types/FormHandlerReturn';
import { faker } from '@faker-js/faker/.';
import FormDataHandler from '../helper/functions/formDataHandler';
import defineFileType from '../helper/functions/defineFileType';
import { FileService } from '../file/file.service';
import { S3Service } from '../s3/s3.service';
import { Logger } from 'nestjs-pino';
import CreateExerciseDTO from './dto/CreateExercise.dto';
import updateFormHandler from '../helper/functions/templates/updateFormHandler';
import UpdateExerciseDTO from './dto/UpdateExercise.dto';

jest.mock('../helper/functions/formDataHandler');
jest.mock('../helper/functions/defineFileType');
jest.mock('../helper/functions/templates/updateFormHandler');

describe('ExerciseController', () => {
  let exerciseController: ExerciseController;
  let exerciseService: ExerciseService;
  let fileService: FileService;
  let s3Service: S3Service;
  let logger: Logger;
  let exercise: Exercise;
  let exerciseList: Exercise[];
  let query: { level: CEFRLevels; difficulty: Difficulty; quizId: string };
  let returnedData: FormHandlerReturn;
  let file: Express.Multer.File;
  let generatedFile: Return;
  let metadata: string;

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
        {
          provide: FileService,
          useValue: {
            generateFile: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: S3Service,
          useValue: {},
        },
      ],
    }).compile();

    exerciseController = module.get<ExerciseController>(ExerciseController);
    exerciseService = module.get<ExerciseService>(ExerciseService);
    fileService = module.get<FileService>(FileService);
    s3Service = module.get<S3Service>(S3Service);
    logger = module.get<Logger>(Logger);

    exercise = generateMockExercise();
    exerciseList = [generateMockExercise(), generateMockExercise()];
    query = {
      level: exercise.level,
      difficulty: exercise.difficulty,
      quizId: exercise.quizId,
    };
    returnedData = {
      data: exercise,
      fileUrl: faker.internet.url(),
    };
    file = {
      fieldname: 'file',
      originalname: 'test.jpeg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
      buffer: Buffer.from('dummy content'),
      stream: null,
      destination: '',
      filename: '',
      path: '',
    };
    metadata = 'mock-data';
    generatedFile = {
      message: httpMessages_EN.exercise.createExercise.status_201,
      data: {
        id: faker.string.uuid(),
        name: file.originalname,
        type: 'mock-type',
        size: file.size,
        url: returnedData.fileUrl,
      },
    };
  });

  it('should be defined', () => {
    expect(exerciseController).toBeDefined();
  });

  describe('createExercise()', () => {
    it('should create an Exercise', async () => {
      (FormDataHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(generatedFile);
      (defineFileType as jest.Mock).mockReturnValue('mock-type');
      (exerciseService.createExercise as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.exercise.createExercise.status_201,
        data: exercise,
      });

      const result: Return = await exerciseController.createExercise(
        file,
        metadata,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.exercise.createExercise.status_201,
        data: exercise,
      });
      expect(FormDataHandler).toHaveBeenCalledWith(
        CreateExerciseDTO,
        file,
        metadata,
        s3Service,
        logger,
        'multimedia/exercise',
      );
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: file.originalname,
        type: 'mock-type',
        size: file.size,
        url: returnedData.fileUrl,
      });
      expect(defineFileType).toHaveBeenCalledWith(file.mimetype);
      expect(exerciseService.createExercise).toHaveBeenCalledWith({
        ...returnedData.data,
        fileId: generatedFile.data.id,
      });
    });

    it('should throw a ConflictException', async () => {
      (FormDataHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(generatedFile);
      (defineFileType as jest.Mock).mockReturnValue('mock-type');
      (exerciseService.createExercise as jest.Mock).mockRejectedValue(
        new ConflictException(
          httpMessages_EN.exercise.throwIfExerciseExists.status_409,
        ),
      );

      await expect(
        exerciseController.createExercise(file, metadata),
      ).rejects.toThrow(ConflictException);
      expect(FormDataHandler).toHaveBeenCalledWith(
        CreateExerciseDTO,
        file,
        metadata,
        s3Service,
        logger,
        'multimedia/exercise',
      );
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: file.originalname,
        type: 'mock-type',
        size: file.size,
        url: returnedData.fileUrl,
      });
      expect(defineFileType).toHaveBeenCalledWith(file.mimetype);
      expect(exerciseService.createExercise).toHaveBeenCalledWith({
        ...returnedData.data,
        fileId: generatedFile.data.id,
      });
    });

    it('should throw an InternalServerErrorException', async () => {
      (FormDataHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(generatedFile);
      (defineFileType as jest.Mock).mockReturnValue('mock-type');
      (exerciseService.createExercise as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        exerciseController.createExercise(file, metadata),
      ).rejects.toThrow(InternalServerErrorException);
      expect(FormDataHandler).toHaveBeenCalledWith(
        CreateExerciseDTO,
        file,
        metadata,
        s3Service,
        logger,
        'multimedia/exercise',
      );
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: file.originalname,
        type: 'mock-type',
        size: file.size,
        url: returnedData.fileUrl,
      });
      expect(defineFileType).toHaveBeenCalledWith(file.mimetype);
      expect(exerciseService.createExercise).toHaveBeenCalledWith({
        ...returnedData.data,
        fileId: generatedFile.data.id,
      });
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
      (updateFormHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(generatedFile);
      (defineFileType as jest.Mock).mockReturnValue('mock-type');
      (exerciseService.updateExercise as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.exercise.updateExercise.status_200,
        data: exercise,
      });

      const result: Return = await exerciseController.updateExercise(
        file,
        exercise.id,
        metadata,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.exercise.updateExercise.status_200,
        data: exercise,
      });
      expect(updateFormHandler).toHaveBeenCalledWith(
        s3Service,
        logger,
        'multimedia/exercise',
        UpdateExerciseDTO,
        file,
        metadata,
      );
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: file.originalname,
        type: 'mock-type',
        size: file.size,
        url: returnedData.fileUrl,
      });
      expect(defineFileType).toHaveBeenCalledWith(file.mimetype);
      expect(exerciseService.updateExercise).toHaveBeenCalledWith(exercise.id, {
        ...returnedData.data,
        fileId: generatedFile.data.id,
      });
    });

    it('should throw a NotFoundException', async () => {
      (updateFormHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(generatedFile);
      (defineFileType as jest.Mock).mockReturnValue('mock-type');
      (exerciseService.updateExercise as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.exercise.updateExercise.status_404,
        ),
      );

      await expect(
        exerciseController.updateExercise(file, exercise.id, metadata),
      ).rejects.toThrow(NotFoundException);
      expect(updateFormHandler).toHaveBeenCalledWith(
        s3Service,
        logger,
        'multimedia/exercise',
        UpdateExerciseDTO,
        file,
        metadata,
      );
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: file.originalname,
        type: 'mock-type',
        size: file.size,
        url: returnedData.fileUrl,
      });
      expect(defineFileType).toHaveBeenCalledWith(file.mimetype);
      expect(exerciseService.updateExercise).toHaveBeenCalledWith(exercise.id, {
        ...returnedData.data,
        fileId: generatedFile.data.id,
      });
    });

    it('should throw an InternalServerErrorException', async () => {
      (updateFormHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(generatedFile);
      (defineFileType as jest.Mock).mockReturnValue('mock-type');
      (exerciseService.updateExercise as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        exerciseController.updateExercise(file, exercise.id, metadata),
      ).rejects.toThrow(InternalServerErrorException);
      expect(updateFormHandler).toHaveBeenCalledWith(
        s3Service,
        logger,
        'multimedia/exercise',
        UpdateExerciseDTO,
        file,
        metadata,
      );
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: file.originalname,
        type: 'mock-type',
        size: file.size,
        url: returnedData.fileUrl,
      });
      expect(defineFileType).toHaveBeenCalledWith(file.mimetype);
      expect(exerciseService.updateExercise).toHaveBeenCalledWith(exercise.id, {
        ...returnedData.data,
        fileId: generatedFile.data.id,
      });
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
