import {
  BadRequestException,
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UnitService } from './unit.service';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import CreateUnitDTO from './dto/createUnit.dto';
import { RoleGuard } from '../auth/guards/role/role.guard';
import { Logger } from 'nestjs-pino';
import { S3Service } from '../s3/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerMemoryStorage } from '../config/upload.config';
import allowedTypes from '../helper/functions/allowedTypes';
import FormHandlerReturn from '../common/types/FormHandlerReturn';
import FormDataHandler from '../helper/functions/formDataHandler';
import updateFormHandler from '../helper/functions/updateFormHandler';
import UpdateVideoDTO from '../video/dto/updateVideo.dto';
import parseJson from '../helper/functions/parseJson';
import { AuthType } from '../common/decorators/authType.decorator';
import { UserRoles } from '@prisma/client';

@ApiTags('Units')
@Controller('api/units')
@AuthType(UserRoles.ADMIN)
@UseGuards(RoleGuard)
export class UnitController {
  constructor(
    private readonly unitService: UnitService,
    private readonly s3Service: S3Service,
    private readonly logger: Logger,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: httpMessages_EN.unit.createUnit.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: validationMessages_EN.unit.createUnitDTO.name.isString,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.unit.createUnit.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  @UseInterceptors(FileInterceptor('file', multerMemoryStorage))
  async createUnit(
    @Body('metadata') metadata: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Return> {
    if (file) {
      allowedTypes(file);

      const unitData: FormHandlerReturn = await FormDataHandler(
        CreateUnitDTO,
        file,
        metadata,
        this.s3Service,
        this.logger,
        'images/unit',
      );

      return this.unitService.createUnit({
        ...unitData.data,
        imageUrl: unitData.fileUrl,
      });
    }
    if (!metadata) {
      throw new BadRequestException(httpMessages_EN.unit.createUnit.status_400);
    }

    const unitData: any = await parseJson(CreateUnitDTO, metadata);
    return this.unitService.createUnit(unitData);
  }

  @Get('chapter')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.unit.fetchByChapter.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.unit.fetchByChapter.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchByChapter(
    @Query('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return this.unitService.fetchByChapter(id);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.unit.fetchUnitById.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (numeric string is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.unit.fetchUnitById.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchUnitById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Return> {
    return this.unitService.fetchUnitById(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.unit.fetchUnits.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.unit.fetchUnits.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchUnits(): Promise<Return> {
    return this.unitService.fetchUnits();
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.unit.updateUnit.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.unit.updateUnit.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  @UseInterceptors(FileInterceptor('file', multerMemoryStorage))
  async updateUnit(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', new ParseIntPipe()) id: number,
    @Body('metadata') metadata: string,
  ): Promise<Return> {
    if (!metadata && !file) {
      throw new BadRequestException(httpMessages_EN.unit.updateUnit.status_400);
    }
    if (file) {
      allowedTypes(file);

      const unitData: Partial<FormHandlerReturn> = await updateFormHandler(
        this.s3Service,
        this.logger,
        'images/unit',
        UpdateVideoDTO,
        file,
        metadata,
      );

      return this.unitService.updateUnit(id, {
        ...unitData.data,
        imageUrl: unitData.fileUrl,
      });
    }

    if (!metadata) {
      throw new BadRequestException(
        httpMessages_EN.unit.updateUnit.status_4002,
      );
    }

    const unitData: any = await parseJson(UpdateVideoDTO, metadata);
    return this.unitService.updateUnit(id, unitData);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.unit.deleteUnit.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.unit.deleteUnit.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteUnit(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Return> {
    return this.unitService.deleteUnit(id);
  }
}
