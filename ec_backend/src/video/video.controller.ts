import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { VideoService } from './video.service';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import UpdateVideoDTO from './dto/updateVideo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerMemoryStorage } from '../config/upload.config';
import FormHandlerReturn from '../common/types/FormHandlerReturn';
import FormDataHandler from '../helper/functions/formDataHandler';
import GenerateVideoDTO from './dto/generateVideo.dto';
import { S3Service } from '../s3/s3.service';
import { Logger } from 'nestjs-pino';
import updateFormHandler from '../helper/functions/updateFormHandler';
import parseJson from '../helper/functions/parseJson';
import allowedTypes from '../helper/functions/allowedTypes';
import { RoleGuard } from '../auth/guards/role/role.guard';
import { UserRoles } from '@prisma/client';
import { AuthType } from '../common/decorators/authType.decorator';

@ApiTags('Videos')
@Controller('api/videos')
@AuthType(UserRoles.ADMIN)
@UseGuards(RoleGuard)
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly s3Service: S3Service,
    private readonly logger: Logger,
  ) {}

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
  @UseInterceptors(FileInterceptor('file', multerMemoryStorage))
  async generateVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body('metadata') metadata: string,
  ): Promise<Return> {
    allowedTypes(file);

    const videoData: FormHandlerReturn = await FormDataHandler(
      GenerateVideoDTO,
      file,
      metadata,
      this.s3Service,
      this.logger,
      'videos/thumbnails',
    );

    return this.videoService.generateVideo({
      ...videoData.data,
      thumbnailUrl: videoData.fileUrl,
    });
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
  @UseInterceptors(FileInterceptor('file', multerMemoryStorage))
  async updateVideo(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('metadata') metadata: string,
  ): Promise<Return> {
    if (!metadata && !file) {
      throw new BadRequestException(
        httpMessages_EN.video.updateVideo.status_400,
      );
    }
    if (file) {
      allowedTypes(file);

      const videoData: Partial<FormHandlerReturn> = await updateFormHandler(
        this.s3Service,
        this.logger,
        'videos/thumbnails',
        UpdateVideoDTO,
        file,
        metadata,
      );

      return this.videoService.updateVideo(id, {
        ...videoData.data,
        thumbnailUrl: videoData.fileUrl,
      });
    }

    if (!metadata) {
      throw new BadRequestException(
        httpMessages_EN.video.updateVideo.status_4002,
      );
    }

    const videoData: any = await parseJson(UpdateVideoDTO, metadata);
    return this.videoService.updateVideo(id, videoData);
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
