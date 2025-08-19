import { Module } from '@nestjs/common';
import { UserContentController } from './user-content.controller';
import { UserContentService } from './user-content.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserContentController],
  providers: [UserContentService],
})
export class UserContentModule {}
