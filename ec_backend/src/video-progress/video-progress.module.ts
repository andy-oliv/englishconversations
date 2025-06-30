import { Module } from '@nestjs/common';
import { VideoProgressController } from './video-progress.controller';
import { VideoProgressService } from './video-progress.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VideoProgressController],
  providers: [VideoProgressService],
})
export class VideoProgressModule {}
