import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Return from '../common/types/Return';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import Material from '../entities/Material';
import CreateMaterialDTO from './dto/CreateMaterial.dto';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import UpdateMaterialDTO from './dto/UpdateMaterial.dto';

@Injectable()
export class MaterialService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async createMaterial(data: CreateMaterialDTO): Promise<Return> {
    try {
      const newMaterial: Material = await this.prismaService.material.create({
        data,
      });

      return {
        message: httpMessages_EN.material.createMaterial.status_201,
        data: newMaterial,
      };
    } catch (error) {
      handleInternalErrorException(
        'MaterialService',
        'createMaterial',
        loggerMessages.material.createMaterial.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchMaterials(): Promise<Return> {
    try {
      const materials: Material[] =
        await this.prismaService.material.findMany();

      if (materials.length === 0) {
        throw new NotFoundException(
          httpMessages_EN.material.fetchMaterials.status_404,
        );
      }

      return {
        message: httpMessages_EN.material.fetchMaterials.status_200,
        data: materials,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      handleInternalErrorException(
        'MaterialService',
        'fetchMaterials',
        loggerMessages.material.fetchMaterials.status_500,
        this.logger,
        error,
      );
    }
  }

  async fetchMaterial(id: string): Promise<Return> {
    try {
      const material: Material =
        await this.prismaService.material.findFirstOrThrow({
          where: {
            id,
          },
        });

      return {
        message: httpMessages_EN.material.fetchMaterial.status_200,
        data: material,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.material.fetchMaterial.status_404,
        );
      }

      handleInternalErrorException(
        'MaterialService',
        'fetchMaterial',
        loggerMessages.material.fetchMaterial.status_500,
        this.logger,
        error,
      );
    }
  }

  async updateMaterial(id: string, data: UpdateMaterialDTO): Promise<Return> {
    try {
      const material: Material = await this.prismaService.material.update({
        where: {
          id,
        },
        data,
      });

      return {
        message: httpMessages_EN.material.updateMaterial.status_200,
        data: material,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.material.updateMaterial.status_404,
        );
      }

      handleInternalErrorException(
        'MaterialService',
        'updateMaterial',
        loggerMessages.material.updateMaterial.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteMaterial(id: string): Promise<Return> {
    try {
      const material: Material = await this.prismaService.material.delete({
        where: {
          id,
        },
      });

      return {
        message: httpMessages_EN.material.deleteMaterial.status_200,
        data: material,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          httpMessages_EN.material.deleteMaterial.status_404,
        );
      }

      handleInternalErrorException(
        'MaterialService',
        'deleteMaterial',
        loggerMessages.material.deleteMaterial.status_500,
        this.logger,
        error,
      );
    }
  }
}
