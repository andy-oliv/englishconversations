import { Module } from '@nestjs/common';
import { RecordedClassController } from './recorded-class.controller';
import { RecordedClassService } from './recorded-class.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [RecordedClassController],
  providers: [RecordedClassService],
})
export class RecordedClassModule {}
