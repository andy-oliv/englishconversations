import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { S3Service } from './s3.service';
import Return from '../common/types/Return';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerMemoryStorage } from '../config/upload.config';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import { RoleGuard } from '../auth/guards/role/role.guard';

@ApiTags('S3')
@Controller('api')
@UseGuards(RoleGuard)
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Get('download')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.s3.getObject.status_200,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async getObject(@Query('url') url: string): Promise<Return> {
    return this.s3Service.getObject(url);
  }

  @Post('upload')
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: httpMessages_EN.s3.putObject.status_201,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  @UseInterceptors(FileInterceptor('file', multerMemoryStorage))
  async putObject(
    @UploadedFile() file: Express.Multer.File,
    @Query('key') key?: string,
  ): Promise<string> {
    return this.s3Service.putObject(file, key);
  }

  @Delete('delete')
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: httpMessages_EN.s3.deleteObject.status_200,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteObject(@Query('key') key: string): Promise<{ message: string }> {
    return this.s3Service.deleteObject(key);
  }
}
