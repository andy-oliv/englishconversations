import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import UserUnit from '../common/types/UserUnit';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import generateExceptionMessage from '../helper/functions/generateExceptionMessage';
import { Status } from '../../generated/prisma';
import UpdateUserUnitDTO from './dto/updateUserUnit.dto';

@Injectable()
export class UserUnitService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

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

  async fetchUserUnitsByQuery(
    userId?: string,
    unitId?: number,
    status?: Status,
  ): Promise<Return> {
    try {
      const userUnits: UserUnit[] = await this.prismaService.userUnit.findMany({
        where: {
          OR: [{ userId }, { unitId }, { status }],
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

  async updateUserUnit(id: string, data: UpdateUserUnitDTO): Promise<Return> {
    try {
      const updatedUserUnit: UserUnit =
        await this.prismaService.userUnit.update({
          where: {
            id,
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
