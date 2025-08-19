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

@Injectable()
export class UserContentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

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
