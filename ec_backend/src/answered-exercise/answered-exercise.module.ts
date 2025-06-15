import { Module } from '@nestjs/common';
import { AnsweredExerciseController } from './answered-exercise.controller';
import { AnsweredExerciseService } from './answered-exercise.service';
import { PrismaModule } from '../prisma/prisma.module';
import { QuizModule } from '../quiz/quiz.module';
import { ExerciseModule } from '../exercise/exercise.module';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [PrismaModule, QuizModule, ExerciseModule, StudentModule],
  controllers: [AnsweredExerciseController],
  providers: [AnsweredExerciseService],
})
export class AnsweredExerciseModule {}
