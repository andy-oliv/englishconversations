import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import UserUnit from '../entities/UserUnit';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import generateExceptionMessage from '../helper/functions/generateExceptionMessage';
import { Status, UserContent } from '@prisma/client';
import UpdateUserUnitDTO from './dto/updateUserUnit.dto';
import Unit from 'src/entities/Unit';
import { UserChapterService } from 'src/user-chapter/user-chapter.service';
import Content from 'src/entities/Content';

@Injectable()
export class UserUnitService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly userChapterService: UserChapterService,
  ) {}

  private async unlockFirstContent(userUnitProgress: UserUnit): Promise<void> {
    try {
      const firstContent: Content = await this.prismaService.content.findFirst({
        where: {
          unitId: userUnitProgress.unitId,
          order: 1,
        },
      });

      //if the first content doesn't exist then it means the unit doesn't have any contents
      if (firstContent) {
        const firstContentProgress: UserContent =
          await this.prismaService.userContent.findFirst({
            where: {
              contentId: firstContent.id,
              userId: userUnitProgress.userId,
            },
          });

        await this.prismaService.userContent.update({
          where: {
            id: firstContentProgress.id,
          },
          data: {
            status: Status.IN_PROGRESS,
          },
        });
      }
    } catch (error) {
      handleInternalErrorException(
        'UserUnitService',
        'unlockFirstContent',
        loggerMessages.userUnit.unlockFirstContent.status_500,
        this.logger,
        error,
      );
    }
  }

  async unlockNextUnit(
    userId: string,
    currentUnitProgress: UserUnit,
  ): Promise<void> {
    try {
      if (currentUnitProgress.status !== Status.COMPLETED) {
        await this.prismaService.userUnit.update({
          where: {
            id: currentUnitProgress.id,
          },
          data: {
            status: Status.COMPLETED,
          },
        });
      }

      const currentUnit: Unit = await this.prismaService.unit.findFirstOrThrow({
        where: {
          id: currentUnitProgress.unitId,
        },
      });

      const nextUnit: Unit = await this.prismaService.unit.findFirst({
        where: { order: { gt: currentUnit.order } },
        orderBy: { order: 'asc' },
      });

      if (nextUnit) {
        const userNextUnitProgress: UserUnit =
          await this.prismaService.userUnit.findFirstOrThrow({
            where: {
              unitId: nextUnit.id,
              userId,
            },
          });

        const updatedProgress = await this.prismaService.userUnit.update({
          where: {
            id: userNextUnitProgress.id,
          },
          data: {
            status: Status.IN_PROGRESS,
          },
        });

        await this.unlockFirstContent(updatedProgress);
      } else {
        //if there isn't another unit to unlock, it unlocks the next chapter
        await this.userChapterService.unlockNextChapter(
          userId,
          currentUnit.chapterId,
        );
      }
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.userUnit.unlockNextUnit.status_404,
        );
      }

      handleInternalErrorException(
        'userUnitService',
        'unlockNextUnit',
        loggerMessages.userUnit.unlockNextUnit.status_500,
        this.logger,
        error,
      );
    }
  }

  async throwIfUserUnitExists(unitId: number, userId: string): Promise<void> {
    try {
      const userUnitExists: UserUnit =
        await this.prismaService.userUnit.findFirst({
          where: {
            AND: [{ unitId }, { userId }],
          },
        });

      if (userUnitExists) {
        throw new ConflictException(
          httpMessages_EN.userUnit.throwIfUserUnitExists.status_409,
        );
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      handleInternalErrorException(
        'userUnitService',
        'throwIfUserUnitExists',
        loggerMessages.userUnit.throwIfUserUnitExists.status_500,
        this.logger,
        error,
      );
    }
  }

  async generateUserUnit(data: UserUnit): Promise<Return> {
    await this.throwIfUserUnitExists(data.unitId, data.userId);

    try {
      const userUnit: UserUnit = await this.prismaService.userUnit.create({
        data,
      });

      return {
        message: httpMessages_EN.userUnit.generateUserUnit.status_200,
        data: userUnit,
      };
    } catch (error) {
      if (error.code === 'P2003') {
        throw new NotFoundException(
          httpMessages_EN.userUnit.generateUserUnit.status_404,
        );
      }

      handleInternalErrorException(
        'userUnitService',
        'generateUserUnit',
        loggerMessages.userUnit.generateUserUnit.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchUserUnits(): Promise<Return> {
    try {
      const userUnits: UserUnit[] =
        await this.prismaService.userUnit.findMany();

      if (userUnits.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.userUnit.fetchUserUnits.status_404,
        );
      }

      return {
        message: httpMessages_EN.userUnit.fetchUserUnits.status_200,
        data: userUnits,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'userUnitService',
        'fetchUserUnits',
        loggerMessages.userUnit.fetchUserUnits.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchUserUnitById(id: string): Promise<Return> {
    try {
      const userUnit: UserUnit =
        await this.prismaService.userUnit.findUniqueOrThrow({
          where: {
            id,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            unit: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        });

      return {
        message: httpMessages_EN.userUnit.fetchUserUnitById.status_200,
        data: userUnit,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.userUnit.fetchUserUnitById.status_404,
        );
      }

      handleInternalErrorException(
        'userUnitService',
        'fetchUserUnitById',
        loggerMessages.userUnit.fetchUserUnitById.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchUserUnitsByQuery(userId?: string): Promise<Return> {
    try {
      const userUnits: UserUnit[] = await this.prismaService.userUnit.findMany({
        where: {
          userId,
        },
      });

      if (userUnits.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.userUnit.fetchUserUnitsByQuery.status_404,
        );
      }

      return {
        message: httpMessages_EN.userUnit.fetchUserUnitsByQuery.status_200,
        data: userUnits,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'userUnitService',
        'fetchUserUnitsByQuery',
        loggerMessages.userUnit.fetchUserUnitsByQuery.status_500,
        this.logger,
        error,
      );
    }
  }

  async updateUserUnit(
    id: string,
    userId: string,
    data: UpdateUserUnitDTO,
  ): Promise<Return> {
    try {
      const updatedUserUnit: UserUnit =
        await this.prismaService.userUnit.update({
          where: {
            id,
            userId,
          },
          data,
        });

      this.logger.log({
        message: generateExceptionMessage(
          'userUnitService',
          'updateUserUnit',
          loggerMessages.userUnit.updateUserUnit.status_200,
        ),
      });

      await this.unlockNextUnit(userId, updatedUserUnit);

      return {
        message: httpMessages_EN.userUnit.updateUserUnit.status_200,
        data: updatedUserUnit,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.userUnit.updateUserUnit.status_404,
        );
      }

      handleInternalErrorException(
        'userUnitService',
        'updateUserUnit',
        loggerMessages.userUnit.updateUserUnit.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteUserUnit(id: string): Promise<Return> {
    try {
      const updatedUserUnit: UserUnit =
        await this.prismaService.userUnit.delete({
          where: {
            id,
          },
        });

      this.logger.warn({
        message: generateExceptionMessage(
          'userUnitService',
          'updateUserUnit',
          loggerMessages.userUnit.deleteUserUnit.status_200,
        ),
      });

      return {
        message: httpMessages_EN.userUnit.deleteUserUnit.status_200,
        data: updatedUserUnit,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.userUnit.deleteUserUnit.status_404,
        );
      }

      handleInternalErrorException(
        'userUnitService',
        'deleteUserUnit',
        loggerMessages.userUnit.deleteUserUnit.status_500,
        this.logger,
        error,
      );
    }
  }
}
