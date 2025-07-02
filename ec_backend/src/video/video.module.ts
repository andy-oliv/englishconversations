import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FileModule } from '../file/file.module';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [PrismaModule, S3Module, FileModule],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
