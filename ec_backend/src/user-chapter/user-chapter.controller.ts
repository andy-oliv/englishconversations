import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserChapterService } from './user-chapter.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import Return from '../common/types/Return';
import GenerateUserChapterDTO from './dto/generateUserChapter.dto';
import UpdateUserChapterDTO from './dto/updateUserChapter.dto';

@ApiTags('UserChapter')
@Controller('api/users/chapters')
export class UserChapterController {
  constructor(private readonly userChapterService: UserChapterService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: httpMessages_EN.userChapter.generateUserChapter.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.userChapter.generateUserChapter.status_404,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: httpMessages_EN.userChapter.throwIfChapterExists.status_409,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async generateUserChapter(
    @Body() userChapterData: GenerateUserChapterDTO,
  ): Promise<Return> {
    return this.userChapterService.generateUserChapter(userChapterData);
  }

  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.userChapter.fetchUserChapters.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.userChapter.fetchUserChapters.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchUserChapters(): Promise<Return> {
    return this.userChapterService.fetchUserChapters();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.userChapter.fetchUserChapterById.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.userChapter.fetchUserChapterById.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchUserChapterById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return this.userChapterService.fetchUserChapterById(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.userChapter.updateUserChapter.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.userChapter.updateUserChapter.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async updateUserChapter(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatedData: UpdateUserChapterDTO,
  ): Promise<Return> {
    return await this.userChapterService.updateUserChapter(id, updatedData);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.userChapter.deleteUserChapter.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.userChapter.deleteUserChapter.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteUserChapter(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return await this.userChapterService.deleteUserChapter(id);
  }
}
