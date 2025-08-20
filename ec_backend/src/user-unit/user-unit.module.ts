import { Module } from '@nestjs/common';
import { UserUnitController } from './user-unit.controller';
import { UserUnitService } from './user-unit.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserChapterModule } from 'src/user-chapter/user-chapter.module';

@Module({
  imports: [PrismaModule, UserChapterModule],
  controllers: [UserUnitController],
  providers: [UserUnitService],
  exports: [UserUnitService],
})
export class UserUnitModule {}
