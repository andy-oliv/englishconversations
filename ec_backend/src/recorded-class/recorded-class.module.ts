import { Module } from '@nestjs/common';
import { RecordedClassController } from './recorded-class.controller';
import { RecordedClassService } from './recorded-class.service';

@Module({
  controllers: [RecordedClassController],
  providers: [RecordedClassService]
})
export class RecordedClassModule {}
