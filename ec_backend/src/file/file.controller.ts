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
import { FileService } from './file.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import Return from '../common/types/Return';
import UpdateFileDTO from './dto/updateFile.dto';
import GenerateFileDTO from './dto/generateFile.dto';

@ApiTags('Files')
@Controller('api/files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

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
  async generateFile(@Body() fileData: GenerateFileDTO): Promise<Return> {
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
