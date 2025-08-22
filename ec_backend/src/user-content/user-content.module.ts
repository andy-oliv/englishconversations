import { Module } from '@nestjs/common';
import { UserContentController } from './user-content.controller';
import { UserContentService } from './user-content.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserUnitModule } from 'src/user-unit/user-unit.module';
import { UserProgressModule } from 'src/user-progress/user-progress.module';

@Module({
  imports: [PrismaModule, UserUnitModule, UserProgressModule],
  controllers: [UserContentController],
  providers: [UserContentService],
})
export class UserContentModule {}
