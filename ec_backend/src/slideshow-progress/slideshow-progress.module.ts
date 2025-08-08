import { Module } from '@nestjs/common';
import { SlideshowProgressController } from './slideshow-progress.controller';
import { SlideshowProgressService } from './slideshow-progress.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SlideshowProgressController],
  providers: [SlideshowProgressService],
})
export class SlideshowProgressModule {}
