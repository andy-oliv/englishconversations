import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import File from '../common/types/File';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import Return from '../common/types/Return';
import UpdateFileDTO from './dto/updateFile.dto';
import generateExceptionMessage from '../helper/functions/generateExceptionMessage';

@Injectable()
export class FileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async generateFile(data: File): Promise<Return> {
    try {
      const file: File = await this.prismaService.file.create({
        data,
      });

      return {
        message: httpMessages_EN.file.generateFile.status_200,
        data: file,
      };
    } catch (error) {
      handleInternalErrorException(
        'fileService',
        'generateFile',
        loggerMessages.file.generateFile.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchFiles(): Promise<Return> {
    try {
      const files: File[] = await this.prismaService.file.findMany();

      if (files.length === 0) {
        throw new NotFoundException(httpMessages_EN.file.fetchFiles.status_404);
      }

      return {
        message: httpMessages_EN.file.fetchFiles.status_200,
        data: files,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'fileService',
        'fetchFiles',
        loggerMessages.file.fetchFiles.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchFileById(id: string): Promise<Return> {
    try {
      const file: File = await this.prismaService.file.findFirstOrThrow({
        where: {
          id,
        },
      });

      return {
        message: httpMessages_EN.file.fetchFileById.status_200,
        data: file,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.file.fetchFileById.status_404,
        );
      }

      handleInternalErrorException(
        'fileService',
        'fetchFileById',
        loggerMessages.file.fetchFileById.status_500,
        this.logger,
        error,
      );
    }
  }

  async updateFile(id: string, updatedData: UpdateFileDTO): Promise<Return> {
    try {
      const updatedFile: File = await this.prismaService.file.update({
        where: {
          id,
        },
        data: updatedData,
      });

      this.logger.log({
        message: generateExceptionMessage(
          'fileService',
          'updateFile',
          loggerMessages.file.updateFile.status_200,
        ),
        data: updatedFile,
      });

      return {
        message: httpMessages_EN.file.updateFile.status_200,
        data: updatedFile,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(httpMessages_EN.file.updateFile.status_404);
      }

      handleInternalErrorException(
        'fileService',
        'updateFile',
        loggerMessages.file.updateFile.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteFile(id: string): Promise<Return> {
    try {
      const deletedFile: File = await this.prismaService.file.delete({
        where: {
          id,
        },
      });

      this.logger.warn({
        message: generateExceptionMessage(
          'fileService',
          'deleteFile',
          loggerMessages.file.deleteFile.status_200,
        ),
        data: deletedFile,
      });

      return {
        message: httpMessages_EN.file.deleteFile.status_200,
        data: deletedFile,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(httpMessages_EN.file.deleteFile.status_404);
      }

      handleInternalErrorException(
        'fileService',
        'deleteFile',
        loggerMessages.file.deleteFile.status_500,
        this.logger,
        error,
      );
    }
  }
}
