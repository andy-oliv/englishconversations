import { Module } from '@nestjs/common';
import { SlideshowController } from './slideshow.controller';
import { SlideshowService } from './slideshow.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SlideshowController],
  providers: [SlideshowService],
})
export class SlideshowModule {}
