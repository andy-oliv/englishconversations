import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import Return from '../common/types/Return';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import CreateTagDTO from './dto/createTag.dto';
import AddOrRemoveTagDTO from './dto/addOrRemoveTag.dto';
import FetchContentByTag from './dto/fetchContentByTag.dto';
import { RoleGuard } from '../auth/guards/role/role.guard';
import { AuthType } from '../common/decorators/authType.decorator';
import { UserRoles } from '@prisma/client';

@ApiTags('Tags')
@Controller('api/tags')
@AuthType(UserRoles.ADMIN)
@UseGuards(RoleGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post('add')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.tag.addTag.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: httpMessages_EN.tag.addTag.status_404,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.tag.addTag.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async addTag(
    @Body()
    {
      contentType,
      tagId,
      exerciseId,
      quizId,
      unitId,
      videoId,
    }: AddOrRemoveTagDTO,
  ): Promise<Return> {
    return this.tagService.addTag(contentType, tagId, {
      exerciseId,
      quizId,
      unitId,
      videoId,
    });
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
    example: httpMessages_EN.tag.fetchContentByTag.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: validationMessages_EN.tag.createTagDTO.title.isString,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.tag.fetchContentByTag.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchContentByTag(
    @Query()
    { title, contentType }: FetchContentByTag,
  ): Promise<Return> {
    return this.tagService.fetchContentByTag(title, contentType);
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
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.tag.removeTag.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: httpMessages_EN.tag.removeTag.status_400,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.tag.removeTag.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async removeTag(
    @Body()
    {
      contentType,
      tagId,
      exerciseId,
      quizId,
      unitId,
      videoId,
    }: AddOrRemoveTagDTO,
  ): Promise<Return> {
    return this.tagService.removeTag(contentType, tagId, {
      exerciseId,
      quizId,
      unitId,
      videoId,
    });
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
