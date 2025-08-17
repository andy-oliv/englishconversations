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
import { ContentService } from './content.service';
import Return from 'src/common/types/Return';
import CreateContentDTO from './dto/CreateContent.dto';
import { RoleGuard } from 'src/auth/guards/role/role.guard';
import { AuthType } from 'src/common/decorators/authType.decorator';
import httpMessages_EN from 'src/helper/messages/httpMessages.en';
import validationMessages_EN from 'src/helper/messages/validationMessages.en';
import { UserRoles } from '@prisma/client';

@ApiTags('Content')
@Controller('api/contents')
@AuthType(UserRoles.ADMIN)
@UseGuards(RoleGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Created',
    example: httpMessages_EN.content.createContent.status_201,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: validationMessages_EN.content.createContentDTO.contentType.isIn,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async createContent(@Body() contentData: CreateContentDTO): Promise<Return> {
    return this.contentService.createContent(contentData);
  }

  @Get('unit/:unitId')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.content.fetchContentsByUnit.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (numeric string is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: httpMessages_EN.content.fetchContentsByUnit.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchContentsByUnit(
    @Param('unitId', new ParseIntPipe()) unitId: number,
  ): Promise<Return> {
    return this.contentService.fetchContentsByUnit(unitId);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.content.fetchContents.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: httpMessages_EN.content.fetchContents.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchContents(): Promise<Return> {
    return this.contentService.fetchContents();
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.content.deleteContent.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (numeric string is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    example: httpMessages_EN.content.deleteContent.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteContent(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Return> {
    return this.contentService.deleteContent(id);
  }
}
