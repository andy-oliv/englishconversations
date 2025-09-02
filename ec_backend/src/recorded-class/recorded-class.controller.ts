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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecordedClassService } from './recorded-class.service';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import CreateRecordedClassDTO from './dto/CreateRecordedClass.dto';
import Return from '../common/types/Return';
import UpdateRecordedClassDTO from './dto/UpdateRecordedClass.dto';
import { UserRoles } from '@prisma/client';
import { RoleGuard } from '../auth/guards/role/role.guard';
import { AuthType } from '../common/decorators/authType.decorator';
import { SelfGuard } from '../auth/guards/self/self.guard';

@ApiTags('RecordedClasses')
@Controller('api/classes/recordings')
export class RecordedClassController {
  constructor(private readonly recordedClassService: RecordedClassService) {}

  @Post()
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 201,
    description: 'Created',
    example: httpMessages_EN.recordedClass.createRecordedClass.status_201,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example:
      validationMessages_EN.recordedClass.createRecordedClassDTO.title
        .isNotEmpty,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async createRecordedClass(
    @Body()
    {
      title,
      subjectId,
      recordedAt,
      url,
      userIds,
      materialIds,
    }: CreateRecordedClassDTO,
  ): Promise<Return> {
    return this.recordedClassService.createRecordedClass(
      title,
      subjectId,
      recordedAt,
      url,
      userIds,
      materialIds,
    );
  }

  @Get(':id')
  @AuthType(UserRoles.ADMIN, UserRoles.STUDENT)
  @UseGuards(SelfGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.recordedClass.fetchRecordedClass.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.recordedClass.fetchRecordedClass.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchRecordedClass(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return this.recordedClassService.fetchRecordedClass(id);
  }

  @Get()
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.recordedClass.fetchRecordedClasses.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.recordedClass.fetchRecordedClasses.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchRecordedClasses(): Promise<Return> {
    return this.recordedClassService.fetchRecordedClasses();
  }

  @Patch(':id')
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.recordedClass.updateRecordedClass.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.recordedClass.updateRecordedClass.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async updateRecordedClass(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatedData: UpdateRecordedClassDTO,
  ): Promise<Return> {
    return this.recordedClassService.updateRecordedClass(id, updatedData);
  }

  @Delete(':id')
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.recordedClass.deleteRecordedClass.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.recordedClass.deleteRecordedClass.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteRecordedClass(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return this.recordedClassService.deleteRecordedClass(id);
  }
}
