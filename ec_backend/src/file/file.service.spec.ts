import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FileService } from './file.service';
import File from '../entities/File';
import generateMockFile from '../helper/mocks/generateMockFile';
import { S3Service } from '../s3/s3.service';

describe('FileService', () => {
  let fileService: FileService;
  let prismaService: PrismaService;
  let logger: Logger;
  let file: File;
  let files: File[];
  let emptyFiles: File[];
  let error: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: PrismaService,
          useValue: {
            file: {
              create: jest.fn(),
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
            log: jest.fn,
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: S3Service,
          useValue: {
            deleteObject: jest.fn(),
          },
        },
      ],
    }).compile();

    fileService = module.get<FileService>(FileService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
    file = generateMockFile();
    files = [generateMockFile(), generateMockFile()];
    emptyFiles = [];
    error = {
      code: 'P2025',
    };
  });

  it('should be defined', () => {
    expect(fileService).toBeDefined();
  });

  describe('generateFile()', () => {
    it('should generate a new file', async () => {
      (prismaService.file.create as jest.Mock).mockResolvedValue(file);

      const result: Return = await fileService.generateFile(file);

      expect(result).toMatchObject({
        message: httpMessages_EN.file.generateFile.status_200,
        data: file,
      });
      expect(prismaService.file.create).toHaveBeenCalledWith({
        data: file,
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.file.create as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(fileService.generateFile(file)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.file.create).toHaveBeenCalledWith({
        data: file,
      });
    });
  });

  describe('fetchFiles()', () => {
    it('should fetch files', async () => {
      (prismaService.file.findMany as jest.Mock).mockResolvedValue(files);

      const result: Return = await fileService.fetchFiles();

      expect(result).toMatchObject({
        message: httpMessages_EN.file.fetchFiles.status_200,
        data: files,
      });
      expect(prismaService.file.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (prismaService.file.findMany as jest.Mock).mockResolvedValue(emptyFiles);

      await expect(fileService.fetchFiles()).rejects.toThrow(NotFoundException);

      expect(prismaService.file.findMany).toHaveBeenCalled();
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.file.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(fileService.fetchFiles()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.file.findMany).toHaveBeenCalled();
    });
  });

  describe('fetchFileById', () => {
    it('should fetch a file', async () => {
      (prismaService.file.findFirstOrThrow as jest.Mock).mockResolvedValue(
        file,
      );

      const result: Return = await fileService.fetchFileById(file.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.file.fetchFileById.status_200,
        data: file,
      });
      expect(prismaService.file.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: file.id,
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.file.findFirstOrThrow as jest.Mock).mockRejectedValue(
        error,
      );

      await expect(fileService.fetchFileById(file.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.file.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: file.id,
        },
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.file.findFirstOrThrow as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(fileService.fetchFileById(file.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.file.findFirstOrThrow).toHaveBeenCalledWith({
        where: {
          id: file.id,
        },
      });
    });
  });

  describe('updateFile()', () => {
    it('should fetch a file', async () => {
      (prismaService.file.update as jest.Mock).mockResolvedValue(file);

      const result: Return = await fileService.updateFile(file.id, file);

      expect(result).toMatchObject({
        message: httpMessages_EN.file.updateFile.status_200,
        data: file,
      });
      expect(prismaService.file.update).toHaveBeenCalledWith({
        where: {
          id: file.id,
        },
        data: file,
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.file.update as jest.Mock).mockRejectedValue(error);

      await expect(fileService.updateFile(file.id, file)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.file.update).toHaveBeenCalledWith({
        where: {
          id: file.id,
        },
        data: file,
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.file.update as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(fileService.updateFile(file.id, file)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.file.update).toHaveBeenCalledWith({
        where: {
          id: file.id,
        },
        data: file,
      });
    });
  });

  describe('deleteFile()', () => {
    it('should fetch a file', async () => {
      (prismaService.file.delete as jest.Mock).mockResolvedValue(file);
      jest.spyOn(fileService, 'deleteFileFromS3').mockResolvedValue(undefined);
      const result: Return = await fileService.deleteFile(file.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.file.deleteFile.status_200,
        data: file,
      });
      expect(prismaService.file.delete).toHaveBeenCalledWith({
        where: {
          id: file.id,
        },
      });
      expect(fileService.deleteFileFromS3).toHaveBeenCalledWith(file.url);
    });

    it('should throw NotFoundException', async () => {
      (prismaService.file.delete as jest.Mock).mockRejectedValue(error);
      jest.spyOn(fileService, 'deleteFileFromS3').mockResolvedValue(undefined);
      await expect(fileService.deleteFile(file.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.file.delete).toHaveBeenCalledWith({
        where: {
          id: file.id,
        },
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.file.delete as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );
      jest.spyOn(fileService, 'deleteFileFromS3').mockResolvedValue(undefined);

      await expect(fileService.deleteFile(file.id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(prismaService.file.delete).toHaveBeenCalledWith({
        where: {
          id: file.id,
        },
      });
    });
  });
});
