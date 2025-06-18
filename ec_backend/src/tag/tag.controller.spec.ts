import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import Tag from '../common/types/Tag';
import { faker } from '@faker-js/faker/.';
import Exercise from '../common/types/Exercise';
import generateMockExercise from '../helper/mocks/generateMockExercise';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import Return from '../common/types/Return';
import { ContentType } from '../common/types/ContentType';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import AddOrRemoveTagDTO from './dto/addOrRemoveTag.dto';

describe('TagController', () => {
  let tagController: TagController;
  let tagService: TagService;
  let tag: Tag;
  let exercise: Exercise;
  let contentType: ContentType;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        {
          provide: TagService,
          useValue: {
            addTag: jest.fn(),
            createTag: jest.fn(),
            deleteTag: jest.fn(),
            fetchContentByTag: jest.fn(),
            fetchTagById: jest.fn(),
            fetchTags: jest.fn(),
            removeTag: jest.fn(),
          },
        },
      ],
    }).compile();

    tagController = module.get<TagController>(TagController);
    tagService = module.get<TagService>(TagService);
    tag = {
      id: faker.number.int(),
      title: faker.book.title(),
    };
    exercise = generateMockExercise();
    contentType = 'exercise';
  });

  it('should be defined', () => {
    expect(tagController).toBeDefined();
  });

  describe('addTag()', () => {
    it('should add a tag to a content', async () => {
      (tagService.addTag as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.tag.addTag.status_200,
        data: tag,
      });

      const result: Return = await tagController.addTag({
        contentType,
        tagId: tag.id,
        exerciseId: exercise.id,
      });

      expect(result).toMatchObject({
        message: httpMessages_EN.tag.addTag.status_200,
        data: tag,
      });
      expect(tagService.addTag).toHaveBeenCalledWith(contentType, tag.id, {
        exerciseId: exercise.id,
      });
    });

    it('should throw BadRequestException', async () => {
      (tagService.addTag as jest.Mock).mockRejectedValue(
        new BadRequestException(httpMessages_EN.tag.addTag.status_400),
      );

      await expect(
        tagController.addTag({
          contentType,
          tagId: tag.id,
          exerciseId: exercise.id,
        }),
      ).rejects.toThrow(
        new BadRequestException(httpMessages_EN.tag.addTag.status_400),
      );
      expect(tagService.addTag).toHaveBeenCalledWith(contentType, tag.id, {
        exerciseId: exercise.id,
      });
    });

    it('should throw NotFoundException', async () => {
      (tagService.addTag as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.tag.addTag.status_404),
      );

      await expect(
        tagController.addTag({
          contentType,
          tagId: tag.id,
          exerciseId: exercise.id,
        }),
      ).rejects.toThrow(
        new NotFoundException(httpMessages_EN.tag.addTag.status_404),
      );
      expect(tagService.addTag).toHaveBeenCalledWith(contentType, tag.id, {
        exerciseId: exercise.id,
      });
    });

    it('should throw InternalServerErrorException', async () => {
      (tagService.addTag as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        tagController.addTag({
          contentType,
          tagId: tag.id,
          exerciseId: exercise.id,
        }),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );
      expect(tagService.addTag).toHaveBeenCalledWith(contentType, tag.id, {
        exerciseId: exercise.id,
      });
    });
  });

  describe('createTag()', () => {
    it('should create a new tag', async () => {
      (tagService.createTag as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.tag.createTag.status_201,
        data: tag,
      });

      const result: Return = await tagController.createTag({
        title: tag.title,
      });

      expect(result).toMatchObject({
        message: httpMessages_EN.tag.createTag.status_201,
        data: tag,
      });
      expect(tagService.createTag).toHaveBeenCalledWith(tag.title);
    });

    it('should throw ConflictException', async () => {
      (tagService.createTag as jest.Mock).mockRejectedValue(
        new ConflictException(httpMessages_EN.tag.createTag.status_409),
      );

      await expect(
        tagController.createTag({ title: tag.title }),
      ).rejects.toThrow(
        new ConflictException(httpMessages_EN.tag.createTag.status_409),
      );
      expect(tagService.createTag).toHaveBeenCalledWith(tag.title);
    });

    it('should throw InternalServerErrorException', async () => {
      (tagService.createTag as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        tagController.createTag({ title: tag.title }),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );
      expect(tagService.createTag).toHaveBeenCalledWith(tag.title);
    });
  });

  describe('fetchContentByTag()', () => {
    it('should fetch content', async () => {
      (tagService.fetchContentByTag as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.tag.fetchContentByTag.status_200,
        data: tag,
      });

      const result: Return = await tagController.fetchContentByTag({
        title: tag.title,
        contentType,
      });

      expect(result).toMatchObject({
        message: httpMessages_EN.tag.fetchContentByTag.status_200,
        data: tag,
      });
      expect(tagService.fetchContentByTag).toHaveBeenCalledWith(
        tag.title,
        contentType,
      );
    });

    it('should throw NotFoundException', async () => {
      (tagService.fetchContentByTag as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.tag.fetchContentByTag.status_404),
      );

      await expect(
        tagController.fetchContentByTag({
          title: tag.title,
          contentType,
        }),
      ).rejects.toThrow(
        new NotFoundException(httpMessages_EN.tag.fetchContentByTag.status_404),
      );

      expect(tagService.fetchContentByTag).toHaveBeenCalledWith(
        tag.title,
        contentType,
      );
    });

    it('should throw InternalServerErrorException', async () => {
      (tagService.fetchContentByTag as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        tagController.fetchContentByTag({
          title: tag.title,
          contentType,
        }),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(tagService.fetchContentByTag).toHaveBeenCalledWith(
        tag.title,
        contentType,
      );
    });
  });

  describe('fetchTagById()', () => {
    it('should fetch a tag', async () => {
      (tagService.fetchTagById as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.tag.fetchTagById.status_200,
        data: tag,
      });

      const result: Return = await tagController.fetchTagById(tag.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.tag.fetchTagById.status_200,
        data: tag,
      });
      expect(tagService.fetchTagById).toHaveBeenCalledWith(tag.id);
    });

    it('should throw NotFoundException', async () => {
      (tagService.fetchTagById as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.tag.fetchTagById.status_404),
      );

      await expect(tagController.fetchTagById(tag.id)).rejects.toThrow(
        new NotFoundException(httpMessages_EN.tag.fetchTagById.status_404),
      );

      expect(tagService.fetchTagById).toHaveBeenCalledWith(tag.id);
    });

    it('should throw InternalServerErrorException', async () => {
      (tagService.fetchTagById as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(tagController.fetchTagById(tag.id)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(tagService.fetchTagById).toHaveBeenCalledWith(tag.id);
    });
  });

  describe('fetchTags()', () => {
    it('should fetch tags', async () => {
      (tagService.fetchTags as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.tag.fetchTags.status_200,
        data: tag,
      });

      const result: Return = await tagController.fetchTags();

      expect(result).toMatchObject({
        message: httpMessages_EN.tag.fetchTags.status_200,
        data: tag,
      });
      expect(tagService.fetchTags).toHaveBeenCalledWith();
    });

    it('should throw NotFoundException', async () => {
      (tagService.fetchTags as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.tag.fetchTags.status_404),
      );

      await expect(tagController.fetchTags()).rejects.toThrow(
        new NotFoundException(httpMessages_EN.tag.fetchTags.status_404),
      );

      expect(tagService.fetchTags).toHaveBeenCalledWith();
    });

    it('should throw InternalServerErrorException', async () => {
      (tagService.fetchTags as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(tagController.fetchTags()).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(tagService.fetchTags).toHaveBeenCalledWith();
    });
  });

  describe('removeTag()', () => {
    it('should remove the connection between a tag and a content', async () => {
      (tagService.removeTag as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.tag.removeTag.status_200,
        data: tag,
      });

      const result: Return = await tagController.removeTag({
        contentType,
        tagId: tag.id,
        exerciseId: exercise.id,
      });

      expect(result).toMatchObject({
        message: httpMessages_EN.tag.removeTag.status_200,
        data: tag,
      });
      expect(tagService.removeTag).toHaveBeenCalledWith(contentType, tag.id, {
        exerciseId: exercise.id,
      });
    });

    it('should throw BadRequestException', async () => {
      (tagService.removeTag as jest.Mock).mockRejectedValue(
        new BadRequestException(httpMessages_EN.tag.removeTag.status_400),
      );

      await expect(
        tagController.removeTag({
          contentType,
          tagId: tag.id,
          exerciseId: exercise.id,
        }),
      ).rejects.toThrow(
        new BadRequestException(httpMessages_EN.tag.removeTag.status_400),
      );

      expect(tagService.removeTag).toHaveBeenCalledWith(contentType, tag.id, {
        exerciseId: exercise.id,
      });
    });

    it('should throw a NotFoundException', async () => {
      (tagService.removeTag as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.tag.removeTag.status_404),
      );

      await expect(
        tagController.removeTag({
          contentType,
          tagId: tag.id,
          exerciseId: exercise.id,
        }),
      ).rejects.toThrow(
        new NotFoundException(httpMessages_EN.tag.removeTag.status_404),
      );

      expect(tagService.removeTag).toHaveBeenCalledWith(contentType, tag.id, {
        exerciseId: exercise.id,
      });
    });

    it('should throw a InternalServerErrorException', async () => {
      (tagService.removeTag as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(
        tagController.removeTag({
          contentType,
          tagId: tag.id,
          exerciseId: exercise.id,
        }),
      ).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(tagService.removeTag).toHaveBeenCalledWith(contentType, tag.id, {
        exerciseId: exercise.id,
      });
    });
  });

  describe('deleteTag()', () => {
    it('should delete a tag', async () => {
      (tagService.deleteTag as jest.Mock).mockResolvedValue({
        message: httpMessages_EN.tag.deleteTag.status_200,
        data: tag,
      });

      const result: Return = await tagController.deleteTag(tag.id);

      expect(result).toMatchObject({
        message: httpMessages_EN.tag.deleteTag.status_200,
        data: tag,
      });
      expect(tagService.deleteTag).toHaveBeenCalledWith(tag.id);
    });

    it('should throw NotFoundException', async () => {
      (tagService.deleteTag as jest.Mock).mockRejectedValue(
        new NotFoundException(httpMessages_EN.tag.deleteTag.status_404),
      );

      await expect(tagController.deleteTag(tag.id)).rejects.toThrow(
        new NotFoundException(httpMessages_EN.tag.deleteTag.status_404),
      );

      expect(tagService.deleteTag).toHaveBeenCalledWith(tag.id);
    });

    it('should throw InternalServerErrorException', async () => {
      (tagService.deleteTag as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      await expect(tagController.deleteTag(tag.id)).rejects.toThrow(
        new InternalServerErrorException(httpMessages_EN.general.status_500),
      );

      expect(tagService.deleteTag).toHaveBeenCalledWith(tag.id);
    });
  });
});
