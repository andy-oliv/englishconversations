import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ExerciseModule } from '../exercise/exercise.module';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [PrismaModule, ExerciseModule, S3Module],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
