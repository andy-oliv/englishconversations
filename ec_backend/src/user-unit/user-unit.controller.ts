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
} from '@nestjs/common';
import { UserUnitService } from './user-unit.service';
import Return from '../common/types/Return';
import GenerateUserUnitDTO from './dto/generateUserUnit.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import FetchUserUnitsByQueryDTO from './dto/fetchUserUnitsByQuery.dto';
import UpdateUserUnitDTO from './dto/updateUserUnit.dto';

@ApiTags('UserUnits')
@Controller('api/users/units')
export class UserUnitController {
  constructor(private readonly userUnitService: UserUnitService) {}

  @Post()
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
  async fetchUserUnitByQuery(
    @Query() { userId, unitId, status }: FetchUserUnitsByQueryDTO,
  ): Promise<Return> {
    return this.userUnitService.fetchUserUnitsByQuery(userId, unitId, status);
  }

  @Get('all')
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

  @Patch(':id')
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateUserUnitDTO,
  ): Promise<Return> {
    return this.userUnitService.updateUserUnit(id, data);
  }

  @Delete(':id')
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
