import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import Unit from '../common/types/Unit';
import httpMessages_EN from '../helper/messages/httpMessages.en';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';
import Return from '../common/types/Return';

@Injectable()
export class UnitService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async createUnit(data: Unit): Promise<Return> {
    try {
      const unit: Unit = await this.prismaService.unit.create({
        data,
      });

      return {
        message: httpMessages_EN.unit.createUnit.status_200,
        data: unit,
      };
    } catch (error) {
      handleInternalErrorException(
        loggerMessages.unit.createUnit.status_500,
        this.logger,
        error,
      );
    }
  }
}
