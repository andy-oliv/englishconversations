import { Test, TestingModule } from '@nestjs/testing';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';
import Unit from '../entities/Unit';
import generateMockUnit from '../helper/mocks/generateMockUnit';

describe('unitController', () => {
  let unitController: UnitController;
  let unitService: UnitService;
  let unit: Unit;
  let units: Unit[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitController],
      providers: [
        {
          provide: UnitService,
          useValue: {
            createUnit: jest.fn(),
            fetchUnits: jest.fn(),
            fetchUnitById: jest.fn(),
            updateUnit: jest.fn(),
            deleteUnit: jest.fn(),
          },
        },
      ],
    }).compile();

    unitController = module.get<UnitController>(UnitController);
    unitService = module.get<UnitService>(UnitService);
    unit = generateMockUnit();
    units = [generateMockUnit(), generateMockUnit()];
  });

  it('should be defined', () => {
    expect(unitController).toBeDefined();
  });

  describe('createUnit()', () => {
    it('should generate a unit', async () => {
      (unitService.createUnit as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.unit.createUnit.status_200,
        data: unit,
      });

      const result: Return = await unitController.createUnit(unit);

      expect(result).toMatchObject({
        message: httpMessages_EN.unit.createUnit.status_200,
        data: unit,
      });
      expect(unitService.createUnit).toHaveBeenCalledWith(unit);
    });

    it('should throw NotFoundException', async () => {
      (unitService.createUnit as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.unit.createUnit.status_404),
      );

      await expect(unitService.createUnit(unit)).rejects.toThrow(
        NotFoundException,
      );

      expect(unitService.createUnit).toHaveBeenCalledWith(unit);
    });

    it('should throw InternalServerErrorException', async () => {
      (unitService.createUnit as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(unitService.createUnit(unit)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(unitService.createUnit).toHaveBeenCalledWith(unit);
    });
  });

  describe('fetchUnits()', () => {
    it('should fetch units', async () => {
      (unitService.fetchUnits as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.unit.fetchUnits.status_200,
        data: unit,
      });

      const result: Return = await unitController.fetchUnits();

      expect(result).toMatchObject({
        message: httpMessages_EN.unit.fetchUnits.status_200,
        data: unit,
      });
      expect(unitService.fetchUnits).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (unitService.fetchUnits as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.unit.fetchUnits.status_404),
      );

      await expect(unitService.fetchUnits()).rejects.toThrow(NotFoundException);

      expect(unitService.fetchUnits).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException', async () => {
      (unitService.fetchUnits as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(unitService.fetchUnits()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(unitService.fetchUnits).toHaveBeenCalled();
    });
  });

  describe('fetchUnitById()', () => {
    it('should fetch unit', async () => {
      (unitService.fetchUnitById as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.unit.fetchUnitById.status_200,
        data: unit,
      });

      const result: Return = await unitController.fetchUnitById(unit.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.unit.fetchUnitById.status_200,
        data: unit,
      });
      expect(unitService.fetchUnitById).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (unitService.fetchUnitById as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.unit.fetchUnitById.status_404),
      );

      await expect(unitService.fetchUnitById(unit.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(unitService.fetchUnitById).toHaveBeenCalledWith(unit.id);
    });

    it('should throw InternalServerErrorException', async () => {
      (unitService.fetchUnitById as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(unitService.fetchUnitById(unit.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(unitService.fetchUnitById).toHaveBeenCalledWith(unit.id);
    });
  });

  describe('updateUnit()', () => {
    it('should update unit', async () => {
      (unitService.updateUnit as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.unit.updateUnit.status_200,
        data: unit,
      });

      const result: Return = await unitController.updateUnit(unit.id, unit);

      expect(result).toMatchObject({
        message: httpMessages_EN.unit.updateUnit.status_200,
        data: unit,
      });
      expect(unitService.updateUnit).toHaveBeenCalledWith(unit.id, unit);
    });

    it('should throw NotFoundException', async () => {
      (unitService.updateUnit as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.unit.updateUnit.status_404),
      );

      await expect(unitService.updateUnit(unit.id, unit)).rejects.toThrow(
        NotFoundException,
      );

      expect(unitService.updateUnit).toHaveBeenCalledWith(unit.id, unit);
    });

    it('should throw InternalServerErrorException', async () => {
      (unitService.updateUnit as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(unitService.updateUnit(unit.id, unit)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(unitService.updateUnit).toHaveBeenCalledWith(unit.id, unit);
    });
  });

  describe('deleteUnit()', () => {
    it('should fetch unit', async () => {
      (unitService.deleteUnit as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.unit.deleteUnit.status_200,
        data: unit,
      });

      const result: Return = await unitController.deleteUnit(unit.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.unit.deleteUnit.status_200,
        data: unit,
      });
      expect(unitService.deleteUnit).toHaveBeenCalledWith(unit.id);
    });

    it('should throw NotFoundException', async () => {
      (unitService.deleteUnit as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.unit.deleteUnit.status_404),
      );

      await expect(unitService.deleteUnit(unit.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(unitService.deleteUnit).toHaveBeenCalledWith(unit.id);
    });

    it('should throw InternalServerErrorException', async () => {
      (unitService.deleteUnit as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(unitService.deleteUnit(unit.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(unitService.deleteUnit).toHaveBeenCalledWith(unit.id);
    });
  });
});
