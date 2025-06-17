import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import Tag from '../common/types/Tag';
import { PrismaService } from '../prisma/prisma.service';
import generateExceptionMessage from '../helper/functions/generateExceptionMessage';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';

@Injectable()
export class TagService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async fetchTag(id?: number, title?: string): Promise<Tag> {
    if (id === undefined && title === undefined) {
      throw new BadRequestException(
        generateExceptionMessage(httpMessages_EN.tag.fetchTag.status_400),
      );
    }
    try {
      const tag: Tag = await this.prismaService.tag.findFirstOrThrow({
        where: {
          OR: [{ id }, { title }],
        },
      });

      return tag;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          generateExceptionMessage(httpMessages_EN.tag.fetchTagById.status_404),
        );
      }

      handleInternalErrorException(
        loggerMessages.tag.fetchTagById.status_500,
        this.logger,
        error,
      );
    }
  }

  async createTag(title: string): Promise<Return> {
    try {
      const tag: Tag = await this.prismaService.tag.create({
        data: {
          title,
        },
      });

      this.logger.log({
        message: generateExceptionMessage(
          loggerMessages.tag.createTag.status_200,
        ),
        data: tag,
      });

      return { message: httpMessages_EN.tag.createTag.status_201, data: tag };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          generateExceptionMessage(httpMessages_EN.tag.createTag.status_409),
        );
      }

      handleInternalErrorException(
        loggerMessages.tag.createTag.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchTags(): Promise<Return> {
    try {
      const tags: Tag[] = await this.prismaService.tag.findMany();

      if (tags.length === 0) {
        throw new NotFoundException(
          generateExceptionMessage(httpMessages_EN.tag.fetchTags.status_404),
        );
      }

      return { message: httpMessages_EN.tag.fetchTags.status_200, data: tags };
    } catch (error) {
      handleInternalErrorException(
        loggerMessages.tag.fetchTags.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchTagById(id: number): Promise<Return> {
    try {
      const tag: Tag = await this.prismaService.tag.findUniqueOrThrow({
        where: {
          id,
        },
      });

      return {
        message: httpMessages_EN.tag.fetchTagById.status_200,
        data: tag,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          generateExceptionMessage(httpMessages_EN.tag.fetchTagById.status_404),
        );
      }

      handleInternalErrorException(
        loggerMessages.tag.fetchTagById.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchTagByTitle(title: string): Promise<Return> {
    try {
      const tag: Tag = await this.prismaService.tag.findUniqueOrThrow({
        where: {
          title,
        },
      });

      return {
        message: httpMessages_EN.tag.fetchTagByTitle.status_200,
        data: tag,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          generateExceptionMessage(
            httpMessages_EN.tag.fetchTagByTitle.status_404,
          ),
        );
      }

      handleInternalErrorException(
        loggerMessages.tag.fetchTagByTitle.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteTag(id: number): Promise<Return> {
    try {
      const tag: Tag = await this.prismaService.tag.delete({
        where: {
          id,
        },
      });

      this.logger.warn(
        generateExceptionMessage(loggerMessages.tag.deleteTag.status_200),
      );

      return {
        message: httpMessages_EN.tag.deleteTag.status_200,
        data: tag,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          generateExceptionMessage(httpMessages_EN.tag.deleteTag.status_404),
        );
      }

      handleInternalErrorException(
        loggerMessages.tag.deleteTag.status_500,
        this.logger,
        error,
      );
    }
  }

  async addTag(
    contentType: string,
    tagId: number,
    exerciseId?: number,
    quizId?: string,
    unitId?: number,
    videoId?: string,
  ): Promise<Return> {
    try {
      switch (contentType.toLowerCase()) {
        case 'exercise':
          await this.prismaService.exerciseTag.create({
            data: {
              exerciseId,
              tagId,
            },
          });
          break;
        case 'quiz':
          await this.prismaService.quizTag.create({
            data: {
              quizId,
              tagId,
            },
          });
          break;
        case 'unit':
          await this.prismaService.unitTag.create({
            data: {
              unitId,
              tagId,
            },
          });
          break;
        case 'video':
          await this.prismaService.videoTag.create({
            data: {
              videoId,
              tagId,
            },
          });
          break;
        default:
          throw new BadRequestException(httpMessages_EN.tag.addTag.status_400);
      }

      const tag: Tag = await this.fetchTag(tagId);

      return { message: httpMessages_EN.tag.addTag.status_200, data: tag };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          generateExceptionMessage(httpMessages_EN.tag.addTag.status_409),
        );
      }

      handleInternalErrorException(
        loggerMessages.tag.addTag.status_500,
        this.logger,
        error,
      );
    }
  }

  async removeTag(
    contentType: string,
    tagId: number,
    exerciseId?: number,
    quizId?: string,
    unitId?: number,
    videoId?: string,
  ): Promise<Return> {
    try {
      switch (contentType.toLowerCase()) {
        case 'exercise':
          await this.prismaService.exerciseTag.delete({
            where: {
              exerciseId_tagId: {
                exerciseId,
                tagId,
              },
            },
          });
          break;
        case 'quiz':
          await this.prismaService.quizTag.delete({
            where: {
              quizId_tagId: {
                quizId,
                tagId,
              },
            },
          });
          break;
        case 'unit':
          await this.prismaService.unitTag.delete({
            where: {
              unitId_tagId: {
                tagId,
                unitId,
              },
            },
          });
          break;
        case 'video':
          await this.prismaService.videoTag.delete({
            where: {
              videoId_tagId: {
                tagId,
                videoId,
              },
            },
          });
          break;
        default:
          throw new BadRequestException(
            httpMessages_EN.tag.removeTag.status_400,
          );
      }

      const tag: Tag = await this.fetchTag(tagId);

      return { message: httpMessages_EN.tag.removeTag.status_200, data: tag };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          generateExceptionMessage(httpMessages_EN.tag.removeTag.status_404),
        );
      }

      handleInternalErrorException(
        loggerMessages.tag.removeTag.status_500,
        this.logger,
        error,
      );
    }
  }
}
