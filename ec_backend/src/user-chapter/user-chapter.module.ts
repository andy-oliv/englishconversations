import { Module } from '@nestjs/common';
import { UserChapterController } from './user-chapter.controller';
import { UserChapterService } from './user-chapter.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserChapterController],
  providers: [UserChapterService],
  exports: [UserChapterService],
})
export class UserChapterModule {}
