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
import { AuthType } from '../common/decorators/authType.decorator';
import { RoleGuard } from '../auth/guards/role/role.guard';
import { UserRoles } from '@prisma/client';
import { MaterialService } from './material.service';
import Return from '../common/types/Return';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import validationMessages_EN from '../helper/messages/validationMessages.en';
import CreateMaterialDTO from './dto/CreateMaterial.dto';
import UpdateMaterialDTO from './dto/UpdateMaterial.dto';

@ApiTags('Material')
@AuthType(UserRoles.ADMIN)
@UseGuards(RoleGuard)
@Controller('api/materials')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Created',
    example: httpMessages_EN.material.createMaterial.status_201,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: validationMessages_EN.material.createMaterialDTO.title.isNotEmpty,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async createMaterial(@Body() data: CreateMaterialDTO): Promise<Return> {
    return this.materialService.createMaterial(data);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.material.fetchMaterial.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.material.fetchMaterial.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchMaterial(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return this.materialService.fetchMaterial(id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.material.fetchMaterials.status_200,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.material.fetchMaterials.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async fetchMaterials(): Promise<Return> {
    return this.materialService.fetchMaterials();
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.material.updateMaterial.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.material.updateMaterial.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async updateMaterial(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatedData: UpdateMaterialDTO,
  ): Promise<Return> {
    return this.materialService.updateMaterial(id, updatedData);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
    example: httpMessages_EN.material.deleteMaterial.status_200,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    example: 'Validation failed (uuid is expected)',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    example: httpMessages_EN.material.deleteMaterial.status_404,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: httpMessages_EN.general.status_500,
  })
  async deleteMaterial(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Return> {
    return this.materialService.deleteMaterial(id);
  }
}
