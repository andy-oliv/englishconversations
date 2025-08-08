import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import * as bcrypt from 'bcrypt';
import User from '../entities/User';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import Return from '../common/types/Return';
import { ConfigService } from '@nestjs/config';
import generateExceptionMessage from '../helper/functions/generateExceptionMessage';
import UpdateUserDTO from './dto/updateUser.dto';
import { S3Service } from '../s3/s3.service';
import { Response } from 'express';
import Chapter from '../entities/Chapter';

@Injectable()
export class UserService {
  userProgress = {
    chapters: {
      select: {
        id: true,
        progress: true,
        status: true,
      },
    },
    units: {
      select: {
        id: true,
        progress: true,
        status: true,
      },
    },
    videoProgresses: {
      select: {
        id: true,
        video: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        progress: true,
        isFavorite: true,
        watchedCount: true,
        watchedDuration: true,
      },
    },
    notifications: {
      select: {
        id: true,
        notification: {
          select: {
            type: true,
            title: true,
            content: true,
          },
        },
        isRead: true,
        deliveredAt: true,
      },
    },
  };

  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly s3service: S3Service,
  ) {}

  async generateUserChapterRelations(userId: string) {
    try {
      const chapters: Partial<Chapter>[] =
        await this.prismaService.chapter.findMany({
          select: { id: true },
        });

      const progresses: { userId: string; chapterId: string }[] = chapters.map(
        (chapter) => ({ userId: userId, chapterId: chapter.id }),
      );

      await this.prismaService.userChapter.createMany({
        data: progresses,
      });
    } catch (error) {
      handleInternalErrorException(
        'UserService',
        'generateUserChapterRelations',
        loggerMessages.chapter.generateUserChapterRelations.status_500,
        this.logger,
        error,
      );
    }
  }

  async throwIfNotUser(userId: string): Promise<void> {
    try {
      await this.prismaService.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.user.fetchUserById.status_404,
        );
      }

      handleInternalErrorException(
        'userService',
        'throwIfNotUser',
        loggerMessages.user.fetchUserById.status_500,
        this.logger,
        error,
      );
    }
  }

  async validateUserAvailability(email: string): Promise<void> {
    try {
      const userExists: User = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });

      if (userExists) {
        throw new ConflictException(
          httpMessages_EN.user.validateUserAvailability.status_409,
        );
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      handleInternalErrorException(
        'userService',
        'validateUserAvailability',
        loggerMessages.user.validateUserAvailability.status_500,
        this.logger,
        error,
      );
    }
  }

  getSaltRounds(): number {
    try {
      const saltRounds = this.configService.get<string>('SALT_ROUNDS');
      if (!saltRounds || isNaN(Number(saltRounds))) {
        throw new InternalServerErrorException();
      }

      return Number(saltRounds);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        handleInternalErrorException(
          'userService',
          'validateSaltRounds',
          loggerMessages.user.getSaltRounds.status_500,
          this.logger,
          error,
        );
      }
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds: number = this.getSaltRounds();

    try {
      const hashedPassword: string = await bcrypt.hash(password, saltRounds);

      return hashedPassword;
    } catch (error) {
      handleInternalErrorException(
        'userService',
        'hashPassword',
        loggerMessages.user.hashPassword.status_500,
        this.logger,
        error,
      );
    }
  }

  async registerUser(userData: User): Promise<Return> {
    await this.validateUserAvailability(userData.email);
    const hashedPassword = await this.hashPassword(userData.password);

    try {
      const user: User = await this.prismaService.user.create({
        data: {
          name: userData.name,
          bio: userData.bio,
          city: userData.city,
          state: userData.state,
          country: userData.country,
          avatarUrl: userData.avatarUrl,
          email: userData.email,
          password: hashedPassword,
        },
      });

      await this.generateUserChapterRelations(user.id);

      this.logger.log(
        generateExceptionMessage(
          'userService',
          'registerUser',
          loggerMessages.user.registerUser.status_200,
        ),
      );

      return {
        message: httpMessages_EN.user.registerUser.status_201,
        data: user,
      };
    } catch (error) {
      handleInternalErrorException(
        'userService',
        'registerUser',
        loggerMessages.user.registerUser.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchUsers(): Promise<Return> {
    try {
      const users: User[] = await this.prismaService.user.findMany();

      if (users.length === 0) {
        throw new NotFoundException(httpMessages_EN.user.fetchUsers.status_404);
      }

      return {
        message: httpMessages_EN.user.fetchUsers.status_200,
        data: users,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'userService',
        'fetchUsers',
        loggerMessages.user.fetchUsers.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchUserById(id: string): Promise<Return> {
    try {
      const user: User = await this.prismaService.user.findUniqueOrThrow({
        where: {
          id,
        },
        include: this.userProgress,
      });

      return {
        message: httpMessages_EN.user.fetchUserById.status_200,
        data: user,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.user.fetchUserById.status_404,
        );
      }

      handleInternalErrorException(
        'userService',
        'fetchUserById',
        loggerMessages.user.fetchUserById.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchUserByEmail(email: string): Promise<Return> {
    try {
      const user: User = await this.prismaService.user.findUniqueOrThrow({
        where: {
          email,
        },
        include: this.userProgress,
      });

      return {
        message: httpMessages_EN.user.fetchUserByEmail.status_200,
        data: user,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.user.fetchUserByEmail.status_404,
        );
      }

      handleInternalErrorException(
        'userService',
        'fetchUserByEmail',
        loggerMessages.user.fetchUserByEmail.status_500,
        this.logger,
        error,
      );
    }
  }

  async updateUser(id: string, userData: UpdateUserDTO): Promise<Return> {
    try {
      if (userData.avatarUrl) {
        const currentUser: User =
          await this.prismaService.user.findFirstOrThrow({
            where: {
              id,
            },
          });

        if (currentUser.avatarUrl) {
          await this.s3service.deleteFileFromS3(currentUser.avatarUrl); //deleting previous avatar from S3
        }

        this.logger.log({
          message: generateExceptionMessage(
            'userService',
            'updateUser',
            loggerMessages.user.updateUser.status_2002,
          ),
          data: {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            deletedAvatarUrl: currentUser.avatarUrl,
          },
        });
      }

      const updatedUser: User = await this.prismaService.user.update({
        where: {
          id,
        },
        data: userData,
      });

      this.logger.log(
        generateExceptionMessage(
          'userService',
          'updateUser',
          loggerMessages.user.updateUser.status_200,
        ),
      );

      return {
        message: httpMessages_EN.user.updateUser.status_200,
        data: updatedUser,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(httpMessages_EN.user.updateUser.status_404);
      }

      handleInternalErrorException(
        'userService',
        'updateUser',
        loggerMessages.user.updateUser.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteUser(id: string, response: Response): Promise<Return> {
    try {
      const deletedUser: User = await this.prismaService.user.delete({
        where: {
          id,
        },
      });

      if (deletedUser.avatarUrl) {
        await this.s3service.deleteFileFromS3(deletedUser.avatarUrl);
      }

      this.logger.log(
        generateExceptionMessage(
          'userService',
          'deleteUser',
          loggerMessages.user.deleteUser.status_200,
        ),
      );

      response.clearCookie('ec_accessToken');
      response.clearCookie('ec_refreshToken');

      return {
        message: httpMessages_EN.user.deleteUser.status_200,
        data: deletedUser,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(httpMessages_EN.user.deleteUser.status_404);
      }

      handleInternalErrorException(
        'userService',
        'deleteUser',
        loggerMessages.user.deleteUser.status_500,
        this.logger,
        error,
      );
    }
  }
}
