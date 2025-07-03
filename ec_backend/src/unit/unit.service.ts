import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Unit from '../entities/Unit';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import Return from '../common/types/Return';
import UpdateUnitDTO from './dto/updateUnit.dto';
import { FileService } from '../file/file.service';

@Injectable()
export class UnitService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly fileService: FileService,
  ) {}

  async createUnit(data: Unit): Promise<Return> {
    try {
      const unit: Unit = await this.prismaService.unit.create({
        data,
      });

      return {
        message: httpMessages_EN.unit.createUnit.status_200,
        data: unit,
      };
    } catch (error) {
      if (error.code === 'P2003') {
        throw new NotFoundException(httpMessages_EN.unit.createUnit.status_404);
      }

      handleInternalErrorException(
        'unitService',
        'createUnit',
        loggerMessages.unit.createUnit.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchUnits(): Promise<Return> {
    try {
      const units: Unit[] = await this.prismaService.unit.findMany();

      if (units.length === 0) {
        throw new NotFoundException(httpMessages_EN.unit.fetchUnits.status_404);
      }

      return {
        message: httpMessages_EN.unit.fetchUnits.status_200,
        data: units,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'unitService',
        'fetchUnits',
        loggerMessages.unit.fetchUnits.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchUnitById(id: number): Promise<Return> {
    try {
      const unit: Unit = await this.prismaService.unit.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          chapter: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
          videos: {
            select: {
              id: true,
              title: true,
              description: true,
              duration: true,
            },
          },
          quizzes: {
            select: {
              id: true,
              title: true,
              description: true,
              difficulty: true,
              isTest: true,
            },
          },
          file: {
            select: {
              id: true,
              name: true,
              type: true,
              size: true,
              url: true,
            },
          },
        },
      });

      return {
        message: httpMessages_EN.unit.fetchUnitById.status_200,
        data: unit,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.unit.fetchUnitById.status_404,
        );
      }

      handleInternalErrorException(
        'unitService',
        'fetchUnitById',
        loggerMessages.unit.fetchUnitById.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchByChapter(chapterId: string): Promise<Return> {
    try {
      const units: Unit[] = await this.prismaService.unit.findMany({
        where: {
          chapterId,
        },
      });

      if (units.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.unit.fetchByChapter.status_404,
        );
      }

      return {
        message: httpMessages_EN.unit.fetchByChapter.status_200,
        data: units,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      handleInternalErrorException(
        'unitService',
        'fetchByChapter',
        loggerMessages.unit.fetchByChapter.status_500,
        this.logger,
        error,
      );
    }
  }

  async updateUnit(id: number, data: UpdateUnitDTO): Promise<Return> {
    try {
      const updatedUnit: Unit = await this.prismaService.unit.update({
        where: {
          id,
        },
        data,
      });

      return {
        message: httpMessages_EN.unit.updateUnit.status_200,
        data: updatedUnit,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(httpMessages_EN.unit.updateUnit.status_404);
      }

      if (error.code === 'P2003') {
        throw new NotFoundException(
          httpMessages_EN.unit.updateUnit.status_404B,
        );
      }

      handleInternalErrorException(
        'unitService',
        'updateUnit',
        loggerMessages.unit.updateUnit.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteUnit(id: number): Promise<Return> {
    try {
      const deletedUnit: Unit = await this.prismaService.unit.delete({
        where: {
          id,
        },
      });

      if (deletedUnit.fileId) {
        await this.fileService.deleteFile(deletedUnit.fileId);
      }

      return {
        message: httpMessages_EN.unit.deleteUnit.status_200,
        data: deletedUnit,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(httpMessages_EN.unit.deleteUnit.status_404);
      }

      handleInternalErrorException(
        'unitService',
        'deleteUnit',
        loggerMessages.unit.deleteUnit.status_500,
        this.logger,
        error,
      );
    }
  }
}
