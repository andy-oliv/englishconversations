import { Test, TestingModule } from '@nestjs/testing';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import File from '../common/types/File';
import generateMockFile from '../helper/mocks/generateMockFile';

describe('FileController', () => {
  let fileController: FileController;
  let fileService: FileService;
  let file: File;
  let files: File[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        {
          provide: FileService,
          useValue: {
            generateFile: jest.fn(),
            fetchFiles: jest.fn(),
            fetchFileById: jest.fn(),
            updateFile: jest.fn(),
            deleteFile: jest.fn(),
          },
        },
      ],
    }).compile();

    fileController = module.get<FileController>(FileController);
    fileService = module.get<FileService>(FileService);
    file = generateMockFile();
    files = [generateMockFile(), generateMockFile()];
  });

  it('should be defined', () => {
    expect(fileController).toBeDefined();
  });

  describe('generateFile()', () => {
    it('should generate a file', async () => {
      (fileService.generateFile as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.file.generateFile.status_200,
        data: file,
      });

      const result: Return = await fileController.generateFile(file);

      expect(result).toMatchObject({
        message: httpMessages_EN.file.generateFile.status_200,
        data: file,
      });
      expect(fileService.generateFile).toHaveBeenCalledWith(file);
    });

    it('should throw handleInternalErrorException', async () => {
      (fileService.generateFile as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(fileService.generateFile(file)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(fileService.generateFile).toHaveBeenCalledWith(file);
    });
  });

  describe('fetchFiles()', () => {
    it('should fetch files', async () => {
      (fileService.fetchFiles as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.file.fetchFiles.status_200,
        data: files,
      });

      const result: Return = await fileController.fetchFiles();

      expect(result).toMatchObject({
        message: httpMessages_EN.file.fetchFiles.status_200,
        data: files,
      });
      expect(fileService.fetchFiles).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (fileService.fetchFiles as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.file.fetchFiles.status_404),
      );

      await expect(fileService.fetchFiles()).rejects.toThrow(NotFoundException);

      expect(fileService.fetchFiles).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException', async () => {
      (fileService.fetchFiles as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(fileService.fetchFiles()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(fileService.fetchFiles).toHaveBeenCalled();
    });
  });

  describe('fetchFileById()', () => {
    it('should fetch file', async () => {
      (fileService.fetchFileById as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.file.fetchFileById.status_200,
        data: file,
      });

      const result: Return = await fileController.fetchFileById(file.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.file.fetchFileById.status_200,
        data: file,
      });
      expect(fileService.fetchFileById).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (fileService.fetchFileById as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.file.fetchFileById.status_404),
      );

      await expect(fileService.fetchFileById(file.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(fileService.fetchFileById).toHaveBeenCalledWith(file.id);
    });

    it('should throw InternalServerErrorException', async () => {
      (fileService.fetchFileById as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(fileService.fetchFileById(file.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(fileService.fetchFileById).toHaveBeenCalledWith(file.id);
    });
  });

  describe('updateFile()', () => {
    it('should update file', async () => {
      (fileService.updateFile as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.file.updateFile.status_200,
        data: file,
      });

      const result: Return = await fileController.updateFile(file.id, file);

      expect(result).toMatchObject({
        message: httpMessages_EN.file.updateFile.status_200,
        data: file,
      });
      expect(fileService.updateFile).toHaveBeenCalledWith(file.id, file);
    });

    it('should throw NotFoundException', async () => {
      (fileService.updateFile as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.file.updateFile.status_404),
      );

      await expect(fileService.updateFile(file.id, file)).rejects.toThrow(
        NotFoundException,
      );

      expect(fileService.updateFile).toHaveBeenCalledWith(file.id, file);
    });

    it('should throw InternalServerErrorException', async () => {
      (fileService.updateFile as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(fileService.updateFile(file.id, file)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(fileService.updateFile).toHaveBeenCalledWith(file.id, file);
    });
  });

  describe('deleteFile()', () => {
    it('should fetch file', async () => {
      (fileService.deleteFile as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.file.deleteFile.status_200,
        data: file,
      });

      const result: Return = await fileController.deleteFile(file.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.file.deleteFile.status_200,
        data: file,
      });
      expect(fileService.deleteFile).toHaveBeenCalledWith(file.id);
    });

    it('should throw NotFoundException', async () => {
      (fileService.deleteFile as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.file.deleteFile.status_404),
      );

      await expect(fileService.deleteFile(file.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(fileService.deleteFile).toHaveBeenCalledWith(file.id);
    });

    it('should throw InternalServerErrorException', async () => {
      (fileService.deleteFile as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(fileService.deleteFile(file.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(fileService.deleteFile).toHaveBeenCalledWith(file.id);
    });
  });
});
