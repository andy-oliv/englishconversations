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
import { FileService } from './file.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import Return from '../common/types/Return';
import UpdateFileDTO from './dto/updateFile.dto';
import { RoleGuard } from '../auth/guards/role/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerMemoryStorage } from '../config/upload.config';
import { S3Service } from '../s3/s3.service';
import File from '../entities/File';
import fileUploadHandler from '../helper/functions/fileUploadHandler';
import { Logger } from 'nestjs-pino';
import GenerateFileDTO from './dto/generateFile.dto';

@ApiTags('Files')
@Controller('api/files')
@UseGuards(RoleGuard)
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly s3Service: S3Service,
    private readonly logger: Logger,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: httpMessages_EN.file.generateFile.status_200,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  @UseInterceptors(FileInterceptor('file', multerMemoryStorage))
  async generateFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('metadata') metadata: string,
  ): Promise<Return> {
    const handledFile: { data: GenerateFileDTO; url: string } =
      await fileUploadHandler(file, metadata, this.s3Service, this.logger);
    const fileData: File = { ...handledFile.data, url: handledFile.url };
    return this.fileService.generateFile(fileData);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.file.fetchFileById.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.file.fetchFileById.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchFileById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return this.fileService.fetchFileById(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.file.fetchFiles.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.file.fetchFiles.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchFiles(): Promise<Return> {
    return this.fileService.fetchFiles();
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.file.updateFile.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.file.updateFile.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async updateFile(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatedData: UpdateFileDTO,
  ): Promise<Return> {
    return await this.fileService.updateFile(id, updatedData);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.file.deleteFile.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.file.deleteFile.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteFile(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return await this.fileService.deleteFile(id);
  }
}
