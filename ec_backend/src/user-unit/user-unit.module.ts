import { Module } from '@nestjs/common';
import { UserUnitController } from './user-unit.controller';
import { UserUnitService } from './user-unit.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserUnitController],
  providers: [UserUnitService],
})
export class UserUnitModule {}
