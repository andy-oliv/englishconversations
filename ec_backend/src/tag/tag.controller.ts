import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TagService } from './tag.service';
import Return from '../common/types/Return';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import CreateTagDTO from './dto/createTag.dto';
import AddOrRemoveTagDTO from './dto/addOrRemoveTag.dto';

@ApiTags('Tags')
@Controller('api/tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post('add')
  async addTag(
    @Body()
    { contentType, tagId, exerciseId, quizId, unitId }: AddOrRemoveTagDTO,
  ): Promise<Return> {
    return this.tagService.addTag(
      contentType,
      tagId,
      exerciseId,
      quizId,
      unitId,
    );
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: httpMessages_EN.tag.createTag.status_201,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: validationMessages_EN.tag.createTagDTO.title.isString,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: httpMessages_EN.tag.createTag.status_409,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async createTag(@Body() { title }: CreateTagDTO): Promise<Return> {
    return this.tagService.createTag(title);
  }

  @Get('query')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.tag.fetchTagByTitle.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: validationMessages_EN.tag.createTagDTO.title.isString,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.tag.fetchTagByTitle.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchTagByTitle(@Query() { title }: CreateTagDTO): Promise<Return> {
    return this.tagService.fetchTagByTitle(title);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.tag.fetchTagById.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (numeric string is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.tag.fetchTagById.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchTagById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Return> {
    return this.tagService.fetchTagById(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.tag.fetchTags.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.tag.fetchTags.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchTags(): Promise<Return> {
    return this.tagService.fetchTags();
  }

  @Delete('remove')
  async removeTag(
    @Body()
    { contentType, tagId, exerciseId, quizId, unitId }: AddOrRemoveTagDTO,
  ): Promise<Return> {
    return this.tagService.removeTag(
      contentType,
      tagId,
      exerciseId,
      quizId,
      unitId,
    );
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.tag.deleteTag.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (numeric string is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.tag.deleteTag.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteTag(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Return> {
    return this.tagService.deleteTag(id);
  }
}
