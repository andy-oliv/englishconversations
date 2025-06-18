import { Module } from '@nestjs/common';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaService],
  controllers: [ChapterController],
  providers: [ChapterService],
})
export class ChapterModule {}
