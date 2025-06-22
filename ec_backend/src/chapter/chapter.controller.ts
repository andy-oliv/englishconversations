import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import Return from '../common/types/Return';
import GenerateChapterDTO from './dto/generateChapter.dto';
import UpdateChapterDTO from './dto/updateChapter.dto';
import { RoleGuard } from '../auth/guards/role/role.guard';

@ApiTags('Chapters')
@Controller('api/chapters')
@UseGuards(RoleGuard)
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: httpMessages_EN.chapter.generateChapter.status_200,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: httpMessages_EN.chapter.throwIfChapterExists.status_409,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async generateChapter(
    @Body() chapterData: GenerateChapterDTO,
  ): Promise<Return> {
    return this.chapterService.generateChapter(chapterData);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.chapter.fetchChapterById.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.chapter.fetchChapterById.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchChapterById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return this.chapterService.fetchChapterById(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.chapter.fetchChapters.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.chapter.fetchChapters.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchChapters(): Promise<Return> {
    return this.chapterService.fetchChapters();
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.chapter.updateChapter.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.chapter.updateChapter.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async updateChapter(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatedData: UpdateChapterDTO,
  ): Promise<Return> {
    return await this.chapterService.updateChapter(id, updatedData);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.chapter.deleteChapter.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.chapter.deleteChapter.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteChapter(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return await this.chapterService.deleteChapter(id);
  }
}
