import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import Tag from '../entities/Tag';
import Exercise from '../entities/Exercise';
import { ContentType } from '../common/types/ContentType';
import generateMockExercise from '../helper/mocks/generateMockExercise';
import { faker } from '@faker-js/faker/.';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('TagService', () => {
  let tagService: TagService;
  let prismaService: PrismaService;
  let logger: Logger;
  let tag: Tag;
  let exercise: Exercise;
  let contentType: ContentType;
  let conflictError: any;
  let notFoundError: any;
  let tags: Tag[];
  let emptyTags: Tag[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: PrismaService,
          useValue: {
            tag: {
              create: jest.fn(),
              findFirstOrThrow: jest.fn(),
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    tagService = module.get<TagService>(TagService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
    tag = {
      id: faker.number.int(),
      title: faker.book.title(),
    };
    exercise = generateMockExercise();
    contentType = 'exercise';
    conflictError = {
      code: 'P2002',
    };
    notFoundError = {
      code: 'P2025',
    };
    tags = [
      {
        id: faker.number.int(),
        title: faker.book.title(),
      },
      {
        id: faker.number.int(),
        title: faker.book.title(),
      },
    ];
    emptyTags = [];
  });

  it('should be defined', () => {
    expect(tagService).toBeDefined();
  });

  describe('createTag()', () => {
    it('should create a tag', async () => {
      (prismaService.tag.create as jest.Mock).mockResolvedValue(tag);

      const result: Return = await tagService.createTag(tag.title);

      expect(result).toMatchObject({
        message: httpMessages_EN.tag.createTag.status_201,
        data: tag,
      });
      expect(prismaService.tag.create).toHaveBeenCalledWith({
        data: {
          title: tag.title,
        },
      });
    });

    it('should throw ConflictException', async () => {
      (prismaService.tag.create as jest.Mock).mockRejectedValue(conflictError);

      await expect(tagService.createTag(tag.title)).rejects.toThrow(
        new ConflictException(httpMessages_EN.tag.createTag.status_409),
      );

      expect(prismaService.tag.create).toHaveBeenCalledWith({
        data: {
          title: tag.title,
        },
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.tag.create as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(tagService.createTag(tag.title)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(prismaService.tag.create).toHaveBeenCalledWith({
        data: {
          title: tag.title,
        },
      });
    });
  });

  describe('fetchTags()', () => {
    it('should fetch tags', async () => {
      (prismaService.tag.findMany as jest.Mock).mockResolvedValue(tags);

      const result: Return = await tagService.fetchTags();

      expect(result).toMatchObject({
        message: httpMessages_EN.tag.fetchTags.status_200,
        data: tags,
      });
      expect(prismaService.tag.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      (prismaService.tag.findMany as jest.Mock).mockResolvedValue(emptyTags);

      await expect(tagService.fetchTags()).rejects.toThrow(
        new NotFoundException(httpMessages_EN.tag.fetchTags.status_404),
      );

      expect(prismaService.tag.findMany).toHaveBeenCalled();
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.tag.findMany as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(tagService.fetchTags()).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(prismaService.tag.findMany).toHaveBeenCalled();
    });
  });

  describe('fetchTagById', () => {
    it('should fetch a tag', async () => {
      (prismaService.tag.findUniqueOrThrow as jest.Mock).mockResolvedValue(tag);

      const result: Return = await tagService.fetchTagById(tag.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.tag.fetchTagById.status_200,
        data: tag,
      });
      expect(prismaService.tag.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: tag.id,
        },
        include: {
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
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.tag.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        notFoundError,
      );

      await expect(tagService.fetchTagById(tag.id)).rejects.toThrow(
        new NotFoundException(httpMessages_EN.tag.fetchTagById.status_404),
      );

      expect(prismaService.tag.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: tag.id,
        },
        include: {
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
        },
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.tag.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(tagService.fetchTagById(tag.id)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(prismaService.tag.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: tag.id,
        },
        include: {
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
        },
      });
    });
  });

  describe('fetchContentByTag', () => {
    it('should fetch contents without contentType', async () => {
      (prismaService.tag.findUniqueOrThrow as jest.Mock).mockResolvedValue(tag);

      const result: Return = await tagService.fetchContentByTag(tag.title);

      expect(result).toMatchObject({
        message: httpMessages_EN.tag.fetchContentByTag.status_200,
        data: tag,
      });
      expect(prismaService.tag.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          title: tag.title,
        },
        include: {
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
        },
      });
    });
    it('should fetch contents with contentType', async () => {
      (prismaService.tag.findUniqueOrThrow as jest.Mock).mockResolvedValue(tag);

      const result: Return = await tagService.fetchContentByTag(
        tag.title,
        contentType,
      );

      expect(result).toMatchObject({
        message: httpMessages_EN.tag.fetchContentByTag.status_200,
        data: tag,
      });
      expect(prismaService.tag.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          title: tag.title,
        },
        include: {
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
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.tag.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        notFoundError,
      );

      await expect(
        tagService.fetchContentByTag(tag.title, contentType),
      ).rejects.toThrow(
        new NotFoundException(httpMessages_EN.tag.fetchContentByTag.status_404),
      );

      expect(prismaService.tag.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          title: tag.title,
        },
        include: {
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
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.tag.findUniqueOrThrow as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        tagService.fetchContentByTag(tag.title, contentType),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(prismaService.tag.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          title: tag.title,
        },
        include: {
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
      });
    });
  });

  describe('deleteTag()', () => {
    it('should delete a tag', async () => {
      (prismaService.tag.delete as jest.Mock).mockResolvedValue(tag);

      const result: Return = await tagService.deleteTag(tag.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.tag.deleteTag.status_200,
        data: tag,
      });
      expect(prismaService.tag.delete).toHaveBeenCalledWith({
        where: {
          id: tag.id,
        },
      });
    });

    it('should throw NotFoundException', async () => {
      (prismaService.tag.delete as jest.Mock).mockRejectedValue(notFoundError);

      await expect(tagService.deleteTag(tag.id)).rejects.toThrow(
        new NotFoundException(httpMessages_EN.tag.deleteTag.status_404),
      );

      expect(prismaService.tag.delete).toHaveBeenCalledWith({
        where: {
          id: tag.id,
        },
      });
    });

    it('should throw InternalErrorException', async () => {
      (prismaService.tag.delete as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(tagService.deleteTag(tag.id)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(prismaService.tag.delete).toHaveBeenCalledWith({
        where: {
          id: tag.id,
        },
      });
    });
  });

  describe('addTag', () => {
    it('should add a tag to a content', async () => {
      jest.spyOn(tagService, 'validateTagContent').mockResolvedValue(undefined);
      jest
        .spyOn(tagService.tagActions.exercise, 'add')
        .mockResolvedValue(undefined);
      jest.spyOn(tagService, 'fetchTag').mockResolvedValue(tag);

      const result: Return = await tagService.addTag(contentType, tag.id, {
        exerciseId: exercise.id,
      });

      expect(result).toMatchObject({
        message: httpMessages_EN.tag.addTag.status_200,
        data: tag,
      });
      expect(tagService.validateTagContent).toHaveBeenCalledWith(
        contentType,
        tag.id,
        { exerciseId: exercise.id },
      );
      expect(tagService.tagActions.exercise.add).toHaveBeenCalledWith(
        exercise.id,
        tag.id,
      );
      expect(tagService.fetchTag).toHaveBeenCalledWith(tag.id);
    });

    it('should throw NotFoundException', async () => {
      jest
        .spyOn(tagService, 'validateTagContent')
        .mockRejectedValue(notFoundError);

      await expect(
        tagService.addTag(contentType, tag.id, { exerciseId: exercise.id }),
      ).rejects.toThrow(
        new NotFoundException(httpMessages_EN.tag.addTag.status_404),
      );

      expect(tagService.validateTagContent).toHaveBeenCalledWith(
        contentType,
        tag.id,
        { exerciseId: exercise.id },
      );
    });

    it('should throw ConflictException', async () => {
      jest.spyOn(tagService, 'validateTagContent').mockResolvedValue(undefined);
      jest
        .spyOn(tagService.tagActions.exercise, 'add')
        .mockRejectedValue(conflictError);

      await expect(
        tagService.addTag(contentType, tag.id, { exerciseId: exercise.id }),
      ).rejects.toThrow(
        new ConflictException(httpMessages_EN.tag.addTag.status_409),
      );

      expect(tagService.validateTagContent).toHaveBeenCalledWith(
        contentType,
        tag.id,
        { exerciseId: exercise.id },
      );
      expect(tagService.tagActions.exercise.add).toHaveBeenCalledWith(
        exercise.id,
        tag.id,
      );
    });

    it('should throw InternalErrorException', async () => {
      jest.spyOn(tagService, 'validateTagContent').mockResolvedValue(undefined);
      jest
        .spyOn(tagService.tagActions.exercise, 'add')
        .mockResolvedValue(undefined);
      jest
        .spyOn(tagService, 'fetchTag')
        .mockRejectedValue(
          new InternalServerErrorException(httpMessages_EN.general.status_500),
        );

      await expect(
        tagService.addTag(contentType, tag.id, { exerciseId: exercise.id }),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(tagService.validateTagContent).toHaveBeenCalledWith(
        contentType,
        tag.id,
        { exerciseId: exercise.id },
      );
      expect(tagService.tagActions.exercise.add).toHaveBeenCalledWith(
        exercise.id,
        tag.id,
      );
      expect(tagService.fetchTag).toHaveBeenCalledWith(tag.id);
    });
  });

  describe('removeTag', () => {
    it('should remove a tag from a content', async () => {
      jest.spyOn(tagService, 'validateTagContent').mockResolvedValue(undefined);
      jest
        .spyOn(tagService.tagActions.exercise, 'remove')
        .mockResolvedValue(undefined);
      jest.spyOn(tagService, 'fetchTag').mockResolvedValue(tag);

      const result: Return = await tagService.removeTag(contentType, tag.id, {
        exerciseId: exercise.id,
      });

      expect(result).toMatchObject({
        message: httpMessages_EN.tag.removeTag.status_200,
        data: tag,
      });
      expect(tagService.validateTagContent).toHaveBeenCalledWith(
        contentType,
        tag.id,
        { exerciseId: exercise.id },
      );
      expect(tagService.tagActions.exercise.remove).toHaveBeenCalledWith(
        exercise.id,
        tag.id,
      );
      expect(tagService.fetchTag).toHaveBeenCalledWith(tag.id);
    });

    it('should throw NotFoundException', async () => {
      jest
        .spyOn(tagService, 'validateTagContent')
        .mockRejectedValue(notFoundError);

      await expect(
        tagService.removeTag(contentType, tag.id, { exerciseId: exercise.id }),
      ).rejects.toThrow(
        new NotFoundException(httpMessages_EN.tag.removeTag.status_404),
      );

      expect(tagService.validateTagContent).toHaveBeenCalledWith(
        contentType,
        tag.id,
        { exerciseId: exercise.id },
      );
    });

    it('should throw InternalErrorException', async () => {
      jest.spyOn(tagService, 'validateTagContent').mockResolvedValue(undefined);
      jest
        .spyOn(tagService.tagActions.exercise, 'remove')
        .mockResolvedValue(undefined);
      jest
        .spyOn(tagService, 'fetchTag')
        .mockRejectedValue(
          new InternalServerErrorException(httpMessages_EN.general.status_500),
        );

      await expect(
        tagService.removeTag(contentType, tag.id, { exerciseId: exercise.id }),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(tagService.validateTagContent).toHaveBeenCalledWith(
        contentType,
        tag.id,
        { exerciseId: exercise.id },
      );
      expect(tagService.tagActions.exercise.remove).toHaveBeenCalledWith(
        exercise.id,
        tag.id,
      );
      expect(tagService.fetchTag).toHaveBeenCalledWith(tag.id);
    });
  });
});
