import { Module } from '@nestjs/common';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { PrismaModule } from '../prisma/prisma.module';
import { S3Module } from '../s3/s3.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [PrismaModule, S3Module, FileModule],
  controllers: [ChapterController],
  providers: [ChapterService],
})
export class ChapterModule {}
