import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import RecordedClass from '../entities/RecordedClass';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import UpdateRecordedClassDTO from './dto/UpdateRecordedClass.dto';

@Injectable()
export class RecordedClassService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async createRecordedClass(
    title: string,
    subjectId: number,
    recordedAt: Date,
    url: string,
    userIds: string[],
    materials: string[],
  ): Promise<Return> {
    try {
      const recordedClass: RecordedClass =
        await this.prismaService.recordedClass.create({
          data: {
            title,
            subjectId,
            recordedAt,
            url,
          },
        });

      const userRecordings: { userId: string; recordedClassId: string }[] =
        userIds.map((userId) => ({
          userId,
          recordedClassId: recordedClass.id,
        }));

      await this.prismaService.userRecordings.createMany({
        data: userRecordings,
      });

      if (materials) {
        const classMaterials: {
          materialId: string;
          recordedClassId: string;
        }[] = materials.map((material) => ({
          materialId: material,
          recordedClassId: recordedClass.id,
        }));

        await this.prismaService.classMaterial.createMany({
          data: classMaterials,
        });
      }

      return {
        message: httpMessages_EN.recordedClass.createRecordedClass.status_201,
        data: recordedClass,
      };
    } catch (error) {
      handleInternalErrorException(
        'RecordedClassService',
        'createRecordedClass',
        loggerMessages.recordedClass.createRecordedClass.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchRecordedClasses(): Promise<Return> {
    try {
      const recordings: RecordedClass[] =
        await this.prismaService.recordedClass.findMany();

      if (recordings.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.recordedClass.fetchRecordedClasses.status_404,
        );
      }

      return {
        message: httpMessages_EN.recordedClass.fetchRecordedClasses.status_200,
        data: recordings,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'RecordedClassService',
        'fetchRecordedClasses',
        loggerMessages.recordedClass.fetchRecordedClasses.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchRecordedClass(id: string): Promise<Return> {
    try {
      const recording: RecordedClass =
        await this.prismaService.recordedClass.findUniqueOrThrow({
          where: {
            id,
          },
          include: {
            subject: {
              select: {
                id: true,
                title: true,
              },
            },
            materials: {
              select: {
                material: {
                  select: {
                    id: true,
                    title: true,
                    url: true,
                    type: true,
                    subject: {
                      select: {
                        id: true,
                        title: true,
                      },
                    },
                  },
                },
              },
            },
            users: {
              select: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        });

      return {
        message: httpMessages_EN.recordedClass.fetchRecordedClass.status_200,
        data: recording,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.recordedClass.fetchRecordedClass.status_404,
        );
      }

      handleInternalErrorException(
        'RecordedClassService',
        'fetchRecordedClass',
        loggerMessages.recordedClass.fetchRecordedClass.status_500,
        this.logger,
        error,
      );
    }
  }

  async updateRecordedClass(
    id: string,
    updatedData: UpdateRecordedClassDTO,
  ): Promise<Return> {
    try {
      const updatedRecording: RecordedClass =
        await this.prismaService.recordedClass.update({
          where: {
            id,
          },
          data: updatedData,
        });

      return {
        message: httpMessages_EN.recordedClass.updateRecordedClass.status_200,
        data: updatedRecording,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.recordedClass.updateRecordedClass.status_404,
        );
      }

      handleInternalErrorException(
        'RecordedClassService',
        'updateRecordedClass',
        loggerMessages.recordedClass.updateRecordedClass.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteRecordedClass(id: string): Promise<Return> {
    try {
      const deletedRecording: RecordedClass =
        await this.prismaService.recordedClass.delete({
          where: {
            id,
          },
        });

      return {
        message: httpMessages_EN.recordedClass.deleteRecordedClass.status_200,
        data: deletedRecording,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.recordedClass.deleteRecordedClass.status_404,
        );
      }

      handleInternalErrorException(
        'RecordedClassService',
        'deleteRecordedClass',
        loggerMessages.recordedClass.deleteRecordedClass.status_500,
        this.logger,
        error,
      );
    }
  }
}
