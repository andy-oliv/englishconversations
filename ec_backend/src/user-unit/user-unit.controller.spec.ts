import { Test, TestingModule } from '@nestjs/testing';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserUnitController } from './user-unit.controller';
import { UserUnitService } from './user-unit.service';
import generateMockUserUnit from '../helper/mocks/generateMockUserUnit';
import UserUnit from '../common/types/UserUnit';

describe('userUnitController', () => {
  let userUnitController: UserUnitController;
  let userUnitService: UserUnitService;
  let progress: UserUnit;
  let progresses: UserUnit[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserUnitController],
      providers: [
        {
          provide: UserUnitService,
          useValue: {
            generateUserUnit: jest.fn(),
            fetchUserUnits: jest.fn(),
            fetchUserUnitById: jest.fn(),
            fetchUserUnitsByQuery: jest.fn(),
            updateUserUnit: jest.fn(),
            deleteUserUnit: jest.fn(),
          },
        },
      ],
    }).compile();

    userUnitController = module.get<UserUnitController>(UserUnitController);
    userUnitService = module.get<UserUnitService>(UserUnitService);
    progress = generateMockUserUnit();
    progresses = [generateMockUserUnit(), generateMockUserUnit()];
  });

  it('should be defined', () => {
    expect(userUnitController).toBeDefined();
  });

  describe('generateUserUnit()', () => {
    it('should generate a userUnit', async () => {
      (userUnitService.generateUserUnit as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.userUnit.generateUserUnit.status_200,
        data: progress,
      });

      const result: Return =
        await userUnitController.generateUserUnit(progress);

      expect(result).toMatchObject({
        message: httpMessages_EN.userUnit.generateUserUnit.status_200,
        data: progress,
      });
      expect(userUnitService.generateUserUnit).toHaveBeenCalledWith(progress);
    });

    it('should throw ConflictException', async () => {
      (userUnitService.generateUserUnit as jest.Mock).mockRejectedValue(
        new ConflictException(
          httpMessages_EN.userUnit.throwIfUserUnitExists.status_409,
        ),
      );

      await expect(userUnitService.generateUserUnit(progress)).rejects.toThrow(
        ConflictException,
      );

      expect(userUnitService.generateUserUnit).toHaveBeenCalledWith(progress);
    });

    it('should throw InternalServerErrorException', async () => {
      (userUnitService.generateUserUnit as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(userUnitService.generateUserUnit(progress)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(userUnitService.generateUserUnit).toHaveBeenCalledWith(progress);
    });
  });

  describe('fetchUserUnits()', () => {
    it('should fetch userUnits', async () => {
      (userUnitService.fetchUserUnits as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.userUnit.fetchUserUnits.status_200,
        data: progress,
      });

      const result: Return = await userUnitController.fetchUserUnits();

      expect(result).toMatchObject({
        message: httpMessages_EN.userUnit.fetchUserUnits.status_200,
        data: progress,
      });
      expect(userUnitService.fetchUserUnits).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (userUnitService.fetchUserUnits as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.userUnit.fetchUserUnits.status_404,
        ),
      );

      await expect(userUnitService.fetchUserUnits()).rejects.toThrow(
        NotFoundException,
      );

      expect(userUnitService.fetchUserUnits).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException', async () => {
      (userUnitService.fetchUserUnits as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(userUnitService.fetchUserUnits()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(userUnitService.fetchUserUnits).toHaveBeenCalled();
    });
  });

  describe('fetchUserUnitById()', () => {
    it('should fetch userUnit', async () => {
      (userUnitService.fetchUserUnitById as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.userUnit.fetchUserUnitById.status_200,
        data: progress,
      });

      const result: Return = await userUnitController.fetchUserUnitById(
        progress.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.userUnit.fetchUserUnitById.status_200,
        data: progress,
      });
      expect(userUnitService.fetchUserUnitById).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (userUnitService.fetchUserUnitById as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.userUnit.fetchUserUnitById.status_404,
        ),
      );

      await expect(
        userUnitService.fetchUserUnitById(progress.id),
      ).rejects.toThrow(NotFoundException);

      expect(userUnitService.fetchUserUnitById).toHaveBeenCalledWith(
        progress.id,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (userUnitService.fetchUserUnitById as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userUnitService.fetchUserUnitById(progress.id),
      ).rejects.toThrow(InternalServerErrorException);

      expect(userUnitService.fetchUserUnitById).toHaveBeenCalledWith(
        progress.id,
      );
    });
  });

  describe('fetchUserUnitsByQuery', () => {
    it('should fetch user units', async () => {
      (userUnitService.fetchUserUnitsByQuery as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.userUnit.fetchUserUnitsByQuery.status_200,
        data: progresses,
      });

      const result: Return = await userUnitController.fetchUserUnitByQuery({
        userId: progress.userId,
        unitId: progress.unitId,
        status: progress.status,
      });

      expect(result).toMatchObject({
        message: httpMessages_EN.userUnit.fetchUserUnitsByQuery.status_200,
        data: progresses,
      });
      expect(userUnitService.fetchUserUnitsByQuery).toHaveBeenCalledWith(
        progress.userId,
        progress.unitId,
        progress.status,
      );
    });

    it('should throw NotFoundException', async () => {
      (userUnitService.fetchUserUnitsByQuery as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.userUnit.fetchUserUnitsByQuery.status_404,
        ),
      );

      await expect(
        userUnitController.fetchUserUnitByQuery({
          userId: progress.userId,
          unitId: progress.unitId,
          status: progress.status,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(userUnitService.fetchUserUnitsByQuery).toHaveBeenCalledWith(
        progress.userId,
        progress.unitId,
        progress.status,
      );
    });

    it('should throw InternalErrorException', async () => {
      (userUnitService.fetchUserUnitsByQuery as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userUnitController.fetchUserUnitByQuery({
          userId: progress.userId,
          unitId: progress.unitId,
          status: progress.status,
        }),
      ).rejects.toThrow(InternalServerErrorException);

      expect(userUnitService.fetchUserUnitsByQuery).toHaveBeenCalledWith(
        progress.userId,
        progress.unitId,
        progress.status,
      );
    });
  });

  describe('updateUserUnit()', () => {
    it('should update userUnit', async () => {
      (userUnitService.updateUserUnit as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.userUnit.updateUserUnit.status_200,
        data: progress,
      });

      const result: Return = await userUnitController.updateUserUnit(
        progress.id,
        progress,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.userUnit.updateUserUnit.status_200,
        data: progress,
      });
      expect(userUnitService.updateUserUnit).toHaveBeenCalledWith(
        progress.id,
        progress,
      );
    });

    it('should throw NotFoundException', async () => {
      (userUnitService.updateUserUnit as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.userUnit.updateUserUnit.status_404,
        ),
      );

      await expect(
        userUnitService.updateUserUnit(progress.id, progress),
      ).rejects.toThrow(NotFoundException);

      expect(userUnitService.updateUserUnit).toHaveBeenCalledWith(
        progress.id,
        progress,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (userUnitService.updateUserUnit as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        userUnitService.updateUserUnit(progress.id, progress),
      ).rejects.toThrow(InternalServerErrorException);

      expect(userUnitService.updateUserUnit).toHaveBeenCalledWith(
        progress.id,
        progress,
      );
    });
  });

  describe('deleteUserUnit()', () => {
    it('should fetch userUnit', async () => {
      (userUnitService.deleteUserUnit as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.userUnit.deleteUserUnit.status_200,
        data: progress,
      });

      const result: Return = await userUnitController.deleteUserUnit(
        progress.id,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.userUnit.deleteUserUnit.status_200,
        data: progress,
      });
      expect(userUnitService.deleteUserUnit).toHaveBeenCalledWith(progress.id);
    });

    it('should throw NotFoundException', async () => {
      (userUnitService.deleteUserUnit as jest.Mock).mockRejectedValue(
        new NotFoundException(
          httpMessages_EN.userUnit.deleteUserUnit.status_404,
        ),
      );

      await expect(userUnitService.deleteUserUnit(progress.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(userUnitService.deleteUserUnit).toHaveBeenCalledWith(progress.id);
    });

    it('should throw InternalServerErrorException', async () => {
      (userUnitService.deleteUserUnit as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(userUnitService.deleteUserUnit(progress.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(userUnitService.deleteUserUnit).toHaveBeenCalledWith(progress.id);
    });
  });
});
