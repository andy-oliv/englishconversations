import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserUnitService } from './user-unit.service';
import Return from '../common/types/Return';
import GenerateUserUnitDTO from './dto/generateUserUnit.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import UpdateUserUnitDTO from './dto/updateUserUnit.dto';
import { SelfGuard } from '../auth/guards/self/self.guard';
import { RoleGuard } from '../auth/guards/role/role.guard';

@ApiTags('UserUnits')
@Controller('api/users/units')
export class UserUnitController {
  constructor(private readonly userUnitService: UserUnitService) {}

  @Post()
  @UseGuards(SelfGuard)
  @ApiResponse({
    status: 201,
    description: 'Success',
    example: httpMessages_EN.userUnit.generateUserUnit.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: validationMessages_EN.userUnit.generateUserUnitDTO.userId.isUUID,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.userUnit.generateUserUnit.status_404,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: httpMessages_EN.userUnit.throwIfUserUnitExists.status_409,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async generateUserUnit(@Body() data: GenerateUserUnitDTO): Promise<Return> {
    return this.userUnitService.generateUserUnit(data);
  }

  @Get('query')
  @UseGuards(SelfGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.userUnit.fetchUserUnitById.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.userUnit.fetchUserUnitById.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchUserUnitByQuery(@Query('userId') userId: string): Promise<Return> {
    return this.userUnitService.fetchUserUnitsByQuery(userId);
  }

  @Get('all')
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.userUnit.fetchUserUnits.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.userUnit.fetchUserUnits.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchUserUnits(): Promise<Return> {
    return this.userUnitService.fetchUserUnits();
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.userUnit.fetchUserUnitById.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchUserUnitById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return this.userUnitService.fetchUserUnitById(id);
  }

  @Patch('update')
  @UseGuards(SelfGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.userUnit.fetchUserUnitsByQuery.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.userUnit.fetchUserUnitsByQuery.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async updateUserUnit(
    @Query('id', new ParseUUIDPipe()) id: string,
    @Query('userId', new ParseUUIDPipe()) userId: string,
    @Body() data: UpdateUserUnitDTO,
  ): Promise<Return> {
    return this.userUnitService.updateUserUnit(id, userId, data);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.userUnit.deleteUserUnit.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.userUnit.deleteUserUnit.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteUserUnit(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return this.userUnitService.deleteUserUnit(id);
  }
}
