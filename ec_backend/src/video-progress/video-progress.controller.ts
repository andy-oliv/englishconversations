import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { VideoProgressService } from './video-progress.service';
import Return from '../common/types/Return';
import GenerateVideoProgressDTO from './dto/generateVideoProgress';
import UpdateVideoProgressDTO from './dto/updateVideoProgress';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import { SelfGuard } from '../auth/guards/self/self.guard';
import { RoleGuard } from '../auth/guards/role/role.guard';

@ApiTags('VideoProgress')
@Controller('api/videos/progress')
export class VideoProgressController {
  constructor(private readonly videoProgressService: VideoProgressService) {}

  @Post()
  @UseGuards(SelfGuard)
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: httpMessages_EN.videoProgress.generateVideoProgress.status_201,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example:
      validationMessages_EN.videoProgress.generateVideoProgressDTO.userId
        .isNotEmpty,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: httpMessages_EN.videoProgress.throwIfProgressExists.status_409,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async generateVideoProgress(
    @Body() data: GenerateVideoProgressDTO,
  ): Promise<Return> {
    return this.videoProgressService.generateVideoProgress(
      data.userId,
      data.videoId,
    );
  }

  @Get('user/:userId')
  @UseGuards(SelfGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example:
      httpMessages_EN.videoProgress.fetchVideoProgressesByUser.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example:
      httpMessages_EN.videoProgress.fetchVideoProgressesByUser.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchVideoProgressesByUser(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<Return> {
    return this.videoProgressService.fetchVideoProgressesByUser(userId);
  }

  @Get('all')
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.videoProgress.fetchVideoProgresses.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.videoProgress.fetchVideoProgresses.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchVideoProgresses(): Promise<Return> {
    return this.videoProgressService.fetchVideoProgresses();
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.videoProgress.fetchVideoProgressById.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (numeric string is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.videoProgress.fetchVideoProgressById.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchVideoProgressById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Return> {
    return this.videoProgressService.fetchVideoProgressById(id);
  }

  @Patch('update')
  @UseGuards(SelfGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.videoProgress.updateProgress.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (numeric string is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.videoProgress.updateProgress.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async updateProgress(
    @Query('id', new ParseIntPipe()) id: number,
    @Query('userId', new ParseUUIDPipe()) userId: string,
    @Body() data: UpdateVideoProgressDTO,
  ): Promise<Return> {
    return this.videoProgressService.updateProgress(id, userId, data);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.videoProgress.deleteProgress.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (numeric string is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.videoProgress.deleteProgress.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteProgress(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Return> {
    return this.videoProgressService.deleteProgress(id);
  }
}
