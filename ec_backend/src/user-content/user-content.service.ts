import { Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import Return from 'src/common/types/Return';
import UserContent from 'src/entities/UserContent';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateUserContentDTO from './dto/CreateUserContent.dto';
import handleInternalErrorException from 'src/helper/functions/handleErrorException';
import loggerMessages from 'src/helper/messages/loggerMessages';
import httpMessages_EN from 'src/helper/messages/httpMessages.en';
import UpdateUserContentDTO from './dto/UpdateUserContent.dto';
import Content from 'src/entities/Content';
import { Status, Unit, UserUnit } from '@prisma/client';
import { UserUnitService } from 'src/user-unit/user-unit.service';

@Injectable()
export class UserContentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly userUnitService: UserUnitService,
  ) {}

  private async unlockNextContent(
    currentUserContent: UserContent,
  ): Promise<void> {
    try {
      const currentContent: Content =
        await this.prismaService.content.findFirstOrThrow({
          where: {
            id: currentUserContent.contentId,
          },
        });

      const nextContent: Content = await this.prismaService.content.findFirst({
        where: {
          order: { gt: currentContent.order },
        },
        orderBy: { order: 'asc' },
      });

      if (nextContent) {
        const userNextContentProgress: UserContent =
          await this.prismaService.userContent.findFirstOrThrow({
            where: {
              contentId: nextContent.id,
              userId: currentUserContent.userId,
            },
          });

        await this.prismaService.userContent.update({
          where: {
            id: userNextContentProgress.id,
          },
          data: {
            status: Status.IN_PROGRESS,
          },
        });
      } else {
        //if there isn't another content to unlock, it unlocks the next unit
        const currentUnitProgress: UserUnit =
          await this.prismaService.userUnit.findFirstOrThrow({
            where: {
              userId: currentUserContent.userId,
              unitId: currentContent.unitId,
            },
          });

        await this.userUnitService.unlockNextUnit(
          currentUserContent.userId,
          currentUnitProgress,
        );
      }
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.userContent.unlockNextContent.status_404,
        );
      }

      handleInternalErrorException(
        'userContentService',
        'unlockNextContent',
        loggerMessages.userContent.unlockNextContent.status_500,
        this.logger,
        error,
      );
    }
  }

  async createUserContent(data: CreateUserContentDTO): Promise<Return> {
    try {
      const userContent: UserContent =
        await this.prismaService.userContent.create({
          data,
        });

      return {
        message: httpMessages_EN.userContent.createUserContent.status_201,
        data: userContent,
      };
    } catch (error) {
      handleInternalErrorException(
        'UserContentService',
        'createUserContent',
        loggerMessages.userContent.createUserContent.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchUserContents(): Promise<Return> {
    try {
      const userContents: UserContent[] =
        await this.prismaService.userContent.findMany();

      if (userContents.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.userContent.fetchUserContents.status_404,
        );
      }

      return {
        message: httpMessages_EN.userContent.fetchUserContents.status_200,
        data: userContents,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'UserContentService',
        'fetchUserContents',
        loggerMessages.userContent.fetchUserContents.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchUserContentsByUser(userId: string): Promise<Return> {
    try {
      const userContents: UserContent[] =
        await this.prismaService.userContent.findMany({
          where: {
            userId,
          },
        });

      if (userContents.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.userContent.fetchUserContentsByUser.status_404,
        );
      }

      return {
        message: httpMessages_EN.userContent.fetchUserContentsByUser.status_200,
        data: userContents,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'UserContentService',
        'fetchUserContentsByUser',
        loggerMessages.userContent.fetchUserContentsByUser.status_500,
        this.logger,
        error,
      );
    }
  }

  async updateUserContent(id: number, data: UpdateUserContentDTO) {
    try {
      const updatedUserContent = await this.prismaService.userContent.update({
        where: {
          id,
        },
        data,
      });

      await this.unlockNextContent(updatedUserContent);

      return {
        message: httpMessages_EN.userContent.updateUserContent.status_200,
        data: updatedUserContent,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.userContent.updateUserContent.status_404,
        );
      }

      handleInternalErrorException(
        'UserContentService',
        'updateUserContent',
        loggerMessages.userContent.updateUserContent.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteUserContent(id: number) {
    try {
      const deleteUserContent = await this.prismaService.userContent.delete({
        where: {
          id,
        },
      });

      return {
        message: httpMessages_EN.userContent.deleteUserContent.status_200,
        data: deleteUserContent,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.userContent.deleteUserContent.status_404,
        );
      }

      handleInternalErrorException(
        'UserContentService',
        'deleteUserContent',
        loggerMessages.userContent.deleteUserContent.status_500,
        this.logger,
        error,
      );
    }
  }
}
