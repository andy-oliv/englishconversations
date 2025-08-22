import { Module } from '@nestjs/common';
import { UserUnitController } from './user-unit.controller';
import { UserUnitService } from './user-unit.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserChapterModule } from 'src/user-chapter/user-chapter.module';
import { UserProgressModule } from 'src/user-progress/user-progress.module';

@Module({
  imports: [PrismaModule, UserChapterModule, UserProgressModule],
  controllers: [UserUnitController],
  providers: [UserUnitService],
  exports: [UserUnitService],
})
export class UserUnitModule {}
