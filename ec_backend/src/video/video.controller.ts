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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { VideoService } from './video.service';
import Return from '../common/types/Return';
import GenerateVideoDTO from './dto/generateVideo.dto';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import UpdateVideoDTO from './dto/updateVideo.dto';

@ApiTags('Videos')
@Controller('api/videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: httpMessages_EN.video.generateVideo.status_200,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async generateVideo(@Body() videoData: GenerateVideoDTO): Promise<Return> {
    return this.videoService.generateVideo(videoData);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.video.fetchVideoById.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.video.fetchVideoById.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchVideoById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return this.videoService.fetchVideoById(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.video.fetchVideos.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.video.fetchVideos.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchVideos(): Promise<Return> {
    return this.videoService.fetchVideos();
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.video.updateVideo.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.video.updateVideo.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async updateVideo(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatedData: UpdateVideoDTO,
  ): Promise<Return> {
    return await this.videoService.updateVideo(id, updatedData);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.video.deleteVideo.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.video.deleteVideo.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteVideo(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return await this.videoService.deleteVideo(id);
  }
}
