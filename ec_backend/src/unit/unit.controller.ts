import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UnitService } from './unit.service';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import CreateUnitDTO from './dto/createUnit.dto';
import UpdateUnitDTO from './dto/updateUnit.dto';
import { RoleGuard } from '../auth/guards/role/role.guard';

@ApiTags('Units')
@Controller('api/units')
@UseGuards(RoleGuard)
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

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
  async createUnit(@Body() data: CreateUnitDTO): Promise<Return> {
    return this.unitService.createUnit(data);
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
  async updateUnit(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() data: UpdateUnitDTO,
  ): Promise<Return> {
    return this.unitService.updateUnit(id, data);
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
