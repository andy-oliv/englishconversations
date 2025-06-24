import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import Tag from '../entities/Tag';
import { PrismaService } from '../prisma/prisma.service';
import generateExceptionMessage from '../helper/functions/generateExceptionMessage';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import TagRelations from '../common/types/tagRelations';
import { ContentType } from '../common/types/ContentType';

type TagHandler = {
  add: (id: number | string, tagId: number) => Promise<any>;
  remove: (id: number | string, tagId: number) => Promise<any>;
  fetch: (id: number | string) => Promise<any>;
};

@Injectable()
export class TagService {
  private tagIncludesAll = {
    exerciseTags: {
      include: {
        exercise: {
          select: {
            id: true,
            type: true,
            description: true,
          },
        },
      },
    },
    quizTags: {
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    },
    unitTags: {
      include: {
        unit: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    },
    videoTags: {
      include: {
        video: {
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
          },
        },
      },
    },
  };

  private tagIncludes: Record<ContentType, object> = {
    exercise: {
      exerciseTags: {
        include: {
          exercise: {
            select: {
              id: true,
              type: true,
              description: true,
            },
          },
        },
      },
    },
    quiz: {
      quizTags: {
        include: {
          quiz: {
            select: {
              id: true,
              title: true,
              description: true,
            },
          },
        },
      },
    },
    unit: {
      unitTags: {
        include: {
          unit: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      },
    },
    video: {
      videoTags: {
        include: {
          video: {
            select: {
              id: true,
              title: true,
              description: true,
              duration: true,
            },
          },
        },
      },
    },
  };

  tagActions: Record<ContentType, TagHandler> = {
    exercise: {
      add: (exerciseId: number, tagId: number) =>
        this.prismaService.exerciseTag.create({
          data: { exerciseId, tagId },
        }),
      remove: (exerciseId: number, tagId: number) =>
        this.prismaService.exerciseTag.delete({
          where: {
            exerciseId_tagId: {
              exerciseId,
              tagId,
            },
          },
        }),
      fetch: (exerciseId: number) =>
        this.prismaService.exercise.findFirstOrThrow({
          where: {
            id: exerciseId,
          },
        }),
    },
    quiz: {
      add: (quizId: string, tagId: number) =>
        this.prismaService.quizTag.create({
          data: { quizId, tagId },
        }),
      remove: (quizId: string, tagId: number) =>
        this.prismaService.quizTag.delete({
          where: {
            quizId_tagId: {
              quizId,
              tagId,
            },
          },
        }),
      fetch: (quizId: string) =>
        this.prismaService.quiz.findFirstOrThrow({
          where: {
            id: quizId,
          },
        }),
    },
    unit: {
      add: (unitId: number, tagId: number) =>
        this.prismaService.unitTag.create({
          data: { unitId, tagId },
        }),
      remove: (unitId: number, tagId: number) =>
        this.prismaService.unitTag.delete({
          where: {
            unitId_tagId: {
              unitId,
              tagId,
            },
          },
        }),
      fetch: (unitId: number) =>
        this.prismaService.unit.findFirstOrThrow({
          where: {
            id: unitId,
          },
        }),
    },
    video: {
      add: (videoId: string, tagId: number) =>
        this.prismaService.videoTag.create({
          data: { videoId, tagId },
        }),
      remove: (videoId: string, tagId: number) =>
        this.prismaService.videoTag.delete({
          where: {
            videoId_tagId: {
              videoId,
              tagId,
            },
          },
        }),
      fetch: (videoId: string) =>
        this.prismaService.video.findFirstOrThrow({
          where: {
            id: videoId,
          },
        }),
    },
  };

  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async validateTagContent(
    contentType: ContentType,
    tagId: number,
    relations: TagRelations,
  ): Promise<void> {
    await this.fetchTag(tagId);
    await this.tagActions[contentType].fetch(relations[contentType + 'Id']);
  }

  async fetchTag(id?: number, title?: string): Promise<Tag> {
    if (id === undefined && title === undefined) {
      throw new BadRequestException(httpMessages_EN.tag.fetchTag.status_400);
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
          httpMessages_EN.tag.fetchTagById.status_404,
        );
      }

      handleInternalErrorException(
        'tagService',
        'fetchTag',
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
          'tagService',
          'createTag',
          loggerMessages.tag.createTag.status_200,
        ),
        data: tag,
      });

      return { message: httpMessages_EN.tag.createTag.status_201, data: tag };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(httpMessages_EN.tag.createTag.status_409);
      }

      handleInternalErrorException(
        'tagService',
        'createTag',
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
        throw new NotFoundException(httpMessages_EN.tag.fetchTags.status_404);
      }

      return { message: httpMessages_EN.tag.fetchTags.status_200, data: tags };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'tagService',
        'fetchTags',
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
        include: this.tagIncludesAll,
      });

      return {
        message: httpMessages_EN.tag.fetchTagById.status_200,
        data: tag,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.tag.fetchTagById.status_404,
        );
      }

      handleInternalErrorException(
        'tagService',
        'fetchTagById',
        loggerMessages.tag.fetchTagById.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchContentByTag(
    title: string,
    contentType?: ContentType,
  ): Promise<Return> {
    try {
      if (contentType) {
        const tag: Tag = await this.prismaService.tag.findUniqueOrThrow({
          where: {
            title,
          },
          include: this.tagIncludes[contentType],
        });

        return {
          message: httpMessages_EN.tag.fetchContentByTag.status_200,
          data: tag,
        };
      }
      const tag: Tag = await this.prismaService.tag.findUniqueOrThrow({
        where: {
          title,
        },
        include: this.tagIncludesAll,
      });

      return {
        message: httpMessages_EN.tag.fetchContentByTag.status_200,
        data: tag,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.tag.fetchContentByTag.status_404,
        );
      }

      handleInternalErrorException(
        'tagService',
        'fetchContentByTag',
        loggerMessages.tag.fetchContentByTag.status_500,
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
        generateExceptionMessage(
          'tagService',
          'deleteTag',
          loggerMessages.tag.deleteTag.status_200,
        ),
      );

      return {
        message: httpMessages_EN.tag.deleteTag.status_200,
        data: tag,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(httpMessages_EN.tag.deleteTag.status_404);
      }

      handleInternalErrorException(
        'tagService',
        'deleteTag',
        loggerMessages.tag.deleteTag.status_500,
        this.logger,
        error,
      );
    }
  }

  /* 
  If you add a new content type that supports tags, make sure to:
  1. Add it to the ContentType union
  2. Add the corresponding property to TagRelations (e.g., 'articleId')
  3. Extend the tagActions map with add, remove, and fetch methods for this content
  4. Extend the fetchActions map with the findFirstOrthrow method for this content
  5. Update the tagIncludes private constants to show the new content
  This ensures addTag and removeTag continue to work properly.
*/
  async addTag(
    contentType: ContentType,
    tagId: number,
    relations: TagRelations,
  ): Promise<Return> {
    try {
      await this.validateTagContent(contentType, tagId, relations);

      await this.tagActions[contentType].add(
        relations[contentType.toLowerCase() + 'Id'],
        tagId,
      );

      const tag: Tag = await this.fetchTag(tagId);

      return { message: httpMessages_EN.tag.addTag.status_200, data: tag };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(httpMessages_EN.tag.addTag.status_409);
      }

      if (error.code === 'P2025') {
        throw new NotFoundException(httpMessages_EN.tag.addTag.status_404);
      }

      handleInternalErrorException(
        'tagService',
        'addTag',
        loggerMessages.tag.addTag.status_500,
        this.logger,
        error,
      );
    }
  }

  async removeTag(
    contentType: ContentType,
    tagId: number,
    relations: TagRelations,
  ): Promise<Return> {
    try {
      await this.validateTagContent(contentType, tagId, relations);

      await this.tagActions[contentType].remove(
        relations[contentType.toLowerCase() + 'Id'],
        tagId,
      );
      const tag: Tag = await this.fetchTag(tagId);

      return { message: httpMessages_EN.tag.removeTag.status_200, data: tag };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(httpMessages_EN.tag.removeTag.status_404);
      }

      handleInternalErrorException(
        'tagService',
        'removeTag',
        loggerMessages.tag.removeTag.status_500,
        this.logger,
        error,
      );
    }
  }
}
