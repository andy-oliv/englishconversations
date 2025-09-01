import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthType } from '../common/decorators/authType.decorator';
import { UserRoles } from '@prisma/client';
import { RoleGuard } from '../auth/guards/role/role.guard';
import { SubjectService } from './subject.service';
import CreateSubjectDTO from './dto/CreateSubject.dto';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';

@ApiTags('Subjects')
@AuthType(UserRoles.ADMIN)
@UseGuards(RoleGuard)
@Controller('api/subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @ApiResponse({
    status: 201,
    description: 'Created',
    example: httpMessages_EN.subject.createSubject.status_201,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: validationMessages_EN.subject.createSubjectDTO.title.isNotEmpty,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  @Post()
  async createSubject(@Body() { title }: CreateSubjectDTO): Promise<Return> {
    return this.subjectService.createSubject(title);
  }

  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.subject.fetchSubjects.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.subject.fetchSubjects.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  @Get()
  async fetchSubjects(): Promise<Return> {
    return this.subjectService.fetchSubjects();
  }

  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.subject.deleteSubject.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (numeric string is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.subject.deleteSubject.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  @Delete(':subjectId')
  async deleteSubject(
    @Param('subjectId', new ParseIntPipe()) subjectId: number,
  ): Promise<Return> {
    return this.subjectService.deleteSubject(subjectId);
  }
}
