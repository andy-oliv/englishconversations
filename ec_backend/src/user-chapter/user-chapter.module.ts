import { Module } from '@nestjs/common';
import { UserChapterController } from './user-chapter.controller';
import { UserChapterService } from './user-chapter.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserProgressModule } from 'src/user-progress/user-progress.module';

@Module({
  imports: [PrismaModule, UserProgressModule],
  controllers: [UserChapterController],
  providers: [UserChapterService],
  exports: [UserChapterService],
})
export class UserChapterModule {}
