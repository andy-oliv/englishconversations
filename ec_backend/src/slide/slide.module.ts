import { Module } from '@nestjs/common';
import { SlideController } from './slide.controller';
import { SlideService } from './slide.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SlideController],
  providers: [SlideService],
})
export class SlideModule {}
