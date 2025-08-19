import {
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
  UseGuards,
} from '@nestjs/common';
import { UserContentService } from './user-content.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthType } from 'src/common/decorators/authType.decorator';
import { UserRoles } from '@prisma/client';
import { SelfGuard } from 'src/auth/guards/self/self.guard';
import httpMessages_EN from 'src/helper/messages/httpMessages.en';
import validationMessages_EN from 'src/helper/messages/validationMessages.en';
import CreateUserContentDTO from './dto/CreateUserContent.dto';
import Return from 'src/common/types/Return';
import UpdateUserContentDTO from './dto/UpdateUserContent.dto';
import { RoleGuard } from 'src/auth/guards/role/role.guard';

@ApiTags('UserContent')
@Controller('api/user/contents')
export class UserContentController {
  constructor(private readonly userContentService: UserContentService) {}

  @Post()
  @AuthType(UserRoles.ADMIN, UserRoles.STUDENT)
  @UseGuards(SelfGuard)
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: httpMessages_EN.userContent.createUserContent.status_201,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example:
      validationMessages_EN.userContent.createUserContentDTO.userId.isNotEmpty,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async createUserContent(@Body() data: CreateUserContentDTO): Promise<Return> {
    return this.userContentService.createUserContent(data);
  }

  @Get('all')
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.userContent.fetchUserContents.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.userContent.fetchUserContents.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchUserContents(): Promise<Return> {
    return this.userContentService.fetchUserContents();
  }

  @Get()
  @AuthType(UserRoles.ADMIN, UserRoles.STUDENT)
  @UseGuards(SelfGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.userContent.fetchUserContentsByUser.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example:
      validationMessages_EN.userContent.createUserContentDTO.userId.isNotEmpty,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.userContent.fetchUserContentsByUser.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchUserContentsByUser(
    @Query('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<Return> {
    return this.userContentService.fetchUserContentsByUser(userId);
  }

  @Patch(':id')
  @AuthType(UserRoles.ADMIN, UserRoles.STUDENT)
  @UseGuards(SelfGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.userContent.updateUserContent.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example:
      validationMessages_EN.userContent.createUserContentDTO.userId.isNotEmpty,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.userContent.updateUserContent.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async updateUserContent(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updatedData: UpdateUserContentDTO,
  ): Promise<Return> {
    return this.userContentService.updateUserContent(id, updatedData);
  }

  @Delete(':id')
  @AuthType(UserRoles.ADMIN)
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.userContent.deleteUserContent.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (numeric string is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.userContent.deleteUserContent.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteUserContent(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Return> {
    return this.userContentService.deleteUserContent(id);
  }
}
