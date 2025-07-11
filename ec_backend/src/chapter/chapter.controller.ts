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
import { ChapterService } from './chapter.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import Return from '../common/types/Return';
import GenerateChapterDTO from './dto/generateChapter.dto';
import UpdateChapterDTO from './dto/updateChapter.dto';
import { RoleGuard } from '../auth/guards/role/role.guard';
import FormHandlerReturn from '../common/types/FormHandlerReturn';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerMemoryStorage } from '../config/upload.config';
import FormDataHandler from '../helper/functions/formDataHandler';
import { S3Service } from '../s3/s3.service';
import { Logger } from 'nestjs-pino';
import { FileService } from '../file/file.service';
import updateFormHandler from '../helper/functions/updateFormHandler';
import parseJson from '../helper/functions/parseJson';
import allowedTypes from '../helper/functions/allowedTypes';
import { AuthType } from '../common/decorators/authType.decorator';
import { UserRoles } from '../../generated/prisma';

@ApiTags('Chapters')
@Controller('api/chapters')
@AuthType(UserRoles.ADMIN)
@UseGuards(RoleGuard)
export class ChapterController {
  constructor(
    private readonly chapterService: ChapterService,
    private readonly fileService: FileService,
    private readonly s3Service: S3Service,
    private readonly logger: Logger,
  ) {}

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
  @UseInterceptors(FileInterceptor('file', multerMemoryStorage))
  async generateChapter(
    @UploadedFile() file: Express.Multer.File,
    @Body('metadata') metadata: string,
  ): Promise<Return> {
    allowedTypes(file);

    const chapterData: FormHandlerReturn = await FormDataHandler(
      GenerateChapterDTO,
      file,
      metadata,
      this.s3Service,
      this.logger,
      'images/chapter',
    );
    const thumbnail: Return = await this.fileService.generateFile({
      name: file.originalname,
      type: 'IMAGE',
      size: file.size,
      url: chapterData.fileUrl,
    });

    return this.chapterService.generateChapter({
      ...chapterData.data,
      fileId: thumbnail.data.id,
    });
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
  @UseInterceptors(FileInterceptor('file', multerMemoryStorage))
  async updateChapter(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('metadata') metadata: string,
  ): Promise<Return> {
    if (!metadata && !file) {
      throw new BadRequestException(
        httpMessages_EN.chapter.updateChapter.status_400,
      );
    }

    if (file) {
      allowedTypes(file);

      const chapterData: Partial<FormHandlerReturn> = await updateFormHandler(
        this.s3Service,
        this.logger,
        'images/chapter',
        UpdateChapterDTO,
        file,
        metadata,
      );

      const thumbnail: Return = await this.fileService.generateFile({
        name: file.originalname,
        type: 'IMAGE',
        size: file.size,
        url: chapterData.fileUrl,
      });

      return this.chapterService.updateChapter(id, {
        ...chapterData.data,
        fileId: thumbnail.data.id,
      });
    }

    if (!metadata) {
      throw new BadRequestException(
        httpMessages_EN.chapter.updateChapter.status_4002,
      );
    }

    const chapterData: any = await parseJson(UpdateChapterDTO, metadata);
    return this.chapterService.updateChapter(id, chapterData);
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
