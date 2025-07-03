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
import FormHandlerReturn from '../common/types/FormHandlerReturn';
import { Logger } from 'nestjs-pino';
import { S3Service } from '../s3/s3.service';
import { FileService } from '../file/file.service';
import { faker } from '@faker-js/faker/.';
import allowedTypes from '../helper/functions/allowedTypes';
import FormDataHandler from '../helper/functions/formDataHandler';
import CreateUnitDTO from './dto/createUnit.dto';
import updateFormHandler from '../helper/functions/templates/updateFormHandler';
import UpdateVideoDTO from '../video/dto/updateVideo.dto';

jest.mock('../helper/functions/formDataHandler');
jest.mock('../helper/functions/allowedTypes');
jest.mock('../helper/functions/templates/updateFormHandler');

describe('unitController', () => {
  let unitController: UnitController;
  let unitService: UnitService;
  let fileService: FileService;
  let s3Service: S3Service;
  let logger: Logger;
  let unit: Unit;
  let units: Unit[];
  let metadata: string;
  let uploadedFile: Express.Multer.File;
  let returnedData: FormHandlerReturn;
  let thumbnail: Return;

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
            fetchByChapter: jest.fn(),
            updateUnit: jest.fn(),
            deleteUnit: jest.fn(),
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
          provide: FileService,
          useValue: {
            generateFile: jest.fn(),
          },
        },
        {
          provide: S3Service,
          useValue: {},
        },
      ],
    }).compile();

    unitController = module.get<UnitController>(UnitController);
    unitService = module.get<UnitService>(UnitService);
    fileService = module.get<FileService>(FileService);
    s3Service = module.get<S3Service>(S3Service);
    logger = module.get<Logger>(Logger);
    unit = generateMockUnit();
    units = [generateMockUnit(), generateMockUnit()];
    metadata = 'mock-data';
    uploadedFile = {
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
    thumbnail = {
      message: httpMessages_EN.file.generateFile.status_200,
      data: {
        id: unit.fileId,
        name: uploadedFile.originalname,
        type: 'IMAGE',
        url: faker.internet.url(),
        size: uploadedFile.size,
      },
    };
    returnedData = {
      data: unit,
      fileUrl: thumbnail.data.url,
    };
  });

  it('should be defined', () => {
    expect(unitController).toBeDefined();
  });

  describe('createUnit()', () => {
    it('should generate a unit', async () => {
      (allowedTypes as jest.Mock).mockReturnValue(undefined);
      (FormDataHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(thumbnail);
      (unitService.createUnit as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.unit.createUnit.status_200,
        data: unit,
      });

      const result: Return = await unitController.createUnit(
        metadata,
        uploadedFile,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.unit.createUnit.status_200,
        data: unit,
      });
      expect(allowedTypes).toHaveBeenCalledWith(uploadedFile);
      expect(unitService.createUnit).toHaveBeenCalledWith({
        ...unit,
        fileId: thumbnail.data.id,
      });
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: uploadedFile.originalname,
        type: 'IMAGE',
        size: uploadedFile.size,
        url: returnedData.fileUrl,
      });
      expect(FormDataHandler).toHaveBeenCalledWith(
        CreateUnitDTO,
        uploadedFile,
        metadata,
        s3Service,
        logger,
        'images/unit',
      );
    });

    it('should throw NotFoundException', async () => {
      (allowedTypes as jest.Mock).mockReturnValue(undefined);
      (FormDataHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(thumbnail);
      (unitService.createUnit as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.unit.createUnit.status_404),
      );

      await expect(
        unitController.createUnit(metadata, uploadedFile),
      ).rejects.toThrow(NotFoundException);
      expect(allowedTypes).toHaveBeenCalledWith(uploadedFile);
      expect(unitService.createUnit).toHaveBeenCalledWith({
        ...unit,
        fileId: thumbnail.data.id,
      });
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: uploadedFile.originalname,
        type: 'IMAGE',
        size: uploadedFile.size,
        url: returnedData.fileUrl,
      });
      expect(FormDataHandler).toHaveBeenCalledWith(
        CreateUnitDTO,
        uploadedFile,
        metadata,
        s3Service,
        logger,
        'images/unit',
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (allowedTypes as jest.Mock).mockReturnValue(undefined);
      (FormDataHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(thumbnail);
      (unitService.createUnit as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        unitController.createUnit(metadata, uploadedFile),
      ).rejects.toThrow(InternalServerErrorException);
      expect(allowedTypes).toHaveBeenCalledWith(uploadedFile);
      expect(unitService.createUnit).toHaveBeenCalledWith({
        ...unit,
        fileId: thumbnail.data.id,
      });
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: uploadedFile.originalname,
        type: 'IMAGE',
        size: uploadedFile.size,
        url: returnedData.fileUrl,
      });
      expect(FormDataHandler).toHaveBeenCalledWith(
        CreateUnitDTO,
        uploadedFile,
        metadata,
        s3Service,
        logger,
        'images/unit',
      );
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

  describe('fetchByChapter()', () => {
    it('should fetch units', async () => {
      (unitService.fetchByChapter as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.unit.fetchByChapter.status_200,
        data: units,
      });

      const result: Return = await unitController.fetchByChapter(
        unit.chapterId,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.unit.fetchByChapter.status_200,
        data: units,
      });
      expect(unitService.fetchByChapter).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (unitService.fetchByChapter as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.unit.fetchByChapter.status_404),
      );

      await expect(unitService.fetchByChapter(unit.chapterId)).rejects.toThrow(
        NotFoundException,
      );

      expect(unitService.fetchByChapter).toHaveBeenCalledWith(unit.chapterId);
    });

    it('should throw InternalServerErrorException', async () => {
      (unitService.fetchByChapter as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(unitService.fetchByChapter(unit.chapterId)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(unitService.fetchByChapter).toHaveBeenCalledWith(unit.chapterId);
    });
  });

  describe('updateUnit()', () => {
    it('should update unit', async () => {
      (allowedTypes as jest.Mock).mockReturnValue(undefined);
      (updateFormHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(thumbnail);
      (unitService.updateUnit as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.unit.updateUnit.status_200,
        data: unit,
      });

      const result: Return = await unitController.updateUnit(
        uploadedFile,
        unit.id,
        metadata,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.unit.updateUnit.status_200,
        data: unit,
      });
      expect(allowedTypes).toHaveBeenCalledWith(uploadedFile);
      expect(unitService.updateUnit).toHaveBeenCalledWith(unit.id, {
        ...unit,
        fileId: thumbnail.data.id,
      });
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: uploadedFile.originalname,
        type: 'IMAGE',
        size: uploadedFile.size,
        url: returnedData.fileUrl,
      });
      expect(updateFormHandler).toHaveBeenCalledWith(
        s3Service,
        logger,
        'images/unit',
        UpdateVideoDTO,
        uploadedFile,
        metadata,
      );
    });

    it('should throw NotFoundException', async () => {
      (allowedTypes as jest.Mock).mockReturnValue(undefined);
      (updateFormHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(thumbnail);
      (unitService.updateUnit as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.unit.updateUnit.status_404),
      );

      await expect(
        unitController.updateUnit(uploadedFile, unit.id, metadata),
      ).rejects.toThrow(NotFoundException);
      expect(allowedTypes).toHaveBeenCalledWith(uploadedFile);
      expect(unitService.updateUnit).toHaveBeenCalledWith(unit.id, {
        ...unit,
        fileId: thumbnail.data.id,
      });
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: uploadedFile.originalname,
        type: 'IMAGE',
        size: uploadedFile.size,
        url: returnedData.fileUrl,
      });
      expect(updateFormHandler).toHaveBeenCalledWith(
        s3Service,
        logger,
        'images/unit',
        UpdateVideoDTO,
        uploadedFile,
        metadata,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (allowedTypes as jest.Mock).mockReturnValue(undefined);
      (updateFormHandler as jest.Mock).mockResolvedValue(returnedData);
      (fileService.generateFile as jest.Mock).mockResolvedValue(thumbnail);
      (unitService.updateUnit as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        unitController.updateUnit(uploadedFile, unit.id, metadata),
      ).rejects.toThrow(InternalServerErrorException);
      expect(allowedTypes).toHaveBeenCalledWith(uploadedFile);
      expect(unitService.updateUnit).toHaveBeenCalledWith(unit.id, {
        ...unit,
        fileId: thumbnail.data.id,
      });
      expect(fileService.generateFile).toHaveBeenCalledWith({
        name: uploadedFile.originalname,
        type: 'IMAGE',
        size: uploadedFile.size,
        url: returnedData.fileUrl,
      });
      expect(updateFormHandler).toHaveBeenCalledWith(
        s3Service,
        logger,
        'images/unit',
        UpdateVideoDTO,
        uploadedFile,
        metadata,
      );
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
