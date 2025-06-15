import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ExerciseModule } from '../exercise/exercise.module';

@Module({
  imports: [PrismaModule, ExerciseModule],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
