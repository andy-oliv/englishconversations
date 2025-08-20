import { Module } from '@nestjs/common';
import { UserContentController } from './user-content.controller';
import { UserContentService } from './user-content.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserUnitModule } from 'src/user-unit/user-unit.module';

@Module({
  imports: [PrismaModule, UserUnitModule],
  controllers: [UserContentController],
  providers: [UserContentService],
})
export class UserContentModule {}
