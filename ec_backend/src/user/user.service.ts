import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import * as bcrypt from 'bcrypt';
import User from '../common/types/User';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import Return from '../common/types/Return';
import { ConfigService } from '@nestjs/config';
import generateExceptionMessage from '../helper/functions/generateExceptionMessage';
import UpdateUserDTO from './dto/updateUser.dto';

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
  };

  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {}

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

  async deleteUser(id: string): Promise<Return> {
    try {
      const deletedUser: User = await this.prismaService.user.delete({
        where: {
          id,
        },
      });

      this.logger.log(
        generateExceptionMessage(
          'userService',
          'deleteUser',
          loggerMessages.user.deleteUser.status_200,
        ),
      );

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
