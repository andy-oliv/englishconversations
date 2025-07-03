import { Module } from '@nestjs/common';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';
import { PrismaModule } from '../prisma/prisma.module';
import { S3Module } from '../s3/s3.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [PrismaModule, S3Module, FileModule],
  controllers: [UnitController],
  providers: [UnitService],
})
export class UnitModule {}
