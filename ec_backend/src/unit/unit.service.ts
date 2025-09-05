import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Unit from '../entities/Unit';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import Return from '../common/types/Return';
import UpdateUnitDTO from './dto/updateUnit.dto';
import { S3Service } from '../s3/s3.service';
import Chapter from 'src/entities/Chapter';
import { Status } from '@prisma/client';

@Injectable()
export class UnitService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly s3Service: S3Service,
  ) {}

  async generateUserUnitRelations(unitId: number) {
    try {
      const users: { id: string }[] = await this.prismaService.user.findMany({
        select: { id: true },
      });

      const firstChapter: Partial<Chapter> =
        await this.prismaService.chapter.findFirst({
          where: {
            order: 1,
          },
          select: {
            id: true,
          },
        });

      const firstChapterFirstUnit: Partial<Unit> =
        await this.prismaService.unit.findFirst({
          where: {
            chapterId: firstChapter.id,
            order: 1,
          },
          select: {
            id: true,
          },
        });

      const progresses: { userId: string; unitId: number }[] = users.map(
        (user) =>
          unitId === firstChapterFirstUnit.id
            ? { userId: user.id, unitId: unitId, status: Status.IN_PROGRESS }
            : { userId: user.id, unitId: unitId },
      );

      await this.prismaService.userUnit.createMany({
        data: progresses,
        skipDuplicates: true,
      });
    } catch (error) {
      handleInternalErrorException(
        'UnitService',
        'generateUserUnitRelations',
        loggerMessages.unit.generateUserUnitRelations.status_500,
        this.logger,
        error,
      );
    }
  }

  async createUnit(data: Unit): Promise<Return> {
    const unitNumber: number = await this.prismaService.unit.count({
      where: {
        chapterId: data.chapterId,
      },
    });
    data.order = unitNumber + 1;

    try {
      const unit: Unit = await this.prismaService.unit.create({
        data,
      });

      await this.generateUserUnitRelations(unit.id);

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
          contents: {
            orderBy: {
              order: 'asc',
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

      if (deletedUnit.imageUrl) {
        await this.s3Service.deleteFileFromS3(deletedUnit.imageUrl);
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
